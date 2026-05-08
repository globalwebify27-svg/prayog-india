"use client";

import { useState, useEffect } from "react";
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
  RefreshCcw
} from "lucide-react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    dob: "",
    address: "",
    blood_group: "",
    emergency_contact: ""
  });

  const tabs = [
    { id: "personal", label: "General details", icon: <User size={16} /> },
    { id: "security", label: "Login & Security", icon: <Shield size={16} /> },
    { id: "notifications", label: "Preferences", icon: <Bell size={16} /> }
  ];

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/student/dashboard");
      const data = await res.json();
      if (data.success) {
        setUser(data.data.user);
        setFormData({
          name: data.data.user.name || "",
          phone: data.data.user.phone || "",
          dob: data.data.user.dob ? new Date(data.data.user.dob).toISOString().split('T')[0] : "",
          address: data.data.user.address || "",
          blood_group: data.data.user.blood_group || "",
          emergency_contact: data.data.user.emergency_contact || ""
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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/student/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        alert("Profile updated successfully!");
        fetchProfile();
      } else {
        alert(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save changes");
    } finally {
      setIsSaving(false);
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
      <div className="text-xs text-slate-400">
        If you just updated the app, you may need to <a href="/api/dev/migrate" target="_blank" className="text-navy underline">update your database</a>.
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 font-body">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex items-center space-x-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shadow-sm">
              <div className="w-full h-full bg-navy flex items-center justify-center text-white text-3xl font-bold">
                {user?.name?.charAt(0)}
              </div>
            </div>
            <button className="absolute -bottom-2 -right-2 p-2 bg-navy text-white rounded-lg shadow-lg hover:bg-black transition-all">
              <Camera size={14} />
            </button>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">{user?.name}</h1>
            <p className="text-slate-500 text-sm mt-1">Student ID: PR-{10000 + user?.id} | Enrollment: 2026</p>
            <div className="flex items-center space-x-3 mt-3">
              <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase border border-emerald-100">Verified identity</span>
              <span className="px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold uppercase border border-blue-100">Active scholar</span>
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
                        disabled
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg outline-none text-slate-400 text-sm font-medium cursor-not-allowed" 
                      />
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
                    <p className="text-[11px] text-slate-500 font-medium">Last updated 12 days ago</p>
                  </div>
                </div>
                <button className="text-xs font-bold text-navy hover:underline">Change</button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

