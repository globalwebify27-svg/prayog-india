"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Quote, 
  Star, 
  MessageCircle, 
  User, 
  X,
  PlayCircle,
  Video,
  Award,
  ChevronRight
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TestimonialsPage() {
  const [videoTestimonials, setVideoTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await fetch("/api/testimonials");
        const data = await res.json();
        setVideoTestimonials(data);
      } catch (err) {
        console.error("Failed to fetch testimonials:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTestimonials();
  }, []);


  return (
    <main className="min-h-screen bg-slate-50 font-body">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-semibold text-white mb-6 leading-tight tracking-tight">
              Institutional <span className="text-primary">Alumni Stories</span>
            </h1>
            <p className="text-blue-100/60 text-lg max-w-2xl mx-auto leading-relaxed">
              Hear directly from our graduates about their technical journeys and how our immersion programs catalyzed their industrial careers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Video Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-navy border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videoTestimonials.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-all group"
              >
                <div className="relative h-60 bg-slate-100 overflow-hidden">
                  <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-navy/20 group-hover:bg-navy/10 transition-all flex items-center justify-center">
                    <button 
                      onClick={() => setActiveVideo(item)}
                      className="w-14 h-14 rounded-full bg-primary text-navy flex items-center justify-center shadow-lg group-hover:scale-110 transition-all"
                    >
                      <Play size={20} className="fill-current ml-1" />
                    </button>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="px-2.5 py-1 bg-white/95 backdrop-blur-sm text-navy rounded-lg text-[9px] font-bold uppercase border border-slate-100 shadow-sm">
                      Video testimonial
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center space-x-1 mb-4">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} className="text-amber-400 fill-amber-400" />)}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1 leading-tight">{item.name}</h3>
                  <p className="text-slate-500 text-sm mb-6 font-medium">{item.course} • Class of {item.year}</p>
                  <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                    <div className="flex items-center space-x-2 text-primary font-bold text-[9px] uppercase tracking-wide">
                      <Award size={14} />
                      <span>Certified Alumni</span>
                    </div>
                    <button onClick={() => setActiveVideo(item)} className="text-navy font-bold text-[10px] uppercase tracking-wider hover:text-black transition-colors flex items-center gap-1.5 group/btn">
                      <span>Watch now</span>
                      <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* Trust Metrics */}
      <section className="py-16 bg-navy text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <span className="block text-3xl font-bold text-primary tabular-nums tracking-tight">500+</span>
              <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Video Success Stories</span>
            </div>
            <div className="space-y-1">
              <span className="block text-3xl font-bold text-primary tabular-nums tracking-tight">98%</span>
              <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Career Satisfaction</span>
            </div>
            <div className="space-y-1">
              <span className="block text-3xl font-bold text-primary tabular-nums tracking-tight">15+</span>
              <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Industrial Partners</span>
            </div>
            <div className="space-y-1">
              <span className="block text-3xl font-bold text-primary tabular-nums tracking-tight">24/7</span>
              <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Alumni Network Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-navy/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            onClick={() => setActiveVideo(null)}
          >
            <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
              <X size={28} />
            </button>
            <motion.div 
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-4xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative pt-[56.25%] bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <iframe 
                  src={activeVideo.video_url} 
                  className="absolute inset-0 w-full h-full" 
                  title={activeVideo.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
              <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 px-2">
                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-bold text-white mb-1">{activeVideo.name}</h2>
                  <p className="text-blue-100/40 font-bold text-xs uppercase tracking-wide">{activeVideo.course} Alumni | Session {activeVideo.year}</p>
                </div>
                <div className="flex gap-3">
                  <button className="px-5 py-2 bg-white/5 border border-white/10 text-white rounded-lg text-[10px] font-bold uppercase hover:bg-white/10 transition-all">
                    More alumni
                  </button>
                  <Link href="/register" className="px-6 py-2 bg-primary text-navy rounded-lg text-[10px] font-bold uppercase shadow-lg shadow-primary/20">
                    Apply now
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
