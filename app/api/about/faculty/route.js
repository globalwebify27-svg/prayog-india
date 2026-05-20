import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// GET is public to load guest faculty on the About page
export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM about_faculty ORDER BY sort_order ASC, id ASC");
    return NextResponse.json({ success: true, faculty: rows });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// Helper to check admin role
async function checkAdminAuth() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return false;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.role === 'admin';
  } catch (e) {
    return false;
  }
}

export async function POST(req) {
  try {
    if (!(await checkAdminAuth())) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const { name, role, desc_text, initial, img_url, sort_order } = await req.json();

    const [result] = await pool.query(
      `INSERT INTO about_faculty (name, role, desc_text, initial, img_url, sort_order) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, role, desc_text, initial || "", img_url || "", sort_order || 0]
    );

    return NextResponse.json({ success: true, id: result.insertId, message: "Guest faculty added successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    if (!(await checkAdminAuth())) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const { id, name, role, desc_text, initial, img_url, sort_order } = await req.json();

    await pool.query(
      `UPDATE about_faculty SET 
         name = ?, role = ?, desc_text = ?, initial = ?, img_url = ?, sort_order = ? 
       WHERE id = ?`,
      [name, role, desc_text, initial || "", img_url || "", sort_order || 0, id]
    );

    return NextResponse.json({ success: true, message: "Guest faculty updated successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    if (!(await checkAdminAuth())) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
    }

    await pool.query("DELETE FROM about_faculty WHERE id = ?", [id]);

    return NextResponse.json({ success: true, message: "Guest faculty deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
