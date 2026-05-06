"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Award, 
  QrCode, 
  Printer, 
  Download, 
  Search, 
  CheckCircle2, 
  ShieldCheck,
  FileCheck,
  Mail,
  Plus,
  Loader2,
  X,
  Eye
} from "lucide-react";
import CertificateTemplate from "@/components/CertificateTemplate";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function CertificateManagement() {
  const [activeTab, setActiveTab] = useState("Certificates");
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showGenerator, setShowGenerator] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [previewScale, setPreviewScale] = useState(0.25);
  
  // New Cert Form
  const [newCert, setNewCert] = useState({ userId: "", courseId: "", studentName: "", courseName: "" });
  const [studentsList, setStudentsList] = useState([]);
  const [coursesList, setCoursesList] = useState([]);

  const certificateRef = useRef(null);

  useEffect(() => {
    fetchCertificates();
    fetchInitialData();
  }, []);

  useEffect(() => {
    const updateScale = () => {
      const container = document.getElementById("preview-container");
      if (container) {
        const width = container.offsetWidth;
        setPreviewScale(width / 1123);
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [selectedCert]);

  const fetchCertificates = async () => {
    try {
      const res = await fetch("/api/certificates");
      const data = await res.json();
      if (data.success) {
        setCertificates(data.certificates);
      }
    } catch (error) {
      console.error("Failed to fetch certificates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInitialData = async () => {
    try {
      const [stdRes, crsRes] = await Promise.all([
        fetch("/api/admin/students"),
        fetch("/api/admin/courses")
      ]);
      const stdData = await stdRes.json();
      const crsData = await crsRes.json();
      if (stdData.success) setStudentsList(stdData.students);
      if (crsData.success) setCoursesList(crsData.courses);
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const res = await fetch("/api/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCert)
      });
      const data = await res.json();
      if (data.success) {
        fetchCertificates();
        setShowGenerator(false);
        setNewCert({ userId: "", courseId: "", studentName: "", courseName: "" });
      }
    } catch (error) {
      alert("Generation failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPDF = async (cert) => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    setSelectedCert(cert);
    
    // Give it a moment to render in the hidden container
    setTimeout(async () => {
      try {
        const element = certificateRef.current;
        if (!element) {
          throw new Error("Target element not found");
        }
        
        const canvas = await html2canvas(element, { 
          scale: 3, // High resolution
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
        pdf.save(`${cert.student_name.replace(/\s+/g, '_')}_Certificate.pdf`);
      } catch (error) {
        console.error("PDF generation failed:", error);
        alert("Failed to generate PDF. Please try again.");
      } finally {
        setIsDownloading(false);
      }
    }, 1000);
  };

  const sendEmail = async (cert) => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/certificates/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ certId: cert.id })
      });
      const data = await res.json();
      if (data.success) {
        alert("Professional email sent successfully!");
      } else {
        alert("Failed to send email: " + data.error);
      }
    } catch (error) {
      alert("Email service error");
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredCerts = certificates.filter(c => 
    c.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.course_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.certificate_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 font-body">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Academic Credentials</h1>
          <p className="text-slate-500 text-sm mt-1">Manage QR-validated certificates and official student identification.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowGenerator(true)}
            className="flex items-center space-x-2 bg-navy text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-black transition-all shadow-sm"
          >
            <Plus size={16} className="text-primary" />
            <span>Issue Certificate</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main List */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileCheck size={18} className="text-navy" />
                <h3 className="text-base font-semibold text-slate-900">Issuance Records</h3>
              </div>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search records..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-navy focus:bg-white transition-all w-40 md:w-56" 
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Student & Program</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Credential ID</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest text-center">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-10 text-center">
                        <Loader2 className="animate-spin mx-auto text-navy" size={32} />
                      </td>
                    </tr>
                  ) : filteredCerts.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-10 text-center text-slate-400 text-sm italic">
                        No credentials found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredCerts.map((cert) => (
                      <tr key={cert.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-900">{cert.student_name}</span>
                            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">{cert.course_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-mono font-semibold text-slate-500">{cert.certificate_number}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border bg-emerald-50 text-emerald-700 border-emerald-100`}>
                            Issued
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button 
                              onClick={() => setSelectedCert(cert)}
                              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-navy hover:bg-slate-50 transition-all shadow-sm"
                              title="Preview"
                            >
                              <Eye size={14} />
                            </button>
                            <button 
                              onClick={() => downloadPDF(cert)}
                              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-navy hover:bg-slate-50 transition-all shadow-sm"
                              title="Download PDF"
                            >
                              <Download size={14} />
                            </button>
                            <button 
                              onClick={() => sendEmail(cert)}
                              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all shadow-sm"
                              title="Send Professional Email"
                            >
                              <Mail size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar / Tools */}
        <div className="space-y-6">
          {/* Document Preview Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 self-start">Live Credential Preview</h4>
            
            <div id="preview-container" className="w-full relative group overflow-hidden rounded-xl border border-slate-100 bg-slate-50 shadow-inner" style={{ height: selectedCert ? `${794 * previewScale}px` : 'auto' }}>
              {selectedCert ? (
                 <div 
                   className="origin-top-left absolute top-0 left-0" 
                   style={{ 
                     width: '1123px', 
                     height: '794px',
                     transform: `scale(${previewScale})` 
                   }}
                 >
                    <CertificateTemplate 
                      studentName={selectedCert.student_name}
                      courseName={selectedCert.course_name}
                      date={new Date(selectedCert.issue_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      certificateNumber={selectedCert.certificate_number}
                      qrCodeData={selectedCert.qr_code_data}
                    />
                 </div>
              ) : (
                <div className="w-full aspect-[1.41/1] flex flex-col items-center justify-center text-slate-400 italic text-xs p-10 text-center">
                  <Award size={32} className="mb-2 opacity-20" />
                  Select a certificate to preview digital rendering
                </div>
              )}
            </div>

            {selectedCert && (
              <div className="w-full mt-6 space-y-3">
                <button 
                  onClick={() => downloadPDF(selectedCert)}
                  disabled={isDownloading}
                  className="w-full flex items-center justify-center p-3 bg-navy hover:bg-black rounded-xl transition-all border border-navy text-white gap-2 text-[10px] font-bold uppercase tracking-tight shadow-md disabled:opacity-70"
                >
                  {isDownloading ? (
                    <Loader2 size={16} className="animate-spin text-primary" />
                  ) : (
                    <Download size={16} className="text-primary" />
                  )}
                  <span>{isDownloading ? "Generating PDF..." : "Export High-Res PDF"}</span>
                </button>
                <button 
                  onClick={() => sendEmail(selectedCert)}
                  className="w-full flex items-center justify-center p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all border border-slate-100 text-navy gap-2 text-[10px] font-bold uppercase tracking-tight shadow-sm"
                >
                  <Mail size={16} />
                  <span>Send Professional Mail</span>
                </button>
              </div>
            )}
          </div>

          {/* Verification Badge */}
          <div className="bg-navy rounded-2xl p-6 text-white relative overflow-hidden group shadow-lg">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:scale-125 transition-transform duration-1000" />
            <ShieldCheck className="text-primary mb-4" size={28} />
            <h3 className="text-base font-bold mb-2">QR Integrity Engine</h3>
            <p className="text-blue-100/60 text-xs leading-relaxed mb-6">
              All credentials contain dynamic verification tokens linked to the Prayog India secure database for tamper-proof validation.
            </p>
          </div>
        </div>
      </div>

      {/* Hidden container for PDF rendering */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        {selectedCert && (
          <div ref={certificateRef}>
             <CertificateTemplate 
                studentName={selectedCert.student_name}
                courseName={selectedCert.course_name}
                date={new Date(selectedCert.issue_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                certificateNumber={selectedCert.certificate_number}
                qrCodeData={selectedCert.qr_code_data}
              />
          </div>
        )}
      </div>

      {/* Issue Certificate Modal */}
      <AnimatePresence>
        {showGenerator && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGenerator(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900">Issue New Credential</h3>
                  <button onClick={() => setShowGenerator(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <X size={20} className="text-slate-400" />
                  </button>
                </div>

                <form onSubmit={handleGenerate} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Student</label>
                    <select 
                      required
                      value={newCert.userId}
                      onChange={(e) => {
                        const std = studentsList.find(s => s.id == e.target.value);
                        setNewCert({...newCert, userId: e.target.value, studentName: std?.name});
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-navy outline-none transition-all"
                    >
                      <option value="">Choose a student...</option>
                      {studentsList.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Program</label>
                    <select 
                      required
                      value={newCert.courseId}
                      onChange={(e) => {
                        const crs = coursesList.find(c => c.id == e.target.value);
                        setNewCert({...newCert, courseId: e.target.value, courseName: crs?.title});
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-navy outline-none transition-all"
                    >
                      <option value="">Choose a course...</option>
                      {coursesList.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>

                  <button 
                    disabled={isProcessing}
                    className="w-full bg-navy text-white py-4 rounded-xl font-bold text-sm hover:bg-black transition-all flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
                  >
                    {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <Award size={18} className="text-primary" />}
                    <span>Generate & Issue Official Certificate</span>
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
