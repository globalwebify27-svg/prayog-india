"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit, X, Loader2, Play, Video, Film, ExternalLink } from "lucide-react";

const CATEGORIES = ["Reel", "Overview", "Testimonial", "Media"];

export default function AdminVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);

  const [newVideo, setNewVideo] = useState({
    title: "",
    category: "Reel",
    youtube_url: "",
    description: ""
  });

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/videos?category=${selectedCategory}`);
      if (res.ok) {
        const data = await res.json();
        setVideos(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Failed to fetch videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/videos?category=${selectedCategory}`);
        if (res.ok) {
          const data = await res.json();
          if (!ignore) setVideos(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => { ignore = true; };
  }, [selectedCategory]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVideo)
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setNewVideo({ title: "", category: "Reel", youtube_url: "", description: "" });
        fetchVideos();
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/videos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingVideo)
      });
      const data = await res.json();
      if (data.success) {
        setShowEditModal(false);
        setEditingVideo(null);
        fetchVideos();
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this video?")) {
      try {
        const res = await fetch(`/api/videos?id=${id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) {
          fetchVideos();
        } else {
          alert("Error: " + data.message);
        }
      } catch (error) {
        alert("Error: " + error.message);
      }
    }
  };

  return (
    <div className="space-y-8 font-body">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">YouTube Video Manager</h1>
          <p className="text-slate-500 text-sm mt-1">Manage dynamic YouTube Reels, Overview Videos, and Video Testimonials shown across the website.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-navy text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-black transition-all shadow-md"
        >
          <Plus size={18} />
          <span>Add YouTube Video</span>
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm w-fit">
        {["All", ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
              selectedCategory === cat
                ? "bg-navy text-white shadow-md"
                : "text-slate-600 hover:text-navy hover:bg-slate-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Video Cards Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-navy border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
          <Film className="mx-auto text-slate-300 mb-4" size={40} />
          <p className="text-slate-500 font-medium">No videos found for this category. Click &apos;Add YouTube Video&apos; to create one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((vid) => (
            <motion.div 
              key={vid.id}
              layout
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className={`relative bg-slate-900 overflow-hidden ${vid.category === "Reel" ? "aspect-[9/16] max-h-72" : "aspect-video"}`}>
                  <img 
                    src={vid.thumbnail} 
                    alt={vid.title} 
                    onError={(e) => { e.target.src = `https://img.youtube.com/vi/${vid.video_id}/hqdefault.jpg`; }}
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white">
                      <Play size={18} fill="currentColor" className="ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute top-3 left-3 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                    {vid.category}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1 mb-1">{vid.title}</h3>
                  <p className="text-slate-400 text-xs line-clamp-2">{vid.description || "No description provided."}</p>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                <a 
                  href={vid.youtube_url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-xs text-navy font-bold flex items-center gap-1 hover:text-primary transition-colors"
                >
                  <span>YouTube</span>
                  <ExternalLink size={12} />
                </a>
                <div className="flex gap-1">
                  <button 
                    onClick={() => { setEditingVideo({ ...vid }); setShowEditModal(true); }}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(vid.id)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Video Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Add YouTube Video</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-navy transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Video Title</label>
                <input required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-navy/20 transition-all" placeholder="e.g. Robotics Workshop Reel #1" value={newVideo.title} onChange={e => setNewVideo({...newVideo, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Category</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none cursor-pointer" value={newVideo.category} onChange={e => setNewVideo({...newVideo, category: e.target.value})}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">YouTube URL / Shorts URL</label>
                  <input required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-navy/20 transition-all" placeholder="https://youtube.com/shorts/..." value={newVideo.youtube_url} onChange={e => setNewVideo({...newVideo, youtube_url: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Description (Optional)</label>
                <textarea rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-navy/20 transition-all resize-none" placeholder="Brief video summary..." value={newVideo.description} onChange={e => setNewVideo({...newVideo, description: e.target.value})} />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-50">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">Cancel</button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-navy text-white rounded-lg text-xs font-bold disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  <span>{isSubmitting ? "Saving..." : "Add Video"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Video Modal */}
      {showEditModal && editingVideo && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Edit YouTube Video</h3>
              <button onClick={() => { setShowEditModal(false); setEditingVideo(null); }} className="text-slate-400 hover:text-navy transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEdit} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Video Title</label>
                <input required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-navy/20 transition-all" value={editingVideo.title} onChange={e => setEditingVideo({...editingVideo, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Category</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none cursor-pointer" value={editingVideo.category} onChange={e => setEditingVideo({...editingVideo, category: e.target.value})}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">YouTube URL / Shorts URL</label>
                  <input required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-navy/20 transition-all" value={editingVideo.youtube_url} onChange={e => setEditingVideo({...editingVideo, youtube_url: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Description (Optional)</label>
                <textarea rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-navy/20 transition-all resize-none" value={editingVideo.description || ""} onChange={e => setEditingVideo({...editingVideo, description: e.target.value})} />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-50">
                <button type="button" onClick={() => { setShowEditModal(false); setEditingVideo(null); }} className="px-5 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">Cancel</button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-navy text-white rounded-lg text-xs font-bold disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  <span>{isSubmitting ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
