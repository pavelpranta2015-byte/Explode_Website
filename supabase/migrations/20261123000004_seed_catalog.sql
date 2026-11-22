-- ==============================================================================
-- EXPLODE BD — MIGRATION 004: Seed Initial Products & Categories
-- ==============================================================================

-- 1. Insert Categories
INSERT INTO public.categories (slug, name_en, name_bn, description_en, description_bn, sort_order, is_active)
VALUES
    ('ready-to-wear-hijabs', 'Ready-to-Wear Hijabs', 'রেডি-টু-ওয়্যার হিজাব', 'Pre-sewn, pin-free instant modest hijabs for everyday comfort and elegance.', 'প্রতিদিনের আরাম ও শালীনতার জন্য সহজে ব্যবহারযোগ্য রেডি হিজাব।', 1, true),
    ('ribbed-jersey-hijabs', 'Ribbed Jersey Hijabs', 'রিবড জার্সি হিজাব', 'Premium textured ribbed jersey with non-slip breathable stretch.', 'প্রিমিয়াম টেক্সচার্ড রিবড জার্সি হিজাব যা অত্যন্ত আরামদায়ক ও নন-স্লিপ।', 2, true),
    ('mosscrepe-hijabs', 'Mosscrepe Hijabs', 'মসক্রেপ হিজাব', 'Soft, crease-resistant mosscrepe fabric tailored for full chest coverage.', 'নরম ও কুঁচকে না যাওয়া মসক্রেপ কাপড়ে তৈরি সম্পূর্ণ চেস্ট কভারেজ হিজাব।', 3, true),
    ('salat-suits', 'Salat Suits', 'সালাত স্যুট / নামাজ সেট', 'Elegant two-piece prayer telekung sets crafted with soft breathable cotton blends.', 'নামাজের জন্য বিশেষ উপযোগী মার্জিত ও পরিচ্ছন্ন টু-পিস সালাত সেট।', 4, true),
    ('khimar-sets', 'Khimar Sets', 'খিমার সেট', 'Long, graceful Islamic khimars offering modest full-length silhouettes.', 'সম্পূর্ণ শালীনতা নিশ্চিত করার জন্য সুন্দর ও মার্জিত খিমার সেট।', 5, true),
    ('abayas', 'Abayas', 'আবায়া', 'Flowing modest abayas designed for daily elegance and special occasions.', 'দৈনন্দিন পরিধান এবং বিশেষ অনুষ্ঠানের জন্য মার্জিত ডিজাইনের আবায়া।', 6, true),
    ('plain-hijabs', 'Plain Hijabs', 'প্লেন হিজাব', 'Minimalist solid everyday hijabs in neutral and pastel earthy palettes.', 'মার্জিত রঙের নিখুঁত শেডের প্রতিদিনের ব্যবহারের প্লেন হিজাব।', 7, true),
    ('accessories', 'Accessories', 'এক্সেসরিজ', 'Hijab magnets, inner caps, and pins designed to secure modest styles gently.', 'হিজাব ম্যাগনেট, ইনার ক্যাপ ও পিন যা কাপড়ের কোনো ক্ষতি করে না।', 8, true)
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Core Products and Variants
DO $$
DECLARE
    v_cat_ready UUID;
    v_cat_ribbed UUID;
    v_cat_mosscrepe UUID;
    v_cat_salat UUID;
    v_cat_khimar UUID;
    v_prod_id UUID;
