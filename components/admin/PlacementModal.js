"use client";

import { useState, useEffect } from "react";
import { X, Upload, CheckCircle2, User, Briefcase, Building2, Quote, Loader2 } from "lucide-react";

export default function PlacementModal({ isOpen, onClose, alumni, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    story: "",
    image_url: ""
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (alumni) {
      setFormData(alumni);
    } else {
      setFormData({
        name: "",
        role: "",
        company: "",
        story: "",
        image_url: ""
      });
    }
  }, [alumni, isOpen]);

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
        setFormData({ ...formData, image_url: result.url });
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
      
      <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-navy font-display">
              {alumni ? "Modify Alumni Profile" : "Record New Placement"}
            </h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Institutional Success Database</p>
          </div>
          <button onClick={onClose} className="p-3 rounded-2xl hover:bg-white hover:shadow-lg transition-all text-slate-400 hover:text-navy">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid gap-8">
            
            {/* Image Upload Area */}
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/30 group hover:border-primary/30 transition-all">
              {formData.image_url ? (
                <div className="relative w-32 h-32 rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                  <img src={formData.image_url} className="w-full h-full object-cover" alt="Alumni" />
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
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload Profile Photo</span>
                  <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                </label>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Amitabh Singh"
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Designation</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input 
                    type="text" 
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    placeholder="e.g. Robotics Engineer"
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Company / Organization</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="text" 
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  placeholder="e.g. ABB India"
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Success Narrative</label>
              <div className="relative">
                <Quote className="absolute left-4 top-4 text-slate-300" size={16} />
                <textarea 
                  rows={4}
                  value={formData.story}
                  onChange={(e) => setFormData({...formData, story: e.target.value})}
                  placeholder="Share the placement experience..."
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none italic"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-100 flex items-center justify-end gap-4 bg-slate-50/50">
          <button 
            onClick={onClose}
            className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-navy transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => onSave(formData)}
            disabled={uploading}
            className="flex items-center gap-3 bg-navy text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-navy/20 hover:scale-105 transition-all disabled:opacity-50"
          >
            {uploading ? "Saving Media..." : "Finalize Profile"}
            <CheckCircle2 size={16} className="text-primary" />
          </button>
        </div>
      </div>
    </div>
  );
}
