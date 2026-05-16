import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const courseId = searchParams.get("courseId");
    const status = searchParams.get("status"); // 'issued' or 'pending'

    if (status === "pending") {
      let query = `
        SELECT 
          u.id as user_id, 
          u.name as student_name, 
          c.id as course_id, 
          c.title as course_name,
          e.enrolled_at as issue_date
        FROM enrollments e
        JOIN users u ON e.user_id = u.id
        JOIN courses c ON e.course_id = c.id
        LEFT JOIN certificates cert ON e.user_id = cert.user_id AND e.course_id = cert.course_id
        WHERE cert.id IS NULL
      `;
      let params = [];
      if (courseId) {
        query += " AND c.id = ?";
        params.push(courseId);
      }
      const [rows] = await pool.execute(query, params);
      return NextResponse.json({ success: true, certificates: rows });
    }

    let query = "SELECT c.*, u.name as student_name, cr.title as course_name FROM certificates c JOIN users u ON c.user_id = u.id JOIN courses cr ON c.course_id = cr.id";
    let params = [];
    let whereClauses = [];

    if (userId) {
      whereClauses.push("c.user_id = ?");
      params.push(userId);
    }
    if (courseId) {
      whereClauses.push("c.course_id = ?");
      params.push(courseId);
    }

    if (whereClauses.length > 0) {
      query += " WHERE " + whereClauses.join(" AND ");
    }

    query += " ORDER BY c.issue_date DESC";

    const [rows] = await pool.execute(query, params);
    return NextResponse.json({ success: true, certificates: rows });
  } catch (error) {
    console.error("Fetch Certificates Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, courseId, issueDate, bulkCertificates } = body;

    if (bulkCertificates && Array.isArray(bulkCertificates)) {
      const results = [];
      for (const cert of bulkCertificates) {
        const certNo = `PR-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://prayogindiarobotics.com";
        const qrData = `${baseUrl}/verify/${certNo}`;
        const query = `
          INSERT INTO certificates (user_id, course_id, certificate_number, issue_date, qr_code_data)
          VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await pool.execute(query, [
          cert.userId, 
          cert.courseId, 
          certNo, 
          issueDate || new Date().toISOString().split('T')[0],
          qrData
        ]);
        results.push({ userId: cert.userId, certificateNumber: certNo });
      }
      return NextResponse.json({ success: true, results });
    }

    if (!userId || !courseId) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Generate a unique certificate number
    const certNo = `PR-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const query = `
      INSERT INTO certificates (user_id, course_id, certificate_number, issue_date, qr_code_data)
      VALUES (?, ?, ?, ?, ?)
    `;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://prayogindiarobotics.com";
    const qrData = `${baseUrl}/verify/${certNo}`;
    
    const [result] = await pool.execute(query, [
      userId, 
      courseId, 
      certNo, 
      issueDate || new Date().toISOString().split('T')[0],
      qrData
    ]);

    // Send Email Notification
    try {
      const { sendMail, getCertificateEmailTemplate } = require("@/lib/mailer");
      const [studentRows] = await pool.query(
        "SELECT u.name, u.email, c.title as course_name FROM users u JOIN enrollments e ON e.user_id = u.id JOIN courses c ON e.course_id = c.id WHERE u.id = ? AND c.id = ?",
        [userId, courseId]
      );
      
      if (studentRows.length > 0) {
        const student = studentRows[0];
        const certLink = `${baseUrl}/verify/${certNo}`;
        const emailHtml = getCertificateEmailTemplate(student.name, student.course_name, certLink);
        await sendMail(student.email, "Certificate Issued - Prayog India", emailHtml);
      }
    } catch (mailErr) {
      console.error("Certificate Mail Error:", mailErr);
    }

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

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Certificate ID is required" }, { status: 400 });
    }

    const [result] = await pool.execute("DELETE FROM certificates WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, error: "Certificate not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Certificate deleted successfully" });
  } catch (error) {
    console.error("Delete Certificate Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
