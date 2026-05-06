import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email, phone, password, course, mode, batch, amount = 15000, isInstallment } = await req.json();

    // Check if user already exists
    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return NextResponse.json({ success: false, message: "Email already registered" }, { status: 400 });
    }

    // 1. Hash Password
    const hashedPassword = await bcrypt.hash(password || "Prayog@2026", 10);

    // 2. Create User
    const [userResult] = await pool.execute(
      "INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, 'student')",
      [name, email, hashedPassword, phone]
    );
    const userId = userResult.insertId;

    // Resolve Course ID
    let [courseRows] = await pool.execute("SELECT id FROM courses WHERE title = ? AND type = ?", [course, mode.toLowerCase()]);
    let courseId;
    if (courseRows.length === 0) {
        const [courseInsert] = await pool.execute("INSERT INTO courses (title, price, type) VALUES (?, ?, ?)", [course, amount, mode.toLowerCase()]);
        courseId = courseInsert.insertId;
    } else {
        courseId = courseRows[0].id;
    }

    // Resolve Batch ID
    let [batchRows] = await pool.execute("SELECT id FROM batches WHERE name = ? AND course_id = ?", [batch, courseId]);
    let batchId;
    if (batchRows.length === 0) {
        const [batchInsert] = await pool.execute("INSERT INTO batches (course_id, name, type) VALUES (?, ?, ?)", [courseId, batch, mode.toLowerCase()]);
        batchId = batchInsert.insertId;
    } else {
        batchId = batchRows[0].id;
    }

    // 3. Create Enrollment
    const [enrollResult] = await pool.execute(
      "INSERT INTO enrollments (user_id, course_id, batch_id, total_amount, payment_status) VALUES (?, ?, ?, ?, ?)",
      [userId, courseId, batchId, amount, isInstallment ? 'partial' : 'pending']
    );
    const enrollmentId = enrollResult.insertId;

    // 4. Create Installments if applicable
    if (isInstallment) {
      const installmentAmount = amount / 3;
      const dueDates = [
        new Date(), // Today
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 month
        new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)  // 2 months
      ];

      for (let i = 0; i < 3; i++) {
        await pool.execute(
          "INSERT INTO installments (enrollment_id, amount, due_date, status) VALUES (?, ?, ?, ?)",
          [enrollmentId, installmentAmount, dueDates[i], i === 0 ? 'paid' : 'pending']
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
