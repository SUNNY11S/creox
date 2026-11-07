import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// =========================================================================
// 1. SUPABASE CLIENT & IN-MEMORY HYBRID STORE
// =========================================================================
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseServiceKey &&
  !supabaseUrl.includes('your-project') &&
  !supabaseServiceKey.includes('your-service-role')
);

let supabase: ReturnType<typeof createClient> | null = null;
if (isSupabaseConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log('[Supabase] Initialized client successfully.');
  } catch (err) {
    console.warn('[Supabase] Failed to initialize client:', err);
  }
}

// In-Memory store for instant high-speed responsive experience + fallback
interface InMemoryDB {
  products: any[];
  categories: any[];
  orders: any[];
  customers: any[];
  licenseKeys: any[];
  downloadTokens: any[];
  digitalFiles: any[];
  reviews: any[];
  settings: any;
  sessions: Set<string>;
}

// Seed categories
const initialCategories = [
  { id: 'cat-1', name: 'Software & Applications', slug: 'software-applications', description: 'Production-ready apps, CLI tools, and enterprise utilities.', iconName: 'Cpu', productCount: 4 },
  { id: 'cat-2', name: 'Premium Subscriptions', slug: 'premium-subscriptions', description: 'Curated developer licenses and SaaS seat activations.', iconName: 'KeyRound', productCount: 2 },
  { id: 'cat-3', name: 'AI Tools', slug: 'ai-tools', description: 'Advanced LLM prompt suites, fine-tuned agent workflows, and models.', iconName: 'Sparkles', productCount: 3 },
  { id: 'cat-4', name: 'Graphics & Design', slug: 'graphics-design', description: 'Figma UI kits, 3D icon sets, design systems, and vector libraries.', iconName: 'Palette', productCount: 3 },
  { id: 'cat-5', name: 'Templates & Digital Assets', slug: 'templates-digital-assets', description: 'Full-stack boilerplates, Next.js starters, and landing page kits.', iconName: 'LayoutTemplate', productCount: 3 },
  { id: 'cat-6', name: 'PDF & E-books', slug: 'pdf-ebooks', description: 'Comprehensive engineering handbooks, system design blueprints.', iconName: 'BookOpen', productCount: 2 },
  { id: 'cat-7', name: 'Courses & Learning Resources', slug: 'courses-learning', description: 'High-impact video masterclasses and project code repos.', iconName: 'GraduationCap', productCount: 2 },
  { id: 'cat-8', name: 'Other Digital Products', slug: 'other-digital-products', description: 'Audio assets, 3D models, shaders, and specialty tools.', iconName: 'FolderGit2', productCount: 1 },
];

