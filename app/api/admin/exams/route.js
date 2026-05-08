import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
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

    let query = "SELECT e.*, c.title as course_title FROM exams e LEFT JOIN courses c ON e.course_id = c.id";
    let params = [];

    if (userRole === 'teacher') {
      query += " WHERE c.teacher_id = ?";
      params.push(userId);
    }

    query += " ORDER BY e.created_at DESC";

    const [exams] = await pool.query(query, params);
    return NextResponse.json({ success: true, exams });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { title, description, course_id, duration, total_marks, type, start_time, end_time } = await req.json();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Unauthenticated" }, { status: 401 });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role === 'teacher') {
      const [course] = await pool.query("SELECT id FROM courses WHERE id = ? AND teacher_id = ?", [course_id, decoded.id]);
      if (course.length === 0) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const [result] = await pool.query(
      "INSERT INTO exams (title, description, course_id, duration, total_marks, type, start_time, end_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [title, description, course_id, duration, total_marks, type || 'objective', start_time || null, end_time || null]
    );

    return NextResponse.json({ 
      success: true, 
      id: result.insertId,
      message: "Exam created successfully" 
    });
  } catch (error) {
    console.error("Exam Create Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { id, title, description, course_id, duration, total_marks, type, start_time, end_time } = await req.json();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Unauthenticated" }, { status: 401 });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role === 'teacher') {
      const [exam] = await pool.query(
        "SELECT e.id FROM exams e JOIN courses c ON e.course_id = c.id WHERE e.id = ? AND c.teacher_id = ?",
        [id, decoded.id]
      );
      if (exam.length === 0) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    await pool.query(
      "UPDATE exams SET title = ?, description = ?, course_id = ?, duration = ?, total_marks = ?, type = ?, start_time = ?, end_time = ? WHERE id = ?",
      [title, description, course_id, duration, total_marks, type, start_time, end_time, id]
    );

    return NextResponse.json({ success: true, message: "Exam updated successfully" });
  } catch (error) {
    console.error("Exam Update Error:", error);
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

    if (decoded.role === 'teacher') {
      const [exam] = await pool.query(
        "SELECT e.id FROM exams e JOIN courses c ON e.course_id = c.id WHERE e.id = ? AND c.teacher_id = ?",
        [id, decoded.id]
      );
      if (exam.length === 0) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    await pool.query("DELETE FROM exams WHERE id = ?", [id]);
    return NextResponse.json({ success: true, message: "Exam deleted successfully" });
  } catch (error) {
    console.error("Exam Delete Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
