import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import crypto from "crypto";

function sha256(str: string): string {
  return crypto.createHash("sha256").update(str).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const { passcode } = await req.json();

    if (!passcode || typeof passcode !== "string") {
      return NextResponse.json({ success: false, message: "Passcode required" }, { status: 400 });
    }

    const trimmed = passcode.trim();
    const enteredHash = sha256(trimmed);

    // 1. Check if custom passcode hash is stored in Supabase
    const supabase = await createAdminClient();
    const { data: securityRow } = await supabase
      .from("delivery_settings")
      .select("estimated_delivery_en")
      .eq("zone_code", "admin_pass_hash")
      .maybeSingle();

    const storedHash = securityRow?.estimated_delivery_en;

    if (storedHash && storedHash !== "DEFAULT") {
      // Custom passcode is active! ONLY the new passcode works. Old passcode is permanently disconnected.
      if (enteredHash === storedHash) {
        return NextResponse.json({ success: true, customActive: true });
      }
      return NextResponse.json({ success: false, message: "Incorrect passcode. Access denied." }, { status: 401 });
    }

    // 2. Check Vercel ADMIN_PASSCODE environment variable if configured
    const envPasscode = process.env.ADMIN_PASSCODE;
    if (envPasscode && envPasscode.trim().length > 0) {
      if (trimmed === envPasscode.trim()) {
        return NextResponse.json({ success: true, customActive: true });
      }
      return NextResponse.json({ success: false, message: "Incorrect passcode. Access denied." }, { status: 401 });
    }

    // 3. Fallback to initial passcode only if no custom passcode has ever been set
    if (trimmed === "ExplodeBD#2026" || trimmed === "explode2026@") {
      return NextResponse.json({ success: true, customActive: false });
    }

    return NextResponse.json({ success: false, message: "Incorrect passcode. Access denied." }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message || "Server error" }, { status: 500 });
  }
}
