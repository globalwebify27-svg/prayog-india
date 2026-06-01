import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email, password, phone } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    // Check if user already exists
    const [existing] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return NextResponse.json({ success: false, message: "Email already registered" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, 'student')",
      [name, email, hashedPassword, phone || null]
    );

    return NextResponse.json({ 
      success: true, 
      message: "User registered successfully",
      userId: result.insertId 
    });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
