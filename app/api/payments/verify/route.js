import { NextResponse } from "next/server";
import crypto from "crypto";
import pool from "@/lib/db";
import { generateReceipt } from "@/lib/pdf";

export async function POST(req) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      enrollmentId,
      amount,
      installmentId 
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ success: false, message: "Missing payment fields" }, { status: 400 });
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Signature is valid
      // 1. Update Installment Status if applicable
      if (installmentId) {
        await pool.query(
          "UPDATE installments SET status = 'paid', paid_at = NOW() WHERE id = ?",
          [installmentId]
        );
      }

      // 2. Update Enrollment amount_paid
      await pool.query(
        "UPDATE enrollments SET amount_paid = amount_paid + ? WHERE id = ?",
        [amount, enrollmentId]
      );

      // 3. Generate PDF Receipt
      const [studentRows] = await pool.query(`
        SELECT u.name, u.email, u.phone, c.title as course_name, c.price as course_price,
               b.name as batch_name, b.type as mode, e.payment_method, e.total_amount, e.coupon_code
        FROM users u 
        JOIN enrollments e ON e.user_id = u.id 
        JOIN courses c ON e.course_id = c.id
        LEFT JOIN batches b ON e.batch_id = b.id
        WHERE e.id = ?
      `, [enrollmentId]);
      
      const student = studentRows[0] || {};
      const studentName = student.name || "Student";
      const studentEmail = student.email;

      // Find installment number
      const [instRows] = await pool.query(
        "SELECT COUNT(*) as cnt FROM installments WHERE enrollment_id = ? AND status = 'paid'",
        [enrollmentId]
      );
      const [totalRows] = await pool.query(
        "SELECT COUNT(*) as cnt FROM installments WHERE enrollment_id = ?",
        [enrollmentId]
      );
      const installmentNo = instRows[0]?.cnt || 1;
      const totalInstallments = totalRows[0]?.cnt || null;

      const receiptUrl = await generateReceipt({
        studentName,
        studentEmail,
        studentPhone: student.phone,
        courseName: student.course_name,
        batchName: student.batch_name,
        mode: student.mode,
        amount,
        originalAmount: Number(student.course_price),
        discountAmount: Number(student.course_price) - Number(student.total_amount),
        couponCode: student.coupon_code || null,
        installmentNo: installmentId ? installmentNo : "Full",
        totalInstallments: installmentId ? totalInstallments : null,
        date: new Date().toDateString(),
        receiptId: razorpay_payment_id,
        paymentMethod: student.payment_method || "online",
      });

      // 4. Save receipt URL
      if (installmentId) {
        await pool.query("UPDATE installments SET receipt_url = ? WHERE id = ?", [receiptUrl, installmentId]);
      } else {
        await pool.query("UPDATE enrollments SET receipt_url = ?, payment_status = 'paid' WHERE id = ?", [receiptUrl, enrollmentId]);
      }

      // 5. Send Email with Receipt
      if (studentEmail) {
        const path = require('path');
        const fullPath = path.join(process.cwd(), "public", receiptUrl);
        
        const { sendMail } = require('@/lib/mailer');
        await sendMail(
          studentEmail,
          "Payment Received - Prayog India",
          `
            <div style="font-family: sans-serif; padding: 20px;">
              <h2 style="color: #0f172a;">Payment Confirmation</h2>
              <p>Dear ${studentName},</p>
              <p>We have successfully received your payment of <strong>INR ${amount}</strong>.</p>
              <p>Your official fee receipt is attached to this email.</p>
              <br/>
              <p>Best Regards,<br/>Prayog India Team</p>
            </div>
          `,
          [{
            filename: `Receipt_${razorpay_payment_id}.pdf`,
            path: fullPath
          }]
        );
      }

      return NextResponse.json({ 
        success: true, 
        message: "Payment verified successfully",
        receiptUrl 
      });
    } else {
      return NextResponse.json({ success: false, message: "Invalid payment signature" }, { status: 400 });
    }
  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
