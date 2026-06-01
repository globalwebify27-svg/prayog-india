import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: "No image ID provided" }, { status: 400 });
    }

    const [rows] = await pool.query(
      "SELECT mime_type, data FROM images WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const image = rows[0];

    // Return the image data as a raw binary response with the correct Content-Type
    return new NextResponse(image.data, {
      status: 200,
      headers: {
        "Content-Type": image.mime_type,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });

  } catch (error) {
    console.error("Error fetching image:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
