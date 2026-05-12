import { NextResponse } from "next/server";
import pool from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { exam_id, answers } = await req.json();

    if (!exam_id || !answers) {
      return NextResponse.json({ success: false, message: "Missing exam ID or answers" }, { status: 400 });
    }

    // Insert submission
    const [result] = await pool.query(
      "INSERT INTO exam_submissions (exam_id, user_id, answers, status) VALUES (?, ?, ?, 'pending')",
      [exam_id, userId, JSON.stringify(answers)]
    );

    return NextResponse.json({ 
      success: true, 
      message: "Exam submitted successfully", 
      submission_id: result.insertId 
    });

  } catch (error) {
    console.error("Exam submission error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
