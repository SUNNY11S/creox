import React from 'react';
import { motion } from 'motion/react';
import { Category } from '../types';
import { Cpu, KeyRound, Sparkles, Palette, LayoutTemplate, BookOpen, GraduationCap, FolderGit2, ArrowUpRight } from 'lucide-react';

interface BentoCategoryGridProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryName: string) => void;
}

export const BentoCategoryGrid: React.FC<BentoCategoryGridProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const iconMap: Record<string, React.ReactNode> = {
    Cpu: <Cpu className="w-6 h-6 text-cyan-400" />,
    KeyRound: <KeyRound className="w-6 h-6 text-teal-400" />,
    Sparkles: <Sparkles className="w-6 h-6 text-emerald-400" />,
    Palette: <Palette className="w-6 h-6 text-sky-400" />,
    LayoutTemplate: <LayoutTemplate className="w-6 h-6 text-cyan-300" />,
    BookOpen: <BookOpen className="w-6 h-6 text-teal-300" />,
    GraduationCap: <GraduationCap className="w-6 h-6 text-blue-400" />,
    FolderGit2: <FolderGit2 className="w-6 h-6 text-emerald-300" />,
  };

  const gradientStyles: Record<number, string> = {
    0: 'from-[#FF6B4A]/10 via-[#0a0b12] to-[#0a0b12] hover:border-[#FF6B4A]/50',
    1: 'from-[#FF2E93]/10 via-[#0a0b12] to-[#0a0b12] hover:border-[#FF2E93]/50',
    2: 'from-[#8B5CF6]/10 via-[#0a0b12] to-[#0a0b12] hover:border-[#8B5CF6]/50',
    3: 'from-[#2DD4BF]/10 via-[#0a0b12] to-[#0a0b12] hover:border-[#2DD4BF]/50',
    4: 'from-[#FF6B4A]/10 via-[#0a0b12] to-[#0a0b12] hover:border-[#FF6B4A]/50',
    5: 'from-[#8B5CF6]/10 via-[#0a0b12] to-[#0a0b12] hover:border-[#8B5CF6]/50',
  };

  return (
    <section id="categories" className="py-20 border-b border-white/[0.06] bg-[#07080d] relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-[#FF6B4A]/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#8B5CF6]/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12"
        >
          <div>
            <span className="text-xs font-semibold text-[#2DD4BF] uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore Marketplace Ecosystem</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Top Digital Categories
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Curated software licenses, turnkey codebases, AI agent toolkits, and UI design kits with instant automated delivery.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectCategory('All')}
            className="px-4 py-2.5 text-xs font-semibold text-slate-200 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 rounded-xl transition-all cursor-pointer shrink-0"
          >
            View All ({categories.length} Categories)
          </motion.button>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {categories.map((cat, idx) => {
            const isSpan = idx === 0 || idx === 3; // make 1st and 4th cards wider for bento layout rhythm
            const isSelected = selectedCategory === cat.name;

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
                whileHover={{ y: -6, scale: 1.015 }}
                onClick={() => {
                  onSelectCategory(cat.name);
                  const el = document.getElementById('products');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`relative p-6 rounded-2xl bg-gradient-to-br ${
                  gradientStyles[idx % 6]
                } border transition-all duration-300 cursor-pointer group flex flex-col justify-between overflow-hidden shadow-lg ${
                  isSpan ? 'md:col-span-2' : 'col-span-1'
                } ${isSelected ? 'border-cyan-400 ring-2 ring-cyan-500/30' : 'border-white/[0.08]'}`}
              >
                {/* Decorative Top Accent Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/[0.03] rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-colors" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all">
                      {iconMap[cat.iconName] || <Cpu className="w-6 h-6 text-cyan-400" />}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-400 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/5">
                        {cat.productCount} Items
                      </span>
                      <div className="w-7 h-7 rounded-full bg-white/[0.04] flex items-center justify-center text-slate-400 group-hover:text-slate-950 group-hover:bg-cyan-400 transition-colors">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {cat.name}
                  </h3>

                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-slate-500">
                  <span className="group-hover:text-emerald-400 transition-colors font-medium">
                    bKash Instant Auto Delivery
                  </span>
                  <span className="font-mono text-cyan-400 font-bold group-hover:translate-x-1 transition-transform">
                    Explore &rarr;
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
