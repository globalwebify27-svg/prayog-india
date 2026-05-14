import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Lock, Eye, FileText } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      {/* Header */}
      <section className="pt-32 pb-20 bg-navy relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 rounded-full blur-[120px] translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-6">
            <Shield size={14} className="text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Trust & Safety</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">Privacy <span className="text-primary">Policy</span></h1>
          <p className="text-blue-100/60 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Your privacy is our priority. This policy outlines how we handle your personal information at Prayog India Robotics.
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
                  <Eye size={20} />
                </div>
                <h2 className="text-2xl font-black text-navy uppercase tracking-tight">1. Information We Collect</h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-sm">
                We collect information that you provide directly to us when you enroll in our programs, create an account, or contact our support team. This includes:
              </p>
              <ul className="grid md:grid-cols-2 gap-4">
                {[
                  "Full name and contact information",
                  "Student academic details",
                  "Parent/Guardian information",
                  "Payment and transaction data",
                  "Course progress and performance records",
                  "Technical logs and device information"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs font-bold text-navy/70">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 bg-navy/5 rounded-xl flex items-center justify-center text-navy">
                  <Lock size={20} />
                </div>
                <h2 className="text-2xl font-black text-navy uppercase tracking-tight">2. How We Use Data</h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-sm">
                The collected data is utilized to provide a seamless educational experience and institutional management:
              </p>
              <div className="space-y-4">
                <div className="p-6 bg-navy text-white rounded-2xl border border-white/5 shadow-xl">
                  <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-3">Institutional Utility</h4>
                  <p className="text-blue-100/60 text-xs leading-relaxed">
                    Data helps us manage student enrollments, track academic progress in robotics and AI programs, issue certificates, and facilitate placement opportunities with our industry partners.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 bg-navy/5 rounded-xl flex items-center justify-center text-navy">
                  <FileText size={20} />
                </div>
                <h2 className="text-2xl font-black text-navy uppercase tracking-tight">3. Data Security</h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-sm">
                Prayog India Robotics implements industry-standard security protocols to protect your personal data from unauthorized access, alteration, or disclosure. We use encrypted payment gateways and secure server architectures to ensure that your sensitive information remains confidential.
              </p>
            </div>

            <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-200">
              <h3 className="text-navy font-black text-lg mb-4">Questions about your privacy?</h3>
              <p className="text-slate-500 text-sm mb-6">If you have any questions regarding this Privacy Policy, please reach out to our data protection cell.</p>
              <a href="mailto:privacy@prayogindiarobotics.com" className="inline-flex items-center gap-2 bg-navy text-white px-8 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">
                Contact Privacy Cell
              </a>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
