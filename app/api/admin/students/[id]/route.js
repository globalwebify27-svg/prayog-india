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

export async function DELETE(req, { params }) {
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

    // 1. Delete associated records first (Cascading)
    // Note: If your DB has ON DELETE CASCADE, some of these might be redundant, 
    // but explicit deletion ensures integrity across different MySQL setups.
    
    // Get enrollment IDs first
    const [enrollments] = await pool.query("SELECT id FROM enrollments WHERE user_id = ?", [id]);
    const enrollmentIds = enrollments.map(e => e.id);

    if (enrollmentIds.length > 0) {
      // Delete installments
      await pool.query("DELETE FROM installments WHERE enrollment_id IN (?)", [enrollmentIds]);
    }

    // Delete attendance
    await pool.query("DELETE FROM attendance WHERE user_id = ?", [id]);
    
    // Delete certificates
    await pool.query("DELETE FROM certificates WHERE user_id = ?", [id]);

    // Delete enrollments
    await pool.query("DELETE FROM enrollments WHERE user_id = ?", [id]);

    // Finally, delete the user
    await pool.query("DELETE FROM users WHERE id = ?", [id]);

    return NextResponse.json({
      success: true,
      message: "Student and all associated records deleted successfully"
    });

  } catch (error) {
    console.error("Admin student deletion error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
