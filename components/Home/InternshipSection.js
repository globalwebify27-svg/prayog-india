"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, Zap, Globe, Target } from "lucide-react";
import Link from "next/link";

export default function InternshipSection() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch("/api/homepage/internship-banner");
        const data = await res.json();
        setContent(data);
      } catch (err) {
        console.error("Failed to fetch internship banner:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, []);

  if (loading) return (
    <div className="py-20 max-w-7xl mx-auto px-4 animate-pulse">
      <div className="bg-slate-900 h-[500px] rounded-[3rem]" />
    </div>
  );

  if (!content) return null;

  const features = [
    { icon: <Zap />, title: content.feature1_title, desc: content.feature1_desc },
    { icon: <Target />, title: content.feature2_title, desc: content.feature2_desc },
    { icon: <Globe />, title: content.feature3_title, desc: content.feature3_desc },
    { icon: <Briefcase />, title: content.feature4_title, desc: content.feature4_desc }
  ];

  return (
    <section className="py-10 md:py-20 bg-white font-body">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row items-center gap-12 border border-white/5 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="lg:w-1/2 relative z-10">
            <motion.h4 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-primary font-bold uppercase tracking-widest text-[10px] md:text-xs mb-4"
            >
              {content.subtitle}
            </motion.h4>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-heading font-black text-white mb-6 leading-tight"
            >
              {content.title} <span className="text-primary italic">{content.year}</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-blue-100/60 text-sm md:text-lg mb-10 leading-relaxed font-medium"
            >
              {content.description}
            </motion.p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
              {features.map((f, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-navy transition-all duration-300">
                    {f.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs md:text-sm mb-1 group-hover:text-primary transition-colors">{f.title}</h4>
                    <p className="text-blue-100/40 text-[10px] md:text-xs leading-tight">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <Link href="/internships" className="inline-flex items-center space-x-3 bg-primary text-navy px-8 py-4 md:px-12 md:py-5 rounded-2xl font-heading font-bold text-sm md:text-base hover:bg-white hover:scale-105 transition-all shadow-2xl shadow-primary/20">
                <span>Apply for Internship</span>
                <Briefcase size={18} />
              </Link>
            </motion.div>
          </div>
          
          <div className="lg:w-1/2 relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/5 relative"
            >
              <img src={content.image_url} alt="Internship" className="w-full h-auto object-cover aspect-[4/3] grayscale hover:grayscale-0 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
            </motion.div>
            
            {/* Stats Overlay */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -top-6 -right-6 bg-white p-6 md:p-8 rounded-[2rem] shadow-2xl border border-slate-100"
            >
              <span className="block text-4xl md:text-5xl font-heading font-black text-navy leading-none mb-1">{content.stat_number}</span>
              <span className="block text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{content.stat_label}</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
