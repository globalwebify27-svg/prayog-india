"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Trash2, 
  Calendar, 
  MapPin, 
  Video, 
  Layout, 
  Edit, 
  ChevronRight, 
  Target, 
  Lightbulb, 
  TrendingUp, 
  Briefcase,
  X,
  PlusCircle,
  FileText,
  Image,
  RefreshCcw
} from "lucide-react";

const SECTION_TYPES = [
  { type: "overview", label: "Overview", icon: FileText, color: "text-blue-500" },
  { type: "challenge", label: "The Challenge", icon: Target, color: "text-rose-500" },
  { type: "solution", label: "Our Solution", icon: Lightbulb, color: "text-emerald-500" },
  { type: "result", label: "Impact & Results", icon: TrendingUp, color: "text-amber-500" }
];

export default function AdminWorkshops() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    video_url: "",
    date: "",
    location: "",
    category: "Industrial",
    client_name: "",
    content: [
      { type: "overview", title: "Overview", text: "" }
    ]
  });

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/workshops");
      const data = await res.json();
      // Parse content if it's a string
      const parsedData = data.map(w => ({
        ...w,
        content: typeof w.content === 'string' ? JSON.parse(w.content) : (w.content || [])
      }));
      setWorkshops(parsedData);
    } catch (error) {
      console.error("Failed to fetch workshops:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (workshop = null) => {
    if (workshop) {
      setEditingId(workshop.id);
      // Format date for input
      const formattedDate = workshop.date ? new Date(workshop.date).toISOString().split('T')[0] : "";
      setFormData({
        ...workshop,
        date: formattedDate,
        content: Array.isArray(workshop.content) ? workshop.content : []
      });
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        description: "",
        image_url: "",
        video_url: "",
        date: new Date().toISOString().split('T')[0],
        location: "",
        category: "Industrial",
        client_name: "",
        content: [
          { type: "overview", title: "Overview", text: "" }
        ]
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const res = await fetch("/api/workshops", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingId ? { ...formData, id: editingId } : formData)
    });
    const data = await res.json();
    if (data.success) {
      setShowModal(false);
      fetchWorkshops();
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this case study?")) {
      const res = await fetch(`/api/workshops?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchWorkshops();
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    setIsUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload
      });
      const data = await res.json();
      if (data.success) {
        setFormData({ ...formData, image_url: data.url });
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  const addSection = (type) => {
    const section = SECTION_TYPES.find(s => s.type === type);
    setFormData({
      ...formData,
      content: [...formData.content, { type, title: section.label, text: "" }]
    });
  };

  const removeSection = (index) => {
    const newContent = [...formData.content];
    newContent.splice(index, 1);
    setFormData({ ...formData, content: newContent });
  };

  const updateSection = (index, field, value) => {
    const newContent = [...formData.content];
    newContent[index][field] = value;
    setFormData({ ...formData, content: newContent });
  };

  return (
    <div className="space-y-8 font-body pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Briefcase className="text-navy" size={20} />
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Workshop Case Studies</h1>
          </div>
          <p className="text-slate-500 text-sm">Industrial success stories, innovation highlights, and institutional outcomes.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 bg-navy text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-black transition-all shadow-xl shadow-navy/10 active:scale-95"
        >
          <PlusCircle size={18} className="text-primary" />
          <span>Create Case Study</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map(i => (
            <div key={i} className="bg-white rounded-3xl h-64 animate-pulse border border-slate-100" />
          ))}
        </div>
      ) : workshops.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 border border-slate-100 text-center">
          <Layout size={48} className="mx-auto text-slate-200 mb-4" />
          <p className="text-slate-400 font-medium">No case studies published yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {workshops.map((w, i) => (
            <motion.div 
              key={w.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group relative"
            >
              <div className="aspect-video bg-slate-100 relative overflow-hidden">
                {w.image_url ? (
                  <img src={w.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={w.title} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Layout size={40} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 bg-primary text-navy text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                    {w.category}
                  </span>
                  {w.video_url && (
                    <span className="p-1.5 bg-white/20 backdrop-blur-md text-white rounded-full">
                      <Video size={14} />
                    </span>
                  )}
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-xl mb-1 group-hover:text-navy transition-colors">{w.title}</h3>
                    <p className="text-xs text-slate-400 font-medium">{w.client_name || "Internal Project"}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleOpenModal(w)}
                      className="p-2 bg-slate-50 text-slate-400 hover:text-navy hover:bg-slate-100 rounded-xl transition-all"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(w.id)}
                      className="p-2 bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">
                  <span className="flex items-center gap-2"><Calendar size={12} className="text-navy" /> {new Date(w.date).toLocaleDateString()}</span>
                  <span className="flex items-center gap-2"><MapPin size={12} className="text-navy" /> {w.location}</span>
                </div>

                <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-6">
                  {w.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {w.content?.map((section, idx) => {
                    const type = SECTION_TYPES.find(s => s.type === section.type);
                    if (!type) return null;
                    return (
                      <div key={idx} className={`p-1.5 rounded-lg bg-slate-50 flex items-center gap-2 ${type.color}`}>
                        <type.icon size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-600">{type.label}</span>
                      </div>
                    );
                  })}
                </div>

                <button className="w-full py-3 bg-slate-900 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-black transition-all group/btn">
                  View Full Case Study <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modern Case Study Builder Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-white/20"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-navy text-white shrink-0">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/10 rounded-2xl">
                    <Briefcase size={24} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{editingId ? "Refine Case Study" : "Draft New Case Study"}</h2>
                    <p className="text-white/40 text-xs mt-0.5">Define your institutional success story.</p>
                  </div>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto custom-scrollbar">
                <div className="p-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
                  
                  {/* Left Column: Metadata */}
                  <div className="lg:col-span-5 space-y-8">
                    <div className="space-y-6">
                      <h3 className="text-xs font-bold text-navy uppercase tracking-widest flex items-center gap-2">
                        <Layout size={14} /> Core Identity
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Title</label>
                          <input 
                            required 
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:border-navy focus:bg-white transition-all" 
                            placeholder="e.g. Smart Hub Integration 2026"
                            value={formData.title} 
                            onChange={e => setFormData({...formData, title: e.target.value})} 
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Category</label>
                            <select 
                              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-navy focus:bg-white transition-all"
                              value={formData.category}
                              onChange={e => setFormData({...formData, category: e.target.value})}
                            >
                              <option>Industrial</option>
                              <option>Academic</option>
                              <option>R&D Labs</option>
                              <option>Robotics</option>
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Client / Org</label>
                            <input 
                              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:border-navy focus:bg-white transition-all" 
                              placeholder="Optional"
                              value={formData.client_name}
                              onChange={e => setFormData({...formData, client_name: e.target.value})}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Execution Date</label>
                            <input 
                              required 
                              type="date" 
                              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:border-navy focus:bg-white transition-all" 
                              value={formData.date} 
                              onChange={e => setFormData({...formData, date: e.target.value})} 
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Location</label>
                            <input 
                              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:border-navy focus:bg-white transition-all" 
                              placeholder="City, Center"
                              value={formData.location} 
                              onChange={e => setFormData({...formData, location: e.target.value})} 
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6 pt-4">
                      <h3 className="text-xs font-bold text-navy uppercase tracking-widest flex items-center gap-2">
                        <Video size={14} /> Media Assets
                      </h3>
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Hero Image</label>
                          <div className="relative group">
                            <div className={`w-full aspect-video rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden bg-slate-50
                              ${formData.image_url ? 'border-navy/20' : 'border-slate-200 hover:border-navy/40'}
                            `}>
                              {formData.image_url ? (
                                <>
                                  <img src={formData.image_url} className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                    <button 
                                      type="button"
                                      onClick={() => document.getElementById('image-upload').click()}
                                      className="bg-white text-navy px-4 py-2 rounded-xl text-xs font-bold shadow-xl active:scale-95 transition-all"
                                    >
                                      Change Photo
                                    </button>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="p-4 bg-white rounded-2xl shadow-sm text-slate-400 mb-3 group-hover:text-navy transition-colors">
                                    <Image size={32} />
                                  </div>
                                  <button 
                                    type="button"
                                    onClick={() => document.getElementById('image-upload').click()}
                                    className="text-xs font-bold text-navy hover:underline"
                                  >
                                    Upload Project Visual
                                  </button>
                                  <p className="text-[9px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">JPG, PNG up to 5MB</p>
                                </>
                              )}
                              {isUploading && (
                                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                                  <RefreshCcw size={24} className="text-navy animate-spin mb-2" />
                                  <span className="text-[10px] font-bold text-navy uppercase tracking-widest">Uploading...</span>
                                </div>
                              )}
                            </div>
                            <input 
                              id="image-upload"
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e.target.files[0])}
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Video Documentary Link</label>
                          <input 
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:border-navy focus:bg-white transition-all" 
                            placeholder="Optional YouTube Link"
                            value={formData.video_url} 
                            onChange={e => setFormData({...formData, video_url: e.target.value})} 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-4">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Executive Summary</label>
                      <textarea 
                        rows={4} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:border-navy focus:bg-white transition-all resize-none" 
                        placeholder="A brief overview for the card display..."
                        value={formData.description} 
                        onChange={e => setFormData({...formData, description: e.target.value})} 
                      />
                    </div>
                  </div>

                  {/* Right Column: Case Study Builder */}
                  <div className="lg:col-span-7 space-y-8 bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-navy uppercase tracking-widest flex items-center gap-2">
                        <PlusCircle size={14} /> Content Architecture
                      </h3>
                      <div className="flex gap-2">
                        {SECTION_TYPES.map(s => (
                          <button
                            key={s.type}
                            type="button"
                            onClick={() => addSection(s.type)}
                            title={`Add ${s.label}`}
                            className={`p-2 rounded-lg bg-white border border-slate-200 ${s.color} hover:shadow-md transition-all active:scale-95`}
                          >
                            <s.icon size={16} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      {formData.content.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-3xl bg-white/50">
                          <p className="text-xs font-bold text-slate-400 uppercase">Start building your story by adding sections above</p>
                        </div>
                      )}
                      {formData.content.map((section, idx) => {
                        const type = SECTION_TYPES.find(s => s.type === section.type);
                        return (
                          <motion.div 
                            key={idx} 
                            layout
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 relative group"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-xl bg-slate-50 ${type?.color}`}>
                                  {type ? <type.icon size={16} /> : <FileText size={16} />}
                                </div>
                                <input 
                                  className="text-xs font-bold text-slate-900 uppercase tracking-widest bg-transparent outline-none focus:text-navy"
                                  value={section.title}
                                  onChange={e => updateSection(idx, 'title', e.target.value)}
                                />
                              </div>
                              <button 
                                type="button" 
                                onClick={() => removeSection(idx)}
                                className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors"
                              >
                                <X size={16} />
                              </button>
                            </div>
                            <textarea 
                              rows={3}
                              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:border-navy focus:bg-white transition-all resize-none"
                              placeholder={`Describe the ${section.title.toLowerCase()}...`}
                              value={section.text}
                              onChange={e => updateSection(idx, 'text', e.target.value)}
                            />
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Sticky Footer Actions */}
                <div className="p-8 border-t border-slate-100 bg-white/80 backdrop-blur-md sticky bottom-0 flex items-center justify-end space-x-4">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)} 
                    className="px-8 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-all"
                  >
                    Discard
                  </button>
                  <button 
                    type="submit" 
                    className="px-10 py-3 bg-navy text-white rounded-2xl text-sm font-bold hover:bg-black transition-all shadow-xl shadow-navy/20 active:scale-95 flex items-center gap-2"
                  >
                    {editingId ? "Update Case Study" : "Publish Case Study"}
                    <ChevronRight size={16} className="text-primary" />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}
