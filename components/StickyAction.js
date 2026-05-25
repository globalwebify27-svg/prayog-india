"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Clock, X } from "lucide-react";
import Link from "next/link";

export default function StickyAction() {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00"
  });

  const [promo, setPromo] = useState(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const fetchPromo = async () => {
      try {
        const res = await fetch("/api/promos", { cache: 'no-store' });
        const data = await res.json();
        if (data && data.length > 0) {
          setPromo(data[0]);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchPromo();
  }, []);

  useEffect(() => {
    if (!promo || !promo.target_date) return;
    const targetDate = new Date(promo.target_date).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0'),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0'),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0'),
        seconds: Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0')
      });
    }, 1000);

    const handleScroll = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [promo]);

  return (
    <AnimatePresence>
      {(isVisible && promo && !isDismissed) && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-0 left-0 w-full z-[100] bg-primary shadow-[0_-10px_40px_rgba(255,193,7,0.3)] border-t border-accent"
        >
          {/* Mobile Close Button */}
          <button 
            onClick={() => setIsDismissed(true)}
            className="md:hidden absolute top-2 right-2 p-1 text-secondary/60 hover:text-secondary transition-colors z-10"
            title="Dismiss"
          >
            <X size={18} />
          </button>
          
          <div className="max-w-7xl mx-auto px-4 pt-5 pb-4 md:py-4 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 relative">
            <div className="flex items-center gap-4">
              <div className="hidden md:flex bg-secondary/10 p-2 rounded-lg">
                <Clock className="text-secondary" size={20} />
              </div>
              <p className="text-secondary font-bold text-sm md:text-base text-center md:text-left md:whitespace-nowrap">
                Limited seats left for <span className="underline decoration-2">{promo?.title || "Special Program"}</span>. Book yours now!
              </p>
            </div>

            <div className="flex items-center gap-3 md:gap-6 w-full justify-center md:justify-end">
              {/* Timer */}
              <div className="flex items-center gap-1.5 md:gap-2">
                {[
                  { val: timeLeft.days, unit: "d" },
                  { val: timeLeft.hours, unit: "h" },
                  { val: timeLeft.minutes, unit: "m" },
                  { val: timeLeft.seconds, unit: "s" }
                ].map((item, i) => (
                  <div key={i} className="flex items-baseline gap-0.5">
                    <span className="bg-white px-1.5 md:px-2 py-0.5 md:py-1 rounded text-secondary font-black text-xs md:text-base min-w-[28px] md:min-w-[32px] text-center shadow-sm">
                      {item.val}
                    </span>
                    <span className="text-secondary/60 text-[9px] md:text-[10px] font-bold uppercase">{item.unit}</span>
                  </div>
                ))}
              </div>

              <Link href={promo?.registration_link || "/register"} className="bg-secondary text-white px-4 md:px-6 py-2 md:py-2.5 rounded-full font-bold text-xs md:text-sm flex items-center gap-1.5 md:gap-2 hover:bg-black transition-colors group shadow-lg whitespace-nowrap">
                Register Now
                <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button 
                onClick={() => setIsDismissed(true)}
                className="hidden md:block p-2 text-secondary/40 hover:text-secondary transition-colors shrink-0"
                title="Dismiss"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
