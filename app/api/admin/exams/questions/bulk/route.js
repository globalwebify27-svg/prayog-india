import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req) {
  try {
    const { searchParams } = new URL(req.url);
    const exam_id = searchParams.get("exam_id");
    const { questions } = await req.json();

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid question list" }, { status: 400 });
    }

    // Insert questions in bulk
    const values = questions.map(q => [
      exam_id,
      q.question_text,
      q.type || 'objective',
      JSON.stringify(q.options || []),
      q.correct_answer || '',
      q.marks || 1,
      q.order_num || 0
    ]);

    await pool.query(
      "INSERT INTO exam_questions (exam_id, question_text, type, options, correct_answer, marks, order_num) VALUES ?",
      [values]
    );

    // Sync total_marks in exams table
    await pool.query(
      "UPDATE exams SET total_marks = (SELECT SUM(marks) FROM exam_questions WHERE exam_id = ?) WHERE id = ?",
      [exam_id, exam_id]
    );

    return NextResponse.json({ success: true, message: `${questions.length} questions added successfully` });
  } catch (error) {
    console.error("Bulk Upload Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
