import React, { useEffect, useState } from 'react';
import { Order } from '../types';
import { CheckCircle2, Download, KeyRound, Copy, Check, Clock, ShieldCheck, Mail, ArrowRight, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Fire celebration confetti
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#00F0FF', '#00F5A0', '#06B6D4', '#3B82F6', '#10B981', '#38BDF8'],
        });
      } catch (err) {
        // ignore
      }
    }
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const copyToClipboard = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#080d1a] border border-white/10 shadow-2xl overflow-hidden my-8">
        
        {/* Celebration Header */}
        <div className="p-8 text-center bg-gradient-to-b from-cyan-950/40 via-[#0d1628] to-transparent border-b border-white/[0.08] relative">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-400 to-emerald-400 shadow-xl mb-4 text-slate-950">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Payment Successful!
          </h2>
          <p className="text-sm font-semibold text-emerald-400 mt-1">
            Your digital product is ready to download.
          </p>
          <p className="text-xs text-slate-400 mt-1">
            A confirmation receipt and secure backup links were dispatched to{' '}
            <strong className="text-white">{order.customerEmail}</strong>
          </p>

          <div className="mt-4 inline-flex items-center gap-4 text-xs font-mono text-slate-300 bg-white/[0.04] px-4 py-2 rounded-xl border border-white/10">
            <span>Order: <strong className="text-white">{order.orderNumber}</strong></span>
            <span className="text-slate-600">|</span>
            <span>bKash TrxID: <strong className="text-cyan-400">{order.bkashTrxId || 'BKH9A847291'}</strong></span>
            <span className="text-slate-600">|</span>
            <span>Amount: <strong className="text-white">৳{order.totalAmount.toLocaleString()}</strong></span>
          </div>
        </div>

        {/* Deliveries Area */}
        <div className="p-6 sm:p-8 space-y-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Fulfilled Digital Products ({order.items.length})
          </h3>

          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-xl bg-[#0d1527] border border-white/10 space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-12 h-12 rounded-lg object-cover bg-slate-800 shrink-0"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.productName}</h4>
                      <p className="text-xs text-cyan-400 font-semibold">
                        ৳{item.price.toLocaleString()} BDT · Verified Genuine
                      </p>
                    </div>
                  </div>
                </div>

                {/* If License Key Assigned */}
                {item.assignedKey && (
                  <div className="p-4 rounded-xl bg-[#0b172a] border border-cyan-500/30 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                        <KeyRound className="w-4 h-4 text-cyan-400" />
                        <span>Your License Key</span>
                      </span>
                      <span className="text-emerald-400 font-semibold text-[11px]">Single-User Lifetime</span>
                    </div>

                    <div className="flex items-center justify-between gap-2 p-3 bg-[#050811] rounded-lg border border-cyan-500/30">
                      <code className="text-sm font-mono font-bold text-cyan-300 tracking-wider truncate">
                        {item.assignedKey}
                      </code>
                      <button
                        onClick={() => copyToClipboard(item.assignedKey!, item.id)}
                        className="px-3 py-1.5 bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-bold rounded-md text-xs flex items-center gap-1.5 hover:opacity-95 transition-all cursor-pointer shrink-0"
                      >
                        {copiedKey === item.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Key</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* If Download URL / Token Generated */}
                {item.downloadUrl && (
                  <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                        <Download className="w-4 h-4 text-cyan-400" />
                        <span>Direct Download Package</span>
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Valid for 72 Hours (5 Max Downloads)</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <a
                        href={item.downloadUrl}
                        target={item.downloadUrl.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        download={item.downloadUrl.startsWith('data:') ? `${(item.productName || 'creox_product').toLowerCase().replace(/[^a-z0-9]+/g, '_')}_package.txt` : undefined}
                        className="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>{item.downloadUrl.startsWith('http') ? 'Open & Download Digital File' : 'Download Digital File Now'}</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* If Access Link */}
                {item.accessLink && (
                  <div className="p-4 rounded-xl bg-teal-950/30 border border-teal-500/30 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-teal-300 flex items-center gap-1.5">
                        <ExternalLink className="w-4 h-4 text-teal-400" />
                        <span>Access Portal & Repository</span>
                      </span>
                    </div>
                    <a
                      href={item.accessLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-teal-300 hover:underline"
                    >
                      <span>Open Verified Repository Link</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                    {item.customInstructions && (
                      <p className="text-[11px] text-slate-300 pt-1 leading-relaxed">
                        Instructions: {item.customInstructions}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Customer Self-Service Code & Support */}
          <div className="p-4 rounded-xl bg-[#141420] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div>
              <p className="text-slate-200 font-semibold">Need to access your files later?</p>
              <p className="text-[11px] text-slate-400">
                You can retrieve your order anytime using your Order ID <strong className="text-white">{order.orderNumber}</strong> and your email.
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-emerald-400 font-medium">Customer Support 24/7</span>
              <p className="text-[11px] text-slate-400">support@creox.com</p>
            </div>
          </div>

          {/* Close Action */}
          <button
            onClick={onClose}
            className="w-full py-3.5 text-xs font-bold text-slate-200 bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 rounded-xl transition-colors cursor-pointer"
          >
            Done & Return to Store
          </button>
        </div>

      </div>
    </div>
  );
};
