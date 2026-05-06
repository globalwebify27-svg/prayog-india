"use client";

import { motion } from "framer-motion";
import { 
  Zap, Calendar, MapPin, Users, Bot, Cpu, Rocket, 
  ArrowRight, ShieldCheck, CheckCircle2, ChevronRight, 
  Award, Heart, Target, Lightbulb, PlayCircle, Star,
  Globe, BookOpen, PenTool, Sparkles
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyAction from "@/components/StickyAction";

export default function SummerCampLanding() {
  const stats = [
    { num: "15", suffix: "DAYS", label: "INTENSIVE TRAINING", sub: "Hands-on Practical Lab" },
    { num: "01", suffix: "KIT", label: "HUMANOID ROBOT", sub: "Take-Home Hardware" },
    { num: "60", suffix: "MAX", label: "STUDENTS / BATCH", sub: "Personalized Attention" },
    { num: "100", suffix: "%", label: "PLACEMENT SUPPORT", sub: "For Senior Students" }
  ];

  const curriculum = [
    { title: "Robotics Foundations", icon: <Cpu />, desc: "Master sensors, actuators, and basic electronics logic from scratch." },
    { title: "Advanced Programming", icon: <Globe />, desc: "Code in C++ and Python to breathe life into your robotic creations." },
    { title: "AI Integration", icon: <Sparkles />, desc: "Implement computer vision and neural networks for autonomous navigation." },
    { title: "Mechanical Design", icon: <PenTool />, desc: "Understand 3D structural integrity and balance for humanoid movement." }
  ];

  return (
    <main className="min-h-screen bg-white selection:bg-primary selection:text-navy">
      <Header />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[95vh] flex items-center pt-24 overflow-hidden bg-navy">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-white/5 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[10%] left-[20%] w-[25%] h-[25%] bg-primary/10 rounded-full blur-[80px] animate-bounce-slow"></div>
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Hero Text */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:w-3/5 text-center lg:text-left"
            >
              <div className="inline-flex items-center space-x-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8 backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-ping"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80">Robotics Summer Camp '26</span>
              </div>

              <h1 className="text-5xl md:text-8xl font-heading font-black text-white leading-[1.05] mb-8">
                Build The <span className="text-primary italic">Future</span> <br /> 
                With Your <span className="underline decoration-primary decoration-4 underline-offset-8">Hands</span>
              </h1>

              <p className="text-blue-100/60 text-lg md:text-2xl font-medium max-w-2xl mb-12 leading-relaxed">
                Join India's #1 STEM program. Transform from a student to an innovator in our 15-day Humanoid Robotics masterclass.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
                <Link href="/summer-camp/enroll" className="w-full sm:w-auto bg-primary text-navy px-12 py-5 rounded-xl font-heading font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/30 hover:bg-white hover:scale-105 transition-all flex items-center justify-center gap-4 group">
                  <span>Secure Your Seat</span>
                  <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </Link>
                <div className="flex items-center gap-4 text-white/40 text-[10px] font-black uppercase tracking-widest border-l border-white/10 pl-6">
                   <div className="flex -space-x-3">
                      {[1,2,3].map(i => <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="w-10 h-10 rounded-full border-2 border-navy" alt="User" />)}
                   </div>
                   <span>85% Slots Full</span>
                </div>
              </div>
            </motion.div>

            {/* Hero Image / Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:w-2/5 relative"
            >
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white/5 group">
                <img src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070" className="w-full h-auto aspect-[4/5] object-cover group-hover:scale-110 transition-transform duration-1000" alt="Innovation" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-60"></div>
                
                {/* Floating Badge */}
                <div className="absolute -bottom-6 -left-6 bg-white p-8 rounded-3xl shadow-2xl z-20 animate-bounce-slow">
                   <p className="text-4xl font-heading font-black text-navy leading-none mb-1">01</p>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">National Rank</p>
                </div>
              </div>
              {/* Abstract Shape */}
              <div className="absolute -top-10 -right-10 w-full h-full bg-primary/10 rounded-[3rem] -z-10 rotate-6"></div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* --- STATS STRIP --- */}
      <section className="py-14 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {stats.map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center lg:items-start text-center lg:text-left group"
              >
                <div className="flex items-baseline font-heading mb-3">
                  <span className="text-4xl md:text-6xl font-black text-navy leading-none">{s.num}</span>
                  <span className="text-xs md:text-sm font-bold text-primary ml-1 uppercase">{s.suffix}</span>
                </div>
                <div className="w-8 h-[2px] bg-primary/20 mb-4 group-hover:w-16 transition-all duration-500"></div>
                <h3 className="font-heading font-black text-[10px] md:text-xs uppercase tracking-wider text-navy mb-1">{s.label}</h3>
                <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest">{s.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- ABOUT THE CAMP --- */}
      <section className="py-20 md:py-32 bg-slate-50 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 md:gap-24">
            
            {/* Info Side */}
            <div className="lg:w-1/2">
               <h4 className="text-navy font-bold uppercase tracking-widest text-[10px] md:text-xs mb-4">Inside the Lab</h4>
               <h2 className="text-3xl md:text-6xl font-heading font-black text-slate-900 mb-8 leading-tight">
                 Beyond The <span className="text-primary italic">Textbooks</span>
               </h2>
               <p className="text-slate-600 mb-12 text-sm md:text-xl font-medium leading-relaxed">
                 Traditional education tells you how things work. We show you. Spend 15 days in an environment 
                 designed for creators, where theory vanishes and your ideas take physical form.
               </p>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {curriculum.map((item, i) => (
                    <div key={i} className="flex items-start space-x-4 group">
                       <div className="w-12 h-12 rounded-2xl bg-white shadow-inner flex items-center justify-center shrink-0 text-navy group-hover:bg-primary transition-colors">
                          {item.icon}
                       </div>
                       <div>
                          <h4 className="font-heading font-black text-sm text-navy mb-1">{item.title}</h4>
                          <p className="text-xs text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>

               <Link href="/summer-camp/enroll" className="inline-flex items-center gap-4 text-navy font-heading font-black text-sm uppercase tracking-widest border-b-2 border-primary pb-2 hover:gap-6 transition-all">
                  <span>Explore Full Curriculum</span>
                  <ArrowRight size={20} />
               </Link>
            </div>

            {/* Image Side */}
            <div className="lg:w-1/2 relative">
               <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?q=80&w=2070" className="w-full h-auto aspect-square object-cover" alt="Student Working" />
                  <div className="absolute inset-0 bg-navy/10"></div>
               </div>
               {/* Experience Badge Overlay */}
               <div className="absolute -top-10 -right-10 bg-navy p-10 rounded-3xl shadow-2xl z-20 text-center border-t-4 border-primary">
                  <span className="block text-5xl font-heading font-black text-white">#01</span>
                  <span className="block text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-2">STEM Workshop</span>
               </div>
               {/* Decorative Gradient Blur */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-3xl -z-10"></div>
            </div>

          </div>
        </div>
      </section>

      {/* --- HARDWARE SECTION (DARK) --- */}
      <section className="py-20 md:py-32 bg-navy relative overflow-hidden">
         {/* Background Orbs */}
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]"></div>

         <div className="container mx-auto px-4 md:px-8 relative z-10 text-center max-w-5xl">
            <h4 className="text-primary font-black uppercase tracking-[0.4em] text-xs mb-6">The Hardware Spotlight</h4>
            <h2 className="text-4xl md:text-8xl font-heading font-black text-white mb-10 leading-tight">
               Meet The <span className="italic">Prayog-X1</span>
            </h2>
            <p className="text-blue-100/60 text-lg md:text-2xl font-medium mb-16 leading-relaxed">
               A professional-grade 16-DOF humanoid robot kit. Every student receives this hardware on Day 1. 
               It’s yours to build, code, and keep forever.
            </p>

            <div className="relative rounded-[4rem] overflow-hidden border-4 border-white/5 mb-20 group">
               <img src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070" className="w-full h-auto aspect-video object-cover group-hover:scale-105 transition-transform duration-[2s]" alt="X1 Robot" />
               <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent"></div>
               
               <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-8">
                  {[
                    { label: "Servos", val: "16" },
                    { label: "Processing", val: "AI-Ready" },
                    { label: "Material", val: "ABS+" }
                  ].map((spec, i) => (
                    <div key={i} className="text-center px-8 border-x border-white/10 backdrop-blur-md py-4 rounded-2xl bg-white/5">
                       <p className="text-2xl font-black text-primary">{spec.val}</p>
                       <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">{spec.label}</p>
                    </div>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 { title: "Personal Kit", desc: "No sharing. You get your own dedicated hardware set." },
                 { title: "Cloud Lab", desc: "Sync your robot's code to the cloud for remote debugging." },
                 { title: "Future Ready", desc: "Compatible with Raspberry Pi and NVIDIA Jetson." }
               ].map((feat, i) => (
                 <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm text-left">
                    <CheckCircle2 className="text-primary mb-4" size={24} />
                    <h4 className="text-white font-heading font-black text-lg mb-2">{feat.title}</h4>
                    <p className="text-white/40 text-sm font-medium leading-relaxed">{feat.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* --- MENTORS SECTION --- */}
      <section className="py-20 md:py-32 bg-white">
         <div className="container mx-auto px-4 md:px-8 text-center mb-20">
            <h4 className="text-navy font-bold uppercase tracking-widest text-[10px] md:text-xs mb-4">Expert Guidance</h4>
            <h2 className="text-3xl md:text-5xl font-heading font-black text-navy">Learn From The <span className="text-primary italic">Masters</span></h2>
         </div>
         <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
               { name: "Dr. Vikram Sethi", role: "AI Specialist", img: "https://i.pravatar.cc/400?u=v" },
               { name: "Sarah Johnson", role: "Robotics Design", img: "https://i.pravatar.cc/400?u=s" },
               { name: "Arjun Mehta", role: "Logic Systems", img: "https://i.pravatar.cc/400?u=a" }
            ].map((m, i) => (
               <motion.div 
                  key={i}
                  whileHover={{ y: -15 }}
                  className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 text-center group transition-all duration-500 hover:bg-white hover:shadow-2xl hover:border-primary"
               >
                  <div className="relative w-40 h-40 mx-auto mb-8 rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:border-primary transition-all">
                     <img src={m.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={m.name} />
                  </div>
                  <h3 className="text-2xl font-heading font-black text-navy mb-2">{m.name}</h3>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">{m.role}</p>
               </motion.div>
            ))}
         </div>
      </section>

      {/* --- FINAL CTA SECTION --- */}
      <section className="py-20 md:py-32">
         <div className="container mx-auto px-4 md:px-8">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               className="bg-[#01254d] rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden"
            >
               {/* Decorative Orbs */}
               <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-40 -mt-40 blur-3xl"></div>
               <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/10 rounded-full -ml-40 -mb-40 blur-3xl"></div>

               <div className="relative z-10 max-w-4xl mx-auto">
                  <h2 className="text-4xl md:text-7xl font-heading font-black text-white mb-8 leading-tight">
                     Ready to Claim Your <br /> <span className="text-primary italic">Spot in the Future?</span>
                  </h2>
                  <p className="text-blue-100/60 text-lg md:text-2xl font-medium mb-12 max-w-2xl mx-auto">
                     Batch sizes are strictly limited to 60 students to ensure zero-compromise learning. Reserve your kit today.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                     <Link href="/summer-camp/enroll" className="w-full sm:w-auto bg-primary text-navy px-12 py-5 rounded-xl font-heading font-black text-sm uppercase tracking-widest hover:bg-white hover:scale-110 transition-all shadow-2xl shadow-primary/20">
                        Enroll Now
                     </Link>
                     <Link href="/contact" className="w-full sm:w-auto bg-white/10 text-white border border-white/20 px-12 py-5 rounded-xl font-heading font-bold text-sm uppercase tracking-widest hover:bg-white/20 transition-all">
                        Request Callback
                     </Link>
                  </div>

                  <div className="mt-16 pt-16 border-t border-white/5 flex flex-wrap justify-center gap-8 md:gap-16">
                     {[
                        { label: "Secure Payment", icon: <ShieldCheck size={18} /> },
                        { label: "Limited Seats", icon: <Users size={18} /> },
                        { label: "Global Cert", icon: <Award size={18} /> }
                     ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 text-white/30 text-[10px] font-black uppercase tracking-widest">
                           <span className="text-primary">{item.icon}</span>
                           {item.label}
                        </div>
                     ))}
                  </div>
               </div>
            </motion.div>
         </div>
      </section>

      <Footer />
      <StickyAction />

      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}
