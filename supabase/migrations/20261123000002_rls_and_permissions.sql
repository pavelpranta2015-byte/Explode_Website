-- ==============================================================================
-- EXPLODE BD — MIGRATION 002: Row Level Security (RLS) & Explicit Grants
-- ==============================================================================

-- 1. Enable RLS explicitly on all tables
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

-- 2. Explicit SQL Grants: Revoke excessive default privileges
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC;

-- Grant usage on schemas
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- 3. Grants for anon (Public Visitors / Guest Buyers)
-- Catalog: Read active categories, products, variants, delivery settings
GRANT SELECT ON public.categories TO anon;
GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.product_variants TO anon;
GRANT SELECT ON public.delivery_settings TO anon;

-- Orders & Customers: Guest checkout inserts are permitted under strict server actions,
-- but anon direct SELECT on orders/customers is explicitly denied.
GRANT INSERT ON public.customers TO anon;
GRANT INSERT ON public.orders TO anon;
GRANT INSERT ON public.order_items TO anon;
GRANT INSERT ON public.payments TO anon;

-- 4. Grants for authenticated (Logged-in Customers & Staff)
GRANT SELECT ON public.categories TO authenticated;
GRANT SELECT ON public.products TO authenticated;
GRANT SELECT ON public.product_variants TO authenticated;
GRANT SELECT ON public.delivery_settings TO authenticated;
GRANT SELECT, UPDATE ON public.customers TO authenticated;
GRANT SELECT, INSERT ON public.orders TO authenticated;
GRANT SELECT, INSERT ON public.order_items TO authenticated;
GRANT SELECT, INSERT ON public.payments TO authenticated;
GRANT SELECT ON public.customer_segments TO authenticated;

-- Grants for service_role (Trusted Server Engine)
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA app_private TO service_role;

-- ==============================================================================
-- 5. Row Level Security Policies
-- ==============================================================================

-- --- CATEGORIES ---
CREATE POLICY "Public visitors can view active categories"
ON public.categories FOR SELECT
TO anon, authenticated
USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins have full control over categories"
ON public.categories FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- --- PRODUCTS ---
CREATE POLICY "Public visitors can view active products"
ON public.products FOR SELECT
TO anon, authenticated
USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins have full control over products"
ON public.products FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- --- PRODUCT VARIANTS ---
CREATE POLICY "Public visitors can view active variants"
ON public.product_variants FOR SELECT
TO anon, authenticated
USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins have full control over variants"
ON public.product_variants FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- --- INVENTORY MOVEMENTS ---
CREATE POLICY "Only admins can view inventory movements"
ON public.inventory_movements FOR SELECT
TO authenticated
USING (public.is_admin());

-- --- DELIVERY SETTINGS ---
CREATE POLICY "Public visitors can view delivery settings"
ON public.delivery_settings FOR SELECT
TO anon, authenticated
USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can manage delivery settings"
ON public.delivery_settings FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- --- CUSTOMERS ---
-- Customers can only read and update their own record
CREATE POLICY "Customers can view their own profile"
ON public.customers FOR SELECT
TO authenticated
USING (auth_user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Customers can update their own profile"
ON public.customers FOR UPDATE
TO authenticated
USING (auth_user_id = auth.uid() OR public.is_admin())
WITH CHECK (auth_user_id = auth.uid() OR public.is_admin());

-- Permitted insert for customer creation during checkout
CREATE POLICY "Anyone can create a customer record during checkout"
ON public.customers FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- --- ORDERS ---
-- Customers can only view their own linked orders; Admins can view all orders
CREATE POLICY "Customers can view their own orders"
ON public.orders FOR SELECT
TO authenticated
USING (
    customer_id IN (
        SELECT id FROM public.customers WHERE auth_user_id = auth.uid()
    )
    OR public.is_admin()
);

-- Guest order insertion policy
CREATE POLICY "Allow order creation"
ON public.orders FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can update order status
CREATE POLICY "Admins can update orders"
ON public.orders FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- --- ORDER ITEMS ---
CREATE POLICY "Customers can view their own order items"
ON public.order_items FOR SELECT
TO authenticated
USING (
    order_id IN (
        SELECT o.id FROM public.orders o
        JOIN public.customers c ON o.customer_id = c.id
        WHERE c.auth_user_id = auth.uid()
    )
    OR public.is_admin()
);

CREATE POLICY "Allow order items creation"
ON public.order_items FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- --- ORDER STATUS HISTORY ---
CREATE POLICY "Admins can view and insert order status history"
ON public.order_status_history FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- --- PAYMENTS ---
CREATE POLICY "Admins can manage payments, customers can view own payment"
ON public.payments FOR SELECT
TO authenticated
USING (
    order_id IN (
        SELECT o.id FROM public.orders o
        JOIN public.customers c ON o.customer_id = c.id
        WHERE c.auth_user_id = auth.uid()
    )
    OR public.is_admin()
);

CREATE POLICY "Allow payment record creation"
ON public.payments FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Only admins can verify payments"
ON public.payments FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- --- APP PRIVATE GOVERNANCE ---
CREATE POLICY "Admins can view user roles"
ON app_private.user_roles FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can view audit logs"
ON app_private.audit_events FOR SELECT
TO authenticated
USING (public.is_admin());
