import React, { useState } from 'react';
import { X, Search, PackageCheck, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { Order } from '../types';

interface OrderLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderFound: (order: Order) => void;
}

export const OrderLookupModal: React.FC<OrderLookupModalProps> = ({
  isOpen,
  onClose,
  onOrderFound,
}) => {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/orders/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber, email }),
      });

      const data = await response.json();
      if (response.ok && data.success && data.order) {
        onOrderFound(data.order);
      } else {
        setErrorMessage(data.error || 'No matching order found for this email and order number.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error connecting to order retrieval service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-2xl bg-[#080d1a] border border-white/10 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] bg-[#0d1527] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold text-white">Track & Retrieve Orders</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            aria-label="Close lookup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleLookup} className="p-6 space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            Enter the email address and Order Number (e.g., <span className="font-mono text-cyan-400 font-bold">CRX-10491</span>) used during checkout to retrieve your downloads and license keys.
          </p>

          {errorMessage && (
            <div className="p-3 text-xs rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Order ID / Number *
            </label>
            <input
              type="text"
              required
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g. CRX-10491"
              className="w-full bg-[#0b1323] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Customer Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. user@gmail.com"
              className="w-full bg-[#0b1323] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-extrabold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:opacity-95"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Retrieving order...</span>
                </>
              ) : (
                <>
                  <span>Retrieve Digital Downloads</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
