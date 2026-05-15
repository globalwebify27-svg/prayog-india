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

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="h-[2px] w-8 bg-primary" />
              <span className="text-primary font-bold text-[10px] uppercase tracking-[0.3em]">
                {course.level} Level
              </span>
              {course.specializations && course.specializations.length > 0 && (
                <>
                  <div className="w-1 h-1 rounded-full bg-white/20" />
                  <div className="flex flex-wrap gap-2">
                    {course.specializations.map((spec, idx) => (
                      <span key={idx} className="px-2 py-1 bg-white/10 text-white/60 text-[9px] font-bold uppercase tracking-wider rounded border border-white/5">
                        {spec.name}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
              {course.title}
            </h1>

            <p className="text-white/50 text-sm md:text-base mb-8 max-w-xl leading-relaxed font-medium line-clamp-2">
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
              </div>

              {/* Learning Path Accordion */}
              <div className="mb-16">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 border-b border-navy/5 pb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-1 w-12 bg-primary rounded-full" />
                      <span className="text-[10px] font-bold text-primary uppercase tracking-[0.4em]">Curriculum</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">Learning <span className="text-primary italic">Path</span></h2>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-navy text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-navy/20">
                      {(materials.length > 0 ? materials.length : (course.modules ? (typeof course.modules === 'string' ? JSON.parse(course.modules) : course.modules).length : 0))} Modules
                    </div>
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
                          <div className="flex items-center gap-6">
                            <div className="flex flex-col items-center">
                              <span className="text-[9px] font-bold text-primary uppercase tracking-tighter leading-none mb-1">Module</span>
                              <span className="text-2xl font-bold text-navy leading-none">
                                {String(m.module_number || i + 1).padStart(2, '0')}
                              </span>
                            </div>
                            <div className="h-10 w-[1px] bg-navy/5 hidden md:block" />
                            <div>
                              <h4 className="font-bold text-navy text-base md:text-lg tracking-tight leading-tight group-hover:text-primary transition-colors">{m.title}</h4>
                              {m.type && <p className="text-[9px] text-navy/30 font-bold uppercase tracking-[0.2em] mt-1">{m.type}</p>}
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
                                      <div className="bg-navy/[0.03] p-6 rounded-2xl border border-navy/5 space-y-6">
                                        {m.content.split('^').map((section, sIdx) => {
                                          const trimmedSection = section.trim();
                                          if (!trimmedSection) return null;

                                          // Detect list structure (using '4' as bullet or standard patterns)
                                          const hasList = trimmedSection.includes('4 ') || trimmedSection.includes(':');
                                          
                                          if (hasList) {
                                            const [header, ...listParts] = trimmedSection.split(':');
                                            const items = listParts.join(':').split('4').map(item => item.trim()).filter(Boolean);

                                            return (
                                              <div key={sIdx} className="space-y-4">
                                                {header && (
                                                  <h5 className="text-xs font-bold text-navy uppercase tracking-widest flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                    {header.trim()}
                                                  </h5>
                                                )}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                                                  {items.map((item, iIdx) => (
                                                    <div key={iIdx} className="flex items-start gap-2 group">
                                                      <ChevronRight size={12} className="text-primary mt-0.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                                                      <span className="text-sm text-navy/70 font-medium leading-tight">{item}</span>
                                                    </div>
                                                  ))}
                                                </div>
                                              </div>
                                            );
                                          }

                                          return (
                                            <p key={sIdx} className="text-sm text-navy/80 leading-relaxed font-medium">
                                              {trimmedSection}
                                            </p>
                                          );
                                        })}
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

              <div className="mb-16">
                <div className="grid md:grid-cols-2 gap-12">
                  {/* Methodology */}
                  {course.methodology && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Zap size={18} className="text-primary" />
                        <h4 className="text-sm font-bold text-navy uppercase tracking-widest">Workshop Methodology</h4>
                      </div>
                      <p className="text-sm text-navy/60 leading-relaxed italic">
                        {course.methodology}
                      </p>
                    </div>
                  )}

                  {/* Who Can Join */}
                  {course.who_can_join && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Cpu size={18} className="text-primary" />
                        <h4 className="text-sm font-bold text-navy uppercase tracking-widest">Who Can Join?</h4>
                      </div>
                      <p className="text-sm text-navy/60 leading-relaxed">
                        {course.who_can_join}
                      </p>
                    </div>
                  )}
                </div>

                {/* Outcomes */}
                {course.outcomes && (
                  <div className="mt-12 space-y-6">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={18} className="text-primary" />
                      <h4 className="text-sm font-bold text-navy uppercase tracking-widest">Learning Outcomes</h4>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {((course.outcomes || "").includes('^') ? course.outcomes.split('^') : (course.outcomes || "").split('\n')).filter(Boolean).map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-navy/5 shadow-sm hover:shadow-md transition-all">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <CheckCircle2 size={12} className="text-primary" />
                          </div>
                          <span className="text-[10px] font-bold text-navy uppercase tracking-wide leading-tight">{item.trim()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certification */}
                {course.certification && (
                  <div className="mt-12 p-8 bg-navy rounded-3xl text-white relative overflow-hidden border border-white/5">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                      <Award size={120} />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <Award size={20} className="text-primary" />
                        <h4 className="text-sm font-bold uppercase tracking-[0.2em]">Institutional Certification</h4>
                      </div>
                      <p className="text-white/60 text-sm leading-relaxed max-w-xl mb-6">
                        {course.certification}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        Industry Recognized Credentials
                      </div>
                    </div>
                  </div>
                )}
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
                        <span className="text-primary font-bold">{course.duration && course.duration !== "0" ? course.duration : "Self-Paced"}</span>
                      </div>
                      {!!course.allow_partial_payment && (
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
