import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import pool from "@/lib/db";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_mock",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "mock_secret",
});

export async function POST(req) {
  try {
    const { course_id, coupon_code, isInstallment } = await req.json();

    if (!course_id) {
      return NextResponse.json({ success: false, message: "Course ID is required" }, { status: 400 });
    }

    // 1. Fetch Course Details
    const [courseRows] = await pool.query("SELECT * FROM courses WHERE id = ?", [course_id]);
    if (courseRows.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid course selected" }, { status: 400 });
    }
    const course = courseRows[0];
    let amount = Number(course.price);

    // 2. Handle Coupon Code
    if (coupon_code) {
      const [couponRows] = await pool.query(
        "SELECT * FROM promo_codes WHERE code = ? AND (course_id IS NULL OR course_id = ?) AND is_active = 1 AND (expiry_date IS NULL OR expiry_date >= CURDATE())",
        [coupon_code, course_id]
      );
      if (couponRows.length > 0) {
        const coupon = couponRows[0];
        if (coupon.discount_type === 'percentage') {
          amount = amount - (amount * (Number(coupon.discount_value) / 100));
        } else {
          amount = amount - Number(coupon.discount_value);
        }
      }
    }

    // 3. Calculate Installment Amount if applicable
    let payAmount = amount;
    if (isInstallment && course.allow_partial_payment) {
      const count = course.installments_count || 1;
      payAmount = Math.round((amount / count) * 100) / 100;
    }

    payAmount = Math.round(payAmount); // Ensure it's an integer for safety

    if (payAmount < 1) {
      return NextResponse.json({ success: false, message: "Invalid final amount. Minimum is 1 INR." }, { status: 400 });
    }

    // 4. Create Razorpay Order
    const options = {
      amount: payAmount * 100, // Razorpay works in paise
      currency: "INR",
      receipt: `receipt_reg_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });

  } catch (error) {
    console.error("Razorpay Order Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
