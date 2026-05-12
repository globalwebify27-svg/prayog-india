"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Book, 
  Clock, 
  Award, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  PlayCircle,
  ArrowRight,
  ChevronRight,
  ArrowLeft
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function CourseDetailPage() {
  const params = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/courses")
      .then(res => res.json())
      .then(data => {
        const found = data.find(c => c.id == params.id);
        setCourse(found);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) return <div className="min-h-screen bg-navy flex items-center justify-center text-white">Loading program details...</div>;
  if (!course) return <div className="min-h-screen bg-navy flex items-center justify-center text-white">Program not found.</div>;

  return (
    <main className="min-h-screen bg-white font-body">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-24 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Link href="/courses" className="inline-flex items-center space-x-2 text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider mb-8">
            <ArrowLeft size={14} />
            <span>Back to programs</span>
          </Link>
          
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            <div className="flex items-center space-x-4 mb-6">
              <span className="px-3 py-1 bg-white/10 rounded-lg text-primary text-[10px] font-bold uppercase border border-white/5 tracking-wider">
                {course.level} Specialization
              </span>
              <span className="text-white/20">|</span>
              <span className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Verified Institutional Certificate</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-semibold text-white mb-6 leading-tight tracking-tight">
              {course.title}
            </h1>
            <p className="text-blue-100/60 text-lg md:text-xl mb-12 max-w-2xl leading-relaxed">
              {course.tagline || course.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {course.modules ? (
                <Link href={`/register?course=${course.id}&lock=true`} className="bg-primary text-navy px-10 py-4 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all text-center">
                  Enroll in program
                </Link>
              ) : (
                <div className="bg-white/10 text-white/40 px-10 py-4 rounded-xl font-bold text-sm border border-white/5 cursor-not-allowed text-center">
                  Enrollment Pending
                </div>
              )}
              <button className="flex items-center justify-center space-x-3 bg-white/5 text-white px-10 py-4 rounded-xl border border-white/10 font-bold text-sm hover:bg-white/10 transition-all">
                <PlayCircle size={18} />
                <span>Path walkthrough</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16">
            
            {/* Curriculum Area */}
            <div className="lg:col-span-8 min-h-[500px]">
              <div className="relative h-64 rounded-[2.5rem] overflow-hidden mb-12 group shadow-2xl border border-slate-200">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/80 to-transparent flex items-center px-8 md:px-12">
                  <div className="max-w-md">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-primary/20 backdrop-blur-md rounded-lg border border-primary/20">
                        <Book size={20} className="text-primary" />
                      </div>
                      <span className="text-primary font-bold text-[10px] uppercase tracking-[0.3em]">Institutional</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">Learning <span className="text-primary">Path</span></h2>
                    <p className="text-blue-100/60 text-xs md:text-sm font-medium mt-3 leading-relaxed">
                      A structured industrial specialization roadmap designed by industry experts to bridge the gap between theory and practical mastery.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Use course.modules from DB if available, else fallback */}
                {(course.modules ? (typeof course.modules === 'string' ? JSON.parse(course.modules) : course.modules) : []).length > 0 ? (
                  (typeof course.modules === 'string' ? JSON.parse(course.modules) : course.modules).map((mod, i) => (
                    <div key={i} className="bg-slate-50 p-6 rounded-2xl flex items-center justify-between group hover:bg-navy hover:text-white transition-all cursor-pointer border border-slate-100">
                      <div className="flex items-center space-x-6">
                        <span className="text-navy font-bold text-[11px] uppercase group-hover:text-primary transition-colors">Module {String(i + 1).padStart(2, '0')}</span>
                        <h4 className="font-semibold text-slate-900 group-hover:text-white transition-colors">{mod}</h4>
                      </div>
                      <ChevronRight size={18} className="text-slate-300 group-hover:text-white transition-all" />
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Learning Path is being finalized by the academic team.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Details */}
            <div className="lg:col-span-4">
              <div className="sticky top-32 space-y-8">
                {/* Program Analytics Card */}
                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-8 border-b border-slate-100 pb-4">Program Analytics</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">Duration</span>
                      <span className="font-semibold text-navy">{course.duration || '6 Months'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">Tuition Fee</span>
                      <span className="font-semibold text-navy">₹{Number(course.price).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">Certification</span>
                      <span className="font-bold text-emerald-600">Global Standard</span>
                    </div>
                  </div>
                  
                  <div className="mt-12 pt-8 border-t border-slate-100">
                    <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest mb-6">Learning Outcomes</h4>
                    <div className="space-y-4">
                      {(course.outcomes || ["Industrial Certification", "Job Placement Support", "Hands-on Lab Access"]).map((out, i) => (
                        <div key={i} className="flex items-start space-x-3 text-slate-600 text-sm font-medium">
                          <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span className="leading-tight">{out}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {course.modules ? (
                    <Link href={`/register?course=${course.id}&lock=true`} className="mt-10 w-full flex items-center justify-center space-x-2 bg-navy text-white py-3.5 rounded-xl font-bold text-sm hover:bg-black transition-all shadow-lg shadow-navy/10">
                      <span>Start enrollment</span>
                      <ArrowRight size={18} />
                    </Link>
                  ) : (
                    <div className="mt-10 w-full flex items-center justify-center space-x-2 bg-slate-100 text-slate-400 py-3.5 rounded-xl font-bold text-sm cursor-not-allowed border border-slate-200">
                      <span>Path Pending</span>
                    </div>
                  )}
                </div>

                {/* Cohort Enrollment Card */}
                <div className="bg-primary rounded-2xl p-8 text-navy relative overflow-hidden shadow-lg border border-primary/20">
                  <Zap className="absolute top-4 right-4 text-navy opacity-10" size={50} />
                  <h4 className="text-base font-bold mb-2">Cohort Enrollment</h4>
                  <p className="text-navy/70 text-xs font-medium leading-relaxed mb-6">
                    The upcoming cohort for this specialization begins soon. Limited seats available for hands-on lab sessions.
                  </p>
                  <div className="flex items-center space-x-2 text-[10px] font-bold uppercase border-t border-navy/10 pt-4">
                    <Clock size={14} />
                    <span>Next Batch: 01 May 2026</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
