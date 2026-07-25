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
        backgroundColor: "#ffffff",
        backgroundImage: `url("/uploads/CERTIFICATE BACKGROUND.jpg")`,
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        fontFamily: "'Georgia', 'Times New Roman', serif",
        overflow: "hidden",
        boxSizing: "border-box",
        color: "#000000"
      }}
    >
      {/* === Content Area === */}
      <div style={{
        position: "absolute",
        top: "55px",
        left: "75px",
        right: "75px",
        bottom: "65px",
        zIndex: 2,
        display: "flex",
        flexDirection: "column"
      }}>

        {/* Row 1: Logo Header with MSME (Left), Prayog (Center), QR Code (Right Top) */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingTop: "4px", marginBottom: "0px" }}>
          {/* Left: MSME Logo (Shifted down and enlarged) */}
          <div style={{ width: "220px", display: "flex", alignItems: "flex-start", paddingTop: "12px" }}>
            <img src="/assets/msme.png" alt="MSME" style={{ height: "95px", objectFit: "contain" }} onError={(e) => e.target.style.display = 'none'} />
          </div>

          {/* Center: Prayog India Full Logo (Includes integrated 'The World of ROBOTICS' tagline) */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "6px" }}>
            <img src="/assets/prayog_full_logo.png" alt="Prayog India - The World of Robotics" style={{ height: "90px", objectFit: "contain" }} />
          </div>

          {/* Right Top: Verification QR Code (Shifted down and enlarged) */}
          <div style={{ width: "220px", display: "flex", flexDirection: "column", alignItems: "flex-end", paddingTop: "8px" }}>
            <div style={{ background: "#fff", padding: "4px", borderRadius: "4px", border: "2px solid #1c60a8", marginBottom: "3px" }}>
              <QRCodeSVG value={qrCodeData} size={74} bgColor="#ffffff" fgColor="#000000" level="M" />
            </div>
            <p style={{ color: "#1c60a8", fontSize: "10px", fontWeight: "bold", margin: 0, fontFamily: "'Arial', sans-serif", paddingRight: "10px" }}>Scan to Verify</p>
          </div>
        </div>

        {/* Row 2: Ref No & Date */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "12px 10px 4px 10px", marginBottom: "4px" }}>
          <span style={{ fontWeight: "bold", fontFamily: "'Arial', sans-serif", fontSize: "14px", color: "#1a1a1a", letterSpacing: "0.3px" }}>Ref No. PGI/{certificateNumber}</span>
          <span style={{ fontWeight: "bold", fontFamily: "'Arial', sans-serif", fontSize: "14px", color: "#1a1a1a", letterSpacing: "0.3px" }}>Date: {date}</span>
        </div>

        {/* Row 3: Certificate Title */}
        <div style={{ textAlign: "center", marginBottom: "4px", marginTop: "0px" }}>
          <h1 style={{
            fontSize: "52px",
            fontWeight: "bold",
            color: "#1c60a8",
            margin: "0",
            fontFamily: "'Brush Script MT', 'Great Vibes', 'Lucida Handwriting', cursive",
            lineHeight: "1.1",
            paddingBottom: "14px"
          }}>
            {courseName.toLowerCase().includes('summer camp')
              ? 'Summer Camp Certificate of Participation'
              : 'Certificate of Participation'}
          </h1>
          <div style={{ width: "55%", height: "2.5px", backgroundColor: "#1c60a8", margin: "0 auto" }} />
        </div>

        {/* Row 4: Body Content — takes remaining vertical space */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <p style={{ margin: "0 0 10px 0", fontSize: "20px", fontStyle: "italic", color: "#111" }}>This Certificate is proudly awarded to</p>

          {/* Student Name with underline */}
          <div style={{ width: "60%", borderBottom: "2px dotted #444", paddingBottom: "2px", marginBottom: "12px" }}>
            <span style={{ fontSize: "30px", fontWeight: "bold", fontStyle: "normal", color: "#000" }}>
              {studentName}
            </span>
          </div>

          {/* Body paragraph */}
          <div style={{ lineHeight: "1.75", fontSize: "18px", fontStyle: "italic", color: "#222", width: "85%" }}>
            Student of <span style={{ display: "inline-block", minWidth: "18%", borderBottom: "2px dotted #444", margin: "0 4px", verticalAlign: "bottom", fontStyle: "normal", fontWeight: "bold", fontSize: "18px" }}>{instituteName || '\u00A0'}</span> for actively participating in the<br />
            <span style={{ fontWeight: "bold", fontStyle: "normal", color: "#000", fontSize: "19px", display: "inline-block", maxWidth: "95%", wordBreak: "break-word", lineHeight: "1.3", margin: "4px 0" }}>&quot;{courseName}&quot;</span><br />
            from <span style={{ display: "inline-block", minWidth: "12%", borderBottom: "2px dotted #444", margin: "0 4px", verticalAlign: "bottom", fontStyle: "normal", fontWeight: "bold", fontSize: "17px" }}>{fromDate || '\u00A0'}</span> to <span style={{ display: "inline-block", minWidth: "12%", borderBottom: "2px dotted #444", margin: "0 4px", verticalAlign: "bottom", fontStyle: "normal", fontWeight: "bold", fontSize: "17px" }}>{toDate || '\u00A0'}</span> at<br />
            <span style={{ fontStyle: "italic", fontSize: "20px", letterSpacing: "1px" }}>PRAYOG INDIA ROBOTICS.</span><br />
            <span style={{ fontStyle: "italic", fontSize: "18px" }}>We extend our best wishes for his/her continued success ahead.</span>
          </div>
        </div>

        {/* Row 5: Footer — Robot Mascot (Left Bottom) | ISO Badge (Center Larger) | Signature (Right Larger) */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          padding: "0 10px",
          height: "115px",
          flexShrink: 0,
          marginBottom: "5px"
        }}>
          {/* Left Bottom: Robot Mascot Graphic & Address */}
          <div style={{ display: "flex", alignItems: "flex-end", spaceX: "10px" }}>
            <img src="/assets/robot_waving.png" alt="Robot Mascot" style={{ height: "100px", width: "auto", objectFit: "contain", marginRight: "10px" }} />
            <div style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: "'Impact', 'Arial Narrow', 'Trebuchet MS', sans-serif",
              color: "#222222",
              textAlign: "left",
              lineHeight: "1.2",
              marginBottom: "6px"
            }}>
              <span style={{ fontSize: "14px", fontWeight: "bold", letterSpacing: "0.5px" }}>PRAYOG INDIA ROBOTICS PVT. LTD.</span>
              <span style={{ fontSize: "13px", fontWeight: "bold", letterSpacing: "0.3px" }}>1st Floor, City Center Mall,</span>
              <span style={{ fontSize: "13px", fontWeight: "bold", letterSpacing: "0.3px" }}>Club Road, Ranchi-834001.</span>
            </div>
          </div>

          {/* Center: ISO Badge (Increased size) */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 10px", marginBottom: "5px" }}>
            <img src="/assets/iso.png" alt="ISO Certified" style={{ width: "150px", height: "95px", objectFit: "contain" }} />
          </div>

          {/* Right: Signature (Increased size) */}
          <div style={{ width: "240px", textAlign: "center", marginBottom: "5px" }}>
            <div style={{ height: "75px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "4px" }}>
              <img src={signatorySignature || "/assets/signature.png"} alt="Signature" style={{ maxHeight: "75px", maxWidth: "220px", objectFit: "contain" }} />
            </div>
            <p style={{ fontSize: "13px", color: "#000", fontWeight: "bold", fontStyle: "italic", fontFamily: "'Georgia', serif", margin: 0 }}>Training and Innovation Cell</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CertificateTemplate;

