import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";

export async function generateCertificate(studentName, courseName, certificateId) {
  try {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [800, 600]
    });

    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://prayogindia.in"}/verify/${certificateId}`;
    const qrDataUrl = await QRCode.toDataURL(verifyUrl);

    // Background and Border
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, 800, 600, "F");
    
    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(10);
    doc.rect(20, 20, 760, 560, "S");
    
    doc.setDrawColor(251, 191, 36); // Primary Gold
    doc.setLineWidth(2);
    doc.rect(30, 30, 740, 540, "S");

    // Header
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(48);
    doc.setFont("helvetica", "bold");
    doc.text("PRAYOG INDIA", 400, 100, { align: "center" });
    
    doc.setFontSize(16);
    doc.setTextColor(251, 191, 36);
    doc.text("HUB FOR INDUSTRIAL LEARNING & INNOVATION", 400, 125, { align: "center" });

    // Certificate Title
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(32);
    doc.text("CERTIFICATE OF COMPLETION", 400, 200, { align: "center" });

    // Recipient Info
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

    // QR and ID
    doc.addImage(qrDataUrl, "PNG", 360, 420, 80, 80);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Certificate ID: ${certificateId}`, 400, 510, { align: "center" });
    doc.text("Verify this certificate by scanning the QR code", 400, 525, { align: "center" });

    // Footer / Signatures
    doc.setDrawColor(226, 232, 240);
    doc.line(100, 500, 250, 500);
    doc.line(550, 500, 700, 500);
    
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text("Director", 175, 520, { align: "center" });
    doc.text("Authorized Signatory", 625, 520, { align: "center" });

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

export async function generateReceipt(studentName, amount, installmentNo, date, receiptId) {
    // Similar logic for Receipt
    const doc = new jsPDF({
        unit: "px",
        format: [400, 600]
    });

    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 400, 80, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text("FEE RECEIPT", 200, 50, { align: "center" });

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.text(`Receipt No: ${receiptId}`, 40, 110);
    doc.text(`Date: ${date}`, 360, 110, { align: "right" });

    doc.setFontSize(14);
    doc.text(`Student Name: ${studentName}`, 40, 150);
    doc.text(`Amount Paid: INR ${amount}`, 40, 180);
    doc.text(`Payment For: Installment #${installmentNo}`, 40, 210);

    doc.text("Status: PAID", 40, 240);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text("Thank you for choosing Prayog India.", 200, 550, { align: "center" });

    const dir = path.join(process.cwd(), "public/uploads/receipts");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const fileName = `receipt_${receiptId}.pdf`;
    const filePath = path.join(dir, fileName);
    
    const buffer = Buffer.from(doc.output("arraybuffer"));
    fs.writeFileSync(filePath, buffer);

    return `/uploads/receipts/${fileName}`;
}

export async function generateIDCard(studentName, rollNo, courseName, studentPhoto, idCardId) {
    const doc = new jsPDF({
        unit: "px",
        format: [250, 400] // Vertical ID card
    });

    // Header
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 250, 60, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("PRAYOG INDIA", 125, 35, { align: "center" });

    // Photo Placeholder or Real Image
    doc.setFillColor(241, 245, 249);
    doc.rect(75, 80, 100, 120, "F");
    if (studentPhoto) {
        try {
            // Assuming studentPhoto is a base64 or valid path
            doc.addImage(studentPhoto, "JPEG", 75, 80, 100, 120);
        } catch (e) {
            doc.setTextColor(148, 163, 184);
            doc.text("PHOTO", 125, 145, { align: "center" });
        }
    }

    // Student Info
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.text(studentName.toUpperCase(), 125, 230, { align: "center" });
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`ID: ${rollNo}`, 125, 245, { align: "center" });
    doc.text(courseName, 125, 260, { align: "center" });

    // Footer with QR
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://prayogindia.in"}/verify/student/${rollNo}`;
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
