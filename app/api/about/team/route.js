import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// GET is public to load the team on the About page
export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM about_team ORDER BY sort_order ASC, id ASC");
    const team = rows.map(m => ({
      ...m,
      specialties: typeof m.specialties === 'string' ? JSON.parse(m.specialties) : (m.specialties || [])
    }));
    return NextResponse.json({ success: true, team });
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

    const { name, role, initial, img, bio, color, specialties, focus, sort_order } = await req.json();

    const [result] = await pool.query(
      `INSERT INTO about_team (name, role, initial, img, bio, color, specialties, focus, sort_order) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, role, initial || "", img, bio, color || "#01254d", JSON.stringify(specialties || []), focus, sort_order || 0]
    );

    return NextResponse.json({ success: true, id: result.insertId, message: "Team member added successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    if (!(await checkAdminAuth())) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const { id, name, role, initial, img, bio, color, specialties, focus, sort_order } = await req.json();

    await pool.query(
      `UPDATE about_team SET 
         name = ?, role = ?, initial = ?, img = ?, bio = ?, color = ?, specialties = ?, focus = ?, sort_order = ? 
       WHERE id = ?`,
      [name, role, initial || "", img, bio, color || "#01254d", JSON.stringify(specialties || []), focus, sort_order || 0, id]
    );

    return NextResponse.json({ success: true, message: "Team member updated successfully" });
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

    await pool.query("DELETE FROM about_team WHERE id = ?", [id]);

    return NextResponse.json({ success: true, message: "Team member deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
