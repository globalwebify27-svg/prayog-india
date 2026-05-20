import { NextResponse } from "next/server";
import pool from "@/lib/db";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(request) {
  let logoUrl = "/assets/logo.png";

  try {
    const [rows] = await pool.query("SELECT logo_url FROM site_settings WHERE id = 1");
    if (rows[0]?.logo_url) {
      logoUrl = rows[0].logo_url;
    }
  } catch (error) {
    console.error("Database query error in favicon route:", error);
  }

  // If the URL is external, fetch the image and return it
  if (logoUrl.startsWith("http")) {
    try {
      const res = await fetch(logoUrl);
      if (res.ok) {
        const contentType = res.headers.get("content-type") || "image/png";
        const arrayBuffer = await res.arrayBuffer();
        return new Response(arrayBuffer, {
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=86400",
          },
        });
      }
    } catch (e) {
      console.error("Failed to fetch external logo in favicon route:", e);
    }
    // Fall back to default local logo if external fetch fails
    logoUrl = "/assets/logo.png";
  }

  // Serve the local logo file directly
  try {
    const filePath = path.join(process.cwd(), "public", logoUrl);
    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      let contentType = "image/x-icon"; // default for favicon.ico route
      if (logoUrl.endsWith(".png")) contentType = "image/png";
      else if (logoUrl.endsWith(".jpg") || logoUrl.endsWith(".jpeg")) contentType = "image/jpeg";
      else if (logoUrl.endsWith(".svg")) contentType = "image/svg+xml";
      else if (logoUrl.endsWith(".gif")) contentType = "image/gif";

      return new Response(fileBuffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=86400",
        },
      });
    }
  } catch (error) {
    console.error("Error serving local logo in favicon route:", error);
  }

  // Final fallback: serve default public/assets/logo.png
  try {
    const defaultPath = path.join(process.cwd(), "public/assets/logo.png");
    const fileBuffer = fs.readFileSync(defaultPath);
    return new Response(fileBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    return new Response("Icon not found", { status: 404 });
  }
}
