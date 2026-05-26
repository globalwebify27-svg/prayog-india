"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings as SettingsIcon, 
  Shield, 
  Bell, 
  Save, 
  Globe, 
  Mail, 
  ChevronRight, 
  Zap, 
  Lock,
  Image as ImageIcon,
  Phone,
  MapPin,
  Loader2,
  Upload,
  PenLine,
  CheckCircle
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("branding");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [sigUploading, setSigUploading] = useState({ signatory: false });
  const [sigSaved, setSigSaved] = useState({ signatory: false });
  const logoInputRef = useRef(null);
  const signatorySigRef = useRef(null);
  const [settings, setSettings] = useState({
    logo_url: "",
    footer_address: "",
    footer_phone: "",
    footer_email: "",
    facebook_url: "",
    youtube_url: "",
    linkedin_url: "",
    instagram_url: "",
    signatory_name: "Authorized Signatory",
    signatory_signature: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error("Fetch settings error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      
      if (data.success) {
        setSettings({ ...settings, logo_url: data.url });
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred during upload.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSignatureUpload(key, file) {
    if (!file) return;
    try {
      setSigUploading(s => ({ ...s, signatory: true }));
      setSigSaved(s => ({ ...s, signatory: false }));
      const formData = new FormData();
      formData.append("file", file);
      formData.append("key", key);
      const res = await fetch("/api/admin/settings/upload-signature", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setSettings(s => ({ ...s, [key]: data.url }));
        setSigSaved(s => ({ ...s, signatory: true }));
        setTimeout(() => setSigSaved(s => ({ ...s, signatory: false })), 3000);
      } else {
        alert("Upload failed: " + data.message);
      }
    } catch (e) {
      alert("Upload error");
    } finally {
      setSigUploading(s => ({ ...s, signatory: false }));
    }
  }

  async function handleSave() {
    try {
      setSaving(true);
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        alert("Settings updated successfully!");
        window.location.reload(); // Refresh to update context
      } else {
        alert("Update failed: " + data.message);
      }
    } catch (error) {
      console.error("Save settings error:", error);
      alert("An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  }

  const tabs = [
    { id: "branding", label: "Branding & Contact", icon: <Globe size={16} /> },
    { id: "certificates", label: "Certificates & Signatures", icon: <PenLine size={16} /> },
    { id: "general", label: "Platform General", icon: <SettingsIcon size={16} /> },
    { id: "security", label: "Security Policy", icon: <Shield size={16} /> },
    { id: "notifications", label: "Messaging", icon: <Bell size={16} /> },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-navy" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 font-body">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">System Configuration</h1>
          <p className="text-slate-500 text-sm mt-1">Configure institutional parameters and core administrative controls.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 bg-navy text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-black transition-all shadow-sm disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          <span>{saving ? "Saving..." : "Save parameters"}</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Sidebar Nav */}
        <div className="lg:col-span-3 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all group ${
                activeTab === tab.id 
                  ? "bg-navy text-white shadow-md" 
                  : "text-slate-500 hover:bg-white hover:text-navy"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={activeTab === tab.id ? "text-primary" : "text-slate-400 group-hover:text-navy transition-colors"}>
                  {tab.icon}
                </div>
                <span className="text-xs font-semibold">{tab.label}</span>
              </div>
              {activeTab === tab.id && <ChevronRight size={14} />}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-10">
            <AnimatePresence mode="wait">
              {activeTab === "branding" && (
                <motion.div key="branding" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-slate-700 ml-1">Institutional Logo</label>
                      <div className="flex items-center gap-4">
                        <div className="relative flex-grow">
                          <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input 
                            type="text" 
                            value={settings.logo_url || ""}
                            readOnly
                            placeholder="Upload a logo..."
                            className="w-full pl-11 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg outline-none text-sm font-medium text-slate-500 cursor-not-allowed"
                          />
                        </div>
                        <input 
                          type="file" 
                          ref={logoInputRef}
                          onChange={handleLogoUpload}
                          className="hidden" 
                          accept="image/*"
                        />
                        <button 
                          type="button"
                          onClick={() => logoInputRef.current.click()}
                          disabled={uploading}
                          className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2.5 rounded-lg font-bold text-xs hover:bg-black transition-all disabled:opacity-50 whitespace-nowrap"
                        >
                          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                          <span>{uploading ? "Uploading..." : "Upload Logo"}</span>
                        </button>
                      </div>
                      {settings.logo_url && (
                        <div className="mt-2 p-4 bg-navy rounded-xl inline-block border border-white/10 shadow-sm">
                          <img src={settings.logo_url} alt="Logo Preview" className="h-10 object-contain" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <label className="text-xs font-bold text-slate-700 ml-1">Footer Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                          type="email" 
                          value={settings.footer_email || ""}
                          onChange={(e) => setSettings({...settings, footer_email: e.target.value})}
                          className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-xs font-bold text-slate-700 ml-1">Footer Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                          type="text" 
                          value={settings.footer_phone || ""}
                          onChange={(e) => setSettings({...settings, footer_phone: e.target.value})}
                          className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-xs font-bold text-slate-700 ml-1">Footer Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-4 text-slate-400" size={16} />
                        <textarea 
                          rows={3}
                          value={settings.footer_address || ""}
                          onChange={(e) => setSettings({...settings, footer_address: e.target.value})}
                          className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-10">
                    <h3 className="text-sm font-bold text-slate-900 mb-6">Social Media Links</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                          type="text" 
                          value={settings.facebook_url || ""}
                          onChange={(e) => setSettings({...settings, facebook_url: e.target.value})}
                          placeholder="Facebook URL"
                          className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium"
                        />
                      </div>
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                          type="text" 
                          value={settings.youtube_url || ""}
                          onChange={(e) => setSettings({...settings, youtube_url: e.target.value})}
                          placeholder="YouTube URL"
                          className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium"
                        />
                      </div>
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                          type="text" 
                          value={settings.linkedin_url || ""}
                          onChange={(e) => setSettings({...settings, linkedin_url: e.target.value})}
                          placeholder="LinkedIn URL"
                          className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium"
                        />
                      </div>
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                          type="text" 
                          value={settings.instagram_url || ""}
                          onChange={(e) => setSettings({...settings, instagram_url: e.target.value})}
                          placeholder="Instagram URL"
                          className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "certificates" && (
                <motion.div key="certificates" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                      <PenLine size={22} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Certificate Signatories</h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">Upload signatures that appear on all issued certificates.</p>
                    </div>
                  </div>

                  {/* Signatory */}
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-5">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Authorized Signatory</h4>
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-600">Display Name</label>
                        <input
                          type="text"
                          value={settings.signatory_name || ""}
                          onChange={e => setSettings(s => ({ ...s, signatory_name: e.target.value }))}
                          placeholder="e.g. Ms. Priya Singh"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:border-navy text-sm font-medium transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-600">Signature Image</label>
                        <div className="flex items-center gap-3">
                          <input type="file" ref={signatorySigRef} accept="image/*" className="hidden"
                            onChange={e => handleSignatureUpload('signatory_signature', e.target.files[0])} />
                          <button
                            type="button"
                            onClick={() => signatorySigRef.current.click()}
                            disabled={sigUploading.signatory}
                            className="flex items-center gap-2 px-4 py-2.5 bg-navy text-white rounded-lg text-xs font-bold hover:bg-black transition-all disabled:opacity-50"
                          >
                            {sigUploading.signatory ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                            {sigUploading.signatory ? "Uploading..." : "Upload Signature"}
                          </button>
                          {sigSaved.signatory && (
                            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                              <CheckCircle size={14} /> Saved!
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {settings.signatory_signature && (
                      <div className="mt-2">
                        <label className="text-xs text-slate-500 font-medium mb-2 block">Preview</label>
                        <div className="inline-block bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                          <img src={settings.signatory_signature} alt="Signatory Signature" className="h-16 object-contain" />
                          <p className="text-center text-xs text-slate-500 mt-2 font-medium">{settings.signatory_name}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 bg-navy text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-black transition-all shadow-sm disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                      {saving ? "Saving..." : "Save Names"}
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === "general" && (
                <motion.div key="general" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 ml-1">Institution Identity</label>
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                          type="text" 
                          defaultValue="Prayog India Institutional Hub"
                          className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 ml-1">Public Support Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                          type="email" 
                          defaultValue="support@prayogindia.in"
                          className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-900">Maintenance Protocol</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">Temporarily disable student portal access for core updates.</p>
                      </div>
                      <div className="w-11 h-6 bg-slate-200 rounded-full relative cursor-pointer group">
                        <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all group-hover:shadow-sm shadow" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-200 pt-8">
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-900">Automated Onboarding</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">Instantly approve students following successful payment verification.</p>
                      </div>
                      <div className="w-11 h-6 bg-emerald-500 rounded-full relative cursor-pointer group shadow-sm">
                        <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "security" && (
                <motion.div key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                  <div className="flex items-center space-x-4 mb-10">
                    <div className="w-14 h-14 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shadow-sm">
                      <Shield size={28} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Security Policy</h3>
                      <p className="text-sm text-slate-500 font-medium">Configure institutional access tokens and auth layers.</p>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="flex items-center justify-between p-5 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center space-x-4">
                        <Lock className="text-slate-400" size={20} />
                        <div>
                          <p className="text-sm font-bold text-slate-900">Session Timeout</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Active for 30 minutes</p>
                        </div>
                      </div>
                      <button className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-navy hover:bg-slate-50 transition-all uppercase">Change</button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Status Indicator for In-Dev Tabs */}
              {(activeTab === "notifications" || activeTab === "system") && (
                <div className="py-24 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200 mb-6">
                    <Zap size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Module Optimization</h3>
                  <p className="text-slate-400 text-sm max-w-sm mx-auto mt-2 leading-relaxed">This configuration interface is being optimized for real-time institutional performance.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
