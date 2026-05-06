import { NextResponse } from "next/server";
import pool from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // 1. Get User Info
    const [user] = await pool.query("SELECT name, email, role FROM users WHERE id = ?", [userId]);
    
    // 2. Get Enrollments
    const [enrollments] = await pool.query(`
      SELECT e.*, c.title, c.duration, c.type as mode 
      FROM enrollments e 
      JOIN courses c ON e.course_id = c.id 
      WHERE e.user_id = ?
    `, [userId]);

    // 3. Get Installments
    const [installments] = await pool.query(`
      SELECT i.* 
      FROM installments i 
      JOIN enrollments e ON i.enrollment_id = e.id 
      WHERE e.user_id = ?
    `, [userId]);

    // 4. Get Attendance Stats
    const [attendance] = await pool.query("SELECT COUNT(*) as count FROM attendance WHERE user_id = ? AND status = 'present'", [userId]);

    return NextResponse.json({
      success: true,
      data: {
        user: user[0],
        enrollments,
        installments,
        attendanceCount: attendance[0].count
      }
    });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
