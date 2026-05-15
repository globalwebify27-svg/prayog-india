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

    // Fetch specializations for each course
    const [courseSpecs] = await pool.query(`
      SELECT cs.course_id, s.name, s.id
      FROM course_specializations cs
      JOIN specializations s ON cs.specialization_id = s.id
    `);

    const coursesWithDetails = courses.map(course => ({
      ...course,
      timings: courseTimings.filter(ct => ct.course_id === course.id),
      specializations: courseSpecs.filter(cs => cs.course_id === course.id)
    }));
    
    return NextResponse.json({
      success: true,
      courses: coursesWithDetails
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

    const { title, description, price, type, duration, image, teacher_id, selectedTimings, selectedSpecializations, allow_partial_payment, installments_count, rating, level, category, brochure, is_internship, is_one_to_one, outcomes, certification, who_can_join, methodology } = await req.json();

    const [result] = await pool.query(
      "INSERT INTO courses (title, description, price, type, duration, image, teacher_id, allow_partial_payment, installments_count, rating, level, category, brochure, is_internship, is_one_to_one, outcomes, certification, who_can_join, methodology) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [title, description, price, type, duration, image, teacher_id || null, allow_partial_payment ? 1 : 0, installments_count || 1, rating || "4.5", level || "Beginner", category || "Robotics", brochure || null, is_internship ? 1 : 0, is_one_to_one ? 1 : 0, outcomes || null, certification || null, who_can_join || null, methodology || null]
    );

    const courseId = result.insertId;

    if (selectedTimings && selectedTimings.length > 0) {
      const values = selectedTimings.map(timingId => [courseId, timingId]);
      await pool.query("INSERT INTO course_timings (course_id, timing_id) VALUES ?", [values]);
    }

    if (selectedSpecializations && selectedSpecializations.length > 0) {
      const values = selectedSpecializations.map(specId => [courseId, specId]);
      await pool.query("INSERT INTO course_specializations (course_id, specialization_id) VALUES ?", [values]);
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

    const { id, title, description, price, type, duration, image, teacher_id, selectedTimings, selectedSpecializations, allow_partial_payment, installments_count, rating, level, category, brochure, is_internship, is_one_to_one, outcomes, certification, who_can_join, methodology } = await req.json();

    await pool.query(
      "UPDATE courses SET title = ?, description = ?, price = ?, type = ?, duration = ?, image = ?, teacher_id = ?, allow_partial_payment = ?, installments_count = ?, rating = ?, level = ?, category = ?, brochure = ?, is_internship = ?, is_one_to_one = ?, outcomes = ?, certification = ?, who_can_join = ?, methodology = ? WHERE id = ?",
      [title, description, price, type, duration, image, teacher_id || null, allow_partial_payment ? 1 : 0, installments_count || 1, rating, level, category, brochure || null, is_internship ? 1 : 0, is_one_to_one ? 1 : 0, outcomes || null, certification || null, who_can_join || null, methodology || null, id]
    );

    // Update timings
    await pool.query("DELETE FROM course_timings WHERE course_id = ?", [id]);
    if (selectedTimings && selectedTimings.length > 0) {
      const values = selectedTimings.map(timingId => [id, timingId]);
      await pool.query("INSERT INTO course_timings (course_id, timing_id) VALUES ?", [values]);
    }

    // Update specializations
    await pool.query("DELETE FROM course_specializations WHERE course_id = ?", [id]);
    if (selectedSpecializations && selectedSpecializations.length > 0) {
      const values = selectedSpecializations.map(specId => [id, specId]);
      await pool.query("INSERT INTO course_specializations (course_id, specialization_id) VALUES ?", [values]);
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

    // Check for linked students
    const [enrollments] = await pool.query("SELECT id FROM enrollments WHERE course_id = ?", [id]);

    if (enrollments.length > 0) {
      return NextResponse.json({ 
        success: false, 
        message: `Cannot delete course. It has ${enrollments.length} students enrolled. Please remove students first.` 
      }, { status: 400 });
    }

    // Clean up dependencies
    // 1. Delete Exam dependencies (submissions and questions)
    const [exams] = await pool.query("SELECT id FROM exams WHERE course_id = ?", [id]);
    const examIds = exams.map(e => e.id);
    
    if (examIds.length > 0) {
      await pool.query("DELETE FROM exam_submissions WHERE exam_id IN (?)", [examIds]);
      await pool.query("DELETE FROM exam_questions WHERE exam_id IN (?)", [examIds]);
      await pool.query("DELETE FROM exams WHERE course_id = ?", [id]);
    }

    // 2. Delete other course dependencies
    await pool.query("DELETE FROM batches WHERE course_id = ?", [id]);
    await pool.query("DELETE FROM course_timings WHERE course_id = ?", [id]);
    await pool.query("DELETE FROM course_specializations WHERE course_id = ?", [id]);
    await pool.query("DELETE FROM courses WHERE id = ?", [id]);

    return NextResponse.json({ success: true, message: "Course and all associated data (exams, batches) deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
