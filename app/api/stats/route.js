import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [userCount] = await pool.query("SELECT COUNT(*) as count FROM users WHERE role = 'student'");
    const [courseCount] = await pool.query("SELECT COUNT(*) as count FROM courses");
    const [workshopCount] = await pool.query("SELECT COUNT(*) as count FROM workshops");
    const [partnerCount] = await pool.query("SELECT COUNT(*) as count FROM partners");

    const stats = [
      { id: "students", value: 500 + userCount[0].count, suffix: "+", label: "Students Trained" },
      { id: "courses", value: 10 + courseCount[0].count, suffix: "+", label: "Courses & Programs" },
      { id: "awards", value: "120", suffix: "+", label: "Awards Won" }, // Static for now
      { id: "partners", value: 15 + partnerCount[0].count, suffix: "+", label: "Corporate Partners" }
    ];

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
