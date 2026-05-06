"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react";

const CertificateTemplate = ({
  studentName = "Student Name",
  courseName = "Course Name",
  date = "April 29, 2026",
  certificateNumber = "PR-2026-0000",
  qrCodeData = "https://prayogindia.in/verify/PR-2026-0000",
}) => {
  return (
    <div
      id="certificate-to-print"
      style={{
        position: "relative",
        width: "1123px",
        height: "794px",
        backgroundColor: "#051329", // Deep premium blue background
        backgroundImage: "radial-gradient(circle at center, #0a2240 0%, #051329 100%)",
        fontFamily: "'Georgia', 'Times New Roman', serif",
        overflow: "hidden",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
      }}
    >
      {/* Outer Border */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          right: "20px",
          bottom: "20px",
          border: "2px solid #C9A24A",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      
      {/* Inner Border */}
      <div
        style={{
          position: "absolute",
          top: "30px",
          left: "30px",
          right: "30px",
          bottom: "30px",
          border: "1px solid rgba(201, 162, 74, 0.4)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Background Decorative Pattern / Watermark */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 0, opacity: 0.05 }}>
        <img src="/assets/logo.png" alt="" style={{ width: "600px", filter: "invert(1)" }} />
      </div>

      <div style={{ zIndex: 2, width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
        
        {/* Header Section */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px", marginBottom: "30px" }}>
          <img
            src="/assets/logo.png"
            alt="Prayog India"
            style={{ height: "70px", filter: "brightness(0) invert(1)", marginBottom: "15px" }}
          />
          <p style={{ color: "#C9A24A", fontSize: "12px", letterSpacing: "6px", textTransform: "uppercase", margin: 0, fontFamily: "'Arial', sans-serif", fontWeight: "600" }}>
            Prayog India
          </p>
        </div>

        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{ fontSize: "52px", fontWeight: "400", color: "#FFFFFF", letterSpacing: "8px", textTransform: "uppercase", margin: "0 0 10px 0", textShadow: "0px 2px 10px rgba(0,0,0,0.5)" }}>
            Certificate
          </h1>
          <p style={{ fontSize: "16px", color: "#C9A24A", letterSpacing: "12px", textTransform: "uppercase", margin: 0, fontWeight: "400", fontFamily: "'Arial', sans-serif" }}>
            Of Achievement
          </p>
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", width: "400px", marginBottom: "30px" }}>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, #C9A24A)" }} />
          <svg width="20" height="20" viewBox="0 0 24 24" style={{ margin: "0 15px", fill: "#C9A24A" }}>
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(270deg, transparent, #C9A24A)" }} />
        </div>

        {/* Certify Text */}
        <p style={{ fontSize: "14px", color: "#A0B2C6", letterSpacing: "3px", textTransform: "uppercase", margin: "0 0 15px 0", fontFamily: "'Arial', sans-serif" }}>
          This is proudly presented to
        </p>

        {/* Student Name */}
        <h2 style={{ fontSize: "64px", fontWeight: "700", color: "#FFFFFF", margin: "0 0 15px 0", fontFamily: "'Georgia', serif", fontStyle: "italic", textShadow: "0px 2px 15px rgba(255,255,255,0.2)" }}>
          {studentName}
        </h2>

        {/* Reason Text */}
        <p style={{ fontSize: "16px", color: "#A0B2C6", margin: "0 0 15px 0", fontFamily: "'Arial', sans-serif", maxWidth: "700px", textAlign: "center", lineHeight: "1.6" }}>
          For successfully completing the comprehensive training program and demonstrating exceptional skills and understanding in the field of
        </p>

        {/* Course Name */}
        <h3 style={{ fontSize: "28px", fontWeight: "600", color: "#C9A24A", textTransform: "uppercase", letterSpacing: "4px", margin: "0 0 40px 0", fontFamily: "'Arial', sans-serif" }}>
          {courseName}
        </h3>

        {/* Footer Section */}
        <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%", padding: "0 20px", marginTop: "auto", marginBottom: "10px", height: "160px" }}>
          
          {/* Left Area: QR & Details */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "220px" }}>
            <div style={{ background: "#FFFFFF", padding: "8px", borderRadius: "8px", marginBottom: "10px", boxShadow: "0 4px 15px rgba(0,0,0,0.3)" }}>
              <QRCodeSVG value={qrCodeData} size={85} bgColor="#ffffff" fgColor="#051329" level="M" />
            </div>
            <p style={{ color: "#A0B2C6", fontSize: "11px", margin: "0 0 5px 0", fontFamily: "'Courier New', monospace", fontWeight: "bold", letterSpacing: "1px" }}>
              ID: {certificateNumber}
            </p>
            <p style={{ color: "#C9A24A", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", margin: 0, fontFamily: "'Arial', sans-serif" }}>
              Scan to Verify
            </p>
          </div>

          {/* Center Area: Official Seal (Absolutely positioned for perfect centering) */}
          <div style={{ position: "absolute", left: "50%", bottom: "0", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
            <img 
              src="/assets/gold_seal.png" 
              alt="Official Seal" 
              style={{ width: "140px", height: "140px", objectFit: "contain", dropShadow: "0 10px 20px rgba(0,0,0,0.5)" }} 
            />
          </div>

          {/* Right Area: Date & Signature */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "40px", width: "400px", paddingBottom: "10px" }}>
            {/* Date */}
            <div style={{ textAlign: "center", width: "160px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <p style={{ fontSize: "16px", color: "#FFFFFF", fontWeight: "600", margin: "0 0 8px 0", fontFamily: "'Arial', sans-serif" }}>
                {date}
              </p>
              <div style={{ width: "100%", height: "1.5px", background: "#C9A24A", marginBottom: "8px" }} />
              <p style={{ margin: 0, fontSize: "10px", color: "#A0B2C6", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'Arial', sans-serif" }}>
                Date of Issue
              </p>
            </div>
            {/* Signature */}
            <div style={{ textAlign: "center", width: "180px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <div style={{ height: "60px", display: "flex", alignItems: "flex-end", justifyContent: "center", marginBottom: "8px" }}>
                <img 
                  src="/assets/signature.png" 
                  alt="Authorized Signature" 
                  style={{ maxHeight: "60px", maxWidth: "160px", objectFit: "contain", mixBlendMode: "screen", filter: "brightness(1.5) contrast(1.2)" }} 
                />
              </div>
              <div style={{ width: "100%", height: "1.5px", background: "#C9A24A", marginBottom: "8px" }} />
              <p style={{ margin: 0, fontSize: "10px", color: "#A0B2C6", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'Arial', sans-serif" }}>
                Authorized Signature
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateTemplate;
