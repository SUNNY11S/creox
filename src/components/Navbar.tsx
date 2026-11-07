import React, { useState } from 'react';
import { CreoxLogo } from './CreoxLogo';
import { ShoppingBag, Search, Shield, Menu, X, ArrowRight, PackageCheck } from 'lucide-react';
import { CartItem } from '../types';

interface NavbarProps {
  cart: CartItem[];
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenAdmin: () => void;
  onOpenLookup: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cart,
  onOpenCart,
  onOpenSearch,
  onOpenAdmin,
  onOpenLookup,
  onNavigateSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigateSection(id);
  };

  return (
    <header className="sticky top-0 z-40 w-full creox-glass border-b border-white/[0.08] backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Zone 1: Brand Wordmark with Creox Official Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNavClick('hero')}
              className="text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg p-1"
            >
              <CreoxLogo size="md" showText={true} />
            </button>
          </div>

          {/* Zone 2: Navigation Links (Clean Typography matching screenshot) */}
          <nav className="hidden lg:flex items-center gap-9 text-sm font-medium text-slate-300">
            <button
              onClick={() => handleNavClick('hero')}
              className="hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('products')}
              className="hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Products
            </button>
            <button
              onClick={() => handleNavClick('categories')}
              className="hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Categories
            </button>
            <button
              onClick={() => handleNavClick('why-us')}
              className="hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              About
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Contact
            </button>
          </nav>

          {/* Zone 3: Actions (Search, Order Retrieval, Cart, Admin) */}
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            {/* Search Button */}
            <button
              onClick={onOpenSearch}
              className="p-2 sm:px-3 sm:py-2 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors flex items-center gap-2 text-xs font-medium cursor-pointer"
              title="Search products"
              aria-label="Search digital products"
            >
              <Search className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Search</span>
            </button>

            {/* Retrieve Order / Lookup */}
            <button
              onClick={onOpenLookup}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors cursor-pointer"
              title="Retrieve purchases by Order ID and Email"
            >
              <PackageCheck className="w-4 h-4 text-emerald-400" />
              <span>Track Order</span>
            </button>

            {/* Shopping Bag Trigger */}
            <button
              onClick={onOpenCart}
              className="relative p-2 sm:px-3.5 sm:py-2 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 rounded-xl transition-all flex items-center gap-2 cursor-pointer group"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-slate-200 group-hover:text-cyan-400 transition-colors" />
              <span className="text-xs font-semibold text-slate-200 hidden sm:inline">Cart</span>
              {totalItemsCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-black text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full tabular-nums shadow-sm">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Admin Dashboard Portal Link */}
            <button
              onClick={onOpenAdmin}
              className="px-3 py-2 text-xs font-semibold text-cyan-300 hover:text-white bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:border-cyan-500/60"
              title="Admin Control Center"
            >
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Admin</span>
            </button>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white focus:outline-none cursor-pointer"
              aria-label="Toggle mobile navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/[0.08] bg-[#0d121f] px-4 pt-4 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <button
              onClick={() => handleNavClick('hero')}
              className="text-left px-3 py-2 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-white/[0.05]"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('products')}
              className="text-left px-3 py-2 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-white/[0.05]"
            >
              Products
            </button>
            <button
              onClick={() => handleNavClick('categories')}
              className="text-left px-3 py-2 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-white/[0.05]"
            >
              Categories
            </button>
            <button
              onClick={() => handleNavClick('why-us')}
              className="text-left px-3 py-2 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-white/[0.05]"
            >
              Why Creox
            </button>
            <button
              onClick={() => handleNavClick('reviews')}
              className="text-left px-3 py-2 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-white/[0.05]"
            >
              Reviews
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="text-left px-3 py-2 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-white/[0.05]"
            >
              Contact
            </button>
          </div>

          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLookup();
              }}
              className="flex items-center gap-2 text-xs font-medium text-emerald-400 py-2"
            >
              <PackageCheck className="w-4 h-4" />
              <span>Retrieve Previous Order</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300 py-2"
            >
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Admin Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
