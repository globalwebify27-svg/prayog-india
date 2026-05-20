"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit, X, Loader2, Users, Briefcase, PlusCircle, Check } from "lucide-react";

export default function AdminAboutPage() {
  const [activeTab, setActiveTab] = useState("team"); // "team" or "faculty"
  const [teamList, setTeamList] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null); // null for Add, object for Edit
  const [teamForm, setTeamForm] = useState({
    name: "",
    role: "",
    initial: "",
    img: "",
    bio: "",
    color: "#01254d",
    focus: "",
    specialties: [],
    sort_order: 0
  });

  const [showFacultyModal, setShowFacultyModal] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null); // null for Add, object for Edit
  const [facultyForm, setFacultyForm] = useState({
    name: "",
    role: "",
    desc_text: "",
    initial: "",
    img_url: "",
    sort_order: 0
  });

  // Helper specialty tag input
  const [specInput, setSpecInput] = useState("");
  const [isMutating, setIsMutating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const teamRes = await fetch("/api/about/team");
      const teamData = await teamRes.json();
      if (teamData.success) {
        setTeamList(teamData.team);
      }

      const facRes = await fetch("/api/about/faculty");
      const facData = await facRes.json();
      if (facData.success) {
        setFacultyList(facData.faculty);
      }
    } catch (error) {
      console.error("Error fetching about data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Image upload handler
  const handleImageUpload = async (e, type = "team") => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        if (type === "team") {
          setTeamForm(prev => ({ ...prev, img: data.url }));
        } else {
          setFacultyForm(prev => ({ ...prev, img_url: data.url }));
        }
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch (err) {
      alert("Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  // Team CRUD
  const openTeamModal = (member = null) => {
    if (member) {
      setSelectedTeam(member);
      setTeamForm({
        name: member.name,
        role: member.role,
        initial: member.initial,
        img: member.img,
        bio: member.bio,
        color: member.color || "#01254d",
        focus: member.focus,
        specialties: member.specialties || [],
        sort_order: member.sort_order || 0
      });
    } else {
      setSelectedTeam(null);
      setTeamForm({
        name: "",
        role: "",
        initial: "",
        img: "",
        bio: "",
        color: "#01254d",
        focus: "",
        specialties: [],
        sort_order: teamList.length
      });
    }
    setSpecInput("");
    setShowTeamModal(true);
  };

  const handleTeamSubmit = async (e) => {
    e.preventDefault();
    if (!teamForm.img) {
      alert("Please upload a portrait image first.");
      return;
    }
    setIsMutating(true);
    try {
      const method = selectedTeam ? "PUT" : "POST";
      const payload = selectedTeam ? { ...teamForm, id: selectedTeam.id } : teamForm;

      const res = await fetch("/api/about/team", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setShowTeamModal(false);
        fetchData();
      } else {
        alert("Error saving: " + data.message);
      }
    } catch (err) {
      alert("Error saving team member info");
    } finally {
      setIsMutating(false);
    }
  };

  const handleTeamDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;
    try {
      const res = await fetch(`/api/about/team?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      alert("Error deleting member");
    }
  };

  // Specialties Tags Add/Remove
  const addSpecialty = () => {
    if (specInput.trim() && !teamForm.specialties.includes(specInput.trim())) {
      setTeamForm(prev => ({
        ...prev,
        specialties: [...prev.specialties, specInput.trim()]
      }));
      setSpecInput("");
    }
  };

  const removeSpecialty = (tag) => {
    setTeamForm(prev => ({
      ...prev,
      specialties: prev.specialties.filter(t => t !== tag)
    }));
  };

  // Faculty CRUD
  const openFacultyModal = (faculty = null) => {
    if (faculty) {
      setSelectedFaculty(faculty);
      setFacultyForm({
        name: faculty.name,
        role: faculty.role,
        desc_text: faculty.desc_text,
        initial: faculty.initial || "",
        img_url: faculty.img_url || "",
        sort_order: faculty.sort_order || 0
      });
    } else {
      setSelectedFaculty(null);
      setFacultyForm({
        name: "",
        role: "",
        desc_text: "",
        initial: "",
        img_url: "",
        sort_order: facultyList.length
      });
    }
    setShowFacultyModal(true);
  };

  const handleFacultySubmit = async (e) => {
    e.preventDefault();
    setIsMutating(true);
    try {
      const method = selectedFaculty ? "PUT" : "POST";
      const payload = selectedFaculty ? { ...facultyForm, id: selectedFaculty.id } : facultyForm;

      const res = await fetch("/api/about/faculty", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setShowFacultyModal(false);
        fetchData();
      } else {
        alert("Error saving: " + data.message);
      }
    } catch (err) {
      alert("Error saving faculty info");
    } finally {
      setIsMutating(false);
    }
  };

  const handleFacultyDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this faculty member?")) return;
    try {
      const res = await fetch(`/api/about/faculty?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      alert("Error deleting faculty");
    }
  };

  return (
    <div className="space-y-8 font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">About Page CMS</h1>
          <p className="text-slate-500 text-sm mt-1">Manage the dynamic Core Team and Guest Faculty lists displayed on the About Us page.</p>
        </div>
        <button
          onClick={() => activeTab === "team" ? openTeamModal() : openFacultyModal()}
          className="flex items-center gap-2 bg-navy hover:bg-[#01254d] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md"
        >
          <Plus size={16} />
          <span>Add {activeTab === "team" ? "Core Member" : "Guest Faculty"}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("team")}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-bold text-sm transition-all ${
            activeTab === "team"
              ? "border-[#01254d] text-[#01254d]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <Users size={16} />
          <span>Core Team Slider ({teamList.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("faculty")}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-bold text-sm transition-all ${
            activeTab === "faculty"
              ? "border-[#01254d] text-[#01254d]"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <Briefcase size={16} />
          <span>Guest Faculty ({facultyList.length})</span>
        </button>
      </div>

      {/* Table & Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin text-[#01254d]" />
        </div>
      ) : activeTab === "team" ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamList.map((m) => (
            <div key={m.id} className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all">
              <div className="p-5 space-y-4">
                <div className="flex gap-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-100 shrink-0 bg-slate-50">
                    <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 leading-tight">{m.name}</h3>
                    <p className="text-xs text-slate-400 font-semibold uppercase mt-0.5">{m.role}</p>
                    <div className="inline-block mt-2 px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[9px] font-bold text-slate-500 uppercase">{m.focus}</div>
                  </div>
                </div>
                <p className="text-slate-500 text-xs line-clamp-3 leading-relaxed">{m.bio}</p>
                
                {/* Specialties tags preview */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {m.specialties?.map((spec, i) => (
                    <span key={i} className="text-[9px] font-bold bg-[#01254d]/5 text-[#01254d] px-2 py-0.5 rounded">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="bg-slate-50 border-t border-slate-100 px-5 py-3.5 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium font-mono">Order: {m.sort_order}</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => openTeamModal(m)}
                    className="p-1.5 bg-slate-100 hover:bg-[#01254d] hover:text-white text-slate-600 rounded-lg transition-colors"
                  >
                    <Edit size={14} />
                  </button>
                  <button 
                    onClick={() => handleTeamDelete(m.id)}
                    className="p-1.5 bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-500 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {teamList.length === 0 && (
            <div className="col-span-full py-16 text-center bg-white border border-slate-100 rounded-2xl">
              <p className="text-slate-400 text-sm">No team members configured yet.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase tracking-widest text-[9px] font-bold">
                <th className="px-6 py-4">Initial</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-center">Sort Order</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {facultyList.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    {f.img_url ? (
                      <img src={f.img_url} alt={f.name} className="w-8 h-8 rounded-lg object-cover border border-slate-100 bg-slate-50" />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-[#01254d] text-white flex items-center justify-center font-bold text-xs">
                        {f.initial}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">{f.name}</td>
                  <td className="px-6 py-4 text-slate-500 font-semibold">{f.role}</td>
                  <td className="px-6 py-4 text-slate-400 max-w-xs truncate">{f.desc_text}</td>
                  <td className="px-6 py-4 text-center font-mono font-medium text-slate-500">{f.sort_order}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <button 
                        onClick={() => openFacultyModal(f)}
                        className="p-1.5 bg-slate-100 hover:bg-[#01254d] hover:text-white text-slate-600 rounded-lg transition-colors"
                      >
                        <Edit size={13} />
                      </button>
                      <button 
                        onClick={() => handleFacultyDelete(f.id)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-500 rounded-lg transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {facultyList.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-16 text-center text-slate-400 text-sm">
                    No guest faculties configured yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Core Team Modal */}
      <AnimatePresence>
        {showTeamModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 className="text-base font-bold text-slate-900">{selectedTeam ? "Edit Team Member" : "Add Team Member"}</h3>
                <button onClick={() => setShowTeamModal(false)} className="text-slate-400 hover:text-navy transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleTeamSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Full Name</label>
                    <input required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none" value={teamForm.name} onChange={e => setTeamForm({...teamForm, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Role Title</label>
                    <input required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none" placeholder="e.g. Founder & Visionary" value={teamForm.role} onChange={e => setTeamForm({...teamForm, role: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Initials</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none" placeholder="e.g. EH" maxLength="4" value={teamForm.initial} onChange={e => setTeamForm({...teamForm, initial: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Highlight Color</label>
                    <input required type="color" className="w-full h-9 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none cursor-pointer" value={teamForm.color} onChange={e => setTeamForm({...teamForm, color: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Sort Order</label>
                    <input required type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none" value={teamForm.sort_order} onChange={e => setTeamForm({...teamForm, sort_order: parseInt(e.target.value) || 0})} />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Core Focus Area</label>
                  <input required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none" placeholder="e.g. National STEM Scaling" value={teamForm.focus} onChange={e => setTeamForm({...teamForm, focus: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-4 items-end">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Portrait Image</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "team")}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none file:mr-2 file:py-0.5 file:px-1.5 file:rounded file:border-0 file:text-[9px] file:font-black file:bg-navy file:text-white hover:file:bg-black cursor-pointer"
                    />
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 h-9 truncate font-mono">
                    {isUploading ? <Loader2 size={12} className="animate-spin text-[#01254d]" /> : <Check size={12} className="text-emerald-500" />}
                    <span>{teamForm.img ? teamForm.img.substring(teamForm.img.lastIndexOf("/") + 1) : "No file uploaded"}</span>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Profile Bio</label>
                  <textarea required rows="3" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none resize-none" value={teamForm.bio} onChange={e => setTeamForm({...teamForm, bio: e.target.value})} />
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Specialty Competencies</label>
                  <div className="flex gap-2">
                    <input 
                      className="flex-grow bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none" 
                      placeholder="e.g. Embedded C++" 
                      value={specInput} 
                      onChange={e => setSpecInput(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addSpecialty(); } }}
                    />
                    <button 
                      type="button" 
                      onClick={addSpecialty}
                      className="px-4 bg-slate-100 hover:bg-[#01254d] text-[#01254d] hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                    >
                      <PlusCircle size={14} /> Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {teamForm.specialties.map((tag) => (
                      <span key={tag} className="text-[10px] font-bold bg-slate-50 border border-slate-200 text-slate-600 pl-2.5 pr-1.5 py-1 rounded-full flex items-center gap-1">
                        <span>{tag}</span>
                        <button type="button" onClick={() => removeSpecialty(tag)} className="text-slate-400 hover:text-rose-500 rounded-full p-0.5">
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                    {teamForm.specialties.length === 0 && (
                      <span className="text-[10px] text-slate-400 italic">No specialties added yet. Press Enter or click Add to append tags.</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button type="button" onClick={() => setShowTeamModal(false)} className="px-5 py-2 text-xs font-bold text-slate-500">Cancel</button>
                  <button 
                    type="submit" 
                    disabled={isMutating || isUploading}
                    className="px-6 py-2.5 bg-navy text-white rounded-xl text-xs font-bold disabled:opacity-50 flex items-center gap-2 shadow-md hover:bg-black transition-colors"
                  >
                    {isMutating ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                    <span>Save Core Member</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Guest Faculty Modal */}
      <AnimatePresence>
        {showFacultyModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 className="text-base font-bold text-slate-900">{selectedFaculty ? "Edit Guest Faculty" : "Add Guest Faculty"}</h3>
                <button onClick={() => setShowFacultyModal(false)} className="text-slate-400 hover:text-navy transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleFacultySubmit} className="p-6 space-y-4">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Full Name</label>
                  <input required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none" value={facultyForm.name} onChange={e => setFacultyForm({...facultyForm, name: e.target.value})} />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Role Title</label>
                  <input required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none" placeholder="e.g. Robotics & Automation Engineer" value={facultyForm.role} onChange={e => setFacultyForm({...facultyForm, role: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Initials</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none" placeholder="e.g. AR" maxLength="4" value={facultyForm.initial} onChange={e => setFacultyForm({...facultyForm, initial: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Sort Order</label>
                    <input required type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none" value={facultyForm.sort_order} onChange={e => setFacultyForm({...facultyForm, sort_order: parseInt(e.target.value) || 0})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 items-end">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Portrait Image (Optional)</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "faculty")}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none file:mr-2 file:py-0.5 file:px-1.5 file:rounded file:border-0 file:text-[9px] file:font-black file:bg-navy file:text-white hover:file:bg-black cursor-pointer"
                    />
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 h-9 truncate font-mono">
                    {isUploading ? <Loader2 size={12} className="animate-spin text-[#01254d]" /> : <Check size={12} className="text-emerald-500" />}
                    <span>{facultyForm.img_url ? facultyForm.img_url.substring(facultyForm.img_url.lastIndexOf("/") + 1) : "No file uploaded"}</span>
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Profile Description</label>
                  <textarea required rows="4" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none resize-none" value={facultyForm.desc_text} onChange={e => setFacultyForm({...facultyForm, desc_text: e.target.value})} />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button type="button" onClick={() => setShowFacultyModal(false)} className="px-5 py-2 text-xs font-bold text-slate-500">Cancel</button>
                  <button 
                    type="submit" 
                    disabled={isMutating}
                    className="px-6 py-2.5 bg-navy text-white rounded-xl text-xs font-bold disabled:opacity-50 flex items-center gap-2 shadow-md hover:bg-black transition-colors"
                  >
                    {isMutating ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                    <span>Save Faculty</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
