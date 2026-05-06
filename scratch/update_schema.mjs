import pool from "../lib/db.js";

async function updateSchema() {
  try {
    console.log("Updating courses table schema...");
    
    // Add missing columns to courses table
    await pool.query(`
      ALTER TABLE courses 
      ADD COLUMN IF NOT EXISTS category VARCHAR(100) AFTER title,
      ADD COLUMN IF NOT EXISTS level VARCHAR(50) AFTER category,
      ADD COLUMN IF NOT EXISTS rating DECIMAL(3, 1) DEFAULT 4.5 AFTER price
    `);

    console.log("Schema update successful!");
    process.exit(0);
  } catch (err) {
    console.error("Schema update failed:", err);
    process.exit(1);
  }
}

updateSchema();
