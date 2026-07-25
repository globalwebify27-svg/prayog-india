"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Tv, Film } from "lucide-react";
import Link from "next/link";

const defaultMainVideos = [
  {
    id: "Ebg0dNMWjCI",
    title: "Prayog India Robotics Overview",
    desc: "Experience the innovation, hands-on training, and technology journey at Prayog India Robotics.",
    thumbnail: "https://img.youtube.com/vi/Ebg0dNMWjCI/hqdefault.jpg",
    isShort: false
  },
  {
    id: "DnFMfuMgDG4",
    title: "Innovators of Tomorrow",
    desc: "Hear directly from our students about their learning journey, hands-on experiences, and breakthroughs.",
    thumbnail: "https://img.youtube.com/vi/DnFMfuMgDG4/hqdefault.jpg",
    isShort: false
  }
];

const defaultShortVideos = [
  {
    id: "Hc1Y2xe8tP8",
    title: "Robotics in Action #1",
    thumbnail: "https://img.youtube.com/vi/Hc1Y2xe8tP8/hqdefault.jpg",
    isShort: true
  },
  {
    id: "Ychi5tA2UTY",
    title: "Student Project Demo #2",
    thumbnail: "https://img.youtube.com/vi/Ychi5tA2UTY/hqdefault.jpg",
    isShort: true
  },
  {
    id: "iG8phPg9hZk",
    title: "Hands-on Workshop #3",
    thumbnail: "https://img.youtube.com/vi/iG8phPg9hZk/hqdefault.jpg",
    isShort: true
  }
];