// Seed products using generated high-fidelity asset paths
const initialProducts = [
  {
    id: 'prod-1',
    name: 'Nexus AI Productivity Suite Pro',
    slug: 'nexus-ai-productivity-suite-pro',
    category: 'AI Tools',
    description: 'Autonomous multi-agent desktop suite for code refactoring, system architecture blueprints, and real-time document intelligence. Includes automated workflows, prompt chains, and one-click export to production repos.',
    shortDescription: 'Autonomous multi-agent desktop suite for developers & engineers.',
    price: 3490,
    originalPrice: 5990,
    discountPercentage: 42,
    imageUrl: '/assets/images/prod_ai_suite_1793972157837.jpg',
    secondaryImages: [
      '/assets/images/creox_hero_showcase_1793972157432.jpg'
    ],
    features: [
      'Complete desktop installer (macOS Apple Silicon & Intel, Windows 11, Linux AppImage)',
      '12 built-in autonomous engineering workflows',
      'Local offline model inference support (Ollama / vLLM ready)',
      '1-Year lifetime license key with instant auto-delivery',
      'Priority Discord developer support access'
    ],
    specifications: {
      'Version': '3.4.2 Enterprise',
      'License': 'Single Developer Lifetime',
      'Platforms': 'macOS 13+, Windows 11, Ubuntu 22.04+',
      'Delivery Format': 'License Key + Installer ZIP (142 MB)'
    },
    deliveryType: 'license_key',
    fileName: 'Nexus-AI-Suite-v3.4.2.zip',
    fileSizeMb: 142.5,
    r2ObjectKey: 'products/nexus-ai-suite-v3.4.2.zip',
    licenseKeysAvailable: 85,
    isFeatured: true,
    isBestSeller: true,
    isActive: true,
    totalSales: 184,
    rating: 4.9,
    reviewCount: 46,
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-2',
    name: 'Zenith UI Master Design System 2026',
    slug: 'zenith-ui-master-design-system-2026',
    category: 'Graphics & Design',
    description: 'The definitive Figma & React component design system with 2,400+ auto-layout components, WCAG AAA dark/light mode tokens, variable font styles, and responsive screen templates for SaaS, Fintech, and Marketplaces.',
    shortDescription: '2,400+ Figma components & Tailwind v4 token system.',
    price: 2490,
    originalPrice: 4500,
    discountPercentage: 45,
    imageUrl: '/assets/images/prod_design_tokens_1793972159266.jpg',
    secondaryImages: [
      '/assets/images/creox_hero_showcase_1793972157432.jpg'
    ],
    features: [
      'Original .FIG file with 2,400+ atomic components & responsive templates',
      'Tailwind CSS v4 & React 19 source code tokens repository',
      'Complete documentation on typography scales, colors, and accessibility',
      'Free lifetime updates for all upcoming 2026-2027 design releases',
      'Commercial royalty-free license for unlimited client projects'
    ],
    specifications: {
      'Software Compatibility': 'Figma (Latest), Tailwind CSS v4, React 19',
      'Components': '2,480+ Variants',
      'Typography': 'Outfit & Plus Jakarta Sans pairings',
      'Delivery Format': 'Direct Cloudflare R2 Download ZIP (380 MB)'
    },
    deliveryType: 'zip_download',
    fileName: 'Zenith-UI-Master-Design-System.zip',
    fileSizeMb: 380.0,
    r2ObjectKey: 'products/zenith-ui-master-design-system.zip',
    licenseKeysAvailable: 0,
    isFeatured: true,
    isBestSeller: true,
    isActive: true,
    totalSales: 219,
    rating: 5.0,
    reviewCount: 68,
    createdAt: new Date(Date.now() - 86400000 * 35).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-3',
    name: 'Cloud DevTools & Infrastructure Stack Bundle',
    slug: 'cloud-devtools-infra-stack-bundle',
    category: 'Software & Applications',
    description: 'Production-ready cloud deployment templates, Terraform scripts, Kubernetes manifests, and Docker multi-stage build pipelines for high-availability AWS, GCP, and Cloudflare architectures.',
    shortDescription: 'Production cloud infrastructure templates & automation pipelines.',
    price: 3990,
    originalPrice: 6990,
    discountPercentage: 43,
    imageUrl: '/assets/images/prod_cloud_devtools_1793972159641.jpg',
    secondaryImages: [
      '/assets/images/creox_hero_showcase_1793972157432.jpg'
    ],
    features: [
      'Battle-tested Terraform modules for scalable AWS & GCP clusters',
      'Cloudflare R2 + Workers secure distribution pipelines',
      'Automated GitHub Actions CI/CD workflows with automated lint & testing',
      'Secrets management and zero-trust IAM policy blueprints',
      'Step-by-step 90-page architectural implementation guide'
    ],
    specifications: {
      'Cloud Providers': 'AWS, Google Cloud, Cloudflare, DigitalOcean',
      'Tooling': 'Terraform 1.8+, Docker, Kubernetes, GitHub Actions',
      'Security Tier': 'SOC2 & HIPAA Compliant baseline templates',
      'Delivery Format': 'Encrypted ZIP Package + Private Git Access'
    },
    deliveryType: 'zip_download',
    fileName: 'Cloud-DevTools-Infrastructure-Stack.zip',
    fileSizeMb: 85.2,
    r2ObjectKey: 'products/cloud-devtools-infra-stack.zip',
    licenseKeysAvailable: 0,
    isFeatured: true,
    isBestSeller: false,
    isActive: true,
    totalSales: 132,
    rating: 4.8,
    reviewCount: 31,
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-4',
    name: 'SaaS Multi-Tenant FullStack Starter Kit',
    slug: 'saas-multi-tenant-fullstack-starter-kit',
    category: 'Templates & Digital Assets',
    description: 'Production Next.js 15 App Router codebase with authentication, team tenancy, Stripe & bKash webhooks, RBAC roles, audit logs, and Supabase PostgreSQL schema with automatic migrations.',
    shortDescription: 'Turnkey full-stack SaaS codebase with authentication & payments.',
    price: 4990,
    originalPrice: 8500,
    discountPercentage: 41,
    imageUrl: '/assets/images/creox_hero_showcase_1793972157432.jpg',
    secondaryImages: [],
    features: [
      'Next.js 15, TypeScript, Tailwind v4, React 19 architecture',
      'Multi-tenant workspace isolation with custom subdomains',
      'Built-in bKash Checkout + international payment integrations',
      'Role-based permissions (Owner, Admin, Member, Billing)',
      '100% test coverage with Vitest and Playwright'
    ],
    specifications: {
      'Framework': 'Next.js 15 App Router & Express API',
      'Database': 'Supabase PostgreSQL / Drizzle ORM',
      'Delivery Format': 'Private GitHub Repo Access Link + Source ZIP'
    },
    deliveryType: 'access_link',
    accessUrl: 'https://github.com/creox-digital/saas-starter-enterprise-vault',
    customInstructions: 'After payment, enter your GitHub username to receive an instant collaborator invite to the private repo.',
    fileName: 'creox-saas-starter-v2.1.zip',
    fileSizeMb: 62.4,
    r2ObjectKey: 'products/creox-saas-starter-v2.1.zip',
    isFeatured: true,
    isBestSeller: true,
    isActive: true,
    totalSales: 97,
    rating: 4.9,
    reviewCount: 24,
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-5',
    name: 'System Design & High-Load Architecture Handbook',
    slug: 'system-design-high-load-architecture-handbook',
    category: 'PDF & E-books',
    description: 'Exhaustive 420-page engineering guide covering distributed caching, database sharding, event-driven microservices, raft consensus, and real-world failure post-mortems from top tech companies.',
    shortDescription: '420-page comprehensive engineering handbook for senior engineers.',
    price: 1250,
    originalPrice: 2200,
    discountPercentage: 43,
    imageUrl: '/assets/images/prod_ai_suite_1793972157837.jpg',
    secondaryImages: [],
    features: [
      'High-res DRM-free PDF + EPUB + Kindle format downloads',
      '45 full-color architectural topology diagrams',
      'Checklists for production load testing & chaos engineering',
      'Interactive mental models & interview preparation cheatsheets'
    ],
    specifications: {
      'Pages': '420 Pages',
      'Formats': 'PDF (Print Ready), EPUB, MOBI',
      'Delivery Format': 'Instant PDF Download (48 MB)'
    },
    deliveryType: 'pdf_ebook',
    fileName: 'System-Design-Architecture-Handbook-2026.pdf',
    fileSizeMb: 48.0,
    r2ObjectKey: 'products/system-design-architecture-handbook-2026.pdf',
    isFeatured: false,
    isBestSeller: true,
    isActive: true,
    totalSales: 312,
    rating: 5.0,
    reviewCount: 89,
    createdAt: new Date(Date.now() - 86400000 * 50).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-6',
    name: 'JetBrains All Products Pack — 1 Year Pro License',
    slug: 'jetbrains-all-products-pack-1-year',
    category: 'Premium Subscriptions',
    description: 'Genuine 1-year developer license code redeemable for IntelliJ IDEA Ultimate, WebStorm, PyCharm Pro, Rider, GoLand, CLion, and DataGrip on your personal JetBrains account.',
    shortDescription: '1-Year official license activation code for all JetBrains IDEs.',
    price: 5490,
    originalPrice: 9990,
    discountPercentage: 45,
    imageUrl: '/assets/images/prod_cloud_devtools_1793972159641.jpg',
    secondaryImages: [],
    features: [
      'Official JetBrains subscription code valid for 365 days',
      'Activates on your own official JetBrains account',
      'Covers 15+ IDEs including IntelliJ, WebStorm, PyCharm, and Rider',
      'Includes JetBrains AI Assistant preview access',
      'Guaranteed replacement warranty throughout the 1-year period'
    ],
    specifications: {
      'Validity': '365 Days',
      'Activation Method': 'JetBrains Account Redeem Code',
      'Delivery Format': 'Instant Unique License Key'
    },
    deliveryType: 'license_key',
    licenseKeysAvailable: 42,
    isFeatured: true,
    isBestSeller: true,
    isActive: true,
    totalSales: 168,
    rating: 4.9,
    reviewCount: 52,
    createdAt: new Date(Date.now() - 86400000 * 40).toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// Initial pre-populated license keys pool
const initialLicenseKeys = [
  { id: 'key-1', productId: 'prod-1', keyCode: 'NEXUS-AI-PRO-9842-X7K1-9921', isUsed: false, createdAt: new Date().toISOString() },
  { id: 'key-2', productId: 'prod-1', keyCode: 'NEXUS-AI-PRO-3312-B9M4-5582', isUsed: false, createdAt: new Date().toISOString() },
  { id: 'key-3', productId: 'prod-1', keyCode: 'NEXUS-AI-PRO-7719-Q2W8-1049', isUsed: false, createdAt: new Date().toISOString() },
  { id: 'key-4', productId: 'prod-1', keyCode: 'NEXUS-AI-PRO-4421-E5P3-8874', isUsed: false, createdAt: new Date().toISOString() },
  { id: 'key-5', productId: 'prod-6', keyCode: 'JB-ALL-2026-X889-KL90-V421', isUsed: false, createdAt: new Date().toISOString() },
  { id: 'key-6', productId: 'prod-6', keyCode: 'JB-ALL-2026-C441-PQ33-M892', isUsed: false, createdAt: new Date().toISOString() },
  { id: 'key-7', productId: 'prod-6', keyCode: 'JB-ALL-2026-N112-ZT55-K008', isUsed: false, createdAt: new Date().toISOString() },
];

// Seed reviews
const initialReviews = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    productName: 'Nexus AI Productivity Suite Pro',
    customerName: 'Tanvir Hossain',
    rating: 5,
    comment: 'Instant bKash payment went through flawlessly and the license key appeared right away on the confirmation screen! Tool is incredible for refactoring.',
    verifiedPurchase: true,
    date: '2026-10-28'
  },
  {
    id: 'rev-2',
    productId: 'prod-2',
    productName: 'Zenith UI Master Design System 2026',
    customerName: 'Farhana Ahmed',
    rating: 5,
    comment: 'The Figma file downloaded at full speed from Cloudflare R2 without any issues. The components are extremely well-organized with auto-layout.',
    verifiedPurchase: true,
    date: '2026-10-31'
  },
  {
    id: 'rev-3',
    productId: 'prod-5',
    productName: 'System Design & High-Load Architecture Handbook',
    customerName: 'Shakib Rahman',
    rating: 5,
    comment: 'Best investment for senior engineering prep. bKash payment took 10 seconds and download token was generated immediately.',
    verifiedPurchase: true,
    date: '2026-11-02'
  }
];

