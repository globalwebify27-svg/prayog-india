import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [students] = await pool.query(`
      SELECT id, name, email, phone, role, created_at 
      FROM users 
      WHERE role = 'student' 
      ORDER BY created_at DESC
    `);
    
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
