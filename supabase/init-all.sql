-- ==============================================================================
-- EXPLODE BD — COMPLETE DATABASE INITIALIZATION (RUN THIS IN SUPABASE SQL EDITOR)
-- ==============================================================================

-- 1. Create dedicated private schema for internal governance and security
CREATE SCHEMA IF NOT EXISTS app_private;

REVOKE ALL ON SCHEMA app_private FROM PUBLIC;
REVOKE ALL ON SCHEMA app_private FROM anon;
REVOKE ALL ON SCHEMA app_private FROM authenticated;

-- 2. Enumerated Types
DO $$ BEGIN
    CREATE TYPE order_status AS ENUM (
        'pending',
        'confirmed',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
        'returned',
        'refunded'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM (
        'unpaid',
        'under_review',
        'paid',
        'refunded',
        'failed'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM (
        'cod',
        'bkash',
        'nagad',
        'rocket'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM (
        'admin',
        'staff'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE inventory_movement_reason AS ENUM (
        'order_placed',
        'order_cancelled',
        'restock',
        'damaged_or_lost',
        'manual_adjustment'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Security Role Assignment in app_private
CREATE TABLE IF NOT EXISTS app_private.user_roles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'staff',
    granted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    granted_by UUID REFERENCES auth.users(id)
);

ALTER TABLE app_private.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Audit Log Table in app_private
CREATE TABLE IF NOT EXISTS app_private.audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    actor_id UUID REFERENCES auth.users(id),
    target_entity TEXT NOT NULL,
    target_id TEXT,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip_address INET,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE app_private.audit_events ENABLE ROW LEVEL SECURITY;

-- 5. Helper Function: Is Current User an Admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, app_private, auth
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM app_private.user_roles
        WHERE user_id = auth.uid()
          AND role = 'admin'
    );
$$;

-- 6. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    name_en TEXT NOT NULL,
    name_bn TEXT NOT NULL,
    description_en TEXT,
    description_bn TEXT,
    image_url TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON public.categories(is_active);

-- 7. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    sku TEXT UNIQUE,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    title_en TEXT NOT NULL,
    title_bn TEXT NOT NULL,
    short_description_en TEXT,
    short_description_bn TEXT,
    description_en TEXT,
    description_bn TEXT,
    fabric_en TEXT,
    fabric_bn TEXT,
    care_instructions_en TEXT,
    care_instructions_bn TEXT,
    base_price NUMERIC(10, 2) NOT NULL CHECK (base_price >= 0),
    images TEXT[] NOT NULL DEFAULT '{}',
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_new_arrival BOOLEAN NOT NULL DEFAULT false,
    is_best_seller BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);

-- 8. Product Variants & Inventory Table
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    sku TEXT UNIQUE,
    color_en TEXT,
    color_bn TEXT,
    color_hex TEXT,
    size TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_variants_product ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_variants_sku ON public.product_variants(sku);

-- 9. Inventory Movements Ledger
CREATE TABLE IF NOT EXISTS public.inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE RESTRICT,
    quantity_change INT NOT NULL,
    balance_after INT NOT NULL CHECK (balance_after >= 0),
    reason inventory_movement_reason NOT NULL,
    reference_id TEXT,
    actor_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_inv_movement_variant ON public.inventory_movements(variant_id);

-- 10. Canonical Customers Table
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    canonical_phone TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    alt_phone TEXT,
    email TEXT,
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(canonical_phone);
CREATE INDEX IF NOT EXISTS idx_customers_auth ON public.customers(auth_user_id);

-- 11. Delivery Settings Table
CREATE TABLE IF NOT EXISTS public.delivery_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    zone_code TEXT NOT NULL UNIQUE,
    name_en TEXT NOT NULL,
    name_bn TEXT NOT NULL,
    delivery_fee NUMERIC(10, 2) NOT NULL CHECK (delivery_fee >= 0),
    estimated_delivery_en TEXT NOT NULL,
    estimated_delivery_bn TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

INSERT INTO public.delivery_settings (zone_code, name_en, name_bn, delivery_fee, estimated_delivery_en, estimated_delivery_bn)
VALUES 
    ('inside_dhaka', 'Inside Dhaka', 'ঢাকা সিটির ভেতরে', 80.00, '24–48 Hours', '২৪–৪৮ ঘণ্টা'),
    ('dhaka_suburbs', 'Dhaka Suburbs', 'ঢাকার আশপাশে', 100.00, '48–72 Hours', '৪৮–৭২ ঘণ্টা'),
    ('outside_dhaka', 'Outside Dhaka', 'ঢাকার বাইরে সমগ্র বাংলাদেশ', 130.00, '3–5 Working Days', '৩–৫ কার্যদিবস')
ON CONFLICT (zone_code) DO UPDATE
SET delivery_fee = EXCLUDED.delivery_fee;

-- 12. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
    status order_status NOT NULL DEFAULT 'pending',
    payment_status payment_status NOT NULL DEFAULT 'unpaid',
    payment_method payment_method NOT NULL DEFAULT 'cod',
    delivery_zone TEXT NOT NULL REFERENCES public.delivery_settings(zone_code),
    delivery_address JSONB NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    shipping_fee NUMERIC(10, 2) NOT NULL CHECK (shipping_fee >= 0),
    discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (discount_amount >= 0),
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);

-- 13. Order Items Snapshot Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    snapshot_title TEXT NOT NULL,
    snapshot_color TEXT,
    snapshot_size TEXT,
    snapshot_image TEXT,
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    quantity INT NOT NULL CHECK (quantity > 0),
    total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

-- 14. Order Status History Table
CREATE TABLE IF NOT EXISTS public.order_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    previous_status order_status,
    new_status order_status NOT NULL,
    actor_id UUID REFERENCES auth.users(id),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_order_status_hist_order ON public.order_status_history(order_id);

-- 15. Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    method payment_method NOT NULL,
    claimed_trx_id TEXT,
    claimed_sender_phone TEXT,
    claimed_amount NUMERIC(10, 2) CHECK (claimed_amount >= 0),
    verification_status TEXT NOT NULL DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'verified', 'rejected')),
    verified_by UUID REFERENCES auth.users(id),
    verified_at TIMESTAMPTZ,
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payments(order_id);

