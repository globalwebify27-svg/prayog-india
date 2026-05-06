import pool from "../lib/db.js";
import bcrypt from "bcryptjs";

async function seedStudents() {
  try {
    console.log("Seeding demo students...");

    const password = await bcrypt.hash("password123", 10);
    const students = [
      { name: "Rahul Sharma", email: "rahul@example.com", phone: "9876543210" },
      { name: "Priya Patel", email: "priya@example.com", phone: "9876543211" },
      { name: "Amit Kumar", email: "amit@example.com", phone: "9876543212" },
      { name: "Sneha Reddy", email: "sneha@example.com", phone: "9876543213" },
      { name: "Vikram Singh", email: "vikram@example.com", phone: "9876543214" }
    ];

    // 1. Fetch some courses to enroll them in
    const [courses] = await pool.query("SELECT id, price FROM courses LIMIT 3");
    if (courses.length === 0) {
      console.error("No courses found. Please seed courses first.");
      process.exit(1);
    }

    for (const s of students) {
      // Create Student
      const [userResult] = await pool.query(
        "INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, 'student', ?)",
        [s.name, s.email, password, s.phone]
      );
      const userId = userResult.insertId;

      // Enroll in a random course
      const course = courses[Math.floor(Math.random() * courses.length)];
      const [enrollResult] = await pool.query(
        "INSERT INTO enrollments (user_id, course_id, total_amount, amount_paid, payment_status) VALUES (?, ?, ?, ?, ?)",
        [userId, course.id, course.price, 5000, 'partial']
      );
      const enrollmentId = enrollResult.insertId;

      // Create Installments
      await pool.query(
        "INSERT INTO installments (enrollment_id, amount, due_date, status) VALUES (?, ?, DATE_ADD(CURDATE(), INTERVAL 1 MONTH), 'pending')",
        [enrollmentId, (course.price - 5000) / 2]
      );

      // Add dummy attendance
      await pool.query(
        "INSERT INTO attendance (user_id, course_id, date, type, status) VALUES (?, ?, CURDATE(), 'offline', 'present')",
        [userId, course.id]
      );
    }

    console.log("Demo students seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seedStudents();
