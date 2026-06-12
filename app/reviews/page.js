"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Quote, Star, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch("/api/testimonials");
        const data = await res.json();
        // Filter out video-only reviews
        const textReviews = data.filter(r => r.content && r.content.trim() !== "");
        setReviews(textReviews);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 font-body">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-semibold text-white mb-6 leading-tight tracking-tight">
              Google <span className="text-primary">Reviews & Feedback</span>
            </h1>
            <p className="text-blue-100/60 text-lg max-w-2xl mx-auto leading-relaxed">
              Read real stories, experiences, and feedback shared by our students, parent community, and workshop participants.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <Link href="/" className="inline-flex items-center space-x-2 text-slate-500 hover:text-navy transition-colors font-bold text-xs uppercase">
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </Link>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-navy font-black text-sm">4.8</span>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <span className="text-slate-400 text-xs font-semibold">(545+ reviews)</span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-navy border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-500 font-medium">No reviews found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((t, i) => (
                <motion.div
                  key={t.id || i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 3) * 0.05 }}
                  className="bg-white p-8 rounded-3xl shadow-sm border border-slate-150 relative group hover:shadow-xl hover:border-slate-200 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-navy shadow-md">
                      <Quote size={18} />
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
                    <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center font-bold text-sm uppercase">
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
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
