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
    const isImage = mimeType.startsWith('image/');
    const maxSizeMB = isImage ? 5 : 32;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (buffer.length > maxSizeBytes) {
      return NextResponse.json({ error: `File size exceeds the allowed limit. Images must be under 5MB. Other files can be up to 32MB.` }, { status: 400 });
    }

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
