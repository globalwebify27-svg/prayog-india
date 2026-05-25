"use client";

import { motion } from "framer-motion";
import { 
  ClipboardCheck, 
  CreditCard, 
  UserPlus, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle,
  ShieldCheck,
  Zap,
  ChevronRight
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

const admissionSteps = [
  {
    id: 1,
    title: "Application Initialization",
    desc: "Complete the digital enrollment form with your academic credentials and specialization preference.",
    icon: <UserPlus className="w-6 h-6" />
  },
  {
    id: 2,
    title: "Technical Review",
    desc: "Our academic committee reviews your profile to ensure alignment with our specialized industrial cohorts.",
    icon: <ClipboardCheck className="w-6 h-6" />
  },
  {
    id: 3,
    title: "Admission Confirmation",
    desc: "Receive your institutional acceptance letter and synchronize your student identity on the portal.",
    icon: <CheckCircle2 className="w-6 h-6" />
  },
  {
    id: 4,
    title: "Tuition Sync",
    desc: "Process the initial specialization fees to activate your laboratory access and LMS credentials.",
    icon: <CreditCard className="w-6 h-6" />
  }
];

export default function AdmissionsPage() {
  return (
    <main className="min-h-screen bg-slate-50 font-body">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-semibold text-white mb-6 leading-tight tracking-tight">
              Institutional <span className="text-primary">Admissions 2026</span>
            </h1>
            <p className="text-blue-100/60 text-lg md:text-xl leading-relaxed">
              Join the next generation of industrial engineers. Our simplified enrollment process is designed for seamless academic transition.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Enrollment Wizard Concept */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">Your Pathway to Technical Mastery</h2>
            <p className="text-slate-500 max-w-xl mx-auto font-medium text-sm">Follow these 4 logical steps to initialize your professional journey at Prayog India.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {admissionSteps.map((step, i) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative group hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 text-navy flex items-center justify-center mb-8 border border-slate-100 group-hover:bg-primary transition-colors">
                  {step.icon}
                </div>
                <div className="absolute top-8 right-8 text-slate-100 font-bold text-4xl group-hover:text-primary/10 transition-colors">
                  {String(step.id).padStart(2, '0')}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">{step.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed font-medium">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Fees & Scholarships */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-1 max-w-2xl mx-auto gap-16 items-center">
            <div className="relative">
              <div className="bg-navy rounded-3xl p-10 md:p-16 text-white relative overflow-hidden shadow-2xl">
                <ShieldCheck className="absolute top-4 right-4 text-primary opacity-10" size={80} />
                <h3 className="text-3xl font-bold mb-6 tracking-tight text-primary">Specialization Tiers</h3>
                <div className="space-y-6">
                  {[
                    { tier: "Industrial Robotics", period: "12 Weeks", focus: "KUKA/Fanuc Hardware" },
                    { tier: "AI & Machine Learning", period: "8 Weeks", focus: "Computer Vision Hub" },
                    { tier: "Drone Technology", period: "6 Weeks", focus: "UAV Architecture" }
                  ].map((fee, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                      <div>
                        <h4 className="text-sm font-bold text-white">{fee.tier}</h4>
                        <p className="text-[10px] text-blue-100/40 font-bold uppercase tracking-widest">{fee.focus}</p>
                      </div>
                      <div className="text-right">
                        <span className="block text-xs font-bold text-primary">{fee.period}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-8 text-[10px] text-blue-100/20 font-medium italic">
                  * Fees vary based on cohort density and regional lab allocation.
                </p>
              </div>
            </div>
            

          </div>
        </div>
      </section>

      {/* Admissions FAQ Helper */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <HelpCircle size={40} className="mx-auto text-primary mb-8" />
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Common Admission Queries</h2>
          <div className="max-w-2xl mx-auto space-y-4 text-left">
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h4 className="text-sm font-bold text-navy mb-2">When do new cohorts start?</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">Fresh industrial cohorts initialize on the first Monday of every quarter (January, April, July, October).</p>
            </div>
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h4 className="text-sm font-bold text-navy mb-2">Can I switch specializations mid-way?</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">Specialization tracks are intensive. Switches are only permitted within the first 14 operational days of the cohort.</p>
            </div>
          </div>
          <div className="mt-12">
            <Link href="/faq" className="text-navy font-bold text-xs uppercase tracking-widest border-b-2 border-primary/30 hover:border-primary transition-all">
              View full knowledge base
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white text-center">
        <div className="max-w-3xl mx-auto px-6 bg-slate-50 border border-slate-200 rounded-[2.5rem] p-12 shadow-sm">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 tracking-tight">Ready to Initialize?</h2>
          <p className="text-slate-500 text-sm mb-10 leading-relaxed font-medium">
            Join 5,000+ engineers building the future of industrial robotics. Enrollment for the Summer 2026 cohort is now active.
          </p>
          <Link href="/register" className="inline-flex items-center justify-center space-x-3 bg-navy text-white px-12 py-4 rounded-xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-navy/10 hover:bg-black transition-all">
            <span>Begin Application</span>
            <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
