import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const [promos] = await pool.query(`
      SELECT p.*, c.title as course_name 
      FROM promo_codes p 
      LEFT JOIN courses c ON p.course_id = c.id 
      ORDER BY p.created_at DESC
    `);
    return NextResponse.json({ success: true, promos });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { code, discount_type, discount_value, course_id, expiry_date } = await req.json();

    const [result] = await pool.query(
      "INSERT INTO promo_codes (code, discount_type, discount_value, course_id, expiry_date) VALUES (?, ?, ?, ?, ?)",
      [code.toUpperCase(), discount_type, discount_value, course_id || null, expiry_date || null]
    );

    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await pool.query("DELETE FROM promo_codes WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
