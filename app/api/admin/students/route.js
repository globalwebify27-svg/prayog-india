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
      SELECT DISTINCT u.id, u.name, u.email, u.phone, u.role, u.created_at, u.blood_group, u.emergency_contact, u.id_card_issued
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
