"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit, X, Loader2, Star, MessageSquare } from "lucide-react";

export default function AdminTestimonials() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newReview, setNewReview] = useState({
    name: "",
    course: "",
    year: "",
    content: "",
    rating: 5,
    thumbnail: "/assets/avatar.png"
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/testimonials");
      const data = await res.json();
      // Only manage reviews that have content (text reviews)
      const textReviews = data.filter(r => r.content && r.content.trim() !== "");
      setReviews(textReviews);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview)
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setNewReview({ name: "", course: "", year: "", content: "", rating: 5, thumbnail: "/assets/avatar.png" });
        fetchReviews();
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/testimonials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingReview)
      });
      const data = await res.json();
      if (data.success) {
        setShowEditModal(false);
        setEditingReview(null);
        fetchReviews();
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this GMB review?")) {
      try {
        const res = await fetch(`/api/testimonials?id=${id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) {
          fetchReviews();
        } else {
          alert("Error: " + data.message);
        }
      } catch (error) {
        alert("Error: " + error.message);
      }
    }
  };

  return (
    <div className="space-y-8 font-body">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Google Reviews (GMB)</h1>
          <p className="text-slate-500 text-sm mt-1">Manage client reviews, student success quotes, and feedback cards shown on the website.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-navy text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-black transition-all shadow-md"
        >
          <Plus size={18} />
          <span>Add Review</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-navy border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
          <MessageSquare className="mx-auto text-slate-300 mb-4" size={40} />
          <p className="text-slate-500 font-medium">No reviews found. Click 'Add Review' to create one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <motion.div 
              key={r.id}
              layout
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-1 text-yellow-500">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={14} fill={j < r.rating ? "currentColor" : "none"} className={j < r.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"} />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setEditingReview({ ...r });
                        setShowEditModal(true);
                      }} 
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(r.id)} 
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <p className="text-slate-600 text-sm italic leading-relaxed mb-6">
                  "{r.content}"
                </p>
              </div>

              <div className="flex items-center space-x-3 border-t border-slate-50 pt-4 mt-auto">
                <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center font-bold text-sm uppercase">
                  {r.name.substring(0, 1)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{r.name}</h4>
                  <p className="text-slate-400 text-xs font-medium">{r.course} {r.year ? `• ${r.year}` : ""}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Review Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Add GMB Review</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-navy transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
               <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Reviewer Name</label>
                  <input required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-navy/20 transition-all" value={newReview.name} onChange={e => setNewReview({...newReview, name: e.target.value})} />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Rating (Stars)</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none cursor-pointer" value={newReview.rating} onChange={e => setNewReview({...newReview, rating: parseInt(e.target.value)})}>
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                 </div>
                 <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Time / Date text</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-navy/20 transition-all" placeholder="e.g. 2 weeks ago" value={newReview.year} onChange={e => setNewReview({...newReview, year: e.target.value})} />
                 </div>
               </div>
               <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Role / Course</label>
                  <input className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-navy/20 transition-all" placeholder="e.g. Internship Student, Parent" value={newReview.course} onChange={e => setNewReview({...newReview, course: e.target.value})} />
               </div>
               <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Review Content</label>
                  <textarea required rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-navy/20 transition-all resize-none" placeholder="Write the review content here..." value={newReview.content} onChange={e => setNewReview({...newReview, content: e.target.value})} />
               </div>
               <div className="flex justify-end gap-3 pt-4 border-t border-slate-50">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">Cancel</button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-navy text-white rounded-lg text-xs font-bold disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                    <span>{isSubmitting ? "Saving..." : "Add Review"}</span>
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Review Modal */}
      {showEditModal && editingReview && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Edit GMB Review</h3>
              <button onClick={() => { setShowEditModal(false); setEditingReview(null); }} className="text-slate-400 hover:text-navy transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEdit} className="p-6 space-y-4">
               <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Reviewer Name</label>
                  <input required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-navy/20 transition-all" value={editingReview.name} onChange={e => setEditingReview({...editingReview, name: e.target.value})} />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Rating (Stars)</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none cursor-pointer" value={editingReview.rating} onChange={e => setEditingReview({...editingReview, rating: parseInt(e.target.value)})}>
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                 </div>
                 <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Time / Date text</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-navy/20 transition-all" placeholder="e.g. 2 weeks ago" value={editingReview.year} onChange={e => setEditingReview({...editingReview, year: e.target.value})} />
                 </div>
               </div>
               <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Role / Course</label>
                  <input className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-navy/20 transition-all" placeholder="e.g. Internship Student, Parent" value={editingReview.course} onChange={e => setEditingReview({...editingReview, course: e.target.value})} />
               </div>
               <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Review Content</label>
                  <textarea required rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-navy/20 transition-all resize-none" placeholder="Write the review content here..." value={editingReview.content} onChange={e => setEditingReview({...editingReview, content: e.target.value})} />
               </div>
               <div className="flex justify-end gap-3 pt-4 border-t border-slate-50">
                  <button type="button" onClick={() => { setShowEditModal(false); setEditingReview(null); }} className="px-5 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">Cancel</button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-navy text-white rounded-lg text-xs font-bold disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                    <span>{isSubmitting ? "Saving..." : "Save Changes"}</span>
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
