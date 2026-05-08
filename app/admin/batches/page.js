"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Video, 
  Clock, 
  Calendar, 
  Users, 
  ExternalLink,
  X,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";

export default function LiveSessionsPage() {
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [timings, setTimings] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  
  const [newBatch, setNewBatch] = useState({
    name: "",
    course_id: "",
    timing_id: "",
    schedule: "",
    type: "online",
    meeting_link: "",
    start_date: "",
    end_date: ""
  });

  useEffect(() => {
    fetchBatches();
    fetchCourses();
    fetchTimings();
  }, []);

  const fetchBatches = async () => {
    const res = await fetch("/api/admin/batches");
    const result = await res.json();
    if (result.success) setBatches(result.batches);
  };

  const fetchCourses = async () => {
    const res = await fetch("/api/admin/courses");
    const result = await res.json();
    if (result.success) setCourses(result.courses);
  };

  const fetchTimings = async () => {
    const res = await fetch("/api/admin/timings");
    const result = await res.json();
    if (result.success) setTimings(result.timings);
  };

  const handleEdit = (batch) => {
    setIsEditing(true);
    setEditingId(batch.id);
    setNewBatch({
      name: batch.name,
      course_id: batch.course_id,
      timing_id: batch.timing_id || "",
      schedule: batch.schedule || "",
      type: batch.type || "online",
      meeting_link: batch.meeting_link || "",
      start_date: batch.start_date ? new Date(batch.start_date).toISOString().split('T')[0] : "",
      end_date: batch.end_date ? new Date(batch.end_date).toISOString().split('T')[0] : ""
    });
    setSelectedDays(batch.schedule ? batch.schedule.split(', ') : []);
    setShowAddModal(true);
  };

  const toggleDay = (day) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  useEffect(() => {
    setNewBatch(prev => ({ ...prev, schedule: selectedDays.join(', ') }));
  }, [selectedDays]);

  const handleSaveBatch = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/admin/batches", {
      method: isEditing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(isEditing ? { ...newBatch, id: editingId } : newBatch)
    });
    const result = await res.json();
    if (result.success) {
      setShowAddModal(false);
      setIsEditing(false);
      setEditingId(null);
      setNewBatch({ name: "", course_id: "", timing_id: "", schedule: "", type: "online", meeting_link: "", start_date: "", end_date: "" });
      setSelectedDays([]);
      fetchBatches();
    }
  };

  const confirmDelete = async () => {
    const res = await fetch(`/api/admin/batches?id=${batchToDelete.id}`, {
      method: "DELETE"
    });
    const result = await res.json();
    if (result.success) {
      setShowDeleteModal(false);
      setBatchToDelete(null);
      fetchBatches();
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Live Virtual Sessions
            <span className="px-3 py-1 bg-navy/5 text-navy rounded-full text-xs font-bold border border-navy/10">
              {batches.length} Active
            </span>
          </h2>
          <p className="text-slate-500 mt-1 font-medium italic">"Real-time education, borderless learning."</p>
        </div>
        <button 
          onClick={() => {
            setIsEditing(false);
            setNewBatch({ name: "", course_id: "", timing_id: "", schedule: "", type: "online", meeting_link: "", start_date: "", end_date: "" });
            setSelectedDays([]);
            setShowAddModal(true);
          }}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-navy text-white rounded-2xl font-bold text-sm shadow-lg shadow-navy/20 hover:bg-black transition-all active:scale-95"
        >
          <Plus size={18} /> Schedule Session
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {batches.map((batch) => (
          <motion.div 
            layout
            key={batch.id}
            className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all group flex flex-col"
          >
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-navy group-hover:bg-navy group-hover:text-white transition-all">
                  <Video size={24} />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(batch)} className="p-2 text-slate-400 hover:text-navy hover:bg-slate-50 rounded-xl transition-all"><Edit size={18} /></button>
                  <button onClick={() => { setBatchToDelete(batch); setShowDeleteModal(true); }} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-navy transition-colors">{batch.name}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{batch.course_name}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <Clock size={16} className="text-navy" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Timing Slot</p>
                    <p className="text-xs font-bold text-slate-900">{batch.timing_name || 'Flexible Timing'} <span className="text-slate-400 font-medium">({batch.timing_slot || 'No slot'})</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <Calendar size={16} className="text-navy" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Schedule</p>
                    <p className="text-xs font-bold text-slate-900">{batch.schedule || 'To be announced'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto p-6 pt-0">
              <div className="flex items-center justify-between p-4 bg-slate-900 rounded-[1.5rem] text-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                    <Users size={14} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white/40 uppercase leading-none">Enrollments</p>
                    <p className="text-xs font-bold">{batch.enrollment_count || 0} Students</p>
                  </div>
                </div>
                {batch.meeting_link ? (
                  <Link 
                    href={batch.meeting_link} 
                    target="_blank"
                    className="p-2.5 rounded-xl bg-primary text-navy hover:scale-110 transition-all"
                  >
                    <ExternalLink size={18} />
                  </Link>
                ) : (
                  <div className="p-2.5 rounded-xl bg-white/5 text-white/20 cursor-not-allowed">
                    <ExternalLink size={18} />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">{isEditing ? 'Edit Session' : 'Schedule Session'}</h3>
                  <p className="text-slate-500 text-sm font-medium mt-1">Configure virtual classroom details.</p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-3 hover:bg-white rounded-2xl transition-all shadow-sm"><X size={20} /></button>
              </div>
              
              <form onSubmit={handleSaveBatch} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block ml-1">Session Name</label>
                    <input 
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-navy outline-none transition-all"
                      placeholder="e.g. Morning Live Batch"
                      value={newBatch.name}
                      onChange={e => setNewBatch({...newBatch, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block ml-1">Target Course</label>
                    <select 
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none cursor-pointer focus:border-navy"
                      value={newBatch.course_id}
                      onChange={e => setNewBatch({...newBatch, course_id: e.target.value})}
                    >
                      <option value="">Select Course</option>
                      {courses.filter(c => c.type === 'online').map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block ml-1">Preferred Slot</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none cursor-pointer focus:border-navy"
                      value={newBatch.timing_id}
                      onChange={e => setNewBatch({...newBatch, timing_id: e.target.value})}
                    >
                      <option value="">Select Timing</option>
                      {timings.map(t => <option key={t.id} value={t.id}>{t.name} ({t.slot})</option>)}
                    </select>
                  </div>

                  <div className="space-y-2 col-span-full">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block ml-1">Weekly Schedule</label>
                    <div className="flex flex-wrap gap-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day)}
                          className={`flex-grow py-3 rounded-xl text-xs font-bold transition-all border ${
                            selectedDays.includes(day)
                              ? 'bg-navy text-white border-navy shadow-md'
                              : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-200'
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5 col-span-full">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block ml-1">Meeting Link</label>
                    <input 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-navy outline-none transition-all"
                      placeholder="Zoom / GMeet / Teams Link"
                      value={newBatch.meeting_link}
                      onChange={e => setNewBatch({...newBatch, meeting_link: e.target.value})}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block ml-1">Start Date</label>
                    <input 
                      type="date"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-navy outline-none"
                      value={newBatch.start_date}
                      onChange={e => setNewBatch({...newBatch, start_date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block ml-1">End Date</label>
                    <input 
                      type="date"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-navy outline-none"
                      value={newBatch.end_date}
                      onChange={e => setNewBatch({...newBatch, end_date: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-grow py-4 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
                  <button type="submit" className="flex-grow py-4 bg-navy text-white rounded-2xl text-sm font-bold transition-all shadow-xl shadow-navy/20 hover:bg-black">
                    {isEditing ? 'Update Session' : 'Create Session'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[32px] shadow-2xl w-full max-w-sm overflow-hidden"
            >
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-rose-500 shadow-inner">
                  <AlertTriangle size={40} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Confirm Deletion</h3>
                <p className="text-slate-500 text-sm mt-3 leading-relaxed px-4">
                  You are about to delete <span className="font-bold text-slate-900">"{batchToDelete?.name}"</span>. 
                  This will unlink <span className="font-bold text-rose-600 underline">{batchToDelete?.enrollment_count || 0} students</span> from this session.
                </p>
              </div>
              <div className="grid grid-cols-2 border-t border-slate-100 h-20">
                <button onClick={() => setShowDeleteModal(false)} className="text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all uppercase tracking-widest">Cancel</button>
                <button onClick={confirmDelete} className="text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all border-l border-slate-100 uppercase tracking-widest">Yes, Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
