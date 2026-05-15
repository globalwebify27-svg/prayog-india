import pool from "../lib/db.js";

async function updateSchema() {
  try {
    console.log("Creating site_settings table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id INT PRIMARY KEY DEFAULT 1,
        logo_url VARCHAR(255) DEFAULT '/assets/logo.png',
        footer_address TEXT,
        footer_phone VARCHAR(20),
        footer_email VARCHAR(255),
        facebook_url VARCHAR(255),
        youtube_url VARCHAR(255),
        linkedin_url VARCHAR(255),
        instagram_url VARCHAR(255),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CHECK (id = 1)
      )
    `);

    // Insert default values if not exists
    const [rows] = await pool.query("SELECT * FROM site_settings WHERE id = 1");
    if (rows.length === 0) {
      await pool.query(`
        INSERT INTO site_settings (
          id, logo_url, footer_address, footer_phone, footer_email, 
          facebook_url, youtube_url, linkedin_url, instagram_url
        ) VALUES (
          1, 
          '/assets/logo.png', 
          '1st Floor, City Centre, Club Road, Ranchi - 834001', 
          '+91 7033066338', 
          'info@prayogindiarobotics.com',
          'https://www.facebook.com/share/p/1CEiWdZKuo/',
          'https://youtube.com/@prayog_india?si=MZmuDauDOHqmmuzD',
          'https://www.linkedin.com/company/prayog-india-robotics/',
          'https://www.instagram.com/prayog_india?utm_source=qr&igsh=MWNtMXBjODlwMTJ5Zg=='
        )
      `);
      console.log("Default settings inserted.");
    } else {
      console.log("Settings already exist.");
    }

    console.log("Database updated successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error updating database:", error);
    process.exit(1);
  }
}

updateSchema();
