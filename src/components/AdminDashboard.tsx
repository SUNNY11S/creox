import React, { useState, useEffect } from 'react';
import { CreoxLogo } from './CreoxLogo';
import { Product, Category, Order, Customer, DigitalFile, StorageStats, WebsiteSettings } from '../types';
import {
  Shield, LayoutDashboard, Package, ShoppingCart, HardDrive, Users, Settings,
  LogOut, Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Eye, Search,
  TrendingUp, Download, KeyRound, ExternalLink, RefreshCw, Upload, Lock, Sparkles
} from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
  products: Product[];
  categories: Category[];
  onRefreshData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onClose,
  products,
  categories,
  onRefreshData,
}) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authToken, setAuthToken] = useState<string>('');

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'storage' | 'customers' | 'categories' | 'settings'>('overview');

  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [storageStats, setStorageStats] = useState<StorageStats | null>(null);
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [loadingData, setLoadingData] = useState(false);

  // Admin Passkey Change States
  const [newAdminPass, setNewAdminPass] = useState('');
  const [passChangeSuccess, setPassChangeSuccess] = useState('');
  const [passChangeError, setPassChangeError] = useState('');
  const [passChangeLoading, setPassChangeLoading] = useState(false);

  // Modals inside Admin
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<any>({
    name: '',
    category: 'Software & Applications',
    description: '',
    shortDescription: '',
    price: '',
    originalPrice: '',
    imageUrl: '',
    features: '',
    deliveryType: 'zip_download',
    fileName: '',
    fileSizeMb: '',
    accessUrl: '',
    customInstructions: '',
    licenseKeys: '',
    isFeatured: false,
    isBestSeller: false,
    isActive: true,
  });

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', iconName: 'Folder' });

  // Upload simulation / R2 direct upload state
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState('');

  // Order filter
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');

  // Verify stored token on load
  useEffect(() => {
    const savedToken = localStorage.getItem('creox_admin_token');
    if (savedToken) {
      setAuthToken(savedToken);
      setIsAuthenticated(true);
      fetchAdminData(savedToken);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setAuthToken(data.token);
        localStorage.setItem('creox_admin_token', data.token);
        fetchAdminData(data.token);
      } else {
        setAuthError(data.error || 'Invalid admin password');
      }
    } catch (err: any) {
      setAuthError('Connection error contacting admin server');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('creox_admin_token');
    setIsAuthenticated(false);
    setAuthToken('');
  };

  const fetchAdminData = async (token: string) => {
    setLoadingData(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [ordersRes, custRes, storRes, statusRes, settRes] = await Promise.all([
        fetch('/api/orders', { headers }).then((r) => r.json()),
        fetch('/api/customers', { headers }).then((r) => r.json()),
        fetch('/api/storage/stats', { headers }).then((r) => r.json()),
        fetch('/api/status').then((r) => r.json()),
        fetch('/api/settings').then((r) => r.json()),
      ]);

      if (Array.isArray(ordersRes)) setOrders(ordersRes);
      if (Array.isArray(custRes)) setCustomers(custRes);
      if (storRes && !storRes.error) setStorageStats(storRes);
      if (statusRes) setSystemStatus(statusRes);
      if (settRes) setSettings(settRes);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  // Product CRUD
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: categories[0]?.name || 'Software & Applications',
      description: '',
      shortDescription: '',
      price: '',
      originalPrice: '',
      imageUrl: '/src/assets/images/creox_hero_showcase_1793972157432.jpg',
      features: '',
      deliveryType: 'zip_download',
      fileName: '',
      fileSizeMb: '',
      accessUrl: '',
      customInstructions: '',
      licenseKeys: '',
      isFeatured: false,
      isBestSeller: false,
      isActive: true,
    });
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      category: p.category,
      description: p.description,
      shortDescription: p.shortDescription || '',
      price: p.price.toString(),
      originalPrice: p.originalPrice.toString(),
      imageUrl: p.imageUrl,
      features: (p.features || []).join('\n'),
      deliveryType: p.deliveryType,
      fileName: p.fileName || '',
      fileSizeMb: p.fileSizeMb?.toString() || '',
      accessUrl: p.accessUrl || '',
      customInstructions: p.customInstructions || '',
      licenseKeys: '',
      isFeatured: p.isFeatured,
      isBestSeller: p.isBestSeller,
      isActive: p.isActive,
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    };

    const payload = {
      ...productForm,
      price: parseFloat(productForm.price),
      originalPrice: parseFloat(productForm.originalPrice) || parseFloat(productForm.price),
      features: productForm.features.split('\n').filter(Boolean),
      licenseKeys: productForm.licenseKeys ? productForm.licenseKeys.split('\n').filter(Boolean) : undefined,
      newLicenseKeys: productForm.licenseKeys ? productForm.licenseKeys.split('\n').filter(Boolean) : undefined,
    };

    try {
      if (editingProduct) {
        await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/products', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });
      }
      setProductModalOpen(false);
      onRefreshData();
      fetchAdminData(authToken);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      onRefreshData();
      fetchAdminData(authToken);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleProduct = async (id: string, field: string) => {
    try {
      await fetch(`/api/products/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ field }),
      });
      onRefreshData();
      fetchAdminData(authToken);
    } catch (err) {
      console.error(err);
    }
  };

  // Cloudflare R2 Upload Simulation
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setUploadProgress(10);

    // 1. Get presigned upload URL from backend
    try {
      const presignRes = await fetch('/api/storage/presigned-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          fileName: file.name,
          fileSizeBytes: file.size,
          fileType: file.type || 'application/zip',
        }),
      });

      const { uploadUrl, r2Key } = await presignRes.json();
      setUploadProgress(40);

      // 2. Direct upload to Cloudflare R2 (or virtual proxy)
      await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type || 'application/octet-stream' },
        body: file,
      });

      setUploadProgress(80);

      // 3. Register file in database
      await fetch('/api/storage/register-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          fileName: file.name,
          r2Key,
          fileSizeBytes: file.size,
          fileType: file.type || 'application/zip',
        }),
      });

      setUploadProgress(100);

      // Auto fill form
      setProductForm((prev: any) => ({
        ...prev,
        fileName: file.name,
        fileSizeMb: (file.size / (1024 * 1024)).toFixed(1),
        r2ObjectKey: r2Key,
      }));

      setTimeout(() => setUploadProgress(null), 1500);
      fetchAdminData(authToken);
    } catch (err) {
      console.error('File upload failed:', err);
      setUploadProgress(null);
    }
  };

  // Category CRUD
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return;

    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(categoryForm),
      });
      setCategoryModalOpen(false);
      setCategoryForm({ name: '', description: '', iconName: 'Folder' });
      onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete storage file
  const handleDeleteStorageFile = async (id: string) => {
    if (!confirm('Are you sure you want to delete this file from R2?')) return;
    try {
      await fetch(`/api/storage/files/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      fetchAdminData(authToken);
    } catch (err) {
      console.error(err);
    }
  };

  // Test download link generator
  const handleGenerateTestLink = async (r2Key: string, fileName: string) => {
    try {
      const res = await fetch('/api/storage/test-download-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ r2Key, fileName }),
      });
      const data = await res.json();
      if (data.downloadUrl) {
        window.open(data.downloadUrl, '_blank');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Change master admin passkey
  const handleUpdateAdminPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminPass || newAdminPass.trim().length < 4) {
      setPassChangeError('New password must be at least 4 characters long.');
      return;
    }
    setPassChangeLoading(true);
    setPassChangeSuccess('');
    setPassChangeError('');
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ newPassword: newAdminPass }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPassChangeSuccess('Admin master passkey successfully updated! Please remember this new password.');
        setNewAdminPass('');
      } else {
        setPassChangeError(data.error || 'Failed to update passkey.');
      }
    } catch (err) {
      setPassChangeError('Network error connecting to admin server.');
    } finally {
      setPassChangeLoading(false);
    }
  };

  // Overall KPIs
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'PAID')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const successfulPaymentsCount = orders.filter((o) => o.paymentStatus === 'PAID').length;
  const pendingPaymentsCount = orders.filter((o) => o.paymentStatus === 'PENDING').length;

  // Filtered orders list
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'ALL' && o.paymentStatus !== orderStatusFilter) return false;
    if (orderSearch) {
      const q = orderSearch.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        (o.bkashTrxId && o.bkashTrxId.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0a0f] text-slate-100">
        <div className="w-full max-w-md p-8 rounded-2xl bg-[#12121c] border border-white/10 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <CreoxLogo size="lg" showText={true} />
            </div>
            <h2 className="text-xl font-bold text-white">Administrator Access</h2>
            <p className="text-xs text-slate-400">
              Sign in with your master admin passkey to manage digital catalog, bKash payments, and R2 storage.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <div className="p-3 text-xs rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Admin Passkey *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password (e.g. admin123)"
                  className="w-full bg-[#0a1120] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">
                Default credentials configured: <code className="text-cyan-400 font-bold">admin123</code> or your custom <code className="text-cyan-400 font-bold">ADMIN_SECRET_KEY</code> in .env
              </p>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 text-xs font-semibold text-slate-400 bg-white/[0.04] hover:bg-white/[0.08] rounded-xl transition-colors cursor-pointer"
              >
                Return to Store
              </button>

              <button
                type="submit"
                disabled={authLoading}
                className="flex-1 py-2.5 text-xs font-extrabold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:opacity-95 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {authLoading ? 'Verifying...' : 'Unlock Portal'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#050811] text-slate-100 overflow-hidden">
      
      {/* Top Bar */}
      <header className="h-16 px-6 border-b border-white/[0.08] bg-[#090f1e] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <CreoxLogo size="sm" showText={true} />
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-bold text-cyan-300">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Master Control Center</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchAdminData(authToken)}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] rounded-lg transition-colors cursor-pointer"
          >
            Storefront
          </button>

          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar Tabs */}
        <aside className="w-64 border-r border-white/[0.08] bg-[#070b16] p-4 flex flex-col justify-between shrink-0 overflow-y-auto">
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('storage')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'storage'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <HardDrive className="w-4 h-4" />
              <span>Cloudflare R2</span>
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'customers'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Customers ({customers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Categories ({categories.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Integrations & Keys</span>
            </button>
          </nav>

          {/* Cloudflare Storage Gauge Widget */}
          {storageStats && (
            <div className="p-3.5 rounded-xl bg-[#0d1629] border border-white/5 space-y-2 mt-4">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">R2 Private Storage</span>
                <span className="font-bold text-white">{storageStats.totalUsedFormatted}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full"
                  style={{ width: `${Math.max(5, storageStats.quotaUsedPercent)}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500">
                {storageStats.quotaUsedPercent}% of 10GB free tier used
              </p>
            </div>
          )}
        </aside>

        {/* Dynamic Content Panel */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl font-extrabold text-white">Dashboard Overview</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Real-time sales, order fulfillment, and Cloudflare R2 storage metrics.
                </p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="p-5 rounded-2xl bg-[#12121c] border border-white/[0.08] space-y-2">
                  <p className="text-xs font-semibold text-slate-400">Total Revenue</p>
                  <p className="text-2xl font-extrabold text-emerald-400 font-display tabular-nums">
                    ৳ {totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-slate-500">Official bKash Settlement</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#12121c] border border-white/[0.08] space-y-2">
                  <p className="text-xs font-semibold text-slate-400">Total Orders</p>
                  <p className="text-2xl font-extrabold text-white font-display tabular-nums">
                    {orders.length}
                  </p>
                  <p className="text-[11px] text-emerald-400 font-medium">
                    {successfulPaymentsCount} Successful · {pendingPaymentsCount} Pending
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#0d1629] border border-white/[0.08] space-y-2">
                  <p className="text-xs font-semibold text-slate-400">Catalog Products</p>
                  <p className="text-2xl font-extrabold text-cyan-400 font-display tabular-nums">
                    {products.length}
                  </p>
                  <p className="text-[11px] text-slate-500">Across {categories.length} Categories</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#0d1629] border border-white/[0.08] space-y-2">
                  <p className="text-xs font-semibold text-slate-400">R2 Storage Volume</p>
                  <p className="text-2xl font-extrabold text-teal-400 font-display tabular-nums">
                    {storageStats?.totalUsedFormatted || '0 MB'}
                  </p>
                  <p className="text-[11px] text-slate-500">{storageStats?.totalFiles || 0} Digital Packages</p>
                </div>
              </div>

              {/* Recent Orders Preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Recent Orders</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-cyan-400 hover:underline font-bold"
                  >
                    View All Orders &rarr;
                  </button>
                </div>

                <div className="rounded-2xl bg-[#0d1629] border border-white/[0.08] overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#101b33] text-slate-400 border-b border-white/5 font-semibold">
                      <tr>
                        <th className="p-3.5">Order ID</th>
                        <th className="p-3.5">Customer</th>
                        <th className="p-3.5">Amount</th>
                        <th className="p-3.5">bKash TrxID</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5">Delivery</th>
                        <th className="p-3.5">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="hover:bg-white/[0.02]">
                          <td className="p-3.5 font-mono font-bold text-white">{ord.orderNumber}</td>
                          <td className="p-3.5 text-slate-300">
                            <p className="font-semibold">{ord.customerName}</p>
                            <p className="text-[10px] text-slate-500">{ord.customerEmail}</p>
                          </td>
                          <td className="p-3.5 font-bold text-white tabular-nums">
                            ৳{ord.totalAmount.toLocaleString()}
                          </td>
                          <td className="p-3.5 font-mono text-cyan-300 font-bold">
                            {ord.bkashTrxId || '—'}
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                ord.paymentStatus === 'PAID'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : ord.paymentStatus === 'PENDING'
                                  ? 'bg-cyan-500/20 text-cyan-400'
                                  : 'bg-red-500/20 text-red-400'
                              }`}
                            >
                              {ord.paymentStatus}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                ord.deliveryStatus === 'DELIVERED'
                                  ? 'bg-teal-500/20 text-teal-300'
                                  : 'bg-slate-700 text-slate-300'
                              }`}
                            >
                              {ord.deliveryStatus}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-500 text-[11px]">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bestselling Products */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white">Best Selling Products</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {products
                    .sort((a, b) => (b.totalSales || 0) - (a.totalSales || 0))
                    .slice(0, 3)
                    .map((p) => (
                      <div
                        key={p.id}
                        className="p-4 rounded-xl bg-[#0d1629] border border-white/5 flex items-center gap-3"
                      >
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-12 h-12 rounded-lg object-cover bg-slate-800 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">{p.name}</h4>
                          <p className="text-[11px] text-cyan-400 font-semibold">৳{p.price.toLocaleString()} BDT</p>
                          <p className="text-[10px] text-emerald-400 font-bold">{p.totalSales} units sold</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-white">Product Catalog Management</h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Add, edit, delete digital products, assign license keys, and manage R2 payloads.
                  </p>
                </div>

                <button
                  onClick={handleOpenAddProduct}
                  className="px-4 py-2.5 text-xs font-extrabold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-xl hover:opacity-95 transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4 text-slate-950" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="rounded-2xl bg-[#0d1629] border border-white/[0.08] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#101b33] text-slate-400 border-b border-white/5 font-semibold">
                    <tr>
                      <th className="p-3.5">Product</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Price</th>
                      <th className="p-3.5">Delivery Type</th>
                      <th className="p-3.5">Featured / Best Seller</th>
                      <th className="p-3.5">Sales</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-white/[0.02]">
                        <td className="p-3.5 flex items-center gap-3">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-800 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-white truncate max-w-xs">{p.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono">{p.slug}</p>
                          </div>
                        </td>
                        <td className="p-3.5 text-slate-300">{p.category}</td>
                        <td className="p-3.5 font-bold text-white tabular-nums">
                          ৳{p.price.toLocaleString()}
                          {p.discountPercentage > 0 && (
                            <span className="text-[10px] text-cyan-300 font-bold block">
                              -{p.discountPercentage}%
                            </span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/[0.05] text-slate-300">
                            {p.deliveryType}
                          </span>
                        </td>
                        <td className="p-3.5 space-x-1.5">
                          <button
                            onClick={() => handleToggleProduct(p.id, 'isFeatured')}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                              p.isFeatured ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-500'
                            }`}
                          >
                            Featured
                          </button>
                          <button
                            onClick={() => handleToggleProduct(p.id, 'isBestSeller')}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                              p.isBestSeller ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                            }`}
                          >
                            Best Seller
                          </button>
                        </td>
                        <td className="p-3.5 font-bold text-emerald-400 tabular-nums">
                          {p.totalSales}
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditProduct(p)}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/[0.05] rounded-md transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-white">Order Management</h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Monitor real bKash transactions, customer details, and digital delivery status.
                  </p>
                </div>

                {/* Filter and Search */}
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search Order ID, Email, TrxID..."
                    className="bg-[#0a1120] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="bg-[#0a1120] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="PAID">Paid Only</option>
                    <option value="PENDING">Pending</option>
                    <option value="FAILED">Failed</option>
                  </select>
                </div>
              </div>

              {/* Orders Table */}
              <div className="rounded-2xl bg-[#0d1629] border border-white/[0.08] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#101b33] text-slate-400 border-b border-white/5 font-semibold">
                    <tr>
                      <th className="p-3.5">Order ID</th>
                      <th className="p-3.5">Customer & Phone</th>
                      <th className="p-3.5">Products</th>
                      <th className="p-3.5">Amount</th>
                      <th className="p-3.5">bKash TrxID</th>
                      <th className="p-3.5">Payment</th>
                      <th className="p-3.5">Delivery Status</th>
                      <th className="p-3.5">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-white/[0.02]">
                        <td className="p-3.5 font-mono font-bold text-white">{ord.orderNumber}</td>
                        <td className="p-3.5 text-slate-300">
                          <p className="font-semibold text-white">{ord.customerName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{ord.customerPhone}</p>
                          <p className="text-[10px] text-slate-500">{ord.customerEmail}</p>
                        </td>
                        <td className="p-3.5">
                          {ord.items.map((it) => (
                            <div key={it.id} className="text-slate-300">
                              <span>{it.productName}</span>{' '}
                              <span className="text-slate-500 font-mono">x{it.quantity}</span>
                              {it.assignedKey && (
                                <p className="text-[10px] text-cyan-400 font-mono font-bold">
                                  Key: {it.assignedKey}
                                </p>
                              )}
                            </div>
                          ))}
                        </td>
                        <td className="p-3.5 font-bold text-white tabular-nums">
                          ৳{ord.totalAmount.toLocaleString()}
                        </td>
                        <td className="p-3.5 font-mono text-cyan-300 font-bold">
                          {ord.bkashTrxId || '—'}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              ord.paymentStatus === 'PAID'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : ord.paymentStatus === 'PENDING'
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {ord.paymentStatus}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              ord.deliveryStatus === 'DELIVERED'
                                ? 'bg-cyan-500/20 text-cyan-400'
                                : 'bg-slate-700 text-slate-300'
                            }`}
                          >
                            {ord.deliveryStatus}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-500 text-[11px]">
                          {new Date(ord.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: CLOUDFLARE R2 STORAGE */}
          {activeTab === 'storage' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-white">Cloudflare R2 Digital Storage</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Private bucket <code className="text-cyan-400 font-bold">creox-products</code> with temporary presigned download tokens.
                </p>
              </div>

              {/* R2 Storage Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="p-5 rounded-2xl bg-[#0d1629] border border-white/[0.08] space-y-2">
                  <p className="text-xs font-semibold text-slate-400">Total Storage Used</p>
                  <p className="text-2xl font-extrabold text-cyan-400 font-display tabular-nums">
                    {storageStats?.totalUsedFormatted || '0 MB'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Remaining Quota: {(10 - (storageStats?.totalUsedBytes || 0) / (1024 * 1024 * 1024)).toFixed(2)} GB
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#0d1629] border border-white/[0.08] space-y-2">
                  <p className="text-xs font-semibold text-slate-400">Total File Packages</p>
                  <p className="text-2xl font-extrabold text-white font-display tabular-nums">
                    {storageStats?.totalFiles || 0}
                  </p>
                  <p className="text-[11px] text-slate-500">ZIP, PDF, EXE, APK, PSD, Figma</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#0d1629] border border-white/[0.08] space-y-2">
                  <p className="text-xs font-semibold text-slate-400">Security Architecture</p>
                  <p className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Private S3 Bucket</span>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Zero public URLs. Presigned HMAC tokens only.
                  </p>
                </div>
              </div>

              {/* Upload New Digital File to R2 */}
              <div className="p-6 rounded-2xl bg-[#0d1629] border border-dashed border-white/20 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mx-auto flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Upload Digital Product File to R2</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Supports ZIP, PDF, EXE, APK, PSD, MP4 up to multi-gigabyte files.
                  </p>
                </div>

                <label className="inline-block px-5 py-2.5 bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-extrabold rounded-xl text-xs transition-all cursor-pointer shadow-md hover:opacity-95">
                  <span>Select & Upload File</span>
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>

                {uploadProgress !== null && (
                  <div className="max-w-xs mx-auto space-y-1 pt-2">
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-cyan-500"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Uploading {uploadedFileName} ({uploadProgress}%)
                    </p>
                  </div>
                )}
              </div>

              {/* Storage Files List */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white">Files in Bucket</h3>
                <div className="rounded-2xl bg-[#0d1629] border border-white/[0.08] overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#101b33] text-slate-400 border-b border-white/5 font-semibold">
                      <tr>
                        <th className="p-3.5">File Name</th>
                        <th className="p-3.5">R2 Object Key</th>
                        <th className="p-3.5">File Size</th>
                        <th className="p-3.5">Upload Date</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {storageStats?.largestFiles.map((file) => (
                        <tr key={file.id} className="hover:bg-white/[0.02]">
                          <td className="p-3.5 font-bold text-white flex items-center gap-2">
                            <HardDrive className="w-4 h-4 text-cyan-400 shrink-0" />
                            <span>{file.fileName}</span>
                          </td>
                          <td className="p-3.5 font-mono text-slate-400">{file.r2Key}</td>
                          <td className="p-3.5 font-bold text-cyan-300 tabular-nums">
                            {file.fileSizeFormatted}
                          </td>
                          <td className="p-3.5 text-slate-500">
                            {new Date(file.uploadedAt).toLocaleDateString()}
                          </td>
                          <td className="p-3.5 text-right space-x-2">
                            <button
                              onClick={() => handleGenerateTestLink(file.r2Key, file.fileName)}
                              className="px-2.5 py-1 text-[11px] font-semibold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 rounded-md transition-colors cursor-pointer"
                              title="Test presigned download"
                            >
                              Test Download
                            </button>
                            <button
                              onClick={() => handleDeleteStorageFile(file.id)}
                              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors cursor-pointer"
                              title="Delete file"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CUSTOMERS MANAGEMENT */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-white">Customer Directory</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Verified customer profiles, purchase history, and lifetime spending value.
                </p>
              </div>

              <div className="rounded-2xl bg-[#12121c] border border-white/[0.08] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#181826] text-slate-400 border-b border-white/5 font-semibold">
                    <tr>
                      <th className="p-3.5">Customer Name</th>
                      <th className="p-3.5">Email Address</th>
                      <th className="p-3.5">Phone Number</th>
                      <th className="p-3.5">Orders</th>
                      <th className="p-3.5">Total Spent</th>
                      <th className="p-3.5">Last Purchase</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {customers.map((c) => (
                      <tr key={c.id} className="hover:bg-white/[0.02]">
                        <td className="p-3.5 font-bold text-white">{c.name}</td>
                        <td className="p-3.5 text-slate-300">{c.email}</td>
                        <td className="p-3.5 font-mono text-cyan-300 font-bold">{c.phone}</td>
                        <td className="p-3.5 font-bold text-white tabular-nums">{c.orderCount}</td>
                        <td className="p-3.5 font-bold text-emerald-400 tabular-nums">
                          ৳{c.totalPurchases.toLocaleString()}
                        </td>
                        <td className="p-3.5 text-slate-500 text-[11px]">
                          {c.lastOrderDate ? new Date(c.lastOrderDate).toLocaleDateString() : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: CATEGORIES MANAGEMENT */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-extrabold text-white">Product Categories</h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage categories to organize digital products across the storefront.
                  </p>
                </div>

                <button
                  onClick={() => setCategoryModalOpen(true)}
                  className="px-4 py-2.5 text-xs font-extrabold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-xl hover:opacity-95 transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-slate-950" />
                  <span>Add Category</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-5 rounded-2xl bg-[#0d1629] border border-white/5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">{cat.name}</h4>
                      <span className="text-[11px] font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                        {cat.productCount} products
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{cat.description}</p>
                    <p className="text-[10px] text-slate-500 font-mono">Slug: {cat.slug}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: INTEGRATIONS & SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-8 max-w-4xl">
              <div>
                <h1 className="text-2xl font-extrabold text-white">Integrations & Environment Status</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Check live connections for Supabase, Cloudflare R2, bKash Merchant API, and Resend.
                </p>
              </div>

              {/* Status Diagnostic Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="p-5 rounded-2xl bg-[#12121c] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">1. Supabase PostgreSQL</h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        systemStatus?.integrations?.supabase?.configured
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {systemStatus?.integrations?.supabase?.configured ? 'CONNECTED' : 'LOCAL FALLBACK'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {systemStatus?.integrations?.supabase?.status}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Schema file ready at: /supabase/schema.sql
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#12121c] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">2. Cloudflare R2 Storage</h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        systemStatus?.integrations?.cloudflareR2?.configured
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-cyan-500/20 text-cyan-300'
                      }`}
                    >
                      {systemStatus?.integrations?.cloudflareR2?.configured ? 'R2 ACTIVE' : 'VIRTUAL VAULT'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {systemStatus?.integrations?.cloudflareR2?.status}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Bucket: creox-products · Custom Domain: download.creox.com
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#0d1629] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">3. bKash Merchant Gateway</h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        systemStatus?.integrations?.bKash?.configured
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-cyan-500/20 text-cyan-300'
                      }`}
                    >
                      {systemStatus?.integrations?.bKash?.configured ? 'LIVE API' : 'SANDBOX SIMULATOR'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {systemStatus?.integrations?.bKash?.mode}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Base URL: {systemStatus?.integrations?.bKash?.baseUrl}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#12121c] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">4. Transactional Emails (Resend)</h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        systemStatus?.integrations?.resend?.configured
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {systemStatus?.integrations?.resend?.configured ? 'CONNECTED' : 'DISPATCH LOGGER'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {systemStatus?.integrations?.resend?.status}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Receipts auto-sent with Creox branding on every order.
                  </p>
                </div>
              </div>

              {/* Delivery Rules Configuration */}
              <div className="p-6 rounded-2xl bg-[#12121c] border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white">Automated Delivery Rules</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Download Link Expiry (Hours)
                    </label>
                    <input
                      type="number"
                      defaultValue={72}
                      className="w-full bg-[#181826] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Max Allowed Downloads per Link
                    </label>
                    <input
                      type="number"
                      defaultValue={5}
                      className="w-full bg-[#181826] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Passkey & Security Management */}
              <div className="p-6 rounded-2xl bg-[#12121c] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Lock className="w-4 h-4 text-cyan-400" />
                      <span>Admin Master Passkey & Security</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Change the master password used to log into this CREOX Admin Dashboard.
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-2.5 py-1 rounded-lg">
                    Active: admin123 (or custom)
                  </span>
                </div>

                {passChangeSuccess && (
                  <div className="p-3 text-xs rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{passChangeSuccess}</span>
                  </div>
                )}

                {passChangeError && (
                  <div className="p-3 text-xs rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{passChangeError}</span>
                  </div>
                )}

                <form onSubmit={handleUpdateAdminPassword} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                  <div className="relative flex-1">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={newAdminPass}
                      onChange={(e) => setNewAdminPass(e.target.value)}
                      placeholder="Type new master password (min 4 chars)..."
                      className="w-full bg-[#181826] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={passChangeLoading}
                    className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50 whitespace-nowrap"
                  >
                    {passChangeLoading ? 'Saving...' : 'Update Admin Password'}
                  </button>
                </form>
                <p className="text-[11px] text-slate-500">
                  Tip: You can also permanently set <code className="text-cyan-400 font-mono">ADMIN_SECRET_KEY="your_password"</code> in your <code className="text-slate-300 font-mono">.env</code> file.
                </p>
              </div>

              {/* Master Environment Secrets & API Keys Reference Guide */}
              <div className="p-6 rounded-2xl bg-[#0e121e] border border-white/10 space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-emerald-400" />
                    <span>All Secret Keys & Environment Variables (How to get & change)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Every key used in CREOX, where to obtain it, and how to configure it.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Item 1: bKash Merchant API */}
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-pink-400">1. bKash Merchant Checkout API</span>
                      <span className="text-[10px] text-slate-400 font-mono">developer.bka.sh</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      <strong>Keys needed:</strong> <code className="text-cyan-300">BKASH_APP_KEY</code>, <code className="text-cyan-300">BKASH_APP_SECRET</code>, <code className="text-cyan-300">BKASH_USERNAME</code>, <code className="text-cyan-300">BKASH_PASSWORD</code>, <code className="text-cyan-300">BKASH_BASE_URL</code>
                    </p>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      <strong>How to get:</strong> Apply for bKash Merchant Account at bKash or request Sandbox testing keys at <a href="https://developer.bka.sh" target="_blank" rel="noreferrer" className="text-pink-400 underline">bKash Developer Portal</a>.
                    </p>
                    <p className="text-slate-500 text-[10px]">
                      * Note: Until you provide live keys, CREOX automatically runs in <strong>Sandbox Simulator mode</strong> (any 11-digit phone number + OTP 123456 + PIN 12345 works).
                    </p>
                  </div>

                  {/* Item 2: Cloudflare R2 Storage */}
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-orange-400">2. Cloudflare R2 Digital File Storage</span>
                      <span className="text-[10px] text-slate-400 font-mono">dash.cloudflare.com</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      <strong>Keys needed:</strong> <code className="text-cyan-300">R2_ACCOUNT_ID</code>, <code className="text-cyan-300">R2_ACCESS_KEY_ID</code>, <code className="text-cyan-300">R2_SECRET_ACCESS_KEY</code>, <code className="text-cyan-300">R2_BUCKET_NAME</code>
                    </p>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      <strong>How to get:</strong> Login to Cloudflare → R2 Object Storage → Create Bucket (e.g. <code>creox-products</code>) → Manage R2 API Tokens → Create Token with Read & Write permissions.
                    </p>
                  </div>

                  {/* Item 3: Supabase PostgreSQL */}
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-400">3. Supabase PostgreSQL & Auth</span>
                      <span className="text-[10px] text-slate-400 font-mono">supabase.com</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      <strong>Keys needed:</strong> <code className="text-cyan-300">NEXT_PUBLIC_SUPABASE_URL</code>, <code className="text-cyan-300">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, <code className="text-cyan-300">SUPABASE_SERVICE_ROLE_KEY</code>
                    </p>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      <strong>How to get:</strong> Login to Supabase → Create New Project → Project Settings → API → Copy Project URL and Service Role Key.
                    </p>
                  </div>

                  {/* Item 4: Resend Email */}
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-400">4. Resend Transactional Email</span>
                      <span className="text-[10px] text-slate-400 font-mono">resend.com</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      <strong>Keys needed:</strong> <code className="text-cyan-300">RESEND_API_KEY</code>, <code className="text-cyan-300">EMAIL_FROM</code>
                    </p>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      <strong>How to get:</strong> Register at resend.com → API Keys → Create API Key (starting with <code>re_...</code>).
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-slate-300">
                  <p className="font-semibold text-cyan-300 mb-1">How to change all these keys:</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Open the <code className="text-white font-mono">.env</code> file in your project root, paste your actual keys, and restart the server. CREOX will automatically switch to Live bKash checkout and live R2 cloud bucket!
                  </p>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Product Add / Edit Modal */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-[#12121c] border border-white/10 shadow-2xl overflow-hidden my-4">
            <div className="px-6 py-4 border-b border-white/10 bg-[#181826] flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                {editingProduct ? 'Edit Digital Product' : 'Add New Digital Product'}
              </h3>
              <button
                onClick={() => setProductModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. Next.js 15 Pro Template"
                    className="w-full bg-[#181826] border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-[#181826] border border-white/10 rounded-xl px-3 py-2 text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Selling Price (৳ BDT) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="e.g. 2490"
                    className="w-full bg-[#181826] border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Original Price (৳ BDT)</label>
                  <input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    placeholder="e.g. 4500"
                    className="w-full bg-[#181826] border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Delivery Mechanism *</label>
                  <select
                    value={productForm.deliveryType}
                    onChange={(e) => setProductForm({ ...productForm, deliveryType: e.target.value })}
                    className="w-full bg-[#181826] border border-white/10 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="zip_download">ZIP Download (Cloudflare R2)</option>
                    <option value="license_key">License Key (Automatic Pool)</option>
                    <option value="pdf_ebook">PDF / E-book</option>
                    <option value="software_file">Software / EXE Installer</option>
                    <option value="access_link">Access Portal Link</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Image URL / Asset Path</label>
                <input
                  type="text"
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  className="w-full bg-[#181826] border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-[#181826] border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Key Features (One per line)</label>
                <textarea
                  rows={3}
                  value={productForm.features}
                  onChange={(e) => setProductForm({ ...productForm, features: e.target.value })}
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  className="w-full bg-[#181826] border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              {/* Conditional License Keys Pool input */}
              {productForm.deliveryType === 'license_key' && (
                <div className="p-4 rounded-xl bg-[#0b1323] border border-cyan-500/30 space-y-2">
                  <label className="block font-bold text-cyan-300">
                    Add License Keys Pool (One code per line)
                  </label>
                  <textarea
                    rows={3}
                    value={productForm.licenseKeys}
                    onChange={(e) => setProductForm({ ...productForm, licenseKeys: e.target.value })}
                    placeholder="KEY-1234-ABCD-EFGH&#10;KEY-5678-IJKL-MNOP"
                    className="w-full bg-[#070d18] border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
                  />
                  <p className="text-[10px] text-slate-400">
                    Each key is assigned to one customer upon bKash payment verification and marked as used.
                  </p>
                </div>
              )}

              {/* Conditional File / Access Link info */}
              {productForm.deliveryType === 'access_link' && (
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Access URL</label>
                  <input
                    type="url"
                    value={productForm.accessUrl}
                    onChange={(e) => setProductForm({ ...productForm, accessUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full bg-[#0b1323] border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              )}

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isFeatured}
                    onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                    className="rounded text-cyan-500 focus:ring-cyan-400"
                  />
                  <span>Mark as Featured</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isBestSeller}
                    onChange={(e) => setProductForm({ ...productForm, isBestSeller: e.target.checked })}
                    className="rounded text-emerald-500 focus:ring-emerald-400"
                  />
                  <span>Mark as Best Seller</span>
                </label>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:opacity-95 text-slate-950 rounded-xl font-extrabold shadow-md cursor-pointer"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#0a1120] border border-white/10 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-bold text-white">Create New Category</h3>
            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g. 3D Game Assets"
                  className="w-full bg-[#0b1323] border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  placeholder="Short overview..."
                  className="w-full bg-[#0b1323] border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:opacity-95 text-slate-950 rounded-xl font-extrabold shadow-md cursor-pointer"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
