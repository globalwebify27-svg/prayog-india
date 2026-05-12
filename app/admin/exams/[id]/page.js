"use client";

import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Plus, 
  ArrowLeft, 
  Trash2, 
  MoreVertical, 
  Layers, 
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Hash,
  ChevronUp,
  ChevronDown,
  Type,
  ListOrdered,
  Upload,
  FileSpreadsheet,
  Download,
  Users,
  Eye,
  FileText,
  ExternalLink
} from "lucide-react";

export default function ExamQuestionsPage({ params }) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState("questions"); // "questions" or "submissions"
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [bulkFile, setBulkFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    question_text: "",
    type: "objective",
    options: ["", "", "", ""],
    correct_answer: "",
    marks: 5,
    order_num: 0
  });

  useEffect(() => {
    fetchExam();
    fetchQuestions();
    fetchSubmissions();
  }, [id]);

  const fetchExam = async () => {
    const res = await fetch("/api/admin/exams");
    const result = await res.json();
    if (result.success) {
      const found = result.exams.find(e => e.id === parseInt(id));
      setExam(found);
    }
  };

  const fetchQuestions = async () => {
    const res = await fetch(`/api/admin/exams/questions?exam_id=${id}`);
    const result = await res.json();
    if (result.success) setQuestions(result.data);
  };

  const fetchSubmissions = async () => {
    const res = await fetch(`/api/admin/exams/submissions?exam_id=${id}`);
    const result = await res.json();
    if (result.success) setSubmissions(result.data);
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/admin/exams/questions?exam_id=${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newQuestion)
    });
    const result = await res.json();
    if (result.success) {
      setShowAddModal(false);
      setNewQuestion({
        question_text: "",
        type: "objective",
        options: ["", "", "", ""],
        correct_answer: "",
        marks: 5,
        order_num: questions.length + 1
      });
      fetchQuestions();
    }
  };

  const handleDelete = async (qid) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    const res = await fetch(`/api/admin/exams/questions?id=${qid}`, { method: "DELETE" });
    const result = await res.json();
    if (result.success) fetchQuestions();
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    if (!bulkFile) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target.result;
        const rows = text.split("\n").slice(1); // Skip header
        const parsedQuestions = rows.filter(row => row.trim()).map(row => {
          const [question_text, type, optA, optB, optC, optD, correct_answer, marks] = row.split(",").map(i => i?.trim());
          return {
            question_text,
            type: type?.toLowerCase() || 'objective',
            options: [optA, optB, optC, optD].filter(o => o),
            correct_answer,
            marks: parseInt(marks) || 5,
            order_num: 0
          };
        });

        const res = await fetch(`/api/admin/exams/questions/bulk?exam_id=${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questions: parsedQuestions })
        });
        const result = await res.json();
        if (result.success) {
          setShowBulkModal(false);
          fetchQuestions();
          alert(result.message);
        } else {
          alert(result.message);
        }
      } catch (err) {
        alert("Error parsing CSV file. Please ensure it follows the correct format.");
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsText(bulkFile);
  };

  const downloadDemoSheet = () => {
    const headers = "Question,Type,Option A,Option B,Option C,Option D,Correct Answer,Marks\n";
    const sampleData = "What is the capital of India?,objective,New Delhi,Mumbai,Kolkata,Chennai,New Delhi,5\n" +
                      "Explain the laws of motion.,subjective,,,,,,10";
    const blob = new Blob([headers + sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "exam_questions_demo.csv";
    a.click();
  };

  const handleGrade = async (subId, score) => {
    const res = await fetch("/api/admin/exams/submissions", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: subId, score, status: 'graded' })
    });
    const result = await res.json();
    if (result.success) {
      fetchSubmissions();
      setShowViewModal(false);
    }
  };

  return (
    <div className="space-y-8 font-body max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/exams" className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-navy hover:bg-slate-50 transition-all shadow-sm">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">{exam?.title || "Loading..."}</h1>
            <p className="text-slate-500 text-sm mt-1">Manage questions and review student responses</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
          <button 
            onClick={() => setActiveTab("questions")}
            className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'questions' ? 'bg-white text-navy shadow-sm border border-slate-200' : 'text-slate-500 hover:text-navy'}`}
          >
            Questions
          </button>
          <button 
            onClick={() => setActiveTab("submissions")}
            className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'submissions' ? 'bg-white text-navy shadow-sm border border-slate-200' : 'text-slate-500 hover:text-navy'}`}
          >
            Submissions
          </button>
        </div>
      </div>

      {activeTab === "questions" ? (
        <>
          <div className="flex justify-end gap-3 mb-6">
            <button 
              onClick={() => setShowBulkModal(true)}
              className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
            >
              <Upload size={18} />
              <span>Bulk Upload</span>
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-navy text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-black transition-all shadow-md"
            >
              <Plus size={18} />
              <span>Add Question</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle size={18} className="text-navy" />
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Question Inventory</h2>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span>Total Questions: {questions.length}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span>Total Marks: {questions.reduce((acc, q) => acc + q.marks, 0)} / {exam?.total_marks}</span>
              </div>
            </div>

            {questions.length === 0 ? (
              <div className="p-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center mx-auto mb-4">
                  <Plus size={32} />
                </div>
                <p className="text-slate-400 font-medium italic text-sm">Start building your assessment by adding the first question.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {questions.map((q, idx) => (
                  <div key={q.id} className="p-6 hover:bg-slate-50/50 transition-all group relative">
                    <div className="flex items-start gap-5">
                      <div className="flex flex-col items-center pt-1 text-slate-300">
                        <span className="text-[10px] font-black text-navy/20 mb-1">{idx + 1}</span>
                        <div className="h-full w-0.5 bg-slate-100 rounded-full my-2"></div>
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${q.type === 'objective' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                            {q.type}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-widest">
                            <Hash size={10} /> {q.marks} Marks
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 leading-relaxed">{q.question_text}</h4>
                        
                        {q.type === 'objective' && q.options && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                            {JSON.parse(q.options).map((opt, oIdx) => (
                              <div key={oIdx} className={`p-3 rounded-xl text-xs font-medium border flex items-center gap-3 ${opt === q.correct_answer ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-white border-slate-100 text-slate-600'}`}>
                                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${opt === q.correct_answer ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                  {String.fromCharCode(65 + oIdx)}
                                </div>
                                {opt}
                                {opt === q.correct_answer && <CheckCircle2 size={12} className="ml-auto" />}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <button 
                        onClick={() => handleDelete(q.id)}
                        className="p-2 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-navy" />
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Student Submissions</h2>
              </div>
            </div>

            {submissions.length === 0 ? (
              <div className="p-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center mx-auto mb-4">
                  <Users size={32} />
                </div>
                <p className="text-slate-400 font-medium italic text-sm">No submissions received for this exam yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      <th className="px-6 py-4">Student</th>
                      <th className="px-6 py-4">Submitted At</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {submissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900">{sub.student_name}</span>
                            <span className="text-[10px] text-slate-400">{sub.student_email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500">
                          {new Date(sub.submitted_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${sub.status === 'graded' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                            {sub.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => {
                              setSelectedSubmission(sub);
                              setShowViewModal(true);
                            }}
                            className="p-2 rounded-xl bg-navy/5 text-navy hover:bg-navy hover:text-white transition-all inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
                          >
                            <Eye size={14} /> Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* View/Review Submission Modal */}
      {showViewModal && selectedSubmission && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-navy text-white flex items-center justify-center font-bold shadow-lg">
                  {selectedSubmission.student_name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedSubmission.student_name}</h3>
                  <p className="text-slate-500 text-xs mt-0.5">{selectedSubmission.student_email} • Submitted {new Date(selectedSubmission.submitted_at).toLocaleDateString()}</p>
                </div>
              </div>
              <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
                <ArrowLeft size={20} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-8 space-y-8 custom-scrollbar">
              <div className="grid grid-cols-1 gap-6">
                {Object.entries(JSON.parse(selectedSubmission.answers)).map(([qId, response], idx) => {
                  const question = questions.find(q => q.id === parseInt(qId));
                  return (
                    <div key={qId} className="p-6 rounded-3xl border border-slate-100 bg-white shadow-sm space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[10px] font-black">{idx + 1}</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${question?.type === 'objective' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                            {question?.type}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{question?.marks} Marks</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 leading-relaxed">{question?.question_text}</h4>
                      
                      <div className="pt-4 border-t border-slate-50 space-y-4">
                        <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Student Response</p>
                          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{response.text || "No written response provided."}</p>
                        </div>
                        
                        {response.file_url && (
                          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                                <FileText size={18} />
                              </div>
                              <div>
                                <p className="text-[11px] font-bold text-emerald-800">Attached Answer Sheet</p>
                                <p className="text-[9px] text-emerald-600 mt-0.5 uppercase tracking-widest">Document / Image</p>
                              </div>
                            </div>
                            <a 
                              href={response.file_url} 
                              target="_blank" 
                              className="flex items-center gap-2 bg-white text-emerald-700 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                            >
                              <ExternalLink size={14} /> Open File
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block ml-1">Award Score</label>
                  <input 
                    type="number" 
                    placeholder="0"
                    className="w-24 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-navy outline-none focus:border-navy transition-all"
                    defaultValue={selectedSubmission.score || 0}
                    id="score-input"
                  />
                </div>
                <div className="pt-5">
                  <span className="text-xs text-slate-400 font-medium">/ {questions.reduce((acc, q) => acc + q.marks, 0)} Total Marks</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowViewModal(false)}
                  className="px-6 py-3 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-2xl transition-all"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    const score = document.getElementById("score-input").value;
                    handleGrade(selectedSubmission.id, score);
                  }}
                  className="px-10 py-3 bg-navy text-white rounded-2xl text-xs font-bold shadow-lg hover:bg-black transition-all"
                >
                  Complete Grading
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-white/20"
          >
            <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Add New Question</h3>
                <p className="text-slate-500 text-xs mt-1">Configure question type and marking scheme.</p>
              </div>
              <div className="flex p-1 bg-slate-200 rounded-xl">
                <button 
                  onClick={() => setNewQuestion({...newQuestion, type: 'objective'})}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${newQuestion.type === 'objective' ? 'bg-white text-navy shadow-sm' : 'text-slate-500 hover:text-navy'}`}
                >
                  Objective
                </button>
                <button 
                  onClick={() => setNewQuestion({...newQuestion, type: 'subjective'})}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${newQuestion.type === 'subjective' ? 'bg-white text-navy shadow-sm' : 'text-slate-500 hover:text-navy'}`}
                >
                  Subjective
                </button>
              </div>
            </div>
            
            <form onSubmit={handleAddQuestion} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Question Text</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="Enter the question here..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-navy outline-none transition-all"
                  value={newQuestion.question_text}
                  onChange={e => setNewQuestion({...newQuestion, question_text: e.target.value})}
                />
              </div>

              {newQuestion.type === 'objective' && (
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Multiple Choice Options</label>
                  <div className="grid grid-cols-2 gap-4">
                    {newQuestion.options.map((opt, idx) => (
                      <div key={idx} className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg bg-slate-200 text-slate-500 flex items-center justify-center text-[10px] font-black group-focus-within:bg-navy group-focus-within:text-white transition-all">
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <input 
                          required
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-10 py-3 text-sm outline-none focus:border-navy transition-all"
                          placeholder={`Option ${idx + 1}`}
                          value={opt}
                          onChange={e => {
                            const updated = [...newQuestion.options];
                            updated[idx] = e.target.value;
                            setNewQuestion({...newQuestion, options: updated});
                          }}
                        />
                        <button 
                          type="button"
                          onClick={() => setNewQuestion({...newQuestion, correct_answer: opt})}
                          className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-all ${newQuestion.correct_answer === opt ? 'text-emerald-500 bg-emerald-50' : 'text-slate-300 hover:text-slate-400'}`}
                        >
                          <CheckCircle2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Marks</label>
                  <input 
                    type="number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-navy outline-none"
                    value={newQuestion.marks}
                    onChange={e => setNewQuestion({...newQuestion, marks: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Display Order</label>
                  <input 
                    type="number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-navy outline-none"
                    value={newQuestion.order_num}
                    onChange={e => setNewQuestion({...newQuestion, order_num: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-3 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all">Cancel</button>
                <button type="submit" className="px-10 py-3 bg-navy text-white rounded-xl text-xs font-bold transition-all shadow-lg hover:bg-black">Save Question</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
          >
            <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Bulk Import Questions</h3>
                <p className="text-slate-500 text-xs mt-1">Upload a CSV file to add multiple questions instantly.</p>
              </div>
              <button 
                onClick={downloadDemoSheet}
                className="flex items-center gap-2 text-navy hover:text-black transition-colors"
              >
                <Download size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Demo Sheet</span>
              </button>
            </div>
            <form onSubmit={handleBulkUpload} className="p-8 space-y-6">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl space-y-2">
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2">
                  <FileSpreadsheet size={14} /> CSV Format Requirements
                </p>
                <code className="text-[9px] text-blue-500 block leading-relaxed">
                  Question, Type, OptA, OptB, OptC, OptD, Correct, Marks
                </code>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block ml-1">Select CSV File</label>
                <input 
                  type="file" 
                  accept=".csv"
                  required
                  onChange={e => setBulkFile(e.target.files[0])}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm transition-all"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowBulkModal(false)} className="px-6 py-3 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all">Cancel</button>
                <button 
                  type="submit" 
                  disabled={isUploading}
                  className="px-8 py-3 bg-navy text-white rounded-xl text-xs font-bold shadow-lg hover:bg-black transition-all disabled:opacity-50"
                >
                  {isUploading ? 'Processing...' : 'Upload & Process'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
