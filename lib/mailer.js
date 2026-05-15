import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.hostinger.com",
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || "your@email.com",
    pass: process.env.SMTP_PASS || "password",
  },
});

export async function sendMail(to, subject, html, attachments = []) {
  try {
    const info = await transporter.sendMail({
      from: `"Prayog India" <${process.env.SMTP_USER || "info@prayogindiarobotics.com"}>`,
      to,
      subject,
      html,
      attachments
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Mail Error:", error);
    return { success: false, error: error.message };
  }
}

export const getCertificateEmailTemplate = (studentName, courseName, certificateLink) => {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
      <div style="background-color: #0f172a; padding: 40px 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 1px;">PRAYOG INDIA</h1>
        <p style="color: #fbbf24; margin: 10px 0 0 0; font-weight: bold; text-transform: uppercase; font-size: 14px; letter-spacing: 2px;">Excellence in Technology</p>
      </div>
      <div style="padding: 40px 30px;">
        <h2 style="color: #1e293b; font-size: 24px; margin-bottom: 20px;">Congratulations, ${studentName}!</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">
          We are thrilled to inform you that you have successfully completed the <strong>${courseName}</strong> program at Prayog India.
        </p>
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">
          Your hard work and dedication have paid off. We've attached your official digital certificate to this email for your records.
        </p>
        <div style="margin: 40px 0; text-align: center;">
          <a href="${certificateLink}" style="background-color: #0f172a; color: #ffffff; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block; transition: background-color 0.3s;">Download Certificate</a>
        </div>
        <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
          You can also verify your certificate's authenticity by scanning the QR code on the document or visiting our verification portal at https://prayogindiarobotics.com/verify
        </p>
      </div>
      <div style="background-color: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="color: #94a3b8; font-size: 12px; margin: 0;">
          © 2026 Prayog India Hub. All rights reserved.<br>
          This is an automated notification. Please do not reply to this email.
        </p>
      </div>
    </div>
  `;
};

export const getOnboardingEmailTemplate = (studentName, email, password) => {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
      <div style="background-color: #0f172a; padding: 40px 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 1px;">PRAYOG INDIA</h1>
        <p style="color: #fbbf24; margin: 10px 0 0 0; font-weight: bold; text-transform: uppercase; font-size: 14px; letter-spacing: 2px;">Welcome to the Future</p>
      </div>
      <div style="padding: 40px 30px;">
        <h2 style="color: #1e293b; font-size: 24px; margin-bottom: 20px;">Welcome, ${studentName}!</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">
          Your registration at Prayog India Robotics is successful. We are excited to have you onboard!
        </p>
        <div style="background-color: #f1f5f9; padding: 25px; border-radius: 8px; margin: 30px 0;">
          <h3 style="color: #0f172a; margin-top: 0; font-size: 18px;">Your Login Credentials</h3>
          <p style="color: #475569; margin: 10px 0;"><strong>User ID (Email):</strong> ${email}</p>
          <p style="color: #475569; margin: 10px 0;"><strong>Password:</strong> ${password}</p>
        </div>
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">
          You can now login to your student dashboard to access your courses, track attendance, and more.
        </p>
        <div style="margin: 40px 0; text-align: center;">
          <a href="https://prayogindiarobotics.com/login" style="background-color: #0f172a; color: #ffffff; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">Login to Dashboard</a>
        </div>
      </div>
      <div style="background-color: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="color: #94a3b8; font-size: 12px; margin: 0;">
          © 2026 Prayog India Hub. All rights reserved.<br>
          For support, contact us at info@prayogindiarobotics.com
        </p>
      </div>
    </div>
  `;
};
