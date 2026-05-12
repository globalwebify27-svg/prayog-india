import { NextResponse } from "next/server";
import pool from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const [logs] = await pool.query(`
      SELECT a.*, c.title as course_name, b.name as batch_name
      FROM attendance a
      LEFT JOIN courses c ON a.course_id = c.id
      LEFT JOIN batches b ON a.batch_id = b.id
      WHERE a.user_id = ?
      ORDER BY a.recorded_at DESC
      LIMIT 50
    `, [userId]);

    return NextResponse.json({ success: true, logs });
  } catch (error) {
    console.error("History fetch error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