-- 16. Customer Segmentation View (Strict Section 11 Rules)
CREATE OR REPLACE VIEW public.customer_segments
WITH (security_invoker = true)
AS
WITH customer_orders AS (
    SELECT 
        c.id AS customer_id,
        c.canonical_phone,
        c.full_name,
        c.created_at AS customer_since,
        COUNT(o.id) FILTER (WHERE o.status = 'delivered') AS delivered_orders_count,
        COALESCE(SUM(o.subtotal - o.discount_amount) FILTER (WHERE o.status = 'delivered'), 0.00) AS net_merchandise_spend,
        MIN(o.created_at) FILTER (WHERE o.status = 'delivered') AS first_purchase_date,
        MAX(o.created_at) FILTER (WHERE o.status = 'delivered') AS last_purchase_date
    FROM public.customers c
    LEFT JOIN public.orders o ON c.id = o.customer_id
    GROUP BY c.id, c.canonical_phone, c.full_name, c.created_at
)
SELECT 
    customer_id,
    canonical_phone,
    full_name,
    customer_since,
    delivered_orders_count,
    net_merchandise_spend,
    first_purchase_date,
    last_purchase_date,
    CASE 
        WHEN delivered_orders_count = 0 THEN 'Lead / No Purchase'
        WHEN delivered_orders_count BETWEEN 1 AND 3 THEN 'New Customer'
        WHEN delivered_orders_count BETWEEN 4 AND 5 THEN 'VIP Customer'
        WHEN delivered_orders_count >= 6 THEN 'Premium Customer'
        ELSE 'Lead / No Purchase'
    END AS segment_tier
FROM customer_orders;

-- 17. Enable Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Explicit Grants
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA app_private TO service_role;

GRANT SELECT ON public.categories TO anon, authenticated;
GRANT SELECT ON public.products TO anon, authenticated;
GRANT SELECT ON public.product_variants TO anon, authenticated;
GRANT SELECT ON public.delivery_settings TO anon, authenticated;

