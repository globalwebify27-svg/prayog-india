"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Layers, 
  X, 
  Check, 
  AlertCircle,
  Loader2,
  FileText
} from "lucide-react";
import CustomModal from "@/components/CustomModal";

export default function SpecializationsPage() {
  const [specializations, setSpecializations] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingSpec, setEditingSpec] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    description: "",
    type: "info",
    confirmText: "Confirm",
    showCancel: true,
    onConfirm: () => {}
  });

  const showAlert = (title, description, type = "info", onConfirm = () => {}, confirmText = "Confirm", showCancel = true) => {
    setModalConfig({
      isOpen: true,
      title,
      description,
      type,
      confirmText,
      showCancel,
      onConfirm
    });
  };

  useEffect(() => {
    fetchSpecializations();
  }, []);

  const fetchSpecializations = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/specializations");
      const data = await res.json();
      if (data.success) setSpecializations(data.specializations);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const url = "/api/admin/specializations";
      const method = editingSpec ? "PUT" : "POST";
      const body = editingSpec ? { ...formData, id: editingSpec.id } : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setEditingSpec(null);
        setFormData({ name: "", description: "" });
        fetchSpecializations();
        showAlert("Success", `Specialization ${editingSpec ? 'updated' : 'created'} successfully`, "success", () => {}, "OK", false);
      } else {
        showAlert("Error", data.message, "error", () => {}, "OK", false);
      }
    } catch (e) {
      showAlert("Error", "System failure", "error", () => {}, "OK", false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id) => {
    showAlert(
      "Confirm Delete",
      "Are you sure you want to remove this specialization? This will unassign it from all linked courses.",
      "warning",
      async () => {
        try {
          const res = await fetch(`/api/admin/specializations?id=${id}`, { method: "DELETE" });
          const data = await res.json();
          if (data.success) {
            fetchSpecializations();
            showAlert("Deleted", "Specialization removed", "success", () => {}, "OK", false);
          }
        } catch (e) {
          showAlert("Error", "Failed to delete", "error", () => {}, "OK", false);
        }
      },
      "Delete Now"
    );
  };

  const filtered = specializations.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 font-body">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Specialization Master</h1>
          <p className="text-slate-500 text-sm mt-1">Manage academic focus areas and technological domains.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search domains..." 
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-navy outline-none w-64 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button 
            onClick={() => {
              setEditingSpec(null);
              setFormData({ name: "", description: "" });
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-navy text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-black transition-all shadow-md"
          >
            <Plus size={18} />
            <span>New Domain</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Name</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan="3" className="px-6 py-20 text-center text-slate-400">
                  <Loader2 className="animate-spin mx-auto mb-2" size={32} />
                  <p className="text-xs font-medium uppercase tracking-widest">Fetching domains...</p>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-6 py-20 text-center text-slate-400">
                  <Layers className="mx-auto mb-2 opacity-20" size={48} />
                  <p className="text-sm font-bold text-slate-900">No domains found</p>
                  <p className="text-xs mt-1">Start by adding a new specialization category.</p>
                </td>
              </tr>
            ) : (
              filtered.map((spec) => (
                <tr key={spec.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-navy/5 flex items-center justify-center text-navy font-bold text-xs uppercase">
                        {spec.name.substring(0, 2)}
                      </div>
                      <span className="text-sm font-bold text-slate-900">{spec.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-slate-500 line-clamp-1 max-w-md">{spec.description || 'No description provided.'}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => {
                          setEditingSpec(spec);
                          setFormData({ name: spec.name, description: spec.description || "" });
                          setShowModal(true);
                        }}
                        className="p-2 hover:bg-white hover:text-navy rounded-lg border border-transparent hover:border-slate-200 transition-all text-slate-400"
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(spec.id)}
                        className="p-2 hover:bg-rose-50 hover:text-rose-600 rounded-lg border border-transparent hover:border-rose-100 transition-all text-slate-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/20"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{editingSpec ? 'Edit Domain' : 'New Domain'}</h3>
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-0.5">Specialization Master</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Domain Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-navy focus:bg-white transition-all font-medium"
                  placeholder="e.g. Artificial Intelligence"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Description</label>
                <textarea 
                  rows={4} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-navy focus:bg-white transition-all font-medium resize-none"
                  placeholder="Brief context about this domain..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3.5 rounded-xl text-slate-400 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all border border-slate-100"
                >
                  Cancel
                </button>
                <button 
                  disabled={isSaving}
                  className="flex-1 bg-navy text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-navy/20 hover:bg-black transition-all flex items-center justify-center gap-2"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  <span>{editingSpec ? 'Save Changes' : 'Initialize'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <CustomModal 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        description={modalConfig.description}
        type={modalConfig.type}
        confirmText={modalConfig.confirmText}
        showCancel={modalConfig.showCancel}
      />
    </div>
  );
}
