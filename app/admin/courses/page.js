"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Book, 
  ChevronRight, 
  Search, 
  Plus, 
  Layout, 
  Clock, 
  Tag 
} from "lucide-react";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    price: "",
    type: "online",
    duration: "6 Months",
    image: ""
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const res = await fetch("/api/admin/courses");
    const result = await res.json();
    if (result.success) setCourses(result.courses);
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/admin/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCourse)
    });
    const result = await res.json();
    if (result.success) {
      setShowAddModal(false);
      setNewCourse({ title: "", description: "", price: "", type: "online", duration: "6 Months", image: "" });
      fetchCourses();
    }
  };

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 font-body">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">LMS Management</h1>
          <p className="text-slate-500 text-sm mt-1">Configure learning paths, documents, and steps for students.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search courses..." 
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-navy outline-none w-64 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-navy text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-black transition-all shadow-md"
          >
            <Plus size={18} />
            <span>Add Course</span>
          </button>
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-2xl p-20 border border-slate-200 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center mx-auto mb-4">
            <Book size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No courses found</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto italic">Start by adding a new academic program to configure its learning materials.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <motion.div 
              key={course.id}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              <div className="h-44 bg-slate-100 flex items-center justify-center text-slate-300 relative overflow-hidden">
                {course.image ? (
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <Layout size={48} />
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase shadow-sm ${course.type === 'online' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'}`}>
                    {course.type}
                  </span>
                </div>
              </div>
              <div className="p-6 flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-widest">
                    <Clock size={10} className="text-navy" /> {course.duration}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-widest">
                    <Tag size={10} className="text-navy" /> ₹{Number(course.price).toLocaleString()}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-4 line-clamp-2 min-h-[3rem]">{course.title}</h3>
                
                <Link 
                  href={`/admin/courses/${course.id}`}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-navy hover:text-white text-navy transition-all group border border-slate-100 shadow-sm"
                >
                  <span className="text-xs font-bold">Manage Learning Path</span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900">Add New Course</h3>
            </div>
            <form onSubmit={handleAddCourse} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Course Title</label>
                <input 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:border-navy outline-none transition-all"
                  placeholder="e.g. Full Stack Web Development"
                  value={newCourse.title}
                  onChange={e => setNewCourse({...newCourse, title: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Course Image URL</label>
                <input 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:border-navy outline-none transition-all"
                  placeholder="https://images.unsplash.com/..."
                  value={newCourse.image}
                  onChange={e => setNewCourse({...newCourse, image: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Type</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none cursor-pointer"
                    value={newCourse.type}
                    onChange={e => setNewCourse({...newCourse, type: e.target.value})}
                  >
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Duration</label>
                  <input 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none"
                    value={newCourse.duration}
                    onChange={e => setNewCourse({...newCourse, duration: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Price (INR)</label>
                <input 
                  type="number"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none"
                  value={newCourse.price}
                  onChange={e => setNewCourse({...newCourse, price: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Description</label>
                <textarea 
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:border-navy outline-none transition-all"
                  value={newCourse.description}
                  onChange={e => setNewCourse({...newCourse, description: e.target.value})}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-lg transition-all">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-navy text-white rounded-lg text-xs font-bold transition-all shadow-md hover:bg-black">Create Course</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