-- RLS Policies
CREATE POLICY "Public can view active categories" ON public.categories FOR SELECT TO anon, authenticated USING (is_active = true OR public.is_admin());
CREATE POLICY "Public can view active products" ON public.products FOR SELECT TO anon, authenticated USING (is_active = true OR public.is_admin());
CREATE POLICY "Public can view active variants" ON public.product_variants FOR SELECT TO anon, authenticated USING (is_active = true OR public.is_admin());
CREATE POLICY "Public can view delivery settings" ON public.delivery_settings FOR SELECT TO anon, authenticated USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins full categories" ON public.categories FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins full products" ON public.products FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins full variants" ON public.product_variants FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins full delivery" ON public.delivery_settings FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins view inventory" ON public.inventory_movements FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins view audit" ON app_private.audit_events FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "Customers view own profile" ON public.customers FOR SELECT TO authenticated USING (auth_user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Customers view own orders" ON public.orders FOR SELECT TO authenticated USING (customer_id IN (SELECT id FROM public.customers WHERE auth_user_id = auth.uid()) OR public.is_admin());
CREATE POLICY "Admins update orders" ON public.orders FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins manage payments" ON public.payments FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 18. Seed Initial Categories and Products
INSERT INTO public.categories (slug, name_en, name_bn, description_en, description_bn, sort_order, is_active)
VALUES
    ('ready-to-wear-hijabs', 'Ready-to-Wear Hijabs', 'রেডি-টু-ওয়্যার হিজাব', 'Pre-sewn instant modest hijabs.', 'সহজে ব্যবহারযোগ্য রেডি হিজাব।', 1, true),
    ('ribbed-jersey-hijabs', 'Ribbed Jersey Hijabs', 'রিবড জার্সি হিজাব', 'Premium textured ribbed jersey.', 'প্রিমিয়াম টেক্সচার্ড রিবড জার্সি হিজাব।', 2, true),
    ('mosscrepe-hijabs', 'Mosscrepe Hijabs', 'মসক্রেপ হিজাব', 'Soft, crease-resistant mosscrepe fabric.', 'নরম ও আরামদায়ক মসক্রেপ হিজাব।', 3, true),
    ('salat-suits', 'Salat Suits', 'সালাত স্যুট / নামাজ সেট', 'Elegant two-piece prayer telekung sets.', 'টু-পিস নামাজের সালাত সেট।', 4, true),
    ('khimar-sets', 'Khimar Sets', 'খিমার সেট', 'Long, graceful Islamic khimars.', 'মার্জিত খিমার সেট।', 5, true),
    ('abayas', 'Abayas', 'আবায়া', 'Flowing modest abayas.', 'মার্জিত ডিজাইনের আবায়া।', 6, true)
ON CONFLICT (slug) DO NOTHING;

DO $$
DECLARE
    v_cat_ribbed UUID;
    v_cat_salat UUID;
    v_prod_id UUID;
BEGIN
    SELECT id INTO v_cat_ribbed FROM public.categories WHERE slug = 'ribbed-jersey-hijabs';
    SELECT id INTO v_cat_salat FROM public.categories WHERE slug = 'salat-suits';

    -- Product 1
    INSERT INTO public.products (slug, sku, category_id, title_en, title_bn, short_description_en, short_description_bn, base_price, images, is_featured, is_best_seller)
    VALUES (
        'ribbed-jersey-ready-hijab', 'EXP-RJ-001', v_cat_ribbed,
        'Ribbed Jersey Ready-to-Wear Hijab', 'রিবড জার্সি রেডি-টু-ওয়্যার হিজাব',
        'Premium stretch ribbed jersey hijab with instant face-framing design.',
        'প্রিমিয়াম স্ট্রেচ রিবড জার্সি হিজাব যা মুহূর্তেই পরিধান করা যায়।',
        650.00, ARRAY['/images/products/ribbed-jersey-1.jpg', '/images/products/ribbed-jersey-2.jpg'], true, true
    ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO v_prod_id;

    IF v_prod_id IS NOT NULL THEN
        INSERT INTO public.product_variants (product_id, sku, color_en, color_bn, color_hex, size, price, stock_quantity)
        VALUES 
            (v_prod_id, 'EXP-RJ-001-OLV', 'Olive Green', 'জলপাই সবুজ', '#68734B', 'Free Size', 650.00, 25),
            (v_prod_id, 'EXP-RJ-001-BGE', 'Sand Beige', 'স্যান্ড বেইজ', '#D7C5A5', 'Free Size', 650.00, 30)
        ON CONFLICT (sku) DO NOTHING;
    END IF;

    -- Product 2
    INSERT INTO public.products (slug, sku, category_id, title_en, title_bn, short_description_en, short_description_bn, base_price, images, is_featured, is_best_seller)
    VALUES (
        'two-piece-prayer-salat-suit', 'EXP-ST-003', v_cat_salat,
        'Two-Piece Modest Prayer Salat Suit', 'টু-পিস নামাজের সালাত স্যুট সেট',
        'Comfortable breathable cotton-blend prayer suit set with matching bag.',
        'আরামদায়ক সুতি কাপড়ের টু-পিস নামাজ সেট।',
        1850.00, ARRAY['/images/products/salat-suit-1.jpg', '/images/products/salat-suit-2.jpg'], true, true
    ) ON CONFLICT (slug) DO NOTHING RETURNING id INTO v_prod_id;

    IF v_prod_id IS NOT NULL THEN
        INSERT INTO public.product_variants (product_id, sku, color_en, color_bn, color_hex, size, price, stock_quantity)
        VALUES 
            (v_prod_id, 'EXP-ST-003-WHT', 'Pure White', 'সাদা', '#FFFFFF', 'Free Size', 1850.00, 15),
            (v_prod_id, 'EXP-ST-003-LAV', 'Soft Lavender', 'হালকা বেগুনী', '#D6C7E0', 'Free Size', 1850.00, 12)
        ON CONFLICT (sku) DO NOTHING;
    END IF;
END $$;
