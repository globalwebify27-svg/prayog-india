"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  FileText,
  Award,
  ShieldCheck,
  Timer,
  ChevronLeft,
  Upload,
  LayoutGrid,
  Trophy,
  History,
  Lock
} from "lucide-react";

export default function ExamsPage() {
  const [activeView, setActiveView] = useState("exams"); // "exams" or "results"
  const [availableExams, setAvailableExams] = useState([]);
  const [results, setResults] = useState([]);
  const [activeExam, setActiveExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { question_id: { text: "", file_url: "" } }
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(null);

  useEffect(() => {
    if (activeView === "exams") fetchAvailableExams();
    if (activeView === "results") fetchResults();
  }, [activeView]);

  useEffect(() => {
    if (activeExam) {
      fetchQuestions();
      setTimeLeft(activeExam.duration * 60);
    }
  }, [activeExam]);

  useEffect(() => {
    if (activeExam && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && activeExam) {
      handleSubmitExam();
    }
  }, [timeLeft, activeExam]);

  const fetchAvailableExams = async () => {
    try {
      const res = await fetch("/api/student/exams");
      const data = await res.json();
      if (data.success) {
        setAvailableExams(data.exams);
      }
    } catch (e) {
      console.error("Failed to fetch exams:", e);
    }
  };

  const fetchResults = async () => {
    try {
      const res = await fetch("/api/student/exams/results");
      const data = await res.json();
      if (data.success) {
        setResults(data.results);
      }
    } catch (e) {
      console.error("Failed to fetch results:", e);
    }
  };

  const fetchQuestions = async () => {
    try {
      const res = await fetch(`/api/admin/exams/questions?exam_id=${activeExam.id}`);
      const data = await res.json();
      if (data.success) {
        setQuestions(data.data);
      }
    } catch (e) {
      console.error("Failed to fetch questions:", e);
    }
  };

  const handleFileUpload = async (questionId, file) => {
    if (!file) return;
    setUploadingFile(questionId);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setAnswers(prev => ({
          ...prev,
          [questionId]: { ...prev[questionId], file_url: data.url }
        }));
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (e) {
      alert("Upload failed");
    } finally {
      setUploadingFile(null);
    }
  };

  const handleSubmitExam = async () => {
    if (isSubmitting) return;
    if (!confirm("Are you sure you want to finish and submit the exam?")) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/student/exams/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exam_id: activeExam.id,
          answers: answers
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("Exam submitted successfully!");
        setActiveExam(null);
        setQuestions([]);
        setAnswers({});
        setCurrentQuestionIndex(0);
        fetchAvailableExams();
      } else {
        alert(data.message || "Submission failed");
      }
    } catch (e) {
      alert("Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-body pb-10">
      <AnimatePresence mode="wait">
        {!activeExam ? (
          <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Academic Portal</h1>
                <p className="text-slate-500 text-sm mt-1">Assessments and performance history.</p>
              </div>
              <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200">
                <button 
                  onClick={() => setActiveView("exams")}
                  className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeView === 'exams' ? 'bg-white text-navy shadow-sm border border-slate-200' : 'text-slate-500 hover:text-navy'}`}
                >
                  <History size={14} /> Exams
                </button>
                <button 
                  onClick={() => setActiveView("results")}
                  className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeView === 'results' ? 'bg-white text-navy shadow-sm border border-slate-200' : 'text-slate-500 hover:text-navy'}`}
                >
                  <Trophy size={14} /> Results
                </button>
              </div>
            </div>

            {activeView === "exams" ? (
              <div className="space-y-4">
                {availableExams.length === 0 ? (
                  <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center mx-auto mb-4">
                      <Zap size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">No Exams Scheduled</h3>
                    <p className="text-slate-400 italic text-sm mt-1">Check back later for upcoming assessments.</p>
                  </div>
                ) : (
                  availableExams.map((exam) => (
                    <div key={exam.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                      {exam.has_submitted > 0 && (
                        <div className="absolute top-0 right-0 bg-emerald-500 text-white px-4 py-1 text-[9px] font-bold uppercase tracking-widest rounded-bl-xl shadow-sm flex items-center gap-1.5">
                          <CheckCircle2 size={10} /> Submitted
                        </div>
                      )}
                      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center space-x-5 w-full md:w-auto">
                          <div className="w-12 h-12 rounded-xl bg-slate-50 text-navy flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-navy group-hover:text-white transition-all shadow-sm">
                            <FileText size={20} />
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-primary uppercase tracking-wider mb-0.5 block">{exam.course_title}</span>
                            <h3 className="text-base font-bold text-slate-900 leading-tight">{exam.title}</h3>
                            <div className="flex flex-wrap items-center gap-4 mt-2 text-[10px] font-semibold text-slate-400 uppercase">
                              <span className="flex items-center gap-1.5"><Clock size={12} /> {exam.duration} Mins</span>
                              <span className={`flex items-center gap-1.5 ${exam.type === 'subjective' ? 'text-purple-500' : 'text-blue-500'}`}><Zap size={12} /> {exam.type}</span>
                            </div>
                          </div>
                        </div>
                        <button 
                          disabled={exam.has_submitted > 0}
                          onClick={() => setActiveExam(exam)}
                          className={`w-full md:w-auto px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 ${
                            exam.has_submitted > 0 
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200" 
                            : "bg-navy text-white hover:bg-black"
                          }`}
                        >
                          {exam.has_submitted > 0 ? "Completed" : "Start exam"}
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {results.length === 0 ? (
                  <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center mx-auto mb-4">
                      <Trophy size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">No Results Found</h3>
                    <p className="text-slate-400 italic text-sm mt-1">Your graded assessments will appear here.</p>
                  </div>
                ) : (
                  results.map((result) => (
                    <div key={result.id} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 font-black text-xl shadow-inner">
                            {Math.round((result.score / result.exam_total_marks) * 100)}%
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1 block">Assessment Complete</span>
                            <h3 className="text-lg font-bold text-slate-900 leading-tight">{result.exam_title}</h3>
                            <p className="text-xs text-slate-400 mt-1 font-medium">{result.course_title}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-8 text-right">
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score</p>
                            <p className="text-xl font-black text-navy">{result.score} <span className="text-slate-300 font-medium">/ {result.exam_total_marks}</span></p>
                          </div>
                          <div className="h-10 w-px bg-slate-100" />
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</p>
                            <p className="text-sm font-bold text-slate-700">{new Date(result.submitted_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
            
            <div className="mt-12 p-6 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-4">
              <ShieldCheck className="text-navy shrink-0" size={20} />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">Academic Integrity Policy</h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
                  Assessment results are finalized by the administrative board. If you have queries regarding your grading, contact your course instructor through the official support channel.
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="exam" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
            {/* Exam Interface Header */}
            <div className="bg-navy rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                <div>
                  <h2 className="text-xl font-bold mb-1">{activeExam.title}</h2>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{activeExam.course_title} • Session 2026</p>
                </div>
                <div className="bg-white/10 px-5 py-2.5 rounded-xl border border-white/10 backdrop-blur-md flex items-center gap-3">
                  <Timer size={20} className="text-primary" />
                  <div className="text-right">
                    <span className="block text-[9px] font-bold uppercase text-white/50 tracking-tighter">Remaining</span>
                    <span className="block text-lg font-bold text-white tabular-nums">{formatTime(timeLeft)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Question Card (Left) */}
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200 shadow-sm min-h-[400px] flex flex-col relative overflow-hidden">
                  {questions.length === 0 ? (
                    <div className="flex-grow flex items-center justify-center">
                      <p className="text-slate-400 italic">Loading questions...</p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-10">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3 block">
                          Question {currentQuestionIndex + 1} of {questions.length}
                        </span>
                        <h3 className="text-xl font-bold text-slate-900 leading-tight md:text-2xl">
                          {currentQuestion?.question_text}
                        </h3>
                      </div>

                      <div className="space-y-6 flex-grow">
                        {currentQuestion?.type === 'objective' ? (
                          <div className="space-y-3">
                            {JSON.parse(currentQuestion.options || "[]").map((opt, i) => (
                              <button 
                                key={i} 
                                onClick={() => setAnswers({...answers, [currentQuestion.id]: { text: opt }})}
                                className={`w-full text-left p-5 rounded-xl border transition-all group flex items-center justify-between shadow-sm ${
                                  answers[currentQuestion.id]?.text === opt 
                                    ? "border-navy bg-navy/5 text-navy shadow-md" 
                                    : "border-slate-100 bg-slate-50 hover:border-navy hover:bg-white"
                                }`}
                              >
                                <span className="text-sm font-semibold">{opt}</span>
                                <div className={`w-5 h-5 rounded-full border-2 transition-all ${
                                  answers[currentQuestion.id]?.text === opt ? "border-navy bg-navy ring-4 ring-navy/10" : "border-slate-300 group-hover:border-navy"
                                }`} />
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block ml-1">Type your response</label>
                              <textarea 
                                rows={8}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:border-navy outline-none transition-all resize-none shadow-inner"
                                placeholder="Type your answer here..."
                                value={answers[currentQuestion.id]?.text || ""}
                                onChange={(e) => setAnswers({...answers, [currentQuestion.id]: { ...answers[currentQuestion.id], text: e.target.value }})}
                              />
                            </div>
                            
                            <div className="relative">
                              <div className="flex items-center justify-between p-6 bg-slate-50 border border-dashed border-slate-200 rounded-2xl hover:bg-slate-100/50 transition-all group">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm group-hover:scale-105 transition-transform">
                                    {answers[currentQuestion.id]?.file_url ? <CheckCircle2 className="text-emerald-500" /> : <Upload size={20} />}
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-slate-900">Upload Answer Sheet</p>
                                    <p className="text-[10px] text-slate-500 mt-0.5">Attach Image or PDF (Max 5MB)</p>
                                  </div>
                                </div>
                                <label className="cursor-pointer bg-navy text-white px-5 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all shadow-md">
                                  {uploadingFile === currentQuestion.id ? "Uploading..." : answers[currentQuestion.id]?.file_url ? "Replace File" : "Choose File"}
                                  <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*,.pdf"
                                    onChange={(e) => handleFileUpload(currentQuestion.id, e.target.files[0])}
                                    disabled={uploadingFile === currentQuestion.id}
                                  />
                                </label>
                              </div>
                              {answers[currentQuestion.id]?.file_url && (
                                <div className="flex items-center gap-2 mt-3 px-2">
                                  <CheckCircle2 size={12} className="text-emerald-500" />
                                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Document attached successfully</span>
                                  <a href={answers[currentQuestion.id].file_url} target="_blank" className="text-[10px] font-bold text-navy underline ml-auto">View Upload</a>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-center mt-12 pt-8 border-t border-slate-100 gap-6">
                        <button onClick={() => setActiveExam(null)} className="text-slate-400 font-bold text-xs uppercase hover:text-rose-600 transition-colors flex items-center gap-2 group">
                          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                          <span>Quit assessment</span>
                        </button>
                        <div className="flex gap-3 w-full sm:w-auto">
                          <button 
                            disabled={currentQuestionIndex === 0}
                            onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                            className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg border border-slate-200 text-slate-500 font-bold text-xs uppercase disabled:opacity-30 transition-all hover:bg-slate-50"
                          >
                            Previous
                          </button>
                          
                          {currentQuestionIndex === questions.length - 1 ? (
                            <button 
                              onClick={handleSubmitExam}
                              disabled={isSubmitting}
                              className="flex-1 sm:flex-none bg-emerald-600 text-white px-10 py-2.5 rounded-lg font-bold text-xs uppercase shadow-lg hover:bg-emerald-700 transition-all disabled:opacity-50"
                            >
                              {isSubmitting ? "Submitting..." : "Finish Exam"}
                            </button>
                          ) : (
                            <button 
                              onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                              className="flex-1 sm:flex-none bg-navy text-white px-10 py-2.5 rounded-lg font-bold text-xs uppercase shadow-lg hover:bg-black transition-all"
                            >
                              Next question
                            </button>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Navigation Grid (Right Sidebar) */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden sticky top-6">
                  <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                    <LayoutGrid size={18} className="text-navy" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Question Palette</h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-5 gap-2.5">
                      {questions.map((q, idx) => {
                        const isAnswered = answers[q.id]?.text || answers[q.id]?.file_url;
                        const isCurrent = currentQuestionIndex === idx;
                        
                        return (
                          <button 
                            key={q.id}
                            onClick={() => setCurrentQuestionIndex(idx)}
                            className={`h-10 rounded-xl font-bold text-xs transition-all flex items-center justify-center border-2 ${
                              isCurrent 
                                ? "bg-navy text-white border-navy ring-4 ring-navy/10" 
                                : isAnswered 
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100" 
                                  : "bg-slate-50 text-slate-400 border-slate-100 hover:bg-white hover:border-navy/20"
                            }`}
                          >
                            {idx + 1}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-100 space-y-4">
                      <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <div className="w-3 h-3 rounded-md bg-navy" />
                        <span>Current</span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <div className="w-3 h-3 rounded-md bg-emerald-500" />
                        <span>Answered</span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <div className="w-3 h-3 rounded-md bg-slate-100 border border-slate-200" />
                        <span>Unanswered</span>
                      </div>
                    </div>

                    <div className="mt-8">
                      <button 
                        onClick={handleSubmitExam}
                        disabled={isSubmitting}
                        className="w-full bg-rose-50 text-rose-600 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-sm border border-rose-100"
                      >
                        {isSubmitting ? "Processing..." : "Finish Attempt"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-3xl p-6 text-white overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl" />
                  <div className="relative z-10 space-y-3">
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Summary</p>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-2xl font-bold">{Object.keys(answers).length}</p>
                        <p className="text-[10px] font-medium text-white/60 uppercase">Attempted</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{questions.length - Object.keys(answers).length}</p>
                        <p className="text-[10px] font-medium text-white/60 uppercase">Pending</p>
                      </div>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(Object.keys(answers).length / (questions.length || 1)) * 100}%` }}
                        className="h-full bg-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
