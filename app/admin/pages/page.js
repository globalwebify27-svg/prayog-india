"use client";

import { useState, useEffect } from "react";
import { FileText, Edit, Zap, Briefcase, FileSignature, Presentation } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PagesAdmin() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await fetch("/api/admin/pages");
      const text = await res.text();
      if (!text) {
        console.error("Empty response from server with status:", res.status);
        return;
      }
      try {
        const data = JSON.parse(text);
        if (data.success) {
          setPages(data.data);
        } else {
          console.error("API returned error:", data.message);
        }
      } catch (e) {
        console.error("Failed to parse JSON. Response was:", text);
      }
    } catch (e) {
      console.error("Network or fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  const getPageIcon = (slug) => {
    switch (slug) {
      case "training": return <Presentation size={24} className="text-blue-500" />;
      case "one-on-one": return <Zap size={24} className="text-amber-500" />;
      case "internships": return <Briefcase size={24} className="text-emerald-500" />;
      case "admission": return <FileSignature size={24} className="text-rose-500" />;
      default: return <FileText size={24} className="text-slate-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-navy border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-navy flex items-center gap-3">
            <FileText className="text-primary" />
            Static Pages Content
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage the hero sections, titles, and static descriptions for major website pages.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((page, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={page.slug} 
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-primary/30 transition-all flex flex-col group"
          >
            <div className="p-6 border-b border-slate-50 flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 group-hover:scale-110 transition-transform">
                {getPageIcon(page.slug)}
              </div>
              <div>
                <h3 className="font-bold text-navy text-lg">{page.title}</h3>
                <p className="text-xs text-slate-400">/{page.slug}</p>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50/50 flex-grow flex flex-col justify-between">
              <p className="text-[10px] font-medium text-slate-500 mb-4 uppercase tracking-widest">
                Last updated: {new Date(page.updated_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
              <Link 
                href={`/admin/pages/${page.slug}`}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-navy text-white rounded-xl font-bold text-sm hover:bg-gold hover:text-navy transition-colors shadow-sm"
              >
                <Edit size={16} /> Edit Content
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
