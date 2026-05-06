import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    let query = "SELECT c.*, u.name as student_name, cr.title as course_name FROM certificates c JOIN users u ON c.user_id = u.id JOIN courses cr ON c.course_id = cr.id";
    let params = [];

    if (userId) {
      query += " WHERE c.user_id = ?";
      params.push(userId);
    }

    const [rows] = await pool.execute(query, params);
    return NextResponse.json({ success: true, certificates: rows });
  } catch (error) {
    console.error("Fetch Certificates Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { userId, courseId, issueDate } = await request.json();

    if (!userId || !courseId) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Generate a unique certificate number
    const certNo = `PR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const query = `
      INSERT INTO certificates (user_id, course_id, certificate_number, issue_date, qr_code_data)
      VALUES (?, ?, ?, ?, ?)
    `;
    const qrData = `https://prayogindia.in/verify/${certNo}`;
    
    const [result] = await pool.execute(query, [
      userId, 
      courseId, 
      certNo, 
      issueDate || new Date().toISOString().split('T')[0],
      qrData
    ]);

    return NextResponse.json({ 
      success: true, 
      certificateId: result.insertId, 
      certificateNumber: certNo 
    });
  } catch (error) {
    console.error("Create Certificate Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
