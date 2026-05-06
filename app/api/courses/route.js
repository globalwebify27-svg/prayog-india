import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM courses ORDER BY created_at DESC");
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, category, level, description, price, type, image, duration } = body;

    const [result] = await pool.query(
      "INSERT INTO courses (title, category, level, description, price, type, image, duration) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [title, category, level, description, price, type, image, duration]
    );

    return NextResponse.json({ id: result.insertId, message: "Course created successfully" });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
  }
}
