import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, ShieldCheck, Lock, ArrowRight, Zap, CheckCircle2, CreditCard, Sparkles, Loader2 } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onProceedToUddoktaPay: (customerInfo: { name: string; email: string; phone: string }) => void;
  onProceedToBkash: (customerInfo: { name: string; email: string; phone: string }) => void;
  isProcessingPayment?: boolean;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  onProceedToUddoktaPay,
  onProceedToBkash,
  isProcessingPayment = false,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedGateway, setSelectedGateway] = useState<'uddoktapay' | 'bkash'>('uddoktapay');

  if (!isOpen) return null;

  const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address for digital delivery');
      return;
    }
    if (!phone.trim() || phone.length < 11) {
      setErrorMessage('Please enter a valid 11-digit Bangladeshi mobile number (e.g., 01700000000)');
      return;
    }

    setErrorMessage('');
    const customer = { name: name.trim(), email: email.trim(), phone: phone.trim() };

    if (selectedGateway === 'uddoktapay') {
      onProceedToUddoktaPay(customer);
    } else {
      onProceedToBkash(customer);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#080d1a] border border-white/10 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] bg-[#0d1527] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400" />
            <h2 className="text-base font-bold text-white">Digital Checkout</h2>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-cyan-300 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              Automated Instant Delivery
            </span>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessingPayment}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          {errorMessage && (
            <div className="p-3 text-xs rounded-xl bg-red-950/40 border border-red-500/30 text-red-200">
              {errorMessage}
            </div>
          )}

          {/* Customer Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-bold">1</span>
              Delivery & Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Shakib Al Hasan"
                  className="w-full bg-[#0b1323] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Email Address (Product Delivery Target) *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. user@gmail.com"
                  className="w-full bg-[#0b1323] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Contact Mobile Number *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full bg-[#0b1323] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Your digital product keys, Cloudflare R2 download tokens, and invoice will be delivered on-screen and to this email.
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3 pt-3 border-t border-white/[0.08]">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-bold">2</span>
              Select Payment Method
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option A: UddoktaPay Gateway */}
              <div
                onClick={() => setSelectedGateway('uddoktapay')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                  selectedGateway === 'uddoktapay'
                    ? 'bg-cyan-950/30 border-cyan-400/80 ring-1 ring-cyan-400/50 shadow-lg shadow-cyan-950/50'
                    : 'bg-[#0b1323] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">UddoktaPay</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">
                          Auto Delivery
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        bKash, Nagad, Rocket, Upay & Cards
                      </span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="paymentGateway"
                    checked={selectedGateway === 'uddoktapay'}
                    onChange={() => setSelectedGateway('uddoktapay')}
                    className="accent-cyan-400 mt-1"
                  />
                </div>

                <div className="mt-3 pt-2 border-t border-white/5 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#E2136E]/20 text-pink-300 font-bold border border-[#E2136E]/30">bKash</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300 font-bold border border-orange-500/30">Nagad</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">Rocket</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">Visa / MC</span>
                </div>
              </div>

              {/* Option B: Direct bKash Manual */}
              <div
                onClick={() => setSelectedGateway('bkash')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                  selectedGateway === 'bkash'
                    ? 'bg-pink-950/30 border-[#E2136E]/80 ring-1 ring-[#E2136E]/50 shadow-lg shadow-pink-950/50'
                    : 'bg-[#0b1323] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#E2136E] text-white flex items-center justify-center font-bold text-[10px] shadow-md">
                      bKash
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">Direct bKash</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-semibold border border-pink-500/30">
                          01988123793
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Direct merchant Send Money
                      </span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="paymentGateway"
                    checked={selectedGateway === 'bkash'}
                    onChange={() => setSelectedGateway('bkash')}
                    className="accent-pink-500 mt-1"
                  />
                </div>

                <div className="mt-3 pt-2 border-t border-white/5 text-[10px] text-slate-400">
                  Manual TrxID verification on 01988123793
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-3 pt-3 border-t border-white/[0.08]">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-bold">3</span>
              Order Summary
            </h3>

            <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between py-2 border-b border-white/5 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-8 h-8 rounded-md object-cover bg-slate-800 shrink-0"
                    />
                    <span className="font-medium text-slate-200 truncate">
                      {item.product.name}
                    </span>
                    <span className="text-slate-500 shrink-0">x{item.quantity}</span>
                  </div>
                  <span className="font-bold text-white tabular-nums shrink-0 ml-2">
                    ৳{(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-[#0b1323] border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Total Payable</span>
                <p className="text-[11px] text-cyan-400 font-medium">0% Convenience Fee</p>
              </div>
              <span className="text-2xl font-extrabold text-white font-display tabular-nums">
                ৳{totalAmount.toLocaleString()} BDT
              </span>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessingPayment}
              className={`w-full py-4 px-6 text-slate-950 font-extrabold rounded-xl text-sm transition-all shadow-xl flex items-center justify-center gap-3 cursor-pointer disabled:opacity-75 ${
                selectedGateway === 'uddoktapay'
                  ? 'bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:opacity-95 shadow-cyan-900/40'
                  : 'bg-gradient-to-r from-[#E2136E] to-pink-500 text-white hover:opacity-95 shadow-pink-900/40'
              }`}
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting to {selectedGateway === 'uddoktapay' ? 'UddoktaPay' : 'bKash'}...</span>
                </>
              ) : selectedGateway === 'uddoktapay' ? (
                <>
                  <span>Pay ৳{totalAmount.toLocaleString()} with UddoktaPay</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </>
              ) : (
                <>
                  <span>Proceed to Direct bKash (৳{totalAmount.toLocaleString()})</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>

            <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-500">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>256-Bit SSL Encrypted & Verified Server-Side Checkout</span>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
