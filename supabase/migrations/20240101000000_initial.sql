-- ============================================================
-- CHASED - Migration Inicial
-- Execute no SQL Editor do Supabase
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABELAS
-- ============================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('client', 'rep_admin')),
  name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pharmacies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  pharmacy_name TEXT NOT NULL,
  responsible_name TEXT NOT NULL,
  cnpj TEXT,
  whatsapp TEXT NOT NULL,
  address_line1 TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  state TEXT NOT NULL DEFAULT '',
  zip TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rep_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL REFERENCES profiles(id),
  display_name TEXT NOT NULL DEFAULT 'Representante',
  whatsapp_number_e164 TEXT NOT NULL,
  whatsapp_number_digits TEXT NOT NULL,
  logo_url TEXT,
  default_footer_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id),
  name TEXT NOT NULL,
  brand TEXT,
  presentation TEXT NOT NULL,
  description TEXT,
  price_cents INT NOT NULL CHECK (price_cents > 0),
  stock_qty INT NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category_active ON products(category_id, active);

CREATE TABLE IF NOT EXISTS promo_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  link_type TEXT NOT NULL CHECK (link_type IN ('category', 'product', 'none')),
  link_target_id UUID,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id UUID NOT NULL REFERENCES pharmacies(id),
  client_user_id UUID NOT NULL REFERENCES profiles(id),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'confirmed', 'delivered', 'cancelled')),
  notes TEXT,
  subtotal_cents INT NOT NULL DEFAULT 0,
  discount_cents INT NOT NULL DEFAULT 0,
  total_cents INT NOT NULL DEFAULT 0,
  whatsapp_message TEXT NOT NULL DEFAULT '',
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_client_user ON orders(client_user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  product_snapshot JSONB NOT NULL,
  unit_price_cents INT NOT NULL,
  qty INT NOT NULL CHECK (qty > 0),
  line_total_cents INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  pharmacy_id UUID,
  event_name TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::JSONB,
  user_agent TEXT,
  ip TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_name_created ON events(event_name, created_at DESC);

-- ============================================================
-- FUNÇÕES
-- ============================================================

CREATE OR REPLACE FUNCTION decrement_stock(p_product_id UUID, p_qty INT)
RETURNS VOID AS $$
BEGIN
  UPDATE products 
  SET stock_qty = GREATEST(0, stock_qty - p_qty),
      updated_at = NOW()
  WHERE id = p_product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacies ENABLE ROW LEVEL SECURITY;
ALTER TABLE rep_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- PROFILES
DROP POLICY IF EXISTS "profiles_select" ON profiles;
DROP POLICY IF EXISTS "profiles_insert" ON profiles;
DROP POLICY IF EXISTS "profiles_update" ON profiles;
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (id = auth.uid() OR current_user_role() = 'rep_admin');
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (id = auth.uid());

-- PHARMACIES
DROP POLICY IF EXISTS "pharmacies_select" ON pharmacies;
DROP POLICY IF EXISTS "pharmacies_insert" ON pharmacies;
DROP POLICY IF EXISTS "pharmacies_update" ON pharmacies;
CREATE POLICY "pharmacies_select" ON pharmacies FOR SELECT USING (owner_user_id = auth.uid() OR current_user_role() = 'rep_admin');
CREATE POLICY "pharmacies_insert" ON pharmacies FOR INSERT WITH CHECK (owner_user_id = auth.uid() OR auth.uid() IS NOT NULL);
CREATE POLICY "pharmacies_update" ON pharmacies FOR UPDATE USING (owner_user_id = auth.uid());

-- REP SETTINGS
DROP POLICY IF EXISTS "rep_settings_select" ON rep_settings;
DROP POLICY IF EXISTS "rep_settings_all" ON rep_settings;
CREATE POLICY "rep_settings_select" ON rep_settings FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "rep_settings_all" ON rep_settings FOR ALL USING (current_user_role() = 'rep_admin');

-- CATEGORIES
DROP POLICY IF EXISTS "categories_select" ON categories;
DROP POLICY IF EXISTS "categories_all" ON categories;
CREATE POLICY "categories_select" ON categories FOR SELECT USING (active = TRUE OR current_user_role() = 'rep_admin');
CREATE POLICY "categories_all" ON categories FOR ALL USING (current_user_role() = 'rep_admin');

-- PRODUCTS
DROP POLICY IF EXISTS "products_select" ON products;
DROP POLICY IF EXISTS "products_all" ON products;
CREATE POLICY "products_select" ON products FOR SELECT USING (active = TRUE OR current_user_role() = 'rep_admin');
CREATE POLICY "products_all" ON products FOR ALL USING (current_user_role() = 'rep_admin');

-- PROMO BANNERS
DROP POLICY IF EXISTS "promos_select" ON promo_banners;
DROP POLICY IF EXISTS "promos_all" ON promo_banners;
CREATE POLICY "promos_select" ON promo_banners FOR SELECT USING (active = TRUE OR current_user_role() = 'rep_admin');
CREATE POLICY "promos_all" ON promo_banners FOR ALL USING (current_user_role() = 'rep_admin');

-- ORDERS
DROP POLICY IF EXISTS "orders_select" ON orders;
DROP POLICY IF EXISTS "orders_insert" ON orders;
DROP POLICY IF EXISTS "orders_update" ON orders;
CREATE POLICY "orders_select" ON orders FOR SELECT USING (client_user_id = auth.uid() OR current_user_role() = 'rep_admin');
CREATE POLICY "orders_insert" ON orders FOR INSERT WITH CHECK (client_user_id = auth.uid());
CREATE POLICY "orders_update" ON orders FOR UPDATE USING (client_user_id = auth.uid() OR current_user_role() = 'rep_admin');

-- ORDER ITEMS
DROP POLICY IF EXISTS "order_items_select" ON order_items;
DROP POLICY IF EXISTS "order_items_insert" ON order_items;
CREATE POLICY "order_items_select" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND (orders.client_user_id = auth.uid() OR current_user_role() = 'rep_admin'))
);
CREATE POLICY "order_items_insert" ON order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.client_user_id = auth.uid())
);

-- EVENTS
DROP POLICY IF EXISTS "events_insert" ON events;
DROP POLICY IF EXISTS "events_select" ON events;
CREATE POLICY "events_insert" ON events FOR INSERT WITH CHECK (user_id = auth.uid() OR user_id IS NULL);
CREATE POLICY "events_select" ON events FOR SELECT USING (user_id = auth.uid() OR current_user_role() = 'rep_admin');

