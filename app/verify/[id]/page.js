"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, Download, Printer, Loader2, AlertCircle } from "lucide-react";
import CertificateTemplate from "@/components/CertificateTemplate";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function VerifyCertificate() {
  const { id } = useParams();
  const [cert, setCert] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCertificate();
    }
  }, [id]);

  const fetchCertificate = async () => {
    try {
      const res = await fetch(`/api/certificates/verify?certNo=${id}`);
      const data = await res.json();
      if (data.success) {
        setCert(data.certificate);
      } else {
        setError(data.error || "Certificate not found");
      }
    } catch (err) {
      setError("Failed to verify certificate");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = async () => {
    setIsDownloading(true);
    try {
      const element = document.getElementById("certificate-to-print");
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: "#051329",
        windowWidth: 1123,
        windowHeight: 794,
        onclone: (clonedDoc) => {
          // Step 1: Disable all stylesheets to prevent Tailwind v4 lab()/oklch() color crash
          Array.from(clonedDoc.querySelectorAll('style, link[rel="stylesheet"]'))
            .forEach(s => { s.disabled = true; });

          // Step 2: Serialize every SVG element (e.g. QR code) to a base64 <img>.
          // html2canvas crashes when it parses computed styles on SVGElementContainer
          // that inherit lab() / oklch() colors. Converting to an img avoids this entirely.
          Array.from(clonedDoc.querySelectorAll('svg')).forEach(svg => {
            try {
              const w = svg.getAttribute('width') || svg.viewBox?.baseVal?.width || 100;
              const h = svg.getAttribute('height') || svg.viewBox?.baseVal?.height || 100;
              const svgXml = new XMLSerializer().serializeToString(svg);
              const b64 = btoa(unescape(encodeURIComponent(svgXml)));
              const img = clonedDoc.createElement('img');
              img.src = 'data:image/svg+xml;base64,' + b64;
              img.width = w;
              img.height = h;
              img.style.display = svg.style.display || 'block';
              svg.parentNode?.replaceChild(img, svg);
            } catch (e) { /* skip non-serialisable SVGs */ }
          });
        }
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`PrayogIndia_${cert.certificate_number}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-navy" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md border border-slate-200">
          <AlertCircle size={64} className="text-rose-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Verification Failed</h1>
          <p className="text-slate-500 mb-8">{error}</p>
          <a href="/" className="inline-block bg-navy text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all">
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6 font-body">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Verification Banner */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-600 text-white p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between shadow-lg shadow-emerald-200"
        >
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="bg-white/20 p-3 rounded-2xl">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Authenticity Verified</h2>
              <p className="text-emerald-100 text-sm">This is an official document issued by Prayog India academic council.</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={downloadPDF}
              disabled={isDownloading}
              className="bg-white text-emerald-700 px-6 py-2.5 rounded-xl font-bold text-sm flex items-center space-x-2 hover:bg-emerald-50 transition-all shadow-sm disabled:opacity-50"
            >
              {isDownloading ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
              <span>Download Official Copy</span>
            </button>
          </div>
        </motion.div>

        {/* Certificate Display */}
        <div className="flex justify-center overflow-x-auto py-10">
          <div className="scale-[0.6] sm:scale-[0.8] lg:scale-100 origin-center">
            <CertificateTemplate 
              studentName={cert.student_name}
              courseName={cert.course_name}
              date={new Date(cert.issue_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              certificateNumber={cert.certificate_number}
              qrCodeData={cert.qr_code_data}
            />
          </div>
        </div>

        {/* Details Section */}
        <div className="grid md:grid-cols-3 gap-8">
           <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Recipient</h4>
              <p className="text-xl font-bold text-slate-900">{cert.student_name}</p>
              <p className="text-sm text-slate-500 mt-1">Certified Student</p>
           </div>
           <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Program</h4>
              <p className="text-xl font-bold text-slate-900">{cert.course_name}</p>
              <p className="text-sm text-slate-500 mt-1">Professional Certification</p>
           </div>
           <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Issuance</h4>
              <p className="text-xl font-bold text-slate-900">{cert.certificate_number}</p>
              <p className="text-sm text-slate-500 mt-1">Dated: {new Date(cert.issue_date).toDateString()}</p>
           </div>
        </div>
      </div>
    </div>
  );
}
