"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  Calendar, 
  Mail, 
  User, 
  MessageSquare,
  Clock,
  ExternalLink,
  Trash2,
  CheckCircle2,
  MoreVertical,
  ChevronRight,
  Phone
} from "lucide-react";

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/contact");
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads);
      }
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Leads & Enquiries</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and respond to student inquiries from the website.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-navy transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search leads..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl w-64 outline-none focus:border-navy transition-all text-sm font-medium shadow-sm"
            />
          </div>
          <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:border-navy hover:text-navy transition-all shadow-sm">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Leads List */}
        <div className="lg:col-span-1 space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 scrollbar-hide">
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-white rounded-2xl border border-slate-200 animate-pulse" />
            ))
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-400 text-sm">No leads found.</p>
            </div>
          ) : (
            filteredLeads.map((lead) => (
              <motion.div
                key={lead.id}
                layoutId={`lead-${lead.id}`}
                onClick={() => setSelectedLead(lead)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedLead?.id === lead.id 
                    ? "bg-navy text-white border-navy shadow-lg shadow-navy/10" 
                    : "bg-white text-slate-900 border-slate-200 hover:border-navy hover:shadow-md"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      selectedLead?.id === lead.id ? "bg-white/10 text-white" : "bg-navy/5 text-navy"
                    }`}>
                      {lead.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold truncate w-32">{lead.name}</h3>
                      <p className={`text-[10px] ${selectedLead?.id === lead.id ? "text-white/60" : "text-slate-400"}`}>
                        {new Date(lead.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      selectedLead?.id === lead.id ? "bg-primary text-navy" : "bg-blue-50 text-blue-600"
                    }`}>
                      {lead.type}
                    </div>
                  </div>
                  <div className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                    selectedLead?.id === lead.id ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-600"
                  }`}>
                    New
                  </div>
                </div>
                <h4 className={`text-[11px] font-bold mt-2 truncate ${selectedLead?.id === lead.id ? "text-primary" : "text-navy"}`}>
                  {lead.subject}
                </h4>
                <p className={`text-[10px] mt-1 line-clamp-1 ${selectedLead?.id === lead.id ? "text-white/40" : "text-slate-500"}`}>
                  {lead.message}
                </p>
              </motion.div>
            ))
          )}
        </div>

        {/* Lead Detail */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedLead ? (
              <motion.div
                key={selectedLead.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col h-full min-h-[500px]"
              >
                {/* Detail Header */}
                <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-5">
                      <div className="w-16 h-16 rounded-2xl bg-navy text-white flex items-center justify-center text-2xl font-bold shadow-xl shadow-navy/20">
                        {selectedLead.name.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-navy">{selectedLead.name}</h2>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center space-x-1.5 text-slate-500 text-sm">
                            <Mail size={14} className="text-primary" />
                            <span>{selectedLead.email}</span>
                          </div>
                          <div className="flex items-center space-x-1.5 text-slate-500 text-sm">
                            <Clock size={14} className="text-primary" />
                            <span>{new Date(selectedLead.created_at).toLocaleString()}</span>
                          </div>
                          {selectedLead.phone && (
                            <div className="flex items-center space-x-1.5 text-slate-500 text-sm">
                              <Phone size={14} className="text-primary" />
                              <span>{selectedLead.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2.5 text-slate-400 hover:text-navy hover:bg-slate-100 rounded-xl transition-all">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Detail Content */}
                <div className="p-8 space-y-8 flex-grow">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Tag size={12} className="text-primary" /> Subject
                    </label>
                    <h3 className="text-lg font-bold text-navy leading-tight">{selectedLead.subject}</h3>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <MessageSquare size={12} className="text-primary" /> Message Body
                    </label>
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 italic text-slate-600 leading-relaxed text-sm">
                      "{selectedLead.message}"
                    </div>
                  </div>
                </div>

                {/* Detail Footer / Actions */}
                <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-end mt-auto">
                  <div className="flex items-center space-x-3">
                    <button className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:border-navy hover:text-navy transition-all">
                      Archive Lead
                    </button>
                    <button className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full min-h-[500px] bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center p-12">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                  <User size={32} className="text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-400">Select a lead to view details</h3>
                <p className="text-sm text-slate-400 mt-2 max-w-xs leading-relaxed">
                  Click on an enquiry from the list on the left to see the full message and take action.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Tag({ size, className }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2z" />
      <path d="M7 7h.01" />
    </svg>
  );
}
