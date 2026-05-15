"use client";

import { motion } from "framer-motion";
import { 
  Save, 
  Zap, 
  Image as ImageIcon, 
  Upload, 
  Loader2, 
  ArrowLeft,
  CheckCircle2
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function TrainingCMS() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [data, setData] = useState({
    training_title: "",
    training_description: "",
    training_image: "",
    training_features: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/training");
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error("Fetch training data error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    try {
      setSaving(true);
      const res = await fetch("/api/admin/training", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (result.success) {
        alert("1:1 Training section updated successfully!");
      } else {
        alert("Update failed: " + result.message);
      }
    } catch (error) {
      console.error("Save training error:", error);
      alert("An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const result = await res.json();
      
      if (result.success) {
        setData({ ...data, training_image: result.url });
      } else {
        alert("Upload failed: " + result.error);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred during upload.");
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-navy" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 font-body">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 hover:bg-slate-100 rounded-lg transition-all text-slate-400">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">1:1 Training Management</h1>
            <p className="text-slate-500 text-sm mt-1">Customize the high-fidelity personalized instruction section.</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 bg-navy text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-black transition-all shadow-md disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          <span>{saving ? "Updating..." : "Save Changes"}</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Editor Side */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Zap className="text-primary" size={18} />
                Section Content
              </h3>
            </div>
            
            <div className="p-6 space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Main Headline</label>
                <input 
                  type="text" 
                  value={data.training_title || ""}
                  onChange={(e) => setData({...data, training_title: e.target.value})}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium"
                  placeholder="Master Robotics with 1:1 Expert Training"
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Compelling Description</label>
                <textarea 
                  rows={5}
                  value={data.training_description || ""}
                  onChange={(e) => setData({...data, training_description: e.target.value})}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium leading-relaxed"
                  placeholder="Describe the unique value of your 1:1 mentorship..."
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Key Features (One per line)</label>
                <textarea 
                  rows={4}
                  value={data.training_features || ""}
                  onChange={(e) => setData({...data, training_features: e.target.value})}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium"
                  placeholder="Individual Attention&#10;Customized Path&#10;Live Projects..."
                />
                <p className="text-[10px] text-slate-400 font-bold italic ml-1">Each line will appear with a checkmark in the public view.</p>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Featured Asset</label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="relative flex-grow w-full">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      value={data.training_image || ""}
                      readOnly
                      placeholder="Upload section image..."
                      className="w-full pl-11 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm font-medium text-slate-500 cursor-not-allowed"
                    />
                  </div>
                  <input 
                    type="file" 
                    id="training-image-cms"
                    onChange={handleImageUpload}
                    className="hidden" 
                    accept="image/*"
                  />
                  <button 
                    type="button"
                    onClick={() => document.getElementById('training-image-cms').click()}
                    disabled={uploading}
                    className="flex items-center space-x-2 bg-slate-900 text-white px-5 py-3 rounded-xl font-bold text-xs hover:bg-black transition-all disabled:opacity-50 whitespace-nowrap"
                  >
                    {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                    <span>{uploading ? "Uploading..." : "Upload Asset"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Side */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-bold text-xs text-slate-500 uppercase tracking-widest">Live Visual Preview</h3>
            </div>
            <div className="p-6">
              {data.training_image ? (
                <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm relative group">
                  <img src={data.training_image} alt="Preview" className="w-full h-auto aspect-video object-cover" />
                  <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-bold uppercase tracking-widest">Active Asset</span>
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-2">
                  <ImageIcon size={32} />
                  <span className="text-xs font-bold uppercase">No Image Selected</span>
                </div>
              )}

              <div className="mt-6 space-y-4">
                <h4 className="text-lg font-black text-navy leading-tight line-clamp-2">
                  {data.training_title || "Your Headline Here"}
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                  {data.training_description || "Your section description will appear here on the homepage."}
                </p>
                <div className="space-y-2 pt-2">
                  {(data.training_features || "").split('\n').filter(f => f.trim()).slice(0, 3).map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <CheckCircle2 size={14} className="text-navy" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
            <h4 className="text-sm font-bold text-navy mb-2">CMS Tip</h4>
            <p className="text-xs text-navy/70 leading-relaxed font-medium">
              Use a high-resolution landscape image (1920x1080) for the best visual impact on the homepage.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
