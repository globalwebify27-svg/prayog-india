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
      // Fetch student name and email for receipt
      const [studentRows] = await pool.query(`
        SELECT u.name, u.email FROM users u 
        JOIN enrollments e ON e.user_id = u.id 
        WHERE e.id = ?
      `, [enrollmentId]);
      
      const studentName = studentRows[0]?.name || "Student";
      const studentEmail = studentRows[0]?.email;
      const receiptUrl = await generateReceipt(
        studentName, 
        amount, 
        installmentId || "Full", 
        new Date().toDateString(), 
        razorpay_payment_id
      );

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
