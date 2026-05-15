"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Briefcase,
  Book, 
  ChevronRight, 
  Search, 
  Plus, 
  Layout, 
  Clock, 
  Tag,
  User,
  Upload,
  Calendar,
  Trash2,
  Check,
  Edit,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  IndianRupee,
  Layers,
  Star,
  Settings2,
  AlertCircle,
  CheckCircle2,
  FileText
} from "lucide-react";
import CustomModal from "@/components/CustomModal";

const STEPS = [
  { id: 1, title: "Identity", sub: "Basic info & brand" },
  { id: 2, title: "Delivery", sub: "Faculty & logistics" },
  { id: 3, title: "Finance", sub: "Pricing & payments" },
  { id: 4, title: "Curriculum", sub: "Outcomes & Details" }
];

const SPECIALIZATIONS = [
  "Robotics",
  "Artificial Intelligence",
  "Aviation",
  "Electronics"
];

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [timings, setTimings] = useState([]);
  const [search, setSearch] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState(null);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [modalStep, setModalStep] = useState(1);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [specializations, setSpecializations] = useState([]);
  const [errors, setErrors] = useState({});

  // Modal State
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

  const validateStep = (data) => {
    let newErrors = {};
    if (modalStep === 1) {
      if (!data.title.trim()) newErrors.title = "Title is required.";
      if (!data.category) newErrors.category = "Category is required.";
    } else if (modalStep === 2) {
      // teacher_id is now optional
      if (!data.duration.trim()) newErrors.duration = "Duration is required.";
    } else if (modalStep === 3) {
      if (!data.price) newErrors.price = "Price is required.";
      if (data.allow_partial_payment && (!data.installments_count || data.installments_count < 2)) {
        newErrors.installments_count = "Min 2 installments required.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const [newCourse, setNewCourse] = useState({
    title: "",
    category: "Robotics",
    description: "",
    price: "",
    type: "online",
    duration: "6 Months",
    image: "",
    teacher_id: "",
    selectedTimings: [],
    selectedSpecializations: [],
    allow_partial_payment: false,
    installments_count: 1,
    rating: "4.5",
    level: "Beginner",
    brochure: "",
    is_internship: false,
    is_one_to_one: false,
    outcomes: "",
    certification: "",
    who_can_join: "",
    methodology: ""
  });

  useEffect(() => {
    fetchUser();
    fetchCourses();
    fetchTeachers();
    fetchTimings();
    fetchSpecializations();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.success) setUser(data.user);
    } catch (e) {}
  };

  const fetchTimings = async () => {
    const res = await fetch("/api/admin/timings");
    const result = await res.json();
    if (result.success) setTimings(result.timings);
  };

  const fetchTeachers = async () => {
    const res = await fetch("/api/admin/teachers");
    const result = await res.json();
    if (result.success) setTeachers(result.teachers);
  };

  const fetchSpecializations = async () => {
    const res = await fetch("/api/admin/specializations");
    const result = await res.json();
    if (result.success) setSpecializations(result.specializations);
  };

  const fetchCourses = async () => {
    const res = await fetch("/api/admin/courses");
    const result = await res.json();
    if (result.success) setCourses(result.courses);
  };

  const handleImageUpload = async (e, mode = 'add') => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        if (mode === 'add') {
          setNewCourse({ ...newCourse, image: data.url });
        } else {
          setCourseToEdit({ ...courseToEdit, image: data.url });
        }
      }
    } catch (error) {
      showAlert("Upload Failed", "A technical error occurred during the visual asset upload.", "error", () => {}, "OK", false);
    } finally {
      setIsUploading(false);
    }
  };

  const handleBrochureUpload = async (e, mode = 'add') => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        if (mode === 'add') {
          setNewCourse(prev => ({ ...prev, brochure: data.url }));
        } else {
          setCourseToEdit(prev => ({ ...prev, brochure: data.url }));
        }
      } else {
        showAlert("Brochure Failed", data.message || "Unable to process the brochure document.", "error", () => {}, "OK", false);
      }
    } catch (error) {
      showAlert("Upload Error", "System failure during brochure transmission.", "error", () => {}, "OK", false);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddCourse = async (e) => {
    if (e) e.preventDefault();
    if (!validateStep(newCourse)) return;

    if (modalStep < 3) {
      setModalStep(modalStep + 1);
      return;
    }
    setError("");
    setErrors({});
    const res = await fetch("/api/admin/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCourse)
    });
    const result = await res.json();
    if (result.success) {
      setShowAddModal(false);
      setModalStep(1);
      setNewCourse({ title: "", category: "Robotics", description: "", price: "", type: "online", duration: "6 Months", image: "", teacher_id: "", selectedTimings: [], allow_partial_payment: false, installments_count: 1, rating: "4.5", level: "Beginner", brochure: "", is_internship: false, is_one_to_one: false, outcomes: "", certification: "", who_can_join: "", methodology: "" });
      fetchCourses();
      setErrors({});
      showAlert("Course Launched", "The new academic program has been successfully initialized.", "success", () => {}, "OK", false);
    } else {
      setError(result.message);
    }
  };

  const handleUpdateCourse = async (e) => {
    if (e) e.preventDefault();
    if (!validateStep(courseToEdit)) return;

    if (modalStep < 3) {
      setModalStep(modalStep + 1);
      return;
    }
    setError("");
    setErrors({});
    const res = await fetch("/api/admin/courses", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(courseToEdit)
    });
    const result = await res.json();
    if (result.success) {
      setShowEditModal(false);
      setModalStep(1);
      setCourseToEdit(null);
      fetchCourses();
      setErrors({});
      showAlert("Course Updated", "Program modifications have been synchronized successfully.", "success", () => {}, "OK", false);
    } else {
      setError(result.message);
    }
  };

  const confirmDeleteCourse = async () => {
    setError("");
    const res = await fetch(`/api/admin/courses?id=${courseToDelete.id}`, {
      method: "DELETE"
    });
    const result = await res.json();
    if (result.success) {
      setShowDeleteModal(false);
      setCourseToDelete(null);
      fetchCourses();
    } else {
      setError(result.message);
    }
  };

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 font-body">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">LMS Management</h1>
          <p className="text-slate-500 text-sm mt-1">Configure learning paths, documents, and steps for students.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search courses..." 
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-navy outline-none w-64 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          {user?.role === 'admin' && (
            <button 
              onClick={() => {
                setModalStep(1);
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 bg-navy text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-black transition-all shadow-md"
            >
              <Plus size={18} />
              <span>Add Course</span>
            </button>
          )}
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-2xl p-20 border border-slate-200 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center mx-auto mb-4">
            <Book size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No courses found</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto italic">Start by adding a new academic program to configure its learning materials.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <motion.div 
              key={course.id}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              <div className="h-44 bg-slate-100 flex items-center justify-center text-slate-300 relative overflow-hidden">
                {course.image ? (
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <Layout size={48} />
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase shadow-sm ${course.type === 'online' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'}`}>
                    {course.type}
                  </span>
                  {course.specializations && course.specializations.map(s => (
                    <span key={s.id} className="px-2 py-0.5 bg-navy text-white rounded text-[9px] font-bold uppercase shadow-sm">
                      {s.name}
                    </span>
                  ))}
                  {course.is_internship === 1 && (
                    <span className="px-2 py-0.5 bg-primary text-navy rounded text-[9px] font-bold uppercase shadow-sm flex items-center gap-1">
                      <Briefcase size={8} /> Internship
                    </span>
                  )}
                  {course.is_one_to_one === 1 && (
                    <span className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[9px] font-bold uppercase shadow-sm flex items-center gap-1">
                      <Star size={8} /> 1:1 Training
                    </span>
                  )}
                </div>
              </div>
              <div className="p-6 flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-widest">
                    <Clock size={10} className="text-navy" /> {course.duration}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-widest">
                    <Tag size={10} className="text-navy" /> ₹{Number(course.price).toLocaleString()}
                  </span>
                </div>
                
                {course.timings && course.timings.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {course.timings.map(t => (
                      <span key={t.id} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[8px] font-bold uppercase tracking-tighter">
                        {t.name}
                      </span>
                    ))}
                  </div>
                )}

                <h3 className="text-base font-bold text-slate-900 mb-2 line-clamp-2 min-h-[3rem]">{course.title}</h3>
                
                <div className="flex items-center gap-2 mb-4 p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="w-8 h-8 rounded bg-white flex items-center justify-center border border-slate-200">
                    <User size={14} className="text-navy" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-none">Faculty</p>
                    <p className="text-xs font-bold text-slate-700 truncate w-32">{course.teacher_name || 'Unassigned'}</p>
                  </div>
                </div>

                <div className="space-y-2 mt-auto pt-4 border-t border-slate-100">
                  <Link 
                    href={`/admin/courses/${course.id}`}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-50 text-[10px] font-bold uppercase tracking-widest text-navy hover:bg-navy hover:text-white rounded-xl transition-all border border-slate-100"
                  >
                    <Layout size={12} /> Manage Learning Path
                  </Link>

                  {user?.role === 'admin' && (
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => {
                          setCourseToEdit({
                            ...course,
                            title: course.title || "",
                            description: course.description || "",
                            category: course.category || "Robotics",
                            price: course.price || "",
                            type: course.type || "online",
                            duration: course.duration || "6 Months",
                            image: course.image || "",
                            teacher_id: course.teacher_id || "",
                            brochure: course.brochure || "",
                            selectedTimings: course.timings ? course.timings.map(t => t.id) : [],
                            selectedSpecializations: course.specializations ? course.specializations.map(s => s.id) : [],
                            is_internship: !!course.is_internship,
                            is_one_to_one: !!course.is_one_to_one,
                            outcomes: course.outcomes || "",
                            certification: course.certification || "",
                            who_can_join: course.who_can_join || "",
                            methodology: course.methodology || ""
                          });
                          setModalStep(1);
                          setShowEditModal(true);
                        }}
                        className="flex items-center justify-center gap-2 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:text-navy hover:bg-slate-50 rounded-lg transition-all border border-transparent hover:border-slate-100"
                      >
                        <Edit size={12} /> Edit
                      </button>
                      <button 
                        onClick={() => {
                          showAlert(
                            "Confirm Deletion",
                            `Are you sure you want to delete "${course.title}"? This action cannot be undone and will affect all learning paths.`,
                            "warning",
                            async () => {
                              const res = await fetch(`/api/admin/courses?id=${course.id}`, { method: "DELETE" });
                              const result = await res.json();
                              if (result.success) {
                                fetchCourses();
                                showAlert("Deleted", "The course has been permanently removed.", "success", () => {}, "OK", false);
                              } else {
                                showAlert("Error", result.message, "error", () => {}, "OK", false);
                              }
                            },
                            "Delete Now"
                          );
                        }}
                        className="flex items-center justify-center gap-2 py-2 text-[10px] font-bold uppercase tracking-widest text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all border border-transparent hover:border-rose-100"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col lg:flex-row overflow-hidden min-h-[500px]">
            {/* Sidebar */}
            <div className="lg:w-1/3 bg-navy p-8 text-white flex flex-col justify-between">
              <div>
                <div className="mb-8">
                  <span className="text-primary font-bold text-[10px] uppercase tracking-widest">Course Setup</span>
                  <div className="w-10 h-0.5 bg-primary mt-2 rounded-full"></div>
                </div>
                <div className="space-y-6">
                  {STEPS.map((s) => (
                    <div key={s.id} className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-all ${
                        modalStep === s.id ? "bg-primary text-navy" : 
                        modalStep > s.id ? "bg-emerald-500 text-white" : "bg-white/10 text-white/30"
                      }`}>
                        {modalStep > s.id ? <Check size={16} /> : s.id}
                      </div>
                      <div>
                        <p className={`text-[10px] font-bold uppercase tracking-wide ${modalStep === s.id ? "text-white" : "text-white/40"}`}>{s.title}</p>
                        <p className="text-[9px] text-white/20">{s.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-8 border-t border-white/5 text-[9px] font-bold text-white/20 uppercase tracking-widest">Institutional CMS v2.0</div>
            </div>

            {/* Content */}
            <div className="lg:w-2/3 p-8 flex flex-col max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleAddCourse} className="flex-grow flex flex-col">
                <div className="flex-grow">
                  <AnimatePresence mode="wait">
                    {modalStep === 1 && (
                      <motion.div key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 mb-1">Core Identity</h3>
                          <p className="text-slate-500 text-xs">Define how this course is branded to students.</p>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Program Title</label>
                            <input 
                              required
                              className={`w-full bg-slate-50 border rounded-lg px-4 py-2.5 text-sm outline-none transition-all ${errors.title ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200 focus:border-navy'}`}
                              placeholder="e.g. Diploma in Industrial Robotics"
                              value={newCourse.title}
                              onChange={e => setNewCourse({...newCourse, title: e.target.value})}
                            />
                            {errors.title && <p className="text-[9px] text-rose-500 font-bold ml-1 mt-1">{errors.title}</p>}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Specializations (Select Multiple)</label>
                              <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg min-h-[42px]">
                                {specializations.map(s => (
                                  <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => {
                                      const exists = newCourse.selectedSpecializations.includes(s.id);
                                      if (exists) {
                                        setNewCourse({...newCourse, selectedSpecializations: newCourse.selectedSpecializations.filter(id => id !== s.id)});
                                      } else {
                                        setNewCourse({...newCourse, selectedSpecializations: [...newCourse.selectedSpecializations, s.id]});
                                      }
                                    }}
                                    className={`px-2 py-1 rounded text-[9px] font-bold uppercase transition-all ${
                                      newCourse.selectedSpecializations.includes(s.id) ? 'bg-navy text-white' : 'bg-white text-slate-400 border border-slate-200 hover:border-navy hover:text-navy'
                                    }`}
                                  >
                                    {s.name}
                                  </button>
                                ))}
                                {specializations.length === 0 && <span className="text-[9px] text-slate-400 italic py-1">No specializations defined</span>}
                              </div>
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Level</label>
                              <select 
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none cursor-pointer focus:border-navy"
                                value={newCourse.level || ""}
                                onChange={e => setNewCourse({...newCourse, level: e.target.value})}
                              >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                                <option value="Expert">Expert</option>
                              </select>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-center justify-between group hover:bg-primary/10 transition-all">
                              <div>
                                <p className="text-[10px] font-bold text-navy uppercase tracking-widest mb-0.5">Internship</p>
                                <p className="text-[9px] text-slate-500 font-medium italic leading-tight">Mark as internship opportunity.</p>
                              </div>
                              <button 
                                type="button"
                                onClick={() => setNewCourse({...newCourse, is_internship: !newCourse.is_internship})}
                                className={`w-10 h-5 rounded-full transition-all relative ${newCourse.is_internship ? 'bg-navy' : 'bg-slate-200'}`}
                              >
                                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${newCourse.is_internship ? 'left-5.5' : 'left-0.5'}`} />
                              </button>
                            </div>
                            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-between group hover:bg-emerald-100/50 transition-all">
                              <div>
                                <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-0.5">1:1 Training</p>
                                <p className="text-[9px] text-slate-500 font-medium italic leading-tight">Personalized one-on-one session.</p>
                              </div>
                              <button 
                                type="button"
                                onClick={() => setNewCourse({...newCourse, is_one_to_one: !newCourse.is_one_to_one})}
                                className={`w-10 h-5 rounded-full transition-all relative ${newCourse.is_one_to_one ? 'bg-emerald-600' : 'bg-slate-200'}`}
                              >
                                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${newCourse.is_one_to_one ? 'left-5.5' : 'left-0.5'}`} />
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Banner Image</label>
                            <input id="add-image" type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'add')} />
                            {newCourse.image ? (
                              <div className="relative h-28 rounded-xl overflow-hidden group border border-slate-200 shadow-sm">
                                <img src={newCourse.image} className="w-full h-full object-cover" />
                                <label htmlFor="add-image" className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer text-white text-[10px] font-bold uppercase">Change Image</label>
                              </div>
                            ) : (
                              <label htmlFor="add-image" className="flex flex-col items-center justify-center h-28 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-navy transition-all group">
                                {isUploading ? <div className="w-6 h-6 border-2 border-navy border-t-transparent rounded-full animate-spin" /> : (
                                  <>
                                    <Upload size={20} className="text-slate-300 group-hover:text-navy transition-colors" />
                                    <span className="text-[9px] font-bold text-slate-400 uppercase mt-2">Upload Visual</span>
                                  </>
                                )}
                              </label>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {modalStep === 2 && (
                      <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 mb-1">Operational Logistics</h3>
                          <p className="text-slate-500 text-xs">Assign faculty and configure timing slots.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Primary Faculty</label>
                            <select 
                              className={`w-full bg-slate-50 border rounded-lg px-4 py-2.5 text-sm outline-none cursor-pointer transition-all ${errors.teacher_id ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200 focus:border-navy'}`}
                              value={newCourse.teacher_id}
                              onChange={e => setNewCourse({...newCourse, teacher_id: e.target.value})}
                            >
                              <option value="">Select Faculty (Optional)</option>
                              {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                            {errors.teacher_id && <p className="text-[9px] text-rose-500 font-bold ml-1 mt-1">{errors.teacher_id}</p>}
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Course Type</label>
                            <select 
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:border-navy outline-none cursor-pointer"
                              value={newCourse.type}
                              onChange={e => setNewCourse({...newCourse, type: e.target.value})}
                            >
                              <option value="online">Online</option>
                              <option value="offline">Offline</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Duration</label>
                            <input 
                              className={`w-full bg-slate-50 border rounded-lg px-4 py-2.5 text-sm outline-none transition-all ${errors.duration ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200 focus:border-navy'}`}
                              value={newCourse.duration}
                              onChange={e => setNewCourse({...newCourse, duration: e.target.value})}
                            />
                            {errors.duration && <p className="text-[9px] text-rose-500 font-bold ml-1 mt-1">{errors.duration}</p>}
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Rating (0-5)</label>
                            <input 
                              type="text"
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:border-navy outline-none"
                              value={newCourse.rating || ""}
                              onChange={e => setNewCourse({...newCourse, rating: e.target.value})}
                            />
                          </div>
                        </div>
                        {/* Brochure Upload */}
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Course Brochure (PDF)</label>
                          <div className="flex items-center gap-4">
                            <label className="flex-grow flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 border-dashed rounded-lg cursor-pointer hover:bg-slate-100 transition-all">
                              <Upload size={16} className="text-navy/40" />
                              <span className="text-xs font-bold text-navy/60">
                                {newCourse.brochure ? "Change Brochure" : "Upload Brochure"}
                              </span>
                              <input 
                                type="file" 
                                className="hidden" 
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => handleBrochureUpload(e, 'add')} 
                              />
                            </label>
                            {newCourse.brochure && (
                              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
                                <CheckCircle2 size={14} />
                                <span className="text-[10px] font-bold truncate max-w-[120px]">
                                  {newCourse.brochure.split('/').pop()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Active Timing Slots</label>
                          <div className="flex flex-wrap gap-2">
                            {timings.map(t => (
                              <button
                                key={t.id}
                                type="button"
                                onClick={() => {
                                  const exists = newCourse.selectedTimings.includes(t.id);
                                  if (exists) {
                                    setNewCourse({...newCourse, selectedTimings: newCourse.selectedTimings.filter(id => id !== t.id)});
                                  } else {
                                    setNewCourse({...newCourse, selectedTimings: [...newCourse.selectedTimings, t.id]});
                                  }
                                }}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all border ${
                                  newCourse.selectedTimings.includes(t.id) ? 'bg-navy text-white border-navy' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-300'
                                }`}
                              >
                                {t.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {modalStep === 3 && (
                      <motion.div key="step3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 mb-1">Financial Architecture</h3>
                          <p className="text-slate-500 text-xs">Configure tuition fees and installment plans.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Full Price (INR)</label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                              <input 
                                type="number"
                                className={`w-full bg-slate-50 border rounded-lg pl-8 pr-4 py-2.5 text-sm outline-none transition-all ${errors.price ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200 focus:border-navy'}`}
                                value={newCourse.price}
                                onChange={e => setNewCourse({...newCourse, price: e.target.value})}
                              />
                            </div>
                            {errors.price && <p className="text-[9px] text-rose-500 font-bold ml-1 mt-1">{errors.price}</p>}
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Installments</label>
                            <div className="flex items-center gap-3 h-10">
                              <button 
                                type="button"
                                onClick={() => setNewCourse({...newCourse, allow_partial_payment: !newCourse.allow_partial_payment})}
                                className={`w-12 h-6 rounded-full transition-all relative ${newCourse.allow_partial_payment ? 'bg-navy' : 'bg-slate-200'}`}
                              >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${newCourse.allow_partial_payment ? 'left-7' : 'left-1'}`} />
                              </button>
                              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">Enable Plan</span>
                            </div>
                          </div>
                        </div>
                        {newCourse.allow_partial_payment && (
                          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                            <div className="w-1/2">
                              <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Cycles</label>
                              <input 
                                type="number" 
                                min="2" max="12"
                                className={`w-full bg-white border rounded-lg px-3 py-1.5 text-xs outline-none transition-all ${errors.installments_count ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200 focus:border-navy'}`}
                                value={newCourse.installments_count}
                                onChange={e => setNewCourse({...newCourse, installments_count: e.target.value === "" ? "" : parseInt(e.target.value)})}
                              />
                              {errors.installments_count && <p className="text-[8px] text-rose-500 font-bold ml-1 mt-1">{errors.installments_count}</p>}
                            </div>
                            <div className="text-right">
                              <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Per Cycle</p>
                              <p className="text-sm font-bold text-navy">₹{Math.round(newCourse.price / (newCourse.installments_count || 1)).toLocaleString()}</p>
                            </div>
                          </div>
                        )}
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Program Summary</label>
                          <textarea 
                            rows={3}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:border-navy outline-none resize-none"
                            placeholder="Briefly describe the learning outcome..."
                            value={newCourse.description}
                            onChange={e => setNewCourse({...newCourse, description: e.target.value})}
                          />
                        </div>
                      </motion.div>
                    )}

                    {modalStep === 4 && (
                      <motion.div key="step4" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 mb-1">Curriculum Details</h3>
                          <p className="text-slate-500 text-xs">Define program outcomes and methodology.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Learning Outcomes</label>
                            <textarea 
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-xs focus:border-navy outline-none"
                              rows={3}
                              placeholder="Key takeaways (one per line or use ^)"
                              value={newCourse.outcomes}
                              onChange={e => setNewCourse({...newCourse, outcomes: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Who Can Join?</label>
                            <textarea 
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-xs focus:border-navy outline-none"
                              rows={3}
                              placeholder="Eligibility criteria..."
                              value={newCourse.who_can_join}
                              onChange={e => setNewCourse({...newCourse, who_can_join: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Certification Details</label>
                            <textarea 
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-xs focus:border-navy outline-none"
                              rows={3}
                              placeholder="Certificate info..."
                              value={newCourse.certification}
                              onChange={e => setNewCourse({...newCourse, certification: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Workshop Methodology</label>
                            <textarea 
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-xs focus:border-navy outline-none"
                              rows={3}
                              placeholder="How the course is taught..."
                              value={newCourse.methodology}
                              onChange={e => setNewCourse({...newCourse, methodology: e.target.value})}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-slate-100 mt-8">
                  <button 
                    type="button"
                    onClick={() => modalStep > 1 ? setModalStep(modalStep - 1) : setShowAddModal(false)}
                    className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-navy transition-colors"
                  >
                    <ChevronLeft size={16} />
                    <span>{modalStep === 1 ? "Cancel" : "Back"}</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => {
                      if (validateStep(newCourse)) {
                        if (modalStep < 4) setModalStep(modalStep + 1);
                        else handleAddCourse();
                      }
                    }}
                    className="bg-navy text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-navy/20 flex items-center gap-2"
                  >
                    <span>{modalStep === 4 ? "Launch Program" : "Next Step"}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal (Mirrored Structure) */}
      {showEditModal && courseToEdit && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col lg:flex-row overflow-hidden min-h-[500px]">
            {/* Sidebar */}
            <div className="lg:w-1/3 bg-navy p-8 text-white flex flex-col justify-between">
              <div>
                <div className="mb-8">
                  <span className="text-primary font-bold text-[10px] uppercase tracking-widest">Update Course</span>
                  <div className="w-10 h-0.5 bg-primary mt-2 rounded-full"></div>
                </div>
                <div className="space-y-6">
                  {STEPS.map((s) => (
                    <div key={s.id} className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-all ${
                        modalStep === s.id ? "bg-primary text-navy" : 
                        modalStep > s.id ? "bg-emerald-500 text-white" : "bg-white/10 text-white/30"
                      }`}>
                        {modalStep > s.id ? <Check size={16} /> : s.id}
                      </div>
                      <div>
                        <p className={`text-[10px] font-bold uppercase tracking-wide ${modalStep === s.id ? "text-white" : "text-white/40"}`}>{s.title}</p>
                        <p className="text-[9px] text-white/20">{s.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-8 border-t border-white/5 text-[9px] font-bold text-white/20 uppercase tracking-widest">Institutional CMS v2.0</div>
            </div>

            {/* Content */}
            <div className="lg:w-2/3 p-8 flex flex-col max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleUpdateCourse} className="flex-grow flex flex-col">
                <div className="flex-grow">
                  <AnimatePresence mode="wait">
                    {modalStep === 1 && (
                      <motion.div key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 mb-1">Core Identity</h3>
                          <p className="text-slate-500 text-xs">Update the branding for this course.</p>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Program Title</label>
                            <input 
                              required
                              className={`w-full bg-slate-50 border rounded-lg px-4 py-2.5 text-sm outline-none transition-all ${errors.title ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200 focus:border-navy'}`}
                              value={courseToEdit.title}
                              onChange={e => setCourseToEdit({...courseToEdit, title: e.target.value})}
                            />
                            {errors.title && <p className="text-[9px] text-rose-500 font-bold ml-1 mt-1">{errors.title}</p>}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Specializations (Select Multiple)</label>
                              <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg min-h-[42px]">
                                {specializations.map(s => (
                                  <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => {
                                      const exists = courseToEdit.selectedSpecializations.includes(s.id);
                                      if (exists) {
                                        setCourseToEdit({...courseToEdit, selectedSpecializations: courseToEdit.selectedSpecializations.filter(id => id !== s.id)});
                                      } else {
                                        setCourseToEdit({...courseToEdit, selectedSpecializations: [...courseToEdit.selectedSpecializations, s.id]});
                                      }
                                    }}
                                    className={`px-2 py-1 rounded text-[9px] font-bold uppercase transition-all ${
                                      courseToEdit.selectedSpecializations.includes(s.id) ? 'bg-navy text-white' : 'bg-white text-slate-400 border border-slate-200 hover:border-navy hover:text-navy'
                                    }`}
                                  >
                                    {s.name}
                                  </button>
                                ))}
                                {specializations.length === 0 && <span className="text-[9px] text-slate-400 italic py-1">No specializations defined</span>}
                              </div>
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Level</label>
                              <select 
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none cursor-pointer focus:border-navy"
                                value={courseToEdit.level || ""}
                                onChange={e => setCourseToEdit({...courseToEdit, level: e.target.value})}
                              >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                                <option value="Expert">Expert</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-center justify-between group hover:bg-primary/10 transition-all">
                              <div>
                                <p className="text-[10px] font-bold text-navy uppercase tracking-widest mb-0.5">Internship</p>
                                <p className="text-[9px] text-slate-500 font-medium italic leading-tight">Mark as internship opportunity.</p>
                              </div>
                              <button 
                                type="button"
                                onClick={() => setCourseToEdit({...courseToEdit, is_internship: !courseToEdit.is_internship})}
                                className={`w-10 h-5 rounded-full transition-all relative ${courseToEdit.is_internship ? 'bg-navy' : 'bg-slate-200'}`}
                              >
                                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${courseToEdit.is_internship ? 'left-5.5' : 'left-0.5'}`} />
                              </button>
                            </div>
                            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-between group hover:bg-emerald-100/50 transition-all">
                              <div>
                                <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-0.5">1:1 Training</p>
                                <p className="text-[9px] text-slate-500 font-medium italic leading-tight">Personalized one-on-one session.</p>
                              </div>
                              <button 
                                type="button"
                                onClick={() => setCourseToEdit({...courseToEdit, is_one_to_one: !courseToEdit.is_one_to_one})}
                                className={`w-10 h-5 rounded-full transition-all relative ${courseToEdit.is_one_to_one ? 'bg-emerald-600' : 'bg-slate-200'}`}
                              >
                                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${courseToEdit.is_one_to_one ? 'left-5.5' : 'left-0.5'}`} />
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Banner Image</label>
                            <input id="edit-image" type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'edit')} />
                            {courseToEdit.image ? (
                              <div className="relative h-28 rounded-xl overflow-hidden group border border-slate-200 shadow-sm">
                                <img src={courseToEdit.image} className="w-full h-full object-cover" />
                                <label htmlFor="edit-image" className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer text-white text-[10px] font-bold uppercase">Change Image</label>
                              </div>
                            ) : (
                              <label htmlFor="edit-image" className="flex flex-col items-center justify-center h-28 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-navy transition-all group">
                                {isUploading ? <div className="w-6 h-6 border-2 border-navy border-t-transparent rounded-full animate-spin" /> : (
                                  <>
                                    <Upload size={20} className="text-slate-300 group-hover:text-navy transition-colors" />
                                    <span className="text-[9px] font-bold text-slate-400 uppercase mt-2">Upload Visual</span>
                                  </>
                                )}
                              </label>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {modalStep === 2 && (
                      <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 mb-1">Operational Logistics</h3>
                          <p className="text-slate-500 text-xs">Assign faculty and configure timing slots.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Primary Faculty</label>
                            <select 
                              className={`w-full bg-slate-50 border rounded-lg px-4 py-2.5 text-sm outline-none cursor-pointer transition-all ${errors.teacher_id ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200 focus:border-navy'}`}
                              value={courseToEdit.teacher_id || ""}
                              onChange={e => setCourseToEdit({...courseToEdit, teacher_id: e.target.value})}
                            >
                              <option value="">Select Faculty</option>
                              {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                            {errors.teacher_id && <p className="text-[9px] text-rose-500 font-bold ml-1 mt-1">{errors.teacher_id}</p>}
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Course Type</label>
                            <select 
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:border-navy outline-none cursor-pointer"
                              value={courseToEdit.type}
                              onChange={e => setCourseToEdit({...courseToEdit, type: e.target.value})}
                            >
                              <option value="online">Online</option>
                              <option value="offline">Offline</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Duration</label>
                            <input 
                              className={`w-full bg-slate-50 border rounded-lg px-4 py-2.5 text-sm outline-none transition-all ${errors.duration ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200 focus:border-navy'}`}
                              value={courseToEdit.duration}
                              onChange={e => setCourseToEdit({...courseToEdit, duration: e.target.value})}
                            />
                            {errors.duration && <p className="text-[9px] text-rose-500 font-bold ml-1 mt-1">{errors.duration}</p>}
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Rating (0-5)</label>
                            <input 
                              type="text"
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:border-navy outline-none"
                              value={courseToEdit.rating || ""}
                              onChange={e => setCourseToEdit({...courseToEdit, rating: e.target.value})}
                            />
                          </div>
                        </div>

                        {/* Brochure Upload */}
                        <div className="mb-6">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Course Brochure (PDF)</label>
                          <div className="flex items-center gap-4">
                            <label className="flex-grow flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 border-dashed rounded-lg cursor-pointer hover:bg-slate-100 transition-all">
                              <Upload size={16} className="text-navy/40" />
                              <span className="text-xs font-bold text-navy/60">
                                {courseToEdit.brochure ? "Change Brochure" : "Upload Brochure"}
                              </span>
                              <input 
                                type="file" 
                                className="hidden" 
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => handleBrochureUpload(e, 'edit')} 
                              />
                            </label>
                            {courseToEdit.brochure && (
                              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
                                <CheckCircle2 size={14} />
                                <span className="text-[10px] font-bold truncate max-w-[120px]">
                                  {courseToEdit.brochure.split('/').pop()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Active Timing Slots</label>
                          <div className="flex flex-wrap gap-2">
                            {timings.map(t => (
                              <button
                                key={t.id}
                                type="button"
                                onClick={() => {
                                  const exists = courseToEdit.selectedTimings.includes(t.id);
                                  if (exists) {
                                    setCourseToEdit({...courseToEdit, selectedTimings: courseToEdit.selectedTimings.filter(id => id !== t.id)});
                                  } else {
                                    setCourseToEdit({...courseToEdit, selectedTimings: [...courseToEdit.selectedTimings, t.id]});
                                  }
                                }}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all border ${
                                  courseToEdit.selectedTimings.includes(t.id) ? 'bg-navy text-white border-navy' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-300'
                                }`}
                              >
                                {t.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {modalStep === 3 && (
                      <motion.div key="step3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 mb-1">Financial Architecture</h3>
                          <p className="text-slate-500 text-xs">Configure tuition fees and installment plans.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Full Price (INR)</label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                              <input 
                                type="number"
                                className={`w-full bg-slate-50 border rounded-lg pl-8 pr-4 py-2.5 text-sm outline-none transition-all ${errors.price ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200 focus:border-navy'}`}
                                value={courseToEdit.price}
                                onChange={e => setCourseToEdit({...courseToEdit, price: e.target.value})}
                              />
                            </div>
                            {errors.price && <p className="text-[9px] text-rose-500 font-bold ml-1 mt-1">{errors.price}</p>}
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Installments</label>
                            <div className="flex items-center gap-3 h-10">
                              <button 
                                type="button"
                                onClick={() => setCourseToEdit({...courseToEdit, allow_partial_payment: !courseToEdit.allow_partial_payment})}
                                className={`w-12 h-6 rounded-full transition-all relative ${courseToEdit.allow_partial_payment ? 'bg-navy' : 'bg-slate-200'}`}
                              >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${courseToEdit.allow_partial_payment ? 'left-7' : 'left-1'}`} />
                              </button>
                              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">Enable Plan</span>
                            </div>
                          </div>
                        </div>
                        {courseToEdit.allow_partial_payment && (
                          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                            <div className="w-1/2">
                              <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Cycles</label>
                              <input 
                                type="number" 
                                min="2" max="12"
                                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-navy"
                                value={courseToEdit.installments_count}
                                onChange={e => setCourseToEdit({...courseToEdit, installments_count: e.target.value === "" ? "" : parseInt(e.target.value)})}
                              />
                            </div>
                            <div className="text-right">
                              <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Per Cycle</p>
                              <p className="text-sm font-bold text-navy">₹{Math.round(courseToEdit.price / (courseToEdit.installments_count || 1)).toLocaleString()}</p>
                            </div>
                          </div>
                        )}
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Program Summary</label>
                          <textarea 
                            rows={3}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:border-navy outline-none resize-none"
                            value={courseToEdit.description}
                            onChange={e => setCourseToEdit({...courseToEdit, description: e.target.value})}
                          />
                        </div>
                      </motion.div>
                    )}

                    {modalStep === 4 && (
                      <motion.div key="step4" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 mb-1">Curriculum Details</h3>
                          <p className="text-slate-500 text-xs">Define program outcomes and methodology.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Learning Outcomes</label>
                            <textarea 
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-xs focus:border-navy outline-none"
                              rows={3}
                              placeholder="Key takeaways (one per line or use ^)"
                              value={courseToEdit.outcomes}
                              onChange={e => setCourseToEdit({...courseToEdit, outcomes: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Who Can Join?</label>
                            <textarea 
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-xs focus:border-navy outline-none"
                              rows={3}
                              placeholder="Eligibility criteria..."
                              value={courseToEdit.who_can_join}
                              onChange={e => setCourseToEdit({...courseToEdit, who_can_join: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Certification Details</label>
                            <textarea 
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-xs focus:border-navy outline-none"
                              rows={3}
                              placeholder="Certificate info..."
                              value={courseToEdit.certification}
                              onChange={e => setCourseToEdit({...courseToEdit, certification: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Workshop Methodology</label>
                            <textarea 
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-xs focus:border-navy outline-none"
                              rows={3}
                              placeholder="How the course is taught..."
                              value={courseToEdit.methodology}
                              onChange={e => setCourseToEdit({...courseToEdit, methodology: e.target.value})}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                  <button 
                    type="button" 
                    onClick={() => modalStep === 1 ? setShowEditModal(false) : setModalStep(modalStep - 1)}
                    className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-navy uppercase tracking-widest transition-colors"
                  >
                    <ChevronLeft size={16} />
                    <span>{modalStep === 1 ? "Cancel" : "Back"}</span>
                  </button>
                  <button 
                    type="submit"
                    onClick={(e) => {
                      if (modalStep < 4) {
                        e.preventDefault();
                        if (validateStep(courseToEdit)) setModalStep(modalStep + 1);
                      }
                    }}
                    className="flex items-center gap-2 bg-navy text-white px-8 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg"
                  >
                    <span>{modalStep === 4 ? "Update Program" : "Next Step"}</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </form>
            </div>
          </div>
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
