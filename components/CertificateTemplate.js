"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react";

const CertificateTemplate = ({
  studentName = "Student Name",
  courseName = "Course Name",
  date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
  certificateNumber = "PR-2026-0000",
  qrCodeData = "https://prayogindiarobotics.com/verify/PR-2026-0000",
  signatoryName = "Authorized Signature",
  signatorySignature = "/assets/signature.png",
  fromDate = "",
  toDate = "",
  instituteName = "",
  logoUrl = "/assets/logo.png"
}) => {
  return (
    <div
      id="certificate-to-print"
      style={{
        position: "relative",
        width: "1123px",
        height: "794px",
        backgroundColor: "#f8fbfe",
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 15 Q 50 30, 100 15 T 200 15' fill='none' stroke='%23d4e3f3' stroke-width='1.2'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 30px",
        fontFamily: "'Georgia', 'Times New Roman', serif",
        overflow: "hidden",
        boxSizing: "border-box",
        color: "#000000"
      }}
    >
      {/* === Border System === */}
      <div style={{ position: "absolute", top: "10px", left: "10px", right: "10px", bottom: "10px", border: "1px solid #3c73b8", pointerEvents: "none", zIndex: 1 }} />
      <div style={{ position: "absolute", top: "14px", left: "14px", right: "14px", bottom: "14px", border: "3px solid #3c73b8", pointerEvents: "none", zIndex: 1 }} />
      <div style={{ position: "absolute", top: "19px", left: "19px", right: "19px", bottom: "19px", border: "10px solid #5a8bd5", pointerEvents: "none", zIndex: 1, opacity: 0.85 }} />
      <div style={{ position: "absolute", top: "31px", left: "31px", right: "31px", bottom: "31px", border: "3px solid #3c73b8", pointerEvents: "none", zIndex: 1 }} />
      <div style={{ position: "absolute", top: "35px", left: "35px", right: "35px", bottom: "35px", border: "1px solid #3c73b8", pointerEvents: "none", zIndex: 1 }} />

      {/* === Content Area === */}
      <div style={{
        position: "absolute",
        top: "42px",
        left: "42px",
        right: "42px",
        bottom: "42px",
        zIndex: 2,
        display: "flex",
        flexDirection: "column"
      }}>

        {/* Row 1: Logo Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingTop: "6px", marginBottom: "0px" }}>
          {/* Left: MSME Logo */}
          <div style={{ width: "180px", display: "flex", alignItems: "flex-start" }}>
            <img src="/assets/msme.png" alt="MSME" style={{ height: "60px", objectFit: "contain" }} onError={(e) => e.target.style.display = 'none'} />
          </div>

          {/* Center: Prayog India Logo */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <img src={logoUrl} alt="Prayog India" style={{ height: "80px", objectFit: "contain", marginBottom: "6px" }} />
            <p style={{ color: "#000", fontSize: "15px", letterSpacing: "2px", margin: 0, fontWeight: "bold", fontFamily: "'Arial', sans-serif" }}>
              <span style={{ fontStyle: "italic" }}>The World of</span> ROBOTICS
            </p>
          </div>

          {/* Right: spacer to balance layout */}
          <div style={{ width: "180px" }} />
        </div>

        {/* Row 2: Ref No & Date */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 20px", marginBottom: "4px" }}>
          <span style={{ fontWeight: "bold", fontFamily: "'Arial', sans-serif", fontSize: "12px", color: "#333" }}>Ref No. PGI/{certificateNumber}</span>
          <span style={{ fontWeight: "bold", fontFamily: "'Arial', sans-serif", fontSize: "12px", color: "#333" }}>Date: {date}</span>
        </div>

        {/* Row 3: Certificate Title */}
        <div style={{ textAlign: "center", marginBottom: "6px", marginTop: "0px" }}>
          <h1 style={{
            fontSize: "58px",
            fontWeight: "bold",
            color: "#1c60a8",
            margin: "0",
            fontFamily: "'Brush Script MT', 'Great Vibes', 'Lucida Handwriting', cursive",
            lineHeight: "1.15",
            paddingBottom: "22px"
          }}>
            {courseName.toLowerCase().includes('summer camp')
              ? 'Summer Camp Certificate of Participation'
              : 'Certificate of Participation'}
          </h1>
          <div style={{ width: "60%", height: "3px", backgroundColor: "#1c60a8", margin: "0 auto" }} />
        </div>

        {/* Row 4: Body Content — takes remaining vertical space */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <p style={{ margin: "0 0 14px 0", fontSize: "22px", fontStyle: "italic", color: "#111" }}>This Certificate is proudly awarded to</p>

          {/* Student Name with underline */}
          <div style={{ width: "65%", borderBottom: "2px dotted #444", paddingBottom: "4px", marginBottom: "14px" }}>
            <span style={{ fontSize: "34px", fontWeight: "bold", fontStyle: "normal", color: "#000" }}>
              {studentName}
            </span>
          </div>

          {/* Body paragraph */}
          <div style={{ lineHeight: "2", fontSize: "20px", fontStyle: "italic", color: "#222", width: "80%" }}>
            Student of <span style={{ display: "inline-block", minWidth: "20%", borderBottom: "2px dotted #444", margin: "0 4px", verticalAlign: "bottom", fontStyle: "normal", fontWeight: "bold", fontSize: "20px" }}>{instituteName || '\u00A0'}</span> for actively participating in the<br />
            <span style={{ fontWeight: "bold", fontStyle: "normal", color: "#000", fontSize: "21px" }}>"{courseName}"</span> from <span style={{ display: "inline-block", minWidth: "12%", borderBottom: "2px dotted #444", margin: "0 4px", verticalAlign: "bottom", fontStyle: "normal", fontWeight: "bold", fontSize: "18px" }}>{fromDate || '\u00A0'}</span> to <span style={{ display: "inline-block", minWidth: "12%", borderBottom: "2px dotted #444", margin: "0 4px", verticalAlign: "bottom", fontStyle: "normal", fontWeight: "bold", fontSize: "18px" }}>{toDate || '\u00A0'}</span> at<br />
            <span style={{ fontStyle: "italic", fontSize: "22px", letterSpacing: "1px" }}>PRAYOG INDIA ROBOTICS.</span><br />
            <span style={{ fontStyle: "italic", fontSize: "20px" }}>We extend our best wishes for his/her continued success ahead.</span>
          </div>
        </div>

        {/* Row 5: Footer — QR | ISO Badge | Signature */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 10px",
          height: "130px",
          flexShrink: 0,
          marginBottom: "5px"
        }}>
          {/* Left: QR Code */}
          <div style={{ width: "200px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ background: "#fff", padding: "4px", borderRadius: "4px", border: "2px solid #1c60a8", marginBottom: "4px" }}>
              <QRCodeSVG value={qrCodeData} size={75} bgColor="#ffffff" fgColor="#000000" level="M" />
            </div>
            <p style={{ color: "#1c60a8", fontSize: "11px", fontWeight: "bold", margin: 0, fontFamily: "'Arial', sans-serif" }}>Scan to Verify</p>
          </div>

          {/* Center: ISO Badge */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 20px" }}>
            <img src="/assets/iso.png" alt="ISO Certified" style={{ width: "180px", height: "120px", objectFit: "contain" }} />
          </div>

          {/* Right: Signature */}
          <div style={{ width: "200px", textAlign: "center" }}>
            <div style={{ height: "55px", display: "flex", alignItems: "flex-end", justifyContent: "center", marginBottom: "4px" }}>
              <img src={signatorySignature || "/assets/signature.png"} alt="Signature" style={{ maxHeight: "50px", maxWidth: "160px", objectFit: "contain" }} />
            </div>
            <div style={{ width: "100%", height: "2px", background: "#1c60a8", marginBottom: "6px" }} />
            <p style={{ fontSize: "13px", color: "#000", fontWeight: "bold", fontStyle: "italic", fontFamily: "'Georgia', serif", margin: 0 }}>Training and Innovation Cell</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CertificateTemplate;

