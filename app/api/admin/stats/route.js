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
      const [courses] = await pool.query("SELECT COUNT(*) as count FROM courses");
      const [activeEnrollments] = await pool.query("SELECT COUNT(*) as count FROM enrollments WHERE status = 'active'");
      const [revenue] = await pool.query("SELECT SUM(total_amount) as total FROM enrollments");
      const [installments] = await pool.query("SELECT COUNT(*) as count FROM installments WHERE status = 'pending'");

      // Fetch 5 Most Recent Payments
      const [recentPayments] = await pool.query(`
        SELECT 
          i.amount, 
          COALESCE(i.paid_at, e.enrolled_at) as paid_date, 
          i.status,
          u.name as student_name,
          c.title as course_name
        FROM installments i
        JOIN enrollments e ON i.enrollment_id = e.id
        JOIN users u ON e.user_id = u.id
        JOIN courses c ON e.course_id = c.id
        WHERE i.status = 'paid'
        ORDER BY paid_date DESC
        LIMIT 5
      `);

      // Fetch Enrollment Trends (Last 6 Months)
      const [trends] = await pool.query(`
        SELECT 
          DATE_FORMAT(created_at, '%b %Y') as month,
          COUNT(*) as count
        FROM users 
        WHERE role = 'student' 
        AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY month
        ORDER BY MIN(created_at) ASC
      `);

      // Calculate Growth (Simple comparison with previous month)
      const [prevMonth] = await pool.query(`
        SELECT COUNT(*) as count FROM users 
        WHERE role = 'student' 
        AND created_at BETWEEN DATE_SUB(DATE_SUB(NOW(), INTERVAL 1 MONTH), INTERVAL 1 MONTH) AND DATE_SUB(NOW(), INTERVAL 1 MONTH)
      `);
      const [currMonth] = await pool.query(`
        SELECT COUNT(*) as count FROM users 
        WHERE role = 'student' 
        AND created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
      `);
      
      const growth = prevMonth[0].count === 0 ? 100 : Math.round(((currMonth[0].count - prevMonth[0].count) / prevMonth[0].count) * 100);

      stats = {
        totalStudents: students[0].count,
        activePrograms: courses[0].count,
        activeEnrollments: activeEnrollments[0].count,
        totalRevenue: revenue[0].total || 0,
        pendingPayments: installments[0].count,
        recentPayments: recentPayments,
        enrollmentTrends: trends,
        growth: growth
      };
    }

    return NextResponse.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
