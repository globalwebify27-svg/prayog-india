"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  Award, 
  BookOpen, 
  Briefcase,
  ChevronRight,
  ShieldCheck,
  Star
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function FacultiesPage() {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFaculties() {
      try {
        const res = await fetch("/api/faculties");
        const data = await res.json();
        setFaculties(data);
      } catch (err) {
        console.error("Failed to fetch faculties:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFaculties();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 font-body">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-semibold text-white mb-6 leading-tight tracking-tight">
              Institutional <span className="text-primary">Faculty & Mentors</span>
            </h1>
            <p className="text-blue-100/60 text-lg max-w-2xl leading-relaxed">
              Learn from industry veterans and research pioneers who are defining the future of robotics and artificial intelligence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Faculty Directory */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-navy border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
          <div className="space-y-16">
            {faculties.map((f, i) => {
              const expertise = typeof f.expertise === 'string' ? JSON.parse(f.expertise) : (f.expertise || []);
              return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm group hover:shadow-md transition-all"
              >
                <div className="grid lg:grid-cols-12 gap-0">
                  {/* Photo Column */}
                  <div className="lg:col-span-4 relative h-80 lg:h-auto overflow-hidden bg-slate-100">
                    <img src={f.image} alt={f.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-8">
                      <div className="flex space-x-3">
                        <button className="w-10 h-10 rounded-lg bg-white text-navy flex items-center justify-center hover:bg-primary transition-all shadow-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                        </button>
                        <button className="w-10 h-10 rounded-lg bg-white text-navy flex items-center justify-center hover:bg-primary transition-all shadow-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Details Column */}
                  <div className="lg:col-span-8 p-8 md:p-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-slate-100 pb-8">
                      <div>
                        <div className="flex items-center space-x-2 text-primary font-bold text-[10px] uppercase mb-2">
                          <Star size={14} />
                          <span>Expert Faculty</span>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-1">{f.name}</h2>
                        <p className="text-slate-500 font-medium">{f.role} — {f.specialty}</p>
                      </div>
                      <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 text-navy font-bold text-[10px] uppercase tracking-tight">
                        {f.education}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                          <Briefcase size={14} /> Professional Profile
                        </h4>
                        <p className="text-slate-600 text-sm leading-relaxed font-medium">
                          {f.bio}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                          <BookOpen size={14} /> Core Expertise
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {expertise.map(exp => (
                            <span key={exp} className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-bold uppercase border border-slate-200">
                              {exp}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-12 flex items-center justify-between pt-8 border-t border-slate-100">
                      <div className="flex items-center space-x-4 text-emerald-600 font-bold text-[10px] uppercase">
                        <ShieldCheck size={16} />
                        <span>Verified Instructor</span>
                      </div>
                      <button className="flex items-center space-x-2 text-navy font-bold text-xs uppercase group/btn">
                        <span>View publications</span>
                        <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
              );
            })}
          </div>
          )}
        </div>
      </section>

      {/* Advisory Section */}
      <section className="py-20 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-6 tracking-tight">Technical Advisory Board</h2>
          <p className="text-blue-100/40 text-sm max-w-xl mx-auto leading-relaxed mb-12 font-medium">
            Our programs are vetted by an international board of industrial experts to ensure curriculum alignment with the latest robotics standards.
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-30 grayscale invert">
            {/* Logos placeholder logic */}
            <div className="h-8 w-24 bg-white/20 rounded"></div>
            <div className="h-8 w-24 bg-white/20 rounded"></div>
            <div className="h-8 w-24 bg-white/20 rounded"></div>
            <div className="h-8 w-24 bg-white/20 rounded"></div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
