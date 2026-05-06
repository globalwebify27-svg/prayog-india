"use client";

import { useState, useEffect } from "react";
import { BookOpen, FileText, Download, Lock, Search, Play, FileArchive } from "lucide-react";
import Link from "next/link";

export default function ResourcesPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [courseMaterials, setCourseMaterials] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/student/dashboard");
      const result = await res.json();
      if (result.success) {
        setEnrollments(result.data.enrollments);
        
        // Fetch materials for each course
        const materialsMap = {};
        for (const course of result.data.enrollments) {
          const mRes = await fetch(`/api/admin/courses/materials?id=${course.course_id}`);
          const mResult = await mRes.json();
          if (mResult.success) {
            materialsMap[course.course_id] = mResult.data;
          }
        }
        setCourseMaterials(materialsMap);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-20 text-center font-body text-slate-400">Syncing learning materials...</div>;
  }

  return (
    <div className="space-y-8 font-body max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Learning Resources</h1>
          <p className="text-slate-500 text-sm mt-1">Access study materials, assignments, and recorded archives.</p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search materials..." 
            className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none w-64 shadow-sm transition-all"
          />
        </div>
      </div>

      {enrollments.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 border border-slate-200 text-center shadow-sm">
          <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-lg font-bold text-slate-900 mb-2">No active resources</h2>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">You do not have any active course enrollments. Register for a course to unlock its study materials.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content: Module List */}
          <div className="lg:col-span-2 space-y-6">
            
            {enrollments.map((course) => (
              <div key={course.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-navy text-white flex items-center justify-center">
                      <BookOpen size={18} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">{course.title}</h2>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase mt-1 inline-block ${course.mode === 'online' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {course.mode} Mode
                      </span>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Learning Path
                  </div>
                </div>

                <div className="divide-y divide-slate-100">
                  {!courseMaterials[course.course_id] || courseMaterials[course.course_id].length === 0 ? (
                    <p className="p-10 text-center text-xs font-medium text-slate-400 italic">No materials uploaded by faculty yet.</p>
                  ) : courseMaterials[course.course_id].map((m) => (
                    <div key={m.id} className={`p-5 flex items-center justify-between group transition-colors ${m.is_locked ? 'bg-slate-50/50 opacity-60' : 'hover:bg-slate-50'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg transition-transform ${!m.is_locked && 'group-hover:scale-110'} ${
                          m.is_locked ? 'bg-slate-200 text-slate-500' :
                          m.type === 'video' ? 'bg-blue-50 text-blue-600' :
                          m.type === 'document' ? 'bg-emerald-50 text-emerald-600' :
                          'bg-amber-50 text-amber-600'
                        }`}>
                          {m.is_locked ? <Lock size={20} /> :
                           m.type === 'video' ? <Play size={20} /> :
                           m.type === 'document' ? <FileText size={20} /> : <BookOpen size={20} />}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{m.title}</h4>
                          <p className="text-xs font-semibold text-slate-500 mt-0.5">
                            {m.is_locked ? 'Unlocks after Week 4' : `${m.type.charAt(0).toUpperCase() + m.type.slice(1)} • Module ${m.module_number}`}
                          </p>
                        </div>
                      </div>
                      {!m.is_locked && (
                        <a 
                          href={m.content} 
                          target="_blank"
                          className="w-9 h-9 rounded-full bg-slate-100 text-navy flex items-center justify-center hover:bg-navy hover:text-white transition-all shadow-sm"
                        >
                          {m.type === 'video' ? <Play size={16} className="ml-0.5" /> : <Download size={16} />}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <div className="bg-navy rounded-2xl p-6 text-white shadow-md">
              <h3 className="text-base font-bold mb-2">Need help?</h3>
              <p className="text-xs text-white/70 leading-relaxed mb-5">
                If you are missing course materials or need access to archived sessions, please contact your faculty coordinator.
              </p>
              <button className="w-full py-2.5 bg-white text-navy rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-slate-100 transition-colors">
                Contact Support
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest text-[10px]">Recent Uploads</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                  <div>
                    <p className="text-sm font-bold text-slate-800">Updated Syllabus 2026</p>
                    <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Added 2 days ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-200 mt-1.5" />
                  <div>
                    <p className="text-sm font-bold text-slate-800">Exam Guidelines PDF</p>
                    <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Added last week</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
