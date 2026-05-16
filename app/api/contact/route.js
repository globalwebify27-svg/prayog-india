import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json();

    await pool.query(
      "INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)",
      [name, email, subject, message]
    );

    // Send Emails
    try {
      const { sendMail, getContactConfirmationTemplate, getAdminContactNotificationTemplate } = require("@/lib/mailer");
      
      // 1. Auto-reply to user
      await sendMail(
        email, 
        "Message Received - Prayog India", 
        getContactConfirmationTemplate(name)
      );

      // 2. Alert to Admin
      await sendMail(
        process.env.SMTP_USER || "info@prayogindiarobotics.com",
        `New Website Enquiry: ${subject}`,
        getAdminContactNotificationTemplate(name, email, subject, message)
      );
    } catch (mailErr) {
      console.error("Contact Mail Error:", mailErr);
    }

    return NextResponse.json({
      success: true,
      message: "Message sent! Our team will contact you soon."
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
export async function GET() {
  try {
    // Fetch from both tables
    const [contactRows] = await pool.query("SELECT id, name, email, subject, message, created_at, 'Contact' as type FROM contact_messages");
    const [enquiryRows] = await pool.query("SELECT id, name, email, course as subject, message, created_at, 'Enquiry' as type, phone FROM enquiries");
    
    // Combine and sort by date
    const allLeads = [...contactRows, ...enquiryRows].sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    );

    return NextResponse.json({ success: true, leads: allLeads });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type"); // 'Contact' or 'Enquiry'

    if (!id || !type) {
      return NextResponse.json({ success: false, message: "ID and Type are required" }, { status: 400 });
    }

    const table = type === "Contact" ? "contact_messages" : "enquiries";
    
    await pool.query(`DELETE FROM ${table} WHERE id = ?`, [id]);

    return NextResponse.json({ success: true, message: "Lead deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
