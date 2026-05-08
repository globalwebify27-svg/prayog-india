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

    let query = `
      SELECT c.*, u.name as teacher_name 
      FROM courses c 
      LEFT JOIN users u ON c.teacher_id = u.id
    `;
    let params = [];

    if (userRole === 'teacher') {
      query += " WHERE c.teacher_id = ?";
      params.push(userId);
    }

    query += " ORDER BY c.created_at DESC";

    const [courses] = await pool.query(query, params);
    
    // Fetch timings for each course
    const [courseTimings] = await pool.query(`
      SELECT ct.course_id, t.name, t.slot, t.id
      FROM course_timings ct
      JOIN timings t ON ct.timing_id = t.id
    `);

    const coursesWithTimings = courses.map(course => ({
      ...course,
      timings: courseTimings.filter(ct => ct.course_id === course.id)
    }));
    
    return NextResponse.json({
      success: true,
      courses: coursesWithTimings
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return NextResponse.json({ success: false, message: "Only admins can create courses" }, { status: 403 });
    }

    const { title, description, price, type, duration, image, teacher_id, selectedTimings } = await req.json();

    const [result] = await pool.query(
      "INSERT INTO courses (title, description, price, type, duration, image, teacher_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [title, description, price, type, duration, image, teacher_id || null]
    );

    const courseId = result.insertId;

    if (selectedTimings && selectedTimings.length > 0) {
      const values = selectedTimings.map(timingId => [courseId, timingId]);
      await pool.query("INSERT INTO course_timings (course_id, timing_id) VALUES ?", [values]);
    }

    return NextResponse.json({ 
      success: true, 
      message: "Course created",
      courseId: result.insertId 
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return NextResponse.json({ success: false, message: "Only admins can edit courses" }, { status: 403 });
    }

    const { id, title, description, price, type, duration, image, teacher_id, selectedTimings } = await req.json();

    await pool.query(
      "UPDATE courses SET title = ?, description = ?, price = ?, type = ?, duration = ?, image = ?, teacher_id = ? WHERE id = ?",
      [title, description, price, type, duration, image, teacher_id || null, id]
    );

    // Update timings: Delete old and insert new
    await pool.query("DELETE FROM course_timings WHERE course_id = ?", [id]);
    
    if (selectedTimings && selectedTimings.length > 0) {
      const values = selectedTimings.map(timingId => [id, timingId]);
      await pool.query("INSERT INTO course_timings (course_id, timing_id) VALUES ?", [values]);
    }

    return NextResponse.json({ success: true, message: "Course updated successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return NextResponse.json({ success: false, message: "Only admins can delete courses" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // Check for linked students or batches
    const [batches] = await pool.query("SELECT id FROM batches WHERE course_id = ?", [id]);
    const [enrollments] = await pool.query("SELECT id FROM enrollments WHERE course_id = ?", [id]);

    if (batches.length > 0 || enrollments.length > 0) {
      return NextResponse.json({ 
        success: false, 
        message: `Cannot delete course. It has ${batches.length} batches and ${enrollments.length} students linked.` 
      }, { status: 400 });
    }

    await pool.query("DELETE FROM course_timings WHERE course_id = ?", [id]);
    await pool.query("DELETE FROM courses WHERE id = ?", [id]);

    return NextResponse.json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
