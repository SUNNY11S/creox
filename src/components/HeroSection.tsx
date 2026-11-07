import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Zap, ShieldCheck, Download, Sparkles, Star, TrendingUp, Lock, CheckCircle2, Terminal, Layers, Globe } from 'lucide-react';

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

        {/* Formal High-End Interactive Digital Marketplace Console */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative max-w-5xl mx-auto mt-4"
        >
          <motion.div
            animate={{
              y: [-3, 3, -3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative rounded-2xl overflow-hidden p-1 bg-gradient-to-r from-[#FF6B4A]/25 via-[#8B5CF6]/30 to-[#2DD4BF]/25 border border-white/10 shadow-2xl backdrop-blur-2xl"
          >
            <div className="rounded-xl overflow-hidden bg-[#07090e] border border-white/[0.06] text-left">
              
              {/* App / Browser Chrome Header Bar */}
              <div className="px-4 py-3 bg-white/[0.03] border-b border-white/[0.06] flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#EF4444]/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-[#F59E0B]/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-[#10B981]/80 inline-block" />
                </div>

                <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 border border-white/10 text-[11px] text-slate-300 font-mono">
                  <Lock className="w-3 h-3 text-[#2DD4BF]" />
                  <span>creox.com/marketplace/vault</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-emerald-400">SSL 256-Bit Encrypted</span>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-pulse" />
                  <span className="text-slate-300">bKash Merchant Live</span>
                </div>
              </div>

              {/* Main Interactive Showcase Body */}
              <div className="p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-gradient-to-b from-[#090b14] to-[#06070b]">
                
                {/* Left Panel: Featured Digital Product Spotlight */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-[#FF6B4A]/20 via-[#FF2E93]/20 to-[#8B5CF6]/20 border border-[#FF2E93]/30 text-white">
                      Featured Digital Release
                    </span>
                    <span className="text-[11px] text-slate-400">v3.4.2 Enterprise</span>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                      Nexus AI Productivity Suite Pro
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Autonomous desktop suite for multi-agent workflows, code blueprints, and one-click cloud exports.
                    </p>
                  </div>

                  {/* Badges / Tech Stack */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/5 text-slate-300">
                      ⚡ Instant License Key
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/5 text-slate-300">
                      📦 142 MB ZIP Download
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/5 text-slate-300">
                      🛡️ SHA-256 Verified
                    </span>
                  </div>

                  {/* Price & Buy Button Action */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06]">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl sm:text-2xl font-black text-white font-display tabular-nums">
                          ৳ 3,490 BDT
                        </span>
                        <span className="text-xs text-slate-500 line-through tabular-nums">
                          ৳ 5,990
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FF6B4A]/20 text-[#FF6B4A] border border-[#FF6B4A]/30">
                          42% OFF
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">Lifetime Developer License</span>
                    </div>

                    <button
                      onClick={onExploreProducts}
                      className="px-5 py-2.5 text-xs font-semibold text-white creox-gradient-btn rounded-xl transition-all shadow-lg hover:opacity-95 flex items-center gap-2 cursor-pointer"
                    >
                      <span>Get Instant Access</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Right Panel: Live Automated Delivery Pipeline Telemetry */}
                <div className="lg:col-span-5 p-4 rounded-xl bg-black/40 border border-white/5 space-y-3.5 flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-[#2DD4BF]" />
                      <span>Automated Pipeline</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#2DD4BF] bg-[#2DD4BF]/10 px-2 py-0.5 rounded">
                      0.38s LATENCY
                    </span>
                  </div>

                  {/* 3 Pipeline Stages */}
                  <div className="space-y-2 text-[11px]">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div className="flex-1 leading-tight">
                        <p className="text-white font-semibold">1. bKash Merchant API Verification</p>
                        <p className="text-[10px] text-slate-400 font-mono">TrxID: 9X7K4L · Tokenized 0-Fee</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div className="flex-1 leading-tight">
                        <p className="text-white font-semibold">2. Cloudflare R2 Token Generated</p>
                        <p className="text-[10px] text-slate-400 font-mono">Signed One-Time Edge URL (72h)</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div className="flex-1 leading-tight">
                        <p className="text-white font-semibold">3. License Key & Screen Delivery</p>
                        <p className="text-[10px] text-slate-400 font-mono">Instant Key Pool Allocation</p>
                      </div>
                    </div>
                  </div>

                  {/* Real-Time Live Feed ticker */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-slate-300 font-medium">Tanvir A.</span> purchased Next.js Pro
                    </span>
                    <span className="text-slate-500 font-mono">18s ago</span>
                  </div>
                </div>

              </div>

              {/* Bottom Vault Telemetry Bar */}
              <div className="p-3.5 sm:px-6 bg-white/[0.02] border-t border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#FF6B4A] via-[#FF2E93] to-[#8B5CF6] flex items-center justify-center shadow-md">
                    <Sparkles className="w-4 h-4 text-white font-bold" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Automated Delivery Vault Active</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-ping" />
                    </p>
                    <p className="text-[10px] text-slate-400">Instant bKash API Verification · Cloudflare R2 High Speed</p>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <span className="text-xs font-extrabold text-[#2DD4BF]">100% Automated</span>
                  <p className="text-[10px] text-slate-400 font-mono">24/7 Global Availability</p>
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
