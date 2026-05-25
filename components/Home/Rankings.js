"use client";

import { Award, ShieldCheck, Star, Users } from "lucide-react";
import { motion } from "framer-motion";

const rankings = [
  {
    rank: "ISO",
    suffix: "",
    label: "Certified",
    sub: "9001:2015 Standards",
    icon: <ShieldCheck className="text-primary" size={24} />
  },
  {
    rank: "500",
    suffix: "+",
    label: "Projects Built",
    sub: "By Our Students",
    icon: <Award className="text-primary" size={24} />
  },
  {
    rank: "100",
    suffix: "%",
    label: "Hands-on Learning",
    sub: "Practical Implementation",
    icon: <ShieldCheck className="text-primary" size={24} />
  },
  {
    rank: "10",
    suffix: "K+",
    label: "Lives Impacted",
    sub: "Through STEM Workshops",
    icon: <Users className="text-primary" size={24} />
  }
];

export default function Rankings() {
  return (
    <section className="py-10 md:py-14 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {rankings.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-col items-center lg:items-start text-center lg:text-left group"
            >
              <div className="flex items-baseline font-heading mb-3">
                <span className="text-3xl md:text-5xl font-black text-navy leading-none">
                  {item.rank}
                </span>
                <span className="text-xs md:text-sm font-bold text-primary ml-0.5 uppercase">
                  {item.suffix}
                </span>
              </div>

              <div className="w-8 h-[2px] bg-primary/20 mb-4 group-hover:w-12 transition-all duration-500" />

              <div className="flex flex-col items-center lg:items-start">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="text-primary scale-90">
                    {item.icon}
                  </div>
                  <h3 className="font-heading font-black text-[10px] md:text-xs uppercase tracking-wider text-navy leading-tight">
                    {item.label}
                  </h3>
                </div>
                <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-1">
                  {item.sub}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}



