import { NextResponse } from "next/server";
import pool from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    }

    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    
    return NextResponse.json({
      success: true,
      exists: existing.length > 0
    });
  } catch (error) {
    console.error("Check Email Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
