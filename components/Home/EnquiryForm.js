"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Phone, Mail, MapPin } from "lucide-react";

export default function EnquiryForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "Industrial Robotics",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required.";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ""))) {
      newErrors.phone = "Invalid phone number (10 digits).";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setFormData({ name: "", email: "", phone: "", course: "Industrial Robotics", message: "" });
        setErrors({});
        alert("Enquiry Submitted Successfully!");
      }
    } catch (error) {
      alert("Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  return (
    <section className="py-10 md:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
          {/* Form Side */}
          <div className="flex-grow p-6 md:p-10 lg:p-12">
            <h2 className="text-2xl md:text-4xl font-heading font-black text-slate-900 mb-6">Send an Enquiry</h2>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest ml-1">Full Name</label>
                  <input name="name" value={formData.name} onChange={handleChange} type="text" placeholder="Rahul Sharma" className={`w-full bg-slate-50 border rounded-xl px-4 py-3 md:px-6 md:py-4 outline-none focus:bg-white transition-all text-sm ${errors.name ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500' : 'border-slate-200 focus:border-navy'}`} />
                  {errors.name && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.name}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest ml-1">Email Address</label>
                  <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="rahul@example.com" className={`w-full bg-slate-50 border rounded-xl px-4 py-3 md:px-6 md:py-4 outline-none focus:bg-white transition-all text-sm ${errors.email ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500' : 'border-slate-200 focus:border-navy'}`} />
                  {errors.email && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest ml-1">Phone Number</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="+91 98765 43210" className={`w-full bg-slate-50 border rounded-xl px-4 py-3 md:px-6 md:py-4 outline-none focus:bg-white transition-all text-sm ${errors.phone ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500' : 'border-slate-200 focus:border-navy'}`} />
                  {errors.phone && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.phone}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest ml-1">Interested Course</label>
                  <select name="course" value={formData.course} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 md:px-6 md:py-4 outline-none focus:border-navy focus:bg-white transition-all appearance-none text-sm">
                    <option>Industrial Robotics</option>
                    <option>AI & Machine Learning</option>
                    <option>STEM Foundation</option>
                    <option>Drone Technology</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest ml-1">Your Message</label>
                <textarea name="message" value={formData.message} onChange={handleChange} rows="3" placeholder="How can we help you?" className={`w-full bg-slate-50 border rounded-xl px-4 py-3 md:px-6 md:py-4 outline-none focus:bg-white transition-all resize-none text-sm ${errors.message ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500' : 'border-slate-200 focus:border-navy'}`}></textarea>
                {errors.message && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.message}</p>}
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto bg-navy text-white px-8 py-3.5 md:px-10 md:py-4 rounded-xl font-heading font-bold hover:bg-navy/90 hover:shadow-xl transition-all flex items-center justify-center space-x-3 group text-sm md:text-base disabled:opacity-50">
                <span>{isSubmitting ? "Submitting..." : "Submit Enquiry"}</span>
                <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </div>

          {/* Contact Info Side */}
          <div className="lg:w-[350px] bg-navy p-6 md:p-10 lg:p-12 text-white flex flex-col justify-between">
            <div>
              <h3 className="text-xl md:text-2xl font-heading font-black mb-6 md:mb-10">Contact Information</h3>
              <div className="space-y-6 md:space-y-10">
                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Phone size={18} className="text-primary md:w-5 md:h-5" />
                  </div>
                  <div>
                    <p className="text-blue-100/50 text-[9px] md:text-xs font-bold uppercase tracking-widest mb-1">Call Us</p>
                    <p className="font-bold text-sm md:text-base">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-primary md:w-5 md:h-5" />
                  </div>
                  <div>
                    <p className="text-blue-100/50 text-[9px] md:text-xs font-bold uppercase tracking-widest mb-1">Email Us</p>
                    <p className="font-bold text-sm md:text-base">info@prayogindia.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-primary md:w-5 md:h-5" />
                  </div>
                  <div>
                    <p className="text-blue-100/50 text-[9px] md:text-xs font-bold uppercase tracking-widest mb-1">Visit Us</p>
                    <p className="font-bold text-sm md:text-base leading-snug">123 Robotics Lane, Mumbai, Maharashtra 400001</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 md:mt-12 pt-8 md:pt-12 border-t border-white/10">
              <p className="text-blue-100/60 text-[11px] md:text-sm leading-relaxed">
                Follow us on social media for daily updates and student projects!
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
