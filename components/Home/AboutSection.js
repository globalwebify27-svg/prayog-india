"use client";

import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutSection() {
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
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
              <img src="/assets/indian-hero.png" alt="Indian Students in Lab" className="w-full h-auto hover:scale-105 transition-transform duration-700" />
            </div>
            {/* Experience Badge */}
            <div className="absolute -bottom-6 -right-6 md:bottom-10 md:-right-10 bg-primary p-6 md:p-8 rounded-2xl shadow-xl z-20 animate-bounce-slow">
              <span className="block text-4xl md:text-5xl font-heading font-black text-navy">10+</span>
              <span className="block text-xs md:text-sm font-bold text-navy uppercase tracking-wider">Years of Excellence</span>
            </div>
            {/* Decorative Element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-navy/5 rounded-full blur-3xl -z-10"></div>
          </motion.div>

          {/* Text Side */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2"
          >
            <h4 className="text-navy font-bold uppercase tracking-widest text-[10px] md:text-xs mb-3">PRAYOG INDIA ROBOTICS PVT. LTD.</h4>
            <h2 className="text-2xl md:text-5xl font-heading font-black text-slate-900 mb-6 leading-tight">
              Bridging the Gap Between <span className="text-navy">Theory & Practice</span>
            </h2>
            <p className="text-slate-600 mb-8 leading-relaxed text-sm md:text-lg font-medium">
              At Prayog India, we believe that true learning happens through experimentation. 
              Our state-of-the-art laboratories and industry-expert mentors provide a fertile 
              ground for students to explore, build, and innovate in the world of robotics.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-10">
              {[
                "Certified Expert Mentors",
                "Hands-on Project Training",
                "Latest Industrial Equipment",
                "Global Recognition & Support",
                "Internship Opportunities",
                "Active Placement Support"
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-2 md:space-x-3 text-slate-700 font-bold text-[13px] md:text-base">
                  <CheckCircle2 className="text-navy w-4 h-4 md:w-5 md:h-5 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>


            <button className="bg-navy text-white px-8 py-4 rounded-xl font-heading font-bold hover:bg-navy/90 hover:shadow-xl transition-all duration-300">
              Learn More About Us
            </button>
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
