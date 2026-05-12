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

    // Updated query to calculate total marks dynamically from the questions table
    // This avoids discrepancies if the exam's total_marks field is out of sync
    let query = `
      SELECT 
        s.*, 
        u.name as student_name, 
        u.email as student_email, 
        e.title as exam_title,
        COALESCE((SELECT SUM(marks) FROM exam_questions WHERE exam_id = s.exam_id), e.total_marks) as exam_total_marks
      FROM exam_submissions s 
      JOIN users u ON s.user_id = u.id 
      JOIN exams e ON s.exam_id = e.id
    `;
    let params = [];

    if (exam_id) {
      query += " WHERE s.exam_id = ?";
      params.push(exam_id);
    }

    query += " ORDER BY s.submitted_at DESC";

    const [submissions] = await pool.query(query, params);

    return NextResponse.json({ success: true, data: submissions });
  } catch (error) {
    console.error("Fetch submissions error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { id, score, status, answers } = await req.json();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'admin' && decoded.role !== 'teacher') {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    if (answers) {
      await pool.query(
        "UPDATE exam_submissions SET score = ?, status = ?, answers = ? WHERE id = ?",
        [score, status || 'graded', answers, id]
      );
    } else {
      await pool.query(
        "UPDATE exam_submissions SET score = ?, status = ? WHERE id = ?",
        [score, status || 'graded', id]
      );
    }

    return NextResponse.json({ success: true, message: "Submission graded successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'admin' && decoded.role !== 'teacher') {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    await pool.query("DELETE FROM exam_submissions WHERE id = ?", [id]);

    return NextResponse.json({ success: true, message: "Submission deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
