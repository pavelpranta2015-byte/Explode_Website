import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { passcode } = await req.json();

    if (!passcode || typeof passcode !== "string") {
      return NextResponse.json({ success: false, message: "Passcode required" }, { status: 400 });
    }

    const trimmed = passcode.trim();
    const envPasscode = process.env.ADMIN_PASSCODE;

    // 1. If owner set ADMIN_PASSCODE in Vercel / .env.local, use that
    if (envPasscode && envPasscode.trim().length > 0) {
      if (trimmed === envPasscode.trim()) {
        return NextResponse.json({ success: true, customSet: true });
      }
      return NextResponse.json({ success: false, message: "Invalid passcode" }, { status: 401 });
    }

    // 2. Default fallback if not yet configured in environment
    if (trimmed === "ExplodeBD#2026" || trimmed === "explode2026@") {
      return NextResponse.json({ success: true, customSet: false });
    }

    return NextResponse.json({ success: false, message: "Invalid passcode" }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err?.message || "Server error" }, { status: 500 });
  }
}
