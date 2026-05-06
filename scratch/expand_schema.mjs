import pool from "../lib/db.js";

async function expandSchema() {
  try {
    console.log("Expanding database schema...");

    // 1. Enquiries Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS enquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        course VARCHAR(255),
        message TEXT,
        status ENUM('pending', 'contacted', 'closed') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Faculties Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS faculties (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(100),
        specialty VARCHAR(100),
        image VARCHAR(255),
        bio TEXT,
        expertise JSON,
        education VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. Testimonials Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        course VARCHAR(255),
        year VARCHAR(10),
        content TEXT,
        video_url VARCHAR(255),
        thumbnail VARCHAR(255),
        rating INT DEFAULT 5,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 4. Gallery Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS gallery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        category VARCHAR(100),
        image_url VARCHAR(255) NOT NULL,
        location VARCHAR(255),
        event_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 5. Workshops/Stories Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS workshops (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(255),
        video_url VARCHAR(255),
        date DATE,
        location VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 6. Partners Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS partners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        logo VARCHAR(255),
        type ENUM('ranking', 'placement', 'industrial') DEFAULT 'industrial',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Database expansion successful!");
    process.exit(0);
  } catch (err) {
    console.error("Database expansion failed:", err);
    process.exit(1);
  }
}

expandSchema();
