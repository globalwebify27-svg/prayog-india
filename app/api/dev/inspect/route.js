import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [columns] = await pool.query("SHOW COLUMNS FROM timings");
    const [batchColumns] = await pool.query("SHOW COLUMNS FROM batches");
    return NextResponse.json({ success: true, timings: columns, batches: batchColumns });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
