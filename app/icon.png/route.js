import { ImageResponse } from "next/og";
import pool from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT logo_url FROM site_settings WHERE id = 1");
    const logoUrl = rows[0]?.logo_url || "/assets/logo.png";
    
    // In a real app, you might want to fetch the actual image and return it
    // For now, we redirect to the logo URL to serve it as an icon
    // But icons usually need to be square.
    
    // If it's a relative path, prepend the base URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const fullUrl = logoUrl.startsWith("http") ? logoUrl : `${baseUrl}${logoUrl}`;

    return Response.redirect(fullUrl);
  } catch (error) {
    return Response.redirect("/assets/logo.png");
  }
}
