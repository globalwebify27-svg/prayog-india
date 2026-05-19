"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Sparkles,
  ArrowRight,
  Cpu,
  Building2,
  GraduationCap,
  Zap,
  Play,
  X,
  Tv,
  Award,
  Target,
  Globe,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  Code,
  Flame,
  BookOpen,
  Heart,
  ChevronRight,
  ChevronLeft,
  Activity,
  Terminal,
  Atom,
  Compass,
  Layers,
  Server,
  Briefcase,
  Wrench
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  const [showIntroVideo, setShowIntroVideo] = useState(false);
  const [activeTab, setActiveTab] = useState("what-we-do");
  const [activeHistoryStep, setActiveHistoryStep] = useState(0);
  const [activeWhyPillar, setActiveWhyPillar] = useState(0);
  
  // Carousel State for Core Team
  const [teamSlideIndex, setTeamSlideIndex] = useState(0);
  const [selectedMember, setSelectedMember] = useState(null);

  // Interactive Tech Sandbox State
  const [sandboxState, setSandboxState] = useState({
    connected: false,
    power: false,
    signals: "Ready to initialize",
    voltage: 0,
    activeLed: null
  });

  const triggerLed = (ledId) => {
    if (!sandboxState.power) {
      setSandboxState(prev => ({ ...prev, signals: "⚠️ Turn on main power switch first!" }));
      return;
    }
    setSandboxState(prev => ({
      ...prev,
      activeLed: ledId,
      signals: `🔵 LED ${ledId} activated. Output pulse transmitted.`
    }));
  };

  const connectBoard = () => {
    setSandboxState(prev => ({
      ...prev,
      connected: !prev.connected,
      power: false,
      voltage: 0,
      activeLed: null,
      signals: !prev.connected ? "✅ Board online via Web-USB" : "🔌 Board disconnected"
    }));
  };

  const togglePower = () => {
    if (!sandboxState.connected) {
      setSandboxState(prev => ({ ...prev, signals: "⚠️ Connection required. Click Connect." }));
      return;
    }
    setSandboxState(prev => ({
      ...prev,
      power: !prev.power,
      voltage: !prev.power ? 5.0 : 0,
      activeLed: null,
      signals: !prev.power ? "⚡ VCC output 5.0V. Microcontroller armed." : "💤 System standby"
    }));
  };

  // Structured Core Data
  const historyMilestones = [
    {
      year: "2015",
      title: "The Genesis of PRAYOGTECH",
      desc: "Our journey began in 2015, when Enamul Hassan founded PRAYOGTECH while pursuing his Engineering with a vision to make advanced technologies affordable, accessible, and practical for students, innovators, and technology enthusiasts across India.",
      tag: "GENESIS NODE",
      icon: Cpu,
      stats: { products: "DIY Robotics Kits", spareParts: "Drones & Arduino", scale: "Local Hubs" }
    },
    {
      year: "2016 - 2024",
      title: "Growth & Ecosystem Expansion",
      desc: "What started as a technology platform through PRAYOG INDIA for Robotics Products, Arduino Accessories, IoT Modules, Drone Spare Parts, Science Kits, and Project Development Solutions gradually evolved into a mission-driven ecosystem focused on innovation and future technologies. We expanded into Embedded Systems, IoT, Automation, AI, and STEM Education.",
      tag: "ECOSYSTEM R&D",
      icon: Atom,
      stats: { specialties: "IoT & Drone tech", bootcamps: "Physical Camps", curriculum: "STEM Integrated" }
    },
    {
      year: "2025",
      title: "Corporate Transformation",
      desc: "With growing impact, experience, and trust, the vision transformed and incorporated into PRAYOG INDIA ROBOTICS PVT. LTD. in 2025. This created a stronger foundation for building India’s next-generation EdTech and Innovation ecosystem through turnkey academic laboratories.",
      tag: "INCORPORATION V1",
      icon: Building2,
      stats: { registration: "Pvt Ltd Corp", systems: "Turnkey Labs", certification: "ISO Standardized" }
    },
    {
      year: "Today",
      title: "Bridging the Tech Gap",
      desc: "Today, we are working to bridge the gap between theoretical education and real-world industry requirements by providing practical learning experiences, research-driven training, innovation-focused workshops, STEM Labs, and knowledge-sharing internship programs.",
      tag: "OPERATIONAL NOW",
      icon: GraduationCap,
      stats: { internships: "Fee-based programs", labsInstalled: "100+ schools/colleges", research: "Indigenization focus" }
    }
  ];

  const whatWeDoList = [
    { title: "Robotics Training", icon: Cpu, desc: "Hands-on design, construction, and programming of smart autonomous systems." },
    { title: "Embedded Systems & IoT Training", icon: Atom, desc: "Microcontroller interfacing, sensor fusion, and real-time cloud data telemetry." },
    { title: "Drone Technology Training", icon: Compass, desc: "Aero-kinematics, flight controller setup, UAV piloting, and structural assembly." },
    { title: "Artificial Intelligence & STEM Education", icon: Sparkles, desc: "Machine learning basics, neural networks, and integrated science-technology projects." },
    { title: "3D Designing & 3D Printing Learning", icon: Layers, desc: "CAD modeling, slicing optimization, and physical additive manufacturing." },
    { title: "Automation & Innovation-Based Projects", icon: Server, desc: "Industrial control systems, PLC automation, and customizable smart prototypes." },
    { title: "Fee-Based Internship Programs", icon: Briefcase, desc: "Structured knowledge-sharing internships with intensive real-world project portfolios." },
    { title: "School & College STEM Labs", icon: Building2, desc: "Turnkey setups for state-of-the-art Robotics and Innovation Labs in institutions." },
    { title: "Industry-Oriented Workshops", icon: GraduationCap, desc: "Immersive technical bootcamps designed for hands-on exposure in schools & colleges." },
    { title: "Practical Hardware Learning", icon: Wrench, desc: "Real-time components engineering and experimental hardware diagnostic platforms." }
  ];

  const whoWeServeList = [
    { target: "School Students", desc: "Cultivating young minds with foundational logical thinking, basic mechanics, and visual programming." },
    { target: "Diploma & Engineering Students", desc: "Providing advanced, industry-ready skillsets that align with dynamic global recruitment needs." },
    { target: "BCA / MCA / IT Students", desc: "Fusing software coding capability with physical automation, embedded hardware, and smart IoT tools." },
    { target: "Schools, Colleges & Universities", desc: "Developing complete, future-proof laboratories, dynamic curricula, and technical training setups." },
    { target: "Startups & Innovators", desc: "Offering rapid prototyping, customized components design, and critical technical mentoring." },
    { target: "Hobbyists & Technology Enthusiasts", desc: "Supporting self-guided learners with real hardware components, project guides, and spare parts." }
  ];

  const whyPrayogList = [
    { title: "Practical Hands-On Learning", desc: "We move students away from dry theory and place real, physical hardware directly into their hands.", detail: "Through custom development rigs, every student compiles code and views the real-time physical result." },
    { title: "Real Hardware & Real-Time Projects", desc: "Every module involves building physical circuits, flashing firmware, and deploying active automation setups.", detail: "No simulated sandboxes in exams; students wire actual logic gates and microcontrollers." },
    { title: "Industry-Oriented Skill Development", desc: "Our curriculum is engineered around current and upcoming demands of global deep-tech employers.", detail: "Aligning software-hardware paradigms with industry engineering protocols." },
    { title: "Innovation & Research-Based Education", desc: "We empower students to ask 'Why?' and conduct research to innovate and construct original solutions.", detail: "Providing open-source telemetry tools for student-led R&D ventures." },
    { title: "Affordable Technical Learning", desc: "Democratizing complex engineering concepts, making advanced kits and tools budget-accessible.", detail: "Manufacturing indigenized spare parts internally to reduce STEM lab setup costs." },
    { title: "Beginner-to-Advanced Learning Approach", desc: "Our structured pedagogy builds deep expertise smoothly, welcoming absolute beginners through master builders.", detail: "Clean progression tracks mapped to the school syllabus up to university engineering levels." },
    { title: "Future Technology Exposure", desc: "Direct training with premium emerging disciplines like Drone engineering, IoT networks, and smart robotics.", detail: "Equipping young engineers with edge processing, drone flight logging, and AI node skills." }
  ];

  const coreTeamList = [
    {
      name: "Enamul Hassan",
      role: "Founder",
      initial: "EH",
      tag: "Founder & Visionary",
      shortDesc: "Founder of PRAYOG INDIA ROBOTICS PVT. LTD. and the visionary behind the journey that started in 2015 during his Engineering days.",
      fullBio: "Founder of PRAYOG INDIA ROBOTICS PVT. LTD. and the visionary behind the journey that started in 2015 during his Engineering days. With a strong passion for Robotics, Embedded Systems, Innovation, and practical education, he laid the foundation of PRAYOGTECH and later expanded it into a complete EdTech and Innovation ecosystem focused on future technologies and skill development.",
      stats: { focus: "Strategic Scaling", activeLabs: "100+ Turnkey", codeLevel: "Founder Architect" }
    },
    {
      name: "Md. Shahnawaz Abbas",
      role: "Research & Training Manager",
      initial: "SA",
      tag: "Co-Founder Level dedicated Backbone",
      shortDesc: "Md. Shahnawaz Abbas has been one of the strongest pillars behind the growth and success of PRAYOG INDIA ROBOTICS since the very beginning of the journey.",
      fullBio: "Md. Shahnawaz Abbas has been one of the strongest pillars behind the growth and success of PRAYOG INDIA ROBOTICS since the very beginning of the journey. More than a team member, he has contributed with the dedication and leadership of a co-founder in shaping the organization’s vision, research activities, practical learning ecosystem, technical programs, and innovation culture.\n\nAs the backbone of the organization, he has continuously played a vital role in developing research-driven learning methodologies, technical workshops, innovation-based projects, and student engagement systems. His dedication, leadership, and technical expertise have helped build PRAYOG INDIA ROBOTICS into a trusted platform for Robotics, Embedded Systems, IoT, Drone Technology, Automation, and STEM Education.",
      stats: { focus: "Applied R&D", bootcamps: "50+ Built", codeLevel: "Chief Technologist" }
    },
    {
      name: "Emraan Hassan",
      role: "Robotics & Emerging Tech Specialist",
      initial: "EH",
      tag: "Emerging Tech Specialist",
      shortDesc: "Emraan Hassan is an important driving force in taking the mission forward with energy, dedication, and technical excellence.",
      fullBio: "Although recently joined, Emraan Hassan has already become an important driving force in taking the mission of PRAYOG INDIA ROBOTICS forward with energy, dedication, and technical excellence. With strong expertise in Robotics, Embedded Systems, IoT, and Drone Technology, he actively contributes toward practical technology learning, innovation-based projects, technical mentorship, and future-focused development activities. His passion for emerging technologies and hands-on problem-solving reflects the innovative spirit of the organization. His commitment to empowering students with practical technical skills and future-ready knowledge is helping strengthen the organization’s vision of building a new generation of innovators, creators, and technology leaders.",
      stats: { focus: "Drone Flight Loops", sensors: "IoT Cloud APIs", codeLevel: "Specialist Driver" }
    },
    {
      name: "Jay Prakash Kumar",
      role: "Sr. Embedded Engineer",
      initial: "JK",
      tag: "Hardware Architect",
      shortDesc: "Specialized in Embedded Systems, IoT, Electronics Design, Circuit Development, and Hardware Prototyping.",
      fullBio: "Specialized in Embedded Systems, IoT, Electronics Design, Circuit Development, and Hardware Prototyping with expertise in real-time embedded technologies and practical hardware systems.",
      stats: { focus: "Prototyping", interface: "WebUSB Logic", firmware: "RTOS C++" }
    },
    {
      name: "Nikhil Khakha",
      role: "Drone Engineer",
      initial: "NK",
      tag: "UAV Systems",
      shortDesc: "Focused on Drone Technology, UAV Systems, Drone Training, and practical implementation of aerial robotics technologies.",
      fullBio: "Focused on Drone Technology, UAV Systems, Drone Training, and practical implementation of aerial robotics technologies.",
      stats: { focus: "Aerodynamics", flightControl: "ArduPilot / PX4", certification: "DGCA Trainer" }
    },
    {
      name: "Saheb Ali",
      role: "Automation Engineer",
      initial: "SA",
      tag: "Industrial Controls",
      shortDesc: "Specialized in Industrial Automation, Control Systems, Smart Technologies, and automation-driven innovation systems.",
      fullBio: "Specialized in Industrial Automation, Control Systems, Smart Technologies, and automation-driven innovation systems.",
      stats: { focus: "PLC Programming", interface: "SCADA systems", standard: "IEC 61131-3" }
    },
    {
      name: "Vivek Ranjan",
      role: "Sr. Graphic Designer",
      initial: "VR",
      tag: "Visual Identity",
      shortDesc: "One of the oldest and most dedicated members. He has played a major role in shaping the visual identity and creative branding.",
      fullBio: "One of the oldest and most dedicated members associated with the organization since the early stages of the journey. He has played a major role in shaping the visual identity, creative branding, digital presence, and professional design ecosystem of PRAYOG INDIA ROBOTICS through innovative and impactful graphic designing.",
      stats: { focus: "Brand Design", visualId: "Illustrator & CAD", experience: "Early Member" }
    }
  ];

  const guestFacultyList = [
    { name: "Aman Raj", role: "Robotics & Automation Engineer", desc: "Guest Faculty and technical mentor specializing in Robotics, Automation Systems, and practical engineering applications." },
    { name: "Anant Verma", role: "Robotics Engineer", desc: "Focused on Robotics System Design, robotics implementation, and innovation-based project development." },
    { name: "Sunny Kumar", role: "Sr. Web Developer", desc: "Responsible for advanced web technologies, platform development, and digital infrastructure supporting modern EdTech ecosystems." },
    { name: "Belal Khan", role: "Sr. Android Developer", desc: "Specialized in Android Application Development, mobile technology solutions, and software-driven innovation systems." }
  ];

  // Carousel slider navigations
  const nextTeamSlide = () => {
    setTeamSlideIndex((prev) => (prev + 1 >= coreTeamList.length ? 0 : prev + 1));
  };

  const prevTeamSlide = () => {
    setTeamSlideIndex((prev) => (prev - 1 < 0 ? coreTeamList.length - 1 : prev - 1));
  };

  // Helper to slice 3 circular items for desktop display
  const getVisibleTeamMembers = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const idx = (teamSlideIndex + i) % coreTeamList.length;
      visible.push({ ...coreTeamList[idx], originalIndex: idx });
    }
    return visible;
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-900 font-body antialiased">
      <Header />

      {/* ========================================================================= */}
      {/* HERO SECTION (DARK NAVY ACCENT TO MATCH ORIGINAL BRAND) */}
      {/* ========================================================================= */}
      <section className="relative pt-40 pb-28 bg-[#01254d] overflow-hidden text-white">
        {/* Futuristic Background Patterns */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-[#FFC107]/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-[#FFC107] animate-pulse" />
                <span className="text-xs font-semibold tracking-wider text-[#FFC107] uppercase">PRAYOG INDIA ROBOTICS PVT. LTD.</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
                Building India’s Future <br />
                Through <span className="text-[#FFC107] relative inline-block">
                  Innovation
                  <span className="absolute bottom-1 left-0 w-full h-[6px] bg-[#FFC107]/20 rounded-full" />
                </span>, Robotics & <br />
                <span className="text-[#FFC107]">Practical Learning</span>
              </h1>
              
              <p className="text-blue-100/80 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
                An emerging EdTech and Innovation-driven technology company dedicated to transforming technical education through practical learning, research, Innovation, and industry-oriented skill development.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="#sandbox" className="px-8 py-4 bg-[#FFC107] text-[#01254d] font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-white hover:scale-105 transition-all duration-300 shadow-lg shadow-[#FFC107]/10 flex items-center gap-2">
                  <span>Interactive PCB Sandbox</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button 
                  onClick={() => setShowIntroVideo(true)}
                  className="px-8 py-4 bg-white/10 text-white border border-white/20 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#FFC107] hover:text-[#01254d] hover:border-transparent transition-all duration-300 flex items-center gap-2 shadow-lg shadow-white/5"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Watch Intro Video</span>
                </button>
              </div>
            </div>

            {/* Right Interactive PCB Sandbox */}
            <div className="lg:col-span-5" id="sandbox">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-[#02162b] border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden"
              >
                {/* PCB Background Lines */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(#FFC107 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                
                {/* Sandbox Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${sandboxState.connected ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Prayog Virtual PCB v2.0</span>
                  </div>
                  <button 
                    onClick={connectBoard}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
                      sandboxState.connected 
                        ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white" 
                        : "bg-[#FFC107] text-[#01254d] hover:bg-white"
                    }`}
                  >
                    {sandboxState.connected ? "Disconnect" : "Connect Board"}
                  </button>
                </div>

                {/* Simulated Board Area */}
                <div className="bg-[#03203f] rounded-2xl p-6 border border-white/5 min-h-[220px] flex flex-col justify-between relative">
                  
                  {/* Microcontroller chip */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-[#092b4f] border-2 border-slate-600 rounded-xl flex flex-col items-center justify-center shadow-lg group">
                    <div className="absolute -top-1.5 w-16 h-1 bg-slate-800" />
                    <div className="absolute -bottom-1.5 w-16 h-1 bg-slate-800" />
                    <div className="absolute -left-1.5 h-16 w-1 bg-slate-800" />
                    <div className="absolute -right-1.5 h-16 w-1 bg-slate-800" />
                    <Cpu className={`w-8 h-8 ${sandboxState.power ? "text-[#FFC107] animate-pulse" : "text-slate-655"} transition-colors duration-500`} />
                    <span className="text-[8px] font-bold text-slate-400 mt-2 uppercase tracking-wider font-mono">PRAYOG CORE</span>
                  </div>

                  {/* Top LED Diodes */}
                  <div className="flex justify-between relative z-10">
                    {[1, 2, 3].map((led) => (
                      <button
                        key={led}
                        onClick={() => triggerLed(led)}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          sandboxState.activeLed === led && sandboxState.power
                            ? "bg-amber-400 border-[#FFC107] shadow-lg shadow-[#FFC107]/50 text-slate-900"
                            : "bg-slate-900/80 border-slate-700 text-slate-400 hover:border-slate-500"
                        }`}
                      >
                        <Zap className="w-3.5 h-3.5" />
                      </button>
                    ))}
                  </div>

                  {/* Bottom Controls and Terminals */}
                  <div className="flex justify-between items-end relative z-10 pt-16">
                    <div className="text-left">
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono">BUS VOLTAGE</div>
                      <div className="text-xl font-bold text-white font-mono mt-0.5">
                        {sandboxState.voltage.toFixed(1)} <span className="text-[#FFC107]">V</span>
                      </div>
                    </div>

                    {/* Power Switch */}
                    <button
                      onClick={togglePower}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        sandboxState.power 
                          ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20" 
                          : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"
                      }`}
                    >
                      <Zap className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Console Log */}
                <div className="mt-4 bg-[#011429] border border-white/5 rounded-xl p-3 font-mono text-[11px] text-slate-400 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping shrink-0" />
                  <span className="truncate">{sandboxState.signals}</span>
                </div>
                
                <p className="text-[10px] text-center text-slate-400 mt-4 italic">
                  Interactive Sandbox: Toggle Connect & Power, then trigger LED outputs to simulate hardware signals!
                </p>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* Video Lightbox Modal for Hero (Intro) */}
      <AnimatePresence>
        {showIntroVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#01254d]/90 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-10"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#02162b] border border-white/10 rounded-3xl max-w-5xl w-full relative overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Tv className="w-5 h-5 text-[#FFC107]" />
                  <span className="text-xs font-bold text-slate-350 uppercase tracking-widest">Corporate Video Spotlight</span>
                </div>
                <button
                  onClick={() => setShowIntroVideo(false)}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Widescreen Chassis */}
              <div className="aspect-video w-full bg-black">
                <iframe 
                  className="w-full h-full" 
                  src="https://www.youtube.com/embed/kRaxlc2Fblk?autoplay=1" 
                  title="Prayog India Corporate Intro Video" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin" 
                  allowFullScreen
                />
              </div>

              {/* Modal Footer Info */}
              <div className="p-6 bg-[#011429] flex items-center justify-between text-xs font-semibold text-slate-400 font-mono">
                <span>PRAYOG INDIA ROBOTICS PVT. LTD.</span>
                <span className="text-[#FFC107] uppercase">STATUS: STREAMING ACTIVE</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* METRICS BANNER */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-r from-[#011830] to-[#01254d] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "10,000+", label: "Students Trained", icon: GraduationCap, text: "Empowered with hands-on skillsets" },
              { value: "100+", label: "Schools & Colleges Served", icon: Building2, text: "Enriched academic structures" },
              { value: "50+", label: "Workshops Conducted", icon: Cpu, text: "Intensive deep-tech programs" },
              { value: "10+", label: "Years of Experience", icon: Award, text: "Leading technical pedagogy since 2015" }
            ].map((metric, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FFC107]/10 flex items-center justify-center text-[#FFC107] mb-3">
                  <metric.icon className="w-5 h-5" />
                </div>
                <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">{metric.value}</h3>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFC107] mt-1">{metric.label}</h4>
                <p className="text-[10px] text-blue-100/60 mt-1 font-medium">{metric.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* CORPORATE VIDEO SPOTLIGHT (YOUTUBE VIDEOS) */}
      {/* ========================================================================= */}
      <section className="py-24 bg-white relative overflow-hidden" id="video-spotlight">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#01254d_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#FFC107]/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#01254d]/5 border border-[#01254d]/10">
                <Tv className="w-4 h-4 text-[#01254d]" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#01254d]">Ecosystem Spotlight</span>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-extrabold text-[#01254d] tracking-tight leading-[1.15]">
                Innovation in <br />
                <span className="text-[#FFC107] relative inline-block">
                  Active Motion
                  <span className="absolute bottom-1 left-0 w-full h-[5px] bg-[#FFC107]/20 rounded-full" />
                </span>
              </h2>
              
              <div className="space-y-4 text-slate-600 text-sm md:text-base leading-relaxed font-semibold italic">
                <p>
                  Watch our featured showcase to discover how PRAYOG INDIA ROBOTICS is transforming standard engineering education, lab infrastructures, and STEM pathways.
                </p>
                <p>
                  From building autonomous mechanical rigs to coding deep-tech firmware interfaces, see our hands-on curriculum in action across dynamic schools, colleges, and national workshops.
                </p>
              </div>
            </div>

            {/* Right Video Showcase Screen Column */}
            <div className="lg:col-span-7">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-[#02162b] border border-[#FFC107]/20 rounded-3xl p-4 shadow-2xl relative overflow-hidden group"
              >
                {/* Widescreen Video Player Container */}
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-inner border border-white/5">
                  <iframe 
                    className="absolute inset-0 w-full h-full rounded-2xl" 
                    src="https://www.youtube.com/embed/kRaxlc2Fblk" 
                    title="Prayog India Corporate Spotlight Video" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerPolicy="strict-origin-when-cross-origin" 
                    allowFullScreen
                  />
                </div>
                
                {/* Surrounding High-Tech Decals */}
                <div className="mt-3 flex justify-between items-center text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#FFC107] animate-ping" />
                    <span>SEC: ACTIVE SHOWCASE</span>
                  </div>
                  <span>1080P WIDESCREEN TELEMETRY</span>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* HIGHLY INTERACTIVE LIGHT-THEMED CHRONICLES & ECOSYSTEM CONTROLS */}
      {/* ========================================================================= */}
      <section className="bg-white text-slate-900 relative py-24 border-t border-slate-100 overflow-hidden">
        
        {/* Glowing glass background shapes */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#01254d_1px,transparent_1px),linear-gradient(to_bottom,#01254d_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />
        <div className="absolute top-[8%] left-[2%] w-[450px] h-[450px] bg-blue-100/30 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[15%] right-[2%] w-[400px] h-[400px] bg-[#FFC107]/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 space-y-32 relative z-10">

          {/* 1. ABOUT US + INTERACTIVE MILESTONES DASHBOARD */}
          <div className="space-y-12">
            
            {/* Header Area */}
            <div className="grid lg:grid-cols-12 gap-8 items-end">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#01254d]/5 border border-[#01254d]/10">
                  <Sparkles className="w-4 h-4 text-[#01254d] animate-pulse" />
                  <span className="text-[9.5px] font-mono tracking-widest text-[#01254d] uppercase font-black">DOCUMENT: ARCHIVE_ABOUT</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tight text-[#01254d] uppercase leading-none">
                  ABOUT US
                </h2>
                <h3 className="text-xl font-bold text-blue-700 leading-snug">
                  Building India’s Future Through Innovation, Robotics & Practical Learning
                </h3>
              </div>
              
              <div className="lg:col-span-5">
                <p className="text-slate-650 text-sm leading-relaxed font-semibold italic border-l-4 border-[#FFC107] pl-4">
                  PRAYOG INDIA ROBOTICS PVT. LTD. is an emerging EdTech and Innovation-driven technology company dedicated to transforming technical education through practical learning, research, Innovation, and industry-oriented skill development.
                </p>
              </div>
            </div>

            {/* Interactive Timeline Core console */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8 shadow-md">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
                <div className="flex items-center gap-2 font-mono text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                  <Terminal className="w-3.5 h-3.5 text-blue-600" />
                  <span>Interactive Chronology Log</span>
                </div>
                <span className="text-[8px] font-mono bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100 font-black">
                  SELECT STEP
                </span>
              </div>

              {/* Selector Track */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {historyMilestones.map((node, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveHistoryStep(index)}
                    className={`p-4 rounded-2xl text-left border transition-all duration-300 relative overflow-hidden group cursor-pointer ${
                      activeHistoryStep === index
                        ? "bg-white border-blue-500 shadow-sm"
                        : "bg-slate-100/50 border-slate-200 hover:border-slate-350 hover:bg-white"
                    }`}
                  >
                    <span className="text-[9px] font-mono font-black text-blue-700 block tracking-widest uppercase">
                      {node.tag}
                    </span>
                    <span className="text-lg font-black text-slate-800 block mt-1">
                      {node.year}
                    </span>
                    {activeHistoryStep === index && (
                      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600" />
                    )}
                  </button>
                ))}
              </div>

              {/* Animated Content Panel */}
              <div className="bg-white border border-slate-150 rounded-2xl p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeHistoryStep}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="grid lg:grid-cols-12 gap-8"
                  >
                    {/* Diagnostic readouts / left */}
                    <div className="lg:col-span-8 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center">
                          {(() => {
                            const IconComponent = historyMilestones[activeHistoryStep].icon;
                            return <IconComponent className="w-5 h-5" />;
                          })()}
                        </div>
                        <h4 className="text-lg font-black uppercase tracking-wide text-slate-900">
                          {historyMilestones[activeHistoryStep].title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-655 leading-relaxed font-semibold italic whitespace-pre-line">
                        {historyMilestones[activeHistoryStep].desc}
                      </p>
                    </div>

                    {/* Telemetry data / right */}
                    <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 flex flex-col justify-center">
                      <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest font-black block border-b border-slate-200 pb-1.5">// STAGE TELEMETRY</span>
                      {Object.entries(historyMilestones[activeHistoryStep].stats).map(([label, val]) => (
                        <div key={label} className="flex justify-between items-center text-[10px] font-mono">
                          <span className="text-slate-455 font-bold uppercase">{label}</span>
                          <span className="text-slate-800 font-black">{val}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </div>

          {/* 2. MISSION & VISION DYNAMIC DECK */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 hover:bg-slate-100/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[300px] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-all duration-500" />
              
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black uppercase text-[#01254d] tracking-wider">OUR MISSION</h3>
                <p className="text-sm text-slate-650 leading-relaxed font-semibold italic">
                  To revolutionize technical education in India through practical learning, innovation, affordability, and future-ready skill development in Robotics, AI, IoT, Embedded Systems, Drone Technology, Automation, and STEM Education.
                </p>
              </div>

              <div className="pt-6 border-t border-slate-200/60 mt-6 flex justify-between items-center text-[10px] font-mono text-slate-405 font-bold uppercase tracking-wider">
                <span>IMPACT FOCUS</span>
                <span className="text-blue-700 font-black">NATIONWIDE ACCESSIBILITY</span>
              </div>
            </div>

            {/* Vision */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 hover:bg-slate-100/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[300px] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-all duration-500" />

              <div className="space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 text-amber-700 flex items-center justify-center">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black uppercase text-[#01254d] tracking-wider">OUR VISION</h3>
                <p className="text-sm text-slate-650 leading-relaxed font-semibold italic">
                  To become one of India’s leading EdTech and Innovation Platforms where students, innovators, startups, and institutions can access practical technology education and transform ideas into impactful innovations.
                </p>
              </div>

              <div className="pt-6 border-t border-slate-200/60 mt-6 flex justify-between items-center text-[10px] font-mono text-slate-405 font-bold uppercase tracking-wider">
                <span>HORIZON TARGET</span>
                <span className="text-amber-700 font-black">GLOBAL ECOSYSTEM</span>
              </div>
            </div>
          </div>

          {/* 3. WHAT WE DO? & WHO WE SERVE INTERACTIVE CONSOLE */}
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100">
                <Activity className="w-4 h-4 text-blue-700" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-700">Capabilities Config</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-[#01254d] tracking-tight uppercase">
                WHAT WE DO & WHO WE SERVE
              </h2>
              <p className="text-slate-505 text-xs md:text-sm font-semibold max-w-xl mx-auto italic">
                Toggle below to explore our industrial training programs or see the demographics we empower.
              </p>
            </div>

            {/* Config Switcher tabs */}
            <div className="flex justify-center">
              <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-full max-w-md">
                <button
                  onClick={() => setActiveTab("what-we-do")}
                  className={`flex-1 py-3 text-[10px] font-mono font-black uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer ${
                    activeTab === "what-we-do"
                      ? "bg-[#01254d] text-white shadow-md"
                      : "text-slate-500 hover:text-slate-850"
                  }`}
                >
                  WHAT WE DO
                </button>
                <button
                  onClick={() => setActiveTab("who-we-serve")}
                  className={`flex-1 py-3 text-[10px] font-mono font-black uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer ${
                    activeTab === "who-we-serve"
                      ? "bg-blue-650 text-white shadow-md"
                      : "text-slate-500 hover:text-slate-850"
                  }`}
                >
                  WHO WE SERVE
                </button>
              </div>
            </div>

            {/* Dynamic Grid Layout */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8">
              <AnimatePresence mode="wait">
                {activeTab === "what-we-do" ? (
                  <motion.div
                    key="what-we-do-services"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="grid sm:grid-cols-2 gap-4"
                  >
                    {whatWeDoList.map((item, idx) => (
                      <div 
                        key={idx} 
                        className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md rounded-2xl p-5 flex items-start gap-4 transition-all duration-300 group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-750 flex items-center justify-center shrink-0 group-hover:bg-[#01254d] group-hover:text-white transition-all duration-300">
                          {(() => {
                            const IconComponent = item.icon;
                            return <IconComponent className="w-5 h-5" />;
                          })()}
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-black uppercase text-[#01254d] tracking-wider leading-snug">
                            {item.title}
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed font-semibold italic">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="who-we-serve-demographics"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {whoWeServeList.map((item, idx) => (
                      <div 
                        key={idx} 
                        className="bg-white border border-slate-200 hover:border-amber-400 hover:shadow-md rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between gap-4 group"
                      >
                        <div className="space-y-2">
                          <span className="text-[8px] font-mono text-slate-400 tracking-widest font-black uppercase block">TARGET LAYER // 0{idx + 1}</span>
                          <h4 className="text-sm font-black text-[#01254d] uppercase tracking-wider group-hover:text-blue-700 transition-colors">
                            {item.target}
                          </h4>
                          <p className="text-xs text-slate-600 leading-relaxed font-semibold italic">
                            {item.desc}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-[8px] font-mono font-bold tracking-wider text-blue-700 pt-2 border-t border-slate-100">
                          <span>ROBOTICS MODULE READY</span>
                          <ChevronRight className="w-2.5 h-2.5" />
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* 4. WHY PRAYOG INDIA ROBOTICS? INTERACTIVE HUD */}
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-100">
                <Zap className="w-4 h-4 text-amber-700" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700">Engineering Philosophy</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-[#01254d] tracking-tight uppercase">
                WHY PRAYOG INDIA ROBOTICS?
              </h2>
              <p className="text-slate-500 text-xs md:text-sm font-semibold max-w-xl mx-auto italic">
                Click on any engineering pillar below to expand the active pedagogical details.
              </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-stretch">
              {/* Left Pillars List */}
              <div className="lg:col-span-5 flex flex-col gap-3">
                {whyPrayogList.map((pillar, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveWhyPillar(idx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center gap-3 cursor-pointer ${
                      activeWhyPillar === idx
                        ? "bg-white border-blue-500 shadow-sm"
                        : "bg-slate-55 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-mono font-bold text-[10px] shrink-0">
                      0{idx + 1}
                    </span>
                    <span className="text-xs font-black uppercase text-slate-800 tracking-wider truncate">
                      {pillar.title}
                    </span>
                  </button>
                ))}
              </div>

              {/* Right Detail HUD Panel */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between shadow-md">
                <div className="absolute top-0 right-0 p-4 font-mono text-[8px] text-slate-400 font-bold uppercase tracking-wider">
                  HUD SYSTEM // ACTIVE_PILLAR_0{activeWhyPillar + 1}
                </div>

                <div className="space-y-4">
                  <span className="text-[8px] font-mono text-blue-600 tracking-widest font-black uppercase block mb-1">
                    // PRAYOG STANDARD PEDAGOGY
                  </span>
                  <h3 className="text-xl font-black text-[#01254d] uppercase tracking-wider">
                    {whyPrayogList[activeWhyPillar].title}
                  </h3>
                  <p className="text-sm text-slate-655 leading-relaxed font-semibold italic border-l-2 border-blue-600 pl-4">
                    "{whyPrayogList[activeWhyPillar].desc}"
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest block font-bold mb-2">SYSTEM PROTOCOL DETAIL</span>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {whyPrayogList[activeWhyPillar].detail}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 text-center max-w-3xl mx-auto shadow-sm">
              <p className="text-base md:text-lg font-bold italic leading-relaxed text-slate-800">
                "We believe students learn best when they create, experiment, innovate, and build technologies with their own hands."
              </p>
            </div>
          </div>

          {/* 5. OUR CONTRIBUTION TO THE NATION */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 lg:p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-orange-500 via-slate-200 to-emerald-500" />
            <div className="absolute top-4 right-4 p-2 font-mono text-[8px] text-slate-400 uppercase tracking-widest font-black flex items-center gap-1.5">
              <span>Telemetry: Sovereign Node</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span className="text-[9px] font-mono tracking-widest text-emerald-700 uppercase font-black">NATION BUILDING</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-wider">
                  OUR CONTRIBUTION TO THE NATION
                </h3>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed font-semibold italic">
                  One of the proudest milestones in our journey has been contributing our technical expertise and innovation capabilities toward. We have also contributed technical expertise toward projects aligned with national innovation and defence-oriented initiatives, which remains a matter of pride for our team. This opportunity represents not only a professional achievement but also a matter of immense pride and national contribution for our entire team.
                </p>
                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                  At PRAYOG INDIA ROBOTICS, we believe technology and innovation should contribute toward nation-building, self-reliance, research, and the development of future-ready technological ecosystems for India.
                </p>
              </div>

              <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 text-center space-y-4 shadow-sm flex flex-col justify-between min-h-[220px]">
                <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-700 border border-orange-100 flex items-center justify-center mx-auto">
                  <Flame className="w-5.5 h-5.5" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-800">ATMANIRBHAR BHARAT</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed font-semibold italic">
                  Fostering self-reliance and research to build futuristic cyber-physical systems domestically.
                </p>
                <div className="pt-2 border-t border-slate-100 flex justify-center gap-4 text-[8px] font-mono font-bold tracking-widest text-slate-400">
                  <span className="text-orange-655">INVENT</span>
                  <span>•</span>
                  <span className="text-slate-700">SECURE</span>
                  <span>•</span>
                  <span className="text-emerald-600">DEVELOP</span>
                </div>
              </div>
            </div>
          </div>

          {/* 6. MEET THE TEAM (CAROUSEL SLIDER VIEW + MORE INFO PORTAL MODAL) */}
          <div className="space-y-12 relative" id="core-team">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100">
                <UserCheck className="w-4 h-4 text-blue-700" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-700">Prayog Roster</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-[#01254d] tracking-tight uppercase">
                MEET OUR CORE TEAM
              </h2>
              <p className="text-slate-500 text-xs md:text-sm font-semibold max-w-xl mx-auto italic">
                Slide through the key members driving our innovation ecosystem. Click "More Info" to open their detailed profile sheet.
              </p>
            </div>

            {/* Slider viewport */}
            <div className="relative px-2">
              
              {/* Carousel controls */}
              <div className="absolute top-1/2 -left-4 -translate-y-1/2 z-20">
                <button
                  onClick={prevTeamSlide}
                  className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center hover:bg-slate-50 hover:border-slate-350 active:scale-95 transition-all text-[#01254d] cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              </div>

              <div className="absolute top-1/2 -right-4 -translate-y-1/2 z-20">
                <button
                  onClick={nextTeamSlide}
                  className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center hover:bg-slate-50 hover:border-slate-350 active:scale-95 transition-all text-[#01254d] cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Slider Track Chassis */}
              <div className="overflow-hidden py-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {getVisibleTeamMembers().map((member, index) => (
                    <motion.div
                      key={`${member.name}-${index}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white border border-slate-200 hover:border-blue-400 hover:shadow-lg rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between min-h-[290px] relative overflow-hidden group"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-250 text-blue-700 flex items-center justify-center font-mono font-black text-sm group-hover:bg-[#01254d] group-hover:text-white transition-all">
                            {member.initial}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-[#01254d] text-sm tracking-wide leading-snug">{member.name}</h4>
                            <span className="text-[9px] font-mono text-amber-600 uppercase tracking-widest block font-bold">{member.role}</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 font-semibold italic leading-relaxed line-clamp-3">
                          {member.shortDesc}
                        </p>
                      </div>

                      <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-4">
                        <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest block font-bold">SPEC: {member.tag}</span>
                        <button
                          onClick={() => setSelectedMember(member)}
                          className="px-3.5 py-2 bg-slate-50 hover:bg-[#01254d] hover:text-white rounded-xl text-[10px] font-mono font-black uppercase tracking-widest text-[#01254d] border border-slate-200 hover:border-transparent transition-all duration-200 cursor-pointer"
                        >
                          More Info
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Slider dots indicators */}
              <div className="flex justify-center gap-2 mt-4">
                {coreTeamList.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setTeamSlideIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      teamSlideIndex === idx ? "bg-[#01254d] w-6" : "bg-slate-300 hover:bg-slate-400"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* INTEGRATED POP-UP MODAL (LIGHTBOX WITH CROSS OPTION) */}
            <AnimatePresence>
              {selectedMember && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-[#01254d]/60 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6"
                >
                  <motion.div
                    initial={{ scale: 0.95, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 20 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative"
                  >
                    {/* Header Spec Tag */}
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 to-[#FFC107]" />

                    {/* Cross close button in top right */}
                    <button
                      onClick={() => setSelectedMember(null)}
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors shadow-sm cursor-pointer z-10"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    {/* Modal main chassis content */}
                    <div className="p-6 md:p-8 space-y-6">
                      
                      {/* Initials & Identity */}
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 text-[#01254d] flex items-center justify-center font-mono font-black text-xl">
                          {selectedMember.initial}
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono text-blue-600 tracking-widest font-black uppercase block">// PERSONNEL Spec Sheet</span>
                          <h3 className="text-xl md:text-2xl font-black text-[#01254d] uppercase tracking-wide">
                            {selectedMember.name}
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-100 text-[10px] font-mono font-black uppercase text-amber-700 tracking-wider inline-block">
                            {selectedMember.role}
                          </span>
                        </div>
                      </div>

                      {/* Bio Body */}
                      <div className="border-t border-slate-100 pt-5 space-y-3">
                        <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest block font-bold">PROFESSIONAL BIOGRAPHY</span>
                        <p className="text-xs text-slate-655 leading-relaxed font-semibold italic whitespace-pre-line">
                          {selectedMember.fullBio}
                        </p>
                      </div>

                      {/* Hardware Stats Grid */}
                      <div className="border-t border-slate-100 pt-5 space-y-3">
                        <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest block font-bold">FOCUS TELEMETRY METRICS</span>
                        <div className="grid grid-cols-3 gap-3">
                          {Object.entries(selectedMember.stats).map(([label, val]) => (
                            <div key={label} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                              <span className="text-[8px] font-mono text-slate-450 uppercase tracking-widest block">{label}</span>
                              <span className="text-[10px] font-black text-slate-800 block mt-1 tracking-wide">{val}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Footer Info */}
                    <div className="p-4 bg-slate-50 border-t border-slate-150 flex items-center justify-between text-[9px] font-mono text-slate-405 font-bold uppercase tracking-wider">
                      <span>PRAYOG INDIA CORE ROSTER</span>
                      <span className="text-blue-700">VERIFIED STATE</span>
                    </div>

                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Guest Faculty Grid */}
            <div className="pt-10 space-y-6">
              <h3 className="text-lg font-black uppercase tracking-wider text-[#01254d] font-mono border-b border-slate-150 pb-3 flex items-center gap-2">
                <span>// Guest Faculty & Technical Experts Network</span>
              </h3>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {guestFacultyList.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-205 rounded-2xl p-6 hover:border-[#FFC107]/40 transition-colors shadow-sm">
                    <h4 className="font-extrabold text-[#01254d] text-sm mb-0.5">{item.name}</h4>
                    <span className="text-[9px] font-mono text-blue-600 uppercase tracking-widest block mb-3 font-bold">{item.role}</span>
                    <p className="text-xs text-slate-600 font-semibold italic leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* 7. CTA: BUILDING THE FUTURE THROUGH INNOVATION */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-105 rounded-3xl p-8 md:p-12 text-center space-y-8 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FFC107]/5 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 mx-auto">
              <Heart className="w-6 h-6 animate-pulse" />
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-[#01254d] tracking-tight uppercase">
              BUILDING THE FUTURE THROUGH INNOVATION
            </h2>

            <p className="text-slate-655 text-sm md:text-base leading-relaxed max-w-3xl mx-auto font-semibold italic">
              At PRAYOG INDIA ROBOTICS, we are not just teaching technologies — we are building an ecosystem where ideas become innovations, learning becomes practical, and students become future technology leaders.
            </p>

            <p className="text-slate-500 text-xs md:text-sm max-w-2xl mx-auto font-medium leading-relaxed">
              Whether you are a school student exploring Robotics for the first time, an engineering student seeking industry-ready skills, a startup developing innovative solutions, or an institution planning future-ready STEM Labs — we are here to support your innovation journey.
            </p>

            <h3 className="text-xs font-mono font-bold text-blue-750 uppercase tracking-widest max-w-xl mx-auto leading-relaxed pt-2">
              We invite students, institutions, innovators, and organizations to collaborate with us in shaping the future of technology education in India.
            </h3>

            <div className="flex justify-center pt-4">
              <Link href="/contact" className="px-10 py-5 bg-[#01254d] text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-[#FFC107] hover:text-[#01254d] hover:scale-105 transition-all duration-300 shadow-xl shadow-blue-900/10 flex items-center gap-3">
                <span>Collaborate With Us</span>
                <ArrowRight className="w-4.5 h-4.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
