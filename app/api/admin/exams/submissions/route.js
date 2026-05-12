import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const exam_id = searchParams.get("exam_id");

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Unauthenticated" }, { status: 401 });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin' && decoded.role !== 'teacher') {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const [submissions] = await pool.query(`
      SELECT s.*, u.name as student_name, u.email as student_email 
      FROM exam_submissions s 
      JOIN users u ON s.user_id = u.id 
      WHERE s.exam_id = ?
      ORDER BY s.submitted_at DESC
    `, [exam_id]);

    return NextResponse.json({ success: true, data: submissions });
  } catch (error) {
    console.error("Fetch submissions error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { id, score, status } = await req.json();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'admin' && decoded.role !== 'teacher') {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    await pool.query(
      "UPDATE exam_submissions SET score = ?, status = ? WHERE id = ?",
      [score, status || 'graded', id]
    );

    return NextResponse.json({ success: true, message: "Submission graded successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
