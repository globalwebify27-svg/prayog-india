import pool from "../lib/db.js";
import dotenv from "dotenv";
dotenv.config();

// Re-creating pool to ensure env is loaded
import mysql from "mysql2/promise";
const checkPool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

async function check() {
  try {
    const [columns] = await checkPool.query("SHOW COLUMNS FROM enrollments");
    console.log("Enrollments Columns:", columns.map(c => c.Field));
    
    const [students] = await checkPool.query("SELECT COUNT(*) as count FROM users WHERE role = 'student'");
    console.log("Students Count:", students[0].count);

    const [enrollments] = await checkPool.query("SELECT COUNT(*) as count FROM enrollments");
    console.log("Total Enrollments:", enrollments[0].count);

    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

check();
