"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Tag, Calendar, Plus, Edit, Trash2, Check, 
  ArrowLeft, Percent, Database, CreditCard
} from "lucide-react";
import Link from "next/link";
import CustomModal from "@/components/CustomModal";

export default function CouponsManagement() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [couponToEdit, setCouponToEdit] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courses, setCourses] = useState([]);

  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: "",
    course_ids: [],
    expiry_date: "",
    is_active: true,
  });

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    description: "",
    type: "info",
    confirmText: "Confirm",
    onConfirm: () => {}
  });

  const showAlert = (title, description, type = "info", onConfirm = () => {}, confirmText = "Confirm") => {
    setModalConfig({
      isOpen: true,
      title,
      description,
      type,
      confirmText,
      onConfirm
    });
  };

  useEffect(() => {
    fetchCoupons();
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

  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      setCoupons(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const method = couponToEdit ? "PUT" : "POST";
    const body = couponToEdit ? { ...couponToEdit } : { ...newCoupon };

    try {
      const res = await fetch("/api/admin/coupons", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        fetchCoupons();
        setShowModal(false);
        setCouponToEdit(null);
        setNewCoupon({
          code: "", discount_type: "percentage", discount_value: "", course_ids: [], expiry_date: "", is_active: true
        });
        showAlert("Success", "Coupon saved successfully.", "success");
      } else {
        const err = await res.json();
        showAlert("Error", err.error || "Unable to save coupon.", "error");
      }
    } catch (error) {
      console.error("Submit error:", error);
      showAlert("System Error", "Failed to save the coupon.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    showAlert(
      "Confirm Deletion",
      "Are you sure you want to delete this coupon? It will no longer be valid for checkouts.",
      "warning",
      async () => {
        try {
          const res = await fetch(`/api/admin/coupons?id=${id}`, { method: "DELETE" });
          if (res.ok) {
            fetchCoupons();
            showAlert("Deleted", "Coupon removed successfully.", "success");
          } else {
            showAlert("Error", "Failed to remove the coupon.", "error");
          }
        } catch (error) {
          showAlert("System Error", "A technical failure occurred during deletion.", "error");
        }
      },
      "Delete Now"
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">
              <Tag size={12} />
              <span>Discount Hub</span>
            </div>
            <h1 className="text-3xl font-heading font-black text-navy uppercase tracking-tight">
              Manage <span className="text-primary italic">Coupons</span>
            </h1>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-navy text-white px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-black transition-all shadow-xl shadow-navy/10"
          >
            <Plus size={18} className="text-primary" />
            Create Coupon
          </button>
        </div>

        {/* Filters/Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
           <div className="bg-white p-6 rounded-[2rem] border border-navy/5 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Coupons</p>
              <p className="text-3xl font-heading font-black text-navy">{coupons.filter(p => p.is_active).length}</p>
           </div>
           <div className="bg-white p-6 rounded-[2rem] border border-navy/5 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Created</p>
              <p className="text-3xl font-heading font-black text-navy">{coupons.length}</p>
           </div>
           <Link href="/admin" className="bg-navy p-6 rounded-[2rem] border border-white/5 shadow-xl flex items-center justify-between group">
              <div>
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Control Center</p>
                <p className="text-lg font-heading font-black text-white">Back to Dashboard</p>
              </div>
              <ArrowLeft className="text-white group-hover:-translate-x-2 transition-transform" />
           </Link>
        </div>

        {/* Coupon List */}
        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm font-bold text-navy/40 uppercase tracking-widest">Loading Coupons...</p>
            </div>
          ) : coupons.length === 0 ? (
            <div className="bg-white rounded-[3rem] p-20 text-center border border-navy/5">
               <Tag size={40} className="text-slate-200 mx-auto mb-6" />
               <h3 className="text-xl font-bold text-navy mb-2">No coupons found</h3>
               <p className="text-slate-400 text-sm mb-8">Start your first discount campaign to engage more students.</p>
               <button onClick={() => setShowModal(true)} className="text-primary font-bold uppercase tracking-widest text-xs border-b-2 border-primary pb-1">Create Now</button>
            </div>
          ) : (
            coupons.map((coupon) => (
              <div key={coupon.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-navy/5 shadow-sm hover:shadow-xl transition-all p-8 flex flex-col md:flex-row items-center justify-between gap-8 group">
                <div className="flex-grow flex items-center gap-6">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${coupon.is_active ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-400'}`}>
                    <Percent size={32} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 text-navy/40 font-bold text-[10px] uppercase tracking-widest mb-3">
                       <CreditCard size={12} className="text-primary" />
                       <span>{coupon.discount_type === 'percentage' ? `${coupon.discount_value}% OFF` : `₹${coupon.discount_value} OFF`}</span>
                       <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                       <span>{coupon.is_active ? 'Active' : 'Inactive'}</span>
                    </div>
                    <h3 className="text-2xl font-heading font-black text-navy tracking-widest uppercase mb-1">{coupon.code}</h3>
                    <p className="text-slate-500 text-xs font-medium">
                      {(coupon.course_ids && coupon.course_ids.length > 0) 
                        ? `Valid for ${coupon.course_ids.length} course(s)` 
                        : (coupon.course_title ? `Valid for: ${coupon.course_title}` : 'Valid for all courses')}
                      {coupon.expiry_date && ` | Expires: ${new Date(coupon.expiry_date).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button 
                    onClick={() => { setCouponToEdit(coupon); setShowModal(true); }}
                    className="w-12 h-12 rounded-2xl bg-navy/5 text-navy flex items-center justify-center hover:bg-navy hover:text-white transition-all"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(coupon.id)}
                    className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
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
              onClick={() => { setShowModal(false); setCouponToEdit(null); }}
              className="absolute inset-0 bg-navy/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
                <div className="p-8 border-b border-navy/5 flex items-center justify-between bg-slate-50">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-navy text-primary flex items-center justify-center">
                         <Tag size={24} />
                      </div>
                      <div>
                         <h2 className="text-xl font-heading font-black text-navy uppercase tracking-tight">
                           {couponToEdit ? 'Edit Coupon' : 'New Coupon'}
                         </h2>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Discount Code</p>
                      </div>
                   </div>
                   <button 
                    type="button"
                    onClick={() => { setShowModal(false); setCouponToEdit(null); }}
                    className="w-10 h-10 rounded-full border border-navy/10 flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-all"
                   >
                     <ArrowLeft size={18} />
                   </button>
                </div>

                <div className="flex-grow overflow-y-auto p-10">
                   <div className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-navy uppercase tracking-widest">Coupon Code</label>
                         <input 
                            required
                            type="text" 
                            value={couponToEdit ? couponToEdit.code : newCoupon.code}
                            onChange={(e) => couponToEdit ? setCouponToEdit({...couponToEdit, code: e.target.value.toUpperCase()}) : setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                            className="w-full bg-slate-50 border border-navy/5 rounded-xl px-4 py-3.5 text-sm font-bold text-navy uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            placeholder="e.g. SUMMER50"
                         />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-navy uppercase tracking-widest">Discount Type</label>
                            <select 
                               value={couponToEdit ? couponToEdit.discount_type : newCoupon.discount_type}
                               onChange={(e) => couponToEdit ? setCouponToEdit({...couponToEdit, discount_type: e.target.value}) : setNewCoupon({...newCoupon, discount_type: e.target.value})}
                               className="w-full bg-slate-50 border border-navy/5 rounded-xl px-4 py-3.5 text-sm font-bold text-navy focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            >
                               <option value="percentage">Percentage (%)</option>
                               <option value="fixed">Fixed Amount (₹)</option>
                            </select>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-navy uppercase tracking-widest">Discount Value</label>
                            <input 
                               required
                               type="number" 
                               step="0.01"
                               value={couponToEdit ? couponToEdit.discount_value : newCoupon.discount_value}
                               onChange={(e) => couponToEdit ? setCouponToEdit({...couponToEdit, discount_value: e.target.value}) : setNewCoupon({...newCoupon, discount_value: e.target.value})}
                               className="w-full bg-slate-50 border border-navy/5 rounded-xl px-4 py-3.5 text-sm font-bold text-navy focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                               placeholder="e.g. 50"
                            />
                         </div>
                      </div>

                      <div className="space-y-2">
                         <div className="flex justify-between items-center">
                           <label className="text-[10px] font-black text-navy uppercase tracking-widest">Applicable Courses (Optional)</label>
                           <button 
                             type="button" 
                             onClick={() => {
                               const allIds = courses.map(c => c.id);
                               const currentIds = couponToEdit ? (couponToEdit.course_ids || []) : newCoupon.course_ids;
                               if (currentIds.length === allIds.length) {
                                 if (couponToEdit) setCouponToEdit({...couponToEdit, course_ids: []});
                                 else setNewCoupon({...newCoupon, course_ids: []});
                               } else {
                                 if (couponToEdit) setCouponToEdit({...couponToEdit, course_ids: allIds});
                                 else setNewCoupon({...newCoupon, course_ids: allIds});
                               }
                             }}
                             className="text-[10px] font-bold text-primary hover:underline"
                           >
                             Select / Deselect All
                           </button>
                         </div>
                         <div className="max-h-48 overflow-y-auto bg-slate-50 border border-navy/5 rounded-xl p-3 space-y-2">
                            {courses.length === 0 && <p className="text-xs text-slate-400">No courses available.</p>}
                            {courses.map(course => {
                               const currentIds = couponToEdit ? (couponToEdit.course_ids || []) : newCoupon.course_ids;
                               const isChecked = currentIds.includes(course.id);
                               return (
                                 <label key={course.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white cursor-pointer transition-colors">
                                   <input 
                                     type="checkbox"
                                     checked={isChecked}
                                     onChange={(e) => {
                                        let nextIds;
                                        if (e.target.checked) nextIds = [...currentIds, course.id];
                                        else nextIds = currentIds.filter(id => id !== course.id);
                                        
                                        if (couponToEdit) setCouponToEdit({...couponToEdit, course_ids: nextIds});
                                        else setNewCoupon({...newCoupon, course_ids: nextIds});
                                     }}
                                     className="w-4 h-4 rounded border-navy/20 text-primary focus:ring-primary"
                                   />
                                   <span className="text-xs font-bold text-navy">{course.title}</span>
                                 </label>
                               );
                            })}
                         </div>
                         <p className="text-[10px] text-slate-400 italic">Leave all unchecked to apply the coupon to <strong>all courses</strong>.</p>
                      </div>

                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-navy uppercase tracking-widest">Expiry Date (Optional)</label>
                         <input 
                            type="date" 
                            value={couponToEdit ? (couponToEdit.expiry_date ? new Date(new Date(couponToEdit.expiry_date).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0] : '') : newCoupon.expiry_date}
                            onChange={(e) => couponToEdit ? setCouponToEdit({...couponToEdit, expiry_date: e.target.value}) : setNewCoupon({...newCoupon, expiry_date: e.target.value})}
                            className="w-full bg-slate-50 border border-navy/5 rounded-xl px-4 py-3.5 text-sm font-bold text-navy focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                         />
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-navy/5 mt-4">
                         <input 
                            type="checkbox" 
                            checked={couponToEdit ? couponToEdit.is_active : newCoupon.is_active}
                            onChange={(e) => couponToEdit ? setCouponToEdit({...couponToEdit, is_active: e.target.checked}) : setNewCoupon({...newCoupon, is_active: e.target.checked})}
                            className="w-5 h-5 rounded border-navy/10 text-primary focus:ring-primary"
                         />
                         <label className="text-[10px] font-black text-navy uppercase tracking-widest cursor-pointer">Active</label>
                      </div>
                   </div>
                </div>

                <div className="p-8 bg-slate-50 border-t border-navy/5 flex items-center justify-end gap-4 shrink-0">
                   <button 
                    type="button"
                    onClick={() => { setShowModal(false); setCouponToEdit(null); }}
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
                     {couponToEdit ? 'Save Changes' : 'Create Coupon'}
                   </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <CustomModal 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        description={modalConfig.description}
        type={modalConfig.type}
        confirmText={modalConfig.confirmText}
      />
    </div>
  );
}
