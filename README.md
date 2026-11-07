# CREOX — Premium Digital Products Marketplace

CREOX is a production-grade digital marketplace platform designed for selling software licenses, digital assets, Figma design systems, developer toolkits, e-books, and cloud templates. The platform features exclusive integration with the official **bKash Merchant Checkout API**, private **Cloudflare R2** digital asset storage, and **100% automated server-side digital delivery** upon verified payment.

---

## 🌟 Key Architecture & Features

- **Brand Identity**: Authentic CREOX brand identity featuring vibrant multi-stop gradients (emerald green, cyan, purple, magenta, orange) on obsidian dark glass surfaces.
- **Payment Gateway**: Exclusively integrated with the official **bKash Merchant Checkout API** (`/checkout/token/grant`, `/checkout/create`, `/checkout/execute`, `/checkout/payment/status`), with duplicate prevention, idempotent verification, and sandbox/live switching.
- **Digital Product Storage**: **Cloudflare R2** private bucket (`creox-products`) with short-lived presigned HMAC download URLs, download quotas, and download expiration timers.
- **Automated Digital Delivery**: Instant server-side fulfillment upon payment verification:
  - Automated license key allocation from single-use database pool
  - Temporary download tokens for Cloudflare R2 ZIP/PDF/installer packages
  - Instant on-screen display with one-click copy and instant download
  - Automated transactional receipt dispatch via **Resend**
- **Admin Dashboard** (`/admin`): Complete administrative suite for:
  - Real-time revenue, orders, and customer analytics
  - Digital product creation, editing, and deletion
  - Cloudflare R2 storage usage monitor (10 GB free tier tracking)
  - Direct file upload to R2
  - License key pool management (add keys, track assigned/available)
  - Order management with bKash TrxID inspection and delivery tracking
  - Customer directory with lifetime value calculation
  - Category and website settings configuration
- **Customer Self-Service Portal**: Customers can retrieve previous orders, license keys, and active download tokens at any time using their Order ID (e.g., `CRX-10491`) and Email.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, Motion, Lucide Icons |
| **Backend** | Node.js, Express, TypeScript (`tsx`) |
| **Database** | Supabase PostgreSQL (`@supabase/supabase-js`) + Local Fast Fallback Store |
| **Storage** | Cloudflare R2 Private Bucket (`creox-products`) via AWS S3 SDK |
| **Payment** | Official bKash Tokenized Merchant Checkout API |
| **Email** | Resend Transactional Email API |
| **Hosting** | Vercel / Cloud Run / Node.js Server |

---

## 🚀 Environment Variables Guide

Copy `.env.example` to `.env`:

```env
# Admin Portal Authentication
ADMIN_SECRET_KEY="creox_admin_2026"

# Supabase PostgreSQL Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Cloudflare R2 Digital Product Storage (Private Bucket: creox-products)
R2_ACCOUNT_ID="your_cloudflare_account_id"
R2_ACCESS_KEY_ID="your_r2_access_key_id"
R2_SECRET_ACCESS_KEY="your_r2_secret_access_key"
R2_BUCKET_NAME="creox-products"
R2_ENDPOINT="https://your_account_id.r2.cloudflarestorage.com"

# Official bKash Merchant Checkout API Credentials
# Sandbox Base URL: https://tokenized.sandbox.bka.sh/v1.2.0-beta
# Live Base URL: https://tokenized.pay.bka.sh/v1.2.0-beta
BKASH_BASE_URL="https://tokenized.sandbox.bka.sh/v1.2.0-beta"
BKASH_USERNAME="sandbox_username"
BKASH_PASSWORD="sandbox_password"
BKASH_APP_KEY="sandbox_app_key"
BKASH_APP_SECRET="sandbox_app_secret"

# Resend Transactional Email Provider
RESEND_API_KEY="re_your_resend_api_key"
EMAIL_FROM="CREOX Orders <orders@creox.com>"

APP_URL="http://localhost:3000"
DOWNLOAD_DOMAIN="download.creox.com"
```

---

## 🗄️ Supabase PostgreSQL Setup & Migration

1. Log into your Supabase Dashboard: [https://supabase.com](https://supabase.com)
2. Create a new project named `creox-marketplace`.
3. Open the **SQL Editor** from the left navigation panel.
4. Open the SQL migration file located at `/supabase/schema.sql` in this repository.
5. Paste the entire SQL script and click **Run**.
6. The script creates all 13 production tables:
   - `admin_users`
   - `products`
   - `categories`
   - `customers`
   - `orders`
   - `order_items`
   - `payments`
   - `digital_files`
   - `digital_deliveries`
   - `license_keys`
   - `download_tokens`
   - `website_settings`
   - `customer_reviews`
7. Copy your `Project URL` and `service_role secret` from **Project Settings → API** and paste into `.env`.

---

## ☁️ Cloudflare R2 Storage Setup

1. In the Cloudflare Dashboard, navigate to **R2 Object Storage**.
2. Click **Create bucket** and set the name to: `creox-products`.
3. Ensure the bucket is set to **Private** (do NOT enable public access).
4. Go to **Manage R2 API Tokens** and click **Create API Token**:
   - Permission: `Object Read & Write`
   - Apply to bucket: `creox-products`
5. Note your `Access Key ID`, `Secret Access Key`, and `Account ID`.
6. Add these credentials to `.env`.
7. (Optional Custom Domain): Deploy `/cloudflare/worker.js` to Cloudflare Workers with route `download.creox.com/*` bound to the `creox-products` R2 bucket.

---

## 💳 Official bKash Merchant Setup Instructions

### 1. Sandbox Testing (Developer Mode)
- Base URL: `https://tokenized.sandbox.bka.sh/v1.2.0-beta`
- The system includes a built-in sandbox simulator and auto-fill feature.
- Use any 11-digit mobile number, OTP `123456`, and PIN `12345` to test real digital product deliveries.

### 2. Live Merchant Activation
- Contact bKash Merchant Services to obtain your production tokenized checkout credentials:
  - `BKASH_BASE_URL="https://tokenized.pay.bka.sh/v1.2.0-beta"`
  - `BKASH_USERNAME`
  - `BKASH_PASSWORD`
  - `BKASH_APP_KEY`
  - `BKASH_APP_SECRET`
- Once configured in `.env`, all payments will route directly to your live bKash merchant merchant account.

---

## 💻 Running the Application

### Development:
```bash
npm install
npm run dev
```

### Production Build:
```bash
npm run build
npm start
```

### Admin Access:
- URL: `http://localhost:3000/#admin` or click **Admin** in the navigation bar.
- Default Password: `admin123` (or the `ADMIN_SECRET_KEY` specified in `.env`).
