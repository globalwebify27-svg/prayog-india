"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  ArrowRight, 
  Shield, 
  Zap,
  Filter,
  Search,
  Star,
  Layers,
  Clock,
  ArrowUpRight
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

const categories = ["All", "Township", "Robotics", "Artificial Intelligence", "Aviation", "Electronics", "Design"];

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch("/api/courses");
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesTab = activeTab === "All" || course.category === activeTab;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });


  return (
    <main className="min-h-screen bg-slate-50 font-body">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-semibold text-white mb-6 leading-tight tracking-tight"
            >
              Academic & <span className="text-primary">Township Programs</span>
            </motion.h1>
            <p className="text-blue-100/60 text-lg mb-10 max-w-2xl leading-relaxed">
              Explore industry-validated certifications and immersive residential programs designed to bridge the gap between academia and industrial robotics.
            </p>
            
            <div className="relative max-w-xl group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search by technology, level, or program name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:bg-white/10 focus:border-white/20 transition-all text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Course Explorer */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-5 py-2 rounded-lg text-xs font-semibold transition-all border ${
                    activeTab === cat 
                      ? "bg-navy text-white border-navy shadow-md" 
                      : "bg-white text-slate-500 border-slate-200 hover:border-navy hover:text-navy"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex p-1 bg-white border border-slate-200 rounded-lg shadow-sm">
                <button 
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-navy text-white shadow-sm' : 'text-slate-400 hover:text-navy'}`}
                >
                  <Layers size={18} />
                </button>
                <button 
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-navy text-white shadow-sm' : 'text-slate-400 hover:text-navy'}`}
                >
                  <Filter size={18} />
                </button>
              </div>
              <button className="flex items-center space-x-2 px-6 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-semibold text-xs hover:border-navy transition-all shadow-sm">
                <Filter size={16} className="text-slate-400" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Grid / List View */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-4 border-navy border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-500">No courses found matching your criteria.</p>
            </div>
          ) : (
            <div className={viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
              : "space-y-4 max-w-5xl mx-auto"
            }>
            {filteredCourses.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex group overflow-hidden ${
                  viewMode === 'grid' ? 'flex-col rounded-2xl' : 'flex-row items-center rounded-xl p-3'
                }`}
              >
                {/* Image */}
                <div className={`relative overflow-hidden shrink-0 bg-slate-100 ${
                  viewMode === 'grid' ? 'h-52 w-full' : 'h-24 w-36 rounded-lg'
                }`}>
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 bg-white/90 backdrop-blur-sm text-navy rounded font-bold text-[9px] uppercase shadow-sm">
                      {course.category}
                    </span>
                  </div>
                </div>

                <div className={`flex flex-col flex-grow ${viewMode === 'grid' ? 'p-6' : 'px-6'}`}>
                  <div className="flex items-center space-x-2 text-[10px] font-bold text-amber-500 uppercase mb-2">
                    <Star size={12} className="fill-amber-500" />
                    <span>{course.rating} • {course.level}</span>
                  </div>
                  <h3 className={`${viewMode === 'grid' ? 'text-lg' : 'text-base'} font-bold text-slate-900 mb-2 leading-snug group-hover:text-navy transition-colors`}>
                    {course.title}
                  </h3>
                  {viewMode === 'grid' && (
                    <p className="text-slate-500 text-xs leading-relaxed mb-6 flex-grow line-clamp-2">
                      {course.description}
                    </p>
                  )}
                  
                  <div className={`flex items-center justify-between ${viewMode === 'grid' ? 'pt-5 border-t border-slate-100' : ''}`}>
                    <div className="flex items-center space-x-6">
                      <div>
                        <span className="block text-[8px] font-bold text-slate-400 uppercase mb-0.5 tracking-tight">Investment</span>
                        <span className="block text-lg font-bold text-navy">₹{Number(course.price).toLocaleString('en-IN')}</span>
                      </div>
                      <Link href={`/courses/${course.id}`} className="flex items-center space-x-1.5 text-[10px] font-bold text-navy hover:text-primary transition-colors uppercase">
                        <BookOpen size={14} />
                        <span>Learning Path</span>
                      </Link>
                    </div>
                    {course.modules ? (
                      <Link href={`/register?course=${course.id}`} className="w-10 h-10 rounded-lg bg-navy text-white flex items-center justify-center hover:bg-black transition-all shadow-sm">
                        <ArrowUpRight size={18} />
                      </Link>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-300 flex items-center justify-center cursor-not-allowed" title="Learning Path pending">
                        <ArrowUpRight size={18} />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-16 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <Shield className="text-primary w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-base mb-1">ISO Certified</h4>
                <p className="text-blue-100/40 text-xs leading-relaxed">Adhering to global educational standards for industrial excellence.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <Zap className="text-primary w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-base mb-1">Practical Labs</h4>
                <p className="text-blue-100/40 text-xs leading-relaxed">Hands-on experience with real industrial robotics and controllers.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <BookOpen className="text-primary w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-base mb-1">Career Support</h4>
                <p className="text-blue-100/40 text-xs leading-relaxed">Exclusive access to our alumni network and placement portal.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
