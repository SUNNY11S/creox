import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      
      if (currentScroll > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      if (totalScroll > 0) {
        setScrollProgress((currentScroll / totalScroll) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full creox-glass border border-white/20 text-white shadow-2xl flex items-center justify-center cursor-pointer creox-glow group"
          aria-label="Scroll to top"
        >
          {/* Circular progress SVG */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-1">
            <circle
              cx="20"
              cy="20"
              r="17"
              className="text-slate-800"
              strokeWidth="2.5"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="20"
              cy="20"
              r="17"
              stroke="url(#scrollGradient)"
              strokeWidth="2.5"
              fill="transparent"
              strokeDasharray={106.8}
              strokeDashoffset={106.8 - (106.8 * scrollProgress) / 100}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="scrollGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00F0FF" />
                <stop offset="50%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#00F5A0" />
              </linearGradient>
            </defs>
          </svg>

          <ArrowUp className="w-4 h-4 text-slate-200 group-hover:text-cyan-300 transition-colors" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
