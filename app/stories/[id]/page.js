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

  return (
    <main className="min-h-screen bg-white font-body">
      <Header />
      
      {/* Immersive Hero Section */}
      <section className="relative min-h-[80vh] flex items-center pt-32 pb-20 bg-navy overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/90 to-white" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <Link 
            href="/stories" 
            className="inline-flex items-center space-x-2 text-white/60 hover:text-primary transition-colors mb-12 text-xs font-bold uppercase tracking-[0.2em]"
          >
            <ChevronLeft size={16} />
            <span>Success Narrative</span>
          </Link>

          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center space-x-3 mb-8">
                <span className="px-5 py-1.5 bg-primary/20 backdrop-blur-md text-primary text-[10px] font-bold uppercase tracking-[0.2em] rounded-full border border-primary/20">
                  {story.category}
                </span>
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">
                  {new Date(story.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>
              
              <h1 className="text-5xl md:text-8xl font-bold text-white mb-10 leading-[1.05] tracking-tight font-display">
                {story.title}
              </h1>
              
              <p className="text-2xl text-blue-100/60 leading-relaxed mb-12 max-w-2xl font-medium">
                {story.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                    PI
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-0.5">Author</p>
                    <p className="text-white font-bold text-sm">{story.author || "Prayog India Labs"}</p>
                  </div>
                </div>
                <div className="h-10 w-px bg-white/10 hidden sm:block" />
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-white/60 font-bold text-xs">
                    <Clock size={16} className="text-primary" /> 8 min read
                  </div>
                  <div className="flex items-center gap-2 text-white/60 font-bold text-xs">
                    <TrendingUp size={16} className="text-primary" /> Verified Case
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dynamic Content Sections */}
      <section className="pb-32 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-20 -mt-10 relative z-20">
            {story.content && story.content.length > 0 ? (
              story.content.map((section, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="w-full"
                >
                  {section.type === 'text' && (
                    <div className="prose prose-slate prose-lg max-w-none">
                      <h2 className="text-3xl font-bold text-slate-900 mb-8 font-display">{section.title}</h2>
                      <div className="text-slate-600 leading-[1.8] text-lg font-medium whitespace-pre-wrap">
                        {section.value}
                      </div>
                    </div>
                  )}

                  {section.type === 'image' && (
                    <figure className="my-16">
                      <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100">
                        <img src={section.value} className="w-full h-auto" alt={section.caption || "Story Image"} />
                      </div>
                      {section.caption && (
                        <figcaption className="mt-6 text-center text-slate-400 text-xs font-bold uppercase tracking-widest italic">
                          &mdash; {section.caption}
                        </figcaption>
                      )}
                    </figure>
                  )}

                  {section.type === 'quote' && (
                    <div className="my-20 relative p-12 bg-slate-50 rounded-[3rem] border border-slate-100 overflow-hidden">
                      <Quote className="absolute -top-4 -left-4 text-slate-200" size={120} />
                      <div className="relative z-10">
                        <blockquote className="text-3xl md:text-4xl font-bold text-navy leading-tight mb-8 font-display italic">
                          "{section.value}"
                        </blockquote>
                        {section.author && (
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-px bg-primary" />
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{section.author}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {section.type === 'video' && (
                    <div className="my-16 rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 bg-black aspect-video relative group">
                      <iframe 
                        src={section.value.replace("watch?v=", "embed/")} 
                        className="w-full h-full"
                        allowFullScreen
                      />
                    </div>
                  )}

                  {section.type === 'gallery' && (
                    <div className="my-16 grid grid-cols-2 gap-6">
                      {section.value.map((url, gIdx) => (
                        <div key={gIdx} className={`rounded-3xl overflow-hidden shadow-xl border border-slate-100 ${gIdx % 3 === 0 ? 'col-span-2 aspect-[21/9]' : 'aspect-square'}`}>
                          <img src={url} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt="Gallery item" />
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[3rem]">
                <Layout size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Story development in progress...</p>
              </div>
            )}
          </div>

          {/* Social Interaction & Navigation */}
          <div className="mt-32 pt-16 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-navy text-white flex items-center justify-center font-bold text-lg border-4 border-slate-50">
                PI
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Published By</p>
                <p className="text-lg font-bold text-slate-900 font-display">Prayog India Communications</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <button className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-slate-50 text-slate-900 rounded-2xl font-bold text-xs hover:bg-slate-100 transition-all uppercase tracking-widest border border-slate-200">
                <Share2 size={16} /> Share Story
              </button>
              <Link href="/stories" className="flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-4 bg-navy text-white rounded-2xl font-bold text-xs hover:bg-black transition-all uppercase tracking-widest shadow-2xl shadow-navy/20">
                <span>View More</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