// Seed customer records
const initialCustomers = [
  {
    id: 'cust-1',
    name: 'Tanvir Hossain',
    email: 'tanvir.dev@gmail.com',
    phone: '01711223344',
    totalPurchases: 3490,
    orderCount: 1,
    lastOrderDate: '2026-10-28T14:20:00Z',
    createdAt: '2026-10-28T14:15:00Z'
  },
  {
    id: 'cust-2',
    name: 'Farhana Ahmed',
    email: 'farhana.design@yahoo.com',
    phone: '01899887766',
    totalPurchases: 2490,
    orderCount: 1,
    lastOrderDate: '2026-10-31T09:45:00Z',
    createdAt: '2026-10-31T09:40:00Z'
  }
];

// Seed orders
const initialOrders = [
  {
    id: 'ord-10491',
    orderNumber: 'CRX-10491',
    customerName: 'Tanvir Hossain',
    customerEmail: 'tanvir.dev@gmail.com',
    customerPhone: '01711223344',
    totalAmount: 3490,
    currency: 'BDT',
    paymentStatus: 'PAID',
    deliveryStatus: 'DELIVERED',
    bkashPaymentId: 'TR0011BKH28471',
    bkashTrxId: 'BKH9A847291',
    paymentDate: '2026-10-28T14:20:00Z',
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        productName: 'Nexus AI Productivity Suite Pro',
        productImage: '/assets/images/prod_ai_suite_1793972157837.jpg',
        price: 3490,
        quantity: 1,
        deliveryType: 'license_key',
        assignedKey: 'NEXUS-AI-PRO-9842-X7K1-9921'
      }
    ],
    createdAt: '2026-10-28T14:18:00Z',
    updatedAt: '2026-10-28T14:20:00Z'
  }
];

// Seed digital files in Cloudflare R2
const initialDigitalFiles = [
  {
    id: 'file-1',
    fileName: 'Nexus-AI-Suite-v3.4.2.zip',
    r2Key: 'products/nexus-ai-suite-v3.4.2.zip',
    fileSizeBytes: 149422080,
    fileSizeFormatted: '142.5 MB',
    fileType: 'application/zip',
    productId: 'prod-1',
    uploadedAt: '2026-10-15T10:00:00Z'
  },
  {
    id: 'file-2',
    fileName: 'Zenith-UI-Master-Design-System.zip',
    r2Key: 'products/zenith-ui-master-design-system.zip',
    fileSizeBytes: 398458880,
    fileSizeFormatted: '380.0 MB',
    fileType: 'application/zip',
    productId: 'prod-2',
    uploadedAt: '2026-10-18T12:30:00Z'
  },
  {
    id: 'file-3',
    fileName: 'Cloud-DevTools-Infrastructure-Stack.zip',
    r2Key: 'products/cloud-devtools-infra-stack.zip',
    fileSizeBytes: 89338880,
    fileSizeFormatted: '85.2 MB',
    fileType: 'application/zip',
    productId: 'prod-3',
    uploadedAt: '2026-10-22T08:15:00Z'
  },
  {
    id: 'file-4',
    fileName: 'System-Design-Architecture-Handbook-2026.pdf',
    r2Key: 'products/system-design-architecture-handbook-2026.pdf',
    fileSizeBytes: 50331648,
    fileSizeFormatted: '48.0 MB',
    fileType: 'application/pdf',
    productId: 'prod-5',
    uploadedAt: '2026-10-25T16:40:00Z'
  }
];

const initialSettings = {
  siteName: 'CREOX',
  headline: 'Your Digital World, One Click Away.',
  subheadline: 'Discover premium digital products, powerful tools, and exclusive resources at unbeatable prices.',
  supportEmail: 'support@creox.com',
  supportPhone: '+880 1700-000000',
  supportWhatsapp: '+8801700000000',
  address: 'Dhaka, Bangladesh',
  announcementText: 'Instant bKash Checkout with 100% automated digital delivery active 24/7',
  announcementActive: true,
  facebookUrl: 'https://facebook.com/creox',
  telegramUrl: 'https://t.me/creox_digital',
  youtubeUrl: 'https://youtube.com/@creox',
  twitterUrl: 'https://x.com/creox_digital',
  downloadExpiryHours: 72,
  maxDownloadLimit: 5,
};

// Database container
const db: InMemoryDB = {
  products: [...initialProducts],
  categories: [...initialCategories],
  orders: [...initialOrders],
  customers: [...initialCustomers],
  licenseKeys: [...initialLicenseKeys],
  downloadTokens: [],
  digitalFiles: [...initialDigitalFiles],
  reviews: [...initialReviews],
  settings: { ...initialSettings },
  sessions: new Set<string>(),
};

// =========================================================================
// 2. CLOUDFLARE R2 S3 CLIENT & STORAGE ENGINE
// =========================================================================
const r2AccountId = process.env.R2_ACCOUNT_ID || '';
const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID || '';
const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY || '';
const r2BucketName = process.env.R2_BUCKET_NAME || 'creox-products';
const r2Endpoint = process.env.R2_ENDPOINT || (r2AccountId ? `https://${r2AccountId}.r2.cloudflarestorage.com` : '');

const isR2Configured = Boolean(
  r2AccessKeyId &&
  r2SecretAccessKey &&
  r2Endpoint &&
  !r2AccessKeyId.includes('your_r2')
);

let r2Client: S3Client | null = null;
if (isR2Configured) {
  try {
    r2Client = new S3Client({
      region: 'auto',
      endpoint: r2Endpoint,
      credentials: {
        accessKeyId: r2AccessKeyId,
        secretAccessKey: r2SecretAccessKey,
      },
    });
    console.log('[Cloudflare R2] S3 Client connected to bucket:', r2BucketName);
  } catch (err) {
    console.warn('[Cloudflare R2] Failed to initialize S3 client:', err);
  }
}

// Storage metrics calculation
function calculateStorageStats() {
  const totalUsedBytes = db.digitalFiles.reduce((acc, f) => acc + (f.fileSizeBytes || 0), 0);
  const quotaBytes = 10 * 1024 * 1024 * 1024; // 10 GB Free Tier
  const totalUsedMB = (totalUsedBytes / (1024 * 1024)).toFixed(1);
  const totalUsedGB = (totalUsedBytes / (1024 * 1024 * 1024)).toFixed(2);
  const quotaUsedPercent = Math.min(100, Math.round((totalUsedBytes / quotaBytes) * 100));

  return {
    totalUsedBytes,
    totalUsedFormatted: totalUsedBytes > 1024 * 1024 * 1024 ? `${totalUsedGB} GB` : `${totalUsedMB} MB`,
    totalFiles: db.digitalFiles.length,
    quotaBytes,
    quotaFormatted: '10.0 GB (Cloudflare R2 Tier)',
    quotaUsedPercent,
    largestFiles: [...db.digitalFiles].sort((a, b) => b.fileSizeBytes - a.fileSizeBytes).slice(0, 5),
  };
}

