"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Calendar, 
  MapPin, 
  ChevronLeft, 
  Share2, 
  Target, 
  Lightbulb, 
  TrendingUp, 
  FileText,
  PlayCircle
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SECTION_ICONS = {
  overview: { icon: FileText, color: "bg-blue-50 text-blue-500" },
  challenge: { icon: Target, color: "bg-rose-50 text-rose-500" },
  solution: { icon: Lightbulb, color: "bg-emerald-50 text-emerald-500" },
  result: { icon: TrendingUp, color: "bg-amber-50 text-amber-500" }
};

export default function CaseStudyDetail() {
  const { id } = useParams();
  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        const res = await fetch("/api/workshops");
        const data = await res.json();
        const found = data.find(w => w.id === parseInt(id));
        if (found) {
          found.content = typeof found.content === 'string' ? JSON.parse(found.content) : (found.content || []);
          setWorkshop(found);
        }
      } catch (error) {
        console.error("Failed to fetch workshop:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkshop();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-navy border-t-primary rounded-full animate-spin" />
    </div>
  );

  if (!workshop) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <h1 className="text-2xl font-bold text-slate-900">Case Study Not Found</h1>
      <Link href="/stories" className="text-navy font-bold hover:underline">&larr; Back to Stories</Link>
    </div>
  );

  return (
    <main className="min-h-screen bg-white font-body">
      <Header />
      
      {/* Premium Hero Header */}
      <section className="relative pt-32 pb-24 bg-navy overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Link 
            href="/stories" 
            className="inline-flex items-center space-x-2 text-white/60 hover:text-primary transition-colors mb-12 text-sm font-bold uppercase tracking-widest"
          >
            <ChevronLeft size={16} />
            <span>Success Stories</span>
          </Link>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <span className="px-4 py-1 bg-primary text-navy text-[10px] font-bold uppercase tracking-widest rounded-full">
                  {workshop.category}
                </span>
                <span className="text-white/40 text-xs font-bold uppercase tracking-widest">
                  Case ID: #PR-WS-{workshop.id}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-[1.1] tracking-tight">
                {workshop.title}
              </h1>
              <p className="text-xl text-blue-100/60 leading-relaxed mb-10 max-w-xl">
                {workshop.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-8 pt-8 border-t border-white/10">
                <div className="space-y-1">
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Organization</p>
                  <p className="text-white font-bold">{workshop.client_name || "Internal Innovation"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Location</p>
                  <div className="flex items-center gap-2 text-white font-bold">
                    <MapPin size={14} className="text-primary" /> {workshop.location}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Timeline</p>
                  <div className="flex items-center gap-2 text-white font-bold">
                    <Calendar size={14} className="text-primary" /> {new Date(workshop.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 group"
            >
              {workshop.image_url ? (
                <img 
                  src={workshop.image_url} 
                  className="w-full h-full object-cover" 
                  alt={workshop.title} 
                />
              ) : (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white/10">
                  <Layout size={80} />
                </div>
              )}
              {workshop.video_url && (
                <a 
                  href={workshop.video_url} 
                  target="_blank" 
                  className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all"
                >
                  <div className="w-20 h-20 bg-primary text-navy rounded-full flex items-center justify-center shadow-2xl scale-110">
                    <PlayCircle size={32} fill="currentColor" />
                  </div>
                </a>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Case Study Content */}
      <section className="py-24 bg-white relative">
        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-24">
            {workshop.content?.map((section, idx) => {
              const config = SECTION_ICONS[section.type] || SECTION_ICONS.overview;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`p-4 rounded-2xl ${config.color} shadow-sm group-hover:scale-110 transition-transform`}>
                      <config.icon size={24} />
                    </div>
                    <div>
                      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Investigation {idx + 1}</h2>
                      <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{section.title}</h3>
                    </div>
                  </div>
                  <div className="pl-0 md:pl-20">
                    <p className="text-lg text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                      {section.text}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Social Interaction */}
          <div className="mt-32 pt-16 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-navy text-white flex items-center justify-center font-bold">
                PI
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 uppercase tracking-widest">Prayog India Labs</p>
                <p className="text-xs text-slate-400">Institutional Success Narrative</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-900 rounded-2xl font-bold text-xs hover:bg-slate-100 transition-all uppercase tracking-widest">
                <Share2 size={16} /> Share Story
              </button>
              <Link href="/stories" className="px-8 py-3 bg-navy text-white rounded-2xl font-bold text-xs hover:bg-black transition-all uppercase tracking-widest shadow-xl shadow-navy/10">
                Back to Stories
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
