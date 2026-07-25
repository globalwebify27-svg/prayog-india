"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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
    <section className="py-10 md:py-20 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left mb-12 gap-8">
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-navy font-bold uppercase tracking-widest text-[10px] md:text-xs mb-3 flex items-center gap-2">
              <span className="w-6 h-px bg-primary hidden md:block" />
              Google Reviews
            </h4>
            <h2 className="text-2xl md:text-5xl font-heading font-black text-slate-900 leading-tight">
              What Our Students <span className="text-navy">& Parents Say</span>
            </h2>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="testimonial-prev w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-navy bg-white shadow-sm hover:bg-navy hover:text-white transition-all group">
              <ChevronLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <button className="testimonial-next w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-navy bg-white shadow-sm hover:bg-navy hover:text-white transition-all group">
              <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={15}
          slidesPerView={1}
          speed={800}
          loop={reviews.slice(0, 3).length > 3}
          navigation={{
            prevEl: '.testimonial-prev',
            nextEl: '.testimonial-next',
          }}
          pagination={{ clickable: true, el: '.swiper-pagination-reviews' }}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 1.5, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 30 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
          }}
          className="pt-6 pb-16 px-4 -mx-4 !overflow-visible"
        >
          {reviews.slice(0, 3).map((t, i) => (
            <SwiperSlide key={t.id || i} className="h-auto">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative group hover:shadow-xl transition-all flex flex-col justify-between h-full min-h-[280px]">
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
                    &quot;{t.content}&quot;
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
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="swiper-pagination-reviews flex justify-center mt-4"></div>

        <div className="mt-8 text-center">
          <Link 
            href="/reviews"
            className="inline-flex items-center space-x-2 bg-navy text-white font-bold text-xs uppercase px-8 py-3.5 rounded-xl hover:bg-black transition-all shadow-md"
          >
            <span>View All Reviews</span>
          </Link>
        </div>
      </div>

      <style jsx global>{`
        .swiper-pagination-reviews .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #01254d;
          opacity: 0.2;
          transition: all 0.3s;
        }
        .swiper-pagination-reviews .swiper-pagination-bullet-active {
          width: 24px;
          border-radius: 4px;
          opacity: 1;
        }
      `}</style>
    </section>
  );
}
