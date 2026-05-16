import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    // Check if columns exist
    const [columns] = await pool.query("SHOW COLUMNS FROM users");
    const fields = columns.map(c => c.Field);
    
    if (!fields.includes('reset_token')) {
      await pool.query("ALTER TABLE users ADD COLUMN reset_token VARCHAR(255) DEFAULT NULL");
    }
    
    if (!fields.includes('reset_expiry')) {
      await pool.query("ALTER TABLE users ADD COLUMN reset_expiry DATETIME DEFAULT NULL");
    }

    return NextResponse.json({ success: true, message: "User table updated for password resets" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