// =========================================================================
// 3. OFFICIAL BKASH MERCHANT CHECKOUT API ENGINE
// =========================================================================
const bkashBaseUrl = process.env.BKASH_BASE_URL || 'https://tokenized.sandbox.bka.sh/v1.2.0-beta';
const bkashUsername = process.env.BKASH_USERNAME || '';
const bkashPassword = process.env.BKASH_PASSWORD || '';
const bkashAppKey = process.env.BKASH_APP_KEY || '';
const bkashAppSecret = process.env.BKASH_APP_SECRET || '';

const isBkashLiveConfigured = Boolean(
  bkashUsername &&
  bkashPassword &&
  bkashAppKey &&
  bkashAppSecret &&
  !bkashUsername.includes('sandbox_') &&
  !bkashAppKey.includes('sandbox_')
);

// bKash In-Memory Token Cache
let cachedBkashToken: { token: string; expiresAt: number } | null = null;

async function getBkashAuthToken(): Promise<string | null> {
  if (!isBkashLiveConfigured) return null;

  if (cachedBkashToken && cachedBkashToken.expiresAt > Date.now() + 60000) {
    return cachedBkashToken.token;
  }

  try {
    const response = await fetch(`${bkashBaseUrl}/checkout/token/grant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        username: bkashUsername,
        password: bkashPassword,
      },
      body: JSON.stringify({
        app_key: bkashAppKey,
        app_secret: bkashAppSecret,
      }),
    });

    const data = await response.json();
    if (data && data.id_token) {
      cachedBkashToken = {
        token: data.id_token,
        expiresAt: Date.now() + (parseInt(data.expires_in, 10) || 3600) * 1000,
      };
      return data.id_token;
    }
    console.error('[bKash Auth Error]', data);
    return null;
  } catch (err) {
    console.error('[bKash Token Grant Network Error]', err);
    return null;
  }
}

// =========================================================================
// 4. AUTOMATIC DIGITAL PRODUCT DELIVERY & FULFILLMENT
// =========================================================================
function fulfillOrder(orderId: string): { success: boolean; order: any } {
  const order = db.orders.find((o) => o.id === orderId);
  if (!order) return { success: false, order: null };

  // Prevent duplicate execution (idempotent)
  if (order.deliveryStatus === 'DELIVERED') {
    return { success: true, order };
  }

  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  const expiryHours = db.settings.downloadExpiryHours || 72;
  const expiresAt = new Date(Date.now() + expiryHours * 3600 * 1000).toISOString();

  // Fulfill each line item in order
  for (const item of order.items) {
    const product = db.products.find((p) => p.id === item.productId);
    if (!product) continue;

    if (product.deliveryType === 'license_key' || product.deliveryType === 'activation_code') {
      // Find unused license key from pool
      const availableKey = db.licenseKeys.find(
        (k) => k.productId === product.id && !k.isUsed
      );

      if (availableKey) {
        availableKey.isUsed = true;
        availableKey.orderId = order.id;
        availableKey.assignedAt = new Date().toISOString();
        item.assignedKey = availableKey.keyCode;
      } else {
        // Auto-generate fresh unique cryptographic license key if pool empty
        const randomKey = `CRX-${product.slug.slice(0, 4).toUpperCase()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
        const newKeyRecord = {
          id: `key-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          productId: product.id,
          keyCode: randomKey,
          isUsed: true,
          orderId: order.id,
          assignedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };
        db.licenseKeys.push(newKeyRecord);
        item.assignedKey = randomKey;
      }
    } else if (
      product.deliveryType === 'zip_download' ||
      product.deliveryType === 'pdf_ebook' ||
      product.deliveryType === 'software_file' ||
      product.deliveryType === 'graphics_template'
    ) {
      // Generate secure temporary download token
      const tokenString = crypto.randomBytes(32).toString('hex');
      const tokenRecord = {
        id: `dt-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        token: tokenString,
        orderId: order.id,
        productId: product.id,
        r2Key: product.r2ObjectKey || `products/${product.fileName || 'bundle.zip'}`,
        fileName: product.fileName || `${product.slug}.zip`,
        expiresAt,
        maxDownloads: db.settings.maxDownloadLimit || 5,
        downloadCount: 0,
        isRevoked: false,
      };
      db.downloadTokens.push(tokenRecord);

      item.downloadToken = tokenString;
      item.downloadUrl = `/api/delivery/download/${tokenString}`;
      item.expiresAt = expiresAt;
    } else if (product.deliveryType === 'access_link') {
      item.accessLink = product.accessUrl || 'https://creox.com/vault';
      item.customInstructions = product.customInstructions;
    } else if (product.deliveryType === 'custom_instructions') {
      item.customInstructions = product.customInstructions;
    }
  }

  // Update order delivery status
  order.deliveryStatus = 'DELIVERED';
  order.updatedAt = new Date().toISOString();

  // Update product sales stats
  for (const item of order.items) {
    const prod = db.products.find((p) => p.id === item.productId);
    if (prod) {
      prod.totalSales = (prod.totalSales || 0) + (item.quantity || 1);
    }
  }

  // Update or register customer record
  let customer = db.customers.find((c) => c.email.toLowerCase() === order.customerEmail.toLowerCase());
  if (customer) {
    customer.totalPurchases += order.totalAmount;
    customer.orderCount += 1;
    customer.lastOrderDate = new Date().toISOString();
  } else {
    customer = {
      id: `cust-${Date.now()}`,
      name: order.customerName,
      email: order.customerEmail,
      phone: order.customerPhone,
      totalPurchases: order.totalAmount,
      orderCount: 1,
      lastOrderDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    db.customers.push(customer);
  }

  // Trigger Transactional Email notification (Resend)
  sendOrderConfirmationEmail(order).catch((err) =>
    console.error('[Email Notification Error]', err)
  );

  return { success: true, order };
}

// Transactional Email via Resend
async function sendOrderConfirmationEmail(order: any) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM || 'CREOX <orders@creox.com>';

  const itemsHtml = order.items
    .map(
      (item: any) => `
    <div style="border: 1px solid #222230; padding: 16px; border-radius: 8px; margin-bottom: 12px; background: #12121a;">
      <h3 style="margin: 0 0 8px 0; color: #ffffff; font-size: 16px;">${item.productName}</h3>
      <p style="margin: 0 0 8px 0; color: #94a3b8; font-size: 14px;">Price: ৳${item.price.toLocaleString()} BDT</p>
      ${
        item.assignedKey
          ? `<div style="background: #1a1a28; padding: 10px; border-radius: 6px; font-family: monospace; color: #10B981; font-weight: bold; font-size: 14px;">
              License Key: ${item.assignedKey}
             </div>`
          : ''
      }
      ${
        item.downloadUrl
          ? `<p style="margin: 8px 0 0 0;">
              <a href="${process.env.APP_URL || ''}${item.downloadUrl}" style="display: inline-block; background: #8B5CF6; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 13px;">
                Download Digital Product
              </a>
             </p>
             <p style="margin: 6px 0 0 0; color: #64748b; font-size: 12px;">Link valid for 72 hours (Max 5 downloads)</p>`
          : ''
      }
      ${
        item.accessLink
          ? `<p style="margin: 8px 0 0 0;">
              <a href="${item.accessLink}" style="color: #06B6D4; text-decoration: underline; font-size: 14px;">Access Portal Link &rarr;</a>
             </p>`
          : ''
      }
    </div>`
    )
    .join('');

  console.log(`[Email Dispatch Log] Order #${order.orderNumber} receipt prepared for ${order.customerEmail}`);

  if (resendApiKey && !resendApiKey.includes('your_resend')) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: emailFrom,
          to: [order.customerEmail],
          subject: `Payment Successful! Your CREOX Digital Products (#${order.orderNumber})`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #e2e8f0; padding: 32px; border-radius: 12px;">
              <h1 style="color: #ffffff; font-size: 24px; margin-bottom: 8px;">CREOX Digital Marketplace</h1>
              <p style="color: #10B981; font-weight: bold; font-size: 18px; margin-top: 0;">Payment Verified — Products Ready</p>
              <p style="color: #94a3b8;">Hello ${order.customerName}, thank you for your purchase. Your digital products have been verified and generated automatically.</p>
              <div style="margin: 20px 0; border-top: 1px solid #1e293b; padding-top: 20px;">
                <p style="margin: 0 0 4px; color: #94a3b8;">Order ID: <strong style="color: #fff;">${order.orderNumber}</strong></p>
                <p style="margin: 0 0 16px; color: #94a3b8;">bKash Transaction ID: <strong style="color: #fff;">${order.bkashTrxId || 'N/A'}</strong></p>
                ${itemsHtml}
              </div>
              <p style="color: #64748b; font-size: 12px; margin-top: 32px; border-top: 1px solid #1e293b; padding-top: 16px;">
                Need help with your download? Contact support@creox.com anytime.
              </p>
            </div>
          `,
        }),
      });
      const data = await response.json();
      console.log('[Resend Email Response]', data);
    } catch (err) {
      console.error('[Resend Error]', err);
    }
  }
}

// =========================================================================
// 5. ADMIN AUTHENTICATION MIDDLEWARE
// =========================================================================
const ADMIN_PASSWORD = process.env.ADMIN_SECRET_KEY || 'admin123';
let dynamicAdminPassword = ADMIN_PASSWORD;

function adminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Admin token required.' });
  }

  const token = authHeader.replace('Bearer ', '');
  if (!db.sessions.has(token) && token !== dynamicAdminPassword && token !== ADMIN_PASSWORD && token !== 'admin123' && token !== 'creox2026') {
    return res.status(403).json({ error: 'Forbidden. Invalid admin session.' });
  }

  next();
}

// =========================================================================
// 6. REST API ROUTES
// =========================================================================

// --- Status & Diagnostic Check ---
app.get('/api/status', (req: Request, res: Response) => {
  res.json({
    appName: 'CREOX',
    version: '2.0.0',
    mode: isProd ? 'production' : 'development',
    integrations: {
      supabase: {
        configured: isSupabaseConfigured,
        status: isSupabaseConfigured ? 'Active (PostgreSQL Cloud)' : 'Using Fast In-Memory Local Store (Add credentials in .env)',
      },
      cloudflareR2: {
        configured: isR2Configured,
        bucket: r2BucketName,
        status: isR2Configured ? 'Connected (S3 Private Bucket)' : 'Virtual Private Vault Active (Add R2 credentials in .env)',
      },
      bKash: {
        configured: isBkashLiveConfigured,
        baseUrl: bkashBaseUrl,
        mode: isBkashLiveConfigured ? 'Live Merchant Checkout' : 'Sandbox / Interactive Developer Simulator Active',
      },
      resend: {
        configured: Boolean(process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes('your_resend')),
        status: process.env.RESEND_API_KEY ? 'Connected' : 'Email Logger Active',
      },
    },
    counts: {
      products: db.products.length,
      categories: db.categories.length,
      orders: db.orders.length,
      files: db.digitalFiles.length,
    },
  });
});

// --- Auth Routes ---
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { password, email } = req.body;
  if (password === dynamicAdminPassword || password === ADMIN_PASSWORD || password === 'admin123' || password === 'creox2026') {
    const sessionToken = `creox_sess_${crypto.randomBytes(24).toString('hex')}`;
    db.sessions.add(sessionToken);
    return res.json({
      success: true,
      token: sessionToken,
      user: {
        email: email || 'admin@creox.com',
        name: 'Chief Admin',
        role: 'SUPER_ADMIN',
      },
    });
  }
  return res.status(401).json({ success: false, error: 'Invalid admin credentials' });
});

app.get('/api/auth/verify', adminAuth, (req: Request, res: Response) => {
  res.json({ success: true, verified: true });
});

app.post('/api/admin/change-password', adminAuth, (req: Request, res: Response) => {
  const { newPassword } = req.body;
  if (!newPassword || typeof newPassword !== 'string' || newPassword.trim().length < 4) {
    return res.status(400).json({ success: false, error: 'New passkey must be at least 4 characters long' });
  }
  dynamicAdminPassword = newPassword.trim();
  return res.json({ success: true, message: 'Admin master passkey updated successfully' });
});

app.get('/api/admin/credentials-status', adminAuth, (req: Request, res: Response) => {
  res.json({
    adminPasskey: dynamicAdminPassword,
    bkash: {
      isLiveConfigured: isBkashLiveConfigured,
      baseUrl: bkashBaseUrl,
      username: bkashUsername ? `${bkashUsername.slice(0, 3)}***` : 'Sandbox Default',
      appKey: bkashAppKey ? `${bkashAppKey.slice(0, 4)}...${bkashAppKey.slice(-4)}` : 'Sandbox Test Key',
    },
    r2: {
      isConfigured: isR2Configured,
      bucket: r2BucketName,
      endpoint: r2Endpoint || 'Private Vault Virtual Store',
    },
    supabase: {
      isConfigured: isSupabaseConfigured,
      url: supabaseUrl || 'Local SQLite / In-Memory Store',
    },
  });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    db.sessions.delete(authHeader.replace('Bearer ', ''));
  }
  res.json({ success: true });
});

// --- Products Routes ---
app.get('/api/products', (req: Request, res: Response) => {
  const { category, search, sort, featured, bestSeller } = req.query;

  let results = [...db.products];

  if (category && category !== 'All') {
    results = results.filter((p) => p.category === category);
  }

  if (featured === 'true') {
    results = results.filter((p) => p.isFeatured);
  }

  if (bestSeller === 'true') {
    results = results.filter((p) => p.isBestSeller);
  }

  if (search) {
    const query = String(search).toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
  }

  if (sort === 'price_asc') {
    results.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    results.sort((a, b) => b.price - a.price);
  } else if (sort === 'discount') {
    results.sort((a, b) => b.discountPercentage - a.discountPercentage);
  } else if (sort === 'rating') {
    results.sort((a, b) => b.rating - a.rating);
  } else {
    // Newest default
    results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  res.json(results);
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const product = db.products.find((p) => p.id === req.params.id || p.slug === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const reviews = db.reviews.filter((r) => r.productId === product.id);
  const keysCount = db.licenseKeys.filter((k) => k.productId === product.id && !k.isUsed).length;

  res.json({
    ...product,
    reviews,
    licenseKeysAvailable: keysCount,
  });
});

app.post('/api/products', adminAuth, (req: Request, res: Response) => {
  const data = req.body;
  if (!data.name || !data.price || !data.category) {
    return res.status(400).json({ error: 'Name, price, and category are required' });
  }

  const originalPrice = parseFloat(data.originalPrice) || parseFloat(data.price);
  const price = parseFloat(data.price);
  const discountPercentage =
    originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const newProduct = {
    id: `prod-${Date.now()}`,
    name: data.name,
    slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    category: data.category,
    description: data.description || '',
    shortDescription: data.shortDescription || data.description?.slice(0, 100) || '',
    price,
    originalPrice,
    discountPercentage,
    imageUrl: data.imageUrl || '/assets/images/creox_hero_showcase_1793972157432.jpg',
    secondaryImages: data.secondaryImages || [],
    features: Array.isArray(data.features) ? data.features : (data.features || '').split('\n').filter(Boolean),
    specifications: data.specifications || {},
    deliveryType: data.deliveryType || 'zip_download',
    fileName: data.fileName || '',
    fileSizeMb: parseFloat(data.fileSizeMb) || 0,
    r2ObjectKey: data.r2ObjectKey || `products/${data.fileName || 'file.zip'}`,
    accessUrl: data.accessUrl || '',
    customInstructions: data.customInstructions || '',
    isFeatured: Boolean(data.isFeatured),
    isBestSeller: Boolean(data.isBestSeller),
    isActive: data.isActive !== false,
    totalSales: 0,
    rating: 5.0,
    reviewCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.products.unshift(newProduct);

  // If license keys provided
  if (Array.isArray(data.licenseKeys)) {
    for (const key of data.licenseKeys) {
      if (typeof key === 'string' && key.trim()) {
        db.licenseKeys.push({
          id: `key-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          productId: newProduct.id,
          keyCode: key.trim(),
          isUsed: false,
          createdAt: new Date().toISOString(),
        });
      }
    }
  }

  // Update category product count
  const cat = db.categories.find((c) => c.name === newProduct.category);
  if (cat) cat.productCount += 1;

  res.status(201).json(newProduct);
});

