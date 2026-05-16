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

export const getOnboardingEmailTemplate = (studentName, email, password, courseName, timing, paymentMethod, amount, installments = []) => {
  const isInstallment = installments.length > 1;
  
  const paymentDetailsHtml = isInstallment 
    ? `
      <div style="margin-top: 15px; border-top: 1px dashed #cbd5e1; pt-15px;">
        <p style="color: #0f172a; font-weight: bold; margin-bottom: 10px; font-size: 14px;">Installment Schedule:</p>
        ${installments.map((inst, index) => `
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 12px; color: #475569;">
            <span>Installment ${index + 1}: ₹${Number(inst.amount).toFixed(2)}</span>
            <span>Due: ${new Date(inst.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        `).join('')}
      </div>
    `
    : `<p style="color: #475569; margin: 10px 0;"><strong>Payment Status:</strong> Full Amount Paid (₹${Number(amount).toFixed(2)})</p>`;

  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
      <div style="background-color: #0f172a; padding: 30px 20px; text-align: center;">
        <img src="https://prayogindiarobotics.com/assets/logo.png" alt="Prayog India" style="height: 50px; margin-bottom: 10px; filter: brightness(0) invert(1);">
        <p style="color: #fbbf24; margin: 5px 0 0 0; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 2px;">Welcome to the Future</p>
      </div>
      <div style="padding: 40px 30px;">
        <h2 style="color: #1e293b; font-size: 24px; margin-bottom: 20px;">Welcome, ${studentName}!</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">
          Your registration at Prayog India Robotics is successful. We are excited to have you onboard!
        </p>

        <div style="background-color: #f1f5f9; padding: 25px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #0f172a; margin-top: 0; font-size: 18px; border-bottom: 1px solid #cbd5e1; padding-bottom: 10px;">Enrollment Details</h3>
          <p style="color: #475569; margin: 10px 0;"><strong>Course:</strong> ${courseName}</p>
          <p style="color: #475569; margin: 10px 0;"><strong>Batch Timing:</strong> ${timing}</p>
          <p style="color: #475569; margin: 10px 0;"><strong>Initial Payment Mode:</strong> ${paymentMethod.toUpperCase()}</p>
          ${paymentDetailsHtml}
        </div>

        <div style="background-color: #0f172a; color: #ffffff; padding: 25px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #fbbf24; margin-top: 0; font-size: 18px;">Login Credentials</h3>
          <p style="margin: 10px 0;"><strong>User ID:</strong> ${email}</p>
          <p style="margin: 10px 0;"><strong>Password:</strong> ${password}</p>
        </div>

        <p style="color: #475569; font-size: 16px; line-height: 1.6;">
          You can now login to your student dashboard to access your courses, track attendance, and more.
        </p>
        <div style="margin: 40px 0; text-align: center;">
          <a href="https://prayogindiarobotics.com/login" style="background-color: #fbbf24; color: #0f172a; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">Login to Dashboard</a>
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

export const getFacultyOnboardingEmailTemplate = (teacherName, email, password, role) => {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
      <div style="background-color: #0f172a; padding: 40px 20px; text-align: center;">
        <img src="https://prayogindiarobotics.com/assets/logo.png" alt="Prayog India" style="height: 50px; margin-bottom: 10px; filter: brightness(0) invert(1);">
        <p style="color: #fbbf24; margin: 5px 0 0 0; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 2px;">Faculty Onboarding</p>
      </div>
      <div style="padding: 40px 30px;">
        <h2 style="color: #1e293b; font-size: 24px; margin-bottom: 20px;">Welcome, Prof. ${teacherName}!</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">
          Congratulations on joining the academic team at Prayog India Robotics. Your profile has been officially activated as <strong>${role}</strong>.
        </p>

        <div style="background-color: #f1f5f9; padding: 25px; border-radius: 8px; margin: 25px 0;">
          <h3 style="color: #0f172a; margin-top: 0; font-size: 18px; border-bottom: 1px solid #cbd5e1; padding-bottom: 10px;">Portal Access Credentials</h3>
          <p style="color: #475569; margin: 10px 0;"><strong>User ID (Email):</strong> ${email}</p>
          <p style="color: #475569; margin: 10px 0;"><strong>Initial Password:</strong> ${password}</p>
        </div>

        <p style="color: #475569; font-size: 16px; line-height: 1.6;">
          You can now login to the Faculty Portal to manage your assigned courses, view student progress, and mark attendance.
        </p>
        <div style="margin: 40px 0; text-align: center;">
          <a href="https://prayogindiarobotics.com/login" style="background-color: #fbbf24; color: #0f172a; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">Access Faculty Dashboard</a>
        </div>
        <p style="color: #64748b; font-size: 14px; line-height: 1.6; font-style: italic;">
          * Please change your password after your first login for security purposes.
        </p>
      </div>
      <div style="background-color: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="color: #94a3b8; font-size: 12px; margin: 0;">
          © 2026 Prayog India Hub. All rights reserved.<br>
          Institutional Support: info@prayogindiarobotics.com
        </p>
      </div>
    </div>
  `;
};
export const getPasswordResetEmailTemplate = (studentName, resetLink) => {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
      <div style="background-color: #0f172a; padding: 30px 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">PRAYOG INDIA</h1>
      </div>
      <div style="padding: 40px 30px;">
        <h2 style="color: #1e293b; font-size: 20px; margin-bottom: 20px;">Password Reset Request</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.6;">
          Hello ${studentName},<br/><br/>
          We received a request to reset your password for your Prayog India account. Click the button below to set a new password:
        </p>
        <div style="margin: 40px 0; text-align: center;">
          <a href="${resetLink}" style="background-color: #fbbf24; color: #0f172a; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">Reset My Password</a>
        </div>
        <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
          If you didn't request this, you can safely ignore this email. This link will expire in 1 hour.
        </p>
      </div>
    </div>
  `;
};

export const getContactConfirmationTemplate = (name) => {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #0f172a;">Message Received!</h2>
      <p>Hello ${name},</p>
      <p>Thank you for reaching out to Prayog India. We have received your enquiry and our academic team will contact you shortly.</p>
      <p>Best Regards,<br/>Team Prayog India</p>
    </div>
  `;
};

export const getAdminContactNotificationTemplate = (name, email, subject, message) => {
  return `
    <div style="font-family: sans-serif; padding: 20px; background: #f8fafc; border-radius: 10px;">
      <h2 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">New Website Enquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <div style="background: white; padding: 15px; border-radius: 5px; margin-top: 10px; border: 1px solid #e2e8f0;">
        <strong>Message:</strong><br/>
        ${message}
      </div>
    </div>
  `;
};
