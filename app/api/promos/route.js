import { NextResponse } from "next/server";
import pool from "@/lib/db";
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM promos WHERE is_active = TRUE ORDER BY created_at DESC");
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
