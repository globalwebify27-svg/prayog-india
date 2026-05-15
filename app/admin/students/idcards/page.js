"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IdCard, 
  Search, 
  Download, 
  Printer, 
  Loader2, 
  User, 
  ChevronRight,
  Filter,
  ShieldCheck,
  Award,
  RefreshCcw,
  ExternalLink
} from "lucide-react";
import IdCardTemplate from "@/components/IdCardTemplate";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useSettings } from "@/components/SettingsContext";

export default function IdCardManagement() {
  const settings = useSettings();
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [issuedFilter, setIssuedFilter] = useState("all"); // all, issued, pending
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedBulk, setSelectedBulk] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isIssuing, setIsIssuing] = useState(false);
  const idCardRef = useRef(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/students");
      const data = await res.json();
      if (data.success) {
        setStudents(data.students);
        if (selectedStudent) {
          const updated = data.students.find(s => s.id === selectedStudent.id);
          if (updated) setSelectedStudent(updated);
        } else if (data.students.length > 0) {
          setSelectedStudent(data.students[0]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadIdCard = async () => {
    if (!selectedStudent || isGenerating) return;
    
    setIsGenerating(true);
    try {
      const element = document.getElementById("id-card-element");
      if (!element) throw new Error("ID Card element not found");

      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
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

          const styleTags = clonedDoc.querySelectorAll('style');
          styleTags.forEach(tag => {
            try {
              if (tag.innerHTML && tag.innerHTML.match(/(oklch|lab|oklab|lch|color)\(/)) {
                tag.innerHTML = normalizeColorStr(tag.innerHTML);
              }
            } catch (e) {}
          });

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
              } catch (e) {}
            }
            
            for (let i = 0; i < source.children.length; i++) {
              if (target.children[i]) {
                inlineStyles(source.children[i], target.children[i]);
              }
            }
          };

          const originalElement = document.getElementById("id-card-element");
          if (originalElement && elementNode) {
            inlineStyles(originalElement, elementNode);
            const allElements = clonedDoc.body.querySelectorAll('*');
            allElements.forEach(el => {
              if (!elementNode.contains(el) && el !== elementNode && !el.contains(elementNode) && el.tagName !== 'STYLE' && el.tagName !== 'LINK') {
                el.setAttribute('data-html2canvas-ignore', 'true');
              }
            });
          }
        }
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [85.6, 53.98]
      });

      pdf.addImage(imgData, "PNG", 0, 0, 53.98, 85.6);
      pdf.save(`ID_${selectedStudent.name.replace(/\s+/g, "_")}.pdf`);
    } catch (error) {
      console.error("ID Generation failed:", error);
      alert("Failed to generate PDF. Try Direct Print instead.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    if (!selectedStudent) return;
    const printWindow = window.open("", "_blank");
    const element = document.getElementById("id-card-element");
    if (!printWindow || !element) return;

    const printHtml = `
      <html>
        <head>
          <title>Print ID - ${selectedStudent.name}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
          <style>
            @page { size: 53.98mm 85.6mm; margin: 0; }
            body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; }
            .print-container { width: 53.98mm; height: 85.6mm; overflow: hidden; position: relative; }
            .bg-navy { background-color: #001f3f !important; }
            .text-primary { color: #f59e0b !important; }
            * { font-family: 'Inter', sans-serif !important; }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${element.outerHTML}
          </div>
          <script>
            window.onload = () => {
              window.print();
              setTimeout(() => window.close(), 500);
            };
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(printHtml);
    printWindow.document.close();
  };

  const handleIssueId = async (studentIds, issue = true) => {
    setIsIssuing(true);
    try {
      const res = await fetch("/api/admin/students/idcards/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentIds, issue })
      });
      const data = await res.json();
      if (data.success) {
        fetchStudents();
        if (selectedBulk.length > 0) setSelectedBulk([]);
      } else {
        alert(data.message);
      }
    } catch (e) {
      alert("Failed to update ID status");
    } finally {
      setIsIssuing(false);
    }
  };

  const toggleBulk = (id) => {
    setSelectedBulk(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedBulk.length === filteredStudents.length) {
      setSelectedBulk([]);
    } else {
      setSelectedBulk(filteredStudents.map(s => s.id));
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (s.enrollments?.[0]?.course_name || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = issuedFilter === "all" || 
                         (issuedFilter === "issued" && s.id_card_issued) ||
                         (issuedFilter === "pending" && !s.id_card_issued);
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 font-body">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Identity & Verification</h1>
          <p className="text-slate-500 text-sm mt-1">Issue and manage professional student credentials.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-100 flex items-center">
            <ShieldCheck size={14} className="mr-2" />
            Secure System Active
          </div>
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-xs font-bold border border-blue-100 flex items-center">
             {students.length} Total Scholars
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="relative flex-grow max-w-sm">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search by name, email or mobile..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-navy transition-all shadow-sm"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <select 
                    value={issuedFilter}
                    onChange={(e) => setIssuedFilter(e.target.value)}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-wider outline-none cursor-pointer hover:border-navy transition-all shadow-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="issued">Issued</option>
                    <option value="pending">Pending</option>
                  </select>
                  <button 
                    onClick={selectAll}
                    className="flex items-center space-x-2 px-4 py-2 text-slate-500 hover:text-navy transition-colors text-xs font-semibold"
                  >
                    {selectedBulk.length === filteredStudents.length ? "Deselect All" : "Select All"}
                  </button>
                </div>
             </div>

             {selectedBulk.length > 0 && (
               <div className="bg-navy text-white px-6 py-3 flex items-center justify-between">
                 <div className="flex items-center space-x-3">
                   <span className="text-xs font-bold">{selectedBulk.length} Selected</span>
                 </div>
                 <div className="flex items-center space-x-3">
                   <button 
                    onClick={() => handleIssueId(selectedBulk, true)}
                    disabled={isIssuing}
                    className="px-4 py-1.5 bg-primary text-navy rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50"
                   >
                     {isIssuing ? "Processing..." : "Issue ID Cards"}
                   </button>
                   <button 
                    onClick={() => setSelectedBulk([])}
                    className="px-4 py-1.5 bg-white/10 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-white/20 transition-all"
                   >
                     Cancel
                   </button>
                 </div>
               </div>
             )}

             <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto scrollbar-hide">
                {isLoading ? (
                   <div className="p-20 text-center">
                     <Loader2 className="animate-spin mx-auto text-navy mb-4" size={32} />
                     <p className="text-sm text-slate-400 font-medium">Loading student database...</p>
                   </div>
                 ) : filteredStudents.length === 0 ? (
                   <div className="p-20 text-center">
                     <User className="mx-auto text-slate-200 mb-4" size={48} />
                     <p className="text-sm text-slate-400 italic">No students found matching your criteria.</p>
                   </div>
                 ) : (
                   filteredStudents.map((student) => (
                    <div 
                      key={student.id}
                      className={`mx-2 my-1 rounded-xl p-3 flex items-center justify-between cursor-pointer transition-all ${
                        selectedStudent?.id === student.id ? "bg-navy/5" : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center space-x-4 flex-grow" onClick={() => setSelectedStudent(student)}>
                        <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                          <input 
                            type="checkbox"
                            checked={selectedBulk.includes(student.id)}
                            onChange={() => toggleBulk(student.id)}
                            className="w-4 h-4 rounded border-slate-300 text-navy focus:ring-navy cursor-pointer mr-3"
                          />
                        </div>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shadow-sm transition-all ${
                          selectedStudent?.id === student.id ? "bg-navy text-white" : "bg-slate-100 text-slate-500 group-hover:bg-white"
                        }`}>
                          {student.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-bold leading-none text-slate-900">
                              {student.name}
                            </p>
                            {student.id_card_issued ? (
                              <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded text-[8px] font-bold uppercase">Issued</span>
                            ) : (
                              <span className="px-1.5 py-0.5 bg-slate-100 text-slate-400 border border-slate-200 rounded text-[8px] font-bold uppercase tracking-tight">Pending</span>
                            )}
                          </div>
                          <p className="text-[10px] mt-1 font-medium text-slate-400">
                            {student.email} • {student.phone || 'No Contact'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <ChevronRight size={18} className={`transition-transform ${selectedStudent?.id === student.id ? "text-navy translate-x-1" : "text-slate-300"}`} />
                      </div>
                    </div>
                  ))
                 )}
              </div>
           </div>
        </div>

        <div className="lg:col-span-5 relative">
           <div className="sticky top-8 space-y-6">
             <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col items-center">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 self-start flex items-center">
                 <ShieldCheck size={14} className="mr-2 text-primary" />
                 Credential Real-time Preview
              </h4>

              {selectedStudent ? (
                <div className="relative group w-full flex flex-col items-center">
                  <div className="scale-[0.75] origin-top -mb-16">
                    <IdCardTemplate 
                      studentName={selectedStudent.name}
                      studentId={`PR-${10000 + selectedStudent.id}`}
                      courseName={selectedStudent.enrollments?.[0]?.course_name || "Professional Student"}
                      photo={selectedStudent.image}
                      validity="2026 - 2027"
                      qrCodeData={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://prayogindiarobotics.com'}/verify/${selectedStudent.id}`}
                      bloodGroup={selectedStudent.blood_group}
                      emergencyContact={selectedStudent.emergency_contact}
                      logoUrl={settings?.logo_url}
                    />
                  </div>
                  
                  <div className="space-y-2 w-full">
                    <div className="flex flex-col gap-3 w-full">
                      <button 
                        onClick={() => handleIssueId([selectedStudent.id], !selectedStudent.id_card_issued)}
                        disabled={isIssuing}
                        className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center space-x-3 shadow-lg ${
                          selectedStudent.id_card_issued 
                            ? "bg-slate-100 text-slate-500 hover:bg-slate-200" 
                            : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/10"
                        }`}
                      >
                        {isIssuing ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                        <span>{selectedStudent.id_card_issued ? "Revoke ID Access" : "Issue & Authorize ID Card"}</span>
                      </button>

                      <button 
                        onClick={downloadIdCard}
                        disabled={isGenerating || !selectedStudent.id_card_issued}
                        className="w-full py-4 bg-navy text-white rounded-2xl font-bold text-sm hover:bg-black transition-all flex items-center justify-center space-x-3 shadow-xl shadow-navy/10 disabled:opacity-30"
                      >
                        {isGenerating ? <Loader2 size={18} className="animate-spin text-primary" /> : <Download size={18} className="text-primary" />}
                        <span>{isGenerating ? "Processing Graphics..." : "Export High-Res ID Card"}</span>
                      </button>
                    </div>
                    
                    <button 
                      onClick={handlePrint}
                      disabled={!selectedStudent.id_card_issued}
                      className="w-full py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center justify-center space-x-3 disabled:opacity-30"
                    >
                      <Printer size={18} />
                      <span>Direct Print (CR80)</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full aspect-[3/4] rounded-3xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center p-10">
                   <IdCard size={48} className="text-slate-100 mb-4" />
                   <p className="text-sm text-slate-400 font-medium italic">Select a student from the directory to generate identity credentials</p>
                </div>
              )}
           </div>

           <div className="bg-primary rounded-2xl p-6 relative overflow-hidden group shadow-sm border border-primary/20">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/20 rounded-full blur-2xl transition-transform group-hover:scale-150 duration-700"></div>
              <h3 className="text-sm font-bold text-navy mb-1 flex items-center">
                <Award size={16} className="mr-2" />
                Security Standard
              </h3>
              <p className="text-navy/60 text-[10px] leading-relaxed">
                Prayog India ID cards use embedded QR verification and tamper-proof layout designs.
              </p>
              <button className="mt-6 flex items-center space-x-2 text-[10px] font-bold text-navy uppercase tracking-widest border-b border-navy/20 pb-1 hover:border-navy transition-all">
                 <span>View Verification Logs</span>
                 <ExternalLink size={12} />
              </button>
           </div>
        </div>
      </div>
      </div>
    </div>
  );
}
