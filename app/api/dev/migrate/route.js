import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    // Add missing columns if they don't exist
    const columnsToAdd = [
      { name: "dob", type: "DATE" },
      { name: "address", type: "TEXT" },
      { name: "blood_group", type: "VARCHAR(5)" },
      { name: "emergency_contact", type: "VARCHAR(20)" }
    ];

    for (const col of columnsToAdd) {
      try {
        await pool.query(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`);
        console.log(`Added column ${col.name}`);
      } catch (err) {
        // Ignore "column already exists" errors (Error 1060)
        if (err.errno !== 1060 && err.code !== 'ER_DUP_FIELDNAME') {
          throw err;
        }
      }
    }
    
    // Create notices table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        target_role ENUM('all', 'student', 'teacher') DEFAULT 'all',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Notices table verified/created");

    // Create/Update workshops table for Case Studies
    await pool.query(`
      CREATE TABLE IF NOT EXISTS workshops (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(255),
        video_url VARCHAR(255),
        date DATE,
        location VARCHAR(255),
        category VARCHAR(100) DEFAULT 'Industrial',
        client_name VARCHAR(255),
        content JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const workshopColumns = [
      { name: "category", type: "VARCHAR(100) DEFAULT 'Industrial'" },
      { name: "client_name", type: "VARCHAR(255)" },
      { name: "content", type: "JSON" }
    ];

    for (const col of workshopColumns) {
      try {
        await pool.query(`ALTER TABLE workshops ADD COLUMN ${col.name} ${col.type}`);
      } catch (err) {
        if (err.errno !== 1060 && err.code !== 'ER_DUP_FIELDNAME') {
          console.error(`Error adding column ${col.name}:`, err);
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: "Database migration successful. Workshops table upgraded for Case Studies." 
    });
  } catch (error) {
    console.error("Migration failed:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Migration failed: " + error.message 
    }, { status: 500 });
  }
}
