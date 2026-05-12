import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email, phone, emergency_contact, password, course_id, mode, batch, isInstallment, coupon_code } = await req.json();

    // Check if user already exists
    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return NextResponse.json({ success: false, message: "Email already registered" }, { status: 400 });
    }

    // 1. Fetch Course Details (Price, Installments)
    const [courseRows] = await pool.query("SELECT * FROM courses WHERE id = ?", [course_id]);
    if (courseRows.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid course selected" }, { status: 400 });
    }
    const course = courseRows[0];
    let amount = Number(course.price);

    // 1.5 Handle Coupon Code
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

    // 2. Hash Password
    const hashedPassword = await bcrypt.hash(password || "Prayog@2026", 10);

    // 3. Create User
    const [userResult] = await pool.execute(
      "INSERT INTO users (name, email, password, phone, emergency_contact, role) VALUES (?, ?, ?, ?, ?, 'student')",
      [name, email, hashedPassword, phone, emergency_contact]
    );
    const userId = userResult.insertId;

    // 4. Resolve/Create Batch
    let [batchRows] = await pool.execute("SELECT id FROM batches WHERE name = ? AND course_id = ?", [batch, course_id]);
    let batchId;
    if (batchRows.length === 0) {
        const [batchInsert] = await pool.execute("INSERT INTO batches (course_id, name, type) VALUES (?, ?, ?)", [course_id, batch, mode.toLowerCase()]);
        batchId = batchInsert.insertId;
    } else {
        batchId = batchRows[0].id;
    }

    // 5. Create Enrollment
    const [enrollResult] = await pool.execute(
      "INSERT INTO enrollments (user_id, course_id, batch_id, total_amount, payment_status) VALUES (?, ?, ?, ?, ?)",
      [userId, course_id, batchId, amount, isInstallment ? 'partial' : 'pending']
    );
    const enrollmentId = enrollResult.insertId;

    // 6. Create Installments if applicable
    if (isInstallment && course.allow_partial_payment) {
      const count = course.installments_count || 1;
      const installmentAmount = amount / count;
      
      for (let i = 0; i < count; i++) {
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + i);
        
        await pool.execute(
          "INSERT INTO installments (enrollment_id, amount, due_date, status) VALUES (?, ?, ?, ?)",
          [enrollmentId, installmentAmount, dueDate, i === 0 ? 'paid' : 'pending']
        );
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: "Registration successful. Please proceed to payment.",
      enrollmentId 
    });

  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
