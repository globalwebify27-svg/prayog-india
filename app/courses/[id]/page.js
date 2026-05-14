"use client";

import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  ArrowLeft,
  Cpu,
  FileText
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function CourseDetailPage() {
  const params = useParams();
  const [course, setCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [courseRes, materialsRes] = await Promise.all([
          fetch("/api/courses"),
          fetch(`/api/courses/materials?id=${params.id}`)
        ]);

        const courses = await courseRes.json();
        const materialsData = await materialsRes.json();

        const found = courses.find(c => c.id == params.id);
        setCourse(found);
        setMaterials(Array.isArray(materialsData) ? materialsData : []);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params.id]);

  if (loading) return (
    <div className="min-h-screen bg-navy flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
        <Zap size={40} className="text-primary" />
      </motion.div>
    </div>
  );
  if (!course) return <div className="min-h-screen bg-navy flex items-center justify-center text-white">Program not found.</div>;

  return (
    <main className="min-h-screen bg-slate-50 font-body selection:bg-primary selection:text-navy">
      <Header />

      {/* Compact Focused Hero */}
      <section className="pt-28 pb-12 bg-navy relative overflow-hidden flex items-center">
        {/* Background Layer */}
        <div className="absolute inset-0">
          <img
            src={course.image}
            className="w-full h-full object-cover opacity-20"
            alt={course.title}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/95 to-navy/70" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <Link href="/courses" className="inline-flex items-center space-x-2 text-primary/60 hover:text-primary transition-all text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
              <ArrowLeft size={14} />
              <span>Back to Programs</span>
            </Link>

            <div className="flex items-center space-x-3 mb-4">
              <div className="h-[2px] w-8 bg-primary" />
              <span className="text-primary font-bold text-[10px] uppercase tracking-[0.3em]">
                {course.level} Level Specialization
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
              {course.title}
            </h1>

            <p className="text-white/50 text-sm md:text-base mb-8 max-w-xl leading-relaxed font-medium">
              {course.tagline || course.description}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href={`/register?course=${course.id}&lock=true`} className="bg-primary text-navy px-8 py-3.5 rounded-xl font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-primary/10">
                Enroll Now
              </Link>
               {course.brochure && (
                <a 
                  href={course.brochure} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-white/5 text-white px-8 py-3.5 rounded-xl border border-white/10 font-bold text-sm hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  <FileText size={18} className="text-primary" />
                  View Brochure
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16">

            {/* Left: Curriculum & Details */}
            <div className="lg:col-span-8">
              <div className="mb-16">
                <h2 className="text-2xl font-bold text-navy mb-6 tracking-tight">Program Overview</h2>
                <p className="text-navy/70 text-base leading-relaxed mb-8">
                  {course.description}
                </p>
                {course.outcomes && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {(Array.isArray(course.outcomes) ? course.outcomes : JSON.parse(course.outcomes || "[]")).map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-navy/5">
                        <CheckCircle2 size={16} className="text-primary" />
                        <span className="text-xs font-bold text-navy uppercase tracking-wide">{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Learning Path Accordion */}
              <div className="mb-16">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-navy tracking-tight">Learning <span className="text-primary">Path</span></h2>
                  <div className="px-3 py-1 bg-navy/5 rounded-lg text-[10px] font-bold uppercase tracking-widest text-navy">
                    {(materials.length > 0 ? materials.length : (course.modules ? (typeof course.modules === 'string' ? JSON.parse(course.modules) : course.modules).length : 0))} Modules
                  </div>
                </div>

                <div className="space-y-3">
                  {materials.length > 0 ? (
                    materials.map((m, i) => (
                      <div key={`mat-${i}`} className={`rounded-xl border overflow-hidden transition-all ${activeStep === `mat-${i}` ? 'border-primary/30 shadow-sm' : 'border-navy/5'} bg-white`}>
                        <button
                          onClick={() => setActiveStep(activeStep === `mat-${i}` ? null : `mat-${i}`)}
                          className="w-full p-5 flex items-center justify-between text-left"
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-[10px] font-bold text-primary bg-navy px-2 py-1 rounded min-w-[36px] text-center">
                              {String(m.module_number || i + 1).padStart(2, '0')}
                            </span>
                            <div>
                              <h4 className="font-bold text-navy text-sm">{m.title}</h4>
                              {m.type && <p className="text-[10px] text-navy/40 font-bold uppercase tracking-widest mt-0.5">{m.type}</p>}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            {m.is_locked ? (
                              <span className="text-[9px] font-bold text-navy/30 uppercase tracking-widest border border-navy/10 px-2 py-1 rounded">Locked</span>
                            ) : (
                              <span className="text-[9px] font-bold text-primary uppercase tracking-widest border border-primary/20 px-2 py-1 rounded">Open</span>
                            )}
                            <ChevronRight size={16} className={`text-slate-300 transition-transform ${activeStep === `mat-${i}` ? 'rotate-90 text-primary' : ''}`} />
                          </div>
                        </button>
                        <AnimatePresence>
                          {activeStep === `mat-${i}` && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                              <div className="px-6 pb-5 pt-2 border-t border-navy/5">
                                {m.is_locked ? (
                                  <div className="flex items-center gap-3 p-4 bg-navy/5 rounded-lg">
                                    <ShieldCheck size={16} className="text-navy/30 shrink-0" />
                                    <p className="text-xs text-navy/50 font-medium">
                                      This module is restricted. Enroll in the program to unlock full access.
                                    </p>
                                  </div>
                                ) : m.content ? (
                                  (() => {
                                    const isLink = m.content.startsWith('http') || m.content.startsWith('/uploads') || m.content.startsWith('/');
                                    if (isLink) {
                                      const fileName = m.content.split('/').pop();
                                      return (
                                        <div className="flex items-center justify-between gap-4 p-4 bg-navy/[0.03] rounded-lg border border-navy/5">
                                          <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-8 h-8 bg-navy/10 rounded-lg flex items-center justify-center shrink-0">
                                              <ArrowRight size={14} className="text-navy/40" />
                                            </div>
                                            <p className="text-xs font-bold text-navy truncate">{fileName}</p>
                                          </div>
                                          <a href={m.content} target="_blank" rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 bg-primary text-navy px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:brightness-110 transition-all shrink-0">
                                            <ArrowRight size={12} /> View
                                          </a>
                                        </div>
                                      );
                                    }
                                    return (
                                      <div className="text-sm text-navy/70 leading-relaxed whitespace-pre-wrap bg-navy/[0.03] p-4 rounded-lg border border-navy/5">
                                        {m.content}
                                      </div>
                                    );
                                  })()
                                ) : (
                                  <p className="text-xs text-navy/40 italic">No content added yet for this module.</p>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))
                  ) : (
                    (course.modules ? (typeof course.modules === 'string' ? JSON.parse(course.modules) : course.modules) : []).map((mod, i) => (
                      <div key={`mod-${i}`} className="bg-white rounded-xl border border-navy/5 overflow-hidden">
                        <button
                          onClick={() => setActiveStep(activeStep === `mod-${i}` ? null : `mod-${i}`)}
                          className="w-full p-5 flex items-center justify-between text-left"
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-[10px] font-bold text-primary bg-navy px-2 py-1 rounded">M{String(i + 1).padStart(2, '0')}</span>
                            <h4 className="font-bold text-navy text-sm">{mod}</h4>
                          </div>
                          <ChevronRight size={18} className={`text-slate-300 transition-transform ${activeStep === `mod-${i}` ? 'rotate-90 text-primary' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {activeStep === `mod-${i}` && (
                            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                              <div className="px-14 pb-5 text-xs text-navy/40 font-medium leading-relaxed italic">
                                Curriculum module details are available for registered students.
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right: Action Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-32 space-y-6">
                <div className="bg-navy rounded-3xl p-8 text-white border border-white/5 shadow-2xl">
                  <h4 className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-6">Investment Summary</h4>
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-baseline">
                      <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Program Fee</span>
                      <span className="text-3xl font-bold text-primary">₹{Number(course.price).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="pt-4 border-t border-white/5 space-y-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/60 font-medium italic">Duration</span>
                        <span className="text-primary font-bold">{course.duration || "Self-Paced"}</span>
                      </div>
                      {course.allow_partial_payment && (
                        <div className="flex justify-between text-xs">
                          <span className="text-white/60 font-medium italic">Installments</span>
                          <span className="text-primary font-bold">Available</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Link href={`/register?course=${course.id}&lock=true`} className="w-full block bg-primary text-navy text-center py-4 rounded-xl font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-primary/20">
                    Secure My Seat
                  </Link>

                  {course.brochure && (
                    <a 
                      href={course.brochure} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full mt-3 flex items-center justify-center gap-2 border border-white/20 text-white/80 py-4 rounded-xl font-bold text-xs hover:bg-white/5 transition-all"
                    >
                      <FileText size={16} className="text-primary" />
                      Download Brochure
                    </a>
                  )}
                </div>

                <div className="bg-white rounded-3xl p-6 border border-navy/5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-navy rounded-lg flex items-center justify-center text-primary">
                      <ShieldCheck size={18} />
                    </div>
                    <h5 className="text-sm font-bold text-navy uppercase tracking-widest">Verified Program</h5>
                  </div>
                  <p className="text-[10px] text-navy/50 font-medium leading-relaxed">
                    This specialization is officially listed in the Prayog India institutional catalog for the current academic session.
                  </p>
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
