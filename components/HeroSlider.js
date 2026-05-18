"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, ArrowRight, X, Tv } from "lucide-react";
import Link from "next/link";

const slides = [
  {
    id: "01",
    title: "Revolutionizing Robotics",
    subtitle: "NEXT-GEN AUTOMATION",
    description: "Experience the pinnacle of industrial robotics with hands-on training on state-of-the-art FANUC & KUKA systems.",
    image: "/assets/hero-indian-2.png",
    accent: "#FFC107"
  },
  {
    id: "02",
    title: "Master AI Intelligence",
    subtitle: "COGNITIVE SYSTEMS",
    description: "Bridge the gap between hardware and intelligence. Build advanced neural networks for autonomous systems.",
    image: "/assets/indian-hero.png",
    accent: "#FFC107"
  },
  {
    id: "03",
    title: "STEM For Future Leaders",
    subtitle: "EARLY INNOVATION",
    description: "Nurturing the next generation of engineers with specialized modules in drone tech and embedded electronics.",
    image: "/assets/about-img.png",
    accent: "#FFC107"
  }
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [showIntroVideo, setShowIntroVideo] = useState(false);

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-auto lg:h-screen min-h-[600px] overflow-hidden bg-navy">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy to-[#02162b]"></div>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '100px 100px' }}></div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="relative lg:absolute inset-0 w-full h-full flex flex-col lg:flex-row items-center pt-24 pb-32 lg:py-0"
        >
          {/* Big Vertical ID - Subtle */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 0.05 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="absolute left-10 bottom-10 hidden xl:block text-[200px] font-heading font-black text-white leading-none pointer-events-none select-none"
          >
            {slides[current].id}
          </motion.div>

          {/* Left Content Side */}
          <div className="relative z-10 w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-10 lg:pl-20 xl:pl-32 mb-12 lg:mb-0">
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h4 className="flex items-center space-x-3 text-[#FFC107] text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-4">
                <span className="w-8 h-[2px] bg-[#FFC107]"></span>
                <span>{slides[current].subtitle}</span>
              </h4>
              <h1 className="text-2xl md:text-5xl lg:text-6xl font-heading font-black text-white leading-tight mb-6">
                {slides[current].title}
              </h1>
              <p className="text-blue-100/60 text-xs md:text-lg max-w-md mb-8 md:mb-10 leading-relaxed font-medium">
                {slides[current].description}
              </p>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link href="/courses" className="w-full sm:w-auto group relative bg-[#FFC107] text-[#01254d] px-8 py-4 rounded-xl font-heading font-bold text-sm uppercase tracking-widest overflow-hidden transition-all shadow-lg shadow-[#FFC107]/20 hover:scale-105 active:scale-95 text-center">
                  <span className="relative z-10">Explore Track</span>
                  <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </Link>
                
                <button 
                  onClick={() => setShowIntroVideo(true)}
                  className="flex items-center space-x-4 group text-white hover:text-[#FFC107] transition-colors pl-2 sm:pl-0"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#FFC107] transition-all bg-white/5">
                    <Play size={16} fill="currentColor" />
                  </div>
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Watch Intro</span>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Image Side */}
          <div className="relative z-10 w-full lg:w-1/2 flex items-center justify-center px-6 md:px-12">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="relative w-full max-w-lg aspect-[4/3] lg:aspect-auto lg:h-[70%]"
            >
              <div className="absolute -inset-2 border border-white/5 rounded-[1.5rem] md:rounded-[2rem] -z-10"></div>
              <div className="w-full h-full rounded-[1.2rem] md:rounded-[1.5rem] overflow-hidden shadow-2xl">
                <img 
                  src={slides[current].image} 
                  alt={slides[current].title} 
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* Floating Badge - Responsive */}
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute -bottom-4 -left-4 md:-bottom-8 md:-left-8 bg-white p-3 md:p-6 rounded-xl md:rounded-2xl shadow-xl z-20 border-l-4 border-[#FFC107]"
              >
                <div className="text-[#01254d] text-[8px] md:text-[10px] font-bold uppercase tracking-widest mb-1">Hands-on Learning</div>
                <div className="text-slate-900 text-sm md:text-xl font-heading font-bold">Industrial Lab</div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls - Scaled Down and Positioned Carefully */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-auto lg:right-10 z-30 flex items-center space-x-3 bg-navy/40 backdrop-blur-md p-2 rounded-full lg:bg-transparent lg:p-0 lg:rounded-none">
        <div className="hidden sm:flex space-x-1.5 mr-6">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1 transition-all duration-500 rounded-full ${
                current === i ? "w-8 bg-[#FFC107]" : "w-3 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
        <button 
          onClick={prevSlide}
          className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        <button 
          onClick={nextSlide}
          className="w-10 h-10 rounded-full bg-[#FFC107] text-[#01254d] flex items-center justify-center hover:bg-white transition-all shadow-lg shadow-[#FFC107]/10"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Video Lightbox Modal */}
      <AnimatePresence>
        {showIntroVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#01254d]/90 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-10"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#02162b] border border-white/10 rounded-3xl max-w-5xl w-full relative overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Tv className="w-5 h-5 text-[#FFC107]" />
                  <span className="text-xs font-bold text-slate-350 uppercase tracking-widest">Corporate Video Spotlight</span>
                </div>
                <button
                  onClick={() => setShowIntroVideo(false)}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors animate-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Widescreen Chassis */}
              <div className="aspect-video w-full bg-black">
                <iframe 
                  className="w-full h-full" 
                  src="https://www.youtube.com/embed/kRaxlc2Fblk?autoplay=1" 
                  title="Prayog India Corporate Intro Video" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin" 
                  allowFullScreen
                />
              </div>

              {/* Modal Footer Info */}
              <div className="p-6 bg-[#011429] flex items-center justify-between text-xs font-semibold text-slate-400 font-mono">
                <span>PRAYOG INDIA ROBOTICS PVT. LTD.</span>
                <span className="text-[#FFC107] uppercase">STATUS: STREAMING ACTIVE</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
