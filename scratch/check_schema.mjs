import pool from "../lib/db.js";

async function checkSchema() {
  try {
    const [rows] = await pool.query("DESCRIBE enrollments");
    console.log("Enrollments Table Schema:", rows);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkSchema();
