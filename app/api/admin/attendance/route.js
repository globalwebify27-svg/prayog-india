import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date"); // Expected format: YYYY-MM-DD

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    let userId = null;
    let userRole = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
        userRole = decoded.role;
      } catch (e) {}
    }

    let query = `
      SELECT a.*, u.name as student_name, c.title as course_name, b.name as batch_name, a.type as mode
      FROM attendance a 
      JOIN users u ON a.user_id = u.id 
      LEFT JOIN courses c ON a.course_id = c.id
      LEFT JOIN batches b ON a.batch_id = b.id
    `;
    let params = [];

    if (userRole === 'teacher') {
      // Filter attendance records where the course's teacher is the current user
      query += " WHERE c.teacher_id = ?";
      params.push(userId);
      
      if (dateParam) {
        query += " AND DATE(a.recorded_at) = ?";
        params.push(dateParam);
      }
    } else {
      if (dateParam) {
        query += " WHERE DATE(a.recorded_at) = ?";
        params.push(dateParam);
      }
    }

    query += " ORDER BY a.recorded_at DESC";

    const [logs] = await pool.query(query, params);
    
    return NextResponse.json({
      success: true,
      logs
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
