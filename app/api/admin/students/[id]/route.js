import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const { name, email, phone, dob, address, blood_group, emergency_contact } = await req.json();

    await pool.query(
      "UPDATE users SET name = ?, email = ?, phone = ?, dob = ?, address = ?, blood_group = ?, emergency_contact = ? WHERE id = ?",
      [name, email, phone, dob, address, blood_group, emergency_contact, id]
    );

    return NextResponse.json({
      success: true,
      message: "Student details updated successfully"
    });

  } catch (error) {
    console.error("Admin student update error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
