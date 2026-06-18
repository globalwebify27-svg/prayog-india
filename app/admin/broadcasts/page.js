"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  RefreshCcw, 
  Search, 
  Trash2, 
  Edit3, 
  Plus, 
  X, 
  AlertCircle, 
  Megaphone,
  Filter
} from "lucide-react";

export default function BroadcastsManager() {
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all_roles");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" or "edit"
  const [selectedNoticeId, setSelectedNoticeId] = useState(null);
  
  // Form Data
  const [noticeData, setNoticeData] = useState({ title: "", content: "", target: "all" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/broadcast");
      const data = await res.json();
      if (data.success) {
        setNotices(data.notices || []);
      }
    } catch (error) {
      console.error("Failed to fetch notices:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setModalMode("create");
    setNoticeData({ title: "", content: "", target: "all" });
    setSelectedNoticeId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (notice) => {
    setModalMode("edit");
    setNoticeData({
      title: notice.title,
      content: notice.content,
      target: notice.target_role || "all"
    });
    setSelectedNoticeId(notice.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!noticeData.title.trim() || !noticeData.content.trim()) {
      alert("Please fill in both title and content");
      return;
    }

    setIsSubmitting(true);
    try {
      let url = "/api/admin/broadcast";
      let method = "POST";

      if (modalMode === "edit") {
        url = `/api/admin/broadcast/${selectedNoticeId}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: noticeData.title,
          content: noticeData.content,
          target_role: noticeData.target
        })
      });

      const data = await res.json();
      if (data.success) {
        alert(modalMode === "edit" ? "Broadcast updated successfully!" : "Broadcast sent successfully!");
        setIsModalOpen(false);
        fetchNotices();
      } else {
        alert(data.message || "Operation failed");
      }
    } catch (e) {
      alert("Error processing notice");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this broadcast? This action cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/broadcast/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        alert("Broadcast deleted successfully!");
        fetchNotices();
      } else {
        alert(data.message || "Failed to delete broadcast");
      }
    } catch (e) {
      alert("Error deleting notice");
    }
  };

  // Filter & Search Logic
  const filteredNotices = notices.filter((notice) => {
    const matchesSearch = 
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      notice.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = 
      roleFilter === "all_roles" || 
      notice.target_role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8 font-body">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Broadcast Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Create, edit, delete, and monitor notices sent to students and teachers.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={fetchNotices} 
            className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-navy hover:bg-slate-50 transition-all"
            title="Refresh List"
          >
            <RefreshCcw size={18} className={isLoading ? "animate-spin" : ""} />
          </button>
          <button 
            onClick={openCreateModal}
            className="flex items-center space-x-2 bg-navy text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-black transition-all shadow-sm group"
          >
            <Plus size={16} className="text-primary group-hover:scale-110 transition-transform" />
            <span>Create Broadcast</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-grow">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-navy focus:bg-white transition-all text-xs font-semibold"
          />
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <Filter size={14} className="text-slate-400" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-navy text-xs font-bold text-slate-600 appearance-none pr-8 relative cursor-pointer"
            style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='none' height='24' stroke='%23475569' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><polyline points='6 9 12 15 18 9'></polyline></svg>")`, backgroundPosition: 'right 8px center', backgroundSize: '16px', backgroundRepeat: 'no-repeat' }}
          >
            <option value="all_roles">All Audiences</option>
            <option value="all">Public (Everyone)</option>
            <option value="student">Students Only</option>
            <option value="teacher">Teachers Only</option>
          </select>
        </div>
      </div>

      {/* Broadcasts List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center">
            <RefreshCcw size={32} className="text-navy animate-spin mb-4" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading announcements...</p>
          </div>
        ) : filteredNotices.length === 0 ? (
          <div className="p-16 text-center">
            <Megaphone size={48} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-base font-bold text-slate-700">No broadcasts found</h3>
            <p className="text-slate-400 text-xs mt-1">Try refining your search query or create a new broadcast.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredNotices.map((notice) => (
              <div key={notice.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-50/50 transition-colors">
                <div className="space-y-2 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{notice.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                      notice.target_role === 'student' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                      notice.target_role === 'teacher' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                      'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    }`}>
                      {notice.target_role === 'all' ? 'All Roles' : notice.target_role}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {new Date(notice.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{notice.content}</p>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => openEditModal(notice)}
                    className="p-2 text-slate-400 hover:text-navy hover:bg-slate-100 rounded-lg transition-all"
                    title="Edit Broadcast"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(notice.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                    title="Delete Broadcast"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Broadcast Modal (Create / Edit) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-navy text-white">
                <div className="flex items-center space-x-3">
                  <Zap size={20} className="text-primary" />
                  <h2 className="text-lg font-bold">
                    {modalMode === "edit" ? "Edit Broadcast Message" : "Broadcast New Notice"}
                  </h2>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                  <X size={18} />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Target Audience</label>
                  <div className="flex space-x-2">
                    {['all', 'student', 'teacher'].map((role) => (
                      <button
                        key={role}
                        onClick={() => setNoticeData({...noticeData, target: role})}
                        className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                          noticeData.target === role 
                            ? "bg-navy text-white shadow-lg shadow-navy/20" 
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        {role === 'all' ? 'Everyone' : role}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Notice Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Academic Schedule Update"
                    value={noticeData.title}
                    onChange={(e) => setNoticeData({...noticeData, title: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-navy focus:bg-white transition-all text-sm font-semibold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Message Content</label>
                  <textarea 
                    rows={6}
                    placeholder="Type your announcement here..."
                    value={noticeData.content}
                    onChange={(e) => setNoticeData({...noticeData, content: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-4">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-all"
                >
                  Discard
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-navy text-white rounded-2xl font-bold text-sm hover:bg-black transition-all flex items-center space-x-2 shadow-xl shadow-navy/10 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <RefreshCcw size={16} className="animate-spin" />
                  ) : (
                    <Zap size={16} className="text-primary" />
                  )}
                  <span>{isSubmitting ? "Processing..." : modalMode === "edit" ? "Update Notice" : "Post Notice"}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
