import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    await pool.query("ALTER TABLE courses ADD COLUMN IF NOT EXISTS brochure VARCHAR(500) DEFAULT NULL");
    return NextResponse.json({ success: true, message: "brochure column added to courses table" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
