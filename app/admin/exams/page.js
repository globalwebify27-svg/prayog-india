"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  FileText, 
  Plus, 
  Search, 
  Clock, 
  Calendar, 
  ChevronRight, 
  BookOpen, 
  MoreVertical,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Hourglass,
  Pencil
} from "lucide-react";

export default function AdminExamsPage() {
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newExam, setNewExam] = useState({
    title: "",
    description: "",
    course_id: "",
    duration: 60,
    total_marks: 100,
    type: "objective",
    start_time: "",
    end_time: ""
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};
    if (!newExam.title.trim()) newErrors.title = "Title is required.";
    if (!newExam.course_id) newErrors.course_id = "Course selection is required.";
    if (!newExam.start_time) newErrors.start_time = "Start time is required.";
    if (!newExam.end_time) newErrors.end_time = "End time is required.";
    if (newExam.start_time && newExam.end_time && new Date(newExam.start_time) >= new Date(newExam.end_time)) {
      newErrors.end_time = "End time must be after start time.";
    }
    if (!newExam.duration || newExam.duration <= 0) newErrors.duration = "Invalid duration.";
    if (!newExam.total_marks || newExam.total_marks <= 0) newErrors.total_marks = "Invalid marks.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    fetchExams();
    fetchCourses();
  }, []);

  const fetchExams = async () => {
    const res = await fetch("/api/admin/exams");
    const result = await res.json();
    if (result.success) setExams(result.exams);
  };

  const fetchCourses = async () => {
    const res = await fetch("/api/admin/courses");
    const result = await res.json();
    if (result.success) setCourses(result.courses);
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    const method = isEditing ? "PUT" : "POST";
    const payload = isEditing ? { ...newExam, id: editingId } : newExam;
    setErrors({});

    const res = await fetch("/api/admin/exams", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    if (result.success) {
      setShowAddModal(false);
      setIsEditing(false);
      setEditingId(null);
      setNewExam({ title: "", description: "", course_id: "", duration: 60, total_marks: 100, type: "objective", start_time: "", end_time: "" });
      fetchExams();
      setErrors({});
    }
  };

  const handleEdit = (exam) => {
    // Format dates for datetime-local (YYYY-MM-DDTHH:MM)
    const start = exam.start_time ? new Date(exam.start_time).toISOString().slice(0, 16) : "";
    const end = exam.end_time ? new Date(exam.end_time).toISOString().slice(0, 16) : "";

    setNewExam({
      title: exam.title,
      description: exam.description || "",
      course_id: exam.course_id,
      duration: exam.duration,
      total_marks: exam.total_marks,
      type: exam.type,
      start_time: start,
      end_time: end
    });
    setEditingId(exam.id);
    setIsEditing(true);
    setShowAddModal(true);
  };

  const handleDeleteExam = async (id) => {
    if (!confirm("Are you sure you want to delete this exam?")) return;
    const res = await fetch(`/api/admin/exams?id=${id}`, { method: "DELETE" });
    const result = await res.json();
    if (result.success) fetchExams();
  };

  const filteredExams = exams.filter(e => 
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.course_title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 font-body">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Examination Engine</h1>
          <p className="text-slate-500 text-sm mt-1">Design objective and subjective assessments with time limits.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search exams..." 
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-navy outline-none w-64 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-navy text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-black transition-all shadow-md"
          >
            <Plus size={18} />
            <span>Create Exam</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExams.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-20 border border-slate-100 text-center shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center mx-auto mb-4">
              <FileText size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No exams configured</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto mt-2 italic">Launch your first assessment to start evaluating student performance.</p>
          </div>
        ) : (
          filteredExams.map((exam) => (
            <motion.div 
              key={exam.id}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${exam.is_active ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                    {exam.is_active ? 'Live' : 'Draft'}
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleEdit(exam)}
                      className="p-1.5 text-slate-400 hover:text-navy transition-colors bg-white hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100"
                    >
                      <Pencil size={14} />
                    </button>
                    <button 
                      onClick={() => handleDeleteExam(exam.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors bg-white hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-900 line-clamp-1">{exam.title}</h3>
                <p className="text-[11px] font-medium text-slate-400 mt-1 uppercase tracking-widest flex items-center gap-1.5">
                  <BookOpen size={12} className="text-navy" /> {exam.course_title || 'General Exam'}
                </p>
              </div>
              
              <div className="p-6 space-y-4 flex-grow">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Duration</p>
                    <div className="flex items-center gap-1.5 text-navy font-bold text-sm">
                      <Clock size={14} /> {exam.duration}m
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Max Marks</p>
                    <div className="flex items-center gap-1.5 text-navy font-bold text-sm">
                      <CheckCircle2 size={14} /> {exam.total_marks}
                    </div>
                  </div>
                </div>

                <Link 
                  href={`/admin/exams/${exam.id}`}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-navy text-white hover:bg-black transition-all group shadow-sm"
                >
                  <span className="text-xs font-bold">Configure Questions</span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-white/20"
          >
            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-900">{isEditing ? 'Update Assessment Details' : 'Initialize New Assessment'}</h3>
              <p className="text-slate-500 text-xs mt-1">{isEditing ? 'Modify existing parameters and schedule.' : 'Set the basic parameters before adding questions.'}</p>
            </div>
            <form onSubmit={handleCreateExam} className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Exam Title</label>
                <input 
                  required
                  placeholder="e.g. Mid-Term Machine Learning Quiz"
                  className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm outline-none transition-all ${errors.title ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500' : 'border-slate-200 focus:border-navy'}`}
                  value={newExam.title}
                  onChange={e => setNewExam({...newExam, title: e.target.value})}
                />
                {errors.title && <p className="text-[10px] text-rose-500 font-bold ml-1 mt-1">{errors.title}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Associated Course</label>
                <select 
                  required
                  disabled={isEditing}
                  className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm outline-none cursor-pointer transition-all ${errors.course_id ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500' : 'border-slate-200 focus:border-navy disabled:opacity-60'}`}
                  value={newExam.course_id}
                  onChange={e => setNewExam({...newExam, course_id: e.target.value})}
                >
                  <option value="">Select Course</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
                {errors.course_id && <p className="text-[10px] text-rose-500 font-bold ml-1 mt-1">{errors.course_id}</p>}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Start Date & Time</label>
                  <input 
                    type="datetime-local"
                    required
                    className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm outline-none transition-all ${errors.start_time ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500' : 'border-slate-200 focus:border-navy'}`}
                    value={newExam.start_time}
                    onChange={e => setNewExam({...newExam, start_time: e.target.value})}
                  />
                  {errors.start_time && <p className="text-[10px] text-rose-500 font-bold ml-1 mt-1">{errors.start_time}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">End Date & Time</label>
                  <input 
                    type="datetime-local"
                    required
                    className={`w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm outline-none transition-all ${errors.end_time ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500' : 'border-slate-200 focus:border-navy'}`}
                    value={newExam.end_time}
                    onChange={e => setNewExam({...newExam, end_time: e.target.value})}
                  />
                  {errors.end_time && <p className="text-[10px] text-rose-500 font-bold ml-1 mt-1">{errors.end_time}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Duration (Mins)</label>
                  <div className="relative">
                    <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="number"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:border-navy"
                      value={newExam.duration}
                      onChange={e => setNewExam({...newExam, duration: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Max Marks</label>
                  <div className="relative">
                    <CheckCircle2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="number"
                      required
                      placeholder="e.g. 100"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:border-navy"
                      value={newExam.total_marks}
                      onChange={e => setNewExam({...newExam, total_marks: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Exam Format</label>
                <select 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none cursor-pointer focus:border-navy"
                  value={newExam.type}
                  onChange={e => setNewExam({...newExam, type: e.target.value})}
                >
                  <option value="objective">Objective (MCQ)</option>
                  <option value="subjective">Subjective (Written)</option>
                  <option value="mixed">Mixed Format</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Instructions</label>
                <textarea 
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-navy outline-none transition-all"
                  placeholder="Tell students what to expect..."
                  value={newExam.description}
                  onChange={e => setNewExam({...newExam, description: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => {
                  setShowAddModal(false);
                  setIsEditing(false);
                  setEditingId(null);
                  setNewExam({ title: "", description: "", course_id: "", duration: 60, total_marks: 100, type: "objective", start_time: "", end_time: "" });
                }} className="px-6 py-3 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all">Cancel</button>
                <button type="submit" className="px-8 py-3 bg-navy text-white rounded-xl text-xs font-bold transition-all shadow-lg hover:bg-black">{isEditing ? 'Save Changes' : 'Create Exam'}</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
