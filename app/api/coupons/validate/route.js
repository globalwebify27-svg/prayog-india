import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req) {
  try {
    const { code, courseId } = await req.json();

    if (!code) {
      return NextResponse.json({ success: false, message: "Code is required" }, { status: 400 });
    }

    // 1. Find if the coupon code exists and is active
    const [rows] = await pool.query(
      "SELECT * FROM promo_codes WHERE code = ? AND is_active = 1",
      [code]
    );

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid coupon code" }, { status: 400 });
    }

    const coupon = rows[0];

    // 2. Check if coupon is expired
    if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date(new Date().setHours(0,0,0,0))) {
      return NextResponse.json({ success: false, message: "Coupon expired" }, { status: 400 });
    }

    // 3. Check if coupon is applicable for this course
    const courseMatch = !coupon.course_ids && !coupon.course_id;
    const courseIdsArray = coupon.course_ids ? (typeof coupon.course_ids === 'string' ? JSON.parse(coupon.course_ids) : coupon.course_ids) : [];
    const isApplicable = courseMatch || courseIdsArray.includes(Number(courseId)) || Number(coupon.course_id) === Number(courseId);

    if (!isApplicable) {
      return NextResponse.json({ success: false, message: "This coupon is not applicable for this program" }, { status: 400 });
    }
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
