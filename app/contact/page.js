"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare,
  Globe,
  Users,
  Zap,
  ChevronRight
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const contactInfo = [
  {
    icon: <Phone size={20} />,
    title: "Direct Connect",
    details: ["+91 7033066338"],
    color: "bg-blue-50 text-blue-600 border-blue-100"
  },
  {
    icon: <Mail size={20} />,
    title: "Institutional Mail",
    details: ["info@prayogindiarobotics.com", "trainingcell@prayogindiarobotics.com"],
    color: "bg-emerald-50 text-emerald-600 border-emerald-100"
  },
  {
    icon: <MapPin size={20} />,
    title: "Ranchi Hub",
    details: ["1st Floor, City Centre, Club Road,", "Ranchi - 834001"],
    color: "bg-purple-50 text-purple-600 border-purple-100"
  }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        alert("Institutional Inquiry Sent.");
        setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
      }
    } catch (error) {
      alert("System failure. Please retry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="min-h-screen bg-slate-50 font-body">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-semibold text-white mb-6 leading-tight tracking-tight">
              Institutional <span className="text-primary">Engagement</span>
            </h1>
            <p className="text-blue-100/60 text-lg md:text-xl leading-relaxed">
              Connect with our regional hubs or admissions team for inquiries regarding industrial workshops, residency, and specialized courses.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            
            {/* Info Cards */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-6">
                {contactInfo.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    viewport={{ once: true }}
                    className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm group hover:shadow-md transition-all"
                  >
                    <div className={`w-12 h-12 rounded-xl ${item.color} border flex items-center justify-center mb-6 group-hover:scale-105 transition-transform`}>
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>
                    <div className="space-y-1.5">
                      {item.details.map((detail, idx) => (
                        <p key={idx} className="text-slate-500 font-medium text-sm leading-relaxed">{detail}</p>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-navy rounded-2xl p-8 text-white relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                <h4 className="text-base font-bold mb-6">Digital Footprint</h4>
                <div className="flex space-x-4 relative z-10">
                  {[Globe, Users, Zap].map((Icon, i) => (
                    <button key={i} className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:text-navy transition-all">
                      <Icon size={18} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-slate-200">
                <div className="mb-10">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Institutional Inquiry</h2>
                  <p className="text-slate-500 text-sm font-medium">Synchronized response within 24 operational hours.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-tight ml-1">Full name</label>
                      <input name="name" value={formData.name} onChange={handleChange} type="text" required placeholder="Arjun Malhotra" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-tight ml-1">Official email</label>
                      <input name="email" value={formData.email} onChange={handleChange} type="email" required placeholder="arjun@example.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-tight ml-1">Engagement subject</label>
                    <select name="subject" value={formData.subject} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy focus:bg-white transition-all text-sm font-semibold appearance-none">
                      <option>General Inquiry</option>
                      <option>Admissions</option>
                      <option>Industrial Workshops</option>
                      <option>Partnerships</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-tight ml-1">Inquiry details</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} rows={5} required placeholder="State your technical or academic query..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium resize-none"></textarea>
                  </div>

                  <button type="submit" disabled={isSubmitting} className="w-full bg-navy text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-black transition-all flex items-center justify-center space-x-2 disabled:opacity-50">
                    <span>{isSubmitting ? "Transmitting..." : "Synchronize Inquiry"}</span>
                    <ChevronRight size={18} />
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-[450px] grayscale border-t border-slate-200">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3662.3394602909477!2d85.3262699761358!3d23.37683930411899!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f4e10714b60001%3A0x67396a84f3e69f10!2sCity%20Centre%2C%20Ranchi!5e0!3m2!1sen!2sin!4v1713958000000!5m2!1sen!2sin" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>

      <Footer />
    </main>
  );
}
