import dotenv from "dotenv";
dotenv.config();
import pool from '../lib/db.js';

async function setup() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS promo_codes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        discount_type ENUM('percentage', 'fixed') DEFAULT 'percentage',
        discount_value DECIMAL(10, 2) NOT NULL,
        course_id INT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        expiry_date DATE NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
      )
    `);
    console.log("promo_codes table ready.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
setup();
