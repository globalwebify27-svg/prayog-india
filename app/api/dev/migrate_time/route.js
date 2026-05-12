import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    await pool.query("ALTER TABLE batches ADD COLUMN start_time TIME NULL AFTER meeting_link");
    await pool.query("ALTER TABLE batches ADD COLUMN end_time TIME NULL AFTER start_time");
    return NextResponse.json({ success: true, message: "Columns 'start_time' and 'end_time' added successfully" });
  } catch (error) {
    if (error.code === 'ER_DUP_COLUMN_NAME') {
      return NextResponse.json({ success: true, message: "Columns already exist" });
    }
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
