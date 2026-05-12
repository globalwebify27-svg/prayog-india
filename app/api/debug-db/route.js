import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [users] = await pool.query("SELECT id, name, email, role FROM users LIMIT 10");
    const [enrollments] = await pool.query("SELECT * FROM enrollments LIMIT 5");
    const [installments] = await pool.query("SELECT * FROM installments LIMIT 5");
    
    return NextResponse.json({
      users,
      enrollments,
      installments,
      db: process.env.DATABASE_NAME
    });
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}
