"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Play, 
  ChevronRight, 
  Calendar, 
  Tag, 
  Share2, 
  MoreHorizontal,
  Plus,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SuccessNarrativesPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const res = await fetch("/api/stories");
      const data = await res.json();
      if (Array.isArray(data)) {
        const processed = data.map(story => {
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
      }
    } catch (error) {
      console.error("Failed to fetch stories:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 font-body">
      <Header />

      {/* Modern Compact Hero */}
      <section className="pt-40 pb-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <h4 className="text-navy font-bold uppercase tracking-[0.4em] text-[10px] mb-4">Institutional Impact Feed</h4>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
              Success <span className="text-navy">Narratives</span>
            </h1>
            <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-medium italic">
              "Witness the transformation through documented case studies of robotics and industrial excellence."
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grid Layout (3 Stories per Row) */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {loading ? (
              [1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-[2.5rem] h-[500px] animate-pulse border border-slate-200" />
              ))
            ) : stories.length === 0 ? (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-100 rounded-[3rem]">
                <Tag size={48} className="mx-auto text-slate-100 mb-6" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">New narratives are being documented...</p>
              </div>
            ) : stories.map((story, i) => (
              <motion.article 
                key={story.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.1 }}
                className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-2xl hover:shadow-navy/5 transition-all duration-500 flex flex-col"
              >
                {/* Header (Social Style) */}
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-navy text-white flex items-center justify-center font-bold text-xs border-2 border-slate-50 shadow-sm">
                      PI
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">{story.author || "PI Labs"}</h4>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                        <Calendar size={10} className="text-primary" />
                        {new Date(story.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      </p>
                    </div>
                  </div>
                  <button className="text-slate-200 hover:text-navy transition-colors">
                    <MoreHorizontal size={18} />
                  </button>
                </div>

                {/* Content */}
                <div className="px-6 pb-6">
                  <h2 className="text-lg font-black text-slate-900 mb-3 group-hover:text-navy transition-colors line-clamp-2 leading-tight">
                    {story.title}
                  </h2>
                  <p className="text-slate-500 text-xs leading-relaxed font-medium line-clamp-2 italic">
                    {story.excerpt}
                  </p>
                </div>

                {/* Media Grid (Facebook Style) */}
                <div 
                  className="relative aspect-square bg-slate-50 cursor-pointer overflow-hidden border-y border-slate-50"
                  onClick={() => window.location.href=`/stories/${story.slug || story.id}`}
                >
                  <div className={`grid h-full w-full gap-0.5 ${story.extraImages.length > 0 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    <div className={`relative overflow-hidden ${story.extraImages.length > 0 ? 'row-span-2' : ''}`}>
                      <img src={story.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                    </div>
                    {story.extraImages.length > 0 && (
                      <div className="grid grid-rows-2 gap-0.5">
                        <div className="relative overflow-hidden">
                          <img src={story.extraImages[0]} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="relative overflow-hidden">
                          <img src={story.extraImages[1] || story.thumbnail} alt="" className="w-full h-full object-cover" />
                          {story.extraImages.length > 2 && (
                            <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm flex items-center justify-center text-white font-black text-xl">
                              +{story.extraImages.length - 1}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  {story.video_url && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                        <Play size={20} fill="white" className="ml-1" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-6 flex items-center justify-between mt-auto bg-slate-50/30">
                  <button className="flex items-center gap-2 text-slate-400 hover:text-navy transition-colors group/share">
                    <Share2 size={16} />
                    <span className="text-[9px] font-bold uppercase tracking-widest">Share</span>
                  </button>
                  <Link 
                    href={`/stories/${story.slug || story.id}`} 
                    className="flex items-center gap-2 text-navy font-bold text-[10px] uppercase tracking-widest hover:text-primary transition-all group/btn"
                  >
                    <span>Read More</span>
                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
