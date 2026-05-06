import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [logs] = await pool.query(`
      SELECT a.*, u.name as student_name, c.title as course_name, b.name as batch_name, a.type as mode
      FROM attendance a 
      JOIN users u ON a.user_id = u.id 
      LEFT JOIN courses c ON a.course_id = c.id
      LEFT JOIN batches b ON a.batch_id = b.id
      ORDER BY a.recorded_at DESC
    `);
    
    return NextResponse.json({
      success: true,
      logs
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
