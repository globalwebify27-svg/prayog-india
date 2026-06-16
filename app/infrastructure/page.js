"use client";

import { motion } from "framer-motion";
import { 
  Monitor, 
  Cpu, 
  Settings, 
  Layers, 
  ShieldCheck, 
  Zap, 
  Radio, 
  Wind,
  CheckCircle2,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

const labs = [
  {
    id: 1,
    title: "Robotics Innovation Lab",
    equipment: "Microcontrollers, Servo Motors, Sensors, Actuators, and Educational Robotic Kits",
    desc: "A hands-on workspace for design, assembly, and coding robotic models. Students learn the foundations of mechatronics, circuit routing, and programming motion controllers using practical hardware kits.",
    image: "/assets/hero_robotics_realistic.png",
    specs: ["Microcontroller Prototyping", "Servo & Stepper Control", "Sensor Interfacing", "Basic Motion Programming"]
  },
  {
    id: 2,
    title: "R&D Lab",
    equipment: "Development Boards, Digital Multimeters, Soldering Stations, Basic Oscilloscopes, and Electronic Components",
    desc: "Our collaborative space for electronic prototyping and hardware design. Ideal for firmware engineering, basic circuit soldering, and developing smart Internet of Things (IoT) applications.",
    image: "/assets/m3.png",
    specs: ["Embedded System Design", "Solder & Assembly Stations", "Wireless IoT Networks", "Circuit Diagnostics"]
  },
  {
    id: 3,
    title: "Drone Technology Lab",
    equipment: "Educational Quadcopter Kits, Flight Controllers, Telemetry Modules, and Flight Simulators",
    desc: "A laboratory dedicated to aerial robotics. Focuses on flight control basics, drone assembly, flight stability calibration, and manual/guided navigation testing.",
    image: "/assets/m1.png",
    specs: ["Quadcopter Assembly", "Flight Control Tuning", "Basic Telemetry Setup", "FPV & Simulator Training"]
  }
];

export default function InfrastructurePage() {
  return (
    <main className="min-h-screen bg-slate-50 font-body">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-semibold text-white mb-6 leading-tight tracking-tight">
              Institutional <span className="text-primary">Infrastructure</span>
            </h1>
            <p className="text-blue-100/60 text-lg md:text-xl leading-relaxed">
              Explore our hands-on laboratories and prototyping bays equipped with development hardware and interactive engineering kits.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Labs Showcase */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-24">
            {labs.map((lab, i) => (
              <motion.div 
                key={lab.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
              >
                {/* Visual */}
                <div className="lg:w-1/2 relative group">
                  <div className="absolute inset-0 bg-primary/10 rounded-2xl -rotate-3 transition-transform group-hover:rotate-0" />
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-xl">
                    <img src={lab.image} alt={lab.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-6 left-6">
                      <span className="px-4 py-1.5 bg-navy/90 backdrop-blur-sm text-white rounded-lg text-[10px] font-bold uppercase tracking-widest border border-white/10 shadow-lg">
                        Lab {String(lab.id).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="lg:w-1/2 space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">{lab.title}</h2>
                    <p className="text-primary font-bold text-[11px] uppercase tracking-wider mb-6 flex items-center gap-2">
                      <Settings size={16} /> Key Systems: {lab.equipment}
                    </p>
                    <p className="text-slate-500 text-base leading-relaxed font-medium">
                      {lab.desc}
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {lab.specs.map(spec => (
                      <div key={spec} className="flex items-center space-x-3 text-slate-700 text-sm font-semibold p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4">
                    <Link href="/gallery" className="inline-flex items-center space-x-2 text-navy font-bold text-xs uppercase tracking-wider group/btn">
                      <span>Full lab walkthrough</span>
                      <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Standards */}
      <section className="py-24 bg-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Institutional Standards</h2>
            <p className="text-blue-100/40 text-sm max-w-xl mx-auto font-medium">Our facilities are maintained to absolute industrial safety and operational standards.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-primary shadow-lg">
                <ShieldCheck size={32} />
              </div>
              <h4 className="text-lg font-bold">Safety First Protocols</h4>
              <p className="text-blue-100/30 text-xs leading-relaxed font-medium">Equipped with automated emergency stops and high-standard protective gear for all students.</p>
            </div>
            <div className="text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-primary shadow-lg">
                <Zap size={32} />
              </div>
              <h4 className="text-lg font-bold">Uninterrupted Sync</h4>
              <p className="text-blue-100/30 text-xs leading-relaxed font-medium">Dedicated high-bandwidth fiber links and power redundancy to ensure laboratory uptime.</p>
            </div>
            <div className="text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-primary shadow-lg">
                <Layers size={32} />
              </div>
              <h4 className="text-lg font-bold">Modular Workspaces</h4>
              <p className="text-blue-100/30 text-xs leading-relaxed font-medium">Scalable research bays that can be reconfigured for collaborative industrial workshops.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-10 flex justify-center">
            <div className="p-4 bg-slate-50 rounded-full border border-slate-100">
              <Monitor size={40} className="text-navy" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-6 tracking-tight">Visit Our Institutional Hubs</h2>
          <p className="text-slate-500 text-base mb-10 leading-relaxed font-medium">
            Experience the Prayog India technical ecosystem in person. Schedule a guided tour of our Mumbai or Ranchi research hubs today.
          </p>
          <Link href="/contact" className="inline-flex items-center space-x-3 bg-navy text-white px-10 py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-navy/10">
            <span>Book a Visit</span>
            <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
