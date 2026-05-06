"use client";

import { useState, useEffect } from "react";
import { Play, ArrowRight, Calendar, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function WorkshopStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStories() {
      try {
        const res = await fetch("/api/workshops");
        const data = await res.json();
        setStories(data.slice(0, 3)); // Only show top 3 on home
      } catch (err) {
        console.error("Failed to fetch workshops:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStories();
  }, []);

  return (
    <section className="py-10 md:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left mb-12 gap-8">
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-navy font-bold uppercase tracking-widest text-[10px] md:text-xs mb-3 flex items-center gap-2">
              <span className="w-6 h-px bg-primary hidden md:block" />
              Our Journey
            </h4>
            <h2 className="text-2xl md:text-5xl font-heading font-black text-slate-900 leading-tight">
              Workshop <span className="text-navy">Stories</span>
            </h2>
          </div>
          <Link href="/gallery" className="bg-navy text-white px-5 md:px-8 py-2.5 md:py-4 rounded-xl font-bold text-[10px] md:text-sm hover:bg-navy/90 transition-all flex items-center space-x-2 shadow-lg shadow-navy/10 group">
            <span>View All 100+ Stories</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {loading ? (
            [1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-200 rounded-2xl animate-pulse" />)
          ) : (
          <>
          {stories.map((story, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-slate-100"
            >
              <div className="relative h-32 md:h-48 overflow-hidden">
                <img src={story.image_url} alt={story.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                {story.video_url && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white border border-white/50 hover:scale-110 transition-transform cursor-pointer">
                      <Play size={12} className="md:w-5 md:h-5" fill="white" />
                    </div>
                  </div>
                )}
                <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-white/90 backdrop-blur-sm px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[6px] md:text-[10px] font-bold text-navy flex items-center space-x-1">
                  <Calendar size={10} className="md:w-3 md:h-3" />
                  <span>{new Date(story.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
              <div className="p-4 md:p-6">
                <div className="flex items-center space-x-1 md:space-x-2 text-slate-400 text-[8px] md:text-[10px] mb-2 md:mb-2 font-black uppercase tracking-widest">
                  <MapPin size={12} className="text-navy" />
                  <span>{story.location}</span>
                </div>
                <h3 className="text-[11px] md:text-lg font-heading font-black text-slate-900 mb-3 md:mb-4 group-hover:text-navy transition-colors line-clamp-2">
                  {story.title}
                </h3>
                <Link href="/gallery" className="text-navy font-bold text-[9px] md:text-xs uppercase tracking-widest flex items-center hover:text-primary transition-colors">
                  <span>Read Full Story</span> 
                  <ArrowRight size={12} className="ml-1 md:ml-2" />
                </Link>
              </div>
            </motion.div>
          ))}
          </>
          )}
        </div>

      </div>
    </section>
  );
}
