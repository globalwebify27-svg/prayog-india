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
  AlertCircle
} from "lucide-react";

export default function AdminExamsPage() {
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newExam, setNewExam] = useState({
    title: "",
    description: "",
    course_id: "",
    duration: 60,
    total_marks: 100
  });

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
    const res = await fetch("/api/admin/exams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newExam)
    });
    const result = await res.json();
    if (result.success) {
      setShowAddModal(false);
      setNewExam({ title: "", description: "", course_id: "", duration: 60, total_marks: 100 });
      fetchExams();
    }
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
                  <button className="p-1.5 text-slate-400 hover:text-navy transition-colors">
                    <MoreVertical size={16} />
                  </button>
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
              <h3 className="text-xl font-bold text-slate-900">Initialize New Assessment</h3>
              <p className="text-slate-500 text-xs mt-1">Set the basic parameters before adding questions.</p>
            </div>
            <form onSubmit={handleCreateExam} className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Exam Title</label>
                <input 
                  required
                  placeholder="e.g. Mid-Term Machine Learning Quiz"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-navy outline-none transition-all"
                  value={newExam.title}
                  onChange={e => setNewExam({...newExam, title: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Associated Course</label>
                <select 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none cursor-pointer focus:border-navy"
                  value={newExam.course_id}
                  onChange={e => setNewExam({...newExam, course_id: e.target.value})}
                >
                  <option value="">Select Course</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Duration (Mins)</label>
                  <div className="relative">
                    <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="number"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:border-navy"
                      value={newExam.duration}
                      onChange={e => setNewExam({...newExam, duration: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Marks</label>
                  <input 
                    type="number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-navy"
                    value={newExam.total_marks}
                    onChange={e => setNewExam({...newExam, total_marks: e.target.value})}
                  />
                </div>
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
                <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-3 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all">Cancel</button>
                <button type="submit" className="px-8 py-3 bg-navy text-white rounded-xl text-xs font-bold transition-all shadow-lg hover:bg-black">Create Exam</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
