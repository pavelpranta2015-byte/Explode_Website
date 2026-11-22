import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import crypto from "crypto";

function sha256(str: string): string {
  return crypto.createHash("sha256").update(str).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const { currentPasscode, newPasscode } = await req.json();

    if (!newPasscode || newPasscode.trim().length < 6) {
      return NextResponse.json(
        { success: false, message: "New passcode must be at least 6 characters" },
        { status: 400 }
      );
    }

    const supabase = await createAdminClient();

    // Verify current passcode
    const { data: securityRow } = await supabase
      .from("delivery_settings")
      .select("estimated_delivery_en")
      .eq("zone_code", "admin_pass_hash")
      .maybeSingle();

    const storedHash = securityRow?.estimated_delivery_en;
    const currentHash = sha256(currentPasscode ? currentPasscode.trim() : "");

    if (storedHash && storedHash !== "DEFAULT") {
      if (currentHash !== storedHash) {
        return NextResponse.json(
          { success: false, message: "Current passcode is incorrect" },
          { status: 401 }
        );
      }
    } else {
      const envPass = process.env.ADMIN_PASSCODE;
      const valid = envPass
        ? currentPasscode?.trim() === envPass.trim()
        : currentPasscode?.trim() === "ExplodeBD#2026" || currentPasscode?.trim() === "explode2026@";

      if (!valid) {
        return NextResponse.json(
          { success: false, message: "Current passcode is incorrect" },
          { status: 401 }
        );
      }
    }

    // Hash and store the new passcode in Supabase
    const newHash = sha256(newPasscode.trim());

    const { error: upsertErr } = await supabase
      .from("delivery_settings")
      .upsert(
        {
          zone_code: "admin_pass_hash",
          name_en: "Security",
          name_bn: "নিরাপত্তা",
          delivery_fee: 0,
          estimated_delivery_en: newHash,
          estimated_delivery_bn: "ACTIVE",
          is_active: false,
        },
        { onConflict: "zone_code" }
      );

    if (upsertErr) {
      console.error("Database update error:", upsertErr);
      return NextResponse.json(
        { success: false, message: "Failed to update passcode in database" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Passcode updated successfully in database! Old passcode is now deactivated.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || "Failed to update passcode" },
      { status: 500 }
    );
  }
}
