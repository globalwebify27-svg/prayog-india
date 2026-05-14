"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, Calendar, ArrowRight, Star } from "lucide-react";
import Link from "next/link";

export default function ShortTermActivities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const res = await fetch("/api/promos", { cache: 'no-store' });
        const data = await res.json();
        setActivities(data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPromos();
  }, []);

  if (loading) return null;
  if (activities.length === 0) return null;

  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-4">
            <span className="w-8 h-px bg-primary"></span>
            <span>Current Highlights</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-black text-slate-900 mb-6">
            Seasonal <span className="text-navy">Programs</span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-sm font-medium">
            Special short-term activities and workshops designed for school students. Join now before the sessions conclude!
          </p>
        </div>

        <div className="grid lg:grid-cols-1 gap-12">
          {activities.map((activity) => (
            <motion.div 
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[3rem] overflow-hidden shadow-2xl shadow-navy/5 border border-slate-100 flex flex-col md:flex-row"
            >
              <div className="md:w-1/2 h-80 md:h-auto relative overflow-hidden">
                <img 
                  src={activity.image} 
                  alt={activity.title} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute top-8 left-8 bg-primary text-navy font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">
                  {activity.tag}
                </div>
              </div>
              
              <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
                <div className="flex items-center space-x-2 text-navy/40 font-black text-[10px] uppercase tracking-widest mb-6">
                  <Calendar size={14} className="text-primary" />
                  <span>{activity.date_text}</span>
                </div>
                
                <h3 className="text-3xl md:text-4xl font-heading font-black text-slate-900 mb-4">{activity.title}</h3>
                <p className="text-navy font-bold text-sm mb-6">{activity.subtitle}</p>
                <p className="text-slate-500 text-sm leading-relaxed mb-10">{activity.description}</p>
                
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <Link href={activity.registration_link} className="w-full sm:w-auto bg-navy text-white px-10 py-5 rounded-2xl font-heading font-bold text-sm uppercase tracking-widest shadow-xl shadow-navy/20 hover:scale-105 transition-all flex items-center justify-center gap-3">
                    <span>Enroll Now</span>
                    <Zap size={18} className="text-primary" />
                  </Link>
                  <div className="text-center sm:text-left">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Registration Fee</p>
                    <p className="text-2xl font-heading font-black text-navy">{activity.price}</p>
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
