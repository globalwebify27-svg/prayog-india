"use client";

import { useState, useEffect } from "react";

export default function WorkshopMarquee() {
  const [images, setImages] = useState([]);

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
              <div key={i} className="flex-shrink-0 w-64 h-40 md:w-96 md:h-60 overflow-hidden pr-[5px]">
                <img src={src} alt="Workshop" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
              </div>
            ))}

          </div>
        </div>

        {/* Second Strip - Moves Right */}
        <div className="marquee-container relative flex overflow-hidden">
          <div className="marquee-content flex animate-marquee-right">
            {[...[...displayImages].reverse(), ...displayImages].map((src, i) => (
              <div key={i} className="flex-shrink-0 w-64 h-40 md:w-96 md:h-60 overflow-hidden pr-[5px]">
                <img src={src} alt="Workshop" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
              </div>
            ))}

          </div>
        </div>

      </div>


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
