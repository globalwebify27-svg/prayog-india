import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    
    let query = "SELECT * FROM gallery";
    let params = [];
    
    if (category && category !== "All") {
      query += " WHERE category = ?";
      params.push(category);
    }
    
    query += " ORDER BY created_at DESC";
    
    const [rows] = await pool.query(query, params);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { title, category, image_url, location } = await request.json();
    const [result] = await pool.query(
      "INSERT INTO gallery (title, category, image_url, location) VALUES (?, ?, ?, ?)",
      [title, category, image_url, location]
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
    await pool.query("DELETE FROM gallery WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
