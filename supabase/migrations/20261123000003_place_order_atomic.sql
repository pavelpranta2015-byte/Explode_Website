-- ==============================================================================
-- EXPLODE BD — MIGRATION 003: Atomic Checkout & Stock Reservation RPC
-- ==============================================================================

-- Function to place an order atomically on the server:
-- 1. Validates and normalizes customer
-- 2. Checks and reserves stock for each variant with row-level locks
-- 3. Creates the order and order items
-- 4. Records inventory movements
-- 5. Logs order status history
CREATE OR REPLACE FUNCTION public.place_order_atomic(
    p_customer_phone TEXT,
    p_customer_name TEXT,
    p_customer_alt_phone TEXT,
    p_delivery_zone TEXT,
    p_delivery_address JSONB,
    p_payment_method payment_method,
    p_claimed_trx_id TEXT,
    p_items JSONB -- Array of { variant_id: UUID, quantity: INT }
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, app_private, auth
AS $$
DECLARE
    v_customer_id UUID;
    v_order_id UUID;
    v_order_number TEXT;
    v_random_num INT;
    v_item JSONB;
    v_variant_id UUID;
    v_qty INT;
    v_unit_price NUMERIC(10, 2);
    v_variant_stock INT;
    v_variant_title TEXT;
    v_variant_color TEXT;
    v_variant_size TEXT;
    v_variant_image TEXT;
    v_subtotal NUMERIC(10, 2) := 0.00;
    v_shipping_fee NUMERIC(10, 2);
    v_total_amount NUMERIC(10, 2);
BEGIN
    -- 1. Validate Delivery Zone and Retrieve Authoritative Shipping Fee
    SELECT delivery_fee INTO v_shipping_fee
    FROM public.delivery_settings
    WHERE zone_code = p_delivery_zone AND is_active = true;

    IF v_shipping_fee IS NULL THEN
        RAISE EXCEPTION 'Invalid or inactive delivery zone: %', p_delivery_zone;
    END IF;

    -- 2. Upsert Customer by Canonical Phone Number
    INSERT INTO public.customers (canonical_phone, full_name, alt_phone)
    VALUES (p_customer_phone, p_customer_name, p_customer_alt_phone)
    ON CONFLICT (canonical_phone) DO UPDATE
    SET full_name = EXCLUDED.full_name,
        alt_phone = COALESCE(EXCLUDED.alt_phone, public.customers.alt_phone),
        updated_at = timezone('utc', now())
    RETURNING id INTO v_customer_id;

    -- 3. Generate Unique Canonical Order Number: EX-XXXXXX
    LOOP
        v_random_num := floor(100000 + random() * 900000)::INT;
        v_order_number := 'EX-' || v_random_num::TEXT;
        EXIT WHEN NOT EXISTS (SELECT 1 FROM public.orders WHERE order_number = v_order_number);
    END LOOP;

    -- 4. Create Order Header
    INSERT INTO public.orders (
        order_number,
        customer_id,
        status,
        payment_status,
        payment_method,
        delivery_zone,
        delivery_address,
        subtotal,
        shipping_fee,
        discount_amount,
        total_amount
    )
    VALUES (
        v_order_number,
        v_customer_id,
        'pending',
        'unpaid',
        p_payment_method,
        p_delivery_zone,
        p_delivery_address,
        0.00, -- Updated after calculating items
        v_shipping_fee,
        0.00,
        0.00
    )
    RETURNING id INTO v_order_id;

    -- 5. Process Items with Row-Level Locking (Prevents Overselling Concurrency)
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_variant_id := (v_item ->> 'variant_id')::UUID;
        v_qty := (v_item ->> 'quantity')::INT;

        IF v_qty <= 0 THEN
            RAISE EXCEPTION 'Quantity must be greater than zero for variant %', v_variant_id;
        END IF;

        -- Lock the variant row for atomic inventory decrement
        SELECT 
            pv.price, 
            pv.stock_quantity, 
            p.title_en, 
            pv.color_en, 
            pv.size,
            COALESCE(p.images[1], '')
        INTO 
            v_unit_price, 
            v_variant_stock, 
            v_variant_title, 
            v_variant_color, 
            v_variant_size,
            v_variant_image
        FROM public.product_variants pv
        JOIN public.products p ON pv.product_id = p.id
        WHERE pv.id = v_variant_id AND pv.is_active = true AND p.is_active = true
        FOR UPDATE OF pv;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Product variant % is not active or does not exist', v_variant_id;
        END IF;

        -- Immediate stock reservation check (Option A decision)
        IF v_variant_stock < v_qty THEN
            RAISE EXCEPTION 'Insufficient stock for product "% (Color: %, Size: %)". Available: %, Requested: %', 
                v_variant_title, v_variant_color, v_variant_size, v_variant_stock, v_qty;
        END IF;

        -- Decrement Stock Atomically
        UPDATE public.product_variants
        SET stock_quantity = stock_quantity - v_qty,
            updated_at = timezone('utc', now())
        WHERE id = v_variant_id;

        -- Record Inventory Movement
        INSERT INTO public.inventory_movements (
            variant_id,
            quantity_change,
            balance_after,
            reason,
            reference_id
        )
        VALUES (
            v_variant_id,
            -v_qty,
            v_variant_stock - v_qty,
            'order_placed',
            v_order_number
        );

        -- Record Order Item Snapshot
        INSERT INTO public.order_items (
            order_id,
            variant_id,
            snapshot_title,
            snapshot_color,
            snapshot_size,
            snapshot_image,
            unit_price,
            quantity,
            total_price
        )
        VALUES (
            v_order_id,
            v_variant_id,
            v_variant_title,
            v_variant_color,
            v_variant_size,
            v_variant_image,
            v_unit_price,
            v_qty,
            v_unit_price * v_qty
        );

        v_subtotal := v_subtotal + (v_unit_price * v_qty);
    END LOOP;

    -- 6. Update Authoritative Order Totals
    v_total_amount := v_subtotal + v_shipping_fee;

    UPDATE public.orders
    SET subtotal = v_subtotal,
        total_amount = v_total_amount
    WHERE id = v_order_id;

    -- 7. Record Initial Status History
    INSERT INTO public.order_status_history (
        order_id,
        previous_status,
        new_status,
        notes
    )
    VALUES (
        v_order_id,
        NULL,
        'pending',
        'Order submitted via website'
    );

    -- 8. If Manual Payment (bKash/Nagad/Rocket), record claim
    IF p_payment_method != 'cod' THEN
        INSERT INTO public.payments (
            order_id,
            method,
            claimed_trx_id,
            claimed_amount,
            verification_status,
            admin_notes
        )
        VALUES (
            v_order_id,
            p_payment_method,
            p_claimed_trx_id,
            v_total_amount,
            'unverified',
            'Pending verification on WhatsApp / SMS'
        );
    END IF;

    -- 9. Return Result Payload
    RETURN jsonb_build_object(
        'success', true,
        'order_id', v_order_id,
        'order_number', v_order_number,
        'subtotal', v_subtotal,
        'shipping_fee', v_shipping_fee,
        'total_amount', v_total_amount
    );
END;
$$;

-- Revoke execute from public; grant explicitly to anon and authenticated
REVOKE EXECUTE ON FUNCTION public.place_order_atomic FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.place_order_atomic TO anon, authenticated, service_role;
