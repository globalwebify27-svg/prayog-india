"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Download, 
  Printer, 
  ShieldCheck, 
  ChevronLeft,
  Loader2
} from "lucide-react";
import Link from "next/link";
import IdCardTemplate from "@/components/IdCardTemplate";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function StudentIdCardPage() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/student/dashboard");
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadIdCard = async () => {
    if (!data || isGenerating) return;
    
    setIsGenerating(true);
    try {
      const element = document.getElementById("id-card-element");
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [85.6, 53.98]
      });

      pdf.addImage(imgData, "PNG", 0, 0, 53.98, 85.6);
      pdf.save(`ID_CARD_${data.user.name.replace(/\s+/g, "_")}.pdf`);
    } catch (error) {
      console.error("ID Generation failed:", error);
      alert("Failed to download ID card.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-navy" />
      </div>
    );
  }

  const user = data?.user;
  const enrollment = data?.enrollments?.[0];

  if (!user || user.id_card_issued !== 1) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck size={40} className="text-slate-300" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">ID Card Pending</h2>
        <p className="text-slate-500 text-sm mt-2">Your official identity card has not been issued yet. Please contact the administration hub for verification.</p>
        <Link href="/dashboard" className="mt-8 inline-block text-navy font-bold text-sm">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 font-body pb-20">
      <div className="flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center text-slate-500 hover:text-navy transition-colors">
          <ChevronLeft size={18} />
          <span className="text-sm font-semibold ml-1">Back</span>
        </Link>
        <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold border border-emerald-100">
          <ShieldCheck size={12} />
          <span>Officially Verified</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex flex-col items-center">
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Digital Identity</h1>
          <p className="text-slate-500 text-sm mt-1">Authorized Prayog India Scholar Credential</p>
        </div>

        <div className="shadow-2xl shadow-navy/20 rounded-2xl overflow-hidden mb-10">
          <IdCardTemplate 
            studentName={user.name}
            studentId={`PR-${10000 + user.id}`}
            courseName={enrollment?.title || "Professional Student"}
            validity="2026 - 2027"
            qrCodeData={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://prayogindiarobotics.com'}/verify/${user.id}`}
            bloodGroup={user.blood_group}
            emergencyContact={user.emergency_contact}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <button 
            onClick={downloadIdCard}
            disabled={isGenerating}
            className="flex items-center justify-center space-x-2 bg-navy text-white py-4 rounded-2xl font-bold text-sm hover:bg-black transition-all shadow-lg disabled:opacity-70"
          >
            {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
            <span>Download Digital Copy</span>
          </button>
          <button 
            onClick={() => window.print()}
            className="flex items-center justify-center space-x-2 bg-white border border-slate-200 text-slate-600 py-4 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all"
          >
            <Printer size={18} />
            <span>Print Credential</span>
          </button>
        </div>
        
        <p className="mt-8 text-[10px] text-slate-400 font-medium max-w-xs text-center leading-relaxed">
          This document is a property of Prayog India. Tampering with this identity card is a punishable offense.
        </p>
      </div>
    </div>
  );
}
