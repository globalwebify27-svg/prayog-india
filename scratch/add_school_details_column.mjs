import pool from "../lib/db.js";

async function addSchoolDetailsColumns() {
  try {
    console.log("Adding school_id_number column to users table...");
    
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS school_id_number VARCHAR(100) AFTER school_id_card
    `);

    console.log("Column added successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Failed to add column:", err);
    process.exit(1);
  }
}

addSchoolDetailsColumns();
