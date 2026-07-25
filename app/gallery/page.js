"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Maximize2, 
  ArrowUpRight,
  Camera,
  MapPin,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Film
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const galleryCategories = ["All", "Reels", "Media Coverage", "Workshop Gallery"];

const reelItems = [
  { id: "Hc1Y2xe8tP8", title: "Robotics in Action #1", category: "Reels", location: "Robotics Lab", date: "2026", image_url: "https://img.youtube.com/vi/Hc1Y2xe8tP8/hqdefault.jpg", isShort: true },
  { id: "Ychi5tA2UTY", title: "Student Project Demo #2", category: "Reels", location: "IoT Hub", date: "2026", image_url: "https://img.youtube.com/vi/Ychi5tA2UTY/hqdefault.jpg", isShort: true },
  { id: "iG8phPg9hZk", title: "Hands-on Workshop #3", category: "Reels", location: "Automation Hub", date: "2026", image_url: "https://img.youtube.com/vi/iG8phPg9hZk/hqdefault.jpg", isShort: true }
];

export default function GalleryPage() {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const catParam = urlParams.get("cat");
      if (catParam && galleryCategories.includes(catParam)) return catParam;
    }
    return "All";
  });
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function fetchGallery() {
      setLoading(true);
      try {
        if (activeFilter === "Reels") {
          const videoRes = await fetch("/api/videos?category=Reel");
          if (videoRes.ok) {
            const videoData = await videoRes.json();
            if (!ignore && Array.isArray(videoData) && videoData.length > 0) {
              const dynamicReels = videoData.map(v => ({
                id: v.video_id,
                title: v.title,
                category: "Reels",
                location: "Robotics Hub",
                date: "2026",
                image_url: v.thumbnail || `https://img.youtube.com/vi/${v.video_id}/hqdefault.jpg`,
                isShort: true
              }));
              setGalleryImages(dynamicReels);
              setLoading(false);
              return;
            }
          }
          if (!ignore) {
            setGalleryImages(reelItems);
            setLoading(false);
          }
          return;
        }

        const res = await fetch(`/api/gallery?category=${activeFilter}`);
        if (res.ok) {
          const data = await res.json();
          if (!ignore) {
            if (activeFilter === "All") {
              setGalleryImages([...reelItems, ...(Array.isArray(data) ? data : [])]);
            } else {
              setGalleryImages(Array.isArray(data) ? data : []);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch gallery:", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchGallery();

    return () => {
      ignore = true;
    };
  }, [activeFilter]);

  const filteredImages = galleryImages;

  const currentIndex = selectedItem 
    ? filteredImages.findIndex(img => img.id === selectedItem.id) 
    : -1;

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    if (filteredImages.length === 0 || currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setSelectedItem(filteredImages[prevIndex]);
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    if (filteredImages.length === 0 || currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setSelectedItem(filteredImages[nextIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedItem) return;
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "Escape") {
        setSelectedItem(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedItem, currentIndex, filteredImages]);

  return (
    <main className="min-h-screen bg-slate-50 font-body">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-semibold text-white mb-6 leading-tight tracking-tight">
              Institutional <span className="text-primary">Media & Reels Gallery</span>
            </h1>
            <p className="text-blue-100/60 text-lg max-w-2xl mx-auto leading-relaxed">
              Capturing student project reels, workshop highlights, and media coverage across our research hubs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Interface */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
            <div className="flex flex-wrap gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
              {galleryCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
                    activeFilter === cat 
                      ? "bg-navy text-white shadow-md" 
                      : "text-slate-600 hover:text-navy hover:bg-slate-50"
                  }`}
                >
                  {cat === "Reels" && <Film size={14} className="text-primary" />}
                  <span>{cat}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center space-x-5">
              <div className="text-right hidden sm:block">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-0.5">Archive density</span>
                <span className="block text-xl font-bold text-navy">2,482+ Moments</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-navy flex items-center justify-center border border-slate-200 shadow-sm">
                <Camera size={20} />
              </div>
            </div>
          </div>

          {/* Media Grid */}
          <div className="min-h-[400px]">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-navy border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-500 font-medium">No items found in this category.</p>
            </div>
          ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            <AnimatePresence mode="popLayout">
              {filteredImages.map((img, i) => (
                <motion.div
                  key={img.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3, delay: i * 0.02 }}
                  className="relative group cursor-pointer break-inside-avoid rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-all"
                  onClick={() => setSelectedItem(img)}
                >
                  <img 
                    src={img.image_url} 
                    alt={img.title}
                    onError={(e) => { if(img.isShort) e.target.src = `https://img.youtube.com/vi/${img.id}/hqdefault.jpg`; }}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-all duration-300 p-5 flex flex-col justify-between">
                    <div className="self-end">
                      {img.isShort ? (
                        <span className="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-md">Reel</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-primary text-navy rounded font-bold text-[9px] uppercase">
                          {img.category}
                        </span>
                      )}
                    </div>
                    {img.isShort && (
                      <div className="flex flex-col items-center justify-center my-auto">
                        <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                          <Play size={20} fill="currentColor" className="ml-0.5" />
                        </div>
                      </div>
                    )}
                    <div>
                      <h3 className="text-white font-bold text-sm leading-tight mb-1">
                        {img.title}
                      </h3>
                      <div className="flex items-center space-x-3 text-white/60 text-[10px] font-bold uppercase">
                        <span className="flex items-center gap-1"><MapPin size={11} /> {img.location}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          )}
          </div>
        </div>
      </section>

      {/* Lightbox / Video Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-navy/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedItem(null)}
          >
            <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
              <X size={28} />
            </button>
            <button 
              onClick={handlePrev}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/10 shadow-lg transition-all z-10"
              aria-label="Previous item"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/10 shadow-lg transition-all z-10"
              aria-label="Next item"
            >
              <ChevronRight size={24} />
            </button>
            
            <motion.div 
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`w-full flex flex-col items-center ${selectedItem.isShort ? "max-w-md" : "max-w-5xl"}`}
              onClick={e => e.stopPropagation()}
            >
              {selectedItem.isShort ? (
                <div className="w-full aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                  <iframe 
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${selectedItem.id}?autoplay=1`}
                    title={selectedItem.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <img 
                  src={selectedItem.image_url} 
                  alt={selectedItem.title}
                  className="max-h-[75vh] rounded-2xl shadow-2xl border border-white/10"
                />
              )}
              <div className="mt-6 text-center max-w-2xl">
                <span className="text-primary font-bold text-[10px] uppercase tracking-widest mb-1 block">{selectedItem.category}</span>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2 tracking-tight">{selectedItem.title}</h2>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
