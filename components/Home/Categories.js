"use client";

import { Cpu, Rocket, Lightbulb, ShieldCheck, Microscope, Globe, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const categories = [
  {
    icon: <Cpu size={32} />,
    title: "Robotics Training & IoT",
    desc: "Master the art of robotics and connect the world through smart IoT devices with hands-on training."
  },
  {
    icon: <Rocket size={32} />,
    title: "Aerospace & Drones",
    desc: "Explore the world of UAVs and aerospace engineering with our specialized flight modules."
  },
  {
    icon: <Microscope size={32} />,
    title: "STEM Education",
    desc: "Academic excellence combined with practical learning methodologies for school students."
  }
];

export default function Categories() {
  return (
    <section className="py-10 md:py-16 bg-white relative overflow-hidden">
      {/* Premium Ambient Blobs */}
      <motion.div 
        animate={{ 
          x: [0, 30, 0],
          y: [0, 50, 0],
        }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div 
        animate={{ 
          x: [0, -40, 0],
          y: [0, 60, 0],
        }}
        transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
        className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] pointer-events-none"
      />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-16">
          <h4 className="text-navy font-bold uppercase tracking-widest text-[10px] md:text-xs mb-3">Our Specializations</h4>
          <h2 className="text-2xl md:text-4xl font-heading font-black text-slate-900">Explore Course Categories</h2>
          <div className="w-12 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -12 }}
              className="group p-5 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] bg-white border border-slate-100 hover:border-primary/50 hover:shadow-[0_40px_80px_-15px_rgba(255,193,7,0.15)] transition-all duration-700 relative overflow-hidden"
            >
              {/* Premium Accent Corner */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full group-hover:bg-primary/20 transition-all duration-700 blur-2xl" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 md:w-20 md:h-20 rounded-xl md:rounded-[1.5rem] bg-slate-50 flex items-center justify-center text-navy mb-4 md:mb-8 group-hover:bg-primary group-hover:text-secondary group-hover:scale-110 transition-all duration-500 shadow-sm border border-slate-100">
                  <div className="scale-75 md:scale-100">{cat.icon}</div>
                </div>
                
                <h3 className="text-sm md:text-2xl font-heading font-black text-slate-900 mb-2 md:mb-4 group-hover:text-secondary transition-colors leading-tight">
                  {cat.title}
                </h3>
                
                <p className="text-[10px] md:text-sm text-slate-500 leading-relaxed mb-6 md:mb-10 font-medium line-clamp-2 md:line-clamp-none">
                  {cat.desc}
                </p>
                
                <div className="flex items-center justify-between">
                  <Link href="/courses" className="bg-secondary text-white px-3 md:px-6 py-1.5 md:py-2 rounded-full font-bold text-[8px] md:text-[10px] uppercase tracking-widest flex items-center group/btn hover:bg-black transition-all">
                    <span className="hidden xs:inline">Learn More</span>
                    <span className="xs:hidden">More</span>
                    <ArrowRight size={10} className="ml-1.5 md:ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                  
                  <div className="text-xs md:text-lg font-black text-slate-100 uppercase tracking-tighter group-hover:text-primary/20 transition-colors">
                    0{i + 1}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
