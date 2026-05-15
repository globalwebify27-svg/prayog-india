import { NextResponse } from "next/server";
import pool from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  console.log("GET /api/courses hit");
  try {
    const [courses] = await pool.query("SELECT * FROM courses ORDER BY created_at DESC");
    
    // Fetch timings for each course
    const [courseTimings] = await pool.query(`
      SELECT ct.course_id, t.name, t.slot, t.id
      FROM course_timings ct
      JOIN timings t ON ct.timing_id = t.id
    `);

    // Fetch specializations for each course
    const [courseSpecs] = await pool.query(`
      SELECT cs.course_id, s.name, s.id
      FROM course_specializations cs
      JOIN specializations s ON cs.specialization_id = s.id
    `);

    const coursesWithDetails = courses.map(course => ({
      ...course,
      timings: courseTimings.filter(ct => ct.course_id === course.id),
      specializations: courseSpecs.filter(cs => cs.course_id === course.id)
    }));

    console.log("Fetched courses rows count:", coursesWithDetails.length);
    return NextResponse.json(coursesWithDetails);
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
