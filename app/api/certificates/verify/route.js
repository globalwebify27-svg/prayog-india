import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const certNo = searchParams.get("certNo");

    if (!certNo) {
      return NextResponse.json({ success: false, error: "Certificate number is required" }, { status: 400 });
    }

    const [rows] = await pool.execute(`
      SELECT c.*, u.name as student_name, cr.title as course_name 
      FROM certificates c 
      JOIN users u ON c.user_id = u.id 
      JOIN courses cr ON c.course_id = cr.id
      WHERE LOWER(TRIM(c.certificate_number)) = LOWER(TRIM(?))
    `, [certNo]);

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: "Invalid certificate number" }, { status: 404 });
    }

    return NextResponse.json({ success: true, certificate: rows[0] });
  } catch (error) {
    console.error("Verify Certificate Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
