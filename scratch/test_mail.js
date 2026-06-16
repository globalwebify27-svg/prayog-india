const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Read .env file manually
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  });
}

console.log('SMTP Host:', process.env.SMTP_HOST);
console.log('SMTP User:', process.env.SMTP_USER);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.hostinger.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "your@email.com",
    pass: process.env.SMTP_PASS || "password",
  },
  tls: {
    rejectUnauthorized: false
  }
});

async function testSend() {
  try {
    console.log('Attempting to send email...');
    const info = await transporter.sendMail({
      from: `"Prayog India" <${process.env.SMTP_USER || "info@prayogindiarobotics.com"}>`,
      to: 'saahmed311@gmail.com', // Using a valid placeholder email
      subject: 'Test Email from Prayog India Dev',
      html: '<h1>Test OTP: 123456</h1>'
    });
    console.log('Email sent successfully!', info.messageId);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

testSend();
