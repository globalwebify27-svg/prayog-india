"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";

export default function StudentLife() {
  return (
    <section className="py-10 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Video Side */}
          <div 
            onClick={() => alert("Launching Student Testimonial Video...")}
            className="relative group cursor-pointer"
          >
            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl relative">
              <img src="/assets/hero-indian-2.png" alt="Video Testimonial" className="w-full h-auto aspect-video object-cover" />
              <div className="absolute inset-0 bg-navy/20 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-navy shadow-2xl group-hover:scale-110 transition-transform">
                  <Play size={32} fill="currentColor" />
                </div>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-2xl font-heading font-bold text-slate-900 mb-2">Student Testimonial Video</h3>
              <p className="text-slate-500">Hear directly from our students about their learning journey and breakthroughs.</p>
            </div>
          </div>

          {/* Activity Side */}
          <div>
            <div className="inline-flex items-center space-x-2 text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-4">
              <span className="w-8 h-px bg-primary"></span>
              <span>Life at Prayog</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-black text-slate-900 mb-6 leading-tight">
              From Classroom Theories to <span className="text-navy">Industrial Reality</span>
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-10 max-w-xl">
              Witness the daily hustle of our innovators. From brainstorming complex algorithms in our R&D labs to deploying real-world hardware, our students live and breathe technical excellence.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden h-48 shadow-lg">
                  <img src="/assets/m1.png" alt="Activity 1" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-2xl overflow-hidden h-64 shadow-lg">
                  <img src="/assets/m3.png" alt="Activity 2" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="rounded-2xl overflow-hidden h-64 shadow-lg">
                  <img src="/assets/m2.png" alt="Activity 3" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-2xl overflow-hidden h-48 shadow-lg">
                  <img src="/assets/m5.png" alt="Activity 4" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
