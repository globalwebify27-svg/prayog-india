"use client";

import { useState, useEffect } from "react";
import { Play, ArrowRight, Calendar, Tag, Heart, MessageCircle, Share2, MoreHorizontal, Plus } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function WorkshopStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStories() {
      try {
        const res = await fetch("/api/stories");
        const data = await res.json();
        if (Array.isArray(data)) {
          // Process stories to extract extra images from content
          const processed = data.slice(0, 3).map(story => {
            let extraImages = [];
            try {
              const content = typeof story.content === 'string' ? JSON.parse(story.content) : story.content;
              content?.forEach(block => {
                if (block.type === 'image') extraImages.push(block.value);
                if (block.type === 'gallery') extraImages.push(...block.value);
              });
            } catch (e) {}
            return { ...story, extraImages: [...new Set(extraImages)].filter(img => img !== story.thumbnail) };
          });
          setStories(processed);
        } else {
          setStories([]);
        }
      } catch (err) {
        console.error("Failed to fetch stories:", err);
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
              Institutional Impact
            </h4>
            <h2 className="text-2xl md:text-5xl font-heading font-black text-slate-900 leading-tight">
              Success <span className="text-navy">Narratives</span>
            </h2>
          </div>
          <Link href="/stories" className="bg-navy text-white px-5 md:px-8 py-2.5 md:py-4 rounded-xl font-bold text-[10px] md:text-sm hover:bg-navy/90 transition-all flex items-center space-x-2 shadow-lg shadow-navy/10 group">
            <span>Explore All Narratives</span>
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
              whileHover={{ y: -5 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all group border border-slate-100 flex flex-col"
            >
              {/* Card Header (Social Style) */}
              <div className="p-4 md:p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center font-bold text-xs border-2 border-slate-50">
                    PI
                  </div>
                  <div>
                    <h4 className="text-[11px] md:text-sm font-bold text-slate-900 leading-tight">{story.author || "PI Labs"}</h4>
                    <p className="text-[9px] md:text-[10px] text-slate-400 font-medium flex items-center gap-1">
                      <Calendar size={10} />
                      {new Date(story.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} • <Tag size={10} className="text-navy" /> {story.category}
                    </p>
                  </div>
                </div>
                <button className="text-slate-300 hover:text-navy transition-colors">
                  <MoreHorizontal size={18} />
                </button>
              </div>

              {/* Card Content (Text) */}
              <div className="px-4 md:px-6 pb-4">
                <h3 className="text-[12px] md:text-base font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-navy transition-colors">
                  {story.title}
                </h3>
                <p className="text-[10px] md:text-sm text-slate-500 line-clamp-2 leading-relaxed font-medium italic">
                  {story.excerpt}
                </p>
              </div>

              {/* Card Media (Facebook Grid Style) */}
              <div className="relative aspect-square md:aspect-[4/3] bg-slate-100 overflow-hidden cursor-pointer" onClick={() => window.location.href=`/stories/${story.slug || story.id}`}>
                <div className={`grid h-full w-full gap-1 ${story.extraImages.length > 0 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  <div className={`relative ${story.extraImages.length === 1 ? 'col-span-1' : story.extraImages.length > 1 ? 'row-span-2' : ''}`}>
                    <img src={story.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  {story.extraImages.length > 0 && (
                    <div className="grid grid-rows-2 gap-1">
                      <div className="relative overflow-hidden">
                        <img src={story.extraImages[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      {story.extraImages.length > 1 ? (
                        <div className="relative overflow-hidden">
                          <img src={story.extraImages[1]} alt="" className="w-full h-full object-cover" />
                          {story.extraImages.length > 2 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-lg">
                              +{story.extraImages.length - 1}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-slate-200 flex items-center justify-center text-slate-400">
                          <Plus size={20} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {story.video_url && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/40">
                      <Play size={20} fill="white" />
                    </div>
                  </div>
                )}
              </div>

                <div className="p-4 md:px-6 md:py-4 border-t border-slate-50 flex items-center justify-between">
                  <button className="flex items-center gap-2 text-slate-400 hover:text-navy transition-colors group/share">
                    <Share2 size={16} className="group-hover/share:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Share Story</span>
                  </button>
                  <Link href={`/stories/${story.slug || story.id}`} className="text-navy font-bold text-[10px] uppercase tracking-widest flex items-center hover:text-primary transition-all gap-1">
                    <span>Explore</span> 
                    <ArrowRight size={12} />
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
