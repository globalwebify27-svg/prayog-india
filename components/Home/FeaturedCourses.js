"use client";

import { useState, useEffect } from "react";
import { Clock, BookOpen, Star, ArrowRight, Download, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function FeaturedCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch(`/api/courses?t=${Date.now()}`);
        if (!res.ok) {
          console.error(`Fetch failed with status: ${res.status}`);
          setCourses([]);
          return;
        }
        const data = await res.json();
        console.log("FeaturedCourses data received:", data);
        if (Array.isArray(data)) {
          setCourses(data.slice(0, 6)); // Show first 6 as featured
        } else {
          console.error("Invalid data format for courses. Expected array, got:", typeof data, data);
          setCourses([]);
        }
      } catch (err) {
        console.error("Failed to fetch featured courses:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-10 h-10 border-4 border-navy border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <section className="py-10 md:py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left mb-12 gap-8">
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-navy font-bold uppercase tracking-widest text-[10px] md:text-xs mb-3 flex items-center gap-2">
              <span className="w-6 h-px bg-primary hidden md:block" />
              Our Programs
            </h4>
            <h2 className="text-2xl md:text-5xl font-heading font-black text-slate-900 leading-tight">
              Featured <span className="text-navy">Courses</span>
            </h2>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="swiper-prev w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-navy bg-white shadow-sm hover:bg-navy hover:text-white transition-all group">
              <ChevronLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <button className="swiper-next w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-navy bg-white shadow-sm hover:bg-navy hover:text-white transition-all group">
              <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>


        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={10}
          slidesPerView={2}
          navigation={{
            prevEl: '.swiper-prev',
            nextEl: '.swiper-next',
          }}
          pagination={{ clickable: true, el: '.swiper-pagination-custom' }}
          autoplay={{ delay: 5000 }}
          breakpoints={{
            768: { slidesPerView: 2, spaceBetween: 30 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
          }}
          className="pb-16"
        >
          {courses.map((course) => (
            <SwiperSlide key={course.id}>
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group h-full flex flex-col">
                {/* Image Area */}
                <div className="relative h-44 overflow-hidden shrink-0">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute top-3 left-3 bg-navy text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg">
                    {course.category}
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center space-x-1 text-yellow-500 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={12} fill={j < Math.floor(course.rating || 5) ? "currentColor" : "none"} />
                    ))}
                    <span className="text-slate-400 text-xs font-bold ml-1">{course.rating || '5.0'}</span>
                  </div>
                  <h3 className="text-lg font-heading font-black text-slate-900 mb-3 group-hover:text-navy transition-colors line-clamp-1">
                    {course.title}
                  </h3>
                  
                  <div className="flex items-center justify-between text-slate-500 text-xs mb-6 border-y border-slate-50 py-3">
                    <div className="flex items-center space-x-2">
                      <Clock size={14} className="text-navy" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpen size={14} className="text-navy" />
                      <span>{course.type === 'online' ? 'Live Session' : 'Practical Training'}</span>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xl font-heading font-black text-navy">₹{Number(course.price).toLocaleString('en-IN')}</span>
                      <div className="flex space-x-2">
                        {course.modules ? (
                          <Link 
                            href={course.id === 6 ? "/summer-camp" : `/register?course=${course.id}`}
                            className="w-10 h-10 rounded-xl bg-navy text-white flex items-center justify-center hover:bg-black transition-all group-hover:rotate-[-45deg] shadow-lg shadow-navy/20"
                          >
                            <ArrowRight size={18} />
                          </Link>
                        ) : (
                          <div 
                            className="w-10 h-10 rounded-xl bg-slate-100 text-slate-300 flex items-center justify-center cursor-not-allowed border border-slate-200"
                            title="Learning Path pending"
                          >
                            <ArrowRight size={18} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        
        <div className="swiper-pagination-custom flex justify-center mt-4"></div>
      </div>

      <style jsx global>{`
        .swiper-pagination-custom .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #01254d;
          opacity: 0.2;
          transition: all 0.3s;
        }
        .swiper-pagination-custom .swiper-pagination-bullet-active {
          width: 24px;
          border-radius: 4px;
          opacity: 1;
        }
      `}</style>
    </section>
  );
}
