import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
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

    // Auto-cleanup: Delete batches that ended more than 3 days ago
    await pool.query("DELETE FROM batches WHERE end_date IS NOT NULL AND end_date < DATE_SUB(CURDATE(), INTERVAL 3 DAY)");

    let query = `
      SELECT b.*, c.title as course_name, t.name as timing_name, t.slot as timing_slot,
      (SELECT COUNT(*) FROM enrollments WHERE batch_id = b.id) as enrollment_count
      FROM batches b 
      JOIN courses c ON b.course_id = c.id
      LEFT JOIN timings t ON b.timing_id = t.id
    `;
    let params = [];

    if (userRole === 'teacher') {
      query += " WHERE c.teacher_id = ?";
      params.push(userId);
    }

    query += " ORDER BY b.created_at DESC";

    const [batches] = await pool.query(query, params);
    return NextResponse.json({ success: true, batches });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { id, name, course_id, schedule, meeting_link, start_date, end_date, timing_id } = await req.json();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role === 'teacher') {
      const [check] = await pool.query(`
        SELECT b.id 
        FROM batches b 
        JOIN courses c ON b.course_id = c.id 
        WHERE b.id = ? AND c.teacher_id = ?
      `, [id, decoded.id]);
      
      if (check.length === 0) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    if (name) {
      await pool.query(
        "UPDATE batches SET name = ?, course_id = ?, timing_id = ?, schedule = ?, meeting_link = ?, start_date = ?, end_date = ? WHERE id = ?",
        [name, course_id, timing_id || null, schedule, meeting_link, start_date, end_date, id]
      );
    } else {
      await pool.query("UPDATE batches SET meeting_link = ? WHERE id = ?", [meeting_link, id]);
    }

    return NextResponse.json({ success: true, message: "Batch updated successfully" });
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

    if (decoded.role === 'teacher') {
      const [check] = await pool.query(`
        SELECT b.id 
        FROM batches b 
        JOIN courses c ON b.course_id = c.id 
        WHERE b.id = ? AND c.teacher_id = ?
      `, [id, decoded.id]);
      
      if (check.length === 0) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    // Unlink any enrollments from this batch first to avoid FK constraint issues
    await pool.query("UPDATE enrollments SET batch_id = NULL WHERE batch_id = ?", [id]);

    await pool.query("DELETE FROM batches WHERE id = ?", [id]);
    return NextResponse.json({ success: true, message: "Batch deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { name, course_id, schedule, type, meeting_link, start_date, end_date, timing_id } = await req.json();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role === 'teacher') {
      const [course] = await pool.query("SELECT id FROM courses WHERE id = ? AND teacher_id = ?", [course_id, decoded.id]);
      if (course.length === 0) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const [result] = await pool.query(
      "INSERT INTO batches (name, course_id, timing_id, schedule, type, meeting_link, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [name, course_id, timing_id || null, schedule, type || 'online', meeting_link || '', start_date || null, end_date || null]
    );

    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
