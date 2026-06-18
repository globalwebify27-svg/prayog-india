import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

async function verifyAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  
  if (!token) {
    return { error: NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 }) };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin' && decoded.role !== 'teacher') {
      return { error: NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 }) };
    }
    return { decoded };
  } catch (err) {
    return { error: NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 }) };
  }
}

export async function PUT(req, { params }) {
  try {
    const auth = await verifyAuth();
    if (auth.error) return auth.error;

    const { id } = await params;
    const { title, content, target_role = 'all' } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ success: false, message: "Title and content are required" }, { status: 400 });
    }

    const [result] = await pool.query(
      "UPDATE notices SET title = ?, content = ?, target_role = ? WHERE id = ?",
      [title, content, target_role, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, message: "Notice not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Notice updated successfully"
    });

  } catch (error) {
    console.error("Update broadcast failed:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const auth = await verifyAuth();
    if (auth.error) return auth.error;

    const { id } = await params;

    const [result] = await pool.query(
      "DELETE FROM notices WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, message: "Notice not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Notice deleted successfully"
    });

  } catch (error) {
    console.error("Delete broadcast failed:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
