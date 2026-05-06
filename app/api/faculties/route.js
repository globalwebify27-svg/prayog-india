import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM faculties ORDER BY id DESC");
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, role, specialty, image, bio, expertise, education } = await request.json();
    const [result] = await pool.query(
      "INSERT INTO faculties (name, role, specialty, image, bio, expertise, education) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, role, specialty, image, bio, JSON.stringify(expertise), education]
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
    await pool.query("DELETE FROM faculties WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
