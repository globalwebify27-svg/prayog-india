"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Calendar, MapPin, Video, Layout } from "lucide-react";

export default function AdminWorkshops() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWorkshop, setNewWorkshop] = useState({
    title: "",
    description: "",
    image_url: "",
    video_url: "",
    date: "",
    location: ""
  });

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    setLoading(true);
    const res = await fetch("/api/workshops");
    const data = await res.json();
    setWorkshops(data);
    setLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/workshops", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newWorkshop)
    });
    const data = await res.json();
    if (data.success) {
      setShowAddModal(false);
      setNewWorkshop({ title: "", description: "", image_url: "", video_url: "", date: "", location: "" });
      fetchWorkshops();
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this workshop story?")) {
      const res = await fetch(`/api/workshops?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchWorkshops();
    }
  };

  return (
    <div className="space-y-8 font-body">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Workshop Stories</h1>
          <p className="text-slate-500 text-sm mt-1">Share industrial successes, student innovations, and workshop highlights.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-navy text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-black transition-all shadow-md"
        >
          <Plus size={18} />
          <span>New Story</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {workshops.map((w) => (
          <motion.div 
            key={w.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col md:flex-row"
          >
            <div className="w-full md:w-48 h-48 bg-slate-100 relative">
               {w.image_url ? <img src={w.image_url} className="w-full h-full object-cover" /> : <Layout className="m-auto mt-16 text-slate-300" />}
               {w.video_url && (
                 <div className="absolute top-2 left-2 p-1.5 bg-primary text-navy rounded-lg">
                    <Video size={14} />
                 </div>
               )}
            </div>
            <div className="p-6 flex-grow flex flex-col justify-between">
               <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">{w.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(w.date).toDateString()}</span>
                    <span className="flex items-center gap-1"><MapPin size={12} /> {w.location}</span>
                  </div>
               </div>
               <div className="flex justify-end">
                  <button onClick={() => handleDelete(w.id)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900">Post New Workshop Story</h3>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
               <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Story Title</label>
                  <input required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none" value={newWorkshop.title} onChange={e => setNewWorkshop({...newWorkshop, title: e.target.value})} />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Date</label>
                    <input required type="date" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none" value={newWorkshop.date} onChange={e => setNewWorkshop({...newWorkshop, date: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Location</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none" value={newWorkshop.location} onChange={e => setNewWorkshop({...newWorkshop, location: e.target.value})} />
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Image URL</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none" value={newWorkshop.image_url} onChange={e => setNewWorkshop({...newWorkshop, image_url: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Video URL (Optional)</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none" value={newWorkshop.video_url} onChange={e => setNewWorkshop({...newWorkshop, video_url: e.target.value})} />
                  </div>
               </div>
               <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Description</label>
                  <textarea rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none" value={newWorkshop.description} onChange={e => setNewWorkshop({...newWorkshop, description: e.target.value})} />
               </div>
               <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2 text-xs font-bold text-slate-500">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-navy text-white rounded-lg text-xs font-bold">Publish Story</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
