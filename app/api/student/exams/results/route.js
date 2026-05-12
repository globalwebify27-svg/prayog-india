import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Unauthenticated" }, { status: 401 });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Fetch graded submissions for the student
    const [results] = await pool.query(`
      SELECT s.*, e.title as exam_title, e.total_marks as exam_total_marks, c.title as course_title
      FROM exam_submissions s
      JOIN exams e ON s.exam_id = e.id
      JOIN courses c ON e.course_id = c.id
      WHERE s.user_id = ? AND s.status = 'graded'
      ORDER BY s.submitted_at DESC
    `, [userId]);

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Student Results Fetch Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
