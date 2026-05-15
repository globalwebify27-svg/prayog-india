import pool from "../lib/db.js";

async function checkLogo() {
  try {
    const [rows] = await pool.query("SELECT logo_url FROM site_settings WHERE id = 1");
    console.log("Current Logo URL in DB:", rows[0]?.logo_url);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkLogo();
