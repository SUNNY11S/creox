import { Product, Category, CustomerReview, Order, Customer, StorageStats } from '../types';

export const initialCategories: Category[] = [
  { id: 'cat-1', name: 'Software & Applications', slug: 'software-applications', description: 'Production-ready apps, CLI tools, and enterprise utilities.', iconName: 'Cpu', productCount: 4 },
  { id: 'cat-2', name: 'Premium Subscriptions', slug: 'premium-subscriptions', description: 'Curated developer licenses and SaaS seat activations.', iconName: 'KeyRound', productCount: 2 },
  { id: 'cat-3', name: 'AI Tools', slug: 'ai-tools', description: 'Advanced LLM prompt suites, fine-tuned agent workflows, and models.', iconName: 'Sparkles', productCount: 3 },
  { id: 'cat-4', name: 'Graphics & Design', slug: 'graphics-design', description: 'Figma UI kits, 3D icon sets, design systems, and vector libraries.', iconName: 'Palette', productCount: 3 },
  { id: 'cat-5', name: 'Templates & Digital Assets', slug: 'templates-digital-assets', description: 'Full-stack boilerplates, Next.js starters, and landing page kits.', iconName: 'LayoutTemplate', productCount: 3 },
  { id: 'cat-6', name: 'PDF & E-books', slug: 'pdf-ebooks', description: 'Comprehensive engineering handbooks, system design blueprints.', iconName: 'BookOpen', productCount: 2 },
  { id: 'cat-7', name: 'Courses & Learning Resources', slug: 'courses-learning', description: 'High-impact video masterclasses and project code repos.', iconName: 'GraduationCap', productCount: 2 },
  { id: 'cat-8', name: 'Other Digital Products', slug: 'other-digital-products', description: 'Audio assets, 3D models, shaders, and specialty tools.', iconName: 'FolderGit2', productCount: 1 },
];

export const initialProducts: Product[] = [
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

export const initialReviews: CustomerReview[] = [
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

export const initialOrders: Order[] = [
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
  },
  {
    id: 'ord-10492',
    orderNumber: 'CRX-10492',
    customerName: 'Farhana Ahmed',
    customerEmail: 'farhana.design@yahoo.com',
    customerPhone: '01899887766',
    totalAmount: 2490,
    currency: 'BDT',
    paymentStatus: 'PAID',
    deliveryStatus: 'DELIVERED',
    bkashPaymentId: 'TR0011BKH28472',
    bkashTrxId: 'BKH8B223910',
    paymentDate: '2026-10-31T09:45:00Z',
    items: [
      {
        id: 'item-2',
        productId: 'prod-2',
        productName: 'Zenith UI Master Design System 2026',
        productImage: '/assets/images/prod_design_tokens_1793972159266.jpg',
        price: 2490,
        quantity: 1,
        deliveryType: 'zip_download',
        downloadUrl: 'https://creox.com/download/token-2026'
      }
    ],
    createdAt: '2026-10-31T09:40:00Z',
    updatedAt: '2026-10-31T09:45:00Z'
  }
];

export const initialCustomers: Customer[] = [
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

export const initialStorageStats: StorageStats = {
  totalUsedBytes: 687548800,
  totalUsedFormatted: '655.7 MB',
  totalFiles: 4,
  quotaBytes: 10737418240, // 10 GB
  quotaFormatted: '10.0 GB',
  quotaUsedPercent: 6.4,
  largestFiles: [
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
      id: 'file-1',
      fileName: 'Nexus-AI-Suite-v3.4.2.zip',
      r2Key: 'products/nexus-ai-suite-v3.4.2.zip',
      fileSizeBytes: 149422080,
      fileSizeFormatted: '142.5 MB',
      fileType: 'application/zip',
      productId: 'prod-1',
      uploadedAt: '2026-10-15T10:00:00Z'
    }
  ]
};
