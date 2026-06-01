import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const mimeType = file.type || 'application/octet-stream';
    const filename = file.name.replaceAll(" ", "_");

    // Connect to database
    const pool = require('@/lib/db').default;
    
    // Insert into images table
    const [result] = await pool.execute(
      "INSERT INTO images (filename, mime_type, data) VALUES (?, ?, ?)",
      [filename, mimeType, buffer]
    );

    const imageId = result.insertId;
    const fileUrl = `/api/images/${imageId}`;
    
    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
