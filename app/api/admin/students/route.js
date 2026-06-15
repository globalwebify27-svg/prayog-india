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

    let studentsQuery = `
      SELECT DISTINCT u.id, u.name, u.email, u.phone, u.role, u.created_at, u.blood_group, u.emergency_contact, u.id_card_issued, u.image
      FROM users u
    `;
    let studentsParams = [];

    if (userRole === 'teacher') {
      studentsQuery += `
        JOIN enrollments e ON u.id = e.user_id 
        JOIN courses c ON e.course_id = c.id 
        WHERE u.role = 'student' AND c.teacher_id = ?
      `;
      studentsParams.push(userId);
    } else {
      studentsQuery += " WHERE u.role = 'student'";
    }

    studentsQuery += " ORDER BY u.created_at DESC";

    const [students] = await pool.query(studentsQuery, studentsParams);
    
    const [enrollments] = await pool.query(`
      SELECT 
        e.id as enrollment_id, 
        e.user_id,
        c.title as course_name, 
        c.type as mode, 
        b.name as batch_name, 
        e.payment_status
      FROM enrollments e
      LEFT JOIN courses c ON e.course_id = c.id
      LEFT JOIN batches b ON e.batch_id = b.id
    `);

    const [installments] = await pool.query(`
      SELECT id, enrollment_id, amount, due_date, status
      FROM installments
    `);

    const formattedStudents = students.map(s => {
      let studentEnrollments = enrollments.filter(e => e.user_id === s.id);
      
      // Deduplicate by course_name to avoid showing 3 redundant rows
      const uniqueCourses = {};
      studentEnrollments.forEach(e => {
        if (!uniqueCourses[e.course_name] || uniqueCourses[e.course_name].enrollment_id < e.enrollment_id) {
          uniqueCourses[e.course_name] = e;
        }
      });
      studentEnrollments = Object.values(uniqueCourses);

      // Attach installments
      studentEnrollments = studentEnrollments.map(e => {
        const eInstallments = installments.filter(i => i.enrollment_id === e.enrollment_id);
        return { ...e, installments: eInstallments };
      });

      return {
        ...s,
        enrollments: studentEnrollments
      };
    });

    return NextResponse.json({
      success: true,
      students: formattedStudents
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const { ids } = await req.json();
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, message: "No student IDs provided" }, { status: 400 });
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Get enrollment IDs for these students
      const [enrollments] = await connection.query("SELECT id FROM enrollments WHERE user_id IN (?)", [ids]);
      const enrollmentIds = enrollments.map(e => e.id);

      if (enrollmentIds.length > 0) {
        // Delete installments
        await connection.query("DELETE FROM installments WHERE enrollment_id IN (?)", [enrollmentIds]);
      }

      // Delete attendance records
      await connection.query("DELETE FROM attendance WHERE user_id IN (?)", [ids]);

      // Delete certificates
      await connection.query("DELETE FROM certificates WHERE user_id IN (?)", [ids]);

      // Delete exam submissions
      await connection.query("DELETE FROM exam_submissions WHERE user_id IN (?)", [ids]);

      // Delete material completions
      await connection.query("DELETE FROM material_completions WHERE student_id IN (?)", [ids]);

      // Delete enrollments
      await connection.query("DELETE FROM enrollments WHERE user_id IN (?)", [ids]);

      // Finally, delete the users
      await connection.query("DELETE FROM users WHERE id IN (?)", [ids]);

      await connection.commit();
      return NextResponse.json({
        success: true,
        message: `${ids.length} students and all associated records deleted successfully`
      });
    } catch (txError) {
      await connection.rollback();
      throw txError;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Admin student bulk deletion error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
