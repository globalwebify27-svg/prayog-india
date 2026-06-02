import { NextResponse } from "next/server";
import crypto from "crypto";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { sendMail, getOnboardingEmailTemplate } from "@/lib/mailer";
import { generateReceipt } from "@/lib/pdf";

export async function POST(req) {
  try {
    const { 
      // Razorpay details
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      // User/Registration details
      name, email, phone, emergency_contact, password, course_id, mode, batch, batch_id, isInstallment, payment_method, coupon_code 
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ success: false, message: "Missing payment signature" }, { status: 400 });
    }

    let isFreeEnrollment = false;

    // 1. Verify Razorpay Signature (or check for free enrollment)
    if (razorpay_order_id === "FREE_ENROLLMENT") {
      isFreeEnrollment = true;
    } else {
      const bodyText = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "mock_secret")
        .update(bodyText.toString())
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return NextResponse.json({ success: false, message: "Invalid payment signature" }, { status: 400 });
      }
    }

    // 2. Fetch Course Details (Price, Installments)
    const [courseRows] = await pool.query("SELECT * FROM courses WHERE id = ?", [course_id]);
    if (courseRows.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid course selected" }, { status: 400 });
    }
    const course = courseRows[0];
    let amount = Number(course.price);

    // 3. Handle Coupon Code
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

    let initialPaymentAmount = amount;
    if (isInstallment && course.allow_partial_payment) {
      const count = course.installments_count || 1;
      initialPaymentAmount = Math.round((amount / count) * 100) / 100;
    }
    initialPaymentAmount = Math.round(initialPaymentAmount);

    // Security Check: If it claims to be free, ensure the calculated amount is actually 0 or less
    if (isFreeEnrollment && initialPaymentAmount >= 1) {
       return NextResponse.json({ success: false, message: "Security Error: Course is not free." }, { status: 403 });
    }

    // 4. Create User
    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    let userId;
    
    if (existing.length > 0) {
      userId = existing[0].id;
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
          "UPDATE users SET name = ?, password = ?, phone = ?, emergency_contact = ? WHERE id = ?",
          [name, hashedPassword, phone, emergency_contact || null, userId]
        );
      } else {
        await pool.query(
          "UPDATE users SET name = ?, phone = ?, emergency_contact = ? WHERE id = ?",
          [name, phone, emergency_contact || null, userId]
        );
      }
    } else {
      const hashedPassword = await bcrypt.hash(password || "Prayog@2026", 10);
      const [userResult] = await pool.execute(
        "INSERT INTO users (name, email, password, phone, emergency_contact, role) VALUES (?, ?, ?, ?, ?, 'student')",
        [name, email, hashedPassword, phone, emergency_contact || null]
      );
      userId = userResult.insertId;
    }

    // 5. Resolve Batch
    let finalBatchId = batch_id;
    let finalBatchName = "Online Session";
    
    if (finalBatchId) {
      const [batchRows] = await pool.execute("SELECT name FROM batches WHERE id = ?", [finalBatchId]);
      if (batchRows.length > 0) {
        finalBatchName = batchRows[0].name;
      }
    } else {
      // Fallback for older payloads or missing batch_id
      let fallbackBatch = batch || 'Default Batch';
      let [batchRows] = await pool.execute("SELECT id FROM batches WHERE name = ? AND course_id = ?", [fallbackBatch, course_id]);
      if (batchRows.length === 0) {
          const [batchInsert] = await pool.execute("INSERT INTO batches (course_id, name, type) VALUES (?, ?, ?)", [course_id, fallbackBatch, mode ? mode.toLowerCase() : 'offline']);
          finalBatchId = batchInsert.insertId;
      } else {
          finalBatchId = batchRows[0].id;
      }
      finalBatchName = fallbackBatch;
    }

    // 6. Create Enrollment
    const [enrollResult] = await pool.execute(
      "INSERT INTO enrollments (user_id, course_id, batch_id, total_amount, payment_status, payment_method, amount_paid, coupon_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [userId, course_id, finalBatchId, amount, isInstallment ? 'partial' : 'paid', payment_method || 'online', initialPaymentAmount, coupon_code || null]
    );
    const enrollmentId = enrollResult.insertId;

    // 7. Create Installments
    const installmentData = [];
    if (isInstallment && course.allow_partial_payment) {
      const count = course.installments_count || 1;
      const installmentAmount = Math.round((amount / count) * 100) / 100;
      
      for (let i = 0; i < count; i++) {
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + i);
        
        installmentData.push({ amount: installmentAmount, dueDate });

        // First installment is paid now
        await pool.execute(
          "INSERT INTO installments (enrollment_id, amount, due_date, status, payment_method, paid_at) VALUES (?, ?, ?, ?, ?, ?)",
          [enrollmentId, installmentAmount, dueDate, i === 0 ? 'paid' : 'pending', i === 0 ? (payment_method || 'online') : 'online', i === 0 ? new Date() : null]
        );
      }
    } else {
      // Full Payment (Single Installment)
      const dueDate = new Date();
      installmentData.push({ amount, dueDate });
      await pool.execute(
        "INSERT INTO installments (enrollment_id, amount, due_date, status, payment_method, paid_at) VALUES (?, ?, ?, ?, ?, ?)",
        [enrollmentId, amount, dueDate, 'paid', payment_method || 'online', new Date()]
      );
    }

    // 8. Generate Receipt PDF
    let receiptUrl = null;
    try {
      receiptUrl = await generateReceipt({
        studentName: name,
        studentEmail: email,
        studentPhone: phone,
        courseName: course.title,
        batchName: finalBatchName,
        mode: mode,
        amount: initialPaymentAmount,
        originalAmount: Number(course.price),
        discountAmount: Number(course.price) - amount,
        couponCode: coupon_code || null,
        installmentNo: isInstallment ? 1 : "Full",
        totalInstallments: isInstallment ? (course.installments_count || 1) : null,
        date: new Date().toDateString(),
        receiptId: razorpay_payment_id,
        paymentMethod: payment_method || "online",
      });
      
      // Update receipt URL on enrollment
      await pool.query("UPDATE enrollments SET receipt_url = ? WHERE id = ?", [receiptUrl, enrollmentId]);
    } catch (e) {
      console.error("Failed to generate receipt:", e);
    }

    // 9. Send Welcome Email
    try {
      const passwordMessage = "[Hidden for Security - Use the password you entered, or Prayog@2026 if left blank]";
      const emailHtml = getOnboardingEmailTemplate(
        name, 
        email, 
        passwordMessage,
        course.title,
        batch,
        payment_method || 'online',
        initialPaymentAmount, // Show the amount just paid
        installmentData
      );

      const path = require('path');
      const attachments = [];
      if (receiptUrl) {
        const fullPath = path.join(process.cwd(), "public", receiptUrl);
        attachments.push({ filename: `Receipt_${razorpay_payment_id}.pdf`, path: fullPath });
      }

      await sendMail(email, "Welcome to Prayog India - Registration Confirmed", emailHtml, attachments);
    } catch (mailError) {
      console.error("Failed to send onboarding mail:", mailError);
    }

    return NextResponse.json({ 
      success: true, 
      message: "Registration and payment verified successfully",
      enrollmentId 
    });

  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
