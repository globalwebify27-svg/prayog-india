"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, Calendar, Plus, Edit, Trash2, Check, 
  ArrowLeft, Upload, Clock, Tag, Layout, 
  AlertCircle, CheckCircle2, FileText, ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function PromoManagement() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [promoToEdit, setPromoToEdit] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const [newPromo, setNewPromo] = useState({
    title: "",
    subtitle: "",
    description: "",
    date_text: "",
    price: "",
    tag: "Limited Time",
    image: "",
    target_date: "",
    is_active: true,
    registration_link: "/register"
  });

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchPromos();
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/admin/courses");
      const data = await res.json();
      if (data.success) setCourses(data.courses);
    } catch (error) {
      console.error("Fetch courses error:", error);
    }
  };

  const handleCourseSelect = (courseId) => {
    const selectedCourse = courses.find(c => c.id === parseInt(courseId));
    if (selectedCourse) {
      const updates = {
        registration_link: `/register?course=${selectedCourse.id}&lock=true`,
        price: `₹${selectedCourse.price}`
      };
      if (promoToEdit) {
        setPromoToEdit({ ...promoToEdit, ...updates });
      } else {
        setNewPromo({ ...newPromo, ...updates });
      }
    }
  };

  const fetchPromos = async () => {
    try {
      const res = await fetch("/api/admin/promos");
      const data = await res.json();
      setPromos(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        if (promoToEdit) {
          setPromoToEdit({ ...promoToEdit, image: data.url });
        } else {
          setNewPromo({ ...newPromo, image: data.url });
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const method = promoToEdit ? "PUT" : "POST";
    const body = promoToEdit ? { ...promoToEdit } : { ...newPromo };

    try {
      const res = await fetch("/api/admin/promos", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        fetchPromos();
        setShowModal(false);
        setPromoToEdit(null);
        setNewPromo({
          title: "", subtitle: "", description: "", date_text: "",
          price: "", tag: "Limited Time", image: "", target_date: "",
          is_active: true, registration_link: "/register"
        });
      }
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this promo?")) return;
    try {
      const res = await fetch(`/api/admin/promos?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchPromos();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">
              <Zap size={12} />
              <span>Marketing Console</span>
            </div>
            <h1 className="text-3xl font-heading font-black text-navy uppercase tracking-tight">
              Seasonal <span className="text-primary italic">Promos</span>
            </h1>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-navy text-white px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-black transition-all shadow-xl shadow-navy/10"
          >
            <Plus size={18} className="text-primary" />
            Create Promo
          </button>
        </div>

        {/* Filters/Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
           <div className="bg-white p-6 rounded-[2rem] border border-navy/5 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Highlights</p>
              <p className="text-3xl font-heading font-black text-navy">{promos.filter(p => p.is_active).length}</p>
           </div>
           <div className="bg-white p-6 rounded-[2rem] border border-navy/5 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Scheduled</p>
              <p className="text-3xl font-heading font-black text-navy">{promos.length}</p>
           </div>
           <Link href="/admin" className="bg-navy p-6 rounded-[2rem] border border-white/5 shadow-xl flex items-center justify-between group">
              <div>
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Control Center</p>
                <p className="text-lg font-heading font-black text-white">Back to Dashboard</p>
              </div>
              <ArrowLeft className="text-white group-hover:-translate-x-2 transition-transform" />
           </Link>
        </div>

        {/* Promo List */}
        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm font-bold text-navy/40 uppercase tracking-widest">Loading Campaigns...</p>
            </div>
          ) : promos.length === 0 ? (
            <div className="bg-white rounded-[3rem] p-20 text-center border border-navy/5">
               <Zap size={40} className="text-slate-200 mx-auto mb-6" />
               <h3 className="text-xl font-bold text-navy mb-2">No active promos found</h3>
               <p className="text-slate-400 text-sm mb-8">Start your first seasonal marketing campaign to engage more students.</p>
               <button onClick={() => setShowModal(true)} className="text-primary font-bold uppercase tracking-widest text-xs border-b-2 border-primary pb-1">Create Now</button>
            </div>
          ) : (
            promos.map((promo) => (
              <div key={promo.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-navy/5 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row group">
                <div className="md:w-1/4 h-48 md:h-auto relative">
                  <img src={promo.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg ${promo.is_active ? 'bg-green-500 text-white' : 'bg-slate-400 text-white'}`}>
                    {promo.is_active ? 'Live' : 'Inactive'}
                  </div>
                </div>
                <div className="md:w-3/4 p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 text-navy/40 font-bold text-[10px] uppercase tracking-widest mb-3">
                       <Calendar size={12} className="text-primary" />
                       <span>{promo.date_text}</span>
                       <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                       <span>{promo.price}</span>
                    </div>
                    <h3 className="text-2xl font-heading font-black text-navy mb-2">{promo.title}</h3>
                    <p className="text-slate-500 text-xs font-medium line-clamp-2 max-w-xl">{promo.description}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button 
                      onClick={() => { setPromoToEdit(promo); setShowModal(true); }}
                      className="w-12 h-12 rounded-2xl bg-navy/5 text-navy flex items-center justify-center hover:bg-navy hover:text-white transition-all"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(promo.id)}
                      className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setShowModal(false); setPromoToEdit(null); }}
              className="absolute inset-0 bg-navy/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <form onSubmit={handleSubmit} className="flex flex-col h-[85vh]">
                <div className="p-8 border-b border-navy/5 flex items-center justify-between bg-slate-50">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-navy text-primary flex items-center justify-center">
                         <Zap size={24} />
                      </div>
                      <div>
                         <h2 className="text-xl font-heading font-black text-navy uppercase tracking-tight">
                           {promoToEdit ? 'Edit Program' : 'New Seasonal Program'}
                         </h2>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Marketing Campaign</p>
                      </div>
                   </div>
                   <button 
                    type="button"
                    onClick={() => { setShowModal(false); setPromoToEdit(null); }}
                    className="w-10 h-10 rounded-full border border-navy/10 flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-all"
                   >
                     <ArrowLeft size={18} />
                   </button>
                </div>

                <div className="flex-grow overflow-y-auto p-10">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      {/* Left: General Info */}
                      <div className="space-y-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-navy uppercase tracking-widest flex items-center gap-2">
                               <Layout size={12} className="text-primary" /> Title
                            </label>
                            <input 
                               required
                               type="text" 
                               value={promoToEdit ? promoToEdit.title : newPromo.title}
                               onChange={(e) => promoToEdit ? setPromoToEdit({...promoToEdit, title: e.target.value}) : setNewPromo({...newPromo, title: e.target.value})}
                               className="w-full bg-slate-50 border border-navy/5 rounded-xl px-4 py-3.5 text-sm font-bold text-navy focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                               placeholder="e.g. Robotics Summer Camp 2026"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-navy uppercase tracking-widest flex items-center gap-2">
                               <Tag size={12} className="text-primary" /> Subtitle
                            </label>
                            <input 
                               type="text" 
                               value={promoToEdit ? promoToEdit.subtitle : newPromo.subtitle}
                               onChange={(e) => promoToEdit ? setPromoToEdit({...promoToEdit, subtitle: e.target.value}) : setNewPromo({...newPromo, subtitle: e.target.value})}
                               className="w-full bg-slate-50 border border-navy/5 rounded-xl px-4 py-3.5 text-sm font-bold text-navy focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                               placeholder="e.g. For School Students (Class 5th - 10th)"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-navy uppercase tracking-widest">Description</label>
                            <textarea 
                               required
                               rows={4}
                               value={promoToEdit ? promoToEdit.description : newPromo.description}
                               onChange={(e) => promoToEdit ? setPromoToEdit({...promoToEdit, description: e.target.value}) : setNewPromo({...newPromo, description: e.target.value})}
                               className="w-full bg-slate-50 border border-navy/5 rounded-xl px-4 py-3.5 text-sm font-bold text-navy focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                               placeholder="A 15-day hands-on journey..."
                            />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-navy uppercase tracking-widest">Actual Start Date</label>
                               <input 
                                  type="date" 
                                  value={promoToEdit ? (promoToEdit.start_date ? new Date(promoToEdit.start_date).toISOString().split('T')[0] : '') : newPromo.start_date}
                                  onChange={(e) => promoToEdit ? setPromoToEdit({...promoToEdit, start_date: e.target.value}) : setNewPromo({...newPromo, start_date: e.target.value})}
                                  className="w-full bg-slate-50 border border-navy/5 rounded-xl px-4 py-3.5 text-sm font-bold text-navy focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                               />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-navy uppercase tracking-widest">Display Date Text</label>
                               <input 
                                  type="text" 
                                  value={promoToEdit ? promoToEdit.date_text : newPromo.date_text}
                                  onChange={(e) => promoToEdit ? setPromoToEdit({...promoToEdit, date_text: e.target.value}) : setNewPromo({...newPromo, date_text: e.target.value})}
                                  className="w-full bg-slate-50 border border-navy/5 rounded-xl px-4 py-3.5 text-sm font-bold text-navy focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                  placeholder="Starts May 15th, 2026"
                               />
                            </div>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-navy uppercase tracking-widest">Registration Fee</label>
                               <input 
                                  type="text" 
                                  value={promoToEdit ? promoToEdit.price : newPromo.price}
                                  onChange={(e) => promoToEdit ? setPromoToEdit({...promoToEdit, price: e.target.value}) : setNewPromo({...newPromo, price: e.target.value})}
                                  className="w-full bg-slate-50 border border-navy/5 rounded-xl px-4 py-3.5 text-sm font-bold text-navy focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                  placeholder="e.g. ₹2,999"
                               />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-navy uppercase tracking-widest">Promo Tag</label>
                               <input 
                                  type="text" 
                                  value={promoToEdit ? promoToEdit.tag : newPromo.tag}
                                  onChange={(e) => promoToEdit ? setPromoToEdit({...promoToEdit, tag: e.target.value}) : setNewPromo({...newPromo, tag: e.target.value})}
                                  className="w-full bg-slate-50 border border-navy/5 rounded-xl px-4 py-3.5 text-sm font-bold text-navy focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                  placeholder="e.g. Limited Time"
                               />
                            </div>
                         </div>
                      </div>

                      {/* Right: Media & Scheduling */}
                      <div className="space-y-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-navy uppercase tracking-widest">Target Countdown Date</label>
                            <input 
                               type="datetime-local" 
                               value={promoToEdit ? (promoToEdit.target_date ? new Date(promoToEdit.target_date).toISOString().slice(0, 16) : '') : newPromo.target_date}
                               onChange={(e) => promoToEdit ? setPromoToEdit({...promoToEdit, target_date: e.target.value}) : setNewPromo({...newPromo, target_date: e.target.value})}
                               className="w-full bg-slate-50 border border-navy/5 rounded-xl px-4 py-3.5 text-sm font-bold text-navy focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-navy uppercase tracking-widest flex items-center gap-2">
                               <Layout size={12} className="text-primary" /> Link to Course
                            </label>
                            <select 
                               onChange={(e) => handleCourseSelect(e.target.value)}
                               className="w-full bg-slate-50 border border-navy/5 rounded-xl px-4 py-3.5 text-sm font-bold text-navy focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            >
                               <option value="">Select a Course to Link</option>
                               {courses.map(course => (
                                  <option key={course.id} value={course.id}>{course.title} (₹{course.price})</option>
                               ))}
                            </select>
                         </div>
                         
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-navy uppercase tracking-widest">Promo Image</label>
                            <div className="relative group">
                               <div className="w-full h-40 bg-slate-100 rounded-2xl overflow-hidden border-2 border-dashed border-navy/10 flex items-center justify-center">
                                  {(promoToEdit?.image || newPromo.image) ? (
                                    <img src={promoToEdit?.image || newPromo.image} className="w-full h-full object-cover" alt="" />
                                  ) : (
                                    <div className="text-center">
                                       <Upload className="text-slate-300 mx-auto mb-2" />
                                       <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Drop Image or Click</p>
                                    </div>
                                  )}
                               </div>
                               <input 
                                  type="file" 
                                  onChange={handleImageUpload}
                                  className="absolute inset-0 opacity-0 cursor-pointer"
                               />
                            </div>
                         </div>

                         <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-navy/5">
                            <input 
                               type="checkbox" 
                               checked={promoToEdit ? promoToEdit.is_active : newPromo.is_active}
                               onChange={(e) => promoToEdit ? setPromoToEdit({...promoToEdit, is_active: e.target.checked}) : setNewPromo({...newPromo, is_active: e.target.checked})}
                               className="w-5 h-5 rounded border-navy/10 text-primary focus:ring-primary"
                            />
                            <label className="text-[10px] font-black text-navy uppercase tracking-widest cursor-pointer">Active on Website</label>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="p-8 bg-slate-50 border-t border-navy/5 flex items-center justify-end gap-4">
                   <button 
                    type="button"
                    onClick={() => { setShowModal(false); setPromoToEdit(null); }}
                    className="px-8 py-3.5 text-xs font-bold text-navy uppercase tracking-widest hover:text-red-500 transition-colors"
                   >
                     Discard
                   </button>
                   <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-navy text-white px-10 py-3.5 rounded-xl font-bold text-xs uppercase tracking-[0.2em] shadow-xl shadow-navy/20 flex items-center gap-3 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                   >
                     {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                     ) : <Check size={16} className="text-primary" />}
                     {promoToEdit ? 'Save Changes' : 'Launch Campaign'}
                   </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
