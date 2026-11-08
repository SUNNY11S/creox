import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, ShieldCheck, Lock, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onProceedToBkash: (customerInfo: { name: string; email: string; phone: string }) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  onProceedToBkash,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
    onProceedToBkash({ name: name.trim(), email: email.trim(), phone: phone.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#080d1a] border border-white/10 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] bg-[#0d1527] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400" />
            <h2 className="text-base font-bold text-white">Digital Checkout</h2>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs text-cyan-300 font-bold">Exclusively via bKash</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errorMessage && (
            <div className="p-3 text-xs rounded-xl bg-red-950/40 border border-red-500/30 text-red-200">
              {errorMessage}
            </div>
          )}

          {/* Customer Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              1. Delivery & Contact Details
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
                bKash Mobile Number *
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
                Your digital product keys and backup download link will be dispatched immediately to this email.
              </span>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-3 pt-3 border-t border-white/[0.08]">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              2. Order Summary
            </h3>

            <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between py-2 border-b border-white/5 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-8 h-8 rounded-md object-cover bg-slate-800"
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
                <p className="text-[11px] text-cyan-400 font-medium">Zero Gateway Service Fee</p>
              </div>
              <span className="text-2xl font-extrabold text-white font-display tabular-nums">
                ৳{totalAmount.toLocaleString()} BDT
              </span>
            </div>
          </div>

          {/* Exclusive bKash Notice */}
          <div className="p-3.5 rounded-xl bg-[#0b1323] border border-[#E2136E]/40 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#E2136E] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
              bKash
            </div>
            <div className="text-[11px] text-slate-300 leading-relaxed">
              <span className="font-bold text-pink-400">bKash Account: 01988123793</span> — Send Money or pay via bKash. Your product files and license keys will be delivered automatically on-screen immediately upon TrxID verification.
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 px-6 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:opacity-95 text-slate-950 font-extrabold rounded-xl text-sm transition-all shadow-xl flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>Pay ৳{totalAmount.toLocaleString()} with bKash</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
