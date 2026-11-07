import React, { useState, useEffect } from 'react';
import { Product, Category, CartItem, Order, CustomerReview, WebsiteSettings } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MarqueeTicker } from './components/MarqueeTicker';
import { BentoCategoryGrid } from './components/BentoCategoryGrid';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { BkashPaymentModal } from './components/BkashPaymentModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { OrderLookupModal } from './components/OrderLookupModal';
import { SearchModal } from './components/SearchModal';
import { WhyChooseUs } from './components/WhyChooseUs';
import { TestimonialsSection } from './components/TestimonialsSection';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import { LoadingScreen } from './components/LoadingScreen';
import { ParticleBackground } from './components/ParticleBackground';
import { LivePurchaseTicker } from './components/LivePurchaseTicker';
import { ScrollToTop } from './components/ScrollToTop';
import { Check } from 'lucide-react';

import { initialProducts, initialCategories, initialReviews } from './data/initialData';

export default function App() {
  // Global Data State with resilient fallback for Vercel/Jamstack
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('creox_saved_products');
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [reviews, setReviews] = useState<CustomerReview[]>(initialReviews);
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // Filter State
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Modals & Panels State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [orderLookupOpen, setOrderLookupOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  // bKash Flow State
  const [bkashModalOpen, setBkashModalOpen] = useState(false);
  const [activeBkashOrderData, setActiveBkashOrderData] = useState<any>(null);
  const [activeCustomerPhone, setActiveCustomerPhone] = useState('');
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Shopping Cart in LocalStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('creox_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('creox_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Check URL hash for admin routing
  useEffect(() => {
    if (window.location.hash === '#admin') {
      setAdminOpen(true);
    }
  }, []);

  // Fetch initial catalog
  const loadInitialData = async () => {
    try {
      const [prodRes, catRes, revRes, settRes] = await Promise.all([
        fetch('/api/products').then((r) => r.json()),
        fetch('/api/categories').then((r) => r.json()),
        fetch('/api/reviews').then((r) => r.json()),
        fetch('/api/settings').then((r) => r.json()),
      ]);

      if (Array.isArray(prodRes)) setProducts(prodRes);
      if (Array.isArray(catRes)) setCategories(catRes);
      if (Array.isArray(revRes)) setReviews(revRes);
      if (settRes) setSettings(settRes);
    } catch (err) {
      console.error('Error fetching marketplace data:', err);
    } finally {
      setTimeout(() => setInitialLoading(false), 600);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Toast helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cart Operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added "${product.name}" to your cart`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Removed product from cart');
  };

  // Direct Buy Now / Instant Purchase
  const handleInstantBuy = (product: Product, quantity = 1) => {
    setCart([{ product, quantity }]);
    setCheckoutModalOpen(true);
  };

  // Proceed from Checkout to official bKash Merchant API
  const handleProceedToBkash = async (customerInfo: {
    name: string;
    email: string;
    phone: string;
  }) => {
    setActiveCustomerPhone(customerInfo.phone);

    try {
      const totalAmount = cart.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      const response = await fetch('/api/payment/bkash/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone,
          items: cart,
          totalAmount,
        }),
      });

      const orderData = await response.json();
      if (response.ok && orderData.paymentID) {
        setActiveBkashOrderData(orderData);
        setCheckoutModalOpen(false);
        setBkashModalOpen(true);
      } else {
        alert(orderData.error || 'Failed to initiate bKash payment');
      }
    } catch (err: any) {
      alert(err.message || 'Error initiating bKash checkout');
    }
  };

  // bKash Payment Executed & Verified
  const handlePaymentSuccess = (verifiedOrder: Order, trxId: string) => {
    setBkashModalOpen(false);
    setCart([]);
    setConfirmedOrder(verifiedOrder);
    setConfirmationModalOpen(true);
    showToast(`bKash Payment Verified (TrxID: ${trxId})! Delivery Fulfilled.`);
  };

  // Order Retrieval Handler
  const handleOrderRetrieved = (order: Order) => {
    setOrderLookupOpen(false);
    setConfirmedOrder(order);
    setConfirmationModalOpen(true);
  };

  // Smooth Section Scrolling
  const handleNavigateSection = (sectionId: string) => {
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  if (initialLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col font-sans relative selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Interactive Canvas Particle Field */}
      <ParticleBackground />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-20 z-50 p-4 rounded-xl bg-[#0c1322] border border-cyan-500/40 text-white shadow-2xl flex items-center gap-3 animate-bounce creox-glow">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 flex items-center justify-center font-bold">
            <Check className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Sticky Navbar */}
      <Navbar
        cart={cart}
        onOpenCart={() => setCartDrawerOpen(true)}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
        onOpenLookup={() => setOrderLookupOpen(true)}
        onNavigateSection={handleNavigateSection}
      />

      {/* Hero Section with animated floating gradients and visual showcase */}
      <HeroSection
        onExploreProducts={() => handleNavigateSection('products')}
        onBrowseCategories={() => handleNavigateSection('categories')}
      />

      {/* Infinite Smooth Scrolling Marquee Ticker */}
      <MarqueeTicker />

      {/* Bento Category Grid */}
      <BentoCategoryGrid
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(catName) => {
          setSelectedCategory(catName);
          handleNavigateSection('products');
        }}
      />

      {/* Curated Products Catalog */}
      <ProductGrid
        products={products}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onViewDetails={(p) => setSelectedProduct(p)}
        onInstantBuy={handleInstantBuy}
        onAddToCart={handleAddToCart}
      />

      {/* Why Choose CREOX */}
      <WhyChooseUs />

      {/* Verified Customer Reviews */}
      <TestimonialsSection
        reviews={reviews}
        onReviewAdded={(newRev) => setReviews([newRev, ...reviews])}
      />

      {/* Footer */}
      <Footer
        onNavigateSection={handleNavigateSection}
        onOpenLookup={() => setOrderLookupOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
        announcementText={settings?.announcementText}
      />

      {/* Real-time Automated Purchase Ticker in Bottom Left */}
      <LivePurchaseTicker
        products={products}
        onViewProduct={(p) => setSelectedProduct(p)}
      />

      {/* Animated Scroll to Top Button with Circular Progress in Bottom Right */}
      <ScrollToTop />

      {/* MODALS */}

      {/* 1. Product Details Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onInstantBuy={handleInstantBuy}
        onAddToCart={handleAddToCart}
      />

      {/* 2. Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => setCheckoutModalOpen(true)}
      />

      {/* 3. Checkout Information Modal */}
      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        cart={cart}
        onProceedToBkash={handleProceedToBkash}
      />

      {/* 4. Official bKash Merchant Payment Modal */}
      <BkashPaymentModal
        isOpen={bkashModalOpen}
        onClose={() => setBkashModalOpen(false)}
        orderData={activeBkashOrderData}
        customerPhone={activeCustomerPhone}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* 5. Post-Payment Confirmation & Digital Delivery */}
      <OrderConfirmationModal
        isOpen={confirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
        order={confirmedOrder}
      />

      {/* 6. Self-Service Order Lookup Modal */}
      <OrderLookupModal
        isOpen={orderLookupOpen}
        onClose={() => setOrderLookupOpen(false)}
        onOrderFound={handleOrderRetrieved}
      />

      {/* 7. Quick Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        products={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* 8. Full Admin Dashboard */}
      {adminOpen && (
        <AdminDashboard
          onClose={() => setAdminOpen(false)}
          products={products}
          categories={categories}
          onRefreshData={loadInitialData}
        />
      )}

    </div>
  );
}
