import { NextResponse } from "next/server";
import pool from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { name, phone, dob, address, blood_group, emergency_contact } = await req.json();

    // Update profile
    await pool.query(
      "UPDATE users SET name = ?, phone = ?, dob = ?, address = ?, blood_group = ?, emergency_contact = ? WHERE id = ?",
      [name, phone, dob, address, blood_group, emergency_contact, userId]
    );

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully"
    });

  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
