"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Save, ArrowLeft, Loader2, FileText, CheckCircle2, Upload, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import CustomModal from "@/components/CustomModal";

export default function PageEditor() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;

  const [page, setPage] = useState(null);
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState(null);
  
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    description: "",
    type: "info",
    confirmText: "Close"
  });

  useEffect(() => {
    fetchPage();
  }, [slug]);

  const fetchPage = async () => {
    try {
      const res = await fetch(`/api/pages?slug=${slug}`);
      const data = await res.json();
      if (data.success) {
        setPage(data.data);
        setContent(data.data.content || {});
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          content
        })
      });
      const data = await res.json();
      if (data.success) {
        setModalConfig({
          isOpen: true,
          title: "Saved Successfully",
          description: "Page content has been updated.",
          type: "success",
          confirmText: "Okay",
          onConfirm: () => setModalConfig(prev => ({ ...prev, isOpen: false }))
        });
      } else {
        throw new Error(data.message || "Failed to save");
      }
    } catch (e) {
      setModalConfig({
        isOpen: true,
        title: "Error Saving",
        description: e.message || "An unexpected error occurred.",
        type: "error",
        confirmText: "Close",
        onConfirm: () => setModalConfig(prev => ({ ...prev, isOpen: false }))
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e, key) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingField(key);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setContent(prev => ({
          ...prev,
          [key]: data.url
        }));
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during upload.");
    } finally {
      setUploadingField(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-navy" size={40} />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-navy mb-4">Page not found</h2>
        <Link href="/admin/pages" className="text-primary hover:underline">Back to Pages</Link>
      </div>
    );
  }

  // Format keys into readable labels
  const getLabel = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1') // insert a space before all caps
      .replace(/^./, (str) => str.toUpperCase()); // uppercase the first character
  };

  return (
    <div className="space-y-6 pb-20">
      <CustomModal 
        {...modalConfig} 
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))} 
      />

      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/admin/pages" className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-navy hover:bg-slate-100 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
              <FileText className="text-primary" size={20} />
              Edit {page.title}
            </h1>
            <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest font-bold">/{slug}</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-navy text-white rounded-xl font-bold text-sm hover:bg-gold hover:text-navy transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-8">
        {/* Dynamic Fields based on JSON keys */}
        {Object.entries(content).map(([key, value]) => {
          // Identify field types
          const isImageField = key.toLowerCase().includes('image');
          const isTextArea = !isImageField && value && value.length > 80;
          
          return (
            <div key={key} className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block ml-1">
                {getLabel(key)}
              </label>
              
              {isImageField ? (
                <div className="flex flex-col md:flex-row gap-6 items-start p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  {/* Image Preview */}
                  <div className="w-48 h-32 bg-slate-200 rounded-xl overflow-hidden shrink-0 border border-slate-300 relative flex items-center justify-center">
                    {value ? (
                      <img src={value} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={32} className="text-slate-400" />
                    )}
                  </div>
                  
                  {/* Upload Controls */}
                  <div className="flex-grow space-y-4 w-full">
                    <div className="flex items-center gap-3">
                      <label className="relative cursor-pointer">
                        <input 
                          type="file" 
                          accept="image/*"
                          className="hidden" 
                          onChange={(e) => handleImageUpload(e, key)}
                          disabled={uploadingField === key}
                        />
                        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-navy text-navy rounded-xl text-xs font-bold transition-colors shadow-sm">
                          {uploadingField === key ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                          {uploadingField === key ? "Uploading..." : "Upload New Image"}
                        </div>
                      </label>
                      <span className="text-xs text-slate-400 font-medium">or paste URL below:</span>
                    </div>
                    
                    <input
                      type="text"
                      name={key}
                      value={value}
                      onChange={handleChange}
                      placeholder="e.g. /assets/image.jpg or https://..."
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:border-navy transition-all text-sm font-medium"
                    />
                  </div>
                </div>
              ) : isTextArea ? (
                <textarea
                  name={key}
                  value={value}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium leading-relaxed resize-y"
                />
              ) : (
                <input
                  type="text"
                  name={key}
                  value={value}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
