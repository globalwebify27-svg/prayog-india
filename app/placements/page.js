"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  TrendingUp, 
  Users, 
  Building2, 
  CheckCircle2, 
  Globe, 
  Award,
  ArrowUpRight,
  ChevronRight,
  Clock,
  Layout
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function PlacementsPage() {
  const [alumni, setAlumni] = useState([]);
  const [stats, setStats] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [alumniRes, statsRes, partnersRes] = await Promise.all([
        fetch("/api/placements/alumni"),
        fetch("/api/placements/stats"),
        fetch("/api/placements/partners")
      ]);
      setAlumni(await alumniRes.json());
      setStats(await statsRes.json());
      setPartners(await partnersRes.json());
    } catch (error) {
      console.error("Failed to fetch placement data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 font-body">
      <Header />

      {/* Hero Section */}
      <section className="pt-40 pb-24 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            <h4 className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-6">Industrial Deployment Hub</h4>
            <h1 className="text-5xl md:text-8xl font-black text-white mb-8 leading-[1.05] tracking-tight font-display">
              Careers & <span className="text-primary">Global</span><br />Placements
            </h1>
            <p className="text-blue-100/60 text-lg md:text-2xl leading-relaxed max-w-3xl font-medium italic">
              "Bridging the gap between technical mastery and industrial deployment. Our alumni work at the world's most innovative engineering centers."
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 -mt-20 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white h-48 rounded-3xl animate-pulse border border-slate-100 shadow-sm" />
              ))
            ) : stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-navy/5 text-center group hover:-translate-y-2 transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-50 text-navy flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-navy transition-colors">
                  <TrendingUp size={24} />
                </div>
                <span className="block text-4xl font-black text-navy mb-2 tracking-tighter">{stat.value}</span>
                <span className="block text-[10px] font-black text-primary uppercase tracking-widest mb-4">{stat.label}</span>
                <p className="text-slate-400 text-xs leading-relaxed font-medium italic">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Alumni Success */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div className="max-w-2xl">
              <h4 className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4">Verified Trajectories</h4>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">Our Alumni are Building <br /> the <span className="text-navy">Future</span></h2>
            </div>
            <p className="text-slate-500 font-medium italic max-w-sm">Hear from our graduates who successfully transitioned from students to industry leaders.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="bg-slate-50 h-[400px] rounded-[3rem] animate-pulse border border-slate-100" />
              ))
            ) : alumni.map((person, i) => (
              <motion.article 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-slate-50 rounded-[3rem] p-10 border border-slate-100 relative group hover:bg-white hover:shadow-2xl hover:shadow-navy/5 transition-all duration-700"
              >
                <div className="flex flex-col items-center text-center mb-10">
                  <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl mb-6 group-hover:scale-105 transition-transform duration-700">
                    <img src={person.image_url} alt={person.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900 mb-1">{person.name}</h4>
                    <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">{person.role}</p>
                    <div className="flex items-center justify-center space-x-2 text-slate-400 text-[10px] mt-3 font-bold uppercase tracking-widest">
                      <Building2 size={12} className="text-navy" />
                      <span>{person.company}</span>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="text-slate-500 text-sm leading-[1.8] italic font-medium">
                    "{person.story}"
                  </div>
                </div>
                <div className="mt-10 pt-8 border-t border-slate-200/60 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Placement</span>
                  </div>
                  <Link href="/stories" className="p-3 rounded-xl bg-white text-navy hover:bg-navy hover:text-white transition-all shadow-sm">
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Hiring Partners */}
      <section className="py-32 bg-slate-50 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 mb-20">
            <div className="max-w-2xl">
              <h4 className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4">Strategic Alliances</h4>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">Elite Hiring Partners</h2>
              <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium mt-6 italic">Our corporate relations team works directly with global industrial giants to ensure our curriculum produces the most sought-after engineers in India.</p>
            </div>
            <Link href="/register" className="bg-navy text-white px-12 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-black transition-all shadow-2xl shadow-navy/20 flex items-center space-x-3 whitespace-nowrap">
              <span>Recruit from Prayog</span>
              <ArrowUpRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {loading ? (
              [1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white h-32 rounded-3xl animate-pulse" />
              ))
            ) : partners.map((p, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-200/60 flex items-center justify-center grayscale hover:grayscale-0 transition-all cursor-pointer shadow-sm group hover:shadow-xl hover:shadow-navy/5">
                <span className="text-[10px] font-black text-slate-300 group-hover:text-navy transition-colors uppercase tracking-[0.2em] text-center">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Placement Support Services */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div>
              <h4 className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4">Technical Residency</h4>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-12 leading-tight">Career Acceleration <br /><span className="text-navy">Ecosystem</span></h2>
              <div className="space-y-6">
                {[
                  { title: "Mock Technical Panels", desc: "Simulated industrial interviews with robotics veterans." },
                  { title: "Digital Portfolio Building", desc: "Showcasing your lab projects to global recruiters." },
                  { title: "LinkedIn & Resume Sync", desc: "Institutional support to optimize your professional presence." },
                  { title: "Direct Industrial Referrals", desc: "Access to our internal network of partner HRs." }
                ].map((service, i) => (
                  <div key={i} className="flex items-start space-x-6 p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-navy/[0.02] hover:shadow-navy/10 transition-all group">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 text-navy flex items-center justify-center shrink-0 group-hover:bg-navy group-hover:text-white transition-colors">
                      <TrendingUp size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-sm mb-2 uppercase tracking-widest">{service.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-medium italic">{service.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-navy rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-t border-white/5">
                <Globe className="absolute top-10 right-10 text-primary opacity-10 animate-spin-slow" size={120} />
                <h3 className="text-4xl font-black mb-8 tracking-tighter leading-tight font-display italic">Ready for <br />Deployment?</h3>
                <p className="text-blue-100/40 text-lg leading-relaxed mb-12 font-medium italic">
                  "The industrial demand for certified robotics and AI engineers is at an all-time high. Initialize your professional journey today."
                </p>
                <Link href="/register" className="w-full inline-flex items-center justify-center space-x-3 bg-primary text-navy py-6 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 hover:scale-[1.05] transition-all">
                  <span>Initialize Onboarding</span>
                  <ChevronRight size={20} />
                </Link>
                <div className="mt-12 flex items-center justify-center space-x-10 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
                  <div className="flex items-center gap-2"><Award size={16} /> ISO:9001</div>
                  <div className="flex items-center gap-2"><Users size={16} /> 5k+ Certified</div>
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
