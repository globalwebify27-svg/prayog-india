"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react";

const CertificateTemplate = ({
  studentName = "Student Name",
  courseName = "Course Name",
  date = "April 29, 2026",
  certificateNumber = "PR-2026-0000",
  qrCodeData = "https://prayogindiarobotics.com/verify/PR-2026-0000",
}) => {
  return (
    <div
      id="certificate-to-print"
      style={{
        position: "relative",
        width: "1123px",
        height: "794px",
        backgroundColor: "#051329",
        backgroundImage: "radial-gradient(circle at center, #0a2240 0%, #051329 100%)",
        fontFamily: "'Georgia', 'Times New Roman', serif",
        overflow: "hidden",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        padding: "40px",
      }}
    >
      {/* Borders */}
      <div style={{ position: "absolute", top: "20px", left: "20px", right: "20px", bottom: "20px", border: "2px solid #C9A24A", pointerEvents: "none", zIndex: 1 }} />
      <div style={{ position: "absolute", top: "30px", left: "30px", right: "30px", bottom: "30px", border: "1px solid rgba(201, 162, 74, 0.4)", pointerEvents: "none", zIndex: 1 }} />

      {/* Watermark */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 0, opacity: 0.03 }}>
        <img src="/assets/logo.png" alt="" style={{ width: "600px" }} />
      </div>

      {/* Main Content Container */}
      <div style={{ 
        zIndex: 2, 
        width: "100%", 
        height: "100%", 
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "space-between",
        position: "relative" 
      }}>
        
        {/* Top Section: Logo & Title */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "15px" }}>
            <img src="/assets/logo.png" alt="Prayog India" style={{ height: "65px", objectFit: "contain", marginBottom: "5px" }} />
            <p style={{ color: "#C9A24A", fontSize: "10px", letterSpacing: "5px", textTransform: "uppercase", margin: 0, fontWeight: "600", fontFamily: "'Arial', sans-serif" }}>The World of Robotics</p>
          </div>

          <div style={{ textAlign: "center", marginBottom: "10px" }}>
            <h1 style={{ fontSize: "52px", fontWeight: "400", color: "#FFFFFF", letterSpacing: "12px", textTransform: "uppercase", margin: "0 0 15px 0", lineHeight: "1.2" }}>Certificate</h1>
            <p style={{ fontSize: "14px", color: "#C9A24A", letterSpacing: "10px", textTransform: "uppercase", margin: 0, fontWeight: "400", fontFamily: "'Arial', sans-serif" }}>Of Achievement</p>
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", width: "400px", marginBottom: "20px" }}>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, #C9A24A)" }} />
            <svg width="20" height="20" viewBox="0 0 24 24" style={{ margin: "0 15px", fill: "#C9A24A" }}>
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(270deg, transparent, #C9A24A)" }} />
          </div>
        </div>

        {/* Middle Section: Recipient & Course */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, justifyContent: "center" }}>
          <p style={{ fontSize: "14px", color: "#A0B2C6", letterSpacing: "3px", textTransform: "uppercase", margin: "0 0 15px 0", fontFamily: "'Arial', sans-serif" }}>This is proudly presented to</p>
          <h2 style={{ fontSize: "64px", fontWeight: "700", color: "#FFFFFF", margin: "0 0 20px 0", fontStyle: "italic" }}>{studentName}</h2>
          
          <p style={{ fontSize: "15px", color: "#A0B2C6", margin: "0 0 15px 0", lineHeight: "1.6", maxWidth: "800px", textAlign: "center", fontFamily: "'Arial', sans-serif" }}>
            For successfully completing the comprehensive training program and demonstrating exceptional skills and understanding in the field of
          </p>
          <h3 style={{ fontSize: "28px", fontWeight: "600", color: "#C9A24A", textTransform: "uppercase", letterSpacing: "4px", margin: 0, fontFamily: "'Arial', sans-serif" }}>{courseName}</h3>
        </div>

        {/* Bottom Section: Footer (QR, Seal, Signatures) */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "flex-end",
          width: "100%",
          paddingTop: "20px",
          height: "160px",
          position: "relative"
        }}>
          
          {/* Left Area: QR Code */}
          <div style={{ width: "200px", display: "flex", flexDirection: "column", alignItems: "flex-start", paddingLeft: "10px" }}>
            <div style={{ background: "#FFFFFF", padding: "8px", borderRadius: "8px", marginBottom: "8px" }}>
              <QRCodeSVG value={qrCodeData} size={75} bgColor="#ffffff" fgColor="#051329" level="M" />
            </div>
            <p style={{ color: "#A0B2C6", fontSize: "11px", margin: "0 0 4px 0", fontWeight: "bold", fontFamily: "'Courier New', monospace" }}>{certificateNumber}</p>
            <p style={{ color: "#C9A24A", fontSize: "9px", letterSpacing: "1px", textTransform: "uppercase", margin: 0, fontFamily: "'Arial', sans-serif" }}>Scan to Verify</p>
          </div>

          {/* Center Area: Official Seal */}
          <div style={{ 
            position: "absolute", 
            left: "50%", 
            bottom: "0", 
            transform: "translateX(-50%)", 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center" 
          }}>
            <img src="/assets/gold_seal.png" alt="Official Seal" style={{ width: "140px", height: "140px", objectFit: "contain" }} />
          </div>

          {/* Right Area: Signatures */}
          <div style={{ display: "flex", gap: "40px", alignItems: "flex-end", paddingRight: "10px" }}>
            <div style={{ width: "150px", textAlign: "center" }}>
              <p style={{ fontSize: "16px", color: "#FFFFFF", fontWeight: "600", margin: "0 0 8px 0", fontFamily: "'Arial', sans-serif" }}>{date}</p>
              <div style={{ width: "100%", height: "1px", background: "#C9A24A", marginBottom: "8px" }} />
              <p style={{ fontSize: "10px", color: "#A0B2C6", letterSpacing: "1px", textTransform: "uppercase", margin: 0, fontFamily: "'Arial', sans-serif" }}>Date of Issue</p>
            </div>
            <div style={{ width: "150px", textAlign: "center" }}>
              <div style={{ height: "60px", display: "flex", alignItems: "flex-end", justifyContent: "center", marginBottom: "8px" }}>
                <img src="/assets/signature.png" alt="Signature" style={{ maxHeight: "60px", maxWidth: "140px", objectFit: "contain", filter: "brightness(1.5)" }} />
              </div>
              <div style={{ width: "100%", height: "1px", background: "#C9A24A", marginBottom: "8px" }} />
              <p style={{ fontSize: "10px", color: "#A0B2C6", letterSpacing: "1px", textTransform: "uppercase", margin: 0, fontFamily: "'Arial', sans-serif" }}>Authorized Signature</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CertificateTemplate;
