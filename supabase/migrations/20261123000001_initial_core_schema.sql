-- ==============================================================================
-- EXPLODE BD — MIGRATION 001: Initial Core Schema, Governance & Security Roles
-- ==============================================================================

-- 1. Create dedicated private schema for internal governance and security
CREATE SCHEMA IF NOT EXISTS app_private;

-- Revoke default public access on private schema
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
-- Marked SECURITY DEFINER with fixed search_path to prevent search_path poisoning
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

-- 6. Helper Function: Check MFA Level for Current User
CREATE OR REPLACE FUNCTION public.is_mfa_verified()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
STABLE
AS $$
BEGIN
    -- Check if JWT claims contain aal2 level authentication
    RETURN (auth.jwt() ->> 'aal' = 'aal2');
END;
$$;

-- 7. Categories Table
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

-- 8. Products Table
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

-- 9. Product Variants & Inventory Table
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

-- 10. Inventory Movements Ledger
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

-- 11. Canonical Customers Table
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

-- 12. Delivery Settings Table
CREATE TABLE IF NOT EXISTS public.delivery_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    zone_code TEXT NOT NULL UNIQUE, -- 'inside_dhaka', 'dhaka_suburbs', 'outside_dhaka'
    name_en TEXT NOT NULL,
    name_bn TEXT NOT NULL,
    delivery_fee NUMERIC(10, 2) NOT NULL CHECK (delivery_fee >= 0),
    estimated_delivery_en TEXT NOT NULL,
    estimated_delivery_bn TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Seed initial delivery rates based on verified owner decisions (Inside Dhaka: ৳80)
INSERT INTO public.delivery_settings (zone_code, name_en, name_bn, delivery_fee, estimated_delivery_en, estimated_delivery_bn)
VALUES 
    ('inside_dhaka', 'Inside Dhaka', 'ঢাকা সিটির ভেতরে', 80.00, '24–48 Hours', '২৪–৪৮ ঘণ্টা'),
    ('dhaka_suburbs', 'Dhaka Suburbs', 'ঢাকার আশপাশে', 100.00, '48–72 Hours', '৪৮–৭২ ঘণ্টা'),
    ('outside_dhaka', 'Outside Dhaka', 'ঢাকার বাইরে সমগ্র বাংলাদেশ', 130.00, '3–5 Working Days', '৩–৫ কার্যদিবস')
ON CONFLICT (zone_code) DO UPDATE
SET delivery_fee = EXCLUDED.delivery_fee;

-- 13. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE, -- EX-XXXXXX
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
    status order_status NOT NULL DEFAULT 'pending',
    payment_status payment_status NOT NULL DEFAULT 'unpaid',
    payment_method payment_method NOT NULL DEFAULT 'cod',
    delivery_zone TEXT NOT NULL REFERENCES public.delivery_settings(zone_code),
    delivery_address JSONB NOT NULL, -- { fullAddress, district, cityArea, deliveryInstructions }
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

-- 14. Order Items Snapshot Table (Immutable Historical Record)
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

-- 15. Order Status History (Append-Only)
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

-- 16. Manual Payments Record Table
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
CREATE INDEX IF NOT EXISTS idx_payments_trx ON public.payments(claimed_trx_id);

-- 17. Customer Segmentation View (Strict Section 11 Exact Rules)
-- Security Invoker to enforce calling permissions
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
