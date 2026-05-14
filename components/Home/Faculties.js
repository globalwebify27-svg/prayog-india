"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Award, BookOpen, Cpu, ExternalLink, Globe } from "lucide-react";

export default function Faculties() {
  const [facultyList, setFacultyList] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFaculties() {
      try {
        const res = await fetch("/api/faculties");
        const data = await res.json();
        setFacultyList(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch faculties:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFaculties();
  }, []);

  return (
    <section className="py-20 md:py-32 bg-white relative overflow-hidden">
      {/* Decorative background accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-50 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-20">
          <motion.h4 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-navy font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs mb-4"
          >
            Institutional Leadership
          </motion.h4>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-6xl font-heading font-black text-slate-900 leading-tight"
          >
            Meet Our <span className="text-navy">Expert Faculty</span>
          </motion.h2>
          <div className="w-16 h-1 bg-primary mx-auto mt-6 rounded-full" />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-slate-100 border-t-navy rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
            {facultyList.map((f, i) => (
              <motion.div
                key={f.id || i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -15 }}
                onClick={() => setSelectedFaculty(f)}
                className="group relative cursor-pointer"
              >
                <div className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-primary/10">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#FFC107 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                  
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img 
                      src={f.image || "/assets/placeholder-faculty.png"} 
                      alt={f.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" 
                    />
                    <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-2 translate-y-20 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-md flex items-center justify-center text-navy shadow-xl">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                      </div>
                      <div className="w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-md flex items-center justify-center text-navy shadow-xl">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 md:p-8 text-center bg-white border-t border-slate-50">
                    <h3 className="text-sm md:text-xl font-heading font-black text-slate-900 mb-1 group-hover:text-navy transition-colors">
                      {f.name}
                    </h3>
                    <p className="text-[10px] md:text-sm text-primary font-bold uppercase tracking-widest mb-3">
                      {f.role}
                    </p>
                    <div className="hidden md:block w-8 h-0.5 bg-slate-100 mx-auto mb-4 group-hover:w-16 group-hover:bg-primary transition-all duration-500" />
                    <p className="hidden md:block text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                      {f.specialty}
                    </p>
                  </div>
                </div>

                <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary flex items-center justify-center rounded-2xl rotate-12 -z-10 group-hover:rotate-0 transition-transform duration-500 shadow-xl opacity-0 lg:opacity-100">
                  <ExternalLink size={20} className="text-navy" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedFaculty && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFaculty(null)}
              className="absolute inset-0 bg-navy/80 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedFaculty(null)}
                className="absolute top-6 right-6 z-10 p-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-500 rounded-full transition-all"
              >
                <X size={20} />
              </button>

              {/* Left Side: Image & Socials */}
              <div className="w-full md:w-[35%] bg-slate-50 relative">
                <img 
                  src={selectedFaculty.image || "/assets/placeholder-faculty.png"} 
                  alt={selectedFaculty.name} 
                  className="w-full h-full object-cover md:absolute inset-0"
                />
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-navy/90 to-transparent">
                  <div className="flex gap-4">
                    <button className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-xl text-white transition-all">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                    </button>
                    <button className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-xl text-white transition-all">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                    </button>
                    <button className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-xl text-white transition-all">
                      <Globe size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side: Details */}
              <div className="w-full md:w-[65%] p-8 md:p-10 overflow-y-auto custom-scrollbar">
                <div className="mb-8">
                  <p className="text-primary font-bold uppercase tracking-widest text-xs mb-2">{selectedFaculty.role}</p>
                  <h2 className="text-2xl md:text-4xl font-heading font-black text-navy mb-2">{selectedFaculty.name}</h2>
                  <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-tight bg-slate-100 w-fit px-4 py-1.5 rounded-full">
                    <Cpu size={14} className="text-primary" />
                    {selectedFaculty.specialty}
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                      <BookOpen size={14} className="text-primary" />
                      About Profile
                    </h4>
                    <p className="text-slate-600 leading-relaxed text-xs md:text-sm italic font-medium">
                      "{selectedFaculty.bio}"
                    </p>
                  </div>

                  {selectedFaculty.expertise && selectedFaculty.expertise.length > 0 && (
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                        <Award size={14} className="text-primary" />
                        Core Expertise
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedFaculty.expertise.map((exp, idx) => (
                          <span key={idx} className="px-4 py-2 bg-navy text-white text-[9px] font-bold uppercase tracking-wider rounded-lg shadow-sm">
                            {exp}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedFaculty.education && (
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                        <GraduationCapIcon size={14} className="text-primary" />
                        Academic Background
                      </h4>
                      <p className="text-slate-700 font-bold text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        {selectedFaculty.education}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

function GraduationCapIcon({ size, className }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  );
}
