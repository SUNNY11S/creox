-- =========================================================================
-- CREOX DIGITAL MARKETPLACE — SUPABASE POSTGRESQL PRODUCTION SCHEMA
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ADMIN USERS TABLE
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  role VARCHAR(50) DEFAULT 'SUPER_ADMIN' CHECK (role IN ('SUPER_ADMIN', 'MANAGER')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  last_login TIMESTAMP WITH TIME ZONE
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(150) UNIQUE NOT NULL,
  slug VARCHAR(150) UNIQUE NOT NULL,
  description TEXT,
  icon_name VARCHAR(100) DEFAULT 'Folder',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  category_name VARCHAR(150) NOT NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  short_description TEXT,
  description TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  original_price NUMERIC(12, 2) NOT NULL CHECK (original_price >= price),
  discount_percentage INT DEFAULT 0,
  image_url TEXT NOT NULL,
  secondary_images JSONB DEFAULT '[]'::jsonb,
  features JSONB DEFAULT '[]'::jsonb,
  specifications JSONB DEFAULT '{}'::jsonb,
  delivery_type VARCHAR(50) NOT NULL CHECK (delivery_type IN (
    'zip_download', 'pdf_ebook', 'software_file', 'graphics_template', 
    'license_key', 'activation_code', 'access_link', 'custom_instructions'
  )),
  file_name VARCHAR(255),
  file_size_mb NUMERIC(8, 2),
  r2_object_key TEXT,
  access_url TEXT,
  custom_instructions TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_best_seller BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  total_sales INT DEFAULT 0,
  rating NUMERIC(3, 2) DEFAULT 5.0,
  review_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  total_purchases NUMERIC(14, 2) DEFAULT 0,
  order_count INT DEFAULT 0,
  last_order_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  customer_name VARCHAR(150) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount > 0),
  currency VARCHAR(10) DEFAULT 'BDT' NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED', 'CANCELLED')),
  delivery_status VARCHAR(50) DEFAULT 'PENDING' CHECK (delivery_status IN ('PENDING', 'DELIVERED', 'FAILED')),
  bkash_payment_id VARCHAR(100),
  bkash_trx_id VARCHAR(100),
  payment_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(255) NOT NULL,
  product_image TEXT,
  price NUMERIC(12, 2) NOT NULL,
  quantity INT DEFAULT 1 CHECK (quantity > 0),
  delivery_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. PAYMENTS TABLE (bKash logs & audit)
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  gateway VARCHAR(50) DEFAULT 'BKASH' NOT NULL,
  payment_id VARCHAR(100) UNIQUE NOT NULL,
  trx_id VARCHAR(100) UNIQUE,
  amount NUMERIC(12, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'BDT' NOT NULL,
  status VARCHAR(50) NOT NULL,
  customer_msisdn VARCHAR(50),
  raw_response JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. DIGITAL FILES TABLE (Cloudflare R2 metadata)
CREATE TABLE IF NOT EXISTS digital_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_name VARCHAR(255) NOT NULL,
  r2_key TEXT UNIQUE NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  file_type VARCHAR(100),
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  uploaded_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. LICENSE KEYS TABLE (One-time pool tracking)
CREATE TABLE IF NOT EXISTS license_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  key_code TEXT NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  assigned_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_product_key UNIQUE (product_id, key_code)
);

-- 10. DOWNLOAD TOKENS TABLE (Secure short-lived access)
CREATE TABLE IF NOT EXISTS download_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token VARCHAR(128) UNIQUE NOT NULL,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  r2_key TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  max_downloads INT DEFAULT 5 NOT NULL,
  download_count INT DEFAULT 0 NOT NULL,
  is_revoked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. DIGITAL DELIVERIES TABLE (Fulfillment records)
CREATE TABLE IF NOT EXISTS digital_deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  order_item_id UUID REFERENCES order_items(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  delivery_type VARCHAR(50) NOT NULL,
  license_key_id UUID REFERENCES license_keys(id),
  download_token_id UUID REFERENCES download_tokens(id),
  access_url TEXT,
  custom_instructions TEXT,
  delivered_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. WEBSITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS website_settings (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. CUSTOMER REVIEWS TABLE
CREATE TABLE IF NOT EXISTS customer_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  customer_name VARCHAR(150) NOT NULL,
  customer_email VARCHAR(255),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  verified_purchase BOOLEAN DEFAULT TRUE,
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_license_unused ON license_keys(product_id) WHERE is_used = FALSE;
CREATE INDEX IF NOT EXISTS idx_download_token ON download_tokens(token);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE download_tokens ENABLE ROW LEVEL SECURITY;

-- Public can read active products, categories, approved reviews
CREATE POLICY "Public read active products" ON products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public read categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Public read approved reviews" ON customer_reviews
  FOR SELECT USING (is_approved = true);

-- Service role has full unrestricted admin access
CREATE POLICY "Service role full access products" ON products
  FOR ALL TO service_role USING (true);

CREATE POLICY "Service role full access orders" ON orders
  FOR ALL TO service_role USING (true);

CREATE POLICY "Service role full access deliveries" ON digital_deliveries
  FOR ALL TO service_role USING (true);
