import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [courses] = await pool.query("SELECT * FROM courses ORDER BY created_at DESC");
    
    return NextResponse.json({
      success: true,
      courses
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { title, description, price, type, duration, image } = await req.json();

    const [result] = await pool.query(
      "INSERT INTO courses (title, description, price, type, duration, image) VALUES (?, ?, ?, ?, ?, ?)",
      [title, description, price, type, duration, image]
    );

    return NextResponse.json({ 
      success: true, 
      message: "Course created",
      courseId: result.insertId 
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
