import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Category } from '../types';
import { ProductCard } from './ProductCard';
import { Search, SlidersHorizontal, Sparkles, TrendingUp } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onViewDetails: (product: Product) => void;
  onInstantBuy: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  categories,
  selectedCategory,
  onSelectCategory,
  onViewDetails,
  onInstantBuy,
  onAddToCart,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating' | 'discount'>('featured');
  const [filterType, setFilterType] = useState<'all' | 'bestsellers' | 'featured'>('all');

  // Filter and sort products
  const filteredProducts = products.filter((p) => {
    // Category check
    if (selectedCategory !== 'All' && p.category !== selectedCategory) {
      return false;
    }
    // Filter type (bestsellers, featured)
    if (filterType === 'bestsellers' && !p.isBestSeller) return false;
    if (filterType === 'featured' && !p.isFeatured) return false;

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Sort logic
  filteredProducts.sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'discount') return b.discountPercentage - a.discountPercentage;
    return 0; // default order
  });

  return (
    <section id="products" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full overflow-hidden">
      
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/[0.08]"
      >
        <div>
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Catalog</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
            Explore Premium Products
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Software licenses, cloud configurations, design assets, and fullstack kits with automated delivery.
          </p>
        </div>

        {/* Filter Mode Tabs (All / Best Sellers / Featured) with animated pills */}
        <div className="flex items-center gap-1.5 p-1 bg-[#0d121f] border border-cyan-500/20 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`relative px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => setFilterType('bestsellers')}
            className={`relative px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              filterType === 'bestsellers'
                ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Best Sellers</span>
          </button>
          <button
            onClick={() => setFilterType('featured')}
            className={`relative px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              filterType === 'featured'
                ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Featured</span>
          </button>
        </div>
      </motion.div>

      {/* Filter and Category Navigation Bar */}
      <div className="py-6 space-y-4 w-full max-w-full overflow-hidden">
        {/* Dynamic Categories Scrollable Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none w-full max-w-full">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectCategory('All')}
            className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap shrink-0 transition-all cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 shadow-md'
                : 'bg-[#0d121f] text-slate-300 hover:text-cyan-300 hover:bg-[#131b2e] border border-cyan-500/10'
            }`}
          >
            All Categories ({products.length})
          </motion.button>
          {categories.map((cat) => {
            const dynamicCount = products.filter((p) => p.category === cat.name).length;
            return (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectCategory(cat.name)}
                className={`px-4 py-2 text-xs font-medium rounded-xl whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  selectedCategory === cat.name
                    ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-bold shadow-md'
                    : 'bg-[#0d121f] text-slate-300 hover:text-cyan-300 hover:bg-[#131b2e] border border-cyan-500/10'
                }`}
              >
                {cat.name} ({dynamicCount})
              </motion.button>
            );
          })}
        </div>

        {/* Search & Sort Controls Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, tool, or tag..."
              className="w-full bg-[#0d121f] border border-cyan-500/20 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-white cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sort:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#0d121f] border border-cyan-500/20 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="featured">Recommended</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="discount">Highest Discount</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Cards Grid with animation */}
      {filteredProducts.length > 0 ? (
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={onViewDetails}
                onInstantBuy={onInstantBuy}
                onAddToCart={onAddToCart}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-12 text-center rounded-2xl bg-[#12121c] border border-white/5 space-y-3"
        >
          <p className="text-base font-semibold text-slate-200">No matching products found</p>
          <p className="text-xs text-slate-400">
            Try adjusting your search query or selecting a different category.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              onSelectCategory('All');
              setFilterType('all');
            }}
            className="px-5 py-2.5 text-xs font-extrabold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-xl hover:opacity-95 transition-all shadow-md cursor-pointer"
          >
            Reset Filters
          </button>
        </motion.div>
      )}
    </section>
  );
};
