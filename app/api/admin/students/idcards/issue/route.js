import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req) {
  try {
    const { studentIds, issue = true } = await req.json();

    if (!studentIds || !Array.isArray(studentIds)) {
      return NextResponse.json({ success: false, message: "Invalid student IDs" }, { status: 400 });
    }

    const status = issue ? 1 : 0;
    await pool.query("UPDATE users SET id_card_issued = ? WHERE id IN (?)", [status, studentIds]);

    return NextResponse.json({ success: true, message: `ID Card status updated for ${studentIds.length} students` });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
