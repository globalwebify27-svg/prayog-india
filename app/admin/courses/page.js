"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
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
  Edit
} from "lucide-react";

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
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    price: "",
    type: "online",
    duration: "6 Months",
    image: "",
    teacher_id: "",
    selectedTimings: []
  });

  useEffect(() => {
    fetchUser();
    fetchCourses();
    fetchTeachers();
    fetchTimings();
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

  const fetchCourses = async () => {
    const res = await fetch("/api/admin/courses");
    const result = await res.json();
    if (result.success) setCourses(result.courses);
  };

  const handleImageUpload = async (e) => {
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
        setNewCourse({ ...newCourse, image: data.url });
      }
    } catch (error) {
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCourse)
    });
    const result = await res.json();
    if (result.success) {
      setShowAddModal(false);
      setNewCourse({ title: "", description: "", price: "", type: "online", duration: "6 Months", image: "", teacher_id: "", selectedTimings: [] });
      fetchCourses();
    } else {
      setError(result.message);
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/courses", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(courseToEdit)
    });
    const result = await res.json();
    if (result.success) {
      setShowEditModal(false);
      setCourseToEdit(null);
      fetchCourses();
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
              onClick={() => setShowAddModal(true)}
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
                            selectedTimings: course.timings.map(t => t.id)
                          });
                          setShowEditModal(true);
                        }}
                        className="flex items-center justify-center gap-2 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:text-navy hover:bg-slate-50 rounded-lg transition-all border border-transparent hover:border-slate-100"
                      >
                        <Edit size={12} /> Edit
                      </button>
                      <button 
                        onClick={() => {
                          setCourseToDelete(course);
                          setShowDeleteModal(true);
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900">Add New Course</h3>
            </div>
            <form onSubmit={handleAddCourse} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Course Title</label>
                <input 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:border-navy outline-none transition-all"
                  placeholder="e.g. Full Stack Web Development"
                  value={newCourse.title}
                  onChange={e => setNewCourse({...newCourse, title: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Course Image</label>
                <div className="relative">
                  {newCourse.image ? (
                    <div className="relative rounded-xl overflow-hidden h-24 bg-slate-100 border border-slate-200 group">
                      <img src={newCourse.image} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                        <label className="cursor-pointer bg-white text-navy px-3 py-1 rounded-lg text-[9px] font-bold uppercase">Change</label>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-navy transition-all group">
                      {isUploading ? (
                        <div className="w-6 h-6 border-4 border-slate-100 border-t-navy rounded-full animate-spin" />
                      ) : (
                        <>
                          <Upload size={18} className="text-slate-300 group-hover:text-navy transition-all" />
                          <span className="text-[9px] font-bold text-slate-400 uppercase mt-1">Upload Banner</span>
                        </>
                      )}
                    </label>
                  )}
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Type</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none cursor-pointer"
                    value={newCourse.type}
                    onChange={e => setNewCourse({...newCourse, type: e.target.value})}
                  >
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Duration</label>
                  <input 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none"
                    value={newCourse.duration}
                    onChange={e => setNewCourse({...newCourse, duration: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Price (INR)</label>
                  <input 
                    type="number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none"
                    value={newCourse.price}
                    onChange={e => setNewCourse({...newCourse, price: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Faculty</label>
                  <div className="relative">
                    <User size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-4 py-2 text-sm outline-none cursor-pointer appearance-none"
                      value={newCourse.teacher_id}
                      onChange={e => setNewCourse({...newCourse, teacher_id: e.target.value})}
                    >
                      <option value="">Select</option>
                      {teachers.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Available Timing Slots</label>
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
                        newCourse.selectedTimings.includes(t.id)
                          ? 'bg-navy text-white border-navy shadow-sm'
                          : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-300'
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Short Description</label>
                <textarea 
                  rows={1}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:border-navy outline-none transition-all resize-none"
                  value={newCourse.description}
                  onChange={e => setNewCourse({...newCourse, description: e.target.value})}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-lg transition-all">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-navy text-white rounded-lg text-xs font-bold transition-all shadow-md hover:bg-black">Create Course</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && courseToEdit && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900">Edit Course</h3>
            </div>
            <form onSubmit={handleUpdateCourse} className="p-6 space-y-4">
              {error && <p className="text-xs font-bold text-rose-500 bg-rose-50 p-3 rounded-lg border border-rose-100">{error}</p>}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Course Title</label>
                <input 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:border-navy outline-none transition-all"
                  value={courseToEdit.title}
                  onChange={e => setCourseToEdit({...courseToEdit, title: e.target.value})}
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Course Image</label>
                <div className="relative">
                  {courseToEdit.image ? (
                    <div className="relative rounded-xl overflow-hidden h-24 bg-slate-100 border border-slate-200 group">
                      <img src={courseToEdit.image} className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => setCourseToEdit({...courseToEdit, image: ""})}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-white text-[9px] font-bold uppercase tracking-widest"
                      >
                        Change Image
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-20 border-2 border-dashed border-slate-200 rounded-xl hover:border-navy/20 hover:bg-slate-50 transition-all cursor-pointer">
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setIsUploading(true);
                            const formData = new FormData();
                            formData.append("file", file);
                            formData.append("upload_preset", "prayog_india");
                            const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                              method: "POST",
                              body: formData
                            });
                            const data = await res.json();
                            setCourseToEdit({...courseToEdit, image: data.secure_url});
                            setIsUploading(false);
                          }
                        }}
                      />
                      <Image size={16} className="text-slate-400 mb-1" />
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{isUploading ? "Uploading..." : "Click to Upload"}</span>
                    </label>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Type</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none cursor-pointer"
                    value={courseToEdit.type}
                    onChange={e => setCourseToEdit({...courseToEdit, type: e.target.value})}
                  >
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Duration</label>
                  <input 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none"
                    value={courseToEdit.duration}
                    onChange={e => setCourseToEdit({...courseToEdit, duration: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Price (INR)</label>
                  <input 
                    type="number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none"
                    value={courseToEdit.price}
                    onChange={e => setCourseToEdit({...courseToEdit, price: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Faculty</label>
                  <div className="relative">
                    <User size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-4 py-2 text-sm outline-none cursor-pointer appearance-none"
                      value={courseToEdit.teacher_id || ""}
                      onChange={e => setCourseToEdit({...courseToEdit, teacher_id: e.target.value})}
                    >
                      <option value="">Select</option>
                      {teachers.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Available Timing Slots</label>
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
                        courseToEdit.selectedTimings.includes(t.id)
                          ? 'bg-navy text-white border-navy shadow-sm'
                          : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-300'
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Short Description</label>
                <textarea 
                  rows={1}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:border-navy outline-none transition-all resize-none"
                  value={courseToEdit.description}
                  onChange={e => setCourseToEdit({...courseToEdit, description: e.target.value})}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-lg transition-all">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-navy text-white rounded-lg text-xs font-bold transition-all shadow-md hover:bg-black">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && courseToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden"
          >
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={40} className="text-rose-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Program?</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Are you sure you want to delete <span className="font-bold text-slate-800">"{courseToDelete.title}"</span>? This action cannot be undone.
              </p>
              {error && (
                <div className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-xl">
                  <p className="text-xs font-bold text-rose-500 leading-tight">{error}</p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 border-t border-slate-100 h-16">
              <button 
                onClick={() => {
                  setShowDeleteModal(false);
                  setError("");
                }}
                className="text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteCourse}
                className="text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all border-l border-slate-100"
              >
                Yes, Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
