"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Layout, 
  Save, 
  Upload, 
  Zap, 
  Target, 
  Globe, 
  Briefcase, 
  Loader2, 
  CheckCircle2,
  Image as ImageIcon
} from "lucide-react";

export default function AdminInternshipBanner() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    year: "",
    subtitle: "",
    description: "",
    feature1_title: "",
    feature1_desc: "",
    feature2_title: "",
    feature2_desc: "",
    feature3_title: "",
    feature3_desc: "",
    feature4_title: "",
    feature4_desc: "",
    stat_number: "",
    stat_label: "",
    image_url: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/homepage/internship-banner");
      const data = await res.json();
      setFormData(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData
      });
      const data = await res.json();
      if (data.success) {
        setFormData({ ...formData, image_url: data.url });
      }
    } catch (error) {
      alert("Upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/homepage/internship-banner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert("Banner updated successfully!");
      }
    } catch (error) {
      alert("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="animate-spin text-primary" size={40} />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto pb-20 font-body">
      <div className="mb-10">
        <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">
          <Layout size={12} />
          <span>Homepage CMS</span>
        </div>
        <h1 className="text-3xl font-heading font-black text-navy uppercase tracking-tight">
          Internship <span className="text-primary italic">Banner</span>
        </h1>
        <p className="text-slate-500 text-xs mt-2 font-medium italic">Configure the premium hero section for the 2026 Internship Program recruitment.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Main Content Card */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-navy/5 shadow-sm">
          <h3 className="text-sm font-black text-navy uppercase tracking-widest mb-8 flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-navy text-primary flex items-center justify-center">1</div>
             Core Content & Branding
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-2">Header Subtitle</label>
              <input 
                type="text" 
                value={formData.subtitle}
                onChange={e => setFormData({...formData, subtitle: e.target.value})}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-navy focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="e.g. Join Our Team"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-2">Program Title</label>
              <input 
                required
                type="text" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-navy focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-2">Program Year</label>
              <input 
                required
                type="text" 
                value={formData.year}
                onChange={e => setFormData({...formData, year: e.target.value})}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-navy focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-2">Marketing Pitch (Description)</label>
              <textarea 
                required
                rows={4}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-navy focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Feature Grid Card */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-navy/5 shadow-sm">
          <h3 className="text-sm font-black text-navy uppercase tracking-widest mb-8 flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-navy text-primary flex items-center justify-center">2</div>
             Program Highlights (Icon Grid)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {/* Feature 1 */}
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-primary flex items-center justify-center shadow-sm">
                  <Zap size={18} />
                </div>
                <input 
                  className="bg-transparent border-b border-navy/10 text-sm font-black text-navy outline-none w-full"
                  value={formData.feature1_title}
                  onChange={e => setFormData({...formData, feature1_title: e.target.value})}
                  placeholder="Feature 1 Title"
                />
              </div>
              <textarea 
                className="bg-transparent text-xs text-slate-500 font-medium outline-none w-full resize-none"
                value={formData.feature1_desc}
                onChange={e => setFormData({...formData, feature1_desc: e.target.value})}
                placeholder="Brief description of this benefit..."
              />
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-primary flex items-center justify-center shadow-sm">
                  <Target size={18} />
                </div>
                <input 
                  className="bg-transparent border-b border-navy/10 text-sm font-black text-navy outline-none w-full"
                  value={formData.feature2_title}
                  onChange={e => setFormData({...formData, feature2_title: e.target.value})}
                  placeholder="Feature 2 Title"
                />
              </div>
              <textarea 
                className="bg-transparent text-xs text-slate-500 font-medium outline-none w-full resize-none"
                value={formData.feature2_desc}
                onChange={e => setFormData({...formData, feature2_desc: e.target.value})}
                placeholder="Brief description of this benefit..."
              />
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-primary flex items-center justify-center shadow-sm">
                  <Globe size={18} />
                </div>
                <input 
                  className="bg-transparent border-b border-navy/10 text-sm font-black text-navy outline-none w-full"
                  value={formData.feature3_title}
                  onChange={e => setFormData({...formData, feature3_title: e.target.value})}
                  placeholder="Feature 3 Title"
                />
              </div>
              <textarea 
                className="bg-transparent text-xs text-slate-500 font-medium outline-none w-full resize-none"
                value={formData.feature3_desc}
                onChange={e => setFormData({...formData, feature3_desc: e.target.value})}
                placeholder="Brief description of this benefit..."
              />
            </div>

            {/* Feature 4 */}
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-primary flex items-center justify-center shadow-sm">
                  <Briefcase size={18} />
                </div>
                <input 
                  className="bg-transparent border-b border-navy/10 text-sm font-black text-navy outline-none w-full"
                  value={formData.feature4_title}
                  onChange={e => setFormData({...formData, feature4_title: e.target.value})}
                  placeholder="Feature 4 Title"
                />
              </div>
              <textarea 
                className="bg-transparent text-xs text-slate-500 font-medium outline-none w-full resize-none"
                value={formData.feature4_desc}
                onChange={e => setFormData({...formData, feature4_desc: e.target.value})}
                placeholder="Brief description of this benefit..."
              />
            </div>
          </div>
        </div>

        {/* Media & Stats Card */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-navy/5 shadow-sm">
          <h3 className="text-sm font-black text-navy uppercase tracking-widest mb-8 flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-navy text-primary flex items-center justify-center">3</div>
             Media & Social Proof
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
             <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-2">Hero Image</label>
                  <div className="relative aspect-video rounded-[2rem] overflow-hidden bg-slate-100 border-2 border-dashed border-navy/10 flex items-center justify-center group">
                    {formData.image_url ? (
                      <img src={formData.image_url} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="text-slate-300" size={40} />
                    )}
                    <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center text-white p-4 text-center">
                       <Upload size={24} className="mb-2 text-primary" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Change Banner Image</span>
                    </div>
                    <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>
             </div>

             <div className="space-y-8 py-4">
                <div className="bg-primary/5 p-8 rounded-[2rem] border border-primary/20 space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-primary uppercase tracking-widest block">Stats Magnitude</label>
                      <input 
                        type="text" 
                        value={formData.stat_number}
                        onChange={e => setFormData({...formData, stat_number: e.target.value})}
                        className="w-full bg-white border border-primary/20 rounded-xl px-6 py-4 text-3xl font-heading font-black text-navy outline-none shadow-sm"
                        placeholder="500+"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Stats Description</label>
                      <input 
                        type="text" 
                        value={formData.stat_label}
                        onChange={e => setFormData({...formData, stat_label: e.target.value})}
                        className="w-full bg-white border border-slate-100 rounded-xl px-4 py-2 text-xs font-bold text-slate-500 outline-none uppercase tracking-widest"
                        placeholder="Interns Placed"
                      />
                   </div>
                </div>
                
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                   <div className="flex items-center gap-3 text-navy font-bold text-xs uppercase tracking-widest mb-2">
                      <CheckCircle2 className="text-emerald-500" size={16} />
                      Live Preview Ready
                   </div>
                   <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Your changes will be immediately reflected in the high-fidelity section on the public homepage.</p>
                </div>
             </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-8 z-20 bg-white/80 backdrop-blur-xl p-4 rounded-[2rem] shadow-2xl border border-navy/10 flex items-center justify-between">
           <div className="px-6">
              <span className="text-[10px] font-black text-navy/40 uppercase tracking-[0.2em]">Ready to Launch?</span>
           </div>
           <button 
            type="submit"
            disabled={saving}
            className="bg-navy text-white px-12 py-5 rounded-2xl font-heading font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-black hover:scale-105 transition-all shadow-xl shadow-navy/20 disabled:opacity-50"
           >
             {saving ? <Loader2 className="animate-spin text-primary" size={20} /> : <Save size={20} className="text-primary" />}
             <span>{saving ? "Synchronizing..." : "Publish to Homepage"}</span>
           </button>
        </div>
      </form>
    </div>
  );
}
