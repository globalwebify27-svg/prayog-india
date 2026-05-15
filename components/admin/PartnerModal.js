"use client";

import { useState, useEffect } from "react";
import { X, Upload, CheckCircle2, Building2, Loader2 } from "lucide-react";

export default function PartnerModal({ isOpen, onClose, partner, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    logo_url: ""
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (partner) {
      setFormData(partner);
    } else {
      setFormData({
        name: "",
        logo_url: ""
      });
    }
  }, [partner, isOpen]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (result.url) {
        setFormData({ ...formData, logo_url: result.url });
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-navy font-display">
              {partner ? "Edit Industry Partner" : "Add New Partner"}
            </h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Corporate Relations Manager</p>
          </div>
          <button onClick={onClose} className="p-3 rounded-2xl hover:bg-white hover:shadow-lg transition-all text-slate-400 hover:text-navy">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          
          {/* Logo Upload Area */}
          <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/30 group hover:border-primary/30 transition-all">
            {formData.logo_url ? (
              <div className="relative w-40 h-24 bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 p-4">
                <img src={formData.logo_url} className="w-full h-full object-contain" alt="Partner Logo" />
                <label className="absolute inset-0 bg-navy/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Upload size={24} className="text-white" />
                  <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                </label>
              </div>
            ) : (
              <label className="flex flex-col items-center gap-3 cursor-pointer">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center text-slate-300 group-hover:text-primary transition-colors">
                  {uploading ? <Loader2 className="animate-spin" size={24} /> : <Upload size={24} />}
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Upload Brand Logo</p>
                  <p className="text-[8px] text-slate-300 font-bold uppercase italic">Best size: 200x100px (PNG/SVG)</p>
                </div>
                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
              </label>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Partner Organization Name</label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. ABB Robotics, KUKA, etc."
                className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-100 flex items-center justify-end gap-4 bg-slate-50/50">
          <button 
            onClick={onClose}
            className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-navy transition-colors"
          >
            Discard
          </button>
          <button 
            onClick={() => onSave(formData)}
            disabled={uploading || !formData.name || !formData.logo_url}
            className="flex items-center gap-3 bg-navy text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-navy/20 hover:scale-105 transition-all disabled:opacity-50"
          >
            {uploading ? "Uploading..." : partner ? "Update Partner" : "Add Partner"}
            <CheckCircle2 size={16} className="text-primary" />
          </button>
        </div>
      </div>
    </div>
  );
}
