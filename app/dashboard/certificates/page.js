"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Award, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  Search,
  CheckCircle2,
  Calendar,
  Bookmark,
  Shield,
  Loader2
} from "lucide-react";
import Link from "next/link";
import CertificateTemplate from "@/components/CertificateTemplate";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedCertForDownload, setSelectedCertForDownload] = useState(null);
  
  const certificateRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const userRes = await fetch("/api/auth/me");
      const userData = await userRes.json();
      
      if (userData.success) {
        setUser(userData.user);
        const certRes = await fetch(`/api/certificates?userId=${userData.user.id}`);
        const certData = await certRes.json();
        if (certData.success) {
          setCertificates(certData.certificates);
        }
      }
    } catch (error) {
      console.error("Error fetching certificates:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async (cert) => {
    if (isDownloading) return;
    setIsDownloading(true);
    setSelectedCertForDownload(cert);
    
    setTimeout(async () => {
      try {
        const element = certificateRef.current;
        if (!element) throw new Error("Target element not found");
        
        const canvas = await html2canvas(element, { 
          scale: 3,
          useCORS: true,
          logging: false,
          backgroundColor: "#051329",
          windowWidth: 1123,
          windowHeight: 794,
          onclone: (clonedDoc, elementNode) => {
            const dummyCanvas = document.createElement('canvas');
            dummyCanvas.width = 1;
            dummyCanvas.height = 1;
            const ctx = dummyCanvas.getContext('2d', { willReadFrequently: true });
            
            const normalizeColorStr = (str) => {
              if (!str || typeof str !== 'string') return str;
              const matches = str.match(/(?:oklch|lab|oklab|lch|color)\((?:[^)(]+|\([^)(]*\))*\)/g);
              if (!matches) return str;
              
              let result = str;
              matches.forEach(match => {
                ctx.clearRect(0, 0, 1, 1);
                ctx.fillStyle = 'rgba(0,0,0,0)';
                ctx.fillStyle = match;
                ctx.fillRect(0, 0, 1, 1);
                const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
                const rgbaStr = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
                result = result.split(match).join(rgbaStr);
              });
              return result;
            };

            // Sanitize style tags
            const styleTags = clonedDoc.querySelectorAll('style');
            styleTags.forEach(tag => {
              try {
                if (tag.innerHTML && tag.innerHTML.match(/(oklch|lab|oklab|lch|color)\(/)) {
                  tag.innerHTML = normalizeColorStr(tag.innerHTML);
                }
              } catch (e) {}
            });

            // Remove external stylesheets to prevent html2canvas parsing errors
            const linkTags = clonedDoc.querySelectorAll('link[rel="stylesheet"]');
            linkTags.forEach(tag => {
              if (tag.href && !tag.href.includes('fonts.googleapis.com')) {
                tag.remove();
              }
            });

            const inlineStyles = (source, target) => {
              if (!source || !target) return;
              const computed = window.getComputedStyle(source);
              for (let i = 0; i < computed.length; i++) {
                const key = computed[i];
                let value = computed.getPropertyValue(key);
                if (value && (value.includes('oklch') || value.includes('lab') || value.includes('color('))) {
                  value = normalizeColorStr(value);
                }
                try {
                  target.style[key] = value;
                } catch(e) {}
              }
              for (let i = 0; i < source.children.length; i++) {
                if (target.children[i]) {
                  inlineStyles(source.children[i], target.children[i]);
                }
              }
            };

            if (elementNode) {
              const cloneElement = clonedDoc.getElementById('certificate-to-print');
              if (cloneElement) {
                cloneElement.style.transform = 'none';
                cloneElement.style.position = 'relative';
                cloneElement.style.left = '0';
                cloneElement.style.top = '0';
              }
              inlineStyles(element, elementNode);
              const allElements = clonedDoc.body.querySelectorAll('*');
              allElements.forEach(el => {
                if (!elementNode.contains(el) && el !== elementNode && !el.contains(elementNode) && el.tagName !== 'STYLE' && el.tagName !== 'LINK' && el.tagName !== 'SCRIPT') {
                  el.setAttribute('data-html2canvas-ignore', 'true');
                }
              });
            }
          }
        });
        
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("l", "mm", "a4");
        pdf.addImage(imgData, "PNG", 0, 0, 297, 210);
        pdf.save(`${cert.student_name.replace(/\s+/g, '_')}_Certificate.pdf`);
      } catch (error) {
        console.error("PDF generation failed:", error);
        alert("Failed to generate PDF. Please try again.");
      } finally {
        setIsDownloading(false);
        setSelectedCertForDownload(null);
      }
    }, 500);
  };

  const filteredCertificates = certificates.filter(c => 
    c.course_name.toLowerCase().includes(search.toLowerCase()) || 
    c.certificate_number.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-body pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Institutional Credentials</h1>
          <p className="text-slate-500 text-sm mt-1">Download and manage your academic certifications and digital IDs.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Filter by Course or ID..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-navy transition-all w-48 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left - Info & Verification */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-navy rounded-3xl p-8 text-white relative overflow-hidden shadow-lg border border-white/5">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 blur-2xl" />
            <Award className="text-primary mb-6" size={48} />
            <h2 className="text-xl font-bold mb-4 leading-tight">Professional Recognition</h2>
            <p className="text-white/60 text-xs leading-relaxed mb-8 font-medium">
              Your achievements are validated by Prayog India's institutional ledger, ensuring global recognition for your STEM and robotics expertise.
            </p>
            
            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex items-center space-x-3">
                <ShieldCheck className="text-primary" size={16} />
                <span className="text-[11px] font-bold uppercase tracking-wider text-white/80">ISO 9001:2015 certified</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="text-primary" size={16} />
                <span className="text-[11px] font-bold uppercase tracking-wider text-white/80">QR-Code Verifiable</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-6">Validation Network</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                <span className="text-[9px] font-bold text-slate-400 uppercase text-center">Industry Accredited</span>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                <span className="text-[9px] font-bold text-slate-400 uppercase text-center">Global Standard</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Certificate List */}
        <div className="lg:col-span-8 space-y-6">
          {loading ? (
            <div className="py-24 bg-white rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-center shadow-sm">
              <Loader2 className="text-navy animate-spin mb-4" size={32} />
              <p className="text-slate-500 text-sm font-medium">Syncing credentials...</p>
            </div>
          ) : filteredCertificates.length === 0 ? (
            <div className="py-24 bg-white rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-200 flex items-center justify-center mb-6">
                <Award size={48} />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">No credentials found</h4>
              <p className="text-slate-500 text-sm max-w-xs mx-auto italic">Complete your course assessments and verify your attendance to earn certification.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCertificates.map((cert, i) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-[2rem] p-5 md:p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center space-x-6 w-full md:w-auto">
                      <div className="w-14 h-20 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center relative overflow-hidden group-hover:bg-navy transition-all shadow-inner shrink-0">
                        <Bookmark className="text-slate-200 group-hover:text-primary transition-colors" size={32} />
                      </div>
                      <div className="flex-grow">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h3 className="text-base font-bold text-slate-900 leading-tight">{cert.course_name}</h3>
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[9px] font-bold uppercase border border-emerald-100">Verified</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-[10px] font-semibold text-slate-400 uppercase tracking-tight">
                          <span className="flex items-center gap-1.5"><Calendar size={12} className="text-slate-300" /> {new Date(cert.issue_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                          <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-slate-300" /> {cert.certificate_number}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                      <Link 
                        href={`/verify/${cert.certificate_number}`}
                        target="_blank"
                        className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-3 rounded-xl border border-slate-200 text-slate-500 font-bold text-[10px] uppercase hover:bg-slate-50 transition-all"
                      >
                        <ExternalLink size={14} />
                        <span>Verify</span>
                      </Link>
                      <button 
                        onClick={() => downloadPDF(cert)}
                        disabled={isDownloading}
                        className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-3 bg-navy text-white font-bold text-[10px] uppercase shadow-lg shadow-navy/10 rounded-xl hover:bg-black transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:translate-y-0"
                      >
                        {isDownloading && selectedCertForDownload?.id === cert.id ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                        <span>{isDownloading && selectedCertForDownload?.id === cert.id ? "Preparing..." : "Download"}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-navy shadow-sm border border-slate-100">
                <CheckCircle2 size={20} />
              </div>
              <p className="text-xs font-semibold text-slate-600">Request physical copies or hard-cover diploma?</p>
            </div>
            <button className="text-[10px] font-black text-navy hover:text-black uppercase tracking-widest bg-white px-5 py-2.5 rounded-lg border border-slate-200 shadow-sm transition-all hover:shadow-md">Contact registrar &rarr;</button>
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        {selectedCertForDownload && (
          <div ref={certificateRef}>
             <CertificateTemplate 
                studentName={selectedCertForDownload.student_name} 
                courseName={selectedCertForDownload.course_name} 
                date={new Date(selectedCertForDownload.issue_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} 
                certificateNumber={selectedCertForDownload.certificate_number} 
                qrCodeData={selectedCertForDownload.qr_code_data} 
             />
          </div>
        )}
      </div>
    </div>
  );
}
