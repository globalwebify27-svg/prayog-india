"use client";

import { useState, useEffect } from "react";
import {
  Users, 
  TrendingUp, 
  Building2, 
  Plus, 
  Pencil, 
  Trash2, 
  ChevronRight, 
  Search,
  LayoutDashboard,
  CheckCircle2,
  RefreshCcw,
  PlusCircle
} from "lucide-react";
import { motion } from "framer-motion";
import PlacementModal from "@/components/admin/PlacementModal";

export default function AdminPlacementsPage() {
  const [alumni, setAlumni] = useState([]);
  const [stats, setStats] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("alumni");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [alumniRes, statsRes, partnersRes] = await Promise.all([
        fetch("/api/placements/alumni"),
        fetch("/api/placements/stats"),
        fetch("/api/placements/partners")
      ]);
      setAlumni(await alumniRes.json());
      setStats(await statsRes.json());
      setPartners(await partnersRes.json());
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAlumni = async (formData) => {
    try {
      const method = formData.id ? "PUT" : "POST";
      const res = await fetch("/api/placements/alumni", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
      }
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  const handleDeleteAlumni = async (id) => {
    if (!confirm("Are you sure you want to remove this profile?")) return;
    try {
      const res = await fetch(`/api/placements/alumni?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleUpdateStat = async (stat) => {
    try {
      const res = await fetch("/api/placements/stats", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stat)
      });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Update stat failed:", error);
    }
  };

  const handleAddPartner = async () => {
    const name = prompt("Enter Partner Name:");
    if (!name) return;
    try {
      const res = await fetch("/api/placements/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
      });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Add partner failed:", error);
    }
  };

  const handleDeletePartner = async (id) => {
    if (!confirm("Remove this partner?")) return;
    try {
      const res = await fetch(`/api/placements/partners?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Delete partner failed:", error);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black text-navy font-display mb-2">Placements Dashboard</h1>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Institutional Career Management
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={fetchData}
              className="p-4 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-navy hover:shadow-xl transition-all"
            >
              <RefreshCcw size={18} />
            </button>
            <button 
              onClick={() => {
                setSelectedAlumni(null);
                setIsModalOpen(true);
              }}
              className="bg-navy text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-navy/20 hover:scale-105 transition-all flex items-center gap-3"
            >
              <PlusCircle size={18} className="text-primary" />
              Add Record
            </button>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 mb-10 gap-8">
          {[
            { id: "alumni", label: "Alumni Profiles", icon: Users },
            { id: "stats", label: "Market Stats", icon: TrendingUp },
            { id: "partners", label: "Hiring Partners", icon: Building2 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-6 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 transition-all relative ${activeTab === tab.id ? 'text-navy' : 'text-slate-300'}`}
            >
              <tab.icon size={16} className={activeTab === tab.id ? 'text-primary' : ''} />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-1 bg-navy rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Alumni List */}
          {activeTab === "alumni" && (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {alumni.map(person => (
                <div key={person.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm group hover:shadow-2xl hover:shadow-navy/5 transition-all">
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-16 h-16 rounded-3xl overflow-hidden border-4 border-slate-50 shadow-md">
                      <img src={person.image_url} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setSelectedAlumni(person);
                          setIsModalOpen(true);
                        }}
                        className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:text-navy transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button 
                        onClick={() => handleDeleteAlumni(person.id)}
                        className="p-3 rounded-2xl bg-rose-50 text-rose-300 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-lg font-black text-navy mb-1">{person.name}</h3>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-4">{person.role}</p>
                  <p className="text-xs text-slate-400 font-bold flex items-center gap-2 mb-6">
                    <Building2 size={12} /> {person.company}
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed italic line-clamp-3">"{person.story}"</p>
                </div>
              ))}
            </div>
          )}

          {/* Stats Editor */}
          {activeTab === "stats" && (
            <div className="grid md:grid-cols-2 gap-8">
              {stats.map(stat => (
                <div key={stat.id} className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Performance Metric</span>
                    <TrendingUp className="text-primary" size={20} />
                  </div>
                  <div className="space-y-4">
                    <input 
                      type="text"
                      value={stat.label}
                      onChange={(e) => {
                        const newStats = stats.map(s => s.id === stat.id ? {...s, label: e.target.value} : s);
                        setStats(newStats);
                      }}
                      className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400"
                    />
                    <input 
                      type="text"
                      value={stat.value}
                      onChange={(e) => {
                        const newStats = stats.map(s => s.id === stat.id ? {...s, value: e.target.value} : s);
                        setStats(newStats);
                      }}
                      className="w-full bg-slate-50 border border-slate-100 p-6 rounded-2xl text-4xl font-black text-navy tracking-tight"
                    />
                    <textarea 
                      value={stat.description}
                      onChange={(e) => {
                        const newStats = stats.map(s => s.id === stat.id ? {...s, description: e.target.value} : s);
                        setStats(newStats);
                      }}
                      rows={2}
                      className="w-full bg-slate-50 border border-slate-100 p-6 rounded-2xl text-xs font-bold text-slate-500 italic resize-none"
                    />
                  </div>
                  <button 
                    onClick={() => handleUpdateStat(stat)}
                    className="w-full py-4 bg-navy text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all"
                  >
                    Update Metric
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Partners Editor */}
          {activeTab === "partners" && (
            <div className="space-y-8">
              <div className="flex justify-end">
                <button 
                  onClick={handleAddPartner}
                  className="bg-navy text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-navy/20"
                >
                  <Plus size={16} className="text-primary" /> Add Partner
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {partners.map(p => (
                  <div key={p.id} className="bg-white p-6 rounded-3xl border border-slate-100 relative group text-center shadow-sm hover:shadow-xl transition-all">
                    <span className="text-xs font-black text-navy">{p.name}</span>
                    <button 
                      onClick={() => handleDeletePartner(p.id)}
                      className="absolute -top-2 -right-2 p-2 bg-rose-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      <PlacementModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        alumni={selectedAlumni}
        onSave={handleSaveAlumni}
      />
    </div>
  );
}
