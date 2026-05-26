import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import pool from "./db.js";

export async function generateCertificate(studentName, courseName, certificateId) {
  try {
    const [settingRows] = await pool.query("SELECT `setting_key`, `setting_value` FROM site_settings");
    const settings = {};
    settingRows.forEach(r => { settings[r.setting_key] = r.setting_value; });

    const signatoryName = settings.signatory_name || "Authorized Signatory";
    const signatorySigUrl = settings.signatory_signature;

    let signatorySigBase64 = null;
    if (signatorySigUrl) {
      const p = path.join(process.cwd(), "public", signatorySigUrl);
      if (fs.existsSync(p)) {
        signatorySigBase64 = fs.readFileSync(p).toString("base64");
      }
    }

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [800, 600]
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://prayogindiarobotics.com";
    const verifyUrl = `${baseUrl}/verify/${certificateId}`;
    const qrDataUrl = await QRCode.toDataURL(verifyUrl);

    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, 800, 600, "F");
    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(10);
    doc.rect(20, 20, 760, 560, "S");
    doc.setDrawColor(251, 191, 36);
    doc.setLineWidth(2);
    doc.rect(30, 30, 740, 540, "S");

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(48);
    doc.setFont("helvetica", "bold");
    doc.text("PRAYOG INDIA", 400, 100, { align: "center" });
    doc.setFontSize(16);
    doc.setTextColor(251, 191, 36);
    doc.text("HUB FOR INDUSTRIAL LEARNING & INNOVATION", 400, 125, { align: "center" });

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(32);
    doc.text("CERTIFICATE OF COMPLETION", 400, 200, { align: "center" });

    doc.setFontSize(18);
    doc.setFont("helvetica", "normal");
    doc.text("This is to certify that", 400, 250, { align: "center" });
    doc.setFontSize(36);
    doc.setFont("helvetica", "bold");
    doc.text(studentName.toUpperCase(), 400, 300, { align: "center" });
    doc.setFontSize(18);
    doc.setFont("helvetica", "normal");
    doc.text(`has successfully completed the professional training program in`, 400, 340, { align: "center" });
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text(courseName, 400, 380, { align: "center" });

    doc.addImage(qrDataUrl, "PNG", 360, 420, 80, 80);
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Certificate ID: ${certificateId}`, 400, 510, { align: "center" });
    doc.text("Verify this certificate by scanning the QR code", 400, 525, { align: "center" });

    doc.setDrawColor(226, 232, 240);
    doc.line(550, 500, 700, 500);
    
    if (signatorySigBase64) {
       doc.addImage(signatorySigBase64, "PNG", 625 - 50, 500 - 45, 100, 40);
    }

    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(signatoryName, 625, 520, { align: "center" });

    const dir = path.join(process.cwd(), "public/uploads/certificates");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const fileName = `${certificateId}.pdf`;
    const filePath = path.join(dir, fileName);
    const buffer = Buffer.from(doc.output("arraybuffer"));
    fs.writeFileSync(filePath, buffer);
    return `/uploads/certificates/${fileName}`;
  } catch (error) {
    console.error("PDF Generation Error:", error);
    throw error;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// generateReceipt — accepts a single data object with all dynamic fields from DB
// ─────────────────────────────────────────────────────────────────────────────
export async function generateReceipt(data) {
  const {
    studentName,
    studentEmail,
    studentPhone,
    courseName,
    batchName,
    mode,
    amount,
    originalAmount,
    discountAmount,
    couponCode,
    installmentNo,
    totalInstallments,
    date,
    receiptId,
    paymentMethod,
  } = data;

  // Narrower portrait: 380 × 620 px
  const W = 380, H = 620;
  const doc = new jsPDF({ unit: "px", format: [W, H] });

  // ── Logo ──────────────────────────────────────────────────────────
  const logoPath = path.join(process.cwd(), "public/assets/logo.png");
  let logoBase64 = null;
  if (fs.existsSync(logoPath)) {
    logoBase64 = fs.readFileSync(logoPath).toString("base64");
  }

  // ── Background ────────────────────────────────────────────────────
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, W, H, "F");

  // ── Navy Header ───────────────────────────────────────────────────
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, W, 110, "F");

  // Gold accent stripe
  doc.setFillColor(251, 191, 36);
  doc.rect(0, 110, W, 4, "F");

  // Logo or fallback text
  if (logoBase64) {
    doc.addImage(logoBase64, "PNG", 22, 28, 110, 36);
  } else {
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("PRAYOG INDIA", 22, 55);
  }

  // Right: FEE RECEIPT title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("FEE RECEIPT", W - 22, 48, { align: "right" });

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text(`Receipt: ${receiptId}`, W - 22, 63, { align: "right" });
  doc.text(`Date: ${date}`, W - 22, 76, { align: "right" });
  doc.text(`Mode: ${(paymentMethod || "Online").toUpperCase()}`, W - 22, 89, { align: "right" });

  // ── Bill To ───────────────────────────────────────────────────────
  let y = 134;
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.text("BILLED TO", 22, y);

  y += 14;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text((studentName || "Student").toUpperCase(), 22, y);

  y += 12;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  if (studentEmail) { doc.text(studentEmail, 22, y); y += 11; }
  if (studentPhone) { doc.text(`Ph: ${studentPhone}`, 22, y); y += 11; }

  // ── Divider ───────────────────────────────────────────────────────
  y += 6;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.6);
  doc.line(22, y, W - 22, y);

  // ── Items Table Header ────────────────────────────────────────────
  y += 14;
  doc.setFillColor(248, 250, 252);
  doc.rect(22, y - 11, W - 44, 20, "F");

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.text("DESCRIPTION", 30, y);
  doc.text("AMOUNT", W - 28, y, { align: "right" });

  y += 7;
  doc.setDrawColor(226, 232, 240);
  doc.line(22, y, W - 22, y);

  // ── Row: Course ───────────────────────────────────────────────────
  y += 16;
  const installLabel = installmentNo === "Full"
    ? "Full Payment"
    : `Installment ${installmentNo}${totalInstallments ? ` of ${totalInstallments}` : ""}`;

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(courseName || "Course Fee", 30, y);
  doc.text(`INR ${Number(originalAmount || amount).toLocaleString("en-IN")}`, W - 28, y, { align: "right" });

  y += 12;
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  const subDetails = [batchName, mode, installLabel].filter(Boolean).join("  •  ");
  if (subDetails) doc.text(subDetails, 30, y);

  y += 10;
  doc.setDrawColor(241, 245, 249);
  doc.line(22, y, W - 22, y);

  // ── Totals ────────────────────────────────────────────────────────
  y += 14;
  const lx = W - 185, rx = W - 28;

  const origAmt = originalAmount || amount;
  const discAmt = discountAmount || 0;

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Subtotal", lx, y);
  doc.text(`INR ${Number(origAmt).toLocaleString("en-IN")}`, rx, y, { align: "right" });

  y += 13;
  const discountLabel = couponCode ? `Discount (${couponCode})` : "Discount / Coupon";
  doc.text(discountLabel, lx, y);
  if (discAmt > 0) {
    doc.setTextColor(34, 197, 94);
    doc.text(`- INR ${Number(discAmt).toLocaleString("en-IN")}`, rx, y, { align: "right" });
    doc.setTextColor(100, 116, 139);
  } else {
    doc.text("—", rx, y, { align: "right" });
  }

  y += 10;
  doc.setDrawColor(226, 232, 240);
  doc.line(lx, y, rx, y);

  // Total highlighted box
  y += 10;
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(lx - 8, y - 12, rx - lx + 18, 26, 3, 3, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL PAID", lx, y);

  doc.setTextColor(251, 191, 36);
  doc.setFontSize(11);
  doc.text(`INR ${Number(amount).toLocaleString("en-IN")}`, rx - 4, y, { align: "right" });

  // ── PAID Stamp ────────────────────────────────────────────────────
  y += 36;
  doc.setDrawColor(34, 197, 94);
  doc.setLineWidth(1.5);
  doc.roundedRect(22, y, 72, 22, 3, 3, "S");
  doc.setTextColor(34, 197, 94);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("✓  PAID", 58, y + 14, { align: "center" });

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.text(`Paid via ${paymentMethod || "Online Gateway"}`, 104, y + 14);

  // ── QR Code + Terms ───────────────────────────────────────────────
  y += 38;
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://prayogindiarobotics.com";
    const qrDataUrl = await QRCode.toDataURL(`${baseUrl}/verify/receipt/${receiptId}`, { margin: 1 });
    doc.addImage(qrDataUrl, "PNG", 22, y, 58, 58);
    doc.setTextColor(148, 163, 184);
    doc.setFontSize(6.5);
    doc.text("Scan to verify", 51, y + 64, { align: "center" });
  } catch (e) { /* skip if QR fails */ }

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  const terms = [
    "This is a system-generated receipt and requires no physical signature.",
    "All fees are non-refundable unless communicated otherwise.",
    "Contact: info@prayogindiarobotics.com | www.prayogindiarobotics.com"
  ];
  let ty = y + 8;
  terms.forEach(line => {
    doc.text(`• ${line}`, 90, ty);
    ty += 12;
  });

  // ── Footer ────────────────────────────────────────────────────────
  doc.setFillColor(251, 191, 36);
  doc.rect(0, H - 30, W, 3, "F");
  doc.setFillColor(15, 23, 42);
  doc.rect(0, H - 27, W, 27, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Thank you for choosing Prayog India Robotics!", W / 2, H - 10, { align: "center" });

  // ── Save ──────────────────────────────────────────────────────────
  const dir = path.join(process.cwd(), "public/uploads/receipts");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const fileName = `receipt_${receiptId}.pdf`;
  fs.writeFileSync(path.join(dir, fileName), Buffer.from(doc.output("arraybuffer")));
  return `/uploads/receipts/${fileName}`;
}

export async function generateIDCard(studentName, rollNo, courseName, studentPhoto, idCardId) {
  const doc = new jsPDF({
    unit: "px",
    format: [250, 400]
  });

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 250, 60, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("PRAYOG INDIA", 125, 35, { align: "center" });

  doc.setFillColor(241, 245, 249);
  doc.rect(75, 80, 100, 120, "F");
  if (studentPhoto) {
    try {
      doc.addImage(studentPhoto, "JPEG", 75, 80, 100, 120);
    } catch (e) {
      doc.setTextColor(148, 163, 184);
      doc.text("PHOTO", 125, 145, { align: "center" });
    }
  }

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.text(studentName.toUpperCase(), 125, 230, { align: "center" });
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`ID: ${rollNo}`, 125, 245, { align: "center" });
  doc.text(courseName, 125, 260, { align: "center" });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://prayogindiarobotics.com";
  const verifyUrl = `${baseUrl}/verify/student/${rollNo}`;
  const qrDataUrl = await QRCode.toDataURL(verifyUrl);
  doc.addImage(qrDataUrl, "PNG", 100, 280, 50, 50);

  doc.setFillColor(251, 191, 36);
  doc.rect(0, 380, 250, 20, "F");

  const dir = path.join(process.cwd(), "public/uploads/idcards");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const fileName = `id_${idCardId}.pdf`;
  const filePath = path.join(dir, fileName);
  const buffer = Buffer.from(doc.output("arraybuffer"));
  fs.writeFileSync(filePath, buffer);
  return `/uploads/idcards/${fileName}`;
}
