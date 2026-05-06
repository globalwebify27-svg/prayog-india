"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Trash2, Edit2, User, BookOpen, Star } from "lucide-react";

export default function AdminFaculties() {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFaculty, setNewFaculty] = useState({
    name: "",
    role: "",
    specialty: "",
    image: "",
    bio: "",
    education: "",
    expertise: "" // Will be split by comma
  });

  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    setLoading(true);
    const res = await fetch("/api/faculties");
    const data = await res.json();
    setFaculties(data);
    setLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const expertiseArray = newFaculty.expertise.split(",").map(i => i.trim());
    const res = await fetch("/api/faculties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newFaculty, expertise: expertiseArray })
    });
    const data = await res.json();
    if (data.success) {
      setShowAddModal(false);
      setNewFaculty({ name: "", role: "", specialty: "", image: "", bio: "", education: "", expertise: "" });
      fetchFaculties();
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this faculty member?")) {
      const res = await fetch(`/api/faculties?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchFaculties();
    }
  };

  return (
    <div className="space-y-8 font-body">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Faculty Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage institutional mentors, professors, and industry experts.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-navy text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-black transition-all shadow-md"
        >
          <Plus size={18} />
          <span>Add Faculty</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {faculties.map((f) => (
          <motion.div 
            key={f.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden">
                  {f.image ? <img src={f.image} className="w-full h-full object-cover" /> : <User size={24} className="m-auto mt-4 text-slate-300" />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{f.name}</h3>
                  <p className="text-xs text-slate-500">{f.role}</p>
                </div>
              </div>
              <button onClick={() => handleDelete(f.id)} className="text-slate-400 hover:text-rose-500 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
            
            <div className="space-y-3">
               <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Star size={14} className="text-primary" />
                  <span className="font-semibold">{f.specialty}</span>
               </div>
               <div className="flex items-center gap-2 text-xs text-slate-600">
                  <BookOpen size={14} className="text-navy" />
                  <span>{f.education}</span>
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900">Add New Faculty</h3>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Full Name</label>
                    <input required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none" value={newFaculty.name} onChange={e => setNewFaculty({...newFaculty, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Role</label>
                    <input required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none" value={newFaculty.role} onChange={e => setNewFaculty({...newFaculty, role: e.target.value})} />
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Specialty</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none" value={newFaculty.specialty} onChange={e => setNewFaculty({...newFaculty, specialty: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Education</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none" value={newFaculty.education} onChange={e => setNewFaculty({...newFaculty, education: e.target.value})} />
                  </div>
               </div>
               <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Image URL</label>
                  <input className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none" value={newFaculty.image} onChange={e => setNewFaculty({...newFaculty, image: e.target.value})} />
               </div>
               <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Expertise (comma separated)</label>
                  <input className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none" placeholder="Robotics, AI, IoT" value={newFaculty.expertise} onChange={e => setNewFaculty({...newFaculty, expertise: e.target.value})} />
               </div>
               <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Bio</label>
                  <textarea rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none" value={newFaculty.bio} onChange={e => setNewFaculty({...newFaculty, bio: e.target.value})} />
               </div>
               <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2 text-xs font-bold text-slate-500">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-navy text-white rounded-lg text-xs font-bold">Save Faculty</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
