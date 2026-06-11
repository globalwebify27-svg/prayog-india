"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function WorkshopMarquee() {
  const [images, setImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  useEffect(() => {
    fetch('/api/gallery?category=Workshop Gallery')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setImages(data.map(img => img.image_url));
        }
      })
      .catch(err => console.error("Failed to fetch gallery for marquee:", err));
  }, []);

  const displayImages = images.length > 0 ? images : [
    "/assets/m1.png", "/assets/m2.png", "/assets/m3.png", "/assets/m4.png", "/assets/m5.png",
    "/assets/indian-hero.png", "/assets/hero-indian-2.png", "/assets/course1.png"
  ];

  // Keyboard navigation
  useEffect(() => {
    if (selectedImageIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        setSelectedImageIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
      } else if (e.key === "ArrowRight") {
        setSelectedImageIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
      } else if (e.key === "Escape") {
        setSelectedImageIndex(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, displayImages.length]);

  return (
    <section id="gallery" className="py-10 md:py-20 bg-white overflow-hidden">

      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-12 text-center">
        <h4 className="text-navy font-bold uppercase tracking-widest text-xs mb-2">Our Moments</h4>
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900">Workshop Gallery</h2>
        <p className="text-slate-500 mt-4 max-w-2xl mx-auto">2000+ images of innovation, learning, and success across 100+ workshops.</p>
      </div>

      <div className="flex flex-col space-y-[5px]">

        {/* First Strip - Moves Left */}
        <div className="marquee-container relative flex overflow-hidden">
          <div className="marquee-content flex animate-marquee-left">
            {[...displayImages, ...displayImages].map((src, i) => (
              <div
                key={i}
                onClick={() => setSelectedImageIndex(i % displayImages.length)}
                className="flex-shrink-0 w-64 h-52 md:w-96 md:h-80 overflow-hidden pr-[5px] cursor-pointer"
              >
                <img src={src} alt="Workshop" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
              </div>
            ))}

          </div>
        </div>

        {/* Second Strip - Moves Right */}
        <div className="marquee-container relative flex overflow-hidden">
          <div className="marquee-content flex animate-marquee-right">
            {[...[...displayImages].reverse(), ...displayImages].map((src, i) => {
              // Map reverse indices back correctly to match displayImages index
              const reversedArray = [...displayImages].reverse();
              const originalItem = reversedArray[i % reversedArray.length];
              const originalIndex = displayImages.indexOf(originalItem);

              return (
                <div
                  key={i}
                  onClick={() => setSelectedImageIndex(originalIndex !== -1 ? originalIndex : 0)}
                  className="flex-shrink-0 w-64 h-52 md:w-96 md:h-80 overflow-hidden pr-[5px] cursor-pointer"
                >
                  <img src={src} alt="Workshop" className="w-full h-full object-fit hover:scale-110 transition-transform duration-500" />
                </div>
              );
            })}

          </div>
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 select-none"
          onClick={() => setSelectedImageIndex(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedImageIndex(null)}
            className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors p-2 bg-white/10 hover:bg-white/20 rounded-full z-[110]"
          >
            <X size={24} />
          </button>

          {/* Left Navigation */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImageIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
            }}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors p-3 bg-white/10 hover:bg-white/20 rounded-full z-[110]"
          >
            <ChevronLeft size={30} />
          </button>

          {/* Right Navigation */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImageIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors p-3 bg-white/10 hover:bg-white/20 rounded-full z-[110]"
          >
            <ChevronRight size={30} />
          </button>

          {/* Image Container */}
          <div
            className="relative max-w-5xl max-h-[85vh] w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={displayImages[selectedImageIndex]}
              alt="Workshop Full Screen"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl transition-all duration-300"
            />

            {/* Page indicator */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-xs font-mono">
              {selectedImageIndex + 1} / {displayImages.length}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-left {
          animation: marquee-left 40s linear infinite;
        }
        .animate-marquee-right {
          animation: marquee-right 40s linear infinite;
        }
        .marquee-container:hover .marquee-content {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
