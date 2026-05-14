"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, Plus, Edit, Trash2, Check, 
  ArrowLeft, MapPin, Building2, Calendar, 
  Layout, X, Loader2, Tag, List
} from "lucide-react";
import Link from "next/link";

export default function AdminInternships() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [internToEdit, setInternToEdit] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    company: "Prayog Innovation Lab",
    location: "",
    duration: "",
    stipend: "",
    slots: "",
    description: "",
    perks: "", // Will be split by comma
    is_active: true
  });

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const res = await fetch("/api/admin/courses");
      const data = await res.json();
      if (data.success) {
        // Filter courses marked as internships
        const filtered = data.courses.filter(c => c.is_internship === 1);
        setInternships(filtered);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (intern) => {
    const perksStr = Array.isArray(intern.perks) ? intern.perks.join(", ") : 
                    (typeof intern.perks === 'string' ? JSON.parse(intern.perks).join(", ") : "");
    
    setInternToEdit(intern);
    setFormData({
      title: intern.title,
      company: intern.company,
      location: intern.location,
      duration: intern.duration,
      stipend: intern.stipend,
      slots: intern.slots,
      description: intern.description,
      perks: perksStr,
      is_active: intern.is_active === 1 || intern.is_active === true
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const perksArray = formData.perks.split(",").map(p => p.trim()).filter(p => p !== "");
    const body = {
      ...formData,
      perks: perksArray,
      id: internToEdit?.id
    };

    try {
      const res = await fetch("/api/internships", {
        method: internToEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      
      if (res.ok) {
        setShowModal(false);
        setInternToEdit(null);
        setFormData({
          title: "", company: "Prayog Innovation Lab", location: "",
          duration: "", stipend: "", slots: "", description: "", perks: "", is_active: true
        });
        fetchInternships();
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this internship opening?")) {
      await fetch(`/api/internships?id=${id}`, { method: "DELETE" });
      fetchInternships();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 font-body">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">
              <Briefcase size={12} />
              <span>Career Portal Management</span>
            </div>
            <h1 className="text-3xl font-heading font-black text-navy uppercase tracking-tight">
              Internship <span className="text-primary italic">Openings</span>
            </h1>
          </div>
          <Link 
            href="/admin/courses"
            className="bg-navy text-white px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-black transition-all shadow-xl shadow-navy/10"
          >
            <Layout size={18} className="text-primary" />
            Manage in LMS
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="animate-spin text-primary mx-auto mb-4" size={40} />
              <p className="text-sm font-bold text-navy/40 uppercase tracking-widest">Fetching Careers...</p>
            </div>
          ) : internships.length === 0 ? (
            <div className="bg-white rounded-[3rem] p-20 text-center border border-navy/5">
               <Briefcase size={40} className="text-slate-200 mx-auto mb-6" />
               <h3 className="text-xl font-bold text-navy mb-2">No active openings</h3>
               <p className="text-slate-400 text-sm mb-8">Start adding internship programs to build your research cohort.</p>
            </div>
          ) : (
            internships.map((intern) => (
              <div key={intern.id} className="bg-white rounded-[2.5rem] p-8 border border-navy/5 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row items-center justify-between gap-8 group">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 text-navy/40 font-bold text-[10px] uppercase tracking-widest mb-3">
                     <Building2 size={12} className="text-primary" />
                     <span>{intern.company}</span>
                     <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                     <MapPin size={12} className="text-primary" />
                     <span>{intern.location}</span>
                  </div>
                  <h3 className="text-2xl font-heading font-black text-navy mb-2">{intern.title}</h3>
                  <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500 uppercase tracking-tight">
                    <span className="bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">{intern.duration}</span>
                    <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg border border-emerald-100">{intern.stipend}</span>
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg border border-blue-100">{intern.slots}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Link 
                    href="/admin/courses"
                    className="px-6 py-3 rounded-xl bg-navy/5 text-navy text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-navy hover:text-white transition-all"
                  >
                    <Layout size={14} />
                    Edit in LMS
                  </Link>
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
              onClick={() => setShowModal(false)}
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
                          <Briefcase size={24} />
                      </div>
                      <div>
                          <h2 className="text-xl font-heading font-black text-navy uppercase tracking-tight">
                            {internToEdit ? 'Edit Opening' : 'New Internship Opening'}
                          </h2>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Talent Acquisition</p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="w-10 h-10 rounded-full border border-navy/10 flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-all"
                    >
                      <X size={18} />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto p-10">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-navy uppercase tracking-widest">Job Title</label>
                            <input 
                               required
                               type="text" 
                               value={formData.title}
                               onChange={(e) => setFormData({...formData, title: e.target.value})}
                               className="w-full bg-slate-50 border border-navy/5 rounded-xl px-4 py-3.5 text-sm font-bold text-navy outline-none focus:ring-2 focus:ring-primary/20"
                               placeholder="e.g. Robotics Research Intern"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-navy uppercase tracking-widest">Company / Lab</label>
                            <input 
                               required
                               type="text" 
                               value={formData.company}
                               onChange={(e) => setFormData({...formData, company: e.target.value})}
                               className="w-full bg-slate-50 border border-navy/5 rounded-xl px-4 py-3.5 text-sm font-bold text-navy outline-none focus:ring-2 focus:ring-primary/20"
                            />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-navy uppercase tracking-widest">Location</label>
                                <input 
                                   required
                                   type="text" 
                                   value={formData.location}
                                   onChange={(e) => setFormData({...formData, location: e.target.value})}
                                   className="w-full bg-slate-50 border border-navy/5 rounded-xl px-4 py-3.5 text-sm font-bold text-navy outline-none focus:ring-2 focus:ring-primary/20"
                                   placeholder="e.g. Mumbai (Hybrid)"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-navy uppercase tracking-widest">Duration</label>
                                <input 
                                   required
                                   type="text" 
                                   value={formData.duration}
                                   onChange={(e) => setFormData({...formData, duration: e.target.value})}
                                   className="w-full bg-slate-50 border border-navy/5 rounded-xl px-4 py-3.5 text-sm font-bold text-navy outline-none focus:ring-2 focus:ring-primary/20"
                                   placeholder="e.g. 3 Months"
                                />
                            </div>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-navy uppercase tracking-widest">Stipend Details</label>
                                <input 
                                   required
                                   type="text" 
                                   value={formData.stipend}
                                   onChange={(e) => setFormData({...formData, stipend: e.target.value})}
                                   className="w-full bg-slate-50 border border-navy/5 rounded-xl px-4 py-3.5 text-sm font-bold text-navy outline-none focus:ring-2 focus:ring-primary/20"
                                   placeholder="e.g. Paid / Monthly"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-navy uppercase tracking-widest">Slots Available</label>
                                <input 
                                   required
                                   type="text" 
                                   value={formData.slots}
                                   onChange={(e) => setFormData({...formData, slots: e.target.value})}
                                   className="w-full bg-slate-50 border border-navy/5 rounded-xl px-4 py-3.5 text-sm font-bold text-navy outline-none focus:ring-2 focus:ring-primary/20"
                                   placeholder="e.g. 5 Openings"
                                />
                            </div>
                         </div>
                      </div>

                      <div className="space-y-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-navy uppercase tracking-widest">Detailed Description</label>
                            <textarea 
                               required
                               rows={6}
                               value={formData.description}
                               onChange={(e) => setFormData({...formData, description: e.target.value})}
                               className="w-full bg-slate-50 border border-navy/5 rounded-xl px-4 py-3.5 text-sm font-bold text-navy outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                               placeholder="Job responsibilities, requirements..."
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-navy uppercase tracking-widest">Perks (Comma Separated)</label>
                            <input 
                               type="text" 
                               value={formData.perks}
                               onChange={(e) => setFormData({...formData, perks: e.target.value})}
                               className="w-full bg-slate-50 border border-navy/5 rounded-xl px-4 py-3.5 text-sm font-bold text-navy outline-none focus:ring-2 focus:ring-primary/20"
                               placeholder="Certificate, LOR, Stipend..."
                            />
                         </div>
                         <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-navy/5">
                            <input 
                               type="checkbox" 
                               checked={formData.is_active}
                               onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                               className="w-5 h-5 rounded border-navy/10 text-primary focus:ring-primary"
                            />
                            <label className="text-[10px] font-black text-navy uppercase tracking-widest cursor-pointer">Live on Website</label>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="p-8 bg-slate-50 border-t border-navy/5 flex items-center justify-end gap-4">
                    <button 
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-8 py-3.5 text-xs font-bold text-navy uppercase tracking-widest"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-navy text-white px-10 py-3.5 rounded-xl font-bold text-xs uppercase tracking-[0.2em] shadow-xl shadow-navy/20 flex items-center gap-3 hover:scale-105 transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} className="text-primary" />}
                      {internToEdit ? 'Save Changes' : 'Post Opening'}
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
