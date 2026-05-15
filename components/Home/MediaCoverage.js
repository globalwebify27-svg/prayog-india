"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Newspaper, 
  Tv, 
  ExternalLink, 
  ArrowRight,
  Globe,
  Award,
  ChevronRight,
  ChevronLeft,
  X,
  PlayCircle
} from "lucide-react";
import Link from "next/link";

export default function MediaCoverage() {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    async function fetchMedia() {
      try {
        const res = await fetch("/api/gallery?category=Media Coverage");
        const data = await res.json();
        setMediaItems(data); 
      } catch (err) {
        console.error("Failed to fetch media coverage:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMedia();
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth / 2 
        : scrollLeft + clientWidth / 2;
      
      scrollRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  const openLightbox = (index) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);
  
  const nextImage = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev + 1) % mediaItems.length);
  };
  
  const prevImage = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  if (!loading && mediaItems.length === 0) return null;

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50/50 -skew-x-12 translate-x-1/2 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center space-x-3 mb-4"
            >
              <div className="h-[1px] w-8 bg-primary" />
              <span className="text-primary font-black text-[10px] uppercase tracking-[0.2em]">Institutional Influence</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-semibold text-navy leading-tight tracking-tight"
            >
              In The <span className="text-primary italic">Spotlight</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-slate-500 text-lg mt-4 leading-relaxed"
            >
              Exploring Prayog India's impact on technical education through major news networks, digital publications, and broadcast media.
            </motion.p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
               <button 
                onClick={() => scroll('left')}
                className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-navy flex items-center justify-center hover:bg-navy hover:text-white transition-all shadow-sm"
               >
                 <ChevronLeft size={20} />
               </button>
               <button 
                onClick={() => scroll('right')}
                className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-navy flex items-center justify-center hover:bg-navy hover:text-white transition-all shadow-sm"
               >
                 <ChevronRight size={20} />
               </button>
            </div>
            <Link 
              href="/gallery?category=Media Coverage"
              className="group flex items-center space-x-3 text-navy font-bold text-xs uppercase tracking-widest bg-slate-50 px-8 py-4 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-navy/5 transition-all"
            >
              <span>Full Archive</span>
              <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center group-hover:bg-primary group-hover:text-navy transition-colors">
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          </div>
        </div>

        {/* Carousel Container */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-8 pb-12 no-scrollbar snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse bg-slate-100 rounded-[2.5rem] min-w-[300px] h-[450px] shrink-0" />
            ))
          ) : (
            mediaItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={() => openLightbox(i)}
                className="group relative min-w-[320px] md:min-w-[380px] h-[480px] rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-2xl shadow-navy/10 border border-slate-100 cursor-pointer snap-start shrink-0"
              >
                <img 
                  src={item.image_url} 
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 group-hover:opacity-40 transition-all duration-700"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent opacity-90" />
                
                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="flex items-center justify-between mb-4">
                    <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center space-x-2">
                      {item.title.toLowerCase().includes('tv') ? <Tv size={12} className="text-primary" /> : <Newspaper size={12} className="text-primary" />}
                      <span className="text-[9px] font-black text-white uppercase tracking-wider">{item.location || 'Media Press'}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-6 leading-tight group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  
                  <div className="flex items-center justify-between border-t border-white/10 pt-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest flex items-center gap-2">
                      <Globe size={12} /> News Feature
                    </span>
                    <div className="w-10 h-10 rounded-full bg-white text-navy flex items-center justify-center hover:bg-primary transition-colors">
                      <ExternalLink size={16} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

      </div>

      {/* Lightbox / Slider Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-[100] bg-navy/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
          >
            {/* Close Button */}
            <button 
              onClick={closeLightbox}
              className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10"
            >
              <X size={32} />
            </button>

            {/* Navigation Buttons */}
            <button 
              onClick={prevImage}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-primary hover:text-navy transition-all z-20"
            >
              <ChevronLeft size={32} />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-primary hover:text-navy transition-all z-20"
            >
              <ChevronRight size={32} />
            </button>

            {/* Content Container */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="max-w-6xl w-full flex flex-col items-center relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative group w-full flex justify-center">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={selectedIndex}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    src={mediaItems[selectedIndex].image_url} 
                    alt={mediaItems[selectedIndex].title}
                    className="max-h-[70vh] w-auto object-contain rounded-3xl shadow-2xl border border-white/10"
                  />
                </AnimatePresence>
              </div>

              <div className="mt-8 text-center max-w-3xl">
                <motion.div
                  key={selectedIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="inline-flex items-center space-x-3 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
                    <Award size={14} className="text-primary" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Official Coverage</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{mediaItems[selectedIndex].title}</h2>
                  <div className="flex items-center justify-center space-x-6 text-white/40 font-bold uppercase text-[11px] tracking-widest">
                    <span className="flex items-center gap-2"><Globe size={14} className="text-primary" /> {mediaItems[selectedIndex].location || 'Media Release'}</span>
                    <span className="flex items-center gap-2"> {selectedIndex + 1} / {mediaItems.length}</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
