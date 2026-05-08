"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Trash2, Edit2, User, BookOpen, Star, Upload, Loader2 } from "lucide-react";

export default function AdminFaculties() {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [courses, setCourses] = useState([]);
  const [courseTab, setCourseTab] = useState("online");
  const [newFaculty, setNewFaculty] = useState({
    name: "",
    email: "",
    password: "Teacher@123",
    role: "Senior Faculty",
    specialty: "",
    image: "",
    bio: "",
    education: "",
    expertise: "",
    selectedCourses: [],
    selectedTimings: []
  });
  const [availableTimings, setAvailableTimings] = useState([]);

  useEffect(() => {
    fetchFaculties();
    fetchCourses();
    fetchAvailableTimings();
  }, []);

  const fetchAvailableTimings = async () => {
    const res = await fetch("/api/admin/timings");
    const data = await res.json();
    if (data.success) setAvailableTimings(data.timings);
  };

  const fetchCourses = async () => {
    const res = await fetch("/api/courses");
    const data = await res.json();
    if (Array.isArray(data)) setCourses(data);
  };

  const fetchFaculties = async () => {
    setLoading(true);
    const res = await fetch("/api/faculties");
    const data = await res.json();
    setFaculties(data);
    setLoading(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setNewFaculty({ ...newFaculty, image: data.url });
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (e) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (activeStep < 3) {
      setActiveStep(activeStep + 1);
      return;
    }
    setError("");
    const method = isEditing ? "PUT" : "POST";
    const expertiseArray = typeof newFaculty.expertise === 'string' ? newFaculty.expertise.split(",").map(i => i.trim()) : newFaculty.expertise;
    const payload = isEditing ? { ...newFaculty, id: editingId, expertise: expertiseArray } : { ...newFaculty, expertise: expertiseArray };

    try {
      const res = await fetch("/api/faculties", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setIsEditing(false);
        setEditingId(null);
        setNewFaculty({ name: "", email: "", password: "Teacher@123", role: "Senior Faculty", specialty: "", image: "", bio: "", education: "", expertise: "", selectedCourses: [], selectedTimings: [] });
        fetchFaculties();
        setActiveStep(1);
      } else {
        setError(data.error || "Failed to process request");
      }
    } catch (err) {
      setError("Server connection failed");
    }
  };

  const handleEdit = (faculty) => {
    setNewFaculty({
      name: faculty.name,
      email: faculty.email,
      password: "********",
      role: faculty.role,
      specialty: faculty.specialty,
      image: faculty.image || "",
      bio: faculty.bio || "",
      expertise: Array.isArray(faculty.expertise) ? faculty.expertise.join(", ") : (faculty.expertise || ""),
      education: faculty.education || "",
      selectedCourses: faculty.selectedCourses || [],
      selectedTimings: faculty.selectedTimings || []
    });
    setEditingId(faculty.id);
    setIsEditing(true);
    setShowAddModal(true);
    setActiveStep(1);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this faculty member?")) {
      const res = await fetch(`/api/faculties?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchFaculties();
      } else {
        alert(data.error || "Failed to delete faculty");
      }
    }
  };

  return (
    <div className="space-y-8 font-body">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Faculty Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage institutional mentors, professors, and industry experts.</p>
        </div>
        <button 
          onClick={() => {
            setIsEditing(false);
            setNewFaculty({ name: "", email: "", password: "Teacher@123", role: "Senior Faculty", specialty: "", image: "", bio: "", education: "", expertise: "", selectedCourses: [], selectedTimings: [] });
            setShowAddModal(true);
            setActiveStep(1);
          }}
          className="flex items-center gap-2 bg-navy text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-black transition-all shadow-md"
        >
          <Plus size={18} />
          <span>Add Faculty</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {faculties.map((f) => (
          <motion.div 
            key={f.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden">
                  {f.image ? <img src={f.image} className="w-full h-full object-cover" /> : <User size={24} className="m-auto mt-4 text-slate-300" />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{f.name}</h3>
                  <p className="text-xs text-slate-500">{f.role}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
               <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Star size={14} className="text-primary" />
                  <span className="font-semibold">{f.specialty}</span>
               </div>
               <div className="flex items-center gap-2 text-xs text-slate-600">
                  <BookOpen size={14} className="text-navy" />
                  <span>{f.education}</span>
               </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {f.selectedTimings && f.selectedTimings.map(tId => {
                const t = availableTimings.find(at => at.id === tId);
                return t ? (
                  <span key={tId} className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                    {t.name}
                  </span>
                ) : null;
              })}
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-slate-50">
              <button 
                onClick={() => handleEdit(f)}
                className="flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-slate-50 text-slate-400 hover:bg-navy hover:text-white transition-all border border-slate-100"
              >
                Update Profile
              </button>
              <button 
                onClick={() => handleDelete(f.id)}
                className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all border border-slate-100"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-body">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-white/20">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{isEditing ? 'Update Faculty Profile' : 'Onboard New Faculty'}</h3>
                <p className="text-slate-500 text-xs mt-1">{isEditing ? 'Modify profile details and academic assignments.' : 'Step-by-step institutional onboarding process.'}</p>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map(step => (
                  <div key={step} className={`w-8 h-1.5 rounded-full transition-all ${activeStep === step ? 'bg-navy w-12' : 'bg-slate-200'}`} />
                ))}
              </div>
            </div>

            <form onSubmit={handleAdd} className="p-8 space-y-6">
               <AnimatePresence mode="wait">
                {activeStep === 1 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block ml-1">Full Name</label>
                          <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-navy focus:bg-white transition-all" value={newFaculty.name} onChange={e => setNewFaculty({...newFaculty, name: e.target.value})} />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block ml-1">Institutional Email</label>
                          <input required type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-navy focus:bg-white transition-all" value={newFaculty.email} onChange={e => setNewFaculty({...newFaculty, email: e.target.value})} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block ml-1">Access Password</label>
                          <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-navy focus:bg-white transition-all" value={newFaculty.password} onChange={e => setNewFaculty({...newFaculty, password: e.target.value})} />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block ml-1">Designation</label>
                          <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-navy focus:bg-white transition-all" value={newFaculty.role} onChange={e => setNewFaculty({...newFaculty, role: e.target.value})} />
                        </div>
                    </div>
                  </motion.div>
                )}

                {activeStep === 2 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block ml-1">Specialty</label>
                          <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-navy focus:bg-white transition-all" value={newFaculty.specialty} onChange={e => setNewFaculty({...newFaculty, specialty: e.target.value})} />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block ml-1">Education</label>
                          <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-navy focus:bg-white transition-all" value={newFaculty.education} onChange={e => setNewFaculty({...newFaculty, education: e.target.value})} />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block ml-1">Profile Picture</label>
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                              {newFaculty.image ? <img src={newFaculty.image} className="w-full h-full object-cover" /> : <User className="text-slate-300" size={20} />}
                           </div>
                           <label className="flex-grow">
                              <div className={`flex items-center justify-center gap-2 w-full bg-slate-50 border border-dashed border-slate-300 rounded-xl px-4 py-2.5 text-[10px] font-bold text-slate-500 cursor-pointer hover:bg-white hover:border-navy transition-all ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                 {uploading ? <Loader2 className="animate-spin" size={14} /> : <Upload size={14} />}
                                 <span>{uploading ? 'Uploading...' : 'Click to Upload Image'}</span>
                              </div>
                              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                           </label>
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block ml-1">Expertise (comma separated)</label>
                        <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-navy focus:bg-white transition-all" placeholder="Robotics, AI, IoT" value={newFaculty.expertise} onChange={e => setNewFaculty({...newFaculty, expertise: e.target.value})} />
                    </div>
                  </motion.div>
                )}

                {activeStep === 3 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block ml-1">Brief Biography</label>
                      <textarea rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-navy focus:bg-white transition-all resize-none" value={newFaculty.bio} onChange={e => setNewFaculty({...newFaculty, bio: e.target.value})} />
                    </div>
                    
                    <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block ml-1">Assign Academic Programs</label>
                    
                    <div className="flex bg-slate-50 p-1 rounded-xl gap-1">
                      <button 
                        type="button"
                        onClick={() => setCourseTab("online")}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${courseTab === 'online' ? 'bg-white text-navy shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        Online Courses
                      </button>
                      <button 
                        type="button"
                        onClick={() => setCourseTab("offline")}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${courseTab === 'offline' ? 'bg-white text-navy shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        Offline Batches
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 max-h-[180px] overflow-y-auto">
                      {courses.filter(c => c.type === courseTab).length === 0 ? (
                        <p className="col-span-2 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">No {courseTab} courses available</p>
                      ) : (
                        courses.filter(c => c.type === courseTab).map(course => (
                          <label key={course.id} className="flex items-center gap-3 p-2 hover:bg-white rounded-lg transition-all cursor-pointer group">
                            <input 
                              type="checkbox"
                              className="w-4 h-4 rounded border-slate-300 text-navy focus:ring-navy"
                              checked={newFaculty.selectedCourses.includes(course.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewFaculty({...newFaculty, selectedCourses: [...newFaculty.selectedCourses, course.id]});
                                } else {
                                  setNewFaculty({...newFaculty, selectedCourses: newFaculty.selectedCourses.filter(id => id !== course.id)});
                                }
                              }}
                            />
                            <span className="text-[11px] font-medium text-slate-600 group-hover:text-navy transition-colors">{course.title}</span>
                          </label>
                        ))
                      )}
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block ml-1">Assigned Timings (Slots)</label>
                      <div className="flex flex-wrap gap-2 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                        {availableTimings.length === 0 ? (
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-2">No master timings defined</p>
                        ) : (
                          availableTimings.map(t => (
                            <button 
                              key={t.id}
                              type="button"
                              onClick={() => {
                                if (newFaculty.selectedTimings.includes(t.id)) {
                                  setNewFaculty({...newFaculty, selectedTimings: newFaculty.selectedTimings.filter(id => id !== t.id)});
                                } else {
                                  setNewFaculty({...newFaculty, selectedTimings: [...newFaculty.selectedTimings, t.id]});
                                }
                              }}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${newFaculty.selectedTimings.includes(t.id) ? 'bg-navy text-white border-navy shadow-sm' : 'bg-white text-slate-400 border-slate-200 hover:border-navy'}`}
                            >
                              {t.name} ({t.slot})
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                  </motion.div>
                )}
               </AnimatePresence>

               {error && <p className="text-[10px] text-rose-500 font-bold">{error}</p>}

               <div className="flex justify-between gap-3 pt-6">
                  <button 
                    type="button" 
                    onClick={() => {
                      if (activeStep > 1) setActiveStep(activeStep - 1);
                      else setShowAddModal(false);
                    }} 
                    className="px-6 py-3 text-xs font-bold text-slate-500 hover:text-navy transition-colors"
                  >
                    {activeStep === 1 ? 'Cancel' : 'Back'}
                  </button>
                  <button 
                    type="submit" 
                    className="px-8 py-3 bg-navy text-white rounded-2xl text-xs font-bold shadow-lg shadow-navy/20 hover:bg-black transition-all"
                  >
                    {activeStep === 3 ? (isEditing ? 'Update Faculty' : 'Finalize Onboarding') : 'Continue'}
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
