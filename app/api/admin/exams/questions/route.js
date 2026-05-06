import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const exam_id = searchParams.get("exam_id");

    const [questions] = await pool.query(
      "SELECT * FROM exam_questions WHERE exam_id = ? ORDER BY order_num ASC",
      [exam_id]
    );
    return NextResponse.json({ success: true, data: questions });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { searchParams } = new URL(req.url);
    const exam_id = searchParams.get("exam_id");
    const { question_text, type, options, correct_answer, marks, order_num } = await req.json();

    const [result] = await pool.query(
      "INSERT INTO exam_questions (exam_id, question_text, type, options, correct_answer, marks, order_num) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [exam_id, question_text, type, JSON.stringify(options), correct_answer, marks, order_num || 0]
    );

    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await pool.query("DELETE FROM exam_questions WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
