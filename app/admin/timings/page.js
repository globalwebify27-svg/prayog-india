"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Trash2, 
  Clock, 
  Calendar,
  AlertCircle
} from "lucide-react";

export default function TimingMasterPage() {
  const [timings, setTimings] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [timingToDelete, setTimingToDelete] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [newTiming, setNewTiming] = useState({ name: "", slot: "" });

  useEffect(() => {
    fetchUser();
    fetchTimings();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.success) setUser(data.user);
    } catch (e) {}
  };

  const fetchTimings = async () => {
    const res = await fetch("/api/admin/timings");
    const result = await res.json();
    if (result.success) setTimings(result.timings);
  };

  const handleAddTiming = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/admin/timings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTiming)
    });
    const result = await res.json();
    if (result.success) {
      setShowAddModal(false);
      setNewTiming({ name: "", slot: "" });
      fetchTimings();
    }
  };

  const confirmDeleteTiming = async () => {
    const res = await fetch(`/api/admin/timings?id=${timingToDelete.id}`, {
      method: "DELETE"
    });
    const result = await res.json();
    if (result.success) {
      setShowDeleteModal(false);
      setTimingToDelete(null);
      fetchTimings();
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Timing Master</h2>
          <p className="text-slate-500 mt-1 font-medium">Define institutional time slots for academic programs.</p>
        </div>
        {user?.role === 'admin' && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-navy text-white rounded-2xl font-bold text-sm shadow-lg shadow-navy/20 hover:bg-black transition-all active:scale-95"
          >
            <Plus size={18} /> Define New Slot
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {timings.map((timing) => (
          <motion.div 
            layout
            key={timing.id}
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-navy group-hover:bg-navy group-hover:text-white transition-all">
                <Clock size={24} />
              </div>
              {user?.role === 'admin' && (
                <button 
                  onClick={() => {
                    setTimingToDelete(timing);
                    setShowDeleteModal(true);
                  }}
                  className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">{timing.name}</h3>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl text-navy font-bold text-xs uppercase tracking-widest border border-slate-100">
              <Calendar size={12} /> {timing.slot}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900">Define Time Slot</h3>
            </div>
            <form onSubmit={handleAddTiming} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Slot Name</label>
                <input 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-navy outline-none transition-all"
                  placeholder="e.g. Morning Batch"
                  value={newTiming.name}
                  onChange={e => setNewTiming({...newTiming, name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Time Range</label>
                <input 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-navy outline-none transition-all"
                  placeholder="e.g. 09:00 AM - 11:00 AM"
                  value={newTiming.slot}
                  onChange={e => setNewTiming({...newTiming, slot: e.target.value})}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-grow py-3 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all">Cancel</button>
                <button type="submit" className="flex-grow py-3 bg-navy text-white rounded-xl text-xs font-bold transition-all shadow-md hover:bg-black">Save Slot</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden"
          >
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={40} className="text-rose-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Timing?</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Are you sure you want to delete <span className="font-bold text-slate-800">"{timingToDelete.name}"</span>?
              </p>
              {error && (
                <div className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2">
                  <AlertCircle size={14} className="text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] font-bold text-rose-500 text-left">{error}</p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 border-t border-slate-100 h-16">
              <button onClick={() => { setShowDeleteModal(false); setError(""); }} className="text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all">Cancel</button>
              <button onClick={confirmDeleteTiming} className="text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all border-l border-slate-100">Yes, Delete</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
