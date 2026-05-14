import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { cookies } from "next/headers";
export const dynamic = 'force-dynamic';
import jwt from "jsonwebtoken";

async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return false;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback");
    return decoded && decoded.role === 'admin';
  } catch {
    return false;
  }
}

export async function GET() {
  if (!await verifyAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const [rows] = await pool.query("SELECT * FROM promos ORDER BY created_at DESC");
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  if (!await verifyAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const {
      title, subtitle, description, date_text, price,
      tag, image, target_date, is_active, registration_link, start_date
    } = body;

    // Format target_date for MySQL: YYYY-MM-DD HH:MM:SS
    let formattedDate = null;
    if (target_date) {
      try {
        const d = new Date(target_date);
        if (!isNaN(d.getTime())) {
          formattedDate = d.toISOString().slice(0, 19).replace('T', ' ');
        }
      } catch (e) {
        console.error("Target date parsing error:", e);
      }
    }

    // Format start_date for MySQL: YYYY-MM-DD
    let formattedStartDate = null;
    if (start_date) {
      try {
        const d = new Date(start_date);
        if (!isNaN(d.getTime())) {
          formattedStartDate = d.toISOString().split('T')[0];
        }
      } catch (e) {
        console.error("Start date parsing error:", e);
      }
    }

    const [result] = await pool.query(
      `INSERT INTO promos (title, subtitle, description, date_text, price, tag, image, target_date, is_active, registration_link, start_date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title || "",
        subtitle || "",
        description || "",
        date_text || "",
        price || "",
        tag || "Limited Time",
        image || "",
        formattedDate,
        is_active === undefined ? true : is_active,
        registration_link || '/register',
        formattedStartDate
      ]
    );

    return NextResponse.json({ id: result.insertId, message: "Promo created successfully" });
  } catch (error) {
    console.error("POST Promo Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  if (!await verifyAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const {
      id, title, subtitle, description, date_text,
      price, tag, image, target_date, is_active, registration_link, start_date
    } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // Format target_date for MySQL: YYYY-MM-DD HH:MM:SS
    let formattedDate = null;
    if (target_date) {
      try {
        const d = new Date(target_date);
        if (!isNaN(d.getTime())) {
          formattedDate = d.toISOString().slice(0, 19).replace('T', ' ');
        }
      } catch (e) {
        console.error("Target date parsing error:", e);
      }
    }

    // Format start_date for MySQL: YYYY-MM-DD
    let formattedStartDate = null;
    if (start_date) {
      try {
        const d = new Date(start_date);
        if (!isNaN(d.getTime())) {
          formattedStartDate = d.toISOString().split('T')[0];
        }
      } catch (e) {
        console.error("Start date parsing error:", e);
      }
    }

    await pool.query(
      `UPDATE promos SET 
        title = ?, subtitle = ?, description = ?, date_text = ?, 
        price = ?, tag = ?, image = ?, target_date = ?, 
        is_active = ?, registration_link = ?, start_date = ?
       WHERE id = ?`,
      [
        title || "",
        subtitle || "",
        description || "",
        date_text || "",
        price || "",
        tag || "Limited Time",
        image || "",
        formattedDate,
        is_active === undefined ? true : is_active,
        registration_link || "/register",
        formattedStartDate,
        id
      ]
    );

    return NextResponse.json({ message: "Promo updated successfully" });
  } catch (error) {
    console.error("PUT Promo Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  if (!await verifyAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await pool.query("DELETE FROM promos WHERE id = ?", [id]);
    return NextResponse.json({ message: "Promo deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
