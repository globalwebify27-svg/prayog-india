"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import Link from "next/link";

export default function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch("/api/testimonials");
        const data = await res.json();
        // Filter out items that only have video/no text reviews (video testimonials have content: null)
        const textReviews = data.filter(r => r.content && r.content.trim() !== "");
        setReviews(textReviews);
      } catch (err) {
        console.error("Failed to fetch GMB reviews:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-slate-50 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-navy border-t-transparent rounded-full animate-spin"></div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section className="py-10 md:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h4 className="text-navy font-bold uppercase tracking-widest text-xs mb-2">Google Reviews</h4>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900">What Our Students & Parents Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.slice(0, 6).map((t, i) => (
            <motion.div
              key={t.id || i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative group hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-navy">
                  <Quote size={20} />
                </div>
                
                <div className="flex items-center space-x-1 text-yellow-500 mb-6">
                  {[...Array(t.rating || 5)].map((_, j) => (
                    <Star key={j} size={14} fill="currentColor" className="text-amber-400 fill-amber-400 border-none" />
                  ))}
                </div>

                <p className="text-slate-600 mb-8 italic leading-relaxed text-sm">
                  "{t.content}"
                </p>
              </div>

              <div className="flex items-center space-x-4 border-t border-slate-50 pt-4 mt-auto">
                <div className="w-12 h-12 rounded-full border-2 border-slate-100 bg-navy text-white flex items-center justify-center font-bold text-base shadow-sm uppercase shrink-0">
                  {t.name.substring(0, 1)}
                </div>
                <div>
                  <h4 className="font-heading font-bold text-slate-900 text-sm">{t.name}</h4>
                  <p className="text-slate-400 text-xs font-medium">
                    {t.course} {t.year ? `• ${t.year}` : ""}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-16 text-center">
          <Link 
            href="/reviews"
            className="inline-flex items-center space-x-2 bg-navy text-white font-bold text-xs uppercase px-8 py-3.5 rounded-xl hover:bg-black transition-all shadow-md"
          >
            <span>View All Reviews</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
