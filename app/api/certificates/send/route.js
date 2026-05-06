import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { sendMail, getCertificateEmailTemplate } from "@/lib/mailer";

export async function POST(request) {
  try {
    const { certId } = await request.json();

    if (!certId) {
      return NextResponse.json({ success: false, error: "Certificate ID is required" }, { status: 400 });
    }

    // Fetch certificate and student details
    const [rows] = await pool.execute(`
      SELECT c.*, u.name as student_name, u.email as student_email, cr.title as course_name 
      FROM certificates c 
      JOIN users u ON c.user_id = u.id 
      JOIN courses cr ON c.course_id = cr.id
      WHERE c.id = ?
    `, [certId]);

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: "Certificate not found" }, { status: 404 });
    }

    const cert = rows[0];
    const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/verify/${cert.certificate_number}`;

    const emailHtml = getCertificateEmailTemplate(
      cert.student_name,
      cert.course_name,
      verificationLink
    );

    const result = await sendMail(
      cert.student_email,
      `Congratulations! Your Certificate for ${cert.course_name}`,
      emailHtml
    );

    if (result.success) {
      return NextResponse.json({ success: true, message: "Professional email sent!" });
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error("Send Certificate Email Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
