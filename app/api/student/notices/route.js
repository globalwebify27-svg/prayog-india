import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    let userRole = 'all';
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userRole = decoded.role;
      } catch (e) {}
    }

    const [rows] = await pool.query(
      "SELECT * FROM notices WHERE target_role = 'all' OR target_role = ? ORDER BY created_at DESC LIMIT 5",
      [userRole]
    );

    return NextResponse.json({
      success: true,
      notices: rows
    });

  } catch (error) {
    console.error("Failed to fetch notices:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
