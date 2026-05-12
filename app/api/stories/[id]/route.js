import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const [rows] = await pool.query("SELECT * FROM stories WHERE id = ? OR slug = ?", [id, id]);
    
    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Story not found" }, { status: 404 });
    }

    const story = rows[0];
    // Parse content if it's a string
    if (typeof story.content === 'string') {
      try {
        story.content = JSON.parse(story.content);
      } catch (e) {
        story.content = [];
      }
    }

    return NextResponse.json(story);
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { title, slug, excerpt, thumbnail, banner_image, video_url, content, category, author } = body;

    await pool.query(
      "UPDATE stories SET title = ?, slug = ?, excerpt = ?, thumbnail = ?, banner_image = ?, video_url = ?, content = ?, category = ?, author = ? WHERE id = ?",
      [title, slug, excerpt, thumbnail, banner_image, video_url, JSON.stringify(content), category, author, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await pool.query("DELETE FROM stories WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
