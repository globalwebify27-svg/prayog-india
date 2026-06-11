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
  X,
  Eye,
  EyeOff
} from "lucide-react";

import CustomModal from "@/components/CustomModal";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [academicEditMode, setAcademicEditMode] = useState(false);
  const fileInputRef = useRef(null);

  // Password Change State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const isTabComplete = (tabId) => {
    if (tabId === "personal") {
      return !!(
        formData.name &&
        formData.phone &&
        formData.dob &&
        formData.address &&
        formData.blood_group &&
        formData.emergency_contact &&
        formData.father_name &&
        formData.mother_name &&
        formData.gender &&
        formData.image
      );
    }
    if (tabId === "academic") {
      if (!formData.academic_type) return false;
      // All types require: college_name, university_board, registration_no, academic_session
      // Diploma/B.Tech and higher also require branch_stream and semester_year
      const base = !!(
        formData.college_name &&
        formData.university_board &&
        formData.registration_no &&
        formData.academic_session
      );
      if (formData.academic_type === "School") {
        return !!(base && formData.semester_year);
      }
      return !!(base && formData.branch_stream && formData.semester_year);
    }
    if (tabId === "kyc") {
      return !!( 
        formData.id_number &&
        formData.id_image &&
        (formData.college_name || formData.school_college) &&
        (formData.registration_no || formData.school_id_number) &&
        formData.school_id_card
      );
    }
    if (tabId === "professional") {
      return !!(
        formData.specialty &&
        formData.faculty_education &&
        formData.expertise &&
        formData.bio
      );
    }
    if (tabId === "security") {
      return true;
    }
    return false;
  };

  const isAcademicSavedInDb = () => {
    if (!user || !user.academic_type) return false;
    const base = !!(
      user.college_name &&
      user.university_board &&
      user.registration_no &&
      user.academic_session
    );
    if (user.academic_type === "School") {
      return !!(base && user.semester_year);
    }
    return !!(base && user.branch_stream && user.semester_year);
  };

  const handleTabClick = (targetTabId) => {
    if (activeTab === "personal" && targetTabId !== "personal") {
      if (!formData.image) {
        showAlert(
          "Profile Picture Required",
          "Please upload your profile picture first to proceed to other sections. Use the camera button on your profile photo avatar.",
          "warning"
        );
        return;
      }
    }
    setActiveTab(targetTabId);
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
    academic_type: "",
    branch_stream: "",
    semester_year: "",
    college_name: "",
    university_board: "",
    registration_no: "",
    academic_session: "",
    noc_file: "",
    noc_note: "",
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
          academic_type: u.academic_type || "",
          branch_stream: u.branch_stream || "",
          semester_year: u.semester_year || "",
          college_name: u.college_name || "",
          university_board: u.university_board || "",
          registration_no: u.registration_no || "",
          academic_session: u.academic_session || "",
          noc_file: u.noc_file || "",
          noc_note: u.noc_note || "",
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

    // Validate file size
    const isImage = file.type.startsWith('image/');
    const maxSizeMB = isImage ? 5 : 32;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      showAlert("File Too Large", `The selected file exceeds the allowed size limit. Images must be under 5MB. Other files can be up to 32MB.`, "warning");
      e.target.value = '';
      return;
    }

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

  const handleSave = async (section) => {
    // General details validation
    if (section === 'personal') {
      if (
        !formData.name ||
        !formData.phone ||
        !formData.dob ||
        !formData.address ||
        !formData.blood_group ||
        !formData.emergency_contact ||
        !formData.father_name ||
        !formData.mother_name ||
        !formData.gender ||
        !formData.image
      ) {
        showAlert("Validation Error", "All fields in General Details (including profile picture) are mandatory.", "error");
        return;
      }
    }

    // Aadhar and Academic ID validation for students
    if (user?.role !== 'teacher' && section === 'kyc') {
      if (!formData.id_number || formData.id_number.replace(/\D/g, '').length !== 12) {
        showAlert("Validation Error", "Aadhar number is mandatory and must be exactly 12 digits.", "error");
        return;
      }
      if (!formData.id_image) {
        showAlert("Validation Error", "Please upload the front copy of your Aadhar Card.", "error");
        return;
      }
      if (!formData.school_id_card) {
        showAlert("Validation Error", "Please upload your Academic ID Card.", "error");
        return;
      }
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/student/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          expertise: typeof formData.expertise === 'string' ? formData.expertise.split(',').map(e => e.trim()).filter(e => e) : formData.expertise,
          section
        })
      });
      const data = await res.json();
      if (data.success) {
        showAlert("Profile Updated", "Your institutional profile has been synchronized successfully.", "success", () => {
          fetchProfile();
          const currentTabId = section === 'personal' ? 'personal' : section === 'academic' ? 'academic' : section === 'kyc' ? 'kyc' : section === 'professional' ? 'professional' : '';
          const currentIndex = tabs.findIndex(t => t.id === currentTabId);
          if (currentIndex !== -1 && currentIndex < tabs.length - 1) {
            setActiveTab(tabs[currentIndex + 1].id);
          }
        });
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
            {/* Tooltip on Hover */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-lg z-50 font-bold">
              Click camera button to upload photo
            </div>
            
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
            {!formData.image && (
              <div className="mt-2.5 text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3 py-1.5 text-[11px] font-bold flex items-center gap-1.5 animate-pulse shadow-sm max-w-max">
                <AlertCircle size={12} className="text-rose-500 shrink-0" />
                <span>Upload a profile picture using the camera button to proceed</span>
              </div>
            )}
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
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-slate-200 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isComplete = isTabComplete(tab.id);
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 text-sm font-semibold transition-all relative ${
                activeTab === tab.id 
                  ? "text-navy" 
                  : isComplete && tab.id !== 'security'
                    ? "text-emerald-600 hover:text-emerald-700 font-bold" 
                    : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {isComplete && tab.id !== 'security' ? (
                <CheckCircle size={16} className="text-emerald-500 shrink-0" />
              ) : (
                tab.icon
              )}
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-navy" />
              )}
            </button>
          );
        })}
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
                        max={new Date().toISOString().split('T')[0]}
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
              
              <div className="flex justify-end pt-6 border-t border-slate-100">
                <button 
                  onClick={() => handleSave('personal')}
                  disabled={isSaving}
                  className="flex items-center space-x-2 bg-navy text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-black transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  <span>Save General Details</span>
                </button>
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
              {/* ── LOCKED READ-ONLY VIEW ── */}
              {isAcademicSavedInDb() && !academicEditMode ? (
                <div className="space-y-6">
                  {/* Verified banner */}
                  <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                    <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600"><CheckCircle size={20} /></div>
                    <div>
                      <p className="text-sm font-bold text-emerald-800">Academic Records Submitted</p>
                      <p className="text-[11px] text-emerald-600">Your records are locked. Contact admin if any corrections are needed.</p>
                    </div>
                  </div>

                  {/* Summary grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { label: "Qualification", val: formData.academic_type },
                      { label: "Branch / Stream", val: formData.branch_stream || "—" },
                      { label: "Semester / Year / Class", val: formData.semester_year },
                      { label: formData.academic_type === "School" ? "School Name" : "College Name", val: formData.college_name },
                      { label: formData.academic_type === "School" ? "Board" : "University / Board", val: formData.university_board },
                      { label: "Registration / Roll No.", val: formData.registration_no },
                      { label: "Academic Session", val: formData.academic_session },
                    ].map(({ label, val }) => (
                      <div key={label} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
                        <p className="text-sm font-semibold text-slate-800 truncate">{val || "—"}</p>
                      </div>
                    ))}
                  </div>

                  {formData.academic_type !== "School" && (formData.noc_file || formData.noc_note) && (
                    <div className="pt-6 border-t border-slate-100 grid md:grid-cols-2 gap-6">
                      {formData.noc_file && (
                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">NOC / Self Declaration Document</p>
                          <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                            <span className="text-xs font-semibold text-slate-700 truncate max-w-[180px]">NOC_Document.pdf</span>
                            <a 
                              href={formData.noc_file} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-xs font-bold text-navy hover:underline flex items-center gap-1 shrink-0"
                            >
                              View File &rarr;
                            </a>
                          </div>
                        </div>
                      )}
                      {formData.noc_note && (
                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">NOC Note</p>
                          <p className="text-xs text-slate-600 italic font-medium leading-relaxed">{formData.noc_note}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* ── EDIT FORM ── */
                <>
                  <div className="space-y-4">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-tight ml-1 block">Qualification Type</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { key: "School", label: "School" },
                        { key: "Diploma / B.Tech", label: "Diploma / B.Tech" },
                        { key: "Graduation in Other Stream", label: "Graduation in Other Stream" },
                        { key: "PG", label: "PG" },
                      ].map(({ key, label }) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setFormData({
                            ...formData,
                            academic_type: key,
                            branch_stream: "",
                            semester_year: "",
                            college_name: "",
                            university_board: "",
                            registration_no: "",
                            academic_session: ""
                          })}
                          className={`p-4 rounded-xl border-2 transition-all text-xs font-bold text-center leading-snug ${
                            formData.academic_type === key
                              ? "bg-navy/5 border-navy text-navy shadow-sm"
                              : "bg-white border-slate-100 text-slate-600 hover:border-navy/30 hover:bg-slate-50"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {formData.academic_type ? (
                    <div className="grid md:grid-cols-2 gap-6 pt-2">
                      {/* Branch/Stream — not shown for School */}
                      {formData.academic_type !== "School" && (
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-700 ml-1">Branch / Stream / Specialisation</label>
                          <input
                            type="text"
                            value={formData.branch_stream}
                            onChange={(e) => setFormData({...formData, branch_stream: e.target.value})}
                            placeholder={formData.academic_type === "PG" ? "e.g. MBA / M.Tech / MCA" : "e.g. Computer Science Engineering"}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium"
                          />
                        </div>
                      )}

                      {/* Semester / Year / Class */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 ml-1">
                          {formData.academic_type === "School" ? "Class / Standard" : "Current Semester / Year / Passed Out Year"}
                        </label>
                        <input
                          type="text"
                          value={formData.semester_year}
                          onChange={(e) => setFormData({...formData, semester_year: e.target.value})}
                          placeholder={formData.academic_type === "School" ? "e.g. 10th / 12th" : "e.g. 8th Sem / Passed Out 2024"}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium"
                        />
                      </div>

                      {/* Institution Name */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 ml-1">
                          {formData.academic_type === "School" ? "School Name" : "College / Institution Name"}
                        </label>
                        <input
                          type="text"
                          value={formData.college_name}
                          onChange={(e) => setFormData({...formData, college_name: e.target.value, school_college: e.target.value})}
                          placeholder={formData.academic_type === "School" ? "e.g. Delhi Public School" : "e.g. Prayog Institute of Technology"}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium"
                        />
                      </div>

                      {/* University / Board */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 ml-1">
                          {formData.academic_type === "School" ? "Board" : "University / Affiliated Board"}
                        </label>
                        <input
                          type="text"
                          value={formData.university_board}
                          onChange={(e) => setFormData({...formData, university_board: e.target.value})}
                          placeholder={formData.academic_type === "School" ? "e.g. CBSE / ICSE / State Board" : "e.g. BPUT / VTU / Osmania"}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium"
                        />
                      </div>

                      {/* Registration / Roll No. */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 ml-1">
                          {formData.academic_type === "School" ? "Roll No." : "Registration No. / Roll No."}
                        </label>
                        <input
                          type="text"
                          value={formData.registration_no}
                          onChange={(e) => setFormData({...formData, registration_no: e.target.value})}
                          placeholder="e.g. 220102003 / Roll-04"
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium"
                        />
                      </div>

                      {/* Academic Session */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 ml-1">Academic Session</label>
                        <input
                          type="text"
                          value={formData.academic_session}
                          onChange={(e) => setFormData({...formData, academic_session: e.target.value})}
                          placeholder="e.g. 2024-2025"
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium"
                        />
                      </div>

                      {/* NOC Section — only shown for non-School qualifications */}
                      {formData.academic_type !== "School" && (
                        <div className="col-span-2 pt-6 border-t border-slate-100 space-y-6">
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-navy" />
                              NOC / Self Declaration Document
                            </h4>
                          </div>

                          {/* Highlighted Warning Box (Single-line layout) */}
                          <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-2.5">
                            <AlertCircle size={14} className="text-amber-600 shrink-0" />
                            <p className="text-[11px] text-amber-800 font-semibold leading-relaxed">
                              <strong className="text-amber-950 font-bold mr-1">Note:</strong>
                              Only students going for an internship program are required to submit an NOC or Self Declaration Form. (Optional)
                            </p>
                          </div>

                          {/* The two boxes in one row */}
                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Upload Area */}
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-700 ml-1">Upload NOC (PDF / JPEG / PNG)</label>
                              <div className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-all min-h-[140px] ${formData.noc_file ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 hover:border-navy bg-slate-50/50'}`}>
                                {formData.noc_file ? (
                                  <div className="flex flex-col items-center gap-2 w-full text-center">
                                    <div className="flex items-center gap-2 text-emerald-600">
                                      <CheckCircle size={16} className="shrink-0" />
                                      <p className="text-xs font-bold uppercase tracking-wider">Document Uploaded</p>
                                    </div>
                                    <a 
                                      href={formData.noc_file} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="text-xs text-navy font-bold hover:underline"
                                    >
                                      View Uploaded File
                                    </a>
                                    <button 
                                      type="button"
                                      onClick={() => setFormData({...formData, noc_file: ""})}
                                      className="text-[10px] font-bold text-slate-400 hover:text-rose-500 transition-colors uppercase underline mt-2"
                                    >
                                      Replace File
                                    </button>
                                  </div>
                                ) : (
                                  <>
                                    <Upload className="text-slate-300 mb-2" size={24} />
                                    <input 
                                      type="file" 
                                      onChange={(e) => handleFileUpload(e, 'noc_file')}
                                      className="hidden" 
                                      id="noc_file_upload" 
                                    />
                                    <label 
                                      htmlFor="noc_file_upload"
                                      className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:text-navy hover:border-navy transition-all cursor-pointer shadow-sm uppercase tracking-wider"
                                    >
                                      Select NOC Document
                                    </label>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Note Box */}
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-700 ml-1">NOC Note Box</label>
                              <textarea 
                                rows={4}
                                value={formData.noc_note || ""}
                                onChange={(e) => setFormData({...formData, noc_note: e.target.value})}
                                placeholder="Write any notes regarding your NOC or Self Declaration Form here..."
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium resize-none h-[140px]"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl">
                      <GraduationCap size={32} className="mx-auto text-slate-300 mb-3" />
                      <p className="text-sm font-medium text-slate-500">Select your qualification type above to fill in your academic details.</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                    {academicEditMode && (
                      <button
                        type="button"
                        onClick={() => setAcademicEditMode(false)}
                        className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      onClick={async () => { await handleSave('academic'); if (isTabComplete('academic')) setAcademicEditMode(false); }}
                      disabled={isSaving || !formData.academic_type}
                      className="ml-auto flex items-center space-x-2 bg-navy text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-black transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                      <span>Save Academic Records</span>
                    </button>
                  </div>
                </>
              )}
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
                        value="Aadhar Card"
                        disabled
                        className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg outline-none text-slate-500 text-sm font-medium appearance-none cursor-not-allowed"
                      >
                        <option value="Aadhar Card">Aadhar Card</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 ml-1">Aadhar Number (12 Digits)</label>
                      <input 
                        type="text" 
                        maxLength={12}
                        value={formData.id_number} 
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                          setFormData({...formData, id_number: val, id_type: 'Aadhar Card'});
                        }}
                        placeholder="Enter 12 Digit Aadhar Number" 
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-700 ml-1">Upload ID Proof (Front) <span className="text-rose-500">*</span></label>
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
                    {/* Auto-filled from Academic Records */}
                    {(!formData.college_name && !formData.registration_no) && (
                      <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-2.5">
                        <AlertCircle size={14} className="text-blue-500 mt-0.5 shrink-0" />
                        <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                          Fill your <strong>College Name</strong> and <strong>Registration No.</strong> in the <em>Academic Records</em> tab first — they'll auto-appear here as read-only.
                        </p>
                      </div>
                    )}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between ml-1">
                        <label className="text-xs font-bold text-slate-700">School / College Name</label>
                        {formData.college_name && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase tracking-wide">
                            <Lock size={10} /> From Academic Records
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={formData.college_name || formData.school_college} 
                          readOnly={!!formData.college_name}
                          onChange={!formData.college_name ? (e) => setFormData({...formData, school_college: e.target.value}) : undefined}
                          placeholder="Complete Academic Records tab first" 
                          className={`w-full px-4 py-2.5 border rounded-lg text-sm font-medium transition-all ${
                            formData.college_name 
                              ? "bg-slate-100 border-slate-200 text-slate-600 cursor-not-allowed select-none" 
                              : "bg-slate-50 border-slate-200 outline-none focus:border-navy focus:bg-white"
                          }`}
                        />
                        {formData.college_name && (
                          <Lock size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between ml-1">
                        <label className="text-xs font-bold text-slate-700">ID Card / Roll Number</label>
                        {formData.registration_no && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase tracking-wide">
                            <Lock size={10} /> From Academic Records
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={formData.registration_no || formData.school_id_number} 
                          readOnly={!!formData.registration_no}
                          onChange={!formData.registration_no ? (e) => setFormData({...formData, school_id_number: e.target.value}) : undefined}
                          placeholder="Complete Academic Records tab first" 
                          className={`w-full px-4 py-2.5 border rounded-lg text-sm font-medium transition-all ${
                            formData.registration_no 
                              ? "bg-slate-100 border-slate-200 text-slate-600 cursor-not-allowed select-none" 
                              : "bg-slate-50 border-slate-200 outline-none focus:border-navy focus:bg-white"
                          }`}
                        />
                        {formData.registration_no && (
                          <Lock size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-700 ml-1">Upload Academic ID Card <span className="text-rose-500">*</span></label>
                    <div className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all min-h-[160px] ${formData.school_id_card ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 hover:border-navy bg-slate-50/50'}`}>
                      {formData.school_id_card ? (
                        <div className="flex flex-col items-center gap-4 w-full">
                          <div className="relative group w-full max-w-[200px] aspect-video rounded-xl overflow-hidden shadow-md border border-emerald-100 bg-white">
                            <img src={formData.school_id_card} alt="Academic ID Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[1px]">
                              <a href={formData.school_id_card} target="_blank" rel="noopener noreferrer" className="p-2 bg-white text-navy rounded-lg shadow-xl hover:scale-110 transition-all">
                                <FileText size={16} />
                              </a>
                            </div>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-2 text-emerald-600">
                              <CheckCircle size={14} />
                              <p className="text-[10px] font-bold uppercase tracking-widest">Academic ID Uploaded</p>
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
                            Select Academic ID
                          </label>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-slate-100">
                <button 
                  onClick={() => handleSave('kyc')}
                  disabled={isSaving}
                  className="flex items-center space-x-2 bg-navy text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-black transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  <span>Save Identity Documents</span>
                </button>
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
              
              <div className="flex justify-end pt-6 border-t border-slate-100">
                <button 
                  onClick={() => handleSave('professional')}
                  disabled={isSaving}
                  className="flex items-center space-x-2 bg-navy text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-black transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  <span>Save Professional Info</span>
                </button>
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
                        <div className="relative">
                          <input 
                            required
                            type={showCurrentPassword ? "text" : "password"} 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-sm outline-none focus:border-navy focus:bg-white transition-all font-medium"
                            value={passwordData.currentPassword}
                            onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})}
                          />
                          <button 
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                        <div className="relative">
                          <input 
                            required
                            type={showNewPassword ? "text" : "password"} 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-sm outline-none focus:border-navy focus:bg-white transition-all font-medium"
                            value={passwordData.newPassword}
                            onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
                          />
                          <button 
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                        <div className="relative">
                          <input 
                            required
                            type={showConfirmPassword ? "text" : "password"} 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-sm outline-none focus:border-navy focus:bg-white transition-all font-medium"
                            value={passwordData.confirmPassword}
                            onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          />
                          <button 
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
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
