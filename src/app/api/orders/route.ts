import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

// Helper to normalize phone numbers
function normalizePhone(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, "");
  if (cleaned.startsWith("880")) {
    cleaned = cleaned.slice(2);
  }
  if (!cleaned.startsWith("0")) {
    cleaned = "0" + cleaned;
  }
  return cleaned;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      phone,
      altPhone,
      deliveryZone,
      deliveryAddress,
      paymentMethod = "cod",
      claimedTrxId,
      paymentNumber,
      subtotal,
      shippingFee,
      discountAmount = 0,
      totalAmount,
      items,
      deliveryNotes,
    } = body;

    if (!customerName || !phone || !items || !items.length) {
      return NextResponse.json(
        { success: false, message: "Missing required order fields" },
        { status: 400 }
      );
    }

    const cleanPhone = normalizePhone(phone);
    const cleanAltPhone = altPhone ? normalizePhone(altPhone) : null;
    const zoneCode =
      deliveryZone === "inside"
        ? "inside_dhaka"
        : deliveryZone === "suburbs"
        ? "dhaka_suburbs"
        : "outside_dhaka";

    const supabase = await createAdminClient();

    // 1. Find or create canonical customer
    let customerId: string | null = null;
    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("id")
      .eq("canonical_phone", cleanPhone)
      .maybeSingle();

    if (existingCustomer) {
      customerId = existingCustomer.id;
      // Update name/altPhone if changed
      await supabase
        .from("customers")
        .update({
          full_name: customerName.trim(),
          alt_phone: cleanAltPhone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", customerId);
    } else {
      const { data: newCustomer, error: custError } = await supabase
        .from("customers")
        .insert({
          canonical_phone: cleanPhone,
          full_name: customerName.trim(),
          alt_phone: cleanAltPhone,
        })
        .select("id")
        .single();

      if (custError) {
        console.error("Customer creation error:", custError);
      } else {
        customerId = newCustomer?.id;
      }
    }

    if (!customerId) {
      throw new Error("Could not register or find customer profile");
    }

    // 2. Generate unique order number (e.g. EX-829301)
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `EX-${randomSuffix}`;

    // 3. Insert order
    const addressPayload = {
      full_name: customerName.trim(),
      phone: cleanPhone,
      alt_phone: cleanAltPhone,
      district: deliveryAddress?.district || "",
      city_area: deliveryAddress?.cityArea || "",
      address: deliveryAddress?.fullAddress || "",
      delivery_instructions: deliveryNotes || "",
    };

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_id: customerId,
        status: "pending",
        payment_status: paymentMethod === "cod" ? "unpaid" : claimedTrxId ? "paid" : "unpaid",
        payment_method: paymentMethod,
        delivery_zone: zoneCode,
        delivery_address: addressPayload,
        subtotal: Number(subtotal) || 0,
        shipping_fee: Number(shippingFee) || 0,
        discount_amount: Number(discountAmount) || 0,
        total_amount: Number(totalAmount) || 0,
        admin_notes: claimedTrxId ? `TrxID: ${claimedTrxId} | Payer: ${paymentNumber || ""}` : null,
      })
      .select("id, order_number, total_amount, created_at")
      .single();

    if (orderError || !order) {
      console.error("Order insertion error:", orderError);
      throw new Error(orderError?.message || "Failed to create order record");
    }

    // 4. Insert order items snapshot
    const orderItemsPayload = items.map((i: any) => ({
      order_id: order.id,
      variant_id: i.variantId || null,
      snapshot_title: i.title || "Product",
      snapshot_color: i.color || null,
      snapshot_size: i.size || null,
      snapshot_image: i.image || null,
      unit_price: Number(i.unitPrice || i.price) || 0,
      quantity: Number(i.quantity) || 1,
      total_price: (Number(i.unitPrice || i.price) || 0) * (Number(i.quantity) || 1),
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsPayload);

    if (itemsError) {
      console.error("Order items error:", itemsError);
    }

    // 5. If manual digital payment, record payment entry
    if (paymentMethod !== "cod" && (claimedTrxId || paymentNumber)) {
      await supabase.from("payments").insert({
        order_id: order.id,
        amount: Number(totalAmount) || 0,
        payment_method: paymentMethod,
        transaction_id: claimedTrxId || null,
        payer_account: paymentNumber || null,
        status: "submitted",
      });
    }

    return NextResponse.json({
      success: true,
      orderNumber: order.order_number,
      totalAmount: order.total_amount,
    });
  } catch (err: any) {
    console.error("Order API error:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Order placement failed" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createAdminClient();

    const { data: orders, error } = await supabase
      .from("orders")
      .select(`
        id,
        order_number,
        status,
        payment_status,
        payment_method,
        delivery_zone,
        delivery_address,
        subtotal,
        shipping_fee,
        discount_amount,
        total_amount,
        admin_notes,
        created_at,
        customer:customers (
          id,
          full_name,
          canonical_phone,
          alt_phone
        ),
        items:order_items (
          id,
          snapshot_title,
          snapshot_color,
          snapshot_size,
          snapshot_image,
          unit_price,
          quantity,
          total_price
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch orders error:", error);
      return NextResponse.json({ success: false, orders: [] }, { status: 500 });
    }

    return NextResponse.json({ success: true, orders: orders || [] });
  } catch (err: any) {
    console.error("Orders GET error:", err);
    return NextResponse.json({ success: false, orders: [] }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, status, paymentStatus, adminNotes } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, message: "orderId required" }, { status: 400 });
    }

    const supabase = await createAdminClient();

    const updates: any = {
      updated_at: new Date().toISOString(),
    };
    if (status) updates.status = status;
    if (paymentStatus) updates.payment_status = paymentStatus;
    if (adminNotes !== undefined) updates.admin_notes = adminNotes;

    const { data, error } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", orderId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, order: data });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message || "Update failed" }, { status: 500 });
  }
}
