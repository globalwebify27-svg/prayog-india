import { NextResponse } from "next/server";
import pool from "@/lib/db";
import crypto from "crypto";
import { sendMail, getPasswordResetEmailTemplate } from "@/lib/mailer";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    }

    const [users] = await pool.query("SELECT id, name FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      // For security, don't reveal if user exists or not
      return NextResponse.json({ 
        success: true, 
        message: "If an account exists with this email, a reset link has been sent." 
      });
    }

    const user = users[0];
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 3600000); // 1 hour

    await pool.query(
      "UPDATE users SET reset_token = ?, reset_expiry = ? WHERE id = ?",
      [token, expiry, user.id]
    );

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://prayogindiarobotics.com";
    const resetLink = `${baseUrl}/reset-password?token=${token}`;

    await sendMail(
      email,
      "Password Reset Request - Prayog India",
      getPasswordResetEmailTemplate(user.name, resetLink)
    );

    return NextResponse.json({ 
      success: true, 
      message: "If an account exists with this email, a reset link has been sent." 
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
