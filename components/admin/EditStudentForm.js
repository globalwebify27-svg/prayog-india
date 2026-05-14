"use client";

import { useState } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Droplet, 
  AlertCircle, 
  Save, 
  X, 
  Edit,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function EditStudentForm({ student }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: student.name || "",
    email: student.email || "",
    phone: student.phone || "",
    dob: student.dob ? new Date(student.dob).toISOString().split('T')[0] : "",
    address: student.address || "",
    blood_group: student.blood_group || "",
    emergency_contact: student.emergency_contact || "",
    father_name: student.father_name || "",
    mother_name: student.mother_name || "",
    gender: student.gender || "",
    qualification: student.qualification || "",
    school_college: student.school_college || "",
    last_qualification_year: student.last_qualification_year || "",
    id_type: student.id_type || "",
    id_number: student.id_number || "",
    school_id_number: student.school_id_number || ""
  });

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/students/${student.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        alert("Student details updated successfully!");
        setIsEditing(false);
        window.location.reload(); 
      } else {
        alert(data.message || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update student");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsEditing(true)}
        className="flex items-center space-x-2 bg-navy text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-black transition-all shadow-sm"
      >
        <Edit size={14} />
        <span>Edit Student Details</span>
      </button>

      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Edit Student Record</h2>
                  <p className="text-xs text-slate-500 mt-1">Institutional administrative bypass mode.</p>
                </div>
                <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 max-h-[70vh] overflow-y-auto scrollbar-hide space-y-8">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-navy uppercase tracking-widest border-l-4 border-navy pl-3">Basic Information</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                      <div className="relative">
                        <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="text" 
                          value={formData.name} 
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-navy focus:bg-white transition-all text-sm font-bold" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Official Email</label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="email" 
                          value={formData.email} 
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-navy focus:bg-white transition-all text-sm font-bold" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Contact Number</label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="tel" 
                          value={formData.phone} 
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-navy focus:bg-white transition-all text-sm font-bold" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Gender</label>
                      <select 
                        value={formData.gender} 
                        onChange={(e) => setFormData({...formData, gender: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-navy focus:bg-white transition-all text-sm font-bold appearance-none"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Parental Info */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-navy uppercase tracking-widest border-l-4 border-navy pl-3">Parental Information</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Father's Name</label>
                      <input 
                        type="text" 
                        value={formData.father_name} 
                        onChange={(e) => setFormData({...formData, father_name: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-navy focus:bg-white transition-all text-sm font-bold" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Mother's Name</label>
                      <input 
                        type="text" 
                        value={formData.mother_name} 
                        onChange={(e) => setFormData({...formData, mother_name: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-navy focus:bg-white transition-all text-sm font-bold" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Emergency Contact</label>
                      <div className="relative">
                        <AlertCircle size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="tel" 
                          value={formData.emergency_contact} 
                          onChange={(e) => setFormData({...formData, emergency_contact: e.target.value})}
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-navy focus:bg-white transition-all text-sm font-bold" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Education */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-navy uppercase tracking-widest border-l-4 border-navy pl-3">Educational Background</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Qualification</label>
                      <input 
                        type="text" 
                        value={formData.qualification} 
                        onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-navy focus:bg-white transition-all text-sm font-bold" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">School/College Name</label>
                      <input 
                        type="text" 
                        value={formData.school_college} 
                        onChange={(e) => setFormData({...formData, school_college: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-navy focus:bg-white transition-all text-sm font-bold" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Passing Year</label>
                      <input 
                        type="text" 
                        value={formData.last_qualification_year} 
                        onChange={(e) => setFormData({...formData, last_qualification_year: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-navy focus:bg-white transition-all text-sm font-bold" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">School ID Number</label>
                      <input 
                        type="text" 
                        value={formData.school_id_number} 
                        onChange={(e) => setFormData({...formData, school_id_number: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-navy focus:bg-white transition-all text-sm font-bold" 
                      />
                    </div>
                  </div>
                </div>

                {/* Identity & Others */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-navy uppercase tracking-widest border-l-4 border-navy pl-3">Identity & Others</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Government ID Type</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Aadhaar, PAN"
                        value={formData.id_type} 
                        onChange={(e) => setFormData({...formData, id_type: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-navy focus:bg-white transition-all text-sm font-bold" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">ID Number</label>
                      <input 
                        type="text" 
                        value={formData.id_number} 
                        onChange={(e) => setFormData({...formData, id_number: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-navy focus:bg-white transition-all text-sm font-bold" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Date of Birth</label>
                      <div className="relative">
                        <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="date" 
                          value={formData.dob} 
                          onChange={(e) => setFormData({...formData, dob: e.target.value})}
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-navy focus:bg-white transition-all text-sm font-bold" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Blood Group</label>
                      <div className="relative">
                        <Droplet size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select 
                          value={formData.blood_group} 
                          onChange={(e) => setFormData({...formData, blood_group: e.target.value})}
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-navy focus:bg-white transition-all text-sm font-bold appearance-none"
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
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Mailing Address</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-4 top-4 text-slate-400" />
                      <textarea 
                        rows={3} 
                        value={formData.address} 
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-navy focus:bg-white transition-all text-sm font-bold resize-none"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-4">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="px-8 py-3 bg-navy text-white rounded-2xl font-bold text-sm hover:bg-black transition-all flex items-center space-x-2 shadow-lg shadow-navy/10 disabled:opacity-70"
                >
                  {isUpdating && <Loader2 size={16} className="animate-spin" />}
                  <span>{isUpdating ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
