import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request) {
  try {
    const { name, email, phone, course, message } = await request.json();

    const [result] = await pool.query(
      "INSERT INTO enquiries (name, email, phone, course, message) VALUES (?, ?, ?, ?, ?)",
      [name, email, phone, course, message]
    );

    // Send Emails
    try {
      const { sendMail, getContactConfirmationTemplate, getAdminContactNotificationTemplate } = require("@/lib/mailer");
      
      // 1. Auto-reply to student
      await sendMail(
        email, 
        "Enquiry Received - Prayog India", 
        getContactConfirmationTemplate(name)
      );

      // 2. Alert to Admin (with phone and course)
      const adminMessage = `Course: ${course}\nPhone: ${phone}\nMessage: ${message}`;
      await sendMail(
        process.env.SMTP_USER || "info@prayogindiarobotics.com",
        `New Course Enquiry: ${course}`,
        getAdminContactNotificationTemplate(name, email, `Course Enquiry: ${course}`, adminMessage)
      );
    } catch (mailErr) {
      console.error("Enquiry Mail Error:", mailErr);
    }

    return NextResponse.json({
      success: true,
      message: "Enquiry submitted successfully!",
      id: result.insertId
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
