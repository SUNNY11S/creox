import React from 'react';
import { motion } from 'motion/react';
import { Star, Zap, ShoppingCart, KeyRound, Download, Globe, FileCode } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onInstantBuy: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onInstantBuy,
  onAddToCart,
}) => {
  const deliveryIcons: Record<string, React.ReactNode> = {
    license_key: <KeyRound className="w-3.5 h-3.5 text-cyan-400" />,
    activation_code: <KeyRound className="w-3.5 h-3.5 text-cyan-400" />,
    zip_download: <Download className="w-3.5 h-3.5 text-emerald-400" />,
    pdf_ebook: <Download className="w-3.5 h-3.5 text-teal-400" />,
    software_file: <FileCode className="w-3.5 h-3.5 text-sky-400" />,
    access_link: <Globe className="w-3.5 h-3.5 text-blue-400" />,
  };

  const deliveryLabel: Record<string, string> = {
    license_key: 'Instant License Key',
    activation_code: 'Instant Activation Code',
    zip_download: 'Instant ZIP Download',
    pdf_ebook: 'Direct PDF Delivery',
    software_file: 'Software Package',
    access_link: 'Private Repo / Access',
    custom_instructions: 'Custom Delivery',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ duration: 0.3 }}
      className="group relative rounded-2xl bg-[#0b0c13] border border-white/[0.07] hover:border-[#8B5CF6]/40 transition-all duration-300 flex flex-col overflow-hidden hover:shadow-2xl hover:shadow-purple-950/30"
    >
      {/* Product Image Area with Zoom & Discount Badge */}
      <div 
        onClick={() => onViewDetails(product)}
        className="relative aspect-[16/10] w-full overflow-hidden bg-[#0e101a] cursor-pointer"
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Gradient scrim overlay on bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c13] via-transparent to-transparent opacity-85" />

        {/* Discount Badge with Creox Coral-to-Pink gradient */}
        {product.discountPercentage > 0 && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-gradient-to-r from-[#FF6B4A] to-[#FF2E93] text-[11px] font-bold text-white shadow-lg">
            {product.discountPercentage}% OFF
          </div>
        )}

        {/* Delivery Type Indicator */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md border border-white/10 text-[11px] font-medium text-slate-300 flex items-center gap-1.5 shadow-md">
          {deliveryIcons[product.deliveryType] || <Zap className="w-3.5 h-3.5 text-[#2DD4BF]" />}
          <span className="hidden sm:inline">{deliveryLabel[product.deliveryType] || 'Auto Delivery'}</span>
        </div>
      </div>

      {/* Card Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Metadata */}
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span className="text-slate-300 font-semibold">{product.category}</span>
            <span aria-hidden="true">·</span>
            <div className="flex items-center gap-1 text-[#FF6B4A]">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-semibold tabular-nums text-slate-200">{product.rating}</span>
              <span className="text-slate-500">({product.reviewCount})</span>
            </div>
            {product.isBestSeller && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#2DD4BF] font-bold uppercase text-[10px] tracking-wider">Best Seller</span>
              </>
            )}
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => onViewDetails(product)}
            className="mt-2 text-base font-bold text-white group-hover:text-white transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {product.shortDescription || product.description}
          </p>
        </div>

        {/* Price & Actions Row */}
        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-3">
          {/* Price container */}
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-extrabold text-white font-display tabular-nums">
                ৳{product.price.toLocaleString()}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-500 line-through tabular-nums">
                  ৳{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <span className="text-[10px] text-[#2DD4BF] font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-pulse" />
              <span>bKash Auto Delivery</span>
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => onAddToCart(product)}
              className="p-2 text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 rounded-xl transition-all cursor-pointer"
              title="Add to cart"
              aria-label="Add product to cart"
            >
              <ShoppingCart className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onInstantBuy(product)}
              className="px-4 py-2 text-xs font-semibold text-white creox-gradient-btn rounded-xl transition-all shadow-md cursor-pointer whitespace-nowrap"
            >
              Buy Now
            </motion.button>
          </div>
        </div>

      </div>
    </motion.div>
  );
};
