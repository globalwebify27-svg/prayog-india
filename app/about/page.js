"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Target, 
  Users, 
  History, 
  Award, 
  ShieldCheck, 
  Globe,
  ArrowRight,
  Sparkles,
  Search,
  Quote,
  Cpu,
  Building2,
  GraduationCap,
  Microscope,
  Server,
  Zap,
  Briefcase,
  Newspaper,
  MonitorPlay,
  ExternalLink
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const milestones = [
  { year: "2018", title: "Foundation", desc: "PRAYOG INDIA ROBOTICS PVT. LTD. was established to bridge the skill gap in deep-tech hardware engineering." },
  { year: "2020", title: "Global Hubs", desc: "Expanded operations to major industrial cities, launching our specialized Robotics & IoT Labs." },
  { year: "2022", title: "ISO:9001 Certification", desc: "Achieved international quality standards for our elite technical pedagogy and curriculum." },
  { year: "2024", title: "LMS Deployment", desc: "Launched our proprietary Learning Management System, integrating live batches and digital assignments." },
  { year: "2026", title: "Global Placements", desc: "Formalized our careers ecosystem with 94% placement rates and elite corporate hiring partnerships." }
];

export default function AboutPage() {
  const [mediaCoverage, setMediaCoverage] = useState([]);
  const [loadingMedia, setLoadingMedia] = useState(true);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const res = await fetch("/api/gallery?category=Media%20Coverage");
      const data = await res.json();
      setMediaCoverage(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch media coverage", error);
    } finally {
      setLoadingMedia(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 font-body">
      <Header />

      {/* Hero Section */}
      <section className="pt-40 pb-24 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
            <h4 className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-6">PRAYOG INDIA ROBOTICS PVT. LTD.</h4>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-8 leading-[1.1] tracking-tight font-display">
              Architecting the <span className="text-primary">Next Generation</span><br />of Global Engineers
            </h1>
            <p className="text-blue-100/60 text-lg md:text-2xl leading-relaxed font-medium italic max-w-3xl mx-auto">
              "We are an ISO-certified institutional ecosystem bridging the gap between theoretical academia and elite industrial deployment."
            </p>
          </motion.div>
        </div>
      </section>

      {/* Institutional Narrative */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-slate-50 rounded-[3rem] transform -rotate-3 transition-transform hover:rotate-0 duration-700" />
              <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 aspect-[4/5]">
                <img src="/assets/course1.png" alt="Institutional Training" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-navy p-10 rounded-[2rem] shadow-2xl text-white max-w-sm hidden md:block border border-white/10">
                <Quote className="text-primary mb-6 opacity-50" size={32} />
                <p className="text-sm font-medium italic leading-relaxed text-blue-50">
                  "Our pedagogy relies on hands-on deployment. We build autonomous systems, program industrial microcontrollers, and deploy real-world IoT networks."
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h4 className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4">The Prayog Framework</h4>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 leading-tight tracking-tight">
                Beyond Traditional <br /><span className="text-navy">Technical Education</span>
              </h2>
              <div className="space-y-6 text-slate-500 leading-relaxed text-sm font-medium mb-12">
                <p>
                  PRAYOG INDIA ROBOTICS PVT. LTD. operates at the intersection of deep-tech engineering and structured academia. We recognized early that standard curriculums lacked the agility to match industrial innovation.
                </p>
                <p>
                  Through our proprietary Learning Management System (LMS) and physical technical hubs, we deliver rigorous programs in Robotics, Artificial Intelligence, and Embedded IoT. Every student undergoes standardized, verifiable assessments leading to ISO:9001 certified credentials.
                </p>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="flex items-start space-x-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:shadow-lg hover:border-slate-200 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-white text-navy flex items-center justify-center border border-slate-100 shrink-0 shadow-sm">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm mb-1">ISO:9001 Certified</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">Globally recognized academic quality standards</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:shadow-lg hover:border-slate-200 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-white text-navy flex items-center justify-center border border-slate-100 shrink-0 shadow-sm">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm mb-1">Elite Placements</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">Corporate partnerships for direct hiring</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technological Infrastructure */}
      <section className="py-32 bg-slate-50 border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h4 className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4">Hardware Ecosystem</h4>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Industrial-Grade Facilities</h2>
            <p className="text-slate-500 max-w-xl mx-auto font-medium italic">Our physical and virtual labs are equipped with the exact technology stacks used by Fortune 500 manufacturing and robotics firms.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Microscope,
                title: "Advanced Robotics Labs",
                desc: "Equipped with 6-axis robotic arms, LiDAR sensors, and autonomous rover chassis for hands-on kinematics training."
              },
              {
                icon: Server,
                title: "AI & Computer Vision",
                desc: "High-performance GPU clusters dedicated to training neural networks, YOLO object detection, and autonomous navigation models."
              },
              {
                icon: Zap,
                title: "Embedded IoT Testbeds",
                desc: "Industrial microcontrollers (STM32, ESP32, Raspberry Pi) integrated with cloud infrastructure for real-time data telemetry."
              }
            ].map((facility, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-navy/5 group hover:-translate-y-2 transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-50 text-navy flex items-center justify-center mb-8 border border-slate-100 group-hover:bg-primary group-hover:text-navy transition-colors">
                  <facility.icon size={28} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-4">{facility.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium italic">{facility.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h4 className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4">Academic Leadership</h4>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 leading-tight tracking-tight">
                Guided by <br /><span className="text-navy">Industrial Veterans</span>
              </h2>
              <div className="space-y-6 text-slate-500 leading-relaxed text-sm font-medium mb-8">
                <p>
                  The curriculum and operational strategy of PRAYOG INDIA ROBOTICS PVT. LTD. are overseen by a board of seasoned engineers and academic researchers. 
                </p>
                <p>
                  Instead of pure theoreticians, our faculty consists of active developers, former tech-leads, and robotics researchers who bring current market realities directly into the classroom.
                </p>
              </div>
              <ul className="space-y-4">
                {[
                  "Curriculum updated quarterly to match industrial shifts",
                  "Direct mentorship from senior embedded engineers",
                  "Guest lectures from corporate hiring partners"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                      <ShieldCheck size={12} />
                    </div>
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="space-y-6 mt-12">
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-navy flex items-center justify-center text-white font-black text-xl mb-4 shadow-lg shadow-navy/20">
                    AD
                  </div>
                  <h4 className="font-black text-slate-900">Academic Director</h4>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">15+ Years Exp</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-white flex items-center justify-center text-navy font-black text-xl mb-4 shadow-lg border border-slate-100">
                    TL
                  </div>
                  <h4 className="font-black text-slate-900">Technical Lead</h4>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">Robotics R&D</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-primary flex items-center justify-center text-navy font-black text-xl mb-4 shadow-lg shadow-primary/20">
                    PR
                  </div>
                  <h4 className="font-black text-slate-900">Placement Head</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Corporate Relations</p>
                </div>
                <div className="bg-navy p-6 rounded-[2rem] text-center border-t border-white/10 shadow-2xl">
                  <div className="w-20 h-20 mx-auto rounded-full bg-white/10 flex items-center justify-center text-white font-black text-xl mb-4 border border-white/10">
                    <Briefcase size={28} className="text-primary" />
                  </div>
                  <h4 className="font-black text-white">Guest Faculty</h4>
                  <p className="text-[10px] text-blue-100/60 font-bold uppercase tracking-widest mt-1">45+ Companies</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-20 bg-navy relative border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 divide-x divide-white/10">
            {[
              { label: "Certified Engineers", value: "5000+", icon: GraduationCap },
              { label: "Corporate Partners", value: "45+", icon: Building2 },
              { label: "Proprietary Courses", value: "12", icon: Cpu },
              { label: "Placement Rate", value: "94%", icon: Target }
            ].map((stat, i) => (
              <div key={i} className="text-center px-4">
                <stat.icon className="mx-auto mb-4 text-primary/50" size={32} />
                <h3 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tighter">{stat.value}</h3>
                <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h4 className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4">Historical Trajectory</h4>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Institutional Evolution</h2>
            <p className="text-slate-500 max-w-xl mx-auto font-medium italic">Documenting our structured expansion across the Indian technical landscape.</p>
          </div>

          <div className="relative">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-200 -translate-y-1/2 hidden lg:block" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
              {milestones.map((m, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="relative z-10 flex flex-col items-center lg:items-start group"
                >
                  <div className="w-16 h-16 rounded-[1.5rem] bg-white text-navy flex items-center justify-center font-black text-sm mb-8 shadow-xl border border-slate-100 group-hover:bg-navy group-hover:text-white transition-colors duration-500">
                    {m.year}
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-3 text-center lg:text-left">{m.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed text-center lg:text-left font-medium italic">{m.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Media Coverage Section */}
      <section className="py-32 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div className="max-w-2xl">
              <h4 className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4">Press & Recognition</h4>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">In the <span className="text-navy">Headlines</span></h2>
            </div>
            <p className="text-slate-500 font-medium italic max-w-sm">
              Discover how leading tech publications and national media cover our innovations in deep-tech education.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loadingMedia ? (
              [1, 2, 3].map(i => (
                <div key={i} className="bg-slate-50 h-80 rounded-[2.5rem] animate-pulse border border-slate-100" />
              ))
            ) : mediaCoverage.length > 0 ? (
              mediaCoverage.map((media, i) => (
                <motion.article 
                  key={media.id || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-slate-50 rounded-[2.5rem] border border-slate-100 group hover:shadow-2xl hover:shadow-navy/5 transition-all duration-500 overflow-hidden flex flex-col h-full"
                >
                  <div className="h-48 overflow-hidden relative">
                    <div className="absolute inset-0 bg-navy/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                    <img src={media.image_url} alt={media.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-8 flex-grow flex flex-col justify-between bg-white group-hover:bg-navy transition-colors duration-500">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Newspaper size={14} className="text-primary" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-blue-100/60">{media.location || "Press Release"}</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-black text-slate-900 group-hover:text-white transition-colors leading-snug">
                        "{media.title}"
                      </h3>
                    </div>
                  </div>
                </motion.article>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-slate-400 text-sm font-bold uppercase tracking-widest">
                Coverage data syncing...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Action Section */}
      <section className="py-32">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-navy rounded-[4rem] p-12 md:p-20 text-white overflow-hidden relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-t border-white/5 text-center">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
            
            <Globe className="text-primary mx-auto mb-8 animate-pulse" size={64} />
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tight font-display">
              Initialize Your <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Engineering Career</span>
            </h2>
            <p className="text-blue-100/60 text-lg leading-relaxed mb-12 font-medium max-w-2xl mx-auto italic">
              "Join thousands of students who have transformed their academic knowledge into industrial capability through the Prayog ecosystem."
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/courses" className="w-full sm:w-auto bg-primary text-navy px-12 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] hover:scale-105 transition-transform shadow-2xl shadow-primary/20 flex items-center justify-center gap-3">
                <span>View Learning Paths</span>
                <ArrowRight size={16} />
              </Link>
              <Link href="/placements" className="w-full sm:w-auto bg-white/5 text-white border border-white/10 px-12 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white/10 transition-colors flex items-center justify-center gap-3">
                <span>Industrial Placements</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
