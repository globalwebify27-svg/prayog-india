import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req) {
  try {
    const { code, courseId } = await req.json();

    if (!code) {
      return NextResponse.json({ success: false, message: "Code is required" }, { status: 400 });
    }

    const [rows] = await pool.query(
      "SELECT * FROM promo_codes WHERE code = ? AND (course_id IS NULL OR course_id = ?) AND is_active = 1 AND (expiry_date IS NULL OR expiry_date >= CURDATE())",
      [code, courseId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid or expired coupon code" }, { status: 400 });
    }

    const coupon = rows[0];
    return NextResponse.json({
      success: true,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      code: coupon.code
    });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
