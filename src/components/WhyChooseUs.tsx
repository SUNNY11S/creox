import React from 'react';
import { motion } from 'motion/react';
import { Zap, ShieldCheck, Tag, Award, Download, Headphones } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const pillars = [
    {
      icon: <Zap className="w-6 h-6 text-cyan-400" />,
      title: 'Instant Digital Delivery',
      description: 'Zero waiting time. The moment your bKash payment is verified, your product package and keys generate automatically on-screen and arrive in your inbox.',
      border: 'hover:border-cyan-400/50',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      title: 'Official bKash Payment',
      description: 'Built exclusively for Bangladeshi digital creators and businesses. Pay effortlessly using the official tokenized bKash Merchant Checkout API with bank-grade security.',
      border: 'hover:border-emerald-400/50',
    },
    {
      icon: <Tag className="w-6 h-6 text-teal-400" />,
      title: 'Unbeatable Pricing',
      description: 'Premium developer tools, UI design systems, and software templates at fractional global costs, negotiated directly with creators and publishers.',
      border: 'hover:border-teal-400/50',
    },
    {
      icon: <Award className="w-6 h-6 text-cyan-300" />,
      title: 'Trusted & Genuine Service',
      description: 'Every software file is SHA-256 integrity checked and every license key is 100% verified genuine with an unconditional replacement guarantee.',
      border: 'hover:border-cyan-400/50',
    },
    {
      icon: <Download className="w-6 h-6 text-sky-400" />,
      title: 'High-Speed R2 Downloads',
      description: 'Stored on private Cloudflare R2 object storage with global Anycast edge CDN. Enjoy maximum download speeds without throttling or arbitrary wait times.',
      border: 'hover:border-sky-400/50',
    },
    {
      icon: <Headphones className="w-6 h-6 text-emerald-300" />,
      title: 'Dedicated Customer Support',
      description: 'Direct WhatsApp and email escalation for license activations, installation inquiries, and self-service order recovery around the clock.',
      border: 'hover:border-emerald-400/50',
    },
  ];

  return (
    <section id="why-us" className="py-24 border-b border-white/[0.06] bg-[#050508] relative overflow-hidden">
      {/* Ambient background glows */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.25 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-[#FF6B4A]/20 to-[#8B5CF6]/20 rounded-full blur-[140px] pointer-events-none -z-10"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-16 space-y-3"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xs font-bold text-[#2DD4BF] uppercase tracking-widest inline-block"
          >
            The CREOX Advantage
          </motion.span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Why Choose CREOX?
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Engineered for developers, designers, and digital pioneers who demand instant fulfillment and guaranteed security.
          </p>
        </motion.div>

        {/* 6 Grid Pillars with staggered whileInView animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {pillars.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.55,
                delay: idx * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`p-7 rounded-2xl bg-[#090b12] border border-white/[0.07] transition-all duration-300 ${item.border} hover:shadow-2xl hover:shadow-purple-950/20 group cursor-default`}
            >
              <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#8B5CF6]/15 transition-all">
                {item.icon}
              </div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-white transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
