export type ProductCategory =
  | 'Software & Applications'
  | 'Premium Subscriptions'
  | 'AI Tools'
  | 'Graphics & Design'
  | 'Templates & Digital Assets'
  | 'PDF & E-books'
  | 'Courses & Learning Resources'
  | 'Other Digital Products';

export type DeliveryType =
  | 'zip_download'
  | 'pdf_ebook'
  | 'software_file'
  | 'graphics_template'
  | 'license_key'
  | 'activation_code'
  | 'access_link'
  | 'custom_instructions';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';
export type DeliveryStatus = 'PENDING' | 'DELIVERED' | 'FAILED';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory | string;
  description: string;
  shortDescription?: string;
  price: number; // In BDT
  originalPrice: number;
  discountPercentage: number;
  imageUrl: string;
  secondaryImages?: string[];
  features: string[];
  specifications?: Record<string, string>;
  deliveryType: DeliveryType;
  fileName?: string;
  fileSizeMb?: number;
  downloadUrl?: string;
  fileData?: string;
  r2ObjectKey?: string;
  accessUrl?: string;
  customInstructions?: string;
  licenseKeys?: string[];
  licenseKeysAvailable?: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  isActive: boolean;
  totalSales: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface LicenseKey {
  id: string;
  productId: string;
  keyCode: string;
  isUsed: boolean;
  orderId?: string;
  assignedAt?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  productCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalPurchases: number;
  orderCount: number;
  lastOrderDate: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  deliveryType: DeliveryType;
  assignedKey?: string;
  downloadToken?: string;
  downloadUrl?: string;
  expiresAt?: string;
  accessLink?: string;
  customInstructions?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalAmount: number;
  currency: 'BDT';
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  bkashPaymentId?: string;
  bkashTrxId?: string;
  paymentDate?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface DigitalFile {
  id: string;
  fileName: string;
  r2Key: string;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  fileType: string;
  productId?: string;
  uploadedAt: string;
}

export interface DownloadToken {
  id: string;
  token: string;
  orderId: string;
  productId: string;
  r2Key: string;
  fileName: string;
  expiresAt: string;
  maxDownloads: number;
  downloadCount: number;
  isRevoked: boolean;
}

export interface CustomerReview {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  date: string;
}

export interface WebsiteSettings {
  siteName: string;
  headline: string;
  subheadline: string;
  supportEmail: string;
  supportPhone: string;
  supportWhatsapp: string;
  address: string;
  announcementText: string;
  announcementActive: boolean;
  facebookUrl: string;
  telegramUrl: string;
  youtubeUrl: string;
  twitterUrl: string;
  downloadExpiryHours: number;
  maxDownloadLimit: number;
}

export interface StorageStats {
  totalUsedBytes: number;
  totalUsedFormatted: string;
  totalFiles: number;
  quotaBytes: number; // default 10GB free tier
  quotaFormatted: string;
  quotaUsedPercent: number;
  largestFiles: DigitalFile[];
}