export default function StudentLife() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [mainVideos, setMainVideos] = useState(defaultMainVideos);
  const [shortVideos, setShortVideos] = useState(defaultShortVideos);
  const [videoTestimonials, setVideoTestimonials] = useState([
    {
      keyId: "testimonial-default-1",
      id: "DnFMfuMgDG4",
      title: "Student Review & Experience",
      desc: "Real experiences and career feedback from our robotics program alumni.",
      thumbnail: "https://img.youtube.com/vi/DnFMfuMgDG4/hqdefault.jpg",
      isShort: false
    }
  ]);

  useEffect(() => {
    let ignore = false;
    async function loadVideos() {
      try {
        const res = await fetch("/api/videos");
        if (res.ok) {
          const data = await res.json();
          if (!ignore && Array.isArray(data) && data.length > 0) {
            const reels = data.filter(v => v.category === "Reel").map(v => ({
              keyId: `reel-${v.id || v.video_id}`,
              id: v.video_id,
              title: v.title,
              thumbnail: v.thumbnail || `https://img.youtube.com/vi/${v.video_id}/hqdefault.jpg`,
              isShort: true
            }));

            const overviews = data.filter(v => v.category === "Overview").map(v => ({
              keyId: `overview-${v.id || v.video_id}`,
              id: v.video_id,
              title: v.title,
              desc: v.description || "Experience the technology journey at Prayog India Robotics.",
              thumbnail: v.thumbnail || `https://img.youtube.com/vi/${v.video_id}/hqdefault.jpg`,
              isShort: false
            }));

            const testimonials = data.filter(v => v.category === "Testimonial").map(v => ({
              keyId: `testimonial-${v.id || v.video_id}`,
              id: v.video_id,
              title: v.title,
              desc: v.description || "Real experiences and career feedback from our robotics program alumni.",
              thumbnail: v.thumbnail || `https://img.youtube.com/vi/${v.video_id}/hqdefault.jpg`,
              isShort: false
            }));

            if (reels.length > 0) setShortVideos(reels.slice(0, 3));
            if (overviews.length > 0) setMainVideos(overviews);
            if (testimonials.length > 0) setVideoTestimonials(testimonials);
          }
        }
      } catch (err) {
        console.error("Failed to load dynamic videos:", err);
      }
    }
    loadVideos();
    return () => { ignore = true; };
  }, []);

  return (
    <section className="py-10 md:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-3">
            <span className="w-8 h-px bg-primary"></span>
            <span>Life at Prayog in Motion</span>
            <span className="w-8 h-px bg-primary"></span>
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-black text-slate-900 leading-tight mb-4">
            Watch Our Students <span className="text-navy">Build the Future</span>
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            From industrial robotics to IoT innovations, witness real student projects, practical workshops, and lab experiences in action.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Video Highlight (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col bg-white p-5 md:p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div 
              onClick={() => setSelectedVideo(mainVideos[activeTab])}
              className="relative group cursor-pointer"
            >
              <div className="rounded-3xl overflow-hidden shadow-xl relative aspect-video bg-slate-900 border border-slate-100">
                <img 
                  src={mainVideos[activeTab].thumbnail} 
                  alt={mainVideos[activeTab].title} 
                  onError={(e) => { e.target.src = `https://img.youtube.com/vi/${mainVideos[activeTab].id}/hqdefault.jpg`; }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-navy/30 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-navy shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    <Play size={32} fill="currentColor" className="ml-1" />
                  </div>
                </div>
              </div>
              <div className="mt-5 min-h-[70px]">
                <h3 className="text-xl md:text-2xl font-heading font-black text-slate-900 mb-2">
                  {mainVideos[activeTab].title}
                </h3>
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
                  {mainVideos[activeTab].desc}
                </p>
              </div>
            </div>

            {/* Main Video Selector Tabs */}
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
              {mainVideos.map((video, idx) => (
                <button
                  key={video.id}
                  onClick={() => setActiveTab(idx)}
                  className={`relative rounded-2xl overflow-hidden aspect-video border-2 transition-all text-left ${
                    activeTab === idx ? "border-[#FFC107] scale-[1.02] shadow-md" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    onError={(e) => { e.target.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`; }}
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                      <Play size={12} fill="currentColor" className="ml-0.5" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* YouTube Shorts Gallery & Video Testimonial Spotlight (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Reels Section */}
            <div className="bg-white p-5 md:p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2 text-navy font-bold text-xs md:text-sm uppercase tracking-wider">
                  <Film size={18} className="text-primary" />
                  <span>Student Reels</span>
                </div>
                <Link 
                  href="/gallery?cat=Reels" 
                  className="inline-flex items-center space-x-1 text-xs font-bold text-navy hover:text-primary transition-colors bg-slate-50 hover:bg-slate-100 px-3 py-1 rounded-full border border-slate-200/60"
                >
                  <span>View All</span>
                  <span className="text-primary font-black">→</span>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {shortVideos.map((short, idx) => (
                  <div
                    key={short.keyId || `${short.id}-${idx}`}
                    onClick={() => setSelectedVideo(short)}
                    className="group relative rounded-2xl overflow-hidden aspect-[9/16] bg-slate-900 cursor-pointer border border-slate-100 shadow-sm hover:shadow-md transition-all"
                  >
                    <img 
                      src={short.thumbnail} 
                      alt={short.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex flex-col justify-between p-2.5">
                      <div className="self-end">
                        <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full tracking-wider uppercase">Shorts</span>
                      </div>
                      <div className="flex flex-col items-center justify-center my-auto">
                        <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                          <Play size={16} fill="currentColor" className="ml-0.5" />
                        </div>
                      </div>
                      <p className="text-[11px] font-semibold text-white truncate drop-shadow-md">
                        {short.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Student Video Testimonials List (With View All button to /reviews page) */}
            <div className="bg-white p-4 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-navy uppercase tracking-wider">Video Testimonials</span>
                <Link 
                  href="/reviews?filter=video" 
                  className="inline-flex items-center space-x-1 text-xs font-bold text-navy hover:text-primary transition-colors bg-slate-50 hover:bg-slate-100 px-3 py-1 rounded-full border border-slate-200/60"
                >
                  <span>View All</span>
                  <span className="text-primary font-black">→</span>
                </Link>
              </div>

              <div className="flex flex-col gap-3">
                {videoTestimonials.map((item, idx) => (
                  <div 
                    key={item.keyId || `${item.id}-${idx}`}
                    onClick={() => setSelectedVideo(item)}
                    className="group cursor-pointer flex items-center gap-4 hover:bg-slate-50 p-1.5 rounded-2xl transition-colors"
                  >
                    <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-100">
                      <img 
                        src={item.thumbnail} 
                        alt={item.title} 
                        onError={(e) => { e.target.src = `https://img.youtube.com/vi/${item.id}/hqdefault.jpg`; }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-navy/30 flex items-center justify-center">
                        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-navy shadow-md">
                          <Play size={12} fill="currentColor" className="ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-navy transition-colors truncate">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Lightbox Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#01254d]/90 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-10"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`bg-[#02162b] border border-white/10 rounded-3xl w-full relative overflow-hidden shadow-2xl ${
                selectedVideo.isShort ? "max-w-md" : "max-w-5xl"
              }`}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Tv className="w-5 h-5 text-[#FFC107]" />
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                    {selectedVideo.isShort ? "YouTube Shorts Reel" : "Student Showcase Video"}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Chassis */}
              <div className={`w-full bg-black ${selectedVideo.isShort ? "aspect-[9/16] max-h-[75vh]" : "aspect-video"}`}>
                <iframe 
                  className="w-full h-full" 
                  src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`}
                  title={selectedVideo.title}
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin" 
                  allowFullScreen
                />
              </div>

              {/* Modal Footer Info */}
              <div className="p-4 bg-[#011429] flex items-center justify-between text-xs font-semibold text-slate-400 font-mono">
                <span className="truncate max-w-[240px]">{selectedVideo.title}</span>
                <span className="text-[#FFC107] uppercase text-[10px]">STREAMING ACTIVE</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
