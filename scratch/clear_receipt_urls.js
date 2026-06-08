import pool from "../lib/db.js";

async function clearReceiptUrls() {
  try {
    console.log("Connecting to database...");
    const [res1] = await pool.query("UPDATE enrollments SET receipt_url = NULL");
    console.log("Cleared enrollments receipt_url:", res1.affectedRows, "rows.");

    const [res2] = await pool.query("UPDATE installments SET receipt_url = NULL");
    console.log("Cleared installments receipt_url:", res2.affectedRows, "rows.");

    console.log("Database reset complete. All future invoice downloads will generate the new QR-free template.");
    process.exit(0);
  } catch (error) {
    console.error("Database reset error:", error);
    process.exit(1);
  }
}

clearReceiptUrls();
