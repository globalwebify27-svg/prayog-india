import { NextResponse } from "next/server";
import pool from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  console.log("GET /api/courses hit");
  try {
    const [rows] = await pool.query("SELECT * FROM courses ORDER BY created_at DESC");
    console.log("Fetched courses rows count:", rows?.length);
    return NextResponse.json(Array.isArray(rows) ? rows : []);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, category, level, description, price, type, image, duration, brochure } = body;

    const [result] = await pool.query(
      "INSERT INTO courses (title, category, level, description, price, type, image, duration, brochure) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [title, category, level, description, price, type, image, duration, brochure || null]
    );

    return NextResponse.json({ id: result.insertId, message: "Course created successfully" });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
  }
}
