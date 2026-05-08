import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [teachers] = await pool.query("SELECT id, name, email FROM users WHERE role = 'teacher'");
    return NextResponse.json({ success: true, teachers });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
