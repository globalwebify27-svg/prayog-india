import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";
import { generateReceipt } from "@/lib/pdf";

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // 'installment' or 'full'
    const id = searchParams.get("id");

    if (!type || !id) {
      return NextResponse.json({ error: "Missing type or id" }, { status: 400 });
    }

    let receiptUrl = null;
    let paymentData = {};
    let dbTable = type === "installment" ? "installments" : "enrollments";

    if (type === "installment") {
      const [rows] = await pool.query(`
        SELECT 
          i.id as receiptId,
          i.amount,
          i.paid_at,
          i.receipt_url,
          e.total_amount as originalAmount,
          c.title as courseName,
          c.type as mode,
          u.name as studentName,
          u.email as studentEmail,
          u.phone as studentPhone,
          b.name as batchName,
          (SELECT COUNT(*) FROM installments i2 WHERE i2.enrollment_id = e.id AND i2.id <= i.id) as installmentNo,
          (SELECT COUNT(*) FROM installments i3 WHERE i3.enrollment_id = e.id) as totalInstallments
        FROM installments i
        JOIN enrollments e ON i.enrollment_id = e.id
        JOIN courses c ON e.course_id = c.id
        LEFT JOIN batches b ON e.batch_id = b.id
        JOIN users u ON e.user_id = u.id
        WHERE i.id = ? AND e.user_id = ? AND i.status = 'paid'
      `, [id, userId]);

      if (rows.length === 0) {
        return NextResponse.json({ error: "Payment not found or not paid" }, { status: 404 });
      }

      paymentData = rows[0];
      receiptUrl = paymentData.receipt_url;

    } else if (type === "full") {
      const [rows] = await pool.query(`
        SELECT 
          e.id as receiptId,
          e.total_amount as amount,
          e.enrolled_at as paid_at,
          e.receipt_url,
          c.price as originalAmount,
          c.title as courseName,
          c.type as mode,
          u.name as studentName,
          u.email as studentEmail,
          u.phone as studentPhone,
          b.name as batchName
        FROM enrollments e
        JOIN courses c ON e.course_id = c.id
        LEFT JOIN batches b ON e.batch_id = b.id
        JOIN users u ON e.user_id = u.id
        WHERE e.id = ? AND e.user_id = ? AND e.payment_status = 'paid'
      `, [id, userId]);

      if (rows.length === 0) {
        return NextResponse.json({ error: "Payment not found or not paid" }, { status: 404 });
      }

      paymentData = rows[0];
      receiptUrl = paymentData.receipt_url;
      paymentData.installmentNo = "Full";
    }

    if (!receiptUrl) {
      // Generate new receipt
      receiptUrl = await generateReceipt({
        studentName: paymentData.studentName,
        studentEmail: paymentData.studentEmail,
        studentPhone: paymentData.studentPhone,
        courseName: paymentData.courseName,
        batchName: paymentData.batchName,
        mode: paymentData.mode,
        amount: paymentData.amount,
        originalAmount: paymentData.originalAmount,
        discountAmount: 0,
        couponCode: null,
        installmentNo: paymentData.installmentNo,
        totalInstallments: paymentData.totalInstallments,
        date: new Date(paymentData.paid_at || Date.now()).toLocaleDateString(),
        receiptId: `receipt_${paymentData.receiptId}`,
        paymentMethod: "Online",
      });

      // Update database
      await pool.query(`UPDATE ${dbTable} SET receipt_url = ? WHERE id = ?`, [receiptUrl, id]);
    }

    // Redirect to the URL
    const origin = new URL(request.url).origin;
    const finalUrl = receiptUrl.startsWith("http") ? receiptUrl : new URL(receiptUrl, origin).toString();
    return NextResponse.redirect(finalUrl);
  } catch (error) {
    console.error("Receipt Download Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
