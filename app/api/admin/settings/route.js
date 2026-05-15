import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM site_settings WHERE id = 1");
    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: "Settings not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, settings: rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const data = await req.json();
    const { 
      logo_url, footer_address, footer_phone, footer_email, 
      facebook_url, youtube_url, linkedin_url, instagram_url,
      training_title, training_description, training_image, training_features
    } = data;

    await pool.query(
      `UPDATE site_settings SET 
        logo_url = ?, footer_address = ?, footer_phone = ?, footer_email = ?, 
        facebook_url = ?, youtube_url = ?, linkedin_url = ?, instagram_url = ?,
        training_title = ?, training_description = ?, training_image = ?, training_features = ?
       WHERE id = 1`,
      [
        logo_url, footer_address, footer_phone, footer_email, 
        facebook_url, youtube_url, linkedin_url, instagram_url,
        training_title, training_description, training_image, training_features
      ]
    );

    return NextResponse.json({ success: true, message: "Settings updated successfully" });
  } catch (error) {
    console.error("Settings Update Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
