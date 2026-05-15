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
  X,
  Eye,
  EyeOff,
  Trash2
} from "lucide-react";
import CustomModal from "@/components/CustomModal";

export default function StudentsAdmin() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [modeFilter, setModeFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [batchFilter, setBatchFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [menuOpen, setMenuOpen] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [courses, setCourses] = useState([]);
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    phone: "",
    password: "Password@123",
    course: "",
    mode: "offline",
    batch: "Morning (9AM - 11AM)",
    isInstallment: true,
    payment_method: "online"
  });
  const [errors, setErrors] = useState({});

  // Modal State
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

  const validateStudent = () => {
    let newErrors = {};
    if (!newStudent.name.trim()) newErrors.name = "Name is required.";
    if (!newStudent.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newStudent.email)) {
      newErrors.email = "Invalid email format.";
    }
    const phoneClean = newStudent.phone.replace(/[^0-9]/g, '');
    if (!newStudent.phone.trim()) {
      newErrors.phone = "Phone is required.";
    } else if (phoneClean.length < 10) {
      newErrors.phone = "Phone must be at least 10 digits.";
    }
    if (!newStudent.password) {
      newErrors.password = "Password is required.";
    } else if (newStudent.password.length < 6) {
      newErrors.password = "Min 6 characters.";
    }
    if (!newStudent.course) newErrors.course = "Course selection is required.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    fetchStudents();
    fetchCourses();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.success) setUser(data.user);
    } catch (e) {}
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses");
      const data = await res.json();
      if (Array.isArray(data)) {
        setCourses(data);
        if (data.length > 0) {
          setNewStudent(prev => ({ ...prev, course: data[0].title }));
        }
      }
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    }
  };

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

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!validateStudent()) return;
    
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent)
      });
      const data = await res.json();
      if (data.success) {
        setIsAddModalOpen(false);
        fetchStudents();
        setNewStudent({
          name: "",
          email: "",
          phone: "",
          password: "Password@123",
          course: courses[0]?.title || "",
          mode: "offline",
          batch: "Morning (9AM - 11AM)",
          isInstallment: true,
          payment_method: "online"
        });
        setErrors({});
        showAlert("Success", "New student enrollment has been initialized successfully.", "success");
      } else {
        setErrors({ submit: data.message });
      }
    } catch (error) {
      setErrors({ submit: "Failed to add student. Please try again." });
    }
  };

  const handleDeleteStudent = async (studentId, studentName) => {
    showAlert(
      "Confirm Deletion",
      `Are you absolutely sure you want to delete ${studentName}? This will permanently remove all their enrollments, payments, attendance, and certificates. This action cannot be undone.`,
      "warning",
      async () => {
        try {
          const res = await fetch(`/api/admin/students/${studentId}`, {
            method: "DELETE"
          });
          const data = await res.json();
          if (data.success) {
            showAlert("Deleted", "Student record and all associated data deleted successfully.", "success");
            fetchStudents();
            setMenuOpen(null);
          } else {
            showAlert("Error", data.message || "Failed to delete student", "error");
          }
        } catch (error) {
          console.error("Delete error:", error);
          showAlert("System Error", "An error occurred while deleting the student record.", "error");
        }
      },
      "Delete Now"
    );
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
                 (paymentFilter === "all" || e.payment_status === paymentFilter) &&
                 (methodFilter === "all" || e.payment_method === methodFilter);
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
            {user?.role === 'admin' && (
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-navy text-white px-4 py-2.5 rounded-lg font-bold text-xs flex items-center gap-2 hover:bg-black transition-all shadow-sm"
              >
                <Users size={16} />
                <span>Add Student</span>
              </button>
            )}
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
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payment Method</label>
              <select value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:border-navy outline-none transition-all">
                <option value="all">All Methods</option>
                <option value="online">Online</option>
                <option value="cash">Cash</option>
                <option value="bank_transfer">Bank Transfer</option>
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
                        <button onClick={() => showAlert("Suspension", "This account has been placed under administrative review.", "info")} className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors">
                          <ShieldAlert size={14} /> Suspend Account
                        </button>
                        <div className="h-px bg-slate-100 my-1" />
                        <button 
                          onClick={() => handleDeleteStudent(student.id, student.name)}
                          className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors font-bold"
                        >
                          <Trash2 size={14} /> Delete Record
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
      
      {/* Add Student Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Enroll New Student</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Academic Session 2026</p>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleAddStudent} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. John Doe"
                      value={newStudent.name}
                      onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                      className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs font-semibold outline-none focus:bg-white transition-all ${
                        errors.name ? "border-rose-300 focus:border-rose-500 bg-rose-50/30" : "border-slate-200 focus:border-navy"
                      }`}
                    />
                    {errors.name && <p className="text-[9px] text-rose-500 font-bold ml-1 mt-1">{errors.name}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input 
                      required
                      type="email" 
                      placeholder="john@example.com"
                      value={newStudent.email}
                      onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                      className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs font-semibold outline-none focus:bg-white transition-all ${
                        errors.email ? "border-rose-300 focus:border-rose-500 bg-rose-50/30" : "border-slate-200 focus:border-navy"
                      }`}
                    />
                    {errors.email && <p className="text-[9px] text-rose-500 font-bold ml-1 mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <input 
                      required
                      type="tel" 
                      placeholder="9876543210"
                      value={newStudent.phone}
                      onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})}
                      className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs font-semibold outline-none focus:bg-white transition-all ${
                        errors.phone ? "border-rose-300 focus:border-rose-500 bg-rose-50/30" : "border-slate-200 focus:border-navy"
                      }`}
                    />
                    {errors.phone && <p className="text-[9px] text-rose-500 font-bold ml-1 mt-1">{errors.phone}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Student Password</label>
                    <div className="relative">
                      <input 
                        required
                        type={showPassword ? "text" : "password"} 
                        value={newStudent.password}
                        onChange={(e) => setNewStudent({...newStudent, password: e.target.value})}
                        className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-xs font-semibold outline-none focus:bg-white transition-all pr-10 ${
                          errors.password ? "border-rose-300 focus:border-rose-500 bg-rose-50/30" : "border-slate-200 focus:border-navy"
                        }`}
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-[9px] text-rose-500 font-bold ml-1 mt-1">{errors.password}</p>}
                  </div>
                </div>

                <div className="h-px bg-slate-100 my-2" />

                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Enrollment Details</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-slate-500">Course</label>
                      <select 
                        required
                        value={newStudent.course}
                        onChange={(e) => setNewStudent({...newStudent, course: e.target.value})}
                        className={`w-full px-4 py-2.5 bg-white border rounded-xl text-xs font-semibold outline-none transition-all ${
                          errors.course ? "border-rose-300 focus:border-rose-500 bg-rose-50/30" : "border-slate-200 focus:border-navy"
                        }`}
                      >
                        <option value="">Select Course</option>
                        {courses.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                      </select>
                      {errors.course && <p className="text-[9px] text-rose-500 font-bold ml-1 mt-1">{errors.course}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-slate-500">Batch</label>
                      <select 
                        value={newStudent.batch}
                        onChange={(e) => setNewStudent({...newStudent, batch: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-navy transition-all"
                      >
                        <option>Morning (9AM - 11AM)</option>
                        <option>Evening (6PM - 8PM)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-slate-500">Learning Mode</label>
                      <select 
                        value={newStudent.mode}
                        onChange={(e) => setNewStudent({...newStudent, mode: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-navy transition-all"
                      >
                        <option value="offline">Offline Hub</option>
                        <option value="online">Online Live</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-slate-500">Payment Plan</label>
                      <select 
                        value={newStudent.isInstallment ? "true" : "false"}
                        onChange={(e) => setNewStudent({...newStudent, isInstallment: e.target.value === "true"})}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-navy transition-all"
                      >
                        <option value="true">Installments (EMI)</option>
                        <option value="false">Lump-sum Payment</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-500">Initial Payment Mode</label>
                    <select 
                      value={newStudent.payment_method}
                      onChange={(e) => setNewStudent({...newStudent, payment_method: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-navy transition-all"
                    >
                      <option value="online">Online (Gateway)</option>
                      <option value="cash">Cash Payment</option>
                      <option value="bank_transfer">Bank Transfer</option>
                    </select>
                    <p className="text-[9px] text-slate-400 font-medium italic mt-1">Select 'Cash' for walk-in enrollments to maintain accurate cashflow records.</p>
                  </div>
                </div>

                {errors.submit && (
                  <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-[10px] font-bold mb-4">
                    {errors.submit}
                  </div>
                )}

                <div className="pt-6">
                  <button type="submit" className="w-full bg-navy text-white py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-navy/10 flex items-center justify-center gap-2">
                    <BadgeCheck size={18} />
                    Confirm Enrollment
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
