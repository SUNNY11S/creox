import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CreoxLogo } from './CreoxLogo';

export const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) {
          clearInterval(timer);
          return 100;
        }
        return prev + Math.floor(Math.random() * 18 + 8);
      });
    }, 120);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07070b] text-slate-100 overflow-hidden">
      
      {/* Background Multi-stop Glowing Waves */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.3, 0.55, 0.3],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute w-96 h-96 bg-gradient-to-tr from-cyan-500/30 via-teal-500/25 to-emerald-400/25 rounded-full blur-[100px] pointer-events-none"
      />

      <div className="relative flex flex-col items-center space-y-8 z-10 px-4">
        
        {/* Animated Emblem Lockup */}
        <div className="relative flex items-center justify-center">
          
          {/* Outer Rotating Glowing Gradient Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            className="absolute w-36 h-36 rounded-full p-[2px] bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 opacity-60 blur-sm pointer-events-none"
          />

          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: [0.95, 1.05, 0.95], opacity: 1 }}
            transition={{
              scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
              opacity: { duration: 0.5 },
            }}
            className="relative p-6 rounded-3xl bg-[#08101e]/80 backdrop-blur-2xl border border-white/10 shadow-2xl flex items-center justify-center"
          >
            <CreoxLogo size="xl" showText={true} animated={true} />
          </motion.div>
        </div>

        {/* Progress Display */}
        <div className="w-56 space-y-2 text-center">
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 rounded-full"
              style={{ width: `${Math.min(100, progress)}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="text-cyan-300 font-semibold tracking-wider">CREOX MARKETPLACE</span>
            <span className="text-emerald-400 font-bold tabular-nums">{Math.min(100, progress)}%</span>
          </div>
        </div>

        <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
          Initializing Automated Delivery & bKash Gateway
        </p>
      </div>
    </div>
  );
};
