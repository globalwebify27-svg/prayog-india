import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM stories ORDER BY created_at DESC");
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, slug, excerpt, thumbnail, banner_image, video_url, content, category, author } = body;

    const [result] = await pool.query(
      "INSERT INTO stories (title, slug, excerpt, thumbnail, banner_image, video_url, content, category, author, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())",
      [title, slug, excerpt, thumbnail, banner_image, video_url, JSON.stringify(content), category, author]
    );

    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
