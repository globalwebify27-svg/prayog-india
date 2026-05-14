import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM internship_banner WHERE id = 1");
    if (rows.length === 0) {
      // Return empty or default object if not found
      return NextResponse.json({
        title: 'Internship Program',
        year: '2026',
        subtitle: 'Join Our Team',
        description: 'We offer 5+ specialized internship tracks...',
        feature1_title: 'Hands-on Experience',
        feature2_title: 'Industry Mentorship',
        stat_number: '500+',
        stat_label: 'Interns Placed'
      });
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      title, year, subtitle, description, 
      feature1_title, feature1_desc, 
      feature2_title, feature2_desc, 
      feature3_title, feature3_desc, 
      feature4_title, feature4_desc, 
      stat_number, stat_label, image_url 
    } = body;
    
    await pool.query(
      `UPDATE internship_banner SET 
        title=?, year=?, subtitle=?, description=?, 
        feature1_title=?, feature1_desc=?, 
        feature2_title=?, feature2_desc=?, 
        feature3_title=?, feature3_desc=?, 
        feature4_title=?, feature4_desc=?, 
        stat_number=?, stat_label=?, image_url=? 
      WHERE id=1`,
      [
        title, year, subtitle, description, 
        feature1_title, feature1_desc, 
        feature2_title, feature2_desc, 
        feature3_title, feature3_desc, 
        feature4_title, feature4_desc, 
        stat_number, stat_label, image_url
      ]
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
