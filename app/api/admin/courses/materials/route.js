import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ success: false, message: "Missing course ID" }, { status: 400 });
    }

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
    
    if (!id) {
      return NextResponse.json({ success: false, message: "Missing course ID" }, { status: 400 });
    }

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

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const materialId = searchParams.get("id");

    if (!materialId) {
      return NextResponse.json({ success: false, message: "Missing material ID" }, { status: 400 });
    }

    await pool.query("DELETE FROM course_materials WHERE id = ?", [materialId]);

    return NextResponse.json({ success: true, message: "Material deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
