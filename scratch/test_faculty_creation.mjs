import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "prayog_india",
  socketPath: "/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock"
});

async function test() {
  try {
    const name = "Test Teacher";
    const email = "test_teacher_" + Date.now() + "@example.com";
    const password = "Password@123";
    const role = "Senior Faculty";
    const specialty = "Robotics";
    const image = "";
    const bio = "Test bio";
    const expertise = ["AI", "ML"];
    const education = "B.Tech";
    const selectedCourses = [1, 2]; // Assuming IDs 1 and 2 exist

    // 1. Create User
    const hashedPassword = await bcrypt.hash(password, 10);
    const [userResult] = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, 'teacher']
    );
    const userId = userResult.insertId;
    console.log("User created:", userId);

    // 2. Create Faculty record linked to User
    const [result] = await pool.query(
      "INSERT INTO faculties (name, role, specialty, image, bio, expertise, education, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [name, role, specialty, image, bio, JSON.stringify(expertise), education, userId]
    );
    console.log("Faculty created:", result.insertId);

    // 3. Assign courses to teacher
    if (selectedCourses && selectedCourses.length > 0) {
      const [updateResult] = await pool.query(
        "UPDATE courses SET teacher_id = ? WHERE id IN (?)",
        [userId, selectedCourses]
      );
      console.log("Courses updated:", updateResult.affectedRows);
    }

    console.log("Success!");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    process.exit();
  }
}

test();
