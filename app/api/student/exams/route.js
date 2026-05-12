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

    // Fetch exams for courses the student is enrolled in
    // Also check if they've already submitted
    const [exams] = await pool.query(`
      SELECT e.*, c.title as course_title, 
             (SELECT COUNT(*) FROM exam_submissions s WHERE s.exam_id = e.id AND s.user_id = ?) as has_submitted
      FROM exams e 
      JOIN courses c ON e.course_id = c.id
      JOIN enrollments en ON c.id = en.course_id
      WHERE en.user_id = ? 
      AND (e.start_time IS NULL OR e.start_time <= NOW())
      AND (e.end_time IS NULL OR e.end_time >= NOW())
      ORDER BY e.start_time ASC
    `, [userId, userId]);

    return NextResponse.json({ success: true, exams });
  } catch (error) {
    console.error("Student Exams Fetch Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
