import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const exam_id = searchParams.get("exam_id");

    if (!exam_id) {
      return NextResponse.json({ success: false, message: "Exam ID is required" }, { status: 400 });
    }

    const [questions] = await pool.query(
      "SELECT * FROM exam_questions WHERE exam_id = ? ORDER BY order_num ASC",
      [parseInt(exam_id)]
    );
    return NextResponse.json({ success: true, data: questions });
  } catch (error) {
    console.error("GET Questions Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { searchParams } = new URL(req.url);
    const exam_id = searchParams.get("exam_id");
    
    if (!exam_id) {
      return NextResponse.json({ success: false, message: "Exam ID is required" }, { status: 400 });
    }

    const { question_text, type, options, correct_answer, marks, order_num } = await req.json();

    if (!question_text || !type) {
      return NextResponse.json({ success: false, message: "Question text and type are required" }, { status: 400 });
    }

    const [result] = await pool.query(
      "INSERT INTO exam_questions (exam_id, question_text, type, options, correct_answer, marks, order_num) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        parseInt(exam_id), 
        question_text, 
        type, 
        options ? JSON.stringify(options) : "[]", 
        correct_answer || "", 
        parseInt(marks) || 0, 
        parseInt(order_num) || 0
      ]
    );

    // Sync total_marks in exams table
    await pool.query(
      "UPDATE exams SET total_marks = (SELECT SUM(marks) FROM exam_questions WHERE exam_id = ?) WHERE id = ?",
      [exam_id, exam_id]
    );

    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error("POST Question Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const exam_id = searchParams.get("exam_id");
    
    if (!id) {
      return NextResponse.json({ success: false, message: "Question ID is required" }, { status: 400 });
    }

    await pool.query("DELETE FROM exam_questions WHERE id = ?", [parseInt(id)]);

    // Sync total_marks in exams table if exam_id is provided
    if (exam_id) {
      await pool.query(
        "UPDATE exams SET total_marks = (SELECT SUM(marks) FROM exam_questions WHERE exam_id = ?) WHERE id = ?",
        [exam_id, exam_id]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Question Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
