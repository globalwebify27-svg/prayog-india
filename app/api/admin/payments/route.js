import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const query = `
      SELECT i.*, u.name as student_name, e.course_id, c.title as course_name
      FROM installments i
      JOIN enrollments e ON i.enrollment_id = e.id
      JOIN users u ON e.user_id = u.id
      JOIN courses c ON e.course_id = c.id
      ORDER BY i.due_date DESC
    `;


    const [rows] = await pool.query(query);

    return NextResponse.json({
      success: true,
      installments: rows
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
