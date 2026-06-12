import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM testimonials ORDER BY created_at DESC");
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const { name, course, year, content, video_url, thumbnail, rating } = await req.json();

    const [result] = await pool.query(
      "INSERT INTO testimonials (name, course, year, content, video_url, thumbnail, rating) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, course || "", year || "", content || null, video_url || null, thumbnail || null, rating || 5]
    );

    return NextResponse.json({ 
      success: true, 
      message: "Review/testimonial added successfully",
      id: result.insertId 
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const { id, name, course, year, content, video_url, thumbnail, rating } = await req.json();

    await pool.query(
      "UPDATE testimonials SET name = ?, course = ?, year = ?, content = ?, video_url = ?, thumbnail = ?, rating = ? WHERE id = ?",
      [name, course || "", year || "", content || null, video_url || null, thumbnail || null, rating || 5, id]
    );

    return NextResponse.json({ success: true, message: "Review/testimonial updated successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    await pool.query("DELETE FROM testimonials WHERE id = ?", [id]);

    return NextResponse.json({ success: true, message: "Review/testimonial deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
