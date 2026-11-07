import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Zap, ShieldCheck, Download, Sparkles, Star, TrendingUp } from 'lucide-react';

interface HeroSectionProps {
  onExploreProducts: () => void;
  onBrowseCategories: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreProducts,
  onBrowseCategories,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-white/[0.06]">
      {/* Dynamic Animated Ambient Glowing Orbs matching screenshot (Coral Orange on left, Purple & Mint on right) */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.25, 0.45, 0.25],
          x: [-20, 20, -20],
          y: [-10, 15, -10],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[500px] bg-gradient-to-tr from-[#FF6B4A]/25 via-[#FF2E93]/20 to-transparent blur-[140px] pointer-events-none -z-10"
      />

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.25, 0.45, 0.25],
          y: [0, -25, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        className="absolute -top-10 right-10 w-[500px] h-[500px] bg-gradient-to-bl from-[#8B5CF6]/30 via-[#9333EA]/25 to-[#2DD4BF]/20 blur-[140px] pointer-events-none -z-10"
      />

      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.3, 0.15],
          x: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        className="absolute bottom-5 left-1/3 w-[400px] h-[400px] bg-[#2DD4BF]/15 blur-[120px] pointer-events-none -z-10"
      />

      {/* Grid Pattern Background with animated drift */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.8) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-7 pt-4 pb-12 sm:pb-16">
          
          {/* Pill Badge matching exact screenshot */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-normal text-slate-300 shadow-sm backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-[#10B981] inline-block shadow-sm shadow-[#10B981]/60" />
            <span>Instant delivery · bKash payments</span>
          </motion.div>

          {/* Headline with signature Creox gradient text matching screenshot typography */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] max-w-4xl mx-auto"
            style={{ textWrap: 'balance' }}
          >
            Your Digital World,<br />
            <span className="creox-gradient-text inline-block font-extrabold pb-1">
              One Click Away.
            </span>
          </motion.h1>

          {/* Subheadline matching exact text and relaxed tone */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            Discover premium digital products, powerful tools, and exclusive resources at unbeatable prices.
          </motion.p>

          {/* Animated Interactive CTAs with exact pill shapes and signature gradient */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={onExploreProducts}
              className="w-full sm:w-auto px-8 py-3.5 text-sm font-semibold text-white creox-gradient-btn rounded-full transition-all shadow-xl hover:opacity-95 flex items-center justify-center gap-2.5 cursor-pointer group"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={onBrowseCategories}
              className="w-full sm:w-auto px-8 py-3.5 text-sm font-semibold text-slate-200 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur-sm"
            >
              <span>Browse Categories</span>
            </motion.button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-slate-400"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#FF6B4A]/10 text-[#FF6B4A]">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <span className="text-slate-300 font-medium">Instant Digital Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#10B981]/10 text-[#10B981]">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span className="text-slate-300 font-medium">Official bKash Checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6]">
                <Download className="w-3.5 h-3.5" />
              </div>
              <span className="text-slate-300 font-medium">Cloudflare R2 High Speed</span>
            </div>
          </motion.div>
        </div>

        {/* Floating Animated Showcase Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative max-w-4xl mx-auto mt-2"
        >
          <motion.div
            animate={{
              y: [-4, 4, -4],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative rounded-2xl overflow-hidden p-1.5 bg-gradient-to-r from-[#FF6B4A]/20 via-[#8B5CF6]/25 to-[#2DD4BF]/20 border border-white/10 shadow-2xl backdrop-blur-xl"
          >
            <div className="relative rounded-xl overflow-hidden aspect-[16/9] sm:aspect-[21/9] bg-[#07090e] group">
              <img
                src="/src/assets/images/creox_hero_showcase_1793972157432.jpg"
                alt="CREOX Digital Marketplace Showcase"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />

              {/* Floating live delivery badge */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3 sm:p-4 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-[#FF6B4A] via-[#FF2E93] to-[#8B5CF6] flex items-center justify-center shadow-md">
                    <Sparkles className="w-4 h-4 text-white font-bold" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                      <span>Automated Delivery Vault</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-ping" />
                    </p>
                    <p className="text-[11px] text-slate-300">Instant bKash API Verification · Cloudflare R2</p>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <span className="text-xs font-extrabold text-[#2DD4BF]">100% Automated</span>
                  <p className="text-[10px] text-slate-400 font-mono">24/7 Live Availability</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* 4-Item KPI Proof Strip with Creox color combination */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md"
        >
          <div className="text-center space-y-1">
            <p className="text-2xl sm:text-3xl font-extrabold text-[#FF6B4A] font-display tabular-nums">
              10,000+
            </p>
            <p className="text-xs text-slate-400">Digital Products Delivered</p>
          </div>
          <div className="text-center space-y-1">
            <p className="text-2xl sm:text-3xl font-extrabold text-[#FF2E93] font-display tabular-nums">
              ৳ 1.8M+
            </p>
            <p className="text-xs text-slate-400">Processed via bKash</p>
          </div>
          <div className="text-center space-y-1">
            <p className="text-2xl sm:text-3xl font-extrabold text-[#8B5CF6] font-display tabular-nums">
              99.98%
            </p>
            <p className="text-xs text-slate-400">Instant Fulfillment Rate</p>
          </div>
          <div className="text-center space-y-1">
            <p className="text-2xl sm:text-3xl font-extrabold text-[#2DD4BF] font-display tabular-nums">
              4.9 / 5.0
            </p>
            <p className="text-xs text-slate-400">Verified Customer Rating</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
