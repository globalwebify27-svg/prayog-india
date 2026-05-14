import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    // Ensure table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS internships (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        location VARCHAR(255),
        duration VARCHAR(100),
        stipend VARCHAR(100),
        slots VARCHAR(100),
        description TEXT,
        perks JSON,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const [rows] = await pool.query("SELECT * FROM internships WHERE is_active = TRUE ORDER BY created_at DESC");
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, company, location, duration, stipend, slots, description, perks } = body;
    
    const [result] = await pool.query(
      "INSERT INTO internships (title, company, location, duration, stipend, slots, description, perks) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [title, company, location, duration, stipend, slots, description, JSON.stringify(perks || [])]
    );
    
    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, title, company, location, duration, stipend, slots, description, perks, is_active } = body;
    
    await pool.query(
      "UPDATE internships SET title=?, company=?, location=?, duration=?, stipend=?, slots=?, description=?, perks=?, is_active=? WHERE id=?",
      [title, company, location, duration, stipend, slots, description, JSON.stringify(perks || []), is_active, id]
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    await pool.query("DELETE FROM internships WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
