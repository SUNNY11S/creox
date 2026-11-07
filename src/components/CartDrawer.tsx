import React from 'react';
import { CartItem } from '../types';
import { X, Trash2, ArrowRight, ShoppingBag, ShieldCheck, Zap } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#080d1a] border-l border-white/10 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-white/[0.08] flex items-center justify-between bg-[#0d1527]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                <ShoppingBag className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Your Shopping Cart</h2>
                <p className="text-xs text-slate-400">
                  {cart.length} {cart.length === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-slate-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-base font-semibold text-slate-300">Your cart is empty</p>
                <p className="text-xs text-slate-500 max-w-xs">
                  Browse through our catalog of software, templates, and digital assets.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-xl hover:opacity-95 shadow-md transition-all cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="p-4 rounded-xl bg-[#0d1527] border border-white/5 flex gap-3.5 items-start justify-between"
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-lg object-cover bg-[#101b33] shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate leading-tight">
                      {item.product.name}
                    </h4>
                    <p className="text-[11px] text-cyan-400 font-semibold mt-0.5">{item.product.category}</p>
                    
                    <div className="mt-2 flex items-center justify-between">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-white/10 rounded-lg bg-[#050811] px-1.5 py-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          className="px-1.5 text-xs text-slate-400 hover:text-white font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold text-white tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="px-1.5 text-xs text-slate-400 hover:text-white font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-sm font-extrabold text-white font-display tabular-nums">
                        ৳{(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Remove Item */}
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="text-slate-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-white/[0.08] bg-[#0a1120] space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-200 tabular-nums">৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Digital Delivery & Gateway Fee</span>
                  <span className="text-emerald-400 font-semibold">FREE (৳0)</span>
                </div>
                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-sm font-bold text-white">Total Amount</span>
                  <span className="text-xl font-extrabold text-white font-display tabular-nums">
                    ৳{subtotal.toLocaleString()} BDT
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:opacity-95 text-slate-950 font-extrabold rounded-xl text-sm transition-all shadow-lg creox-glow flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Checkout with bKash</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Instant automated delivery after bKash verification</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
