import { NextResponse } from "next/server";
import pool from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // 1. Get User Info
    const [user] = await pool.query(`
      SELECT u.id, u.name, u.email, u.role, u.phone, u.dob, u.address, u.blood_group, 
             u.emergency_contact, u.id_card_issued, u.image, u.profile_completed,
             u.father_name, u.mother_name, u.gender, u.qualification,
             u.school_college, u.last_qualification_year, u.id_type, u.id_number, 
             u.id_image, u.school_id_card, u.school_id_number,
             f.bio, f.specialty, f.expertise, f.education as faculty_education
      FROM users u
      LEFT JOIN faculties f ON u.id = f.user_id
      WHERE u.id = ?
    `, [userId]);
    
    // 2. Get Enrollments with Meeting Links
    const [enrollments] = await pool.query(`
      SELECT e.*, c.title, c.duration, c.type as mode, b.meeting_link 
      FROM enrollments e 
      JOIN courses c ON e.course_id = c.id 
      LEFT JOIN batches b ON e.batch_id = b.id
      WHERE e.user_id = ?
    `, [userId]);

    // 3. Get Installments
    const [installments] = await pool.query(`
      SELECT i.* 
      FROM installments i 
      JOIN enrollments e ON i.enrollment_id = e.id 
      WHERE e.user_id = ?
      ORDER BY i.due_date ASC
    `, [userId]);

    // 4. Get Attendance Stats
    const [attendancePresent] = await pool.query("SELECT COUNT(*) as count FROM attendance WHERE user_id = ? AND status = 'present'", [userId]);
    const [attendanceTotal] = await pool.query("SELECT COUNT(*) as count FROM attendance WHERE user_id = ?", [userId]);

    // 5. Get Certificate Count
    const [certificates] = await pool.query("SELECT COUNT(*) as count FROM certificates WHERE user_id = ?", [userId]);

    // 6. Calculate Progress (Mock logic: based on attendance vs estimated duration or total classes)
    // For now, we'll return a dynamic number based on attendance consistency
    const attendancePercentage = attendanceTotal[0].count > 0 
      ? Math.round((attendancePresent[0].count / attendanceTotal[0].count) * 100) 
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        user: user[0],
        enrollments,
        installments,
        attendanceCount: attendancePresent[0].count,
        totalAttendance: attendanceTotal[0].count,
        attendancePercentage,
        certificateCount: certificates[0].count,
        session: new Date().getFullYear() + "-" + (new Date().getFullYear() + 1)
      }
    });

  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
