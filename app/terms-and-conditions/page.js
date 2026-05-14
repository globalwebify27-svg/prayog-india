import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Gavel, CheckCircle, AlertCircle, FileText } from "lucide-react";

export default function TermsAndConditions() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      {/* Header */}
      <section className="pt-32 pb-20 bg-navy relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1/2 h-full bg-primary/5 rounded-full blur-[120px] -translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-6">
            <Gavel size={14} className="text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Legal Framework</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">Terms & <span className="text-primary">Conditions</span></h1>
          <p className="text-blue-100/60 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            By accessing Prayog India Robotics, you agree to comply with and be bound by the following institutional terms.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-16">
            
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 bg-navy/5 rounded-xl flex items-center justify-center text-navy">
                  <CheckCircle size={20} />
                </div>
                <h2 className="text-2xl font-black text-navy uppercase tracking-tight">1. Acceptance of Terms</h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-sm">
                By enrolling in any program at PRAYOG INDIA ROBOTICS PVT. LTD., you acknowledge that you have read, understood, and agreed to be bound by these Terms and Conditions. These terms apply to all students, visitors, and users of the platform.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 bg-navy/5 rounded-xl flex items-center justify-center text-navy">
                  <FileText size={20} />
                </div>
                <h2 className="text-2xl font-black text-navy uppercase tracking-tight">2. Intellectual Property</h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-sm">
                All course content, including robotics designs, AI algorithms, software code, and instructional videos, are the exclusive property of Prayog India Robotics. 
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-navy mb-2">Permitted Use</h4>
                  <p className="text-slate-500 text-[11px] leading-relaxed">Students are granted a non-exclusive, non-transferable license to use the materials for their personal educational development during the program tenure.</p>
                </div>
                <div className="p-5 bg-rose-50 border border-rose-100 rounded-2xl">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-rose-600 mb-2">Prohibited Actions</h4>
                  <p className="text-rose-600/60 text-[11px] leading-relaxed">Redistribution, reproduction, or commercial use of our intellectual property without written consent is strictly prohibited and subject to legal action.</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 bg-navy/5 rounded-xl flex items-center justify-center text-navy">
                  <AlertCircle size={20} />
                </div>
                <h2 className="text-2xl font-black text-navy uppercase tracking-tight">3. Student Conduct</h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-sm">
                Students are expected to maintain professional decorum during both online and offline sessions. Prayog India reserves the right to terminate enrollment for any student found engaging in malpractice, harassment, or damaging institutional property.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 bg-navy/5 rounded-xl flex items-center justify-center text-navy">
                  <Gavel size={20} />
                </div>
                <h2 className="text-2xl font-black text-navy uppercase tracking-tight">4. Limitation of Liability</h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-sm">
                While we strive for technical excellence, PRAYOG INDIA ROBOTICS PVT. LTD. shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use the educational services or hardware kits provided.
              </p>
            </div>

            <div className="p-8 bg-navy text-white rounded-[2rem] border border-white/5 shadow-2xl">
              <h3 className="text-primary font-black text-lg mb-2">Jurisdiction</h3>
              <p className="text-blue-100/40 text-xs leading-relaxed mb-6">
                These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in Ranchi, Jharkhand.
              </p>
              <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.2em]">Last Updated: May 2026</p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
