import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM workshops ORDER BY date DESC");
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { title, description, image_url, video_url, date, location } = await request.json();
    const [result] = await pool.query(
      "INSERT INTO workshops (title, description, image_url, video_url, date, location) VALUES (?, ?, ?, ?, ?, ?)",
      [title, description, image_url, video_url, date, location]
    );
    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await pool.query("DELETE FROM workshops WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
