"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Tv } from "lucide-react";

const testimonialVideos = [
  {
    id: "DnFMfuMgDG4",
    title: "Innovators of Tomorrow",
    desc: "Hear directly from our students about their learning journey, hands-on experiences, and breakthroughs.",
    thumbnail: "https://img.youtube.com/vi/DnFMfuMgDG4/maxresdefault.jpg"
  },
  {
    id: "UPAkx03-Jms",
    title: "Future Tech Creators",
    desc: "Hear directly from our students about their learning journey, hands-on experiences, and breakthroughs.",
    thumbnail: "https://img.youtube.com/vi/UPAkx03-Jms/maxresdefault.jpg"
  },
  {
    id: "0tJ3TeNnY2Y",
    title: "Empowering Young Minds",
    desc: "Hear directly from our students about their learning journey, hands-on experiences, and breakthroughs.",
    thumbnail: "https://img.youtube.com/vi/0tJ3TeNnY2Y/maxresdefault.jpg"
  }
];

export default function StudentLife() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="py-10 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Video Side */}
          <div className="flex flex-col">
            {/* Main Video Highlight */}
            <div 
              onClick={() => setSelectedVideo(testimonialVideos[activeTab])}
              className="relative group cursor-pointer"
            >
              <div className="rounded-[2.5rem] overflow-hidden shadow-2xl relative aspect-video bg-slate-900 border border-slate-100">
                <img 
                  src={testimonialVideos[activeTab].thumbnail} 
                  alt={testimonialVideos[activeTab].title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-navy/25 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-navy shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    <Play size={32} fill="currentColor" className="ml-1" />
                  </div>
                </div>
              </div>
              <div className="mt-6 min-h-[90px]">
                <h3 className="text-2xl font-heading font-black text-slate-900 mb-2">
                  {testimonialVideos[activeTab].title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {testimonialVideos[activeTab].desc}
                </p>
              </div>
            </div>

            {/* Video Selector Tabs */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              {testimonialVideos.map((video, idx) => (
                <button
                  key={video.id}
                  onClick={() => setActiveTab(idx)}
                  className={`relative rounded-2xl overflow-hidden aspect-video border-2 transition-all text-left ${
                    activeTab === idx ? "border-[#FFC107] scale-[1.02] shadow-md" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                      <Play size={12} fill="currentColor" className="ml-0.5" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Activity Side */}
          <div>
            <div className="inline-flex items-center space-x-2 text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-4">
              <span className="w-8 h-px bg-primary"></span>
              <span>Life at Prayog</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-black text-slate-900 mb-6 leading-tight">
              From Classroom Theories to <span className="text-navy">Industrial Reality</span>
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-10 max-w-xl">
              Witness the daily hustle of our innovators. From brainstorming complex algorithms in our R&D labs to deploying real-world hardware, our students live and breathe technical excellence.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden h-48 shadow-lg">
                  <img src="/assets/m1.png" alt="Activity 1" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-2xl overflow-hidden h-64 shadow-lg">
                  <img src="/assets/m3.png" alt="Activity 2" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="rounded-2xl overflow-hidden h-64 shadow-lg">
                  <img src="/assets/m2.png" alt="Activity 3" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-2xl overflow-hidden h-48 shadow-lg">
                  <img src="/assets/m5.png" alt="Activity 4" className="w-full h-full object-cover" />
                </div>
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
              className="bg-[#02162b] border border-white/10 rounded-3xl max-w-5xl w-full relative overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Tv className="w-5 h-5 text-[#FFC107]" />
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Student Testimonial Spotlight</span>
                </div>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Widescreen Chassis */}
              <div className="aspect-video w-full bg-black">
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
              <div className="p-6 bg-[#011429] flex items-center justify-between text-xs font-semibold text-slate-400 font-mono">
                <span>{selectedVideo.title}</span>
                <span className="text-[#FFC107] uppercase">STATUS: STREAMING ACTIVE</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
