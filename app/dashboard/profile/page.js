"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Mail, 
  Phone, 
  Camera, 
  Lock,
  Bell,
  MapPin,
  Calendar,
  Save,
  Shield,
  Droplet,
  AlertCircle,
  Loader2,
  Plus,
  GraduationCap,
  Fingerprint,
  Upload,
  CheckCircle,
  FileText,
  BookOpen,
  X
} from "lucide-react";

import CustomModal from "@/components/CustomModal";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Password Change State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

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

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    dob: "",
    address: "",
    blood_group: "",
    emergency_contact: "",
    image: "",
    father_name: "",
    mother_name: "",
    gender: "",
    qualification: "",
    school_college: "",
    last_qualification_year: "",
    id_type: "",
    id_number: "",
    id_image: "",
    school_id_card: "",
    school_id_number: "",
    // Faculty specific
    bio: "",
    specialty: "",
    expertise: "",
    faculty_education: ""
  });

  const tabs = [
    { id: "personal", label: "General details", icon: <User size={16} /> },
    ...(user?.role === 'teacher' 
      ? [{ id: "professional", label: "Professional Info", icon: <BookOpen size={16} /> }]
      : [
          { id: "academic", label: "Academic records", icon: <GraduationCap size={16} /> },
          { id: "kyc", label: "Student Verification", icon: <Fingerprint size={16} /> }
        ]
    ),
    { id: "security", label: "Login & Security", icon: <Shield size={16} /> }
  ];

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/student/dashboard");
      const data = await res.json();
      if (data.success) {
        const u = data.data.user;
        setUser(u);
        setFormData({
          name: u.name || "",
          phone: u.phone || "",
          dob: u.dob ? new Date(u.dob).toISOString().split('T')[0] : "",
          address: u.address || "",
          blood_group: u.blood_group || "",
          emergency_contact: u.emergency_contact || "",
          image: u.image || "",
          father_name: u.father_name || "",
          mother_name: u.mother_name || "",
          gender: u.gender || "",
          qualification: u.qualification || "",
          school_college: u.school_college || "",
          last_qualification_year: u.last_qualification_year || "",
          id_type: u.id_type || "",
          id_number: u.id_number || "",
          id_image: u.id_image || "",
          school_id_card: u.school_id_card || "",
          school_id_number: u.school_id_number || "",
          bio: u.bio || "",
          specialty: u.specialty || "",
          expertise: Array.isArray(u.expertise) ? u.expertise.join(", ") : (u.expertise || ""),
          faculty_education: u.faculty_education || ""
        });
      } else {
        setError(data.message || "Failed to load profile");
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData
      });
      const result = await res.json();
      if (result.success) {
        setFormData(prev => ({ ...prev, [field]: result.url }));
        showAlert("Success", `${field.replace('_', ' ').toUpperCase()} updated successfully!`, "success");
      } else {
        showAlert("Upload Failed", result.error || "Unable to upload document.", "error");
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/student/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          expertise: typeof formData.expertise === 'string' ? formData.expertise.split(',').map(e => e.trim()).filter(e => e) : formData.expertise
        })
      });
      const data = await res.json();
      if (data.success) {
        showAlert("Profile Updated", "Your institutional profile has been synchronized successfully.", "success", () => fetchProfile());
      } else {
        showAlert("Update Failed", data.message || "We were unable to update your profile.", "error");
      }
    } catch (error) {
      console.error("Save error:", error);
      showAlert("Technical Error", "Failed to save changes due to a connectivity issue.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showAlert("Verification Error", "New password and confirmation do not match.", "error");
      return;
    }

    setIsSavingPassword(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        showAlert("Security Updated", "Your login credentials have been successfully updated.", "success");
      } else {
        showAlert("Security Error", data.message || "Unable to update password.", "error");
      }
    } catch (err) {
      showAlert("Technical Error", "Failed to reach security server.", "error");
    } finally {
      setIsSavingPassword(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (isLoading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-slate-200 border-t-navy rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
      <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 max-w-md text-center">
        <p className="font-bold mb-2">Sync Error</p>
        <p className="text-sm">{error}</p>
      </div>
      <button 
        onClick={fetchProfile}
        className="flex items-center space-x-2 bg-navy text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-black transition-all"
      >
        <RefreshCcw size={16} />
        <span>Try again</span>
      </button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 font-body pb-20">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex items-center space-x-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shadow-sm relative">
              {formData.image ? (
                <img src={formData.image} alt={user?.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-navy flex items-center justify-center text-white text-3xl font-bold uppercase">
                  {user?.name?.charAt(0)}
                </div>
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-navy/40 backdrop-blur-[2px] flex items-center justify-center">
                  <Loader2 className="text-white animate-spin" size={24} />
                </div>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={(e) => handleFileUpload(e, 'image')} 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute -bottom-2 -right-2 p-2 bg-navy text-white rounded-lg shadow-lg hover:bg-black transition-all hover:scale-110 active:scale-95 disabled:opacity-70"
            >
              <Camera size={14} />
            </button>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">{user?.name}</h1>
            <p className="text-slate-500 text-sm mt-1">
              {user?.role === 'teacher' ? 'Faculty Member' : `Student ID: PR-${10000 + user?.id}`} | Session: 2026
            </p>
            <div className="flex items-center space-x-3 mt-3">
              <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase border border-emerald-100">
                {user?.role === 'teacher' ? 'Official Mentor' : 'Verified identity'}
              </span>
              <span className="px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold uppercase border border-blue-100">
                {user?.role === 'teacher' ? 'Institutional Faculty' : 'Active scholar'}
              </span>
            </div>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center space-x-2 bg-navy text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-black transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          <span>{isSaving ? "Saving..." : "Save changes"}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-slate-200 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-6 py-3 text-sm font-semibold transition-all relative ${
              activeTab === tab.id ? "text-navy" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-navy" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === "personal" && (
            <motion.div
              key="personal"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-8 space-y-10"
            >
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">Legal name</label>
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        value={formData.name} 
                        disabled
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg outline-none text-slate-400 text-sm font-medium cursor-not-allowed" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">Official email</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="email" defaultValue={user?.email} disabled className="w-full pl-11 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg outline-none text-slate-400 text-sm font-medium cursor-not-allowed" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">Contact number</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="tel" 
                        value={formData.phone} 
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="No phone number" 
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium" 
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">Date of birth</label>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="date" 
                        value={formData.dob} 
                        onChange={(e) => setFormData({...formData, dob: e.target.value})}
                        disabled={!!user?.dob}
                        className={`w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-lg outline-none text-sm font-medium transition-all ${
                          user?.dob 
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                            : 'bg-slate-50 text-slate-900 focus:border-navy focus:bg-white'
                        }`} 
                      />
                      {user?.dob && (
                        <p className="text-[9px] text-slate-400 mt-1 ml-1 flex items-center gap-1">
                          <Lock size={8} /> Institutional record locked. Contact admin to change.
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">Blood group</label>
                    <div className="relative">
                      <Droplet size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <select 
                        value={formData.blood_group} 
                        onChange={(e) => setFormData({...formData, blood_group: e.target.value})}
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium appearance-none"
                      >
                        <option value="">Select blood group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">Emergency contact</label>
                    <div className="relative">
                      <AlertCircle size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="tel" 
                        value={formData.emergency_contact} 
                        onChange={(e) => setFormData({...formData, emergency_contact: e.target.value})}
                        placeholder="Emergency contact number" 
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium" 
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">Father's name</label>
                    <input 
                      type="text" 
                      value={formData.father_name} 
                      onChange={(e) => setFormData({...formData, father_name: e.target.value})}
                      placeholder="Official Father's Name" 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">Mother's name</label>
                    <input 
                      type="text" 
                      value={formData.mother_name} 
                      onChange={(e) => setFormData({...formData, mother_name: e.target.value})}
                      placeholder="Official Mother's Name" 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium" 
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">Gender</label>
                    <select 
                      value={formData.gender} 
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium appearance-none"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1">Permanent mailing address</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-4 top-4 text-slate-400" />
                  <textarea 
                    rows={3} 
                    value={formData.address} 
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Update your address" 
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium resize-none"
                  ></textarea>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "academic" && (
            <motion.div
              key="academic"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="p-8 space-y-8"
            >
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">Highest Qualification</label>
                    <input 
                      type="text" 
                      value={formData.qualification} 
                      onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                      placeholder="e.g. B.Tech, XII Standard" 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">School / College Name</label>
                    <input 
                      type="text" 
                      value={formData.school_college} 
                      onChange={(e) => setFormData({...formData, school_college: e.target.value})}
                      placeholder="Name of your last institution" 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium" 
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">Passing Year</label>
                    <input 
                      type="text" 
                      value={formData.last_qualification_year} 
                      onChange={(e) => setFormData({...formData, last_qualification_year: e.target.value})}
                      placeholder="YYYY" 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium" 
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "kyc" && (
            <motion.div
              key="kyc"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="p-8 space-y-8"
            >
              <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl flex gap-5 items-start">
                <div className="p-3 bg-white rounded-xl text-amber-600 shadow-sm"><Shield size={24} /></div>
                <div>
                  <h4 className="text-sm font-bold text-amber-900 mb-1">Student Verification</h4>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Institutional policy requires a valid government-issued ID and school credentials for final certification.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-navy" />
                  Government Identity
                </h4>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 ml-1">Identity Document Type</label>
                      <select 
                        value={formData.id_type} 
                        onChange={(e) => setFormData({...formData, id_type: e.target.value})}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium appearance-none"
                      >
                        <option value="">Select ID Type</option>
                        <option value="Aadhar Card">Aadhar Card</option>
                        <option value="PAN Card">PAN Card</option>
                        <option value="Voter ID">Voter ID</option>
                        <option value="Passport">Passport</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 ml-1">Document / ID Number</label>
                      <input 
                        type="text" 
                        value={formData.id_number} 
                        onChange={(e) => setFormData({...formData, id_number: e.target.value})}
                        placeholder="Enter Identification Number" 
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-700 ml-1">Upload ID Proof (Front)</label>
                    <div className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all min-h-[160px] ${formData.id_image ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 hover:border-navy bg-slate-50/50'}`}>
                      {formData.id_image ? (
                        <div className="flex flex-col items-center gap-4 w-full">
                          <div className="relative group w-full max-w-[200px] aspect-video rounded-xl overflow-hidden shadow-md border border-emerald-100 bg-white">
                            <img src={formData.id_image} alt="ID Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[1px]">
                              <a href={formData.id_image} target="_blank" rel="noopener noreferrer" className="p-2 bg-white text-navy rounded-lg shadow-xl hover:scale-110 transition-all">
                                <FileText size={16} />
                              </a>
                            </div>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-2 text-emerald-600">
                              <CheckCircle size={14} />
                              <p className="text-[10px] font-bold uppercase tracking-widest">Document Uploaded</p>
                            </div>
                            <button 
                              onClick={() => setFormData({...formData, id_image: ""})}
                              className="text-[10px] font-bold text-slate-400 hover:text-rose-500 transition-colors uppercase underline"
                            >
                              Replace File
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Upload className="text-slate-300 mb-3" size={32} />
                          <p className="text-xs font-semibold text-slate-500 mb-4 text-center">Click to upload JPG, PNG or PDF</p>
                          <input 
                            type="file" 
                            onChange={(e) => handleFileUpload(e, 'id_image')}
                            className="hidden" 
                            id="id_upload" 
                          />
                          <label 
                            htmlFor="id_upload"
                            className="px-5 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:text-navy hover:border-navy transition-all cursor-pointer shadow-sm uppercase tracking-wider"
                          >
                            Select Document
                          </label>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-navy" />
                  Institutional Identity
                </h4>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 ml-1">School / College Name</label>
                      <input 
                        type="text" 
                        value={formData.school_college} 
                        onChange={(e) => setFormData({...formData, school_college: e.target.value})}
                        placeholder="Current Institution Name" 
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 ml-1">ID Card / Roll Number</label>
                      <input 
                        type="text" 
                        value={formData.school_id_number} 
                        onChange={(e) => setFormData({...formData, school_id_number: e.target.value})}
                        placeholder="Enter Institutional ID or Roll No." 
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-700 ml-1">Upload School ID Card</label>
                    <div className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all min-h-[160px] ${formData.school_id_card ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 hover:border-navy bg-slate-50/50'}`}>
                      {formData.school_id_card ? (
                        <div className="flex flex-col items-center gap-4 w-full">
                          <div className="relative group w-full max-w-[200px] aspect-video rounded-xl overflow-hidden shadow-md border border-emerald-100 bg-white">
                            <img src={formData.school_id_card} alt="School ID Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[1px]">
                              <a href={formData.school_id_card} target="_blank" rel="noopener noreferrer" className="p-2 bg-white text-navy rounded-lg shadow-xl hover:scale-110 transition-all">
                                <FileText size={16} />
                              </a>
                            </div>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-2 text-emerald-600">
                              <CheckCircle size={14} />
                              <p className="text-[10px] font-bold uppercase tracking-widest">School ID Uploaded</p>
                            </div>
                            <button 
                              onClick={() => setFormData({...formData, school_id_card: ""})}
                              className="text-[10px] font-bold text-slate-400 hover:text-rose-500 transition-colors uppercase underline"
                            >
                              Replace File
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Upload className="text-slate-300 mb-3" size={32} />
                          <p className="text-xs font-semibold text-slate-500 mb-4 text-center">Click to upload School/College ID</p>
                          <input 
                            type="file" 
                            onChange={(e) => handleFileUpload(e, 'school_id_card')}
                            className="hidden" 
                            id="school_id_upload" 
                          />
                          <label 
                            htmlFor="school_id_upload"
                            className="px-5 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:text-navy hover:border-navy transition-all cursor-pointer shadow-sm uppercase tracking-wider"
                          >
                            Select School ID
                          </label>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "professional" && (
            <motion.div
              key="professional"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="p-8 space-y-8"
            >
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">Academic Specialty</label>
                    <input 
                      type="text" 
                      value={formData.specialty} 
                      onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                      placeholder="e.g. Robotics & AI Expert" 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">Highest Education</label>
                    <input 
                      type="text" 
                      value={formData.faculty_education} 
                      onChange={(e) => setFormData({...formData, faculty_education: e.target.value})}
                      placeholder="Your academic degrees" 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium" 
                    />
                  </div>
                </div>
                <div className="space-y-6">
                   <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">Core Expertise (comma separated)</label>
                    <input 
                      type="text" 
                      value={formData.expertise} 
                      onChange={(e) => setFormData({...formData, expertise: e.target.value})}
                      placeholder="e.g. Python, ROS, IoT" 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium" 
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 ml-1">Professional Biography</label>
                <textarea 
                  rows={4} 
                  value={formData.bio} 
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  placeholder="Share your journey and expertise with students..." 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium resize-none"
                ></textarea>
              </div>
            </motion.div>
          )}

          {activeTab === "security" && (
            <motion.div
              key="security"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-8 space-y-8"
            >
              <div className="flex items-center justify-between p-5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center space-x-4">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-navy shadow-sm">
                    <Lock size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Security password</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Protect your institutional account</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowPasswordModal(true)}
                  className="px-4 py-2 bg-navy text-white text-xs font-bold rounded-lg hover:bg-black transition-all"
                >
                  Update Password
                </button>
              </div>

              {showPasswordModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/20"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-slate-900">Update Password</h3>
                      <button onClick={() => setShowPasswordModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                    </div>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
                        <input 
                          required
                          type="password" 
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-navy focus:bg-white transition-all"
                          value={passwordData.currentPassword}
                          onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                        <input 
                          required
                          type="password" 
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-navy focus:bg-white transition-all"
                          value={passwordData.newPassword}
                          onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                        <input 
                          required
                          type="password" 
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-navy focus:bg-white transition-all"
                          value={passwordData.confirmPassword}
                          onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        />
                      </div>
                      <button 
                        disabled={isSavingPassword}
                        className="w-full bg-navy text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-navy/20 hover:bg-black transition-all flex items-center justify-center gap-2"
                      >
                        {isSavingPassword ? <Loader2 size={18} className="animate-spin" /> : <Shield size={18} />}
                        <span>Update Credentials</span>
                      </button>
                    </form>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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
