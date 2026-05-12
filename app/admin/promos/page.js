"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Ticket, 
  Plus, 
  Trash2, 
  Calendar, 
  Tag, 
  Search,
  Filter,
  RefreshCcw,
  BookOpen,
  CheckCircle2,
  X,
  Percent,
  CircleDollarSign
} from "lucide-react";

export default function PromoManagement() {
  const [promos, setPromos] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState("");
  
  const [newPromo, setNewPromo] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: "",
    course_id: "",
    expiry_date: ""
  });

  useEffect(() => {
    fetchPromos();
    fetchCourses();
  }, []);

  const fetchPromos = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/promos");
      const data = await res.json();
      if (data.success) setPromos(data.promos);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/admin/courses");
      const data = await res.json();
      if (data.success) setCourses(data.courses);
    } catch (e) {}
  };

  const handleAddPromo = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/admin/promos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPromo)
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setNewPromo({ code: "", discount_type: "percentage", discount_value: "", course_id: "", expiry_date: "" });
        fetchPromos();
      } else {
        setError(data.message);
      }
    } catch (e) {
      setError("Failed to create promo code");
    }
  };

  const handleDeletePromo = async (id) => {
    if (!confirm("Are you sure you want to delete this promo code?")) return;
    try {
      const res = await fetch(`/api/admin/promos?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchPromos();
    } catch (e) {}
  };

  return (
    <div className="space-y-6 font-body">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Promotional Engine</h1>
          <p className="text-slate-500 text-sm mt-1">Manage course-specific discount codes and seasonal offers.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-5 py-2.5 bg-navy text-white rounded-xl font-bold text-sm hover:bg-black transition-all shadow-lg shadow-navy/10"
        >
          <Plus size={18} />
          <span>New Promo Code</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Code Details</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Applicable Course</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Value</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Expiry</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <RefreshCcw className="animate-spin text-navy mx-auto mb-3" size={32} />
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Syncing active offers...</p>
                  </td>
                </tr>
              ) : promos.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-24 text-center text-slate-400">
                    <Ticket size={48} className="mx-auto mb-4 opacity-10" />
                    <p className="text-sm font-medium italic">No active promo codes found.</p>
                  </td>
                </tr>
              ) : promos.map((promo) => (
                <tr key={promo.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs border border-emerald-100">
                        <Tag size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 tracking-wider font-mono uppercase">{promo.code}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Active Promo</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 text-slate-600">
                      <BookOpen size={14} className="text-navy" />
                      <span className="text-xs font-semibold">{promo.course_name || "All Courses"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${promo.discount_type === 'percentage' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                      {promo.discount_type === 'percentage' ? <Percent size={10} /> : <CircleDollarSign size={10} />}
                      <span>{promo.discount_value}{promo.discount_type === 'percentage' ? '%' : ' INR'} Off</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 text-slate-500">
                      <Calendar size={14} />
                      <span className="text-xs font-medium">
                        {promo.expiry_date ? new Date(promo.expiry_date).toLocaleDateString() : "Never"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDeletePromo(promo.id)}
                      className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Create New Promo</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddPromo} className="p-6 space-y-4">
              {error && <p className="text-xs font-bold text-rose-500 bg-rose-50 p-3 rounded-lg border border-rose-100">{error}</p>}
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Promo Code</label>
                <input 
                  required
                  placeholder="E.g. SUMMER50"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-mono uppercase focus:border-navy outline-none transition-all"
                  value={newPromo.code}
                  onChange={e => setNewPromo({...newPromo, code: e.target.value.toUpperCase()})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none cursor-pointer"
                    value={newPromo.discount_type}
                    onChange={e => setNewPromo({...newPromo, discount_type: e.target.value})}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (INR)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Value</label>
                  <input 
                    type="number"
                    required
                    placeholder="0"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-navy transition-all"
                    value={newPromo.discount_value}
                    onChange={e => setNewPromo({...newPromo, discount_value: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target Course</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none cursor-pointer"
                  value={newPromo.course_id}
                  onChange={e => setNewPromo({...newPromo, course_id: e.target.value})}
                >
                  <option value="">Apply to All Courses</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expiry Date</label>
                <input 
                  type="date"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-navy transition-all"
                  value={newPromo.expiry_date}
                  onChange={e => setNewPromo({...newPromo, expiry_date: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-lg transition-all">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-navy text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-navy/20 hover:bg-black">Create Promo</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
