import React, { useState } from 'react';
import { Product } from '../types';
import { X, CheckCircle2, ShieldCheck, Zap, Download, KeyRound, Globe, ShoppingCart, Star } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onInstantBuy: (product: Product, quantity: number) => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onInstantBuy,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'specs' | 'delivery'>('overview');

  if (!product) return null;

  const deliveryNotice: Record<string, string> = {
    license_key: 'Instant automated license key generation upon bKash payment verification.',
    activation_code: 'Official activation code displayed immediately on confirmation screen & emailed.',
    zip_download: 'Secure, high-speed Cloudflare R2 temporary download link generated instantly (72h validity).',
    pdf_ebook: 'Direct DRM-free PDF download link generated instantly with unlimited reading access.',
    software_file: 'Full installer package with verify SHA-256 checksum and download link.',
    access_link: 'Immediate private repository invite and access portal credentials.',
    custom_instructions: 'Detailed onboarding manual and direct customer support escalation access.',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-[#080d1a] border border-white/10 shadow-2xl overflow-hidden">
        
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0d1527]">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
            <span>{product.category}</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-300">Product #{product.id.slice(-6).toUpperCase()}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            aria-label="Close product details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Left Column: Image and Badges */}
            <div className="md:col-span-5 space-y-4">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#0d1527] border border-white/10">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {product.discountPercentage > 0 && (
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-md bg-gradient-to-r from-cyan-400 to-emerald-400 text-xs font-extrabold text-slate-950 shadow-md">
                    {product.discountPercentage}% DISCOUNT
                  </div>
                )}
              </div>

              {/* Delivery Promise Card */}
              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>Automatic Digital Delivery</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {deliveryNotice[product.deliveryType] || 'Automated server-side delivery immediately upon verified bKash payment.'}
                </p>
              </div>

              {/* Security Assurance */}
              <div className="flex items-center gap-2 text-xs text-slate-400 px-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verified genuine product with official replacement warranty.</span>
              </div>
            </div>

            {/* Right Column: Pricing & Details */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-400 text-xs">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1 font-bold">{product.rating}</span>
                  </div>
                  <span className="text-xs text-slate-500">·</span>
                  <span className="text-xs text-slate-400">{product.reviewCount} verified reviews</span>
                  <span className="text-xs text-slate-500">·</span>
                  <span className="text-xs text-emerald-400 font-semibold">In Stock & Ready</span>
                </div>

                <h1 className="text-2xl font-extrabold text-white mt-2 leading-snug">
                  {product.name}
                </h1>

                {/* Price display */}
                <div className="mt-3 flex items-baseline gap-3 p-3 rounded-xl bg-[#0b1323] border border-white/5">
                  <span className="text-3xl font-extrabold text-white font-display tabular-nums">
                    ৳{product.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400">BDT</span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-slate-500 line-through tabular-nums ml-2">
                      ৳{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                  <span className="ml-auto text-xs font-extrabold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-md">
                    Save ৳{(product.originalPrice - product.price).toLocaleString()}
                  </span>
                </div>

                {/* Tab Navigation */}
                <div className="mt-5 border-b border-white/[0.08] flex items-center gap-4 text-xs font-semibold">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`pb-2.5 transition-colors cursor-pointer ${
                      activeTab === 'overview'
                        ? 'text-cyan-300 border-b-2 border-cyan-400 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('features')}
                    className={`pb-2.5 transition-colors cursor-pointer ${
                      activeTab === 'features'
                        ? 'text-cyan-300 border-b-2 border-cyan-400 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Features ({product.features.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('specs')}
                    className={`pb-2.5 transition-colors cursor-pointer ${
                      activeTab === 'specs'
                        ? 'text-cyan-300 border-b-2 border-cyan-400 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Specifications
                  </button>
                </div>

                {/* Tab Content */}
                <div className="py-4 text-xs text-slate-300 leading-relaxed min-h-[120px]">
                  {activeTab === 'overview' && (
                    <p className="whitespace-pre-line">{product.description}</p>
                  )}

                  {activeTab === 'features' && (
                    <ul className="space-y-2">
                      {product.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {activeTab === 'specs' && (
                    <div className="space-y-2">
                      {Object.entries(product.specifications || {}).map(([key, val]) => (
                        <div key={key} className="flex items-center justify-between py-1.5 border-b border-white/5">
                          <span className="text-slate-400">{key}:</span>
                          <span className="text-white font-medium">{val}</span>
                        </div>
                      ))}
                      {product.fileName && (
                        <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                          <span className="text-slate-400">File Package:</span>
                          <span className="text-cyan-300 font-mono">{product.fileName} ({product.fileSizeMb} MB)</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Purchase Action Box */}
              <div className="pt-4 border-t border-white/[0.08] space-y-3">
                <div className="flex items-center gap-3">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-white/10 rounded-xl bg-[#0b1323] px-2 py-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-2 py-1 text-slate-400 hover:text-white cursor-pointer font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-bold text-white tabular-nums">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-2 py-1 text-slate-400 hover:text-white cursor-pointer font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart button */}
                  <button
                    onClick={() => {
                      onAddToCart(product, quantity);
                      onClose();
                    }}
                    className="flex-1 py-3 px-4 bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 rounded-xl text-xs font-semibold text-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>

                  {/* Instant bKash Buy Button */}
                  <button
                    onClick={() => {
                      onInstantBuy(product, quantity);
                      onClose();
                    }}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:opacity-95 text-slate-950 font-extrabold rounded-xl text-xs transition-all shadow-lg creox-glow flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Pay with bKash</span>
                  </button>
                </div>
                
                <p className="text-center text-[11px] text-slate-400">
                  Instant receipt & automatic delivery straight to your email.
                </p>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
