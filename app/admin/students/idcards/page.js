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

export default function IdCardManagement() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
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
            // Regex matching color functions with up to one level of nested parentheses
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

          // Sanitize style tags to prevent parser crashes
          const styleTags = clonedDoc.querySelectorAll('style');
          styleTags.forEach(tag => {
            try {
              if (tag.innerHTML && tag.innerHTML.match(/(oklch|lab|oklab|lch|color)\(/)) {
                tag.innerHTML = normalizeColorStr(tag.innerHTML);
              }
            } catch (e) {}
          });

          // Remove external stylesheets to prevent parsing errors, preserving fonts
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
            
            // Ignore extraneous elements
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

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.enrollments?.[0]?.course_name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <button className="flex items-center space-x-2 px-4 py-2 text-slate-500 hover:text-navy transition-colors text-xs font-semibold">
                   <Filter size={14} />
                   <span>Filters</span>
                </button>
             </div>

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
                       onClick={() => setSelectedStudent(student)}
                       className={`p-4 flex items-center justify-between cursor-pointer transition-all group ${
                         selectedStudent?.id === student.id ? "bg-navy text-white" : "hover:bg-slate-50"
                       }`}
                     >
                       <div className="flex items-center space-x-4">
                         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shadow-sm transition-all ${
                           selectedStudent?.id === student.id ? "bg-primary text-navy" : "bg-slate-100 text-slate-500 group-hover:bg-white"
                         }`}>
                           {student.name.substring(0, 2).toUpperCase()}
                         </div>
                         <div>
                           <p className={`text-sm font-bold leading-none ${selectedStudent?.id === student.id ? "text-white" : "text-slate-900"}`}>
                             {student.name}
                           </p>
                           <p className={`text-[10px] mt-1 font-medium ${selectedStudent?.id === student.id ? "text-white/60" : "text-slate-400"}`}>
                             {student.email} • {student.phone || 'No Contact'}
                           </p>
                         </div>
                       </div>
                       <ChevronRight size={18} className={`transition-transform ${selectedStudent?.id === student.id ? "text-primary translate-x-1" : "text-slate-300"}`} />
                     </div>
                   ))
                 )}
              </div>
           </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
           <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex flex-col items-center">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8 self-start flex items-center">
                 <ShieldCheck size={14} className="mr-2 text-primary" />
                 Credential Real-time Preview
              </h4>

              {selectedStudent ? (
                <div className="relative group">
                  <div className="scale-[0.8] origin-top">
                    <IdCardTemplate 
                      studentName={selectedStudent.name}
                      studentId={`PR-${10000 + selectedStudent.id}`}
                      courseName={selectedStudent.enrollments?.[0]?.course_name || "Professional Student"}
                      validity="2026 - 2027"
                      qrCodeData={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://prayogindiarobotics.com'}/verify/${selectedStudent.id}`}
                      bloodGroup={selectedStudent.blood_group}
                      emergencyContact={selectedStudent.emergency_contact}
                    />
                  </div>
                  
                  <div className="mt-8 space-y-3 w-full">
                    <button 
                      onClick={downloadIdCard}
                      disabled={isGenerating}
                      className="w-full py-4 bg-navy text-white rounded-2xl font-bold text-sm hover:bg-black transition-all flex items-center justify-center space-x-3 shadow-xl shadow-navy/10 disabled:opacity-70"
                    >
                      {isGenerating ? <Loader2 size={18} className="animate-spin text-primary" /> : <Download size={18} className="text-primary" />}
                      <span>{isGenerating ? "Processing Graphics..." : "Export High-Res ID Card"}</span>
                    </button>
                    
                    <button 
                      onClick={handlePrint}
                      className="w-full py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center justify-center space-x-3"
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

           <div className="bg-primary rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl transition-transform group-hover:scale-150 duration-700"></div>
              <Award className="text-navy mb-4" size={28} />
              <h3 className="text-lg font-bold text-navy mb-2">Security Standard</h3>
              <p className="text-navy/60 text-xs leading-relaxed">
                Prayog India ID cards use embedded QR verification and tamper-proof layout designs to ensure document integrity across all academic programs.
              </p>
              <button className="mt-6 flex items-center space-x-2 text-[10px] font-bold text-navy uppercase tracking-widest border-b border-navy/20 pb-1 hover:border-navy transition-all">
                 <span>View Verification Logs</span>
                 <ExternalLink size={12} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
