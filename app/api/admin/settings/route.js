import { NextResponse } from "next/server";
import pool from "@/lib/db";

// GET all settings
export async function GET() {
  try {
    const [rows] = await pool.query("SELECT `setting_key`, `setting_value` FROM site_settings");
    const settings = {};
    rows.forEach(r => { settings[r.setting_key] = r.setting_value; });
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT update multiple settings
export async function PUT(req) {
  try {
    const settings = await req.json();
    const promises = [];
    for (const [key, value] of Object.entries(settings)) {
      if (value !== null && value !== undefined) {
        promises.push(
          pool.query(
            "INSERT INTO site_settings (`setting_key`, `setting_value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `setting_value` = ?",
            [key, String(value), String(value)]
          )
        );
      }
    }
    await Promise.all(promises);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
