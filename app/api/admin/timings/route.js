import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const [timings] = await pool.query(`
      SELECT t.*, (SELECT COUNT(*) FROM course_timings ct WHERE ct.timing_id = t.id) as course_count 
      FROM timings t 
      ORDER BY t.created_at DESC
    `);
    return NextResponse.json({ success: true, timings });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return NextResponse.json({ success: false, message: "Only admins can update timings" }, { status: 403 });
    }

    const { id, name, slot } = await req.json();
    await pool.query(
      "UPDATE timings SET name = ?, slot = ? WHERE id = ?",
      [name, slot, id]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return NextResponse.json({ success: false, message: "Only admins can delete timings" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await pool.query("DELETE FROM timings WHERE id = ?", [id]);
    return NextResponse.json({ success: true, message: "Timing deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
