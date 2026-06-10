import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { cookies } from "next/headers";
export const dynamic = 'force-dynamic';
import jwt from "jsonwebtoken";

async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return false;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback");
    return decoded && decoded.role === 'admin';
  } catch {
    return false;
  }
}

export async function GET() {
  if (!await verifyAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    // Check if table exists, create if not
    await pool.query(`
      CREATE TABLE IF NOT EXISTS promo_codes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        discount_type ENUM('percentage', 'fixed') DEFAULT 'percentage',
        discount_value DECIMAL(10, 2) NOT NULL,
        course_id INT NULL,
        course_ids JSON DEFAULT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        expiry_date DATE NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
      )
    `);

    // Safely add course_ids column if it doesn't exist for older tables
    try {
      await pool.query('ALTER TABLE promo_codes ADD COLUMN course_ids JSON DEFAULT NULL');
    } catch (err) {
      // Ignore if it already exists
    }

    // Automatically deactivate expired coupons
    await pool.query(`
      UPDATE promo_codes 
      SET is_active = 0 
      WHERE expiry_date IS NOT NULL AND expiry_date < CURDATE() AND is_active = 1
    `);

    const [rows] = await pool.query(`
      SELECT p.*, c.title as course_title 
      FROM promo_codes p
      LEFT JOIN courses c ON p.course_id = c.id
      ORDER BY p.created_at DESC
    `);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  if (!await verifyAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { code, discount_type, discount_value, course_ids, is_active, expiry_date } = body;

    let formattedExpiry = null;
    if (expiry_date) {
      const d = new Date(expiry_date);
      if (!isNaN(d.getTime())) {
        formattedExpiry = d.toISOString().split('T')[0];
      }
    }

    const jsonCourseIds = Array.isArray(course_ids) && course_ids.length > 0 ? JSON.stringify(course_ids) : null;

    const [result] = await pool.query(
      `INSERT INTO promo_codes (code, discount_type, discount_value, course_ids, is_active, expiry_date) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        code,
        discount_type || 'percentage',
        discount_value,
        jsonCourseIds,
        is_active === undefined ? true : is_active,
        formattedExpiry
      ]
    );

    return NextResponse.json({ id: result.insertId, message: "Coupon created successfully" });
  } catch (error) {
    console.error("POST Coupon Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  if (!await verifyAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { id, code, discount_type, discount_value, course_ids, is_active, expiry_date } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    let formattedExpiry = null;
    if (expiry_date) {
      const d = new Date(expiry_date);
      if (!isNaN(d.getTime())) {
        formattedExpiry = d.toISOString().split('T')[0];
      }
    }

    const jsonCourseIds = Array.isArray(course_ids) && course_ids.length > 0 ? JSON.stringify(course_ids) : null;

    let finalIsActive = is_active === undefined ? true : is_active;
    if (formattedExpiry) {
      const today = new Date();
      today.setHours(0,0,0,0);
      const expiry = new Date(formattedExpiry);
      // If the expiry date is in the future, automatically reactivate the coupon
      if (expiry >= today) {
        finalIsActive = is_active !== undefined ? is_active : true;
        // Specifically force active status to true if extending an expired coupon
        if (is_active === undefined || is_active === false) {
          finalIsActive = true; 
        }
      } else {
        // If the expiry date is still in the past, keep it inactive
        finalIsActive = false;
      }
    }

    await pool.query(
      `UPDATE promo_codes SET 
        code = ?, discount_type = ?, discount_value = ?, 
        course_ids = ?, is_active = ?, expiry_date = ?
       WHERE id = ?`,
      [
        code,
        discount_type || 'percentage',
        discount_value,
        jsonCourseIds,
        finalIsActive,
        formattedExpiry,
        id
      ]
    );

    return NextResponse.json({ message: "Coupon updated successfully" });
  } catch (error) {
    console.error("PUT Coupon Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  if (!await verifyAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await pool.query("DELETE FROM promo_codes WHERE id = ?", [id]);
    return NextResponse.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
