"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, ArrowLeft, Video, MessageCircle, Play, X } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ReviewsPage() {
  const [videoTestimonials, setVideoTestimonials] = useState([]);
  const [textReviews, setTextReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);
  const [filter, setFilter] = useState(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const filterParam = urlParams.get("filter");
      if (filterParam === "text") return "text";
      if (filterParam === "video") return "video";
    }
    return "video";
  });

  useEffect(() => {
    let ignore = false;
    const loadData = async () => {
      try {
        const [videoRes, textRes] = await Promise.all([
          fetch("/api/videos?category=Testimonial"),
          fetch("/api/testimonials")
        ]);

        const videoData = videoRes.ok ? await videoRes.json() : [];
        const textData = textRes.ok ? await textRes.json() : [];

        if (!ignore) {
          if (Array.isArray(videoData) && videoData.length > 0) {
            const formattedVideos = videoData.map(v => ({
              id: v.video_id,
              name: v.title,
              course: v.description || "Robotics Student",
              year: "2026",
              video_url: v.youtube_url,
              thumbnail: v.thumbnail || `https://img.youtube.com/vi/${v.video_id}/hqdefault.jpg`,
              rating: 5
            }));
            setVideoTestimonials(formattedVideos);
          } else {
            const fallbackVideos = Array.isArray(textData) ? textData.filter(r => r.video_url) : [];
            setVideoTestimonials(fallbackVideos);
          }

          if (Array.isArray(textData)) {
            const textList = textData.filter(r => r.content && r.content.trim() !== "");
            setTextReviews(textList);
          }
        }
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadData();

    return () => {
      ignore = true;
    };
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
              Student <span className="text-primary">Reviews & Video Feedback</span>
            </h1>
            <p className="text-blue-100/60 text-lg max-w-2xl mx-auto leading-relaxed">
              Read real stories, experiences, and watch video testimonials shared by our students and robotics program alumni.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
            <Link href="/" className="inline-flex items-center space-x-2 text-slate-500 hover:text-navy transition-colors font-bold text-xs uppercase">
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </Link>

            {/* Filter Buttons */}
            <div className="inline-flex p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm gap-2">
              <button
                onClick={() => setFilter("video")}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
                  filter === "video" ? "bg-navy text-white shadow-md" : "text-slate-600 hover:text-navy hover:bg-slate-50"
                }`}
              >
                <Video size={16} />
                <span>Video Testimonials</span>
              </button>
              <button
                onClick={() => setFilter("text")}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
                  filter === "text" ? "bg-navy text-white shadow-md" : "text-slate-600 hover:text-navy hover:bg-slate-50"
                }`}
              >
                <MessageCircle size={16} />
                <span>Text Reviews</span>
              </button>
            </div>

            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-navy font-black text-sm">4.8</span>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <span className="text-slate-400 text-xs font-semibold">(545+ reviews)</span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-navy border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filter === "video" ? (
            /* Video Testimonials Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videoTestimonials.map((item, i) => (
                <motion.div
                  key={item.id || i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 3) * 0.05 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl transition-all group flex flex-col"
                >
                  <div className="relative h-60 bg-slate-900 overflow-hidden cursor-pointer" onClick={() => setActiveVideo(item)}>
                    <img 
                      src={item.thumbnail} 
                      alt={item.name} 
                      onError={(e) => { e.target.src = `https://img.youtube.com/vi/${item.id}/hqdefault.jpg`; }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-navy/30 group-hover:bg-navy/10 transition-all flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-primary text-navy flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
                        <Play size={20} className="fill-current ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-1 mb-3">
                        {[...Array(5)].map((_, s) => <Star key={s} size={14} className="text-amber-400 fill-amber-400" />)}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1 leading-tight">{item.name}</h3>
                      <p className="text-slate-500 text-xs font-medium">{item.course} • Class of {item.year}</p>
                    </div>
                    <button 
                      onClick={() => setActiveVideo(item)}
                      className="mt-6 w-full py-2.5 bg-slate-50 hover:bg-navy hover:text-white text-navy font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-200/80 transition-all flex items-center justify-center gap-2"
                    >
                      <Play size={14} fill="currentColor" />
                      <span>Watch Testimonial</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            /* Text Reviews Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {textReviews.map((t, i) => (
                <motion.div
                  key={t.id || i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 3) * 0.05 }}
                  className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 relative group hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-navy shadow-md">
                      <Quote size={18} />
                    </div>
                    
                    <div className="flex items-center space-x-1 text-yellow-500 mb-6">
                      {[...Array(t.rating || 5)].map((_, j) => (
                        <Star key={j} size={14} fill="currentColor" className="text-amber-400 fill-amber-400 border-none" />
                      ))}
                    </div>

                    <p className="text-slate-600 mb-8 italic leading-relaxed text-sm">
                      &quot;{t.content}&quot;
                    </p>
                  </div>

                  <div className="flex items-center space-x-4 border-t border-slate-100 pt-4 mt-auto">
                    <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center font-bold text-sm uppercase">
                      {t.name?.substring(0, 1) || "U"}
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-slate-900 text-sm">{t.name}</h4>
                      <p className="text-slate-400 text-xs font-medium">
                        {t.course} {t.year ? `• ${t.year}` : ""}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Video Modal Lightbox */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-navy/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            onClick={() => setActiveVideo(null)}
          >
            <button 
              onClick={() => setActiveVideo(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
            >
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
              <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 px-2 text-white">
                <div>
                  <h2 className="text-xl font-bold mb-1">{activeVideo.name}</h2>
                  <p className="text-blue-100/60 font-medium text-xs">{activeVideo.course} | Session {activeVideo.year}</p>
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
