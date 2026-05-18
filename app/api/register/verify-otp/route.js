import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ success: false, message: "Email and OTP are required" }, { status: 400 });
    }

    // Retrieve the latest unexpired OTP for this email
    const [rows] = await pool.execute(
      "SELECT * FROM otp_verifications WHERE email = ? AND expires_at > CURRENT_TIMESTAMP ORDER BY created_at DESC LIMIT 1",
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Verification code has expired or is invalid." }, { status: 400 });
    }

    const savedOtp = rows[0].otp;

    if (savedOtp === otp) {
      // Delete OTP record upon successful verification to avoid multiple usages
      await pool.execute("DELETE FROM otp_verifications WHERE email = ?", [email]);
      return NextResponse.json({ success: true, message: "Email verified successfully." });
    } else {
      return NextResponse.json({ success: false, message: "Incorrect verification code." }, { status: 400 });
    }
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
