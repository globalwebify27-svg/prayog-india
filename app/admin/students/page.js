"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  Calendar,
  ChevronRight,
  ChevronLeft,
  UserCheck,
  ShieldAlert,
  ArrowUpDown,
  CheckSquare,
  Square,
  XSquare,
  BadgeCheck,
  X
} from "lucide-react";

export default function StudentsAdmin() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [modeFilter, setModeFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [batchFilter, setBatchFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [menuOpen, setMenuOpen] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch("/api/admin/students");
      const data = await res.json();
      if (data.success) {
        setStudents(data.students);
      }
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const uniqueCourses = [...new Set(students.flatMap(s => s.enrollments?.map(e => e.course_name)).filter(Boolean))];
  const uniqueBatches = [...new Set(students.flatMap(s => s.enrollments?.map(e => e.batch_name)).filter(Boolean))];

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilters = true;
    if (modeFilter !== "all" || courseFilter !== "all" || batchFilter !== "all" || paymentFilter !== "all") {
      if (!s.enrollments || s.enrollments.length === 0) {
        matchesFilters = false;
      } else {
        matchesFilters = s.enrollments.some(e => {
          return (modeFilter === "all" || e.mode === modeFilter) &&
                 (courseFilter === "all" || e.course_name === courseFilter) &&
                 (batchFilter === "all" || e.batch_name === batchFilter) &&
                 (paymentFilter === "all" || e.payment_status === paymentFilter);
        });
      }
    }
    return matchesSearch && matchesFilters;
  });

  return (
    <div className="space-y-6 font-body">
      {/* Header & Filters */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Student Directory</h1>
            <p className="text-slate-500 text-sm mt-1">Manage institutional enrollments and academic records.</p>
          </div>
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search records..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-navy focus:ring-1 focus:ring-navy/5 transition-all text-xs font-medium w-full md:w-64"
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 rounded-lg border transition-all flex-shrink-0 ${showFilters ? 'bg-navy text-white border-navy' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
            >
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
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
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payment Status</label>
              <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:border-navy outline-none transition-all">
                <option value="all">All Statuses</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </motion.div>
        )}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 [&>th:first-child]:rounded-tl-2xl [&>th:last-child]:rounded-tr-2xl">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500">
                  <div className="flex items-center space-x-1 cursor-pointer hover:text-navy transition-colors">
                    <span>Student Profile</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500">Enrollment Info</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 text-center">Enrollment Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 text-center">Account Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-24 text-center">
                    <div className="w-8 h-8 border-2 border-slate-200 border-t-navy rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-24 text-center">
                    <Users size={32} className="text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-400 font-medium text-sm italic">No student records match your search criteria.</p>
                  </td>
                </tr>
              ) : filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-lg bg-navy flex items-center justify-center text-white font-bold text-xs shadow-sm">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{student.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">ID: PR-{10000 + student.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {student.enrollments && student.enrollments.length > 0 ? (
                      <div className="space-y-1.5">
                        {student.enrollments.map((e, i) => (
                          <div key={i} className="flex items-center space-x-2 text-xs">
                            <span className="font-semibold text-slate-700 truncate max-w-[120px]" title={e.course_name}>
                              {e.course_name.length > 15 ? e.course_name.substring(0, 15) + '...' : e.course_name}
                            </span>
                            <span className={`px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold uppercase ${e.mode === 'online' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                              {e.mode}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium truncate max-w-[90px]" title={e.batch_name}>{e.batch_name}</span>
                            
                            {/* Professional Payment Checklist */}
                            <div className="flex items-center pl-2 space-x-1 border-l border-slate-100 ml-1" title={`Payment: ${e.payment_status}`}>
                              {e.installments && e.installments.length > 0 ? (
                                e.installments.map((inst, idx) => {
                                  const isOverdue = inst.status === 'pending' && new Date(inst.due_date) < new Date();
                                  if (inst.status === 'paid') return <CheckSquare key={idx} size={14} className="text-emerald-500" />;
                                  if (isOverdue) return <XSquare key={idx} size={14} className="text-rose-500" />;
                                  return <Square key={idx} size={14} className="text-amber-400" />;
                                })
                              ) : (
                                e.payment_status === 'paid' ? (
                                  <BadgeCheck size={16} className="text-emerald-500" title="Paid in Full" />
                                ) : (
                                  <XSquare size={16} className="text-rose-500" title="Payment Pending" />
                                )
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">No active enrollments</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center space-x-1.5 text-slate-500">
                      <Calendar size={12} className="text-slate-400" />
                      <span className="text-[11px] font-medium">{new Date(student.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      student.role === "admin" 
                        ? "bg-amber-50 text-amber-700 border-amber-100" 
                        : "bg-emerald-50 text-emerald-700 border-emerald-100"
                    }`}>
                      {student.role === "admin" ? "Staff" : "Active Student"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <div className="flex items-center justify-end space-x-1">
                      <Link href={`/admin/students/${student.id}`} className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-navy transition-all" title="View Full Profile">
                        <ChevronRight size={18} />
                      </Link>
                      <button onClick={() => setMenuOpen(menuOpen === student.id ? null : student.id)} className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 transition-all" title="More Actions">
                        <MoreVertical size={18} />
                      </button>
                    </div>

                    {/* Dropdown Menu */}
                    {menuOpen === student.id && (
                      <div className="absolute right-6 top-14 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-10 text-left font-body">
                        <a href={`mailto:${student.email}`} className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-navy flex items-center gap-2 transition-colors">
                          <Mail size={14} /> Email Student
                        </a>
                        <a href={`tel:${student.phone}`} className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-navy flex items-center gap-2 transition-colors">
                          <Phone size={14} /> Call Student
                        </a>
                        <div className="h-px bg-slate-100 my-1" />
                        <button onClick={() => alert('Account suspended')} className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors">
                          <ShieldAlert size={14} /> Suspend Account
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Placeholder */}
      <div className="flex flex-col sm:flex-row justify-between items-center px-2 gap-4">
        <p className="text-xs font-medium text-slate-500">Showing {filteredStudents.length} of {students.length} active records</p>
        <div className="flex items-center space-x-1.5">
          <button className="p-2 rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:text-navy transition-all shadow-sm" title="Previous Page">
            <ChevronLeft size={16} />
          </button>
          <button className="w-8 h-8 rounded-lg bg-navy text-white text-[11px] font-bold shadow-sm">1</button>
          <button className="p-2 rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:text-navy transition-all shadow-sm" title="Next Page">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
