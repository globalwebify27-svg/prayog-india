import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { sendMail, getOTPEmailTemplate } from "@/lib/mailer";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    }

    // Check if user already exists
    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return NextResponse.json({ success: false, message: "Email already registered" }, { status: 400 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Save/Update OTP in database
    // Clean up previous OTPs for this email first
    await pool.execute("DELETE FROM otp_verifications WHERE email = ?", [email]);
    await pool.execute(
      "INSERT INTO otp_verifications (email, otp, expires_at) VALUES (?, ?, ?)",
      [email, otp, expiresAt]
    );

    // Send email with dynamic template
    const [logoRows] = await pool.query("SELECT setting_value FROM site_settings WHERE setting_key = 'logo_url'");
    const envBase = process.env.NEXT_PUBLIC_BASE_URL || 'https://prayogindiarobotics.com';
    const emailBaseUrl = (envBase.includes('localhost') || envBase.includes('127.0.0.1'))
      ? 'https://prayogindiarobotics.com'
      : envBase;
    const logoUrl = logoRows[0]?.setting_value
      ? `${emailBaseUrl}${logoRows[0].setting_value}`
      : `${emailBaseUrl}/assets/logo.png`;
    const emailHtml = getOTPEmailTemplate(otp, "10 minutes", logoUrl);
    
    // Send email in the background so the user doesn't wait and timeout
    sendMail(email, "Verify Your Email - Prayog India", emailHtml).then((mailResult) => {
      if (!mailResult.success) {
        console.error("Background Mail send failed for:", email, mailResult.error);
      } else {
        console.log("Background Mail sent successfully to:", email);
      }
    });

    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
