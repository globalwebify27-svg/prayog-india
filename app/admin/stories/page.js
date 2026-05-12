"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye, 
  MoreVertical,
  BookOpen,
  Calendar,
  User,
  Filter,
  CheckCircle,
  Clock
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminStoriesPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const res = await fetch("/api/stories");
      const data = await res.json();
      setStories(data);
    } catch (error) {
      console.error("Failed to fetch stories:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteStory = async (id) => {
    if (!confirm("Are you sure you want to delete this story?")) return;
    try {
      const res = await fetch(`/api/stories/${id}`, { method: "DELETE" });
      if (res.ok) {
        setStories(stories.filter(s => s.id !== id));
      }
    } catch (error) {
      alert("Delete failed");
    }
  };

  const filteredStories = stories.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Success Narratives</h1>
          <p className="text-slate-500 text-sm font-medium">Manage and publish institutional case studies and workshop stories.</p>
        </div>
        <Link 
          href="/admin/stories/new" 
          className="flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-xl shadow-navy/10"
        >
          <Plus size={18} />
          <span>New Narrative</span>
        </Link>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Stories</p>
          <p className="text-2xl font-bold text-navy">{stories.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Published</p>
          <p className="text-2xl font-bold text-emerald-500">{stories.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Drafts</p>
          <p className="text-2xl font-bold text-slate-300">0</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Engagement</p>
          <p className="text-2xl font-bold text-primary">High</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-navy transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by title, category or author..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-navy focus:ring-4 focus:ring-navy/5 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-xs text-slate-600 hover:bg-slate-50 transition-all uppercase tracking-widest">
          <Filter size={16} /> Filter
        </button>
      </div>

      {/* Stories Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white h-80 rounded-3xl animate-pulse border border-slate-100" />
          ))}
        </div>
      ) : filteredStories.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-20 text-center border border-dashed border-slate-200">
          <BookOpen size={48} className="mx-auto text-slate-100 mb-6" />
          <h3 className="text-lg font-bold text-slate-400 mb-2">No narratives found</h3>
          <p className="text-slate-300 text-sm mb-8">Start by creating your first success story to inspire the world.</p>
          <Link href="/admin/stories/new" className="inline-flex items-center gap-2 text-navy font-bold uppercase tracking-widest text-xs hover:gap-3 transition-all">
            Create Narrative <Plus size={16} />
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredStories.map((story) => (
              <motion.div 
                key={story.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-2xl hover:shadow-navy/5 transition-all duration-500"
              >
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  {story.thumbnail ? (
                    <img src={story.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                      <BookOpen size={40} />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur text-navy text-[9px] font-bold uppercase tracking-widest rounded-lg border border-white/20">
                      {story.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Link href={`/admin/stories/${story.id}`} className="p-2 bg-white/90 backdrop-blur rounded-lg text-slate-600 hover:text-navy hover:bg-white transition-all shadow-sm">
                      <Edit2 size={14} />
                    </Link>
                    <button 
                      onClick={() => deleteStory(story.id)}
                      className="p-2 bg-white/90 backdrop-blur rounded-lg text-rose-500 hover:bg-rose-50 transition-all shadow-sm"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(story.created_at).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1.5"><User size={12} /> {story.author || "PI Labs"}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-navy transition-colors line-clamp-2 leading-tight">
                    {story.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-6 font-medium leading-relaxed italic">
                    {story.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                    <div className="flex items-center gap-2 text-emerald-500">
                      <CheckCircle size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Published</span>
                    </div>
                    <Link 
                      href={`/stories/${story.id}`} 
                      target="_blank"
                      className="text-navy font-bold text-[10px] uppercase tracking-widest flex items-center gap-1.5 hover:gap-2 transition-all"
                    >
                      Preview <Eye size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
