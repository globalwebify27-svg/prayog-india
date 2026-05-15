import pool from "../lib/db.js";

async function updateSchema() {
  try {
    // Add payment_method to enrollments
    await pool.query(`
      ALTER TABLE enrollments 
      ADD COLUMN IF NOT EXISTS payment_method ENUM('online', 'cash', 'bank_transfer') DEFAULT 'online' AFTER payment_status
    `);
    
    // Also add to installments for tracking individual payments
    await pool.query(`
      ALTER TABLE installments 
      ADD COLUMN IF NOT EXISTS payment_method ENUM('online', 'cash', 'bank_transfer') DEFAULT 'online' AFTER status
    `);
    
    console.log("Schema updated successfully: payment_method added to enrollments and installments.");
    process.exit(0);
  } catch (error) {
    console.error("Schema Update Error:", error);
    process.exit(1);
  }
}

updateSchema();
