"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  MapPin, 
  Clock, 
  User, 
  Calendar,
  Filter,
  ArrowRight,
  ExternalLink,
  RefreshCcw,
  FileSpreadsheet
} from "lucide-react";

export default function AttendanceAdmin() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [modeFilter, setModeFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [batchFilter, setBatchFilter] = useState("all");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/admin/attendance");
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs);
      }
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    return (modeFilter === "all" || log.mode === modeFilter) &&
           (courseFilter === "all" || log.course_name === courseFilter) &&
           (batchFilter === "all" || log.batch_name === batchFilter);
  });
  
  const uniqueCourses = [...new Set(logs.map(l => l.course_name).filter(Boolean))];
  const uniqueBatches = [...new Set(logs.map(l => l.batch_name).filter(Boolean))];

  return (
    <div className="space-y-6 font-body">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Attendance Ledger</h1>
          <p className="text-slate-500 text-sm mt-1">Verify presence with geo-location and biometric proofs.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2.5 border rounded-lg text-xs font-semibold transition-all shadow-sm ${showFilters ? 'bg-navy text-white border-navy' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            <Filter size={16} />
            <span>Filter</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all shadow-sm hidden md:flex">
            <FileSpreadsheet size={16} className="text-slate-400" />
            <span>Export CSV</span>
          </button>
          <button onClick={fetchLogs} className="flex items-center space-x-2 px-5 py-2.5 bg-navy text-white rounded-lg font-semibold text-sm hover:bg-black transition-all shadow-sm">
            <RefreshCcw size={16} className={isLoading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mode</label>
            <select value={modeFilter} onChange={(e) => setModeFilter(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:border-navy outline-none transition-all">
              <option value="all">All Modes</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Course</label>
            <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:border-navy outline-none transition-all">
              <option value="all">All Courses</option>
              {uniqueCourses.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Batch</label>
            <select value={batchFilter} onChange={(e) => setBatchFilter(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:border-navy outline-none transition-all">
              <option value="all">All Batches</option>
              {uniqueBatches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        </motion.div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500">Student Profile</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500">Verification Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500">Geographic Data</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500">Timestamp</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 text-right">Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <RefreshCcw className="animate-spin text-navy mx-auto mb-3" size={32} />
                    <p className="text-xs font-medium text-slate-400">Loading records...</p>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-24 text-center">
                    <User className="text-slate-200 mx-auto mb-3" size={32} />
                    <p className="text-slate-400 font-medium text-sm italic">No attendance records found for today.</p>
                  </td>
                </tr>
              ) : filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-lg bg-navy text-white flex items-center justify-center font-bold text-xs shadow-sm">{log.student_name.charAt(0)}</div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900 leading-tight">{log.student_name}</span>
                        <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-medium mt-1">
                          <span className={`uppercase font-bold ${log.mode === 'online' ? 'text-blue-500' : 'text-emerald-500'}`}>{log.mode}</span>
                          {log.course_name && (
                            <>
                              <span>•</span>
                              <span className="truncate max-w-[120px]" title={log.course_name}>{log.course_name}</span>
                            </>
                          )}
                          {log.batch_name && (
                            <>
                              <span>•</span>
                              <span>{log.batch_name}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center space-x-2 px-2.5 py-1 bg-emerald-50 border border-emerald-100 rounded-md">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-bold text-emerald-700 uppercase">Authenticated</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 text-slate-600">
                      <MapPin size={12} className="text-navy" />
                      <span className="text-[11px] font-medium">
                        {log.latitude && log.longitude 
                          ? `${Number(log.latitude).toFixed(4)}, ${Number(log.longitude).toFixed(4)}`
                          : "Location N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Clock size={12} className="text-navy" />
                      <span className="text-[11px] font-medium">{new Date(log.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {log.selfie_url ? (
                      <a 
                        href={log.selfie_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 text-navy hover:text-black transition-all group/link"
                      >
                        <span className="text-[11px] font-bold underline decoration-navy/20 underline-offset-4 group-hover/link:decoration-navy">View proof</span>
                        <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="text-slate-300 text-[11px] font-medium italic">No image</span>
                    )}
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
