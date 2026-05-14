import { NextResponse } from "next/server";
import pool from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("id");

    if (!courseId) {
      return NextResponse.json({ error: "Missing course ID" }, { status: 400 });
    }

    const [materials] = await pool.query(
      `SELECT 
        id, title, type, module_number, is_locked,
        CASE WHEN is_locked = 1 THEN NULL ELSE content END AS content
       FROM course_materials 
       WHERE course_id = ? 
       ORDER BY module_number, created_at`,
      [courseId]
    );

    return NextResponse.json(materials);
  } catch (error) {
    console.error("Error fetching materials:", error);
    return NextResponse.json({ error: "Failed to fetch materials" }, { status: 500 });
  }
}
