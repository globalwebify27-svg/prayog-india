import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [courses] = await pool.query(
      "SELECT id FROM courses WHERE title = 'Robotics Summer Camp 2026'"
    );

    if (courses.length === 0) {
      return NextResponse.json({ batches: [] });
    }

    const courseId = courses[0].id;

    const [batches] = await pool.query(`
      SELECT 
        b.id,
        b.name,
        b.schedule,
        (SELECT COUNT(e.id) FROM enrollments e WHERE e.batch_id = b.id AND e.payment_status = 'paid') as current_students
      FROM batches b
      WHERE b.course_id = ?
    `, [courseId]);

    // Format for frontend
    const result = {
      morning: batches.find(b => b.name.toLowerCase().includes('morning'))?.current_students || 0,
      evening: batches.find(b => b.name.toLowerCase().includes('evening'))?.current_students || 0,
      batches: batches.map(b => ({
        id: b.id,
        name: b.name,
        schedule: b.schedule,
        current_students: b.current_students
      }))
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Capacity check error:", error);
    return NextResponse.json({ error: "Failed to fetch capacity" }, { status: 500 });
  }
}
