import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ success: false, message: "Token and password are required" }, { status: 400 });
    }

    const [users] = await pool.query(
      "SELECT id FROM users WHERE reset_token = ? AND reset_expiry > NOW()",
      [token]
    );

    if (users.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 400 });
    }

    const user = users[0];
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "UPDATE users SET password = ?, reset_token = NULL, reset_expiry = NULL WHERE id = ?",
      [hashedPassword, user.id]
    );

    return NextResponse.json({ success: true, message: "Password has been reset successfully. You can now login." });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
