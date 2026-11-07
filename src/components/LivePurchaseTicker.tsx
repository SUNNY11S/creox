import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Zap, X } from 'lucide-react';
import { Product } from '../types';

interface LivePurchaseTickerProps {
  products: Product[];
  onViewProduct: (product: Product) => void;
}

export const LivePurchaseTicker: React.FC<LivePurchaseTickerProps> = ({
  products,
  onViewProduct,
}) => {
  const [currentNotification, setCurrentNotification] = useState<{
    customerName: string;
    city: string;
    product: Product;
    timeAgo: string;
  } | null>(null);
  const [dismissed, setDismissed] = useState(false);

  const sampleBuyers = [
    { name: 'Tanvir H.', city: 'Dhaka' },
    { name: 'Farhana A.', city: 'Chittagong' },
    { name: 'Shakib R.', city: 'Sylhet' },
    { name: 'Mahfuz K.', city: 'Rajshahi' },
    { name: 'Nafis I.', city: 'Khulna' },
    { name: 'Sadia M.', city: 'Gazipur' },
  ];

  const timeAgoes = ['Just now', '12s ago', '45s ago', '2m ago', '4m ago'];

  useEffect(() => {
    if (dismissed || products.length === 0) return;

    const showRandomPurchase = () => {
      const buyer = sampleBuyers[Math.floor(Math.random() * sampleBuyers.length)];
      const product = products[Math.floor(Math.random() * products.length)];
      const time = timeAgoes[Math.floor(Math.random() * timeAgoes.length)];

      setCurrentNotification({
        customerName: buyer.name,
        city: buyer.city,
        product,
        timeAgo: time,
      });

      // Hide after 5 seconds
      setTimeout(() => {
        setCurrentNotification(null);
      }, 5000);
    };

    // First appearance after 4 seconds
    const initialTimeout = setTimeout(showRandomPurchase, 4000);
    // Interval every 18 seconds
    const interval = setInterval(showRandomPurchase, 18000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [products, dismissed]);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-sm pointer-events-auto">
      <AnimatePresence>
        {currentNotification && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="p-3.5 rounded-2xl bg-[#0a1120]/95 border border-cyan-500/30 text-white shadow-2xl backdrop-blur-xl flex items-center gap-3.5 creox-glow cursor-pointer group"
            onClick={() => onViewProduct(currentNotification.product)}
          >
            {/* Thumbnail */}
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-white/10">
              <img
                src={currentNotification.product.imageUrl}
                alt={currentNotification.product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
              />
              <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                <Zap className="w-3 h-3 text-cyan-300" />
                <span>Verified bKash Delivery</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-400 lowercase font-normal">{currentNotification.timeAgo}</span>
              </div>
              <p className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                {currentNotification.product.name}
              </p>
              <p className="text-[11px] text-slate-400">
                Purchased by <strong className="text-slate-200">{currentNotification.customerName}</strong> ({currentNotification.city})
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDismissed(true);
              }}
              className="p-1 text-slate-500 hover:text-white rounded-md transition-colors"
              aria-label="Dismiss purchase notification"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
