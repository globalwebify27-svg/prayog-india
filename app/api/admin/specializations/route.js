import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const [specializations] = await pool.query("SELECT * FROM specializations ORDER BY name ASC");
    return NextResponse.json({ success: true, specializations });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return NextResponse.json({ success: false, message: "Only admins can manage specializations" }, { status: 403 });
    }

    const { name, description } = await req.json();
    if (!name) return NextResponse.json({ success: false, message: "Name is required" }, { status: 400 });

    await pool.query(
      "INSERT INTO specializations (name, description) VALUES (?, ?)",
      [name, description]
    );

    return NextResponse.json({ success: true, message: "Specialization created" });
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
      return NextResponse.json({ success: false, message: "Only admins can manage specializations" }, { status: 403 });
    }

    const { id, name, description } = await req.json();
    if (!id || !name) return NextResponse.json({ success: false, message: "ID and name are required" }, { status: 400 });

    await pool.query(
      "UPDATE specializations SET name = ?, description = ? WHERE id = ?",
      [name, description, id]
    );

    return NextResponse.json({ success: true, message: "Specialization updated" });
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
      return NextResponse.json({ success: false, message: "Only admins can manage specializations" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    await pool.query("DELETE FROM specializations WHERE id = ?", [id]);

    return NextResponse.json({ success: true, message: "Specialization deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
