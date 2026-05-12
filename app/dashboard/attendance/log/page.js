"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  MapPin, 
  RefreshCcw, 
  CheckCircle2, 
  Clock,
  Search,
  Calendar
} from "lucide-react";

export default function AttendanceLogPage() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/student/attendance/history");
      const data = await res.json();
      if (data.success) {
        setHistory(data.logs);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredHistory = history.filter(log => 
    log.course_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.location_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-body pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Attendance History</h1>
          <p className="text-slate-500 text-sm mt-1">Review your verified presence logs across all programs.</p>
        </div>
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search programs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs outline-none focus:border-navy transition-all shadow-sm"
            />
          </div>
          <button onClick={fetchHistory} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all shadow-sm">
            <RefreshCcw size={16} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Academic Program</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verification Time</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hub Location</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-20 text-center">
                    <RefreshCcw size={32} className="animate-spin text-navy mx-auto mb-3" />
                    <span className="text-xs font-medium text-slate-400">Syncing logs...</span>
                  </td>
                </tr>
              ) : filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-24 text-center">
                    <Calendar size={32} className="text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-400 font-medium text-sm italic">No attendance records matching your search.</p>
                  </td>
                </tr>
              ) : filteredHistory.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900 group-hover:text-navy transition-colors">{log.course_name}</span>
                      <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{log.batch_name || "Institutional Hub"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-navy shrink-0 border border-slate-100">
                        <Clock size={14} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-slate-700">{new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{new Date(log.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-2 text-slate-500">
                      <MapPin size={12} className="text-navy shrink-0 mt-0.5" />
                      <div className="flex flex-col">
                        <span className="text-[11px] font-medium text-slate-600 line-clamp-1 max-w-[250px]" title={log.location_name}>
                          {log.location_name || "Location Verified"}
                        </span>
                        <span className="text-[9px] text-slate-400 font-medium">GPS Authenticated</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-[10px] font-bold text-emerald-600 uppercase tracking-tight">
                      <CheckCircle2 size={12} />
                      <span>Verified</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
