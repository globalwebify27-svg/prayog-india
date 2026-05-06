import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { enrollmentId } = await req.json();

    if (!enrollmentId) {
      return NextResponse.json({ error: "Enrollment ID is required" }, { status: 400 });
    }

    // Update enrollment status to paid
    await pool.query(
      "UPDATE enrollments SET payment_status = 'paid', amount_paid = total_amount WHERE id = ?",
      [enrollmentId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Payment confirmation error:", error);
    return NextResponse.json({ error: "Failed to confirm payment" }, { status: 500 });
  }
}
