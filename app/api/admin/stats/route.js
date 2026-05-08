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

    let stats = {};

    if (userRole === 'teacher') {
      // Teacher specific stats
      const [students] = await pool.query(`
        SELECT COUNT(DISTINCT e.user_id) as count 
        FROM enrollments e 
        JOIN courses c ON e.course_id = c.id 
        WHERE c.teacher_id = ?
      `, [userId]);

      const [courses] = await pool.query("SELECT COUNT(*) as count FROM courses WHERE teacher_id = ?", [userId]);
      
      const [batches] = await pool.query(`
        SELECT COUNT(*) as count 
        FROM batches b 
        JOIN courses c ON b.course_id = c.id 
        WHERE c.teacher_id = ?
      `, [userId]);

      const [exams] = await pool.query(`
        SELECT COUNT(*) as count 
        FROM exams e 
        JOIN courses c ON e.course_id = c.id 
        WHERE c.teacher_id = ?
      `, [userId]);

      stats = {
        totalStudents: students[0].count,
        activePrograms: courses[0].count,
        activeBatches: batches[0].count,
        assignedExams: exams[0].count
      };
    } else {
      // Admin stats (Institutional)
      const [students] = await pool.query("SELECT COUNT(*) as count FROM users WHERE role = 'student'");
      const [enrollments] = await pool.query("SELECT COUNT(*) as count FROM enrollments WHERE status = 'active'");
      const [revenue] = await pool.query("SELECT SUM(total_amount) as total FROM enrollments");
      const [installments] = await pool.query("SELECT COUNT(*) as count FROM installments WHERE status = 'pending'");

      stats = {
        totalStudents: students[0].count,
        activePrograms: enrollments[0].count,
        totalRevenue: revenue[0].total || 0,
        pendingPayments: installments[0].count
      };
    }

    return NextResponse.json({
      success: true,
      stats
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
