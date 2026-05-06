"use client";

import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  ArrowLeft, 
  Plus, 
  FileText, 
  Video, 
  Link as LinkIcon, 
  MoreVertical, 
  Trash2, 
  Lock, 
  Unlock,
  ChevronUp,
  ChevronDown,
  Layers
} from "lucide-react";

export default function CourseMaterialsPage({ params }) {
  const { id } = use(params);
  const [materials, setMaterials] = useState([]);
  const [course, setCourse] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [newMaterial, setNewMaterial] = useState({
    title: "",
    type: "document",
    content: "",
    module_number: 1,
    is_locked: false
  });

  useEffect(() => {
    fetchCourse();
    fetchMaterials();
    // Close menu on click outside
    const closeMenu = () => setActiveMenu(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, [id]);

  const fetchCourse = async () => {
    const res = await fetch("/api/admin/courses");
    const result = await res.json();
    if (result.success) {
      const found = result.courses.find(c => c.id === parseInt(id));
      setCourse(found);
    }
  };

  const fetchMaterials = async () => {
    const res = await fetch(`/api/admin/courses/materials?id=${id}`);
    const result = await res.json();
    if (result.success) setMaterials(result.data);
  };

  const handleAddMaterial = async (e) => {
    e.preventDefault();
    const url = `/api/admin/courses/materials?id=${id}`;
    const method = editingMaterial ? "PUT" : "POST"; // I'll need to implement PUT in API
    
    const res = await fetch(url, {
      method: "POST", // Sticking to POST for now but I'll add edit logic
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMaterial)
    });
    const result = await res.json();
    if (result.success) {
      setShowAddModal(false);
      setEditingMaterial(null);
      setNewMaterial({ title: "", type: "document", content: "", module_number: 1, is_locked: false });
      fetchMaterials();
    }
  };

  const handleDelete = async (mid) => {
    if (!confirm("Are you sure you want to delete this material?")) return;
    const res = await fetch(`/api/admin/courses/materials?id=${mid}`, { method: "DELETE" });
    const result = await res.json();
    if (result.success) fetchMaterials();
  };

  const toggleLock = async (material) => {
    // Just a quick hack for now using POST to update if I don't have PUT
    alert("Lock status toggled (API update pending)");
  };

  return (
    <div className="space-y-8 font-body max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/courses" className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-navy hover:bg-slate-50 transition-all shadow-sm">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">{course?.title || "Loading..."}</h1>
            <p className="text-slate-500 text-sm mt-1">Configure study steps and course materials.</p>
          </div>
        </div>
        <button 
          onClick={() => {
            setEditingMaterial(null);
            setNewMaterial({ title: "", type: "document", content: "", module_number: 1, is_locked: false });
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 bg-navy text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-black transition-all shadow-md"
        >
          <Plus size={18} />
          <span>Add Material</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
          <Layers size={18} className="text-navy" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Learning Path Configuration</h2>
        </div>

        {materials.length === 0 ? (
          <div className="p-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center mx-auto mb-4">
              <FileText size={32} />
            </div>
            <p className="text-slate-400 font-medium italic text-sm">No materials added to this course yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {materials.map((m, idx) => (
              <div key={m.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-all group relative">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center text-slate-300 mr-2">
                    <ChevronUp size={14} className="cursor-pointer hover:text-navy" />
                    <span className="text-[10px] font-bold">{m.module_number}</span>
                    <ChevronDown size={14} className="cursor-pointer hover:text-navy" />
                  </div>
                  <div className={`p-3 rounded-xl ${
                    m.type === 'video' ? 'bg-blue-50 text-blue-600' :
                    m.type === 'document' ? 'bg-emerald-50 text-emerald-600' :
                    m.type === 'step' ? 'bg-purple-50 text-purple-600' :
                    'bg-amber-50 text-amber-600'
                  }`}>
                    {m.type === 'video' ? <Video size={20} /> : 
                     m.type === 'document' ? <FileText size={20} /> : 
                     m.type === 'step' ? <Layers size={20} /> :
                     <LinkIcon size={20} />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{m.title}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m.type}</span>
                      {m.is_locked ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                          <Lock size={10} /> Locked
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                          <Unlock size={10} /> Public
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenu(activeMenu === m.id ? null : m.id);
                    }}
                    className="p-2 rounded-lg text-slate-400 hover:bg-slate-200 transition-all"
                  >
                    <MoreVertical size={18} />
                  </button>

                  <AnimatePresence>
                    {activeMenu === m.id && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-10 py-1 overflow-hidden"
                      >
                        <button className="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                          <FileText size={14} /> Edit Details
                        </button>
                        <button onClick={() => toggleLock(m)} className="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                          {m.is_locked ? <Unlock size={14} /> : <Lock size={14} />} 
                          {m.is_locked ? "Make Public" : "Lock Material"}
                        </button>
                        <div className="border-t border-slate-100 my-1"></div>
                        <button 
                          onClick={() => handleDelete(m.id)}
                          className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                        >
                          <Trash2 size={14} /> Delete Material
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900">Add New Material</h3>
              </div>
              <form onSubmit={handleAddMaterial} className="p-6 space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Title</label>
                  <input 
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:border-navy outline-none"
                    value={newMaterial.title}
                    onChange={e => setNewMaterial({...newMaterial, title: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Type</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none"
                      value={newMaterial.type}
                      onChange={e => setNewMaterial({...newMaterial, type: e.target.value})}
                    >
                      <option value="document">Document</option>
                      <option value="video">Video</option>
                      <option value="link">Link</option>
                      <option value="step">Process Step</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Module #</label>
                    <input 
                      type="number"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none"
                      value={newMaterial.module_number}
                      onChange={e => setNewMaterial({...newMaterial, module_number: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Content URL / Description</label>
                  <textarea 
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:border-navy outline-none"
                    value={newMaterial.content}
                    onChange={e => setNewMaterial({...newMaterial, content: e.target.value})}
                  />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input 
                    type="checkbox" 
                    id="is_locked"
                    checked={newMaterial.is_locked}
                    onChange={e => setNewMaterial({...newMaterial, is_locked: e.target.checked})}
                  />
                  <label htmlFor="is_locked" className="text-xs font-bold text-slate-600">Lock this material (Week restricted)</label>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-lg transition-all">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-navy text-white rounded-lg text-xs font-bold transition-all shadow-md">Save Material</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
