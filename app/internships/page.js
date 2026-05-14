"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  ChevronRight, 
  CheckCircle2, 
  MapPin, 
  Building2, 
  Calendar,
  Zap,
  ShieldCheck,
  Globe,
  ArrowUpRight
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function InternshipsPage() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const res = await fetch("/api/courses");
        const data = await res.json();
        // Filter courses marked as internships
        const filtered = Array.isArray(data) ? data.filter(c => c.is_internship === 1) : [];
        setInternships(filtered);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInternships();
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
              Professional <span className="text-primary">Career Pathways</span>
            </h1>
            <p className="text-blue-100/60 text-lg max-w-2xl leading-relaxed">
              Gain real-world experience at India's premier technical research hubs. Our internship 
              programs bridge the gap between academic theory and industrial robotics mastery.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Internship Listings */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12">
            
            {/* Sidebar Context */}
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm sticky top-32">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Elite Cohort Selection</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-10 font-medium">
                  We maintain a rigorous selection process, onboarding only the top applicants for intensive industrial research and hardware development.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                      <Zap size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Industrial Deployment</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Direct Lab Access</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Accredited Experience</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Institutional LORs</p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-slate-100">
                  <Link href="/register" className="w-full bg-navy text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-black transition-all flex items-center justify-center space-x-3">
                    <span>Submit global CV</span>
                    <ChevronRight size={18} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Listings */}
            <div className="lg:col-span-8 space-y-6">
              {loading ? (
                <div className="py-20 text-center">
                  <div className="w-10 h-10 border-4 border-navy border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading opportunities...</p>
                </div>
              ) : internships.length === 0 ? (
                <div className="bg-white rounded-2xl p-20 text-center border border-slate-200">
                  <Briefcase size={40} className="text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">No active internship openings at the moment.</p>
                </div>
              ) : (
                internships.map((job, i) => {
                  let perks = [];
                  try {
                    perks = typeof job.perks === 'string' ? JSON.parse(job.perks) : (job.perks || []);
                  } catch (e) { perks = []; }

                  return (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      viewport={{ once: true }}
                      className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
                        <div className="flex-grow">
                          <div className="flex items-center space-x-2 text-primary font-bold text-[10px] uppercase mb-2">
                            <Briefcase size={14} />
                            <span>{job.company}</span>
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-navy transition-colors">{job.title}</h3>
                          <div className="flex flex-wrap items-center gap-5 text-slate-400 font-bold text-[10px] uppercase tracking-tight">
                            <span className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-300" /> {job.location}</span>
                            <span className="flex items-center gap-1.5"><Calendar size={14} className="text-slate-300" /> {job.duration}</span>
                            <span className="flex items-center gap-1.5 text-emerald-600"><Building2 size={14} /> {job.stipend}</span>
                          </div>
                        </div>
                        <div className="bg-slate-50 px-3 py-1.5 rounded-lg text-navy font-bold text-[10px] uppercase border border-slate-200 shrink-0">
                          {job.slots}
                        </div>
                      </div>

                      <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-8">
                        {Array.isArray(perks) && perks.map(perk => (
                          <span key={perk} className="px-3 py-1.5 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-bold uppercase border border-slate-100 flex items-center gap-2">
                            <CheckCircle2 size={12} className="text-emerald-500" />
                            {perk}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                        <span className="text-[10px] font-bold text-slate-300 uppercase">Application closing soon</span>
                        <Link href="/register?type=internship" className="flex items-center space-x-2 text-navy font-bold text-xs uppercase group/btn">
                          <span>Express interest</span>
                          <ArrowUpRight size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                        </Link>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