BEGIN
    SELECT id INTO v_cat_ready FROM public.categories WHERE slug = 'ready-to-wear-hijabs';
    SELECT id INTO v_cat_ribbed FROM public.categories WHERE slug = 'ribbed-jersey-hijabs';
    SELECT id INTO v_cat_mosscrepe FROM public.categories WHERE slug = 'mosscrepe-hijabs';
    SELECT id INTO v_cat_salat FROM public.categories WHERE slug = 'salat-suits';
    SELECT id INTO v_cat_khimar FROM public.categories WHERE slug = 'khimar-sets';

    -- Product 1: Ribbed Jersey Ready Hijab
    INSERT INTO public.products (slug, sku, category_id, title_en, title_bn, short_description_en, short_description_bn, base_price, images, is_featured, is_best_seller)
    VALUES (
        'ribbed-jersey-ready-hijab',
        'EXP-RJ-001',
        v_cat_ribbed,
        'Ribbed Jersey Ready-to-Wear Hijab',
        'রিবড জার্সি রেডি-টু-ওয়্যার হিজাব',
        'Premium stretch ribbed jersey hijab with instant face-framing design.',
        'প্রিমিয়াম স্ট্রেচ রিবড জার্সি হিজাব যা মুহূর্তেই পরিধান করা যায়।',
        650.00,
        ARRAY['/images/products/ribbed-jersey-1.jpg', '/images/products/ribbed-jersey-2.jpg'],
        true,
        true
    )
    ON CONFLICT (slug) DO UPDATE SET base_price = EXCLUDED.base_price
    RETURNING id INTO v_prod_id;

    INSERT INTO public.product_variants (product_id, sku, color_en, color_bn, color_hex, size, price, stock_quantity)
    VALUES 
        (v_prod_id, 'EXP-RJ-001-OLV', 'Olive Green', 'জলপাই সবুজ', '#68734B', 'Free Size', 650.00, 25),
        (v_prod_id, 'EXP-RJ-001-BGE', 'Sand Beige', 'স্যান্ড বেইজ', '#D7C5A5', 'Free Size', 650.00, 30),
        (v_prod_id, 'EXP-RJ-001-BLK', 'Midnight Black', 'কালো', '#1F201C', 'Free Size', 650.00, 40)
    ON CONFLICT (sku) DO NOTHING;

    -- Product 2: Premium Mosscrepe Long Hijab
    INSERT INTO public.products (slug, sku, category_id, title_en, title_bn, short_description_en, short_description_bn, base_price, images, is_featured, is_new_arrival)
    VALUES (
        'premium-mosscrepe-long-hijab',
        'EXP-MC-002',
        v_cat_mosscrepe,
        'Premium Mosscrepe Chest Coverage Hijab',
        'প্রিমিয়াম মসক্রেপ লং হিজাব',
        'Full chest coverage mosscrepe hijab tailored for daily prayers and outdoor modesty.',
        'সম্পূর্ণ চেস্ট কভারেজ নিশ্চিত করা মসক্রেপ কাপড়ের প্রিমিয়াম হিজাব।',
        850.00,
        ARRAY['/images/products/mosscrepe-l-1.jpg', '/images/products/mosscrepe-l-2.jpg'],
        true,
        true
    )
    ON CONFLICT (slug) DO UPDATE SET base_price = EXCLUDED.base_price
    RETURNING id INTO v_prod_id;

    INSERT INTO public.product_variants (product_id, sku, color_en, color_bn, color_hex, size, price, stock_quantity)
    VALUES 
        (v_prod_id, 'EXP-MC-002-NVY', 'Deep Navy', 'গাঢ় নীল', '#1B2430', 'Standard (75"x30")', 850.00, 20),
        (v_prod_id, 'EXP-MC-002-CRM', 'Warm Cream', 'ক্রিম', '#F5F0E6', 'Standard (75"x30")', 850.00, 18)
    ON CONFLICT (sku) DO NOTHING;

    -- Product 3: Two-Piece Prayer Salat Telekung Suit
    INSERT INTO public.products (slug, sku, category_id, title_en, title_bn, short_description_en, short_description_bn, base_price, images, is_featured, is_best_seller)
    VALUES (
        'two-piece-prayer-salat-suit',
        'EXP-ST-003',
        v_cat_salat,
        'Two-Piece Modest Prayer Salat Suit',
        'টু-পিস নামাজের সালাত স্যুট সেট',
        'Comfortable breathable cotton-blend prayer suit set with matching bag.',
        'আরামদায়ক সুতি কাপড়ের টু-পিস নামাজ সেট সাথে ম্যাচিং পাউচ ব্যাগ।',
        1850.00,
        ARRAY['/images/products/salat-suit-1.jpg', '/images/products/salat-suit-2.jpg'],
        true,
        true
    )
    ON CONFLICT (slug) DO UPDATE SET base_price = EXCLUDED.base_price
    RETURNING id INTO v_prod_id;

    INSERT INTO public.product_variants (product_id, sku, color_en, color_bn, color_hex, size, price, stock_quantity)
    VALUES 
        (v_prod_id, 'EXP-ST-003-WHT', 'Pure White', 'সাদা', '#FFFFFF', 'Free Size', 1850.00, 15),
        (v_prod_id, 'EXP-ST-003-LAV', 'Soft Lavender', 'হালকা বেগুনী', '#D6C7E0', 'Free Size', 1850.00, 12)
    ON CONFLICT (sku) DO NOTHING;

    -- Product 4: French Cut Modest Khimar Set
    INSERT INTO public.products (slug, sku, category_id, title_en, title_bn, short_description_en, short_description_bn, base_price, images, is_featured)
    VALUES (
        'french-cut-modest-khimar',
        'EXP-KH-004',
        v_cat_khimar,
        'French Cut Modest Khimar Set',
        'ফ্রেঞ্চ কাট প্রিমিয়াম খিমার সেট',
        'Graceful, flowing French khimar set crafted for modest sisterhood.',
        'মার্জিত ফ্রেঞ্চ কাট খিমার যা চমৎকার শালীনতা ও সৌন্দর্য নিশ্চিত করে।',
        2250.00,
        ARRAY['/images/products/kaftan-khimar-1.jpg'],
        true
    )
    ON CONFLICT (slug) DO UPDATE SET base_price = EXCLUDED.base_price
    RETURNING id INTO v_prod_id;

    INSERT INTO public.product_variants (product_id, sku, color_en, color_bn, color_hex, size, price, stock_quantity)
    VALUES 
        (v_prod_id, 'EXP-KH-004-CHR', 'Charcoal Grey', 'চারকোল ধূসর', '#363833', 'Long Length', 2250.00, 10),
        (v_prod_id, 'EXP-KH-004-OLV', 'Deep Olive', 'গাঢ় জলপাই', '#465137', 'Long Length', 2250.00, 14)
    ON CONFLICT (sku) DO NOTHING;
END $$;
