import React, { useState } from 'react';
import { Product } from '../types';
import { Search, X, ArrowRight, Star } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const results = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      )
    : products.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#0a1120] border border-white/10 shadow-2xl overflow-hidden">
        
        {/* Search Input bar */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-[#0e172a]">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search software, templates, AI prompts, e-books..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-md cursor-pointer"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-2">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-2">
            {query.trim() ? `Search Results (${results.length})` : 'Popular Recommendations'}
          </p>

          {results.length > 0 ? (
            results.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  onSelectProduct(p);
                  onClose();
                }}
                className="p-3 rounded-xl hover:bg-white/[0.04] transition-colors flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-11 h-11 rounded-lg object-cover bg-slate-800 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 truncate">
                      {p.name}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span className="text-cyan-400">{p.category}</span>
                      <span>·</span>
                      <div className="flex items-center text-amber-400">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="ml-1 font-bold">{p.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-extrabold text-white font-display tabular-nums block">
                    ৳{p.price.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-emerald-400">bKash Instant</span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching products found for "{query}".
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
