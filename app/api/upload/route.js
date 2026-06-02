import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    let buffer = Buffer.from(bytes);

    const mimeType = file.type || 'application/octet-stream';
    const isImage = mimeType.startsWith('image/');
    const maxSizeMB = isImage ? 5 : 32;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (buffer.length > maxSizeBytes) {
      return NextResponse.json({ error: `File size exceeds the allowed limit. Images must be under 5MB. Other files can be up to 32MB.` }, { status: 400 });
    }

    // SEO Friendly Filename Generation
    const originalName = file.name;
    const ext = path.extname(originalName);
    const nameWithoutExt = path.basename(originalName, ext);
    
    const seoName = nameWithoutExt
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with hyphens
      .replace(/^-+|-+$/g, ""); // Trim leading or trailing hyphens

    let finalExt = ext.toLowerCase();

    // Image Optimization Pipeline
    if (isImage && !mimeType.includes("svg") && !mimeType.includes("gif")) {
      buffer = await sharp(buffer)
        .resize({ width: 1920, withoutEnlargement: true }) // Cap width to 1920px to prevent massive resolutions
        .webp({ quality: 80 }) // Convert to webp with 80% compression quality for massive size reduction
        .toBuffer();
      
      finalExt = ".webp";
    }

    const uniqueFilename = `${seoName}-${Date.now()}${finalExt}`;
    const uploadDir = path.join(process.cwd(), "public/uploads");
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, uniqueFilename);
    
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${uniqueFilename}`;
    
    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to process upload. Please try another file." }, { status: 500 });
  }
}
