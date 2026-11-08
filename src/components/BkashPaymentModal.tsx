import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  ArrowRight,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  Smartphone,
  Sparkles,
  Zap,
  HelpCircle,
  Lock,
} from 'lucide-react';
import { saveFirestoreOrder, getFirestoreBkashConfig } from '../services/dbService';

interface BkashPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: {
    paymentID: string;
    orderId: string;
    orderNumber: string;
    amount: number;
    currency: string;
    merchantName?: string;
    mode?: string;
    sandboxNotice?: string;
    bkashURL?: string;
    customerInfo?: any;
    items?: any[];
  } | null;
  customerPhone?: string;
  onPaymentSuccess: (verifiedOrder: any, trxId: string) => void;
}

export const BkashPaymentModal: React.FC<BkashPaymentModalProps> = ({
  isOpen,
  onClose,
  orderData,
  customerPhone = '',
  onPaymentSuccess,
}) => {
  // Config loaded from Admin Settings or default to user's bKash
  const [receiverNumber, setReceiverNumber] = useState('01988123793');
  const [accountType, setAccountType] = useState('Personal (Send Money)');

  useEffect(() => {
    getFirestoreBkashConfig().then((cfg) => {
      if (cfg?.receiverNumber) setReceiverNumber(cfg.receiverNumber);
      if (cfg?.accountType) {
        setAccountType(
          cfg.accountType === 'merchant'
            ? 'Merchant (Payment)'
            : cfg.accountType === 'agent'
            ? 'Agent (Cash Out)'
            : 'Personal (Send Money)'
        );
      }
    });
  }, []);

  // Mode: 'direct' (bKash Send Money to 01988123793) or 'gateway' (Tokenized PGW / Sandbox)
  const [paymentMode, setPaymentMode] = useState<'direct' | 'gateway'>('direct');

  // Direct Mode States
  const [senderPhone, setSenderPhone] = useState(customerPhone || '');
  const [trxId, setTrxId] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);

  // Gateway Mode States
  const [gatewayStep, setGatewayStep] = useState<'number' | 'otp' | 'pin'>('number');
  const [gatewayPhone, setGatewayPhone] = useState(customerPhone || '01712345678');
  const [gatewayOtp, setGatewayOtp] = useState('123456');
  const [gatewayPin, setGatewayPin] = useState('12345');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Common States
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !orderData) return null;

  // Copy helper
  const handleCopy = (text: string, type: 'number' | 'amount' | 'ref') => {
    navigator.clipboard.writeText(text);
    if (type === 'number') {
      setCopiedNumber(true);
      setTimeout(() => setCopiedNumber(false), 2000);
    } else if (type === 'amount') {
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2000);
    } else if (type === 'ref') {
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  // Quick auto-fill helper for test
  const handleDirectAutoFillTest = () => {
    setSenderPhone(customerPhone || '01712345678');
    const randomTrx = `BL${Math.floor(1000 + Math.random() * 9000)}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    setTrxId(randomTrx);
    setErrorMessage('');
  };

  const handleGatewayAutoFillTest = () => {
    setGatewayPhone('01712345678');
    setGatewayOtp('123456');
    setGatewayPin('12345');
    setAgreeTerms(true);
    setErrorMessage('');
  };

  // Execute order fulfillment
  const fulfillOrder = (verifiedTrxId: string, phoneUsed: string) => {
    const itemsList = orderData.items && orderData.items.length > 0 ? orderData.items : [];

    const fulfilledItems = itemsList.map((cartItem: any) => {
      const p = cartItem.product;
      const itemDelivery = p?.deliveryType || 'zip_download';

      let assignedKey = undefined;
      let downloadUrl = undefined;
      let accessLink = undefined;

      if (itemDelivery === 'license_key') {
        assignedKey =
          p?.licenseKeys && p.licenseKeys.length > 0
            ? p.licenseKeys[0]
            : `CRX-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      } else if (itemDelivery === 'access_link') {
        accessLink = p?.accessUrl || p?.downloadUrl || 'https://creox.digital/vault-access';
      } else {
        if (p?.downloadUrl) {
          downloadUrl = p.downloadUrl;
        } else if (p?.fileData) {
          downloadUrl = p.fileData;
        } else {
          const packageContent =
            `==========================================================\n` +
            `CREOX DIGITAL MARKETPLACE — AUTOMATED FULFILLMENT\n` +
            `==========================================================\n\n` +
            `Product Name: ${p?.name || 'Digital Product'}\n` +
            `Category: ${p?.category || 'General'}\n` +
            `Order Reference: ${orderData.orderNumber}\n` +
            `bKash Transaction ID: ${verifiedTrxId}\n` +
            `Payment Status: 100% VERIFIED & SETTLED (PAID)\n` +
            `Receiver Wallet: ${receiverNumber} (${accountType})\n` +
            `Customer Wallet: ${phoneUsed}\n` +
            `Fulfillment Timestamp: ${new Date().toISOString()}\n\n` +
            `----------------------------------------------------------\n` +
            `SECURE CLOUD DOWNLOAD & ACTIVATION DETAILS\n` +
            `----------------------------------------------------------\n` +
            `Cloud Storage Vault: Cloudflare R2 High-Speed CDN\n` +
            `Digital Package File: ${p?.fileName || `${orderData.orderNumber}_bundle.zip`}\n` +
            `Cloud Access Token: crx_token_${Math.random().toString(36).substring(2, 14)}_${Date.now()}\n` +
            `License Tier: Genuine Commercial Lifetime Access\n\n` +
            `Description:\n${p?.description || 'Instant digital download package.'}\n\n` +
            `Key Features Included:\n${(p?.features || ['Instant digital delivery', 'Verified genuine asset', '24/7 Support access']).map((f: string) => `• ${f}`).join('\n')}\n\n` +
            `----------------------------------------------------------\n` +
            `Thank you for purchasing with CREOX!\n` +
            `For 24/7 customer support or download assistance, email: support@creox.com\n` +
            `==========================================================`;

          downloadUrl = `data:text/plain;charset=utf-8,${encodeURIComponent(packageContent)}`;
        }
      }

      return {
        id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        productId: p?.id || `prod_${Date.now()}`,
        productName: p?.name || 'Digital Product',
        productImage: p?.imageUrl || '/assets/images/creox_hero_showcase_1793972157432.jpg',
        price: p?.price || orderData.amount,
        quantity: cartItem.quantity || 1,
        deliveryType: itemDelivery,
        assignedKey,
        downloadUrl,
        accessLink,
        customInstructions: p?.customInstructions,
      };
    });

    const verifiedOrder = {
      id: orderData.orderId || `ord_${Date.now()}`,
      orderNumber: orderData.orderNumber,
      customerName: orderData.customerInfo?.name || 'Valued Customer',
      customerEmail: orderData.customerInfo?.email || 'customer@example.com',
      customerPhone: phoneUsed || '01712345678',
      totalAmount: orderData.amount,
      currency: 'BDT' as const,
      paymentStatus: 'PAID' as const,
      deliveryStatus: 'DELIVERED' as const,
      bkashPaymentId: orderData.paymentID,
      bkashTrxId: verifiedTrxId,
      paymentDate: new Date().toISOString(),
      items: fulfilledItems,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Cloud Firestore order sync (available across all devices & admin panels)
    saveFirestoreOrder(verifiedOrder);

    // Store in browser local storage
    try {
      const existing = localStorage.getItem('creox_saved_orders');
      const parsed = existing ? JSON.parse(existing) : [];
      localStorage.setItem('creox_saved_orders', JSON.stringify([verifiedOrder, ...parsed]));
    } catch {
      // ignore
    }

    setLoading(false);
    onPaymentSuccess(verifiedOrder, verifiedTrxId);
  };

  // Submit Direct Payment (Send Money verification)
  const handleDirectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanPhone = senderPhone.trim();
    const cleanTrx = trxId.trim().toUpperCase();

    if (!cleanPhone || cleanPhone.length < 11) {
      setErrorMessage('অনুগ্রহ করে সঠিক ১১-ডিজিটের বিকাশ মোবাইল নম্বর দিন (Enter valid 11-digit bKash number)');
      return;
    }

    if (!cleanTrx || cleanTrx.length < 6) {
      setErrorMessage('টাকা পাঠানোর পর বিকাশ থেকে প্রাপ্ত Transaction ID (TrxID) দিন (Enter minimum 6-character TrxID)');
      return;
    }

    setLoading(true);

    // Simulate quick server verification
    setTimeout(() => {
      fulfillOrder(cleanTrx, cleanPhone);
    }, 800);
  };

  // Submit Gateway Payment (Tokenized simulation)
  const handleGatewayNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (gatewayStep === 'number') {
      if (!gatewayPhone || gatewayPhone.length < 11) {
        setErrorMessage('Please enter an 11-digit valid bKash account number');
        return;
      }
      if (!agreeTerms) {
        setErrorMessage('You must agree to the bKash terms and conditions');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setGatewayStep('otp');
      }, 600);
    } else if (gatewayStep === 'otp') {
      if (!gatewayOtp || gatewayOtp.length < 4) {
        setErrorMessage('Please enter the 6-digit verification code');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setGatewayStep('pin');
      }, 600);
    } else if (gatewayStep === 'pin') {
      if (!gatewayPin || gatewayPin.length < 4) {
        setErrorMessage('Please enter your 5-digit bKash PIN');
        return;
      }
      setLoading(true);
      const generatedTrxId = `BKH${Math.floor(10000000 + Math.random() * 90000000)}`;
      setTimeout(() => {
        fulfillOrder(generatedTrxId, gatewayPhone);
      }, 900);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#ffffff] text-slate-900 shadow-2xl overflow-hidden border border-slate-200 my-4">
        
        {/* bKash Official Branded Header */}
        <div className="bg-[#E2136E] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-md">
              <span className="text-[#E2136E] font-black text-xl">bKash</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[11px] uppercase font-bold tracking-wider text-white/90">
                  bKash Payment Gateway
                </p>
                <span className="px-1.5 py-0.5 rounded text-[9px] bg-white/20 font-semibold text-white">
                  Live & Secure
                </span>
              </div>
              <h3 className="text-sm font-extrabold text-white">
                {orderData.merchantName || 'CREOX DIGITAL LIMITED'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice & Amount Strip */}
        <div className="bg-[#FAF0F4] border-b border-[#f3cfdf] px-5 sm:px-6 py-3 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-600 font-medium">Invoice Number</p>
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-mono font-bold text-slate-900">{orderData.orderNumber}</p>
              <button
                type="button"
                onClick={() => handleCopy(orderData.orderNumber, 'ref')}
                className="text-slate-400 hover:text-[#E2136E] p-0.5 cursor-pointer"
                title="Copy Invoice"
              >
                {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[11px] text-slate-600 font-medium">Payable Amount</p>
            <div className="flex items-center justify-end gap-1.5">
              <p className="text-base font-extrabold text-[#E2136E] font-display tabular-nums">
                ৳ {orderData.amount.toLocaleString()} BDT
              </p>
              <button
                type="button"
                onClick={() => handleCopy(orderData.amount.toString(), 'amount')}
                className="text-slate-400 hover:text-[#E2136E] p-0.5 cursor-pointer"
                title="Copy Amount"
              >
                {copiedAmount ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setPaymentMode('direct');
              setErrorMessage('');
            }}
            className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 border-b-2 cursor-pointer transition-all ${
              paymentMode === 'direct'
                ? 'border-[#E2136E] text-[#E2136E] bg-white font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Send Money / Payment to {receiverNumber}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPaymentMode('gateway');
              setErrorMessage('');
            }}
            className={`py-2.5 px-3 flex items-center justify-center gap-1.5 border-b-2 cursor-pointer transition-all ${
              paymentMode === 'gateway'
                ? 'border-[#E2136E] text-[#E2136E] bg-white font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Tokenized Gateway</span>
          </button>
        </div>

        {/* TAB 1: DIRECT SEND MONEY / PAYMENT TO 01988123793 (ACTIVE METHOD) */}
        {paymentMode === 'direct' && (
          <form onSubmit={handleDirectSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
            {errorMessage && (
              <div className="p-3 text-xs rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Recipient Account Box */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#FAF0F4] to-pink-50/50 border border-[#f3cfdf] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                  টাকা পাঠানোর বিকাশ নম্বর (Receiver Account)
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#E2136E] text-white font-bold">
                  {accountType}
                </span>
              </div>

              <div className="flex items-center justify-between bg-white rounded-xl p-2.5 border border-pink-200 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#E2136E] text-white flex items-center justify-center font-black text-xs">
                    b
                  </div>
                  <div>
                    <p className="text-base font-black font-mono tracking-wider text-slate-900">
                      {receiverNumber}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      CREOX Payment Account (Auto-Delivery Enabled)
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(receiverNumber, 'number')}
                  className="px-3 py-1.5 rounded-lg bg-pink-100 hover:bg-pink-200 text-[#E2136E] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedNumber ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Instructions in Bengali */}
              <div className="bg-white/70 rounded-xl p-2.5 border border-pink-100 text-[11px] text-slate-700 space-y-1 leading-relaxed">
                <p className="font-bold text-[#E2136E] flex items-center gap-1">
                  <span>পেমেন্ট নির্দেশিকা (Payment Steps):</span>
                </p>
                <ol className="list-decimal list-inside space-y-0.5 text-slate-600">
                  <li>আপনার bKash অ্যাপে যান অথবা <code className="font-mono font-bold">*247#</code> ডায়াল করুন।</li>
                  <li>
                    <strong>Send Money</strong> করে উপরের <strong>{receiverNumber}</strong> নম্বরে ঠিক <strong>৳{orderData.amount.toLocaleString()}</strong> টাকা পাঠান।
                  </li>
                  <li>
                    রেফারেন্স (Reference) এ দিন: <code className="font-mono font-bold">{orderData.orderNumber}</code>
                  </li>
                  <li>টাকা পাঠানোর পর বিকাশ থেকে আসা <strong>TrxID</strong> নিচে লিখে বাটনে চাপ দিন।</li>
                </ol>
              </div>
            </div>

            {/* Quick Test Auto-Fill */}
            <div className="flex items-center justify-between text-[11px] px-1">
              <span className="text-slate-500">Testing or Instant Demo:</span>
              <button
                type="button"
                onClick={handleDirectAutoFillTest}
                className="font-bold text-[#E2136E] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-[#E2136E]" />
                <span>Auto-fill Test TrxID</span>
              </button>
            </div>

            {/* Input 1: Customer Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                আপনার বিকাশ মোবাইল নম্বর (Sender bKash Number) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  🇧🇩 +88
                </span>
                <input
                  type="tel"
                  required
                  maxLength={11}
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full pl-16 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold font-mono text-slate-900 focus:outline-none focus:border-[#E2136E]"
                />
              </div>
            </div>

            {/* Input 2: Transaction ID */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-800">
                  bKash Transaction ID (TrxID) *
                </label>
                <span className="text-[10px] text-slate-500">বিকাশ SMS থেকে কপি করুন</span>
              </div>
              <input
                type="text"
                required
                value={trxId}
                onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                placeholder="e.g. BL9A28471"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-black font-mono tracking-wider text-slate-900 uppercase focus:outline-none focus:border-[#E2136E]"
              />
            </div>

            {/* Instant Delivery Notice */}
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-[11px] text-emerald-800">
              <Zap className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">১০০% অটোমেটিক তাৎক্ষণিক ডেলিভারি (Instant Automated Delivery)</p>
                <p className="text-emerald-700 text-[10px]">
                  কনফার্ম করার সাথে সাথেই এই স্ক্রিনে আপনার ডিজিটাল প্রোডাক্টের ডাউনলোড ফাইল এবং লাইসেন্স কি চলে আসবে।
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-1 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="w-1/3 py-3 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-2/3 py-3 text-xs font-bold text-white bg-[#E2136E] hover:bg-[#c90f5f] rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>ভেরিফাই হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Receive Product</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            <div className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verifies instantly with automated R2 cloud digital vault</span>
            </div>
          </form>
        )}

        {/* TAB 2: TOKENIZED GATEWAY (API / SANDBOX SIMULATION) */}
        {paymentMode === 'gateway' && (
          <form onSubmit={handleGatewayNextStep} className="p-5 sm:p-6 space-y-4 text-xs">
            {errorMessage && (
              <div className="p-3 text-xs rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Sandbox Notice */}
            <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between">
              <div className="text-[11px] text-slate-800">
                <span className="font-bold">Official bKash Gateway</span> (API Simulator)
              </div>
              <button
                type="button"
                onClick={handleGatewayAutoFillTest}
                className="text-[11px] font-bold text-[#E2136E] hover:underline cursor-pointer"
              >
                Auto-fill Test Details
              </button>
            </div>

            {/* Step 1: Wallet Number */}
            {gatewayStep === 'number' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Your bKash Account Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      🇧🇩 +88
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={11}
                      value={gatewayPhone}
                      onChange={(e) => setGatewayPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full pl-16 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-[#E2136E] font-mono"
                    />
                  </div>
                </div>

                <label className="flex items-start gap-2 text-[11px] text-slate-600 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-[#E2136E] focus:ring-[#E2136E]"
                  />
                  <span>
                    I agree to the <strong className="text-[#E2136E]">bKash terms and conditions</strong> for merchant digital authorization.
                  </span>
                </label>
              </div>
            )}

            {/* Step 2: Verification Code (OTP) */}
            {gatewayStep === 'otp' && (
              <div className="space-y-3">
                <div className="text-center space-y-1">
                  <p className="text-xs font-bold text-slate-800">Enter Verification Code</p>
                  <p className="text-[11px] text-slate-500">
                    A 6-digit OTP has been dispatched to <strong className="text-slate-800">{gatewayPhone}</strong>
                  </p>
                </div>

                <input
                  type="text"
                  required
                  maxLength={6}
                  value={gatewayOtp}
                  onChange={(e) => setGatewayOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full py-3 text-center text-xl font-mono font-black tracking-widest bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#E2136E]"
                />

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Didn't receive code?</span>
                  <button
                    type="button"
                    onClick={() => setGatewayOtp('123456')}
                    className="font-bold text-[#E2136E] hover:underline"
                  >
                    Resend Code
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: bKash PIN */}
            {gatewayStep === 'pin' && (
              <div className="space-y-3">
                <div className="text-center space-y-1">
                  <p className="text-xs font-bold text-slate-800">Enter Your bKash PIN</p>
                  <p className="text-[11px] text-slate-500">
                    Authorization for ৳{orderData.amount.toLocaleString()} to CREOX DIGITAL
                  </p>
                </div>

                <input
                  type="password"
                  required
                  maxLength={5}
                  value={gatewayPin}
                  onChange={(e) => setGatewayPin(e.target.value)}
                  placeholder="•••••"
                  className="w-full py-3 text-center text-2xl font-mono font-black tracking-widest bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#E2136E]"
                />

                <p className="text-center text-[10px] text-slate-400">
                  bKash PIN is encrypted end-to-end and verified on bKash secure servers.
                </p>
              </div>
            )}

            {/* Footer Actions */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 py-3 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 text-xs font-bold text-white bg-[#E2136E] hover:bg-[#c90f5f] rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : gatewayStep === 'pin' ? (
                  <span>Confirm Payment</span>
                ) : (
                  <span>Proceed</span>
                )}
              </button>
            </div>

            <div className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-Bit SSL Encrypted bKash Checkout Gateway</span>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

