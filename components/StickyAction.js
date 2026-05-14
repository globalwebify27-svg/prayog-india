"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
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
      {(isVisible && promo) && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-0 left-0 w-full z-[100] bg-primary shadow-[0_-10px_40px_rgba(255,193,7,0.3)] border-t border-accent"
        >
          <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="hidden md:flex bg-secondary/10 p-2 rounded-lg">
                <Clock className="text-secondary" size={20} />
              </div>
              <p className="text-secondary font-bold text-sm md:text-base text-center md:text-left">
                Limited seats left for <span className="underline decoration-2">{promo?.title || "Special Program"}</span>. Book yours now!
              </p>
            </div>

            <div className="flex items-center gap-6">
              {/* Timer */}
              <div className="flex items-center gap-2">
                {[
                  { val: timeLeft.days, unit: "d" },
                  { val: timeLeft.hours, unit: "h" },
                  { val: timeLeft.minutes, unit: "m" },
                  { val: timeLeft.seconds, unit: "s" }
                ].map((item, i) => (
                  <div key={i} className="flex items-baseline gap-0.5">
                    <span className="bg-white px-2 py-1 rounded text-secondary font-black text-sm md:text-base min-w-[32px] text-center shadow-sm">
                      {item.val}
                    </span>
                    <span className="text-secondary/60 text-[10px] font-bold uppercase">{item.unit}</span>
                  </div>
                ))}
              </div>

              <Link href={promo?.registration_link || "/register"} className="bg-secondary text-white px-6 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-black transition-colors group shadow-lg">
                Register Now
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
