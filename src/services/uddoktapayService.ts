import { createClient } from '@supabase/supabase-js';

// Configuration helper
export function getUddoktaPayConfig() {
  const apiKey = process.env.UDDOKTAPAY_API_KEY || 'LwiE40GPuahZ2QLqMmKhiasg55P4SxC72brPj7Ve';
  const rawBaseUrl = process.env.UDDOKTAPAY_BASE_URL || 'https://creox.paymently.io/api';
  
  // Normalize base URL so it cleanly ends with /api
  const trimmed = rawBaseUrl.replace(/\/+$/, '');
  const apiBaseUrl = trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;

  return {
    apiKey,
    apiBaseUrl,
    isConfigured: Boolean(apiKey && !apiKey.includes('your_')),
  };
}

export interface CreateChargeParams {
  fullName: string;
  email: string;
  amount: number;
  customerPhone?: string;
  orderId: string;
  orderNumber: string;
  appUrl: string;
}

export interface CreateChargeResult {
  success: boolean;
  paymentUrl?: string;
  invoiceId?: string;
  error?: string;
  raw?: any;
}

/**
 * 1. Create Charge API (Official UddoktaPay checkout-v2)
 * Doc: https://docs.uddoktapay.com/
 */
export async function createUddoktaPayCharge(params: CreateChargeParams): Promise<CreateChargeResult> {
  const { apiKey, apiBaseUrl } = getUddoktaPayConfig();

  if (!apiKey) {
    return { success: false, error: 'UddoktaPay API key is not configured' };
  }

  const endpoint = `${apiBaseUrl}/checkout-v2`;
  const cleanAppUrl = params.appUrl.replace(/\/+$/, '');

  const payload = {
    full_name: params.fullName || 'Valued Customer',
    email: params.email,
    amount: params.amount.toString(),
    metadata: {
      order_id: params.orderId,
      order_number: params.orderNumber,
      customer_phone: params.customerPhone || '',
    },
    redirect_url: `${cleanAppUrl}/?order_id=${params.orderId}`,
    cancel_url: `${cleanAppUrl}/?payment_status=cancelled&order_id=${params.orderId}`,
    webhook_url: `${cleanAppUrl}/api/payment/uddoktapay/webhook`,
    return_type: 'GET',
  };

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'RT-UDDOKTAPAY-API-KEY': apiKey,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data) {
      const errMsg = data?.message || `UddoktaPay API responded with status ${res.status}`;
      console.error('[UddoktaPay Create Charge Error]', res.status, data);
      return { success: false, error: errMsg, raw: data };
    }

    // Official UddoktaPay returns { status: true, payment_url: "...", invoice_id: "..." }
    const paymentUrl = data.payment_url || data.url;
    const invoiceId = data.invoice_id || data.invoiceId;

    if (!paymentUrl) {
      return { success: false, error: data.message || 'Payment URL not received from UddoktaPay', raw: data };
    }

    return {
      success: true,
      paymentUrl,
      invoiceId,
      raw: data,
    };
  } catch (err: any) {
    console.error('[UddoktaPay Network Error]', err);
    return { success: false, error: err.message || 'Network error communicating with UddoktaPay' };
  }
}

export interface VerifyPaymentResult {
  success: boolean;
  status?: 'COMPLETED' | 'PENDING' | 'ERROR' | string;
  transactionId?: string;
  paymentMethod?: string;
  senderNumber?: string;
  amount?: string;
  invoiceId?: string;
  metadata?: any;
  error?: string;
  raw?: any;
}

/**
 * 2. Verify Payment API (Official UddoktaPay verify-payment)
 * Doc: https://docs.uddoktapay.com/
 */
export async function verifyUddoktaPayPayment(invoiceId: string): Promise<VerifyPaymentResult> {
  const { apiKey, apiBaseUrl } = getUddoktaPayConfig();

  if (!apiKey) {
    return { success: false, error: 'UddoktaPay API key is not configured' };
  }

  if (!invoiceId) {
    return { success: false, error: 'invoice_id is required for verification' };
  }

  const endpoint = `${apiBaseUrl}/verify-payment`;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'RT-UDDOKTAPAY-API-KEY': apiKey,
      },
      body: JSON.stringify({ invoice_id: invoiceId }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data) {
      const errMsg = data?.message || `UddoktaPay verification responded with status ${res.status}`;
      return { success: false, error: errMsg, raw: data };
    }

    const status = (data.status || '').toUpperCase();
    const isCompleted = status === 'COMPLETED';

    return {
      success: isCompleted,
      status,
      transactionId: data.transaction_id || data.trx_id || invoiceId,
      paymentMethod: data.payment_method || 'bKash/Nagad',
      senderNumber: data.sender_number || '',
      amount: data.amount || data.charged_amount || '',
      invoiceId: data.invoice_id || invoiceId,
      metadata: data.metadata || {},
      raw: data,
    };
  } catch (err: any) {
    console.error('[UddoktaPay Verify Network Error]', err);
    return { success: false, error: err.message || 'Failed to verify transaction with UddoktaPay' };
  }
}

/**
 * 3. Validate Webhook Header (RT-UDDOKTAPAY-API-KEY)
 */
export function validateUddoktaPayWebhook(headerApiKey: string | undefined): boolean {
  const { apiKey } = getUddoktaPayConfig();
  if (!apiKey || !headerApiKey) return false;
  return headerApiKey.trim() === apiKey.trim();
}

/**
 * 4. Sync Order to Supabase (if configured)
 */
export async function syncOrderToSupabase(order: any): Promise<void> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  if (!supabaseUrl || !supabaseServiceKey || supabaseUrl.includes('your-project')) {
    return;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { error } = await supabase.from('orders').upsert({
      order_number: order.orderNumber,
      customer_name: order.customerName,
      customer_email: order.customerEmail,
      customer_phone: order.customerPhone,
      total_amount: order.totalAmount,
      currency: order.currency || 'BDT',
      payment_status: order.paymentStatus,
      delivery_status: order.deliveryStatus,
      bkash_payment_id: order.uddoktapayInvoiceId || order.bkashPaymentId || null,
      bkash_trx_id: order.transactionId || order.bkashTrxId || null,
      payment_date: order.paymentDate || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'order_number' });

    if (error) {
      console.warn('[Supabase Order Sync Warning]', error.message);
    } else {
      console.log(`[Supabase] Successfully synchronized order ${order.orderNumber}`);
    }
  } catch (err) {
    console.warn('[Supabase Sync Exception]', err);
  }
}
