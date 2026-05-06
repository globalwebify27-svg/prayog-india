import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, email, phone, studentClass, batchId } = await req.json();

    if (!name || !email || !phone || !studentClass || !batchId) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // 1. Check if the batch is full
    const [counts] = await pool.query(`
      SELECT COUNT(id) as count 
      FROM enrollments 
      WHERE batch_id = ? AND payment_status = 'paid'
    `, [batchId]);

    if (counts[0].count >= 60) {
      return NextResponse.json({ error: "Batch is full" }, { status: 400 });
    }

    // 2. Find or Create User
    const [users] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    let userId;
    if (users.length > 0) {
      userId = users[0].id;
      // Update phone and class
      await pool.query(
        "UPDATE users SET phone = ?, student_class = ? WHERE id = ?",
        [phone, studentClass, userId]
      );
    } else {
      // Create user with a dummy password since they are just registering for camp
      const [result] = await pool.query(
        "INSERT INTO users (name, email, phone, student_class, password, role) VALUES (?, ?, ?, ?, ?, ?)",
        [name, email, phone, studentClass, 'guest_password_123', 'student']
      );
      userId = result.insertId;
    }

    // 3. Get Course ID for Summer Camp
    const [courses] = await pool.query("SELECT course_id FROM batches WHERE id = ?", [batchId]);
    if (courses.length === 0) {
      return NextResponse.json({ error: "Invalid batch" }, { status: 400 });
    }
    const courseId = courses[0].course_id;

    // 4. Create Enrollment (pending payment)
    // Check if already enrolled
    const [existingEnrollment] = await pool.query(
      "SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?",
      [userId, courseId]
    );

    let enrollmentId;
    if (existingEnrollment.length > 0) {
      enrollmentId = existingEnrollment[0].id;
      // Update batch and status if it was pending
      await pool.query(
        "UPDATE enrollments SET batch_id = ?, payment_status = 'pending' WHERE id = ?",
        [batchId, enrollmentId]
      );
    } else {
      const [enrollResult] = await pool.query(
        "INSERT INTO enrollments (user_id, course_id, batch_id, total_amount, payment_status) VALUES (?, ?, ?, ?, ?)",
        [userId, courseId, batchId, 2999, 'pending']
      );
      enrollmentId = enrollResult.insertId;
    }

    return NextResponse.json({ enrollmentId, success: true });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
