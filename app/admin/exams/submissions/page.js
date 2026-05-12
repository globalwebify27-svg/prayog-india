"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Eye, 
  FileText, 
  ExternalLink, 
  Calculator, 
  ArrowLeft,
  CheckCircle2,
  Search,
  Filter,
  Inbox,
  Lock,
  Unlock,
  Trash2,
  AlertTriangle
} from "lucide-react";

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [questionScores, setQuestionScores] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/exams/submissions");
      const result = await res.json();
      if (result.success) setSubmissions(result.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async (examId) => {
    try {
      const res = await fetch(`/api/admin/exams/questions?exam_id=${examId}`);
      const result = await res.json();
      if (result.success) setQuestions(result.data);
    } catch (e) {
      console.error(e);
    }
  };

  const openReviewModal = async (sub) => {
    setSelectedSubmission(sub);
    await fetchQuestions(sub.exam_id);
    
    // Initialize scores
    const initialScores = {};
    const answers = JSON.parse(sub.answers || "{}");
    Object.keys(answers).forEach(qId => {
      initialScores[qId] = answers[qId].awarded_score || 0;
    });
    setQuestionScores(initialScores);
    setShowViewModal(true);
  };

  const handleGrade = async () => {
    const totalScore = Object.values(questionScores).reduce((acc, score) => acc + (parseFloat(score) || 0), 0);
    
    const updatedAnswers = JSON.parse(selectedSubmission.answers);
    Object.keys(questionScores).forEach(qId => {
      if (updatedAnswers[qId]) {
        updatedAnswers[qId].awarded_score = parseFloat(questionScores[qId]);
      }
    });

    const res = await fetch("/api/admin/exams/submissions", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        id: selectedSubmission.id, 
        score: totalScore, 
        status: 'graded',
        answers: JSON.stringify(updatedAnswers)
      })
    });
    const result = await res.json();
    if (result.success) {
      fetchSubmissions();
      setShowViewModal(false);
      alert(`Grading finalized. Total Score: ${totalScore}`);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this student's submission? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/exams/submissions?id=${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        fetchSubmissions();
        alert("Submission deleted successfully.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const unlockSubmission = () => {
    setSelectedSubmission({
      ...selectedSubmission,
      status: 'pending'
    });
  };

  const calculateTotalAwarded = () => {
    return Object.values(questionScores).reduce((acc, score) => acc + (parseFloat(score) || 0), 0);
  };

  const filteredSubmissions = submissions.filter(s => {
    const matchesSearch = s.student_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         s.exam_title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || s.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 font-body max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Submission Review</h1>
          <p className="text-slate-500 text-sm mt-1">Review and grade student exam responses across all programs.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by student or exam..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-navy transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select 
            className="w-full sm:w-auto bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 outline-none focus:border-navy shadow-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="graded">Graded</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Inbox size={18} className="text-navy" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Recent Submissions</h2>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {filteredSubmissions.length} Submissions Found
          </span>
        </div>

        {loading ? (
          <div className="p-20 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-navy border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-slate-400 text-sm italic">Loading submissions...</p>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="p-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center mx-auto mb-4">
              <Inbox size={32} />
            </div>
            <p className="text-slate-400 font-medium italic text-sm">No submissions matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="px-6 py-4">Student Info</th>
                  <th className="px-6 py-4">Exam Assessment</th>
                  <th className="px-6 py-4">Submission Date</th>
                  <th className="px-6 py-4">Current Score</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">{sub.student_name}</span>
                        <span className="text-[10px] text-slate-400">{sub.student_email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-navy">{sub.exam_title}</span>
                        <span className="text-[10px] text-slate-400">Total Marks: {sub.exam_total_marks}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                      {new Date(sub.submitted_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      {sub.status === 'graded' ? (
                        <span className="text-sm font-black text-slate-900">{sub.score} / {sub.exam_total_marks}</span>
                      ) : (
                        <span className="text-[10px] text-slate-300 font-bold italic uppercase tracking-widest">Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${sub.status === 'graded' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openReviewModal(sub)}
                          className={`p-2.5 rounded-xl transition-all inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest shadow-sm ${
                            sub.status === 'graded' 
                            ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' 
                            : 'bg-navy text-white hover:bg-black'
                          }`}
                        >
                          {sub.status === 'graded' ? <Lock size={14} /> : <Eye size={14} />}
                          {sub.status === 'graded' ? 'View Graded' : 'Review Work'}
                        </button>
                        <button 
                          onClick={() => handleDelete(sub.id)}
                          className="p-2.5 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Submission Modal */}
      {showViewModal && selectedSubmission && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2rem] shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-navy text-white flex items-center justify-center font-bold shadow-lg uppercase">
                  {selectedSubmission.student_name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-slate-900">{selectedSubmission.student_name}</h3>
                    {selectedSubmission.status === 'graded' && (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[9px] font-bold uppercase tracking-widest">Locked</span>
                    )}
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5">{selectedSubmission.exam_title} • Submitted {new Date(selectedSubmission.submitted_at).toLocaleDateString()}</p>
                </div>
              </div>
              <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
                <ArrowLeft size={20} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-8 space-y-8 custom-scrollbar bg-slate-50/30">
              {selectedSubmission.status === 'graded' && (
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-amber-800 text-xs font-medium">
                    <Lock size={16} />
                    This submission has already been graded and finalized.
                  </div>
                  <button 
                    onClick={unlockSubmission}
                    className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg text-[9px] font-bold text-amber-700 uppercase tracking-widest border border-amber-200 hover:bg-amber-100 transition-all shadow-sm"
                  >
                    <Unlock size={12} /> Unlock for Correction
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 gap-8">
                {Object.entries(JSON.parse(selectedSubmission.answers)).map(([qId, response], idx) => {
                  const question = questions.find(q => q.id === parseInt(qId));
                  const isCorrectMCQ = question?.type === 'objective' && response.text === question?.correct_answer;
                  
                  return (
                    <div key={qId} className="p-8 rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="flex-grow space-y-4">
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-xl bg-navy text-white flex items-center justify-center text-[10px] font-black shadow-sm">{idx + 1}</span>
                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider ${question?.type === 'objective' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                              {question?.type}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-slate-900 leading-relaxed">{question?.question_text || "Loading question text..."}</h4>
                          
                          {question?.type === 'objective' && (
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Correct Answer</p>
                              <div className="flex items-center gap-2">
                                <CheckCircle2 size={14} className="text-emerald-500" />
                                <span className="text-sm font-bold text-slate-700">{question.correct_answer}</span>
                              </div>
                            </div>
                          )}

                          <div className="pt-4 space-y-4">
                            <div className={`p-6 rounded-2xl border transition-all ${isCorrectMCQ ? 'bg-emerald-50/50 border-emerald-100' : 'bg-slate-50/50 border-slate-100'}`}>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Student Response</p>
                              <p className="text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">{response.text || "No written response provided."}</p>
                            </div>
                            
                            {response.file_url && (
                              <div className="p-5 rounded-2xl bg-navy/5 border border-navy/10 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-navy shadow-sm border border-navy/5">
                                    <FileText size={20} />
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-slate-900">Attached Answer Sheet</p>
                                    <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-widest font-medium">Original Document</p>
                                  </div>
                                </div>
                                <a 
                                  href={response.file_url} 
                                  target="_blank" 
                                  className="flex items-center gap-2 bg-navy text-white px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all shadow-md"
                                >
                                  <ExternalLink size={14} /> View File
                                </a>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="shrink-0 w-full md:w-48 bg-slate-50/50 p-6 rounded-[1.5rem] border border-slate-100 flex flex-col items-center justify-center gap-3">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Allot Marks</label>
                          <div className="relative w-full">
                            <input 
                              type="number" 
                              step="0.5"
                              max={question?.marks}
                              disabled={selectedSubmission.status === 'graded'}
                              className={`w-full bg-white border-2 border-slate-200 rounded-2xl px-4 py-3 text-center text-lg font-black text-navy outline-none focus:border-navy transition-all ${selectedSubmission.status === 'graded' ? 'opacity-70 cursor-not-allowed bg-slate-50' : ''}`}
                              value={questionScores[qId] || ""}
                              onChange={(e) => setQuestionScores({
                                ...questionScores,
                                [qId]: e.target.value
                              })}
                            />
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-tighter">
                              Max: {question?.marks || 0}
                            </div>
                          </div>
                          {question?.type === 'objective' && selectedSubmission.status !== 'graded' && (
                            <button 
                              onClick={() => setQuestionScores({
                                ...questionScores,
                                [qId]: isCorrectMCQ ? question.marks : 0
                              })}
                              className="text-[9px] font-bold text-navy uppercase underline hover:text-black transition-colors"
                            >
                              Auto-Fill Marks
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-8 border-t border-slate-200 bg-white flex flex-col md:flex-row items-center justify-between gap-6 shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-8">
                <div className="p-4 bg-navy/5 rounded-2xl border border-navy/10 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-navy text-white flex items-center justify-center shadow-lg">
                    <Calculator size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      {selectedSubmission.status === 'graded' ? 'Final Score' : 'Calculated Total'}
                    </p>
                    <p className="text-xl font-black text-navy">{calculateTotalAwarded()} <span className="text-slate-300 font-medium">/ {questions.reduce((acc, q) => acc + q.marks, 0)}</span></p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button 
                  onClick={() => setShowViewModal(false)}
                  className="flex-1 md:flex-none px-8 py-3.5 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-2xl transition-all border border-slate-100"
                >
                  {selectedSubmission.status === 'graded' ? 'Close View' : 'Discard'}
                </button>
                {selectedSubmission.status !== 'graded' && (
                  <button 
                    onClick={handleGrade}
                    className="flex-1 md:flex-none px-12 py-3.5 bg-navy text-white rounded-2xl text-xs font-bold shadow-xl hover:bg-black transition-all"
                  >
                    Finalize & Lock
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
