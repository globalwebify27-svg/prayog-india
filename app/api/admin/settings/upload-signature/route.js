import { NextResponse } from "next/server";
import pool from "@/lib/db";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const key = formData.get("key"); // "director_signature" or "signatory_signature"
    const file = formData.get("file");

    if (!file || !key) {
      return NextResponse.json({ success: false, message: "Missing file or key" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.name.split(".").pop();
    const fileName = `${key}_${Date.now()}.${ext}`;
    const dir = path.join(process.cwd(), "public/uploads/signatures");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const filePath = path.join(dir, fileName);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/signatures/${fileName}`;

    // Save path to DB
    await pool.query(
      "INSERT INTO site_settings (`setting_key`, `setting_value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `setting_value` = ?",
      [key, publicUrl, publicUrl]
    );

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
