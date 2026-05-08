import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin' && decoded.role !== 'teacher') {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const { title, content, target_role = 'all' } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ success: false, message: "Title and content are required" }, { status: 400 });
    }

    const [result] = await pool.query(
      "INSERT INTO notices (title, content, target_role) VALUES (?, ?, ?)",
      [title, content, target_role]
    );

    return NextResponse.json({
      success: true,
      message: "Notice broadcasted successfully",
      id: result.insertId
    });

  } catch (error) {
    console.error("Broadcast failed:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM notices ORDER BY created_at DESC LIMIT 20");
    return NextResponse.json({ success: true, notices: rows });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
