import { NextResponse } from "next/server";
import pool from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { nextUrl } = request;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || nextUrl.origin;

  try {
    const [rows] = await pool.query("SELECT logo_url FROM site_settings WHERE id = 1");
    const logoUrl = rows[0]?.logo_url || "/assets/logo.png";
    
    const fullUrl = logoUrl.startsWith("http") ? logoUrl : `${baseUrl}${logoUrl}`;

    return NextResponse.redirect(fullUrl);
  } catch (error) {
    return NextResponse.redirect(`${baseUrl}/assets/logo.png`);
  }
}
