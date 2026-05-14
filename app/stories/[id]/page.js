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
  PlayCircle,
  Quote,
  Image as ImageIcon,
  Layout,
  Clock,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function StoryDetailPage() {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await fetch(`/api/stories/${id}`);
        const data = await res.json();
        setStory(data);
      } catch (error) {
        console.error("Failed to fetch story:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStory();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-navy border-t-primary rounded-full animate-spin" />
    </div>
  );

  if (!story) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <h1 className="text-2xl font-bold text-slate-900 font-display">Success Story Not Found</h1>
      <Link href="/stories" className="text-navy font-bold hover:underline font-display">&larr; Back to Stories</Link>
    </div>
  );

  const contentBlocks = story.content || [];
  const textBlocks = contentBlocks.filter(b => ['text', 'paragraph', 'quote', 'video'].includes(b.type));
  const mediaBlocks = contentBlocks.filter(b => ['image', 'gallery'].includes(b.type));

  return (
    <main className="min-h-screen bg-white font-body">
      <Header />
      
      {/* Immersive Hero Section */}
      <section className="relative min-h-[60vh] flex items-center pt-32 pb-20 bg-navy overflow-hidden">
        <div className="absolute inset-0 z-0">
          {story.banner_image ? (
            <img 
              src={story.banner_image} 
              className="w-full h-full object-cover opacity-40"
              alt={story.title} 
            />
          ) : story.thumbnail && (
            <img 
              src={story.thumbnail} 
              className="w-full h-full object-cover opacity-40 blur-sm scale-110"
              alt={story.title} 
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-navy/90 via-navy/95 to-white" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <Link 
            href="/stories" 
            className="inline-flex items-center space-x-2 text-white/60 hover:text-primary transition-colors mb-8 text-[10px] font-bold uppercase tracking-[0.3em]"
          >
            <ChevronLeft size={14} />
            <span>Success Narratives Feed</span>
          </Link>

          <div className="max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <span className="px-5 py-1.5 bg-primary text-navy text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
                  {story.category}
                </span>
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">
                  {new Date(story.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-7xl font-black text-white mb-8 leading-[1.1] tracking-tight font-display">
                {story.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 text-white font-bold text-xs">
                    PI
                  </div>
                  <div>
                    <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest mb-0.5">Primary Investigator</p>
                    <p className="text-white font-bold text-sm">{story.author || "Prayog India Labs"}</p>
                  </div>
                </div>
                <div className="h-8 w-px bg-white/10 hidden sm:block" />
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-white/60 font-bold text-[10px] uppercase tracking-widest">
                    <Clock size={14} className="text-primary" /> 8 min read
                  </div>
                  <div className="flex items-center gap-2 text-white/60 font-bold text-[10px] uppercase tracking-widest">
                    <TrendingUp size={14} className="text-primary" /> Verified Case
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Balanced 60/40 Content Layout */}
      <section className="pb-32 bg-white pt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-16 items-start">
            
            {/* 60% Content Side (Text, Quotes, Videos) */}
            <div className="lg:col-span-6 space-y-16">
              {textBlocks.length > 0 ? (
                textBlocks.map((block, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="w-full"
                  >
                    {(block.type === 'text' || block.type === 'paragraph') && (
                      <div className="prose prose-slate prose-lg max-w-none">
                        {block.title && <h2 className="text-3xl font-black text-slate-900 mb-8 font-display">{block.title}</h2>}
                        <div className="text-slate-600 leading-[1.8] text-lg font-medium whitespace-pre-wrap italic">
                          {block.value || block.content}
                        </div>
                      </div>
                    )}

                    {block.type === 'quote' && (
                      <div className="my-10 relative p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 overflow-hidden">
                        <Quote className="absolute -top-4 -left-4 text-slate-200" size={100} />
                        <div className="relative z-10">
                          <blockquote className="text-2xl md:text-3xl font-black text-navy leading-tight mb-6 font-display italic">
                            "{block.value}"
                          </blockquote>
                          {block.author && (
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-px bg-primary" />
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{block.author}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {block.type === 'video' && (
                      <div className="my-10 rounded-3xl overflow-hidden shadow-2xl border border-slate-100 bg-black aspect-video relative group">
                        <iframe 
                          src={block.value.replace("watch?v=", "embed/")} 
                          className="w-full h-full"
                          allowFullScreen
                        />
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[2.5rem]">
                   <FileText size={48} className="mx-auto text-slate-100 mb-4" />
                   <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Narrative analysis in progress...</p>
                </div>
              )}

              {/* Engagement Box at the end of text */}
              <div className="p-10 bg-navy rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl shadow-navy/20">
                <Target className="absolute -bottom-4 -right-4 text-primary opacity-10" size={100} />
                <h3 className="text-xl font-black mb-4 font-display">Conclusion & Impact</h3>
                <p className="text-blue-100/60 leading-relaxed font-medium mb-8">
                  This narrative serves as a testament to the collaborative excellence between Prayog India and our industrial partners. We continue to push the boundaries of robotics and automation.
                </p>
                <button className="flex items-center gap-2 bg-primary text-navy px-8 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-white transition-all">
                  <Share2 size={14} /> Share Narrative
                </button>
              </div>
            </div>

            {/* 40% Visual Side (Images, Galleries) - STICKY */}
            <div className="lg:col-span-4 space-y-10 lg:sticky lg:top-32">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2 mb-6 ml-1">
                <ImageIcon size={14} className="text-navy" /> Visual Documentation
              </h3>
              
              {mediaBlocks.length > 0 ? (
                mediaBlocks.map((block, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="space-y-4"
                  >
                    {block.type === 'image' && (
                      <figure className="group">
                        <div className="rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-100 bg-slate-50">
                          <img src={block.value} className="w-full h-auto group-hover:scale-105 transition-transform duration-1000" alt={block.caption || "Case Study Visual"} />
                        </div>
                        {block.caption && (
                          <figcaption className="mt-4 text-slate-400 text-[9px] font-bold uppercase tracking-widest text-center px-6">
                            &mdash; {block.caption}
                          </figcaption>
                        )}
                      </figure>
                    )}

                    {block.type === 'gallery' && (
                      <div className="grid grid-cols-2 gap-3">
                        {block.value.map((url, gIdx) => (
                          <div key={gIdx} className={`rounded-2xl overflow-hidden shadow-md border border-slate-100 group ${gIdx === 0 ? 'col-span-2 aspect-video' : 'aspect-square'}`}>
                            <img src={url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Gallery detail" />
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="aspect-[4/5] rounded-[2.5rem] bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-slate-200">
                   <ImageIcon size={48} className="mb-4" />
                   <span className="text-[10px] font-bold uppercase tracking-widest">Visual Assets Loading</span>
                </div>
              )}

              {/* Sidebar Action */}
              <div className="p-8 border border-slate-100 rounded-[2.5rem] bg-white shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-6 border-b border-slate-50">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Project Status</span>
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Complete
                  </span>
                </div>
                <Link href="/stories" className="w-full flex items-center justify-center gap-3 py-4 bg-navy text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-navy/10">
                  <span>Explore All Narratives</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
