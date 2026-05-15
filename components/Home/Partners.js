"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Partners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPartners() {
      try {
        const res = await fetch("/api/placements/partners");
        const data = await res.json();
        setPartners(data);
      } catch (err) {
        console.error("Failed to fetch partners:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPartners();
  }, []);

  return (
    <section className="py-12 bg-slate-50 border-y border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-10">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Our Students Placed At & Industry Partners</p>
        </div>
        
        <div className="relative flex overflow-hidden group">
          {!loading && partners.length > 0 && (
            <motion.div 
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
              className="flex items-center space-x-12 md:space-x-24 whitespace-nowrap"
            >
              {[...partners, ...partners].map((partner, i) => (
                <div key={i} className="flex-shrink-0 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer">
                  <img src={partner.logo_url || partner.logo} alt={partner.name} className="h-6 md:h-8 w-auto object-contain" />
                </div>
              ))}
            </motion.div>
          )}
          
          {loading && (
             <div className="flex items-center space-x-12 animate-pulse">
               {[1,2,3,4,5,6].map(i => <div key={i} className="h-8 w-24 bg-slate-200 rounded" />)}
             </div>
          )}
          
          {/* Edge Fades */}
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-slate-50 to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-slate-50 to-transparent z-10" />
        </div>
      </div>
    </section>
  );
}
