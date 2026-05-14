import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

async function verifyAccess(courseId) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return { allowed: false };

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (decoded.role === 'admin') return { allowed: true, role: 'admin' };
  
  if (decoded.role === 'teacher') {
    const [courses] = await pool.query("SELECT id FROM courses WHERE id = ? AND teacher_id = ?", [courseId, decoded.id]);
    return { allowed: courses.length > 0, role: 'teacher', userId: decoded.id };
  }

  return { allowed: false };
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) return NextResponse.json({ success: false, message: "Missing course ID" }, { status: 400 });

    const access = await verifyAccess(id);
    if (!access.allowed) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });

    const [materials] = await pool.query(
      "SELECT * FROM course_materials WHERE course_id = ? ORDER BY module_number, created_at",
      [id]
    );
    return NextResponse.json({ success: true, data: materials });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "Missing course ID" }, { status: 400 });

    const access = await verifyAccess(id);
    if (!access.allowed) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });

    const { title, type, content, module_number, is_locked } = await req.json();

    await pool.query(
      "INSERT INTO course_materials (course_id, title, type, content, module_number, is_locked) VALUES (?, ?, ?, ?, ?, ?)",
      [id, title, type, content, module_number || 1, is_locked ? 1 : 0]
    );

    return NextResponse.json({ success: true, message: "Material added successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const materialId = searchParams.get("id");
    if (!materialId) return NextResponse.json({ success: false, message: "Missing material ID" }, { status: 400 });

    const { title, type, content, module_number, is_locked } = await req.json();

    // Find course_id first to verify access
    const [material] = await pool.query("SELECT course_id FROM course_materials WHERE id = ?", [materialId]);
    if (material.length === 0) return NextResponse.json({ success: false, message: "Material not found" }, { status: 404 });

    const access = await verifyAccess(material[0].course_id);
    if (!access.allowed) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });

    await pool.query(
      "UPDATE course_materials SET title = ?, type = ?, content = ?, module_number = ?, is_locked = ? WHERE id = ?",
      [title, type, content, module_number, is_locked ? 1 : 0, materialId]
    );

    return NextResponse.json({ success: true, message: "Material updated successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const materialId = searchParams.get("id");
    if (!materialId) return NextResponse.json({ success: false, message: "Missing material ID" }, { status: 400 });

    // Find course_id first
    const [material] = await pool.query("SELECT course_id FROM course_materials WHERE id = ?", [materialId]);
    if (material.length === 0) return NextResponse.json({ success: false, message: "Material not found" }, { status: 404 });

    const access = await verifyAccess(material[0].course_id);
    if (!access.allowed) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });

    await pool.query("DELETE FROM course_materials WHERE id = ?", [materialId]);
    return NextResponse.json({ success: true, message: "Material deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
