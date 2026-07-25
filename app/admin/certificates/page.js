"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  Eye,
  Filter,
  CheckSquare,
  Square,
  ExternalLink,
  Trash2
} from "lucide-react";
import CertificateTemplate from "@/components/CertificateTemplate";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function CertificateManagement() {
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showGenerator, setShowGenerator] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [previewScale, setPreviewScale] = useState(0.5);
  
  // Filters
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterAdmissionDate, setFilterAdmissionDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("issued"); // 'issued', 'pending', or 'all'
  
  // Bulk Actions
  const [selectedItems, setSelectedItems] = useState([]);
  
  // New Cert Form
  const [newCert, setNewCert] = useState({ userId: "", courseId: "", studentName: "", courseName: "" });
  const [certFromDate, setCertFromDate] = useState("");
  const [certToDate, setCertToDate] = useState("");
  const [certInstituteName, setCertInstituteName] = useState("");
  const [showBulkDateModal, setShowBulkDateModal] = useState(false);
  const [studentsList, setStudentsList] = useState([]);
  const [coursesList, setCoursesList] = useState([]);
  const [settings, setSettings] = useState({
    signatory_name: "Authorized Signatory",
    signatory_signature: "/assets/signature.png",
    logo_url: "/assets/logo.png"
  });

  const certificateRef = useRef(null);
  const modalCertificateRef = useRef(null);

  useEffect(() => {
    let ignore = false;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (filterCourse !== "all") params.append("courseId", filterCourse);
        if (filterAdmissionDate) params.append("admissionDate", filterAdmissionDate);
        params.append("status", filterStatus);
        
        const res = await fetch(`/api/certificates?${params.toString()}`);
        const data = await res.json();
        if (!ignore && data.success) {
          setCertificates(data.certificates);
        }
      } catch (error) {
        console.error("Failed to fetch certificates:", error);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    loadData();

    return () => {
      ignore = true;
    };
  }, [filterCourse, filterStatus, filterAdmissionDate]);

  useEffect(() => {
    let ignore = false;

    const loadInitialData = async () => {
      try {
        const [stdRes, crsRes, settingsRes] = await Promise.all([
          fetch("/api/admin/students"),
          fetch("/api/admin/courses"),
          fetch("/api/admin/settings")
        ]);
        const stdData = await stdRes.json();
        const crsData = await crsRes.json();
        const settingsData = await settingsRes.json();
        if (!ignore) {
          if (stdData.success) setStudentsList(stdData.students);
          if (crsData.success) setCoursesList(crsData.courses);
          if (settingsData.success) {
            setSettings({
              signatory_name: settingsData.settings.signatory_name || "Authorized Signatory",
              signatory_signature: settingsData.settings.signatory_signature || "/assets/signature.png",
              logo_url: settingsData.settings.logo_url || "/assets/logo.png"
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };

    loadInitialData();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const updateScale = () => {
      if (showPreviewModal) {
        const container = document.getElementById("modal-preview-container");
        if (container) {
          const width = container.offsetWidth;
          if (width > 0) {
            setPreviewScale(Math.min(width / 1123, 0.8));
          }
        }
      } else {
        const container = document.getElementById("sidebar-preview-container");
        if (container) {
          const width = container.offsetWidth;
          if (width > 0) {
            setPreviewScale(width / 1123);
          }
        }
      }
    };

    const timer = setTimeout(updateScale, 100);
    window.addEventListener("resize", updateScale);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateScale);
    };
  }, [selectedCert, showPreviewModal]);

  const fetchCertificates = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterCourse !== "all") params.append("courseId", filterCourse);
      if (filterAdmissionDate) params.append("admissionDate", filterAdmissionDate);
      params.append("status", filterStatus);
      
      const res = await fetch(`/api/certificates?${params.toString()}`);
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

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    setIsProcessing(true);
    try {
      const res = await fetch("/api/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newCert, fromDate: certFromDate, toDate: certToDate, instituteName: certInstituteName })
      });
      const data = await res.json();
      if (data.success) {
        fetchCertificates();
        setShowGenerator(false);
        setNewCert({ userId: "", courseId: "", studentName: "", courseName: "" });
        setCertFromDate("");
        setCertToDate("");
        setCertInstituteName("");
      }
    } catch (error) {
      alert("Generation failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkGenerate = async (e) => {
    if (e) e.preventDefault();
    if (selectedItems.length === 0) return;
    setIsProcessing(true);
    try {
      const bulkCertificates = selectedItems.map(id => {
        const item = certificates.find(c => (c.id || `${c.user_id}-${c.course_id}`) === id);
        return {
          userId: item.user_id,
          courseId: item.course_id
        };
      });

      const res = await fetch("/api/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bulkCertificates, fromDate: certFromDate, toDate: certToDate, instituteName: certInstituteName })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Successfully generated ${data.results.length} certificates.`);
        setSelectedItems([]);
        setCertFromDate("");
        setCertToDate("");
        setCertInstituteName("");
        setShowBulkDateModal(false);
        fetchCertificates();
      }
    } catch (error) {
      alert("Bulk generation failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPDF = async (cert, isModal = false) => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    if (!isModal) setSelectedCert(cert);
    
    setTimeout(async () => {
      try {
        const element = isModal ? modalCertificateRef.current : certificateRef.current;
        if (!element) {
          throw new Error("Target element not found");
        }
        
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
                try {
                  ctx.clearRect(0, 0, 1, 1);
                  ctx.fillStyle = 'rgba(0,0,0,0)';
                  ctx.fillStyle = match;
                  ctx.fillRect(0, 0, 1, 1);
                  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
                  const rgbaStr = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
                  result = result.split(match).join(rgbaStr);
                } catch (e) {
                  result = result.split(match).join('rgba(0,0,0,0)');
                }
              });
              return result;
            };

            const styleTags = clonedDoc.querySelectorAll('style');
            styleTags.forEach(tag => {
              try {
                if (tag.textContent && (tag.textContent.includes('oklch') || tag.textContent.includes('lab') || tag.textContent.includes('color('))) {
                  tag.textContent = normalizeColorStr(tag.textContent);
                }
              } catch (e) {}
            });

            const inlineStyles = (source, target) => {
              if (!source || !target) return;
              const computed = window.getComputedStyle(source);
              for (let i = 0; i < computed.length; i++) {
                const key = computed[i];
                try {
                  let value = computed.getPropertyValue(key);
                  if (value && (value.includes('oklch') || value.includes('lab') || value.includes('color('))) {
                    value = normalizeColorStr(value);
                  }
                  target.style.setProperty(key, value, computed.getPropertyPriority(key));
                } catch (e) {}
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
      }
    }, 500);
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

  const handleDelete = async (certId) => {
    if (!confirm("Are you sure you want to permanently revoke and delete this certificate record? This action cannot be undone.")) return;
    
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/certificates?id=${certId}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        setCertificates(prev => prev.filter(c => c.id !== certId));
        if (selectedCert?.id === certId) setSelectedCert(null);
      } else {
        alert("Delete failed: " + data.error);
      }
    } catch (error) {
      alert("System failure during deletion");
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredCerts = certificates.filter(c => 
    c.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.student_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.course_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.batch_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.certificate_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelect = (id) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredCerts.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredCerts.map(c => c.id || `${c.user_id}-${c.course_id}`));
    }
  };

  const openPreview = (cert) => {
    setSelectedCert(cert);
    setShowPreviewModal(true);
  };

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

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-grow">
          <div className="flex items-center space-x-2 text-slate-500 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200/80 h-10 shadow-xs">
            <Filter size={14} className="text-navy" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Filters</span>
          </div>
          
          {/* Course Filter */}
          <select 
            value={filterCourse} 
            onChange={(e) => setFilterCourse(e.target.value)} 
            className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:border-navy focus:ring-1 focus:ring-navy outline-none h-10 hover:border-slate-300 transition-all cursor-pointer max-w-[260px] truncate shadow-xs"
          >
            <option value="all">All Courses</option>
            {coursesList.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>

          {/* Status Filter */}
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)} 
            className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:border-navy focus:ring-1 focus:ring-navy outline-none h-10 hover:border-slate-300 transition-all cursor-pointer shadow-xs"
          >
            <option value="issued">Issued Certificates</option>
            <option value="pending">Pending Issuance</option>
            <option value="all">All Records</option>
          </select>

          {/* Admission Date Filter */}
          <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-xl px-3.5 h-10 shadow-xs hover:border-slate-300 transition-all">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">Date:</span>
            <input 
              type="date" 
              title="Admission Date"
              value={filterAdmissionDate} 
              onChange={(e) => setFilterAdmissionDate(e.target.value)} 
              className="bg-transparent text-xs font-semibold text-slate-800 outline-none cursor-pointer"
            />
            {filterAdmissionDate && (
              <button 
                onClick={() => setFilterAdmissionDate("")} 
                className="text-slate-400 hover:text-rose-500 ml-1 text-xs font-bold transition-colors"
                title="Clear date filter"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search student or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 h-10 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-navy focus:bg-white focus:ring-1 focus:ring-navy transition-all placeholder:text-slate-400 font-medium" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main List */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileCheck size={18} className="text-navy" />
                <h3 className="text-base font-semibold text-slate-900">{filterStatus === 'pending' ? 'Pending Issuance' : 'Issuance Records'}</h3>
              </div>
              {selectedItems.length > 0 && (
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-bold text-navy bg-slate-100 px-2.5 py-1 rounded-md">{selectedItems.length} selected</span>
                  <button 
                    onClick={() => setShowBulkDateModal(true)} 
                    disabled={isProcessing} 
                    className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-700 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <Award size={14} />}
                    <span>Bulk Generate ({selectedItems.length})</span>
                  </button>
                  <button 
                    onClick={() => setSelectedItems([])} 
                    className="text-xs text-slate-400 hover:text-slate-600 font-medium underline"
                  >
                    Deselect All
                  </button>
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 w-10">
                      <button onClick={toggleSelectAll} className="text-slate-400 hover:text-navy">
                        {selectedItems.length === filteredCerts.length && filteredCerts.length > 0 ? <CheckSquare size={16} className="text-navy" /> : <Square size={16} />}
                      </button>
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Student & Email</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Admission Date</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Credential ID</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest text-center">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr><td colSpan="6" className="px-6 py-10 text-center"><Loader2 className="animate-spin mx-auto text-navy" size={32} /></td></tr>
                  ) : filteredCerts.length === 0 ? (
                    <tr><td colSpan="6" className="px-6 py-10 text-center text-slate-400 text-sm italic">No credentials found matching your criteria.</td></tr>
                  ) : (
                    filteredCerts.map((cert) => {
                      const itemId = cert.id || `${cert.user_id}-${cert.course_id}`;
                      const isIssued = !!cert.certificate_number;
                      return (
                        <tr key={itemId} className={`group hover:bg-slate-50/50 transition-colors ${selectedItems.includes(itemId) ? 'bg-slate-50' : ''}`}>
                          <td className="px-6 py-4">
                            <button onClick={() => toggleSelect(itemId)} className="text-slate-300 group-hover:text-slate-400 transition-colors">
                              {selectedItems.includes(itemId) ? <CheckSquare size={16} className="text-navy" /> : <Square size={16} />}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-slate-900">{cert.student_name}</span>
                              <span className="text-xs text-slate-400">{cert.student_email}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs text-slate-600 font-medium">
                              {cert.enrolled_at ? new Date(cert.enrolled_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4"><span className="text-xs font-mono font-semibold text-slate-500">{cert.certificate_number || 'PENDING_ID'}</span></td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${isIssued ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                              {isIssued ? 'Issued' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              {isIssued ? (
                                <>
                                  <button onClick={() => openPreview(cert)} className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-navy hover:bg-slate-50 transition-all shadow-sm" title="Open Preview Modal"><Eye size={14} /></button>
                                  <button onClick={() => downloadPDF(cert)} className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-navy hover:bg-slate-50 transition-all shadow-sm" title="Download PDF"><Download size={14} /></button>
                                  <button onClick={() => handleDelete(cert.id)} className="p-2 rounded-lg bg-white border border-slate-200 text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-all shadow-sm" title="Delete Certificate"><Trash2 size={14} /></button>
                                </>
                              ) : (
                                <button onClick={() => { setNewCert({ userId: cert.user_id, courseId: cert.course_id, studentName: cert.student_name, courseName: cert.course_name }); setShowGenerator(true); }} className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-navy text-white text-[10px] font-bold uppercase hover:bg-black transition-all">
                                  <Plus size={12} /><span>Issue Now</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center sticky top-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 self-start">Quick View</h4>
            <div id="sidebar-preview-container" className="w-full relative group overflow-hidden rounded-xl border border-slate-100 bg-slate-50 shadow-inner" style={{ height: selectedCert ? `${794 * previewScale}px` : 'auto' }}>
              {selectedCert ? (
                 <div className="origin-top-left absolute top-0 left-0" style={{ width: '1123px', height: '794px', transform: `scale(${previewScale})` }}>
                    <CertificateTemplate studentName={selectedCert.student_name} courseName={selectedCert.course_name} date={new Date(selectedCert.issue_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} certificateNumber={selectedCert.certificate_number} qrCodeData={selectedCert.qr_code_data} signatoryName={settings.signatory_name} signatorySignature={settings.signatory_signature} fromDate={selectedCert.from_date ? new Date(selectedCert.from_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : ''} toDate={selectedCert.to_date ? new Date(selectedCert.to_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : ''} instituteName={selectedCert.institute_name || ''} logoUrl={settings.logo_url} />
                 </div>
              ) : (
                <div className="w-full aspect-[1.41/1] flex flex-col items-center justify-center text-slate-400 italic text-xs p-10 text-center"><Award size={32} className="mb-2 opacity-20" />Select a record to preview</div>
              )}
            </div>
            {selectedCert && (
              <div className="w-full mt-6 space-y-3">
                <button onClick={() => setShowPreviewModal(true)} className="w-full flex items-center justify-center p-3 bg-navy hover:bg-black rounded-xl transition-all border border-navy text-white gap-2 text-[10px] font-bold uppercase tracking-tight shadow-md"><ExternalLink size={16} className="text-primary" /><span>Open Full Preview</span></button>
              </div>
            )}
          </div>
          <div className="bg-navy rounded-2xl p-6 text-white relative overflow-hidden group shadow-lg">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:scale-125 transition-transform duration-1000" />
            <ShieldCheck className="text-primary mb-4" size={28} /><h3 className="text-base font-bold mb-2">QR Integrity Engine</h3>
            <p className="text-blue-100/60 text-xs leading-relaxed mb-6">All credentials contain dynamic verification tokens linked to the Prayog India secure database for tamper-proof validation.</p>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreviewModal && selectedCert && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPreviewModal(false)} className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh]">
              {/* Left Side: Preview */}
              <div className="flex-grow bg-slate-100 p-6 flex items-center justify-center overflow-auto" id="modal-preview-container">
                <div style={{ width: '1123px', height: '794px', transform: `scale(${previewScale})`, transformOrigin: 'center center', flexShrink: 0 }} ref={modalCertificateRef} className="shadow-2xl">
                  <CertificateTemplate studentName={selectedCert.student_name} courseName={selectedCert.course_name} date={new Date(selectedCert.issue_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} certificateNumber={selectedCert.certificate_number} qrCodeData={selectedCert.qr_code_data} signatoryName={settings.signatory_name} signatorySignature={settings.signatory_signature} fromDate={selectedCert.from_date ? new Date(selectedCert.from_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : ''} toDate={selectedCert.to_date ? new Date(selectedCert.to_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : ''} instituteName={selectedCert.institute_name || ''} logoUrl={settings.logo_url} />
                </div>
              </div>
              {/* Right Side: Actions */}
              <div className="w-full md:w-80 bg-white border-l border-slate-200 p-8 flex flex-col">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-lg font-bold text-slate-900">Credential Details</h3>
                  <button onClick={() => setShowPreviewModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} className="text-slate-400" /></button>
                </div>
                <div className="space-y-6 flex-grow">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student Name</p>
                    <p className="text-sm font-semibold text-slate-900">{selectedCert.student_name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Program Title</p>
                    <p className="text-sm font-semibold text-slate-900">{selectedCert.course_name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Issuance Date</p>
                    <p className="text-sm font-semibold text-slate-900">{new Date(selectedCert.issue_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div className="pt-8 space-y-3">
                    <button onClick={() => downloadPDF(selectedCert, true)} disabled={isDownloading} className="w-full flex items-center justify-center p-4 bg-navy hover:bg-black rounded-xl transition-all text-white gap-3 text-xs font-bold uppercase shadow-lg disabled:opacity-50">
                      {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} className="text-primary" />}
                      <span>{isDownloading ? "Generating PDF..." : "Download High-Res PDF"}</span>
                    </button>

                    <button onClick={() => sendEmail(selectedCert)} className="w-full flex items-center justify-center p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all border border-emerald-100 text-emerald-700 gap-3 text-xs font-bold uppercase">
                      <Mail size={18} /><span>Send Professional Mail</span>
                    </button>
                  </div>
                </div>
                <div className="mt-auto pt-8 border-t border-slate-100">
                  <div className="flex items-center space-x-3 text-emerald-600 bg-emerald-50 p-4 rounded-2xl">
                    <ShieldCheck size={24} />
                    <div>
                      <p className="text-[10px] font-bold uppercase">Integrity Verified</p>
                      <p className="text-[9px] text-emerald-600/70 leading-tight">This certificate matches the record {selectedCert.certificate_number}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hidden container for background PDF rendering */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        {selectedCert && (
          <div ref={certificateRef}>
             <CertificateTemplate studentName={selectedCert.student_name} courseName={selectedCert.course_name} date={new Date(selectedCert.issue_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} certificateNumber={selectedCert.certificate_number} qrCodeData={selectedCert.qr_code_data} signatoryName={settings.signatory_name} signatorySignature={settings.signatory_signature} fromDate={selectedCert.from_date ? new Date(selectedCert.from_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : ''} toDate={selectedCert.to_date ? new Date(selectedCert.to_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : ''} instituteName={selectedCert.institute_name || ''} logoUrl={settings.logo_url} />
          </div>
        )}
      </div>

      {/* Issue Certificate Modal (Original) */}
      <AnimatePresence>
        {showGenerator && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowGenerator(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold text-slate-900">Issue New Credential</h3><button onClick={() => setShowGenerator(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} className="text-slate-400" /></button></div>
                <form onSubmit={handleGenerate} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Program</label>
                    <select
                      required
                      value={newCert.courseId}
                      onChange={(e) => {
                        const crs = coursesList.find(c => c.id == e.target.value);
                        setNewCert({ ...newCert, courseId: e.target.value, courseName: crs?.title, userId: "", studentName: "" });
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-navy outline-none transition-all"
                    >
                      <option value="">Choose a course...</option>
                      {coursesList.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Student</label>
                    <select
                      required
                      disabled={!newCert.courseId}
                      value={newCert.userId}
                      onChange={(e) => {
                        const std = studentsList.find(s => s.id == e.target.value);
                        setNewCert({ ...newCert, userId: e.target.value, studentName: std?.name });
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-navy outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">{newCert.courseId ? "Choose a student..." : "Select a course first"}</option>
                      {newCert.courseId && studentsList
                        .filter(s =>
                          s.enrollments?.some(e =>
                            coursesList.find(c => c.id == newCert.courseId)?.title === e.course_name
                          )
                        )
                        .map(s => <option key={s.id} value={s.id}>{s.name} ({s.email})</option>)
                      }
                    </select>
                    {newCert.courseId && studentsList.filter(s => s.enrollments?.some(e => coursesList.find(c => c.id == newCert.courseId)?.title === e.course_name)).length === 0 && (
                      <p className="text-[10px] text-amber-600 font-medium">No enrolled students found for this course.</p>
                    )}
                  </div>
                  <div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student Institute / School</label><input type="text" placeholder="e.g. Delhi Public School" value={certInstituteName} onChange={(e) => setCertInstituteName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-navy outline-none transition-all" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Program From Date</label><input type="date" value={certFromDate} onChange={(e) => setCertFromDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-navy outline-none transition-all" /></div>
                    <div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Program To Date</label><input type="date" value={certToDate} onChange={(e) => setCertToDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-navy outline-none transition-all" /></div>
                  </div>
                  <button disabled={isProcessing} className="w-full bg-navy text-white py-4 rounded-xl font-bold text-sm hover:bg-black transition-all flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50">{isProcessing ? <Loader2 className="animate-spin" size={18} /> : <Award size={18} className="text-primary" />}<span>Generate &amp; Issue Official Certificate</span></button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bulk Generate Modal */}
      <AnimatePresence>
        {showBulkDateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowBulkDateModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-8">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Bulk Issue Credentials</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Issuing certificates for <span className="font-bold text-navy">{selectedItems.length}</span> selected student(s).</p>
                  </div>
                  <button onClick={() => setShowBulkDateModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} className="text-slate-400" /></button>
                </div>
                <form onSubmit={handleBulkGenerate} className="space-y-5 mt-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student Institute / School</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Delhi Public School" 
                      value={certInstituteName} 
                      onChange={(e) => setCertInstituteName(e.target.value)} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-navy outline-none transition-all" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Program From Date</label>
                      <input 
                        type="date" 
                        required
                        value={certFromDate} 
                        onChange={(e) => setCertFromDate(e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-navy outline-none transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Program To Date</label>
                      <input 
                        type="date" 
                        required
                        value={certToDate} 
                        onChange={(e) => setCertToDate(e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-navy outline-none transition-all" 
                      />
                    </div>
                  </div>
                  <button 
                    type="submit"
                    disabled={isProcessing} 
                    className="w-full bg-navy text-white py-4 rounded-xl font-bold text-sm hover:bg-black transition-all flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 mt-2"
                  >
                    {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <Award size={18} className="text-primary" />}
                    <span>Generate &amp; Issue {selectedItems.length} Certificates</span>
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
