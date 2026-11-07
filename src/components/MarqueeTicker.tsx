import React from 'react';
import { Zap, ShieldCheck, Download, Award, Star, Lock, Sparkles } from 'lucide-react';

export const MarqueeTicker: React.FC = () => {
  const items = [
    { icon: <Zap className="w-3.5 h-3.5 text-cyan-400" />, text: 'Instant bKash Tokenized Checkout (0-Fee)' },
    { icon: <Download className="w-3.5 h-3.5 text-teal-400" />, text: 'Cloudflare R2 High-Speed Private Vault' },
    { icon: <Lock className="w-3.5 h-3.5 text-emerald-400" />, text: 'Cryptographic Single-Use License Key Pool' },
    { icon: <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" />, text: 'Server-Side Verified Delivery in 0.4s' },
    { icon: <Star className="w-3.5 h-3.5 text-amber-300" />, text: '4.9/5.0 Rated by 2,400+ Verified Buyers' },
    { icon: <Sparkles className="w-3.5 h-3.5 text-emerald-300" />, text: 'Over ৳ 1.8M+ Processed Securely' },
    { icon: <Award className="w-3.5 h-3.5 text-blue-400" />, text: 'Turnkey Enterprise Source Code & Assets' },
  ];

  return (
    <div className="relative w-full overflow-hidden py-3 bg-[#060b16]/90 border-y border-white/[0.06] backdrop-blur-md select-none z-10">
      {/* Side gradient scrims */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#050811] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#050811] to-transparent z-10 pointer-events-none" />

      <div className="animate-marquee flex items-center">
        {/* First copy */}
        <div className="flex items-center gap-8 shrink-0 pr-8">
          {items.map((it, idx) => (
            <div
              key={`m1-${idx}`}
              className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-default"
            >
              <div className="p-1 rounded-md bg-white/[0.04] border border-white/10">
                {it.icon}
              </div>
              <span className="whitespace-nowrap">{it.text}</span>
              <span className="text-slate-600 ml-4">·</span>
            </div>
          ))}
        </div>

        {/* Second copy for continuous infinite loop */}
        <div className="flex items-center gap-8 shrink-0 pr-8">
          {items.map((it, idx) => (
            <div
              key={`m2-${idx}`}
              className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-default"
            >
              <div className="p-1 rounded-md bg-white/[0.04] border border-white/10">
                {it.icon}
              </div>
              <span className="whitespace-nowrap">{it.text}</span>
              <span className="text-slate-600 ml-4">·</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
