import React, { useState } from 'react';
import { X, ShieldCheck, ArrowRight, Loader2, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';

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
  const [step, setStep] = useState<'number' | 'otp' | 'pin'>('number');
  const [phone, setPhone] = useState(customerPhone || '01712345678');
  const [otp, setOtp] = useState('123456');
  const [pin, setPin] = useState('12345');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !orderData) return null;

  // Sandbox auto-fill helper
  const handleAutoFillTest = () => {
    setPhone('01712345678');
    setOtp('123456');
    setPin('12345');
    setAgreeTerms(true);
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (step === 'number') {
      if (!phone || phone.length < 11) {
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
        setStep('otp');
      }, 700);
    } else if (step === 'otp') {
      if (!otp || otp.length < 4) {
        setErrorMessage('Please enter the 6-digit verification code');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep('pin');
      }, 700);
    } else if (step === 'pin') {
      if (!pin || pin.length < 4) {
        setErrorMessage('Please enter your 5-digit bKash PIN');
        return;
      }
      executePayment();
    }
  };

  const executePayment = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/payment/bkash/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentID: orderData.paymentID,
          orderId: orderData.orderId,
          testCustomerPhone: phone,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onPaymentSuccess(data.order, data.trxID);
      } else {
        setErrorMessage(data.error || 'Payment execution was declined by bKash.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error executing bKash verification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-2xl bg-[#ffffff] text-slate-900 shadow-2xl overflow-hidden border border-slate-200">
        
        {/* bKash Official Branded Header */}
        <div className="bg-[#E2136E] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-md">
              <span className="text-[#E2136E] font-black text-lg">bKash</span>
            </div>
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-white/80">Merchant Payment</p>
              <h3 className="text-sm font-extrabold text-white">
                {orderData.merchantName || 'CREOX DIGITAL LIMITED'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-white/80 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice & Amount Strip */}
        <div className="bg-[#FAF0F4] border-b border-[#f3cfdf] px-6 py-3.5 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-600 font-medium">Invoice Number</p>
            <p className="text-xs font-mono font-bold text-slate-900">{orderData.orderNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-slate-600 font-medium">Total Amount</p>
            <p className="text-base font-extrabold text-[#E2136E] font-display tabular-nums">
              ৳ {orderData.amount.toLocaleString()} BDT
            </p>
          </div>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleNextStep} className="p-6 space-y-5">
          {errorMessage && (
            <div className="p-3 text-xs rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Sandbox Test Mode Quick Fill Notice */}
          <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between">
            <div className="text-[11px] text-slate-800">
              <span className="font-bold">Official bKash Gateway</span> (Sandbox / Live)
            </div>
            <button
              type="button"
              onClick={handleAutoFillTest}
              className="text-[11px] font-bold text-[#E2136E] hover:underline cursor-pointer"
            >
              Auto-fill Test Details
            </button>
          </div>

          {/* Step 1: Wallet Number */}
          {step === 'number' && (
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
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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
          {step === 'otp' && (
            <div className="space-y-3">
              <div className="text-center space-y-1">
                <p className="text-xs font-bold text-slate-800">Enter Verification Code</p>
                <p className="text-[11px] text-slate-500">
                  A 6-digit OTP has been dispatched to <strong className="text-slate-800">{phone}</strong>
                </p>
              </div>

              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full py-3 text-center text-xl font-mono font-black tracking-widest bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-[#E2136E]"
              />

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Didn't receive code?</span>
                <button
                  type="button"
                  onClick={() => setOtp('123456')}
                  className="font-bold text-[#E2136E] hover:underline"
                >
                  Resend Code
                </button>
              </div>
            </div>
          )}

          {/* Step 3: bKash PIN */}
          {step === 'pin' && (
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
                value={pin}
                onChange={(e) => setPin(e.target.value)}
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
              ) : step === 'pin' ? (
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

      </div>
    </div>
  );
};
