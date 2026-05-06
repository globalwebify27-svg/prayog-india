import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { sendMail } from "@/lib/mailer";

export async function POST() {
  try {
    // Find installments due in the next 3 days that are still pending
    const [rows] = await pool.query(`
      SELECT i.*, u.email, u.name as student_name, c.title as course_name 
      FROM installments i
      JOIN enrollments e ON i.enrollment_id = e.id
      JOIN users u ON e.user_id = u.id
      JOIN courses c ON e.course_id = c.id
      WHERE i.status = 'pending' 
      AND i.due_date <= DATE_ADD(CURDATE(), INTERVAL 3 DAY)
      AND i.due_date >= CURDATE()
    `);

    let sentCount = 0;
    for (const row of rows) {
      const emailHtml = `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #0f172a;">Payment Reminder: Prayog India</h2>
          <p>Dear ${row.student_name},</p>
          <p>This is a friendly reminder that your installment of <strong>INR ${row.amount}</strong> for the course <strong>${row.course_name}</strong> is due on <strong>${new Date(row.due_date).toDateString()}</strong>.</p>
          <p>Please log in to your dashboard to make the payment and avoid any service interruptions.</p>
          <div style="margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background: #0f172a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Dashboard</a>
          </div>
          <p>If you have already paid, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">Prayog India Hub | info@prayogindia.in</p>
        </div>
      `;

      await sendMail(row.email, "Upcoming Payment Reminder - Prayog India", emailHtml);
      sentCount++;
    }

    return NextResponse.json({ success: true, sent: sentCount });
  } catch (error) {
    console.error("Reminder Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
