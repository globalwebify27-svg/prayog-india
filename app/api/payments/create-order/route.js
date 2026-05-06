import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import pool from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_mock",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "mock_secret",
});

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    const { amount, enrollmentId } = await req.json();

    if (!amount || amount < 1) {
      return NextResponse.json({ success: false, message: "Invalid amount. Minimum is 1 INR." }, { status: 400 });
    }

    const options = {
      amount: amount * 100, // Razorpay works in paise
      currency: "INR",
      receipt: `receipt_enr_${enrollmentId}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });

  } catch (error) {
    console.error("Razorpay Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