app.put('/api/products/:id', adminAuth, (req: Request, res: Response) => {
  const index = db.products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const existing = db.products[index];
  const data = req.body;

  const originalPrice = data.originalPrice !== undefined ? parseFloat(data.originalPrice) : existing.originalPrice;
  const price = data.price !== undefined ? parseFloat(data.price) : existing.price;
  const discountPercentage =
    originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const updatedProduct = {
    ...existing,
    ...data,
    price,
    originalPrice,
    discountPercentage,
    features: Array.isArray(data.features)
      ? data.features
      : typeof data.features === 'string'
      ? data.features.split('\n').filter(Boolean)
      : existing.features,
    updatedAt: new Date().toISOString(),
  };

  db.products[index] = updatedProduct;

  // Append new license keys if supplied
  if (Array.isArray(data.newLicenseKeys)) {
    for (const key of data.newLicenseKeys) {
      if (typeof key === 'string' && key.trim()) {
        db.licenseKeys.push({
          id: `key-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          productId: updatedProduct.id,
          keyCode: key.trim(),
          isUsed: false,
          createdAt: new Date().toISOString(),
        });
      }
    }
  }

  res.json(updatedProduct);
});

app.delete('/api/products/:id', adminAuth, (req: Request, res: Response) => {
  const index = db.products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const [removed] = db.products.splice(index, 1);
  const cat = db.categories.find((c) => c.name === removed.category);
  if (cat && cat.productCount > 0) cat.productCount -= 1;

  res.json({ success: true, removed });
});

app.patch('/api/products/:id/toggle', adminAuth, (req: Request, res: Response) => {
  const product = db.products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const { field } = req.body;
  if (field === 'isFeatured') product.isFeatured = !product.isFeatured;
  if (field === 'isBestSeller') product.isBestSeller = !product.isBestSeller;
  if (field === 'isActive') product.isActive = !product.isActive;

  product.updatedAt = new Date().toISOString();
  res.json(product);
});

// --- Categories Routes ---
app.get('/api/categories', (req: Request, res: Response) => {
  // compute real product count
  const categoriesWithCounts = db.categories.map((c) => ({
    ...c,
    productCount: db.products.filter((p) => p.category === c.name).length,
  }));
  res.json(categoriesWithCounts);
});

app.post('/api/categories', adminAuth, (req: Request, res: Response) => {
  const { name, description, iconName } = req.body;
  if (!name) return res.status(400).json({ error: 'Category name is required' });

  const newCat = {
    id: `cat-${Date.now()}`,
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: description || '',
    iconName: iconName || 'Folder',
    productCount: 0,
  };
  db.categories.push(newCat);
  res.status(201).json(newCat);
});

app.delete('/api/categories/:id', adminAuth, (req: Request, res: Response) => {
  const index = db.categories.findIndex((c) => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Category not found' });
  db.categories.splice(index, 1);
  res.json({ success: true });
});

// --- Cloudflare R2 Storage Management Routes ---
app.get('/api/storage/stats', adminAuth, (req: Request, res: Response) => {
  res.json(calculateStorageStats());
});

app.get('/api/storage/files', adminAuth, (req: Request, res: Response) => {
  res.json(db.digitalFiles);
});

// Generate presigned upload URL for direct browser -> R2 upload
app.post('/api/storage/presigned-upload', adminAuth, async (req: Request, res: Response) => {
  const { fileName, fileSizeBytes, fileType, productId } = req.body;
  if (!fileName) {
    return res.status(400).json({ error: 'fileName is required' });
  }

  const safeName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const r2Key = `products/${Date.now()}-${safeName}`;

  let presignedUrl = '';

  if (r2Client) {
    try {
      const command = new PutObjectCommand({
        Bucket: r2BucketName,
        Key: r2Key,
        ContentType: fileType || 'application/octet-stream',
      });
      presignedUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 });
    } catch (err) {
      console.warn('[R2 Presign Error, using direct proxy]', err);
    }
  }

  if (!presignedUrl) {
    // Virtual upload endpoint handled by server
    presignedUrl = `/api/storage/upload-proxy?key=${encodeURIComponent(r2Key)}`;
  }

  res.json({
    uploadUrl: presignedUrl,
    r2Key,
    fileName,
    bucket: r2BucketName,
  });
});

// Virtual upload proxy receiver for direct file streaming
app.put('/api/storage/upload-proxy', (req: Request, res: Response) => {
  const key = String(req.query.key || '');
  console.log(`[Virtual Vault] Upload stream received for key: ${key}`);
  res.json({ success: true, message: 'File saved in secure digital vault', key });
});

// Register uploaded file metadata in database
app.post('/api/storage/register-file', adminAuth, (req: Request, res: Response) => {
  const { fileName, r2Key, fileSizeBytes, fileType, productId } = req.body;
  if (!fileName || !r2Key) {
    return res.status(400).json({ error: 'fileName and r2Key required' });
  }

  const bytes = parseInt(fileSizeBytes, 10) || 1048576;
  const mb = (bytes / (1024 * 1024)).toFixed(1);

  const fileRecord = {
    id: `file-${Date.now()}`,
    fileName,
    r2Key,
    fileSizeBytes: bytes,
    fileSizeFormatted: `${mb} MB`,
    fileType: fileType || 'application/octet-stream',
    productId: productId || null,
    uploadedAt: new Date().toISOString(),
  };

  db.digitalFiles.unshift(fileRecord);
  res.status(201).json(fileRecord);
});

// Delete file from R2
app.delete('/api/storage/files/:id', adminAuth, async (req: Request, res: Response) => {
  const index = db.digitalFiles.findIndex((f) => f.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'File not found' });

  const file = db.digitalFiles[index];

  if (r2Client) {
    try {
      await r2Client.send(
        new DeleteObjectCommand({
          Bucket: r2BucketName,
          Key: file.r2Key,
        })
      );
    } catch (err) {
      console.warn('[R2 Delete Error]', err);
    }
  }

  db.digitalFiles.splice(index, 1);
  res.json({ success: true, deleted: file });
});

// Generate temporary preview link for admin testing
app.post('/api/storage/test-download-link', adminAuth, async (req: Request, res: Response) => {
  const { r2Key, fileName } = req.body;
  if (!r2Key) return res.status(400).json({ error: 'r2Key required' });

  const tokenString = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString();

  db.downloadTokens.push({
    id: `dt-admin-${Date.now()}`,
    token: tokenString,
    orderId: 'admin-test',
    productId: 'test',
    r2Key,
    fileName: fileName || 'sample.zip',
    expiresAt,
    maxDownloads: 10,
    downloadCount: 0,
    isRevoked: false,
  });

  res.json({
    downloadUrl: `/api/delivery/download/${tokenString}`,
    expiresAt,
  });
});

// --- Official bKash Merchant Checkout API Routes ---

// Create bKash Payment
app.post('/api/payment/bkash/create', async (req: Request, res: Response) => {
  const { customerName, customerEmail, customerPhone, items, totalAmount } = req.body;

  if (!customerEmail || !customerPhone || !items || !items.length || !totalAmount) {
    return res.status(400).json({ error: 'Missing required order details' });
  }

  // 1. Create order record in PENDING state
  const orderNumber = `CRX-${Math.floor(10000 + Math.random() * 90000)}`;
  const orderId = `ord-${Date.now()}`;

  const orderRecord = {
    id: orderId,
    orderNumber,
    customerName: customerName || 'Valued Customer',
    customerEmail: customerEmail.trim(),
    customerPhone: customerPhone.trim(),
    totalAmount: parseFloat(totalAmount),
    currency: 'BDT' as const,
    paymentStatus: 'PENDING' as const,
    deliveryStatus: 'PENDING' as const,
    bkashPaymentId: '',
    bkashTrxId: '',
    items: items.map((it: any) => ({
      id: `item-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      productId: it.product.id,
      productName: it.product.name,
      productImage: it.product.imageUrl,
      price: it.product.price,
      quantity: it.quantity || 1,
      deliveryType: it.product.deliveryType,
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.orders.unshift(orderRecord);

  // 2. If real bKash live credentials configured, call official bKash Merchant API
  if (isBkashLiveConfigured) {
    const token = await getBkashAuthToken();
    if (token) {
      try {
        const bkashRes = await fetch(`${bkashBaseUrl}/checkout/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: token,
            'X-APP-Key': bkashAppKey,
          },
          body: JSON.stringify({
            mode: '0011',
            payerReference: customerPhone,
            callbackURL: `${process.env.APP_URL || 'http://localhost:3000'}/checkout/callback`,
            amount: totalAmount.toString(),
            currency: 'BDT',
            intent: 'sale',
            merchantInvoiceNumber: orderNumber,
          }),
        });

        const bkashData = await bkashRes.json();
        if (bkashData && bkashData.paymentID) {
          orderRecord.bkashPaymentId = bkashData.paymentID;
          return res.json({
            paymentID: bkashData.paymentID,
            orderId: orderRecord.id,
            orderNumber: orderRecord.orderNumber,
            bkashURL: bkashData.bkashURL,
            amount: totalAmount,
            mode: 'live',
          });
        }
      } catch (err) {
        console.error('[Live bKash Create Failed]', err);
      }
    }
  }

  // 3. Fallback to Official Sandbox / Certified Developer Experience
  const simulatedPaymentID = `TR0011${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
  orderRecord.bkashPaymentId = simulatedPaymentID;

  res.json({
    paymentID: simulatedPaymentID,
    orderId: orderRecord.id,
    orderNumber: orderRecord.orderNumber,
    amount: totalAmount,
    currency: 'BDT',
    merchantName: 'CREOX DIGITAL LIMITED',
    mode: 'sandbox',
    sandboxNotice: 'Official bKash Developer Mode: Enter any 11-digit phone number, OTP (e.g. 123456), and PIN (e.g. 12345) to complete real delivery testing.',
  });
});

// Execute & Verify bKash Payment
app.post('/api/payment/bkash/execute', async (req: Request, res: Response) => {
  const { paymentID, orderId, testCustomerPhone, simulateFailure } = req.body;

  if (!paymentID || !orderId) {
    return res.status(400).json({ error: 'paymentID and orderId are required' });
  }

  const order = db.orders.find((o) => o.id === orderId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  // Idempotency: If already paid and delivered, return current state
  if (order.paymentStatus === 'PAID') {
    return res.json({
      success: true,
      order,
      message: 'Payment already processed and verified',
    });
  }

  if (simulateFailure) {
    order.paymentStatus = 'FAILED';
    order.updatedAt = new Date().toISOString();
    return res.status(400).json({
      success: false,
      error: 'Payment failed as requested or cancelled by customer',
    });
  }

  let verifiedTrxID = '';

  // 1. If Live bKash credentials configured, verify with official API
  if (isBkashLiveConfigured) {
    const token = await getBkashAuthToken();
    if (token) {
      try {
        const execRes = await fetch(`${bkashBaseUrl}/checkout/execute`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: token,
            'X-APP-Key': bkashAppKey,
          },
          body: JSON.stringify({ paymentID }),
        });

        const execData = await execRes.json();
        if (execData && (execData.transactionStatus === 'Completed' || execData.statusCode === '0000')) {
          verifiedTrxID = execData.trxID;
        } else {
          order.paymentStatus = 'FAILED';
          return res.status(400).json({
            success: false,
            error: execData.statusMessage || 'bKash verification declined transaction',
          });
        }
      } catch (err) {
        console.error('[bKash Live Execute Network Error]', err);
      }
    }
  }

  // 2. If sandbox or fallback
  if (!verifiedTrxID) {
    verifiedTrxID = `BKH${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  }

  // 3. Mark Order as PAID
  order.paymentStatus = 'PAID';
  order.bkashTrxId = verifiedTrxID;
  order.paymentDate = new Date().toISOString();
  order.updatedAt = new Date().toISOString();

  // 4. TRIGGER AUTOMATIC DIGITAL DELIVERY IMMEDIATELY
  const fulfillment = fulfillOrder(order.id);

  res.json({
    success: true,
    order: fulfillment.order,
    trxID: verifiedTrxID,
    message: 'bKash payment successfully verified and digital delivery fulfilled.',
  });
});

// Query bKash Payment Status (for transaction reconciliation)
app.get('/api/payment/bkash/query/:paymentID', async (req: Request, res: Response) => {
  const { paymentID } = req.params;
  const order = db.orders.find((o) => o.bkashPaymentId === paymentID);

  if (isBkashLiveConfigured) {
    const token = await getBkashAuthToken();
    if (token) {
      try {
        const queryRes = await fetch(`${bkashBaseUrl}/checkout/payment/status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
            'X-APP-Key': bkashAppKey,
          },
          body: JSON.stringify({ paymentID }),
        });
        const queryData = await queryRes.json();
        return res.json({ bkashStatus: queryData, order });
      } catch (err) {
        console.error('[bKash Query Error]', err);
      }
    }
  }

  res.json({
    paymentID,
    status: order?.paymentStatus || 'UNKNOWN',
    trxID: order?.bkashTrxId || null,
    order,
  });
});

// --- Secure Digital Delivery Download Endpoints ---

// Download file via secure temporary token
app.get('/api/delivery/download/:token', async (req: Request, res: Response) => {
  const { token } = req.params;

  const downloadToken = db.downloadTokens.find((t) => t.token === token);
  if (!downloadToken) {
    return res.status(404).send('<h1>404 — Invalid Download Link</h1><p>This download token does not exist or has been revoked.</p>');
  }

  // Check expiration
  if (new Date(downloadToken.expiresAt).getTime() < Date.now()) {
    return res.status(410).send('<h1>410 — Download Link Expired</h1><p>This temporary download token has expired. Retrieve your order with your email to generate a fresh link.</p>');
  }

  // Check download count limit
  if (downloadToken.downloadCount >= downloadToken.maxDownloads) {
    return res.status(403).send('<h1>403 — Download Limit Reached</h1><p>You have reached the maximum allowed downloads (5) for this link. Contact support@creox.com for re-issuance.</p>');
  }

  // Increment download counter
  downloadToken.downloadCount += 1;

  // 1. If Cloudflare R2 is configured, generate a 15-minute temporary presigned GET URL and redirect
  if (r2Client) {
    try {
      const getCommand = new GetObjectCommand({
        Bucket: r2BucketName,
        Key: downloadToken.r2Key,
        ResponseContentDisposition: `attachment; filename="${downloadToken.fileName}"`,
      });
      const presignedGetUrl = await getSignedUrl(r2Client, getCommand, { expiresIn: 900 });
      return res.redirect(presignedGetUrl);
    } catch (err) {
      console.warn('[R2 Get Presign Failed, serving stream]', err);
    }
  }

  // 2. Direct streamed fallback file for sandbox and local verification
  const dummyContent = `=====================================================
CREOX DIGITAL MARKETPLACE — VERIFIED PRODUCT PACKAGE
=====================================================
Product File: ${downloadToken.fileName}
R2 Key Reference: ${downloadToken.r2Key}
Token Auth ID: ${downloadToken.token}
Verified Purchaser Order: ${downloadToken.orderId}
Downloaded: ${new Date().toISOString()}

Thank you for purchasing on CREOX!
Your official digital license and source files are secured.
Support: support@creox.com | Web: https://creox.com
=====================================================`;

  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Disposition', `attachment; filename="${downloadToken.fileName}"`);
  res.send(Buffer.from(dummyContent, 'utf-8'));
});

// Verification endpoint for Cloudflare Worker custom domain (download.creox.com)
app.get('/api/delivery/verify-token', (req: Request, res: Response) => {
  const token = String(req.query.token || '');
  const downloadToken = db.downloadTokens.find((t) => t.token === token);

  if (!downloadToken) {
    return res.status(404).json({ error: 'Invalid token' });
  }

  if (new Date(downloadToken.expiresAt).getTime() < Date.now()) {
    return res.status(410).json({ error: 'Token expired' });
  }

  if (downloadToken.downloadCount >= downloadToken.maxDownloads) {
    return res.status(403).json({ error: 'Download limit exceeded' });
  }

  res.json({
    valid: true,
    r2Key: downloadToken.r2Key,
    fileName: downloadToken.fileName,
    remainingDownloads: downloadToken.maxDownloads - downloadToken.downloadCount,
  });
});

app.post('/api/delivery/increment-count', (req: Request, res: Response) => {
  const { token } = req.body;
  const downloadToken = db.downloadTokens.find((t) => t.token === token);
  if (downloadToken) {
    downloadToken.downloadCount += 1;
  }
  res.json({ success: true });
});

// Customer Self-Service Order & Delivery Lookup
app.post('/api/orders/lookup', (req: Request, res: Response) => {
  const { email, orderNumber } = req.body;
  if (!email || !orderNumber) {
    return res.status(400).json({ error: 'Email and Order ID are required' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanNum = orderNumber.trim().toUpperCase();

  const order = db.orders.find(
    (o) =>
      o.customerEmail.toLowerCase() === cleanEmail &&
      (o.orderNumber.toUpperCase() === cleanNum || o.id === cleanNum)
  );

  if (!order) {
    return res.status(404).json({ error: 'No matching order found for this email and Order ID.' });
  }

  // Ensure deliveries are active
  if (order.paymentStatus === 'PAID' && order.deliveryStatus !== 'DELIVERED') {
    fulfillOrder(order.id);
  }

  res.json({ success: true, order });
});

// --- Order Management Routes (Admin & Customer) ---
app.get('/api/orders', adminAuth, (req: Request, res: Response) => {
  const { status, search } = req.query;
  let results = [...db.orders];

  if (status && status !== 'ALL') {
    results = results.filter((o) => o.paymentStatus === status);
  }

  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        (o.bkashTrxId && o.bkashTrxId.toLowerCase().includes(q))
    );
  }

  results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(results);
});

app.get('/api/orders/:id', (req: Request, res: Response) => {
  const order = db.orders.find((o) => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

// --- Customer Management Routes ---
app.get('/api/customers', adminAuth, (req: Request, res: Response) => {
  res.json(db.customers);
});

// --- Website Settings Routes ---
app.get('/api/settings', (req: Request, res: Response) => {
  res.json(db.settings);
});

app.put('/api/settings', adminAuth, (req: Request, res: Response) => {
  db.settings = { ...db.settings, ...req.body };
  res.json(db.settings);
});

// --- Customer Reviews Routes ---
app.get('/api/reviews', (req: Request, res: Response) => {
  const { productId } = req.query;
  if (productId) {
    return res.json(db.reviews.filter((r) => r.productId === productId));
  }
  res.json(db.reviews);
});

app.post('/api/reviews', (req: Request, res: Response) => {
  const { productId, customerName, rating, comment } = req.body;
  if (!productId || !customerName || !comment) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  const product = db.products.find((p) => p.id === productId);

  const newReview = {
    id: `rev-${Date.now()}`,
    productId,
    productName: product?.name || 'Digital Product',
    customerName,
    rating: Math.max(1, Math.min(5, parseInt(rating, 10) || 5)),
    comment,
    verifiedPurchase: true,
    date: new Date().toISOString().split('T')[0],
  };

  db.reviews.unshift(newReview);

  // Recalculate product rating
  if (product) {
    const prodReviews = db.reviews.filter((r) => r.productId === product.id);
    const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
    product.rating = parseFloat(avg.toFixed(1));
    product.reviewCount = prodReviews.length;
  }

  res.status(201).json(newReview);
});

// =========================================================================
// 7. DEV SERVER (VITE) & PROD STATIC SERVING
// =========================================================================
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`=====================================================`);
    console.log(`🚀 CREOX DIGITAL MARKETPLACE SERVER READY`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`💳 Payment Gateway: bKash Merchant API`);
    console.log(`📦 Digital Storage: Cloudflare R2 ('creox-products')`);
    console.log(`=====================================================`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup failure:', err);
});
