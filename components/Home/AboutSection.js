"use client";

import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSettings } from "../SettingsContext";

export default function AboutSection() {
  const settings = useSettings();
  
  const title = settings?.training_title || "Master Robotics with 1:1 Expert Training";
  const description = settings?.training_description || "Experience the future of learning with dedicated mentorship, tailored curricula, and hands-on industrial projects—designed exclusively for your pace and professional goals.";
  const image = settings?.training_image || "/assets/one_on_one_robotics_training.png";
  const features = settings?.training_features ? settings.training_features.split(/\r?\n|,/).map(f => f.trim()).filter(f => f) : [
    "Individual Expert Attention",
    "Customized Learning Paths",
    "Live Industrial Projects",
    "Flexible Session Scheduling",
    "Direct Industry Exposure",
    "Personalized Performance Tracking"
  ];

  return (
    <section className="py-10 md:py-20 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Image Side */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
              <img src={image} alt="1:1 Robotics Mentorship" className="w-full h-auto hover:scale-105 transition-transform duration-700" />
            </div>
            {/* Experience Badge */}
            <div className="absolute -bottom-6 -right-6 md:bottom-10 md:-right-10 bg-primary p-6 md:p-8 rounded-3xl shadow-2xl z-20 animate-bounce-slow border-4 border-navy">
              <span className="block text-4xl md:text-5xl font-heading font-black text-navy leading-none">1:1</span>
              <span className="block text-[10px] md:text-[11px] font-bold text-navy uppercase tracking-[0.2em] mt-2">Personalized<br/>Mentorship</span>
            </div>
            {/* Decorative Element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 rounded-full blur-3xl -z-10"></div>
          </motion.div>

          {/* Text Side */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-navy/5 rounded-full mb-6">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-bold text-navy uppercase tracking-widest">Premium Learning Experience</span>
            </div>
            <h2 className="text-3xl md:text-6xl font-heading font-black text-slate-900 mb-8 leading-[1.1] tracking-tight">
              {title.split('1:1').map((part, index, array) => (
                <span key={index}>
                  {part}
                  {index < array.length - 1 && <span className="text-navy italic">1:1</span>}
                </span>
              ))}
            </h2>
            <p className="text-slate-600 mb-10 leading-relaxed text-sm md:text-xl font-medium">
              {description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8 mb-12">
              {features.map((item, i) => (
                <div key={i} className="flex items-center space-x-3 text-slate-800 font-bold text-sm md:text-base group">
                  <div className="w-6 h-6 rounded-lg bg-navy/5 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <CheckCircle2 className="text-navy w-4 h-4 shrink-0" />
                  </div>
                  <span className="tracking-tight">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/courses" className="w-full sm:w-auto bg-navy text-white px-10 py-5 rounded-2xl font-heading font-bold hover:bg-black hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-center">
                Explore 1:1 Programs
              </Link>
              <Link href="/about" className="w-full sm:w-auto text-navy font-bold text-sm uppercase tracking-widest border-b-2 border-primary pb-1 hover:text-primary transition-all">
                Why Choose 1:1?
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
