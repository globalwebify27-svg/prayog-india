import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [result] = await pool.query("UPDATE users SET name = UPPER(TRIM(name)) WHERE role = 'student' AND name IS NOT NULL");
    return NextResponse.json({
      success: true,
      message: `Successfully converted ${result.affectedRows} student name(s) to UPPERCASE.`,
      affectedRows: result.affectedRows
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
