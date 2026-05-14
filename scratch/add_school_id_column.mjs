import pool from "../lib/db.js";

async function addSchoolIdColumn() {
  try {
    console.log("Adding school_id_card column to users table...");
    
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS school_id_card VARCHAR(255) AFTER id_image
    `);

    console.log("Column added successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Failed to add column:", err);
    process.exit(1);
  }
}

addSchoolIdColumn();
