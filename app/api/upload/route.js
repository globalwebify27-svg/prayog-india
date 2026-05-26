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

    // Create unique filename
    const filename = Date.now() + "_" + file.name.replaceAll(" ", "_");
    const uploadDir = path.join(process.cwd(), "public/uploads");
    await mkdir(uploadDir, { recursive: true });
    const uploadPath = path.join(uploadDir, filename);

    await writeFile(uploadPath, buffer);
    const fileUrl = `/uploads/${filename}`;

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
