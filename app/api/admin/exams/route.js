import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req) {
  try {
    const [exams] = await pool.query(
      "SELECT e.*, c.title as course_title FROM exams e LEFT JOIN courses c ON e.course_id = c.id ORDER BY e.created_at DESC"
    );
    return NextResponse.json({ success: true, exams });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { title, description, course_id, duration, total_marks } = await req.json();

    const [result] = await pool.query(
      "INSERT INTO exams (title, description, course_id, duration, total_marks) VALUES (?, ?, ?, ?, ?)",
      [title, description, course_id, duration, total_marks]
    );

    return NextResponse.json({ 
      success: true, 
      id: result.insertId,
      message: "Exam created successfully" 
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
