import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    await pool.query("ALTER TABLE users ADD COLUMN image TEXT AFTER emergency_contact");
    return NextResponse.json({ success: true, message: "Column 'image' added successfully" });
  } catch (error) {
    if (error.code === 'ER_DUP_COLUMN_NAME') {
      return NextResponse.json({ success: true, message: "Column 'image' already exists" });
    }
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
