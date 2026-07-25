import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const courseId = searchParams.get("courseId");
    const search = searchParams.get("search");
    const admissionDate = searchParams.get("admissionDate");
    const status = searchParams.get("status"); // 'issued', 'pending', or 'all'

    if (status === "pending") {
      let query = `
        SELECT 
          u.id as user_id, 
          u.name as student_name, 
          u.email as student_email,
          c.id as course_id, 
          c.title as course_name,
          b.id as batch_id,
          b.name as batch_name,
          MAX(e.enrolled_at) as enrolled_at,
          MAX(e.enrolled_at) as issue_date,
          NULL as id, NULL as certificate_number, NULL as qr_code_data,
          NULL as from_date, NULL as to_date, NULL as institute_name
        FROM enrollments e
        JOIN users u ON e.user_id = u.id
        JOIN courses c ON e.course_id = c.id
        LEFT JOIN batches b ON e.batch_id = b.id
        LEFT JOIN certificates cert ON e.user_id = cert.user_id AND e.course_id = cert.course_id
        WHERE cert.id IS NULL
      `;
      let params = [];
      if (courseId && courseId !== "all") {
        query += " AND c.id = ?";
        params.push(courseId);
      }
      if (search) {
        query += " AND (u.name LIKE ? OR u.email LIKE ?)";
        params.push(`%${search}%`, `%${search}%`);
      }
      if (admissionDate) {
        query += " AND DATE(e.enrolled_at) = ?";
        params.push(admissionDate);
      }
      query += " GROUP BY u.id, u.name, u.email, c.id, c.title, b.id, b.name";
      const [rows] = await pool.execute(query, params);
      return NextResponse.json({ success: true, certificates: rows });
    }

    if (status === "all") {
      let params = [];
      let issuedFilter = "";
      if (courseId && courseId !== "all") {
        issuedFilter += " AND cr.id = ?";
        params.push(courseId);
      }
      if (search) {
        issuedFilter += " AND (u.name LIKE ? OR u.email LIKE ?)";
        params.push(`%${search}%`, `%${search}%`);
      }
      if (admissionDate) {
        issuedFilter += " AND DATE(e.enrolled_at) = ?";
        params.push(admissionDate);
      }

      // Issued certificates
      let issuedQuery = `
        SELECT c.*, u.name as student_name, u.email as student_email, cr.title as course_name, b.name as batch_name, e.enrolled_at
        FROM certificates c 
        JOIN users u ON c.user_id = u.id 
        JOIN courses cr ON c.course_id = cr.id
        LEFT JOIN enrollments e ON e.user_id = c.user_id AND e.course_id = c.course_id
        LEFT JOIN batches b ON e.batch_id = b.id
        WHERE 1=1${issuedFilter}
        GROUP BY c.id
      `;

      // Pending (enrolled but no certificate)
      let pendingParams = [];
      let pendingFilter = "";
      if (courseId && courseId !== "all") {
        pendingFilter += " AND cs.id = ?";
        pendingParams.push(courseId);
      }
      if (search) {
        pendingFilter += " AND (u.name LIKE ? OR u.email LIKE ?)";
        pendingParams.push(`%${search}%`, `%${search}%`);
      }
      if (admissionDate) {
        pendingFilter += " AND DATE(e.enrolled_at) = ?";
        pendingParams.push(admissionDate);
      }

      let pendingQuery = `
        SELECT 
          NULL as id, u.id as user_id, cs.id as course_id,
          NULL as certificate_number, MAX(e.enrolled_at) as issue_date, MAX(e.enrolled_at) as enrolled_at,
          NULL as qr_code_data, NULL as from_date, NULL as to_date, NULL as institute_name,
          u.name as student_name, u.email as student_email, cs.title as course_name, b.name as batch_name
        FROM enrollments e
        JOIN users u ON e.user_id = u.id
        JOIN courses cs ON e.course_id = cs.id
        LEFT JOIN batches b ON e.batch_id = b.id
        LEFT JOIN certificates cert ON e.user_id = cert.user_id AND e.course_id = cert.course_id
        WHERE cert.id IS NULL${pendingFilter}
        GROUP BY u.id, u.name, u.email, cs.id, cs.title, b.name
      `;

      const [issuedRows] = await pool.execute(issuedQuery, params);
      const [pendingRows] = await pool.execute(pendingQuery, pendingParams);
      const combined = [...issuedRows, ...pendingRows];
      return NextResponse.json({ success: true, certificates: combined });
    }

    // Default 'issued' status
    let query = `
      SELECT c.*, u.name as student_name, u.email as student_email, cr.title as course_name, b.name as batch_name, e.enrolled_at
      FROM certificates c 
      JOIN users u ON c.user_id = u.id 
      JOIN courses cr ON c.course_id = cr.id
      LEFT JOIN enrollments e ON e.user_id = c.user_id AND e.course_id = c.course_id
      LEFT JOIN batches b ON e.batch_id = b.id
    `;
    let params = [];
    let whereClauses = [];

    if (userId) {
      whereClauses.push("c.user_id = ?");
      params.push(userId);
    }
    if (courseId && courseId !== "all") {
      whereClauses.push("c.course_id = ?");
      params.push(courseId);
    }
    if (search) {
      whereClauses.push("(u.name LIKE ? OR u.email LIKE ?)");
      params.push(`%${search}%`, `%${search}%`);
    }
    if (admissionDate) {
      whereClauses.push("DATE(e.enrolled_at) = ?");
      params.push(admissionDate);
    }

    if (whereClauses.length > 0) {
      query += " WHERE " + whereClauses.join(" AND ");
    }

    query += " GROUP BY c.id ORDER BY c.issue_date DESC";

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
    const { userId, courseId, issueDate, fromDate, toDate, instituteName, bulkCertificates } = body;

    const host = request.headers.get("host") || "prayogindiarobotics.com";
    const protocol = request.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
    const baseUrl = `${protocol}://${host}`;

    if (bulkCertificates && Array.isArray(bulkCertificates)) {
      const results = [];
      for (const cert of bulkCertificates) {
        const certNo = `PR-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
        const qrData = `${baseUrl}/verify/${certNo}`;
        const query = `
          INSERT INTO certificates (user_id, course_id, certificate_number, issue_date, qr_code_data, from_date, to_date, institute_name)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await pool.execute(query, [
          cert.userId, 
          cert.courseId, 
          certNo, 
          issueDate || new Date().toISOString().split('T')[0],
          qrData,
          fromDate || null,
          toDate || null,
          instituteName || null
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
      INSERT INTO certificates (user_id, course_id, certificate_number, issue_date, qr_code_data, from_date, to_date, institute_name)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const qrData = `${baseUrl}/verify/${certNo}`;
    
    const [result] = await pool.execute(query, [
      userId, 
      courseId, 
      certNo, 
      issueDate || new Date().toISOString().split('T')[0],
      qrData,
      fromDate || null,
      toDate || null,
      instituteName || null
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
