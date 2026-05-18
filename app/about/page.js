"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Target, 
  Users, 
  History, 
  Award, 
  ShieldCheck, 
  Globe,
  ArrowRight,
  Sparkles,
  Quote,
  Cpu,
  Building2,
  GraduationCap,
  Microscope,
  Server,
  Zap,
  Briefcase,
  Compass,
  Layers,
  Wrench,
  Atom,
  Flag,
  ChevronRight,
  ChevronLeft,
  Heart,
  Terminal,
  Activity,
  CheckCircle2,
  Play,
  X,
  Tv
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("what-we-do");
  const [activeTimeline, setActiveTimeline] = useState(0);
  const [strategicPanel, setStrategicPanel] = useState("mission");
  const [hoveredMissionPillar, setHoveredMissionPillar] = useState(null);
  const [hoveredVisionMilestone, setHoveredVisionMilestone] = useState(null);
  
  // Lightbox Modal for Intro Video
  const [showIntroVideo, setShowIntroVideo] = useState(false);

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

  const timelineConsoleData = [
    {
      year: "2015",
      chapter: "01",
      title: "The Genesis of PRAYOGTECH",
      subtitle: "Founding during Engineering Days",
      desc: "Our journey began in 2015, when Enamul Hassan founded PRAYOGTECH while pursuing his Engineering degree. He was driven by a bold vision to make advanced technologies affordable, accessible, and highly practical for students, innovators, and technology enthusiasts across India.",
      achievements: [
        "Founded by Enamul Hassan during engineering",
        "Launched first line of DIY Science & Robotics Kits",
        "Democratized access to key drone and robot spare parts",
        "Established local tech enablement hubs"
      ]
    },
    {
      year: "2016 - 2024",
      chapter: "02",
      title: "Growth & Ecosystem Expansion",
      subtitle: "Multidisciplinary Technology Integration",
      desc: "Over these years, the organization significantly expanded its reach and training capabilities. We transitioned from a physical hardware component provider into a mission-driven training, mentoring, and research-focused innovation ecosystem across multiple engineering nodes.",
      achievements: [
        "Expanded into advanced IoT, Embedded & Drone flight systems",
        "Designed comprehensive deep-tech STEM curriculums",
        "Conducted intensive physical bootcamps across India",
        "Pioneered practical hardware-first diagnostics learning"
      ]
    },
    {
      year: "2025",
      title: "Corporate Transformation",
      chapter: "03",
      subtitle: "PRAYOG INDIA ROBOTICS PVT. LTD.",
      desc: "To scale our impact and formalize advanced learning standards across schools and colleges, we transformed and incorporated into PRAYOG INDIA ROBOTICS PVT. LTD. This created a solid foundation for large-scale laboratory installations.",
      achievements: [
        "Incorporated as PRAYOG INDIA ROBOTICS PVT. LTD.",
        "Deployed turnkey STEM and Robotics lab infrastructures",
        "Achieved standardized ISO curriculum integration",
        "Advanced high-precision indigenous hardware prototyping"
      ]
    },
    {
      year: "Present",
      chapter: "04",
      title: "Bridging the Gap Today",
      subtitle: "Empowering National Self-Reliance",
      desc: "Today, we operate actively as a premier nationwide EdTech and Innovation enterprise, empowering students to move from dry theoretical learning to active physical creation and research-driven innovation.",
      achievements: [
        "Launched fee-based industrial research internships",
        "Installed academic laboratories in prominent institutions",
        "Aligned active development with national defense plans",
        "Maintained 100% indigenous prototyping focus"
      ]
    }
  ];

  const handleNextTimeline = () => {
    setActiveTimeline((prev) => (prev + 1) % timelineConsoleData.length);
  };

  const handlePrevTimeline = () => {
    setActiveTimeline((prev) => (prev - 1 + timelineConsoleData.length) % timelineConsoleData.length);
  };

  const whatWeDoList = [
    { icon: Cpu, title: "Robotics Training", desc: "Hands-on design, construction, and programming of smart autonomous systems." },
    { icon: Atom, title: "Embedded Systems & IoT Training", desc: "Microcontroller interfacing, sensor fusion, and real-time cloud data telemetry." },
    { icon: Compass, title: "Drone Technology Training", desc: "Aero-kinematics, flight controller setup, UAV piloting, and structural assembly." },
    { icon: Sparkles, title: "Artificial Intelligence & STEM Education", desc: "Machine learning basics, neural networks, and integrated science-technology projects." },
    { icon: Layers, title: "3D Designing & 3D Printing Learning", desc: "CAD modeling, slicing optimization, and physical additive manufacturing." },
    { icon: Server, title: "Automation & Innovation-Based Projects", desc: "Industrial control systems, PLC automation, and customizable smart prototypes." },
    { icon: Briefcase, title: "Fee-Based Internship Programs", desc: "Structured knowledge-sharing internships with intensive real-world project portfolios." },
    { icon: Building2, title: "School & College STEM Labs", desc: "Turnkey setups for state-of-the-art Robotics and Innovation Labs in institutions." },
    { icon: GraduationCap, title: "Industry-Oriented Workshops", desc: "Immersive technical bootcamps designed for hands-on exposure in schools & colleges." },
    { icon: Wrench, title: "Practical Hardware-Based Learning", desc: "Real-time components engineering and experimental hardware diagnostic platforms." }
  ];

  const whoWeServeList = [
    { target: "School Students", desc: "Cultivating young minds with foundational logical thinking, basic mechanics, and visual programming." },
    { target: "Diploma & Engineering Students", desc: "Providing advanced, industry-ready skillsets that align with dynamic global recruitment needs." },
    { target: "BCA / MCA / IT Students", desc: "Fusing software coding capability with physical automation, embedded hardware, and smart IoT tools." },
    { target: "Schools, Colleges & Universities", desc: "Developing complete, future-proof laboratories, dynamic curricula, and technical training setups." },
    { target: "Startups & Innovators", desc: "Offering rapid prototyping, customized components design, and critical technical mentoring." },
    { target: "Hobbyists & Tech Enthusiasts", desc: "Supporting self-guided learners with real hardware components, project guides, and spare parts." }
  ];

  const whyChooseUs = [
    { title: "Practical Hands-On Learning", desc: "We move students away from dry theory and place real, physical hardware directly into their hands." },
    { title: "Real Hardware & Real-Time Projects", desc: "Every module involves building physical circuits, flashing firmware, and deploying active automation setups." },
    { title: "Industry-Oriented Skill Development", desc: "Our curriculum is engineered around current and upcoming demands of global deep-tech employers." },
    { title: "Innovation & Research-Based Education", desc: "We empower students to ask 'Why?' and conduct research to innovate and construct original solutions." },
    { title: "Affordable Technical Learning", desc: "Democratizing complex engineering concepts, making advanced kits and tools budget-accessible." },
    { title: "Beginner-to-Advanced Approach", desc: "Our structured pedagogy builds deep expertise smoothly, welcoming absolute beginners through master builders." },
    { title: "Future Technology Exposure", desc: "Direct training with premium emerging disciplines like Drone engineering, IoT networks, and smart robotics." }
  ];

  const missionPillars = [
    {
      id: "pedagogy",
      title: "Practical Revolution",
      subtitle: "Hands-on Mastery Over Rote Memory",
      desc: "Replacing standard textbook-memorization curricula with absolute physical prototyping. Students build, wire, program, and run actual autonomous units.",
      impact: "100% Core Hardware Interaction",
      status: "Active Deployment"
    },
    {
      id: "democratization",
      title: "Affordability & Access",
      subtitle: "Bringing Elite Tech to Everyone",
      desc: "Democratizing complex engineering disciplines by designing and manufacturing highly affordable, accessible science kits and drone/robotics spare parts for all Indian learners.",
      impact: "90% Reduction in Learning Kit Costs",
      status: "Scaling Nationwide"
    },
    {
      id: "future-readiness",
      title: "Future-Ready Disciplines",
      subtitle: "Aligning Academic Paths with Industry Requirements",
      desc: "Integrating premium fields like Robotics, AI, IoT, Embedded Systems, Drone Technology, Automation, and STEM into structural school and college ecosystems.",
      impact: "Direct Alignment with Global Deep-Tech Jobs",
      status: "ISO 9001 Standardized"
    }
  ];

  const visionMilestones = [
    {
      id: "innovation-cradle",
      title: "Idea-to-Prototype Sandbox",
      subtitle: "Unlocking Innovator Capabilities",
      desc: "Acting as one of India's leading innovation hubs where students, startups, and hobbyists can easily prototype, test, and transform speculative concepts into robust physical projects.",
      target: "10,000+ Hardware Projects Sparked",
      timeline: "Continuous Growth"
    },
    {
      id: "unified-ecosystem",
      title: "Turnkey STEM Laboratory Network",
      subtitle: "Institutional Infrastructure Standardization",
      desc: "Deploying state-of-the-art, fully standardized Robotics and STEM labs inside thousands of schools, colleges, and technical universities across India.",
      target: "500+ Active Labs Installed",
      timeline: "Target 2028"
    },
    {
      id: "self-reliance",
      title: "Atmanirbhar Tech Foundation",
      subtitle: "Nation-Building Through Applied Skills",
      desc: "Nurturing homegrown technical expertise, research capabilities, and hardware-focused self-reliance to feed directly into India's national development and defense systems.",
      target: "100% Indigenous Prototyping",
      timeline: "National Goal Alignment"
    }
  ];

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-900 font-body antialiased">
      <Header />

      {/* Hero Section */}
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
                    <Cpu className={`w-8 h-8 ${sandboxState.power ? "text-[#FFC107] animate-pulse" : "text-slate-600"} transition-colors duration-500`} />
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

      {/* Metrics Banner */}
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

      {/* Dedicated Section: Corporate Video Spotlight (Showcasing YouTube Video) */}
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

              <div className="pt-4">
                <Link href="#timeline" className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#01254d] hover:bg-[#FFC107] text-white hover:text-[#01254d] font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300">
                  <span>Explore Our History</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
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

      {/* Interactive Strategic Control Center (Mission & Vision) */}
      <section className="py-24 bg-[#F8FAFC] relative overflow-hidden">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#01254d_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#01254d]/5 border border-[#01254d]/10">
              <Target className="w-4 h-4 text-[#01254d]" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#01254d]">Strategic Engine</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#01254d] tracking-tight">Our Core Blueprint</h2>
            <p className="text-slate-500 font-medium italic">
              Designed to revolutionize technical education, cultivate innovators, and build a self-reliant technological ecosystem for India.
            </p>
          </div>

          {/* Interactive Console Selector */}
          <div className="flex justify-center mb-12 max-w-sm mx-auto bg-slate-200/50 p-1.5 rounded-2xl">
            <button
              onClick={() => setStrategicPanel("mission")}
              className={`flex-1 py-3.5 px-6 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                strategicPanel === "mission"
                  ? "bg-[#01254d] text-white shadow-lg shadow-[#01254d]/10"
                  : "text-slate-500 hover:text-[#01254d]"
              }`}
            >
              Our Mission
            </button>
            <button
              onClick={() => setStrategicPanel("vision")}
              className={`flex-1 py-3.5 px-6 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                strategicPanel === "vision"
                  ? "bg-[#FFC107] text-[#01254d] shadow-lg shadow-[#FFC107]/10"
                  : "text-slate-500 hover:text-[#01254d]"
              }`}
            >
              Our Vision
            </button>
          </div>

          {/* Main Strategic Console Panel */}
          <AnimatePresence mode="wait">
            {strategicPanel === "mission" ? (
              <motion.div
                key="mission-engine"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid lg:grid-cols-12 gap-8 items-stretch"
              >
                {/* Left Side: Mission Statement & Active Radar Core */}
                <div className="lg:col-span-5 bg-[#01254d] text-white rounded-3xl p-8 md:p-10 flex flex-col justify-between border border-white/5 relative overflow-hidden shadow-2xl min-h-[350px]">
                  {/* Glowing Radar Background */}
                  <div className="absolute -top-10 -left-10 w-44 h-44 bg-[#FFC107]/10 rounded-full blur-[80px] pointer-events-none animate-pulse" />
                  
                  {/* Radar Circles Visual */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-white/5 flex items-center justify-center pointer-events-none">
                    <div className="w-52 h-52 rounded-full border border-white/5 flex items-center justify-center animate-spin-slow">
                      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#FFC107]/30 to-transparent" />
                    </div>
                  </div>

                  <div className="relative z-10 space-y-6">
                    <div className="w-14 h-14 rounded-2xl bg-[#FFC107]/10 text-[#FFC107] flex items-center justify-center border border-[#FFC107]/20">
                      <Target className="w-7 h-7" strokeWidth={1.5} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black tracking-widest text-[#FFC107] uppercase">The Primary Mission</span>
                      <h3 className="text-2xl md:text-3xl font-extrabold uppercase mt-1">Revolutionizing Pedagogy</h3>
                    </div>
                    <p className="text-blue-100/80 text-sm md:text-base leading-relaxed font-semibold italic">
                      "To revolutionize technical education in India through practical learning, innovation, affordability, and future-ready skill development in Robotics, AI, IoT, Embedded Systems, Drone Technology, Automation, and STEM Education."
                    </p>
                  </div>

                  {/* Active Pillar Readout */}
                  <div className="relative z-10 pt-8 border-t border-white/10 mt-8 flex justify-between items-center text-xs font-bold uppercase tracking-wider text-blue-100/60 font-mono">
                    <span>Active Sub-system</span>
                    <span className="text-[#FFC107] font-black uppercase">
                      {hoveredMissionPillar ? hoveredMissionPillar.toUpperCase() : "STANDBY CORE"}
                    </span>
                  </div>
                </div>

                {/* Right Side: Clickable Pillars List */}
                <div className="lg:col-span-7 flex flex-col justify-between gap-6">
                  {missionPillars.map((pillar) => (
                    <motion.div
                      key={pillar.id}
                      onMouseEnter={() => setHoveredMissionPillar(pillar.id)}
                      onMouseLeave={() => setHoveredMissionPillar(null)}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className={`bg-white rounded-3xl p-6 border transition-all duration-300 cursor-pointer shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                        hoveredMissionPillar === pillar.id
                          ? "border-[#01254d]/40 shadow-xl shadow-[#01254d]/5 bg-gradient-to-r from-slate-50 to-white"
                          : "border-slate-150 hover:border-slate-200"
                      }`}
                    >
                      <div className="space-y-2 max-w-md">
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-slate-900 text-sm tracking-wide uppercase">{pillar.title}</h4>
                          <span className="px-2 py-0.5 rounded-full bg-[#01254d]/5 border border-[#01254d]/10 text-[9px] font-black uppercase tracking-widest text-[#01254d]">
                            {pillar.status}
                          </span>
                        </div>
                        <h5 className="text-[10px] font-bold text-[#FFC107] uppercase tracking-wider">{pillar.subtitle}</h5>
                        <p className="text-xs text-slate-500 font-semibold italic leading-relaxed">{pillar.desc}</p>
                      </div>

                      {/* Stat display */}
                      <div className="bg-[#01254d]/5 border border-[#01254d]/10 rounded-2xl p-4 min-w-[160px] text-center md:text-right shrink-0">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">TARGET IMPACT</span>
                        <span className="text-xs font-extrabold text-[#01254d] block mt-1">{pillar.impact}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

              </motion.div>
            ) : (
              <motion.div
                key="vision-engine"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid lg:grid-cols-12 gap-8 items-stretch"
              >
                {/* Left Side: Vision Statement & Active Radar Core */}
                <div className="lg:col-span-5 bg-white text-[#01254d] rounded-3xl p-8 md:p-10 flex flex-col justify-between border border-slate-200 relative overflow-hidden shadow-2xl min-h-[350px]">
                  {/* Glowing Radar Background */}
                  <div className="absolute -top-10 -left-10 w-44 h-44 bg-[#FFC107]/20 rounded-full blur-[80px] pointer-events-none animate-pulse" />
                  
                  {/* Radar Circles Visual */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-slate-200/50 flex items-center justify-center pointer-events-none">
                    <div className="w-52 h-52 rounded-full border border-slate-200/50 flex items-center justify-center animate-spin-slow">
                      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#01254d]/20 to-transparent" />
                    </div>
                  </div>

                  <div className="relative z-10 space-y-6">
                    <div className="w-14 h-14 rounded-2xl bg-[#01254d]/5 text-[#01254d] flex items-center justify-center border border-[#01254d]/10">
                      <Globe className="w-7 h-7" strokeWidth={1.5} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black tracking-widest text-[#FFC107] uppercase">The Ultimate Vision</span>
                      <h3 className="text-2xl md:text-3xl font-extrabold uppercase mt-1">Ecosystem Blueprint</h3>
                    </div>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed font-semibold italic">
                      "To become one of India’s leading EdTech and Innovation Platforms where students, innovators, startups, and institutions can access practical technology education and transform ideas into impactful innovations."
                    </p>
                  </div>

                  {/* Active Pillar Readout */}
                  <div className="relative z-10 pt-8 border-t border-slate-150 mt-8 flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                    <span>Active Milestone</span>
                    <span className="text-[#01254d] font-black uppercase">
                      {hoveredVisionMilestone ? hoveredVisionMilestone.toUpperCase() : "STANDBY SYSTEM"}
                    </span>
                  </div>
                </div>

                {/* Right Side: Clickable Vision Milestones List */}
                <div className="lg:col-span-7 flex flex-col justify-between gap-6">
                  {visionMilestones.map((milestone) => (
                    <motion.div
                      key={milestone.id}
                      onMouseEnter={() => setHoveredVisionMilestone(milestone.id)}
                      onMouseLeave={() => setHoveredVisionMilestone(null)}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className={`bg-white rounded-3xl p-6 border transition-all duration-300 cursor-pointer shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                        hoveredVisionMilestone === milestone.id
                          ? "border-[#FFC107]/70 shadow-xl shadow-[#FFC107]/5 bg-gradient-to-r from-amber-50/10 to-white"
                          : "border-slate-150 hover:border-slate-200"
                      }`}
                    >
                      <div className="space-y-2 max-w-md">
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-slate-900 text-sm tracking-wide uppercase">{milestone.title}</h4>
                          <span className="px-2 py-0.5 rounded-full bg-[#FFC107]/10 border border-[#FFC107]/30 text-[9px] font-black uppercase tracking-widest text-[#01254d]">
                            {milestone.timeline}
                          </span>
                        </div>
                        <h5 className="text-[10px] font-bold text-[#01254d]/60 uppercase tracking-wider">{milestone.subtitle}</h5>
                        <p className="text-xs text-slate-500 font-semibold italic leading-relaxed">{milestone.desc}</p>
                      </div>

                      {/* Stat display */}
                      <div className="bg-[#FFC107]/10 border border-[#FFC107]/30 rounded-2xl p-4 min-w-[160px] text-center md:text-right shrink-0">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">TARGET GOAL</span>
                        <span className="text-xs font-extrabold text-[#01254d] block mt-1">{milestone.target}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>

      {/* Redesigned: Horizontal Cinematic Interactive Storyboard Evolution Timeline (Theme-Colored & Clean) */}
      <section className="py-24 bg-white relative overflow-hidden" id="timeline">
        {/* Futuristic Grid Lines */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#01254d_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-[#FFC107]/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-[#01254d]/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#01254d]/5 border border-[#01254d]/10">
              <History className="w-4 h-4 text-[#01254d]" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#01254d]">Our Historical Track</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#01254d] tracking-tight">Ecosystem Evolution</h2>
            <p className="text-slate-500 font-medium italic">
              Click the circuit nodes on the dynamic track or use the slide controls to trace our journey since 2015.
            </p>
          </div>

          {/* Dynamic Story Rail (Horizontal Line) */}
          <div className="relative mb-16 max-w-5xl mx-auto px-8">
            <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-[3px] bg-slate-200" />
            <div 
              className="absolute left-8 top-1/2 -translate-y-1/2 h-[3px] bg-gradient-to-r from-[#01254d] to-[#FFC107] transition-all duration-500" 
              style={{ width: `${(activeTimeline / (timelineConsoleData.length - 1)) * 90}%` }}
            />
            
            <div className="relative flex justify-between items-center z-10">
              {timelineConsoleData.map((node, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTimeline(idx)}
                  className="flex flex-col items-center group focus:outline-none"
                >
                  {/* Glowing Node Button */}
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 relative ${
                    activeTimeline === idx
                      ? "bg-[#01254d] border-[#FFC107] scale-125 shadow-lg shadow-[#FFC107]/40 text-white"
                      : "bg-white border-slate-300 text-slate-400 group-hover:border-[#01254d] group-hover:text-[#01254d]"
                  }`}>
                    {activeTimeline === idx ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FFC107] animate-ping" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-[#01254d]" />
                    )}
                  </div>
                  
                  {/* Node Label Text */}
                  <span className={`text-[11px] font-mono font-black uppercase mt-3 tracking-wider transition-all duration-300 ${
                    activeTimeline === idx ? "text-[#01254d] font-black scale-105" : "text-slate-400 group-hover:text-slate-650"
                  }`}>
                    {node.year}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Cinematic Active Card Stage */}
          <div className="relative max-w-5xl mx-auto">
            
            {/* Nav Arrows */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-16 z-25 hidden md:block">
              <button 
                onClick={handlePrevTimeline}
                className="w-12 h-12 rounded-full border border-slate-200 bg-white hover:border-[#01254d] hover:bg-[#01254d] hover:text-white flex items-center justify-center text-slate-500 shadow-sm transition-all duration-300"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>
            
            <div className="absolute top-1/2 -translate-y-1/2 -right-16 z-25 hidden md:block">
              <button 
                onClick={handleNextTimeline}
                className="w-12 h-12 rounded-full border border-slate-200 bg-white hover:border-[#01254d] hover:bg-[#01254d] hover:text-white flex items-center justify-center text-slate-500 shadow-sm transition-all duration-300"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Main Stage Screen Card */}
            <div className="bg-[#02162b] border border-white/10 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#FFC107]/5 rounded-full blur-[80px] pointer-events-none" />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTimeline}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="grid lg:grid-cols-12 gap-8 items-stretch"
                >
                  {/* Left Side: Monospace Metadata & Big Title */}
                  <div className="lg:col-span-5 p-8 md:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 min-h-[250px]">
                    <div className="space-y-4">
                      <div className="font-mono text-xs text-[#FFC107] tracking-widest font-black uppercase">
                        CHAPTER {timelineConsoleData[activeTimeline].chapter} // 04
                      </div>
                      <h3 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
                        {timelineConsoleData[activeTimeline].title}
                      </h3>
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest font-mono">
                        {timelineConsoleData[activeTimeline].subtitle}
                      </h4>
                    </div>

                    <div className="pt-8">
                      <span className="text-[11px] font-mono text-slate-300 font-bold uppercase tracking-widest block">ACTIVE GENESIS</span>
                      <span className="text-4xl font-extrabold text-[#FFC107] tracking-tighter mt-1 block">
                        {timelineConsoleData[activeTimeline].year}
                      </span>
                    </div>
                  </div>

                  {/* Right Side: Narrative Story & Key Achievements Grid */}
                  <div className="lg:col-span-7 p-8 md:p-10 flex flex-col justify-between gap-6">
                    <p className="text-blue-100/90 text-sm md:text-base leading-relaxed font-semibold italic">
                      "{timelineConsoleData[activeTimeline].desc}"
                    </p>

                    {/* Telemetry Metrics Grid */}
                    <div className="space-y-3 pt-6 border-t border-white/10">
                      <span className="text-[10px] font-mono text-[#FFC107] font-bold uppercase tracking-widest block mb-1">KEY CHAPTER VERIFICATIONS</span>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {timelineConsoleData[activeTimeline].achievements.map((item, idx) => (
                          <div 
                            key={idx} 
                            className="flex items-start gap-2.5 text-xs"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#FFC107] shrink-0 mt-0.5" />
                            <span className="text-slate-200 font-semibold leading-relaxed italic">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Mobile Nav Indicators */}
            <div className="flex md:hidden items-center justify-between mt-6">
              <button 
                onClick={handlePrevTimeline}
                className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-black uppercase tracking-widest text-[#01254d]"
              >
                Previous
              </button>
              <span className="font-mono text-xs font-black text-slate-500">
                {timelineConsoleData[activeTimeline].chapter} / 04
              </span>
              <button 
                onClick={handleNextTimeline}
                className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-black uppercase tracking-widest text-[#01254d]"
              >
                Next
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* What We Do vs Who We Serve (Interactive Tabs) */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#01254d]/5 border border-[#01254d]/10">
                <Briefcase className="w-4 h-4 text-[#01254d]" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#01254d]">Our Capabilities & Reach</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-[#01254d] tracking-tight">Ecosystem Architecture</h2>
            </div>
            
            {/* Interactive Tab Selectors */}
            <div className="flex bg-slate-200/60 p-1.5 rounded-2xl border border-slate-300/30 w-full md:w-auto self-start">
              <button
                onClick={() => setActiveTab("what-we-do")}
                className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                  activeTab === "what-we-do"
                    ? "bg-[#01254d] text-white shadow-lg"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                What We Do?
              </button>
              <button
                onClick={() => setActiveTab("who-we-serve")}
                className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                  activeTab === "who-we-serve"
                    ? "bg-[#01254d] text-white shadow-lg"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Who It's For?
              </button>
            </div>
          </div>

          {/* Dynamic Content Panels */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {activeTab === "what-we-do" ? (
                <motion.div
                  key="what-we-do"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="grid md:grid-cols-2 lg:grid-cols-2 gap-6"
                >
                  {whatWeDoList.map((item, index) => (
                    <div 
                      key={index} 
                      className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex items-start gap-5 group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-[#01254d]/5 text-[#01254d] group-hover:bg-[#FFC107] group-hover:text-[#01254d] flex items-center justify-center shrink-0 transition-colors duration-300">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-slate-900 text-sm tracking-wide uppercase">{item.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-semibold italic">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="who-we-serve"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {whoWeServeList.map((item, index) => (
                    <div 
                      key={index} 
                      className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:border-[#FFC107]/40 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        <div className="w-8 h-8 rounded-full bg-[#FFC107]/10 text-[#01254d] flex items-center justify-center text-xs font-black">
                          0{index + 1}
                        </div>
                        <h4 className="font-extrabold text-[#01254d] text-base tracking-wide uppercase">{item.target}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-semibold italic">{item.desc}</p>
                      </div>
                      <div className="mt-6 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#FFC107] pt-4 border-t border-slate-50">
                        <span>Dynamic Pedagogy</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC107]/10 border border-[#FFC107]/30">
              <Award className="w-4 h-4 text-[#01254d]" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#01254d]">Our Core Strengths</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#01254d] tracking-tight">Why Prayog India Robotics?</h2>
            <p className="text-slate-500 font-medium italic">
              Delivering high-fidelity technical skills through rigorous, hardware-centric training methodologies.
            </p>
          </div>

          {/* 7 Pillars Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((pillar, idx) => (
              <div 
                key={idx}
                className="bg-[#F8FAFC] border border-slate-100 rounded-2xl p-8 hover:bg-[#01254d] hover:text-white transition-all duration-300 group shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#01254d]/5 text-[#01254d] group-hover:bg-[#FFC107] group-hover:text-[#01254d] flex items-center justify-center font-bold text-xs mb-6 transition-colors">
                    {idx + 1}
                  </div>
                  <h3 className="text-base font-extrabold uppercase tracking-wide mb-3 group-hover:text-white text-[#01254d]">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-slate-500 group-hover:text-blue-100/70 font-semibold leading-relaxed italic">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Prominent Methodology Quote */}
          <div className="max-w-4xl mx-auto mt-16 bg-[#01254d] text-white rounded-3xl p-8 md:p-12 relative overflow-hidden text-center shadow-xl">
            {/* Background vector */}
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-[#FFC107]/10 rounded-full blur-xl pointer-events-none" />
            <Quote className="w-12 h-12 text-[#FFC107]/40 mx-auto mb-6" />
            <p className="text-lg md:text-2xl font-bold italic leading-relaxed max-w-3xl mx-auto text-blue-50">
              "We believe students learn best when they create, experiment, innovate, and build technologies with their own hands."
            </p>
          </div>

        </div>
      </section>

      {/* Patriotic Contribution To The Nation */}
      <section className="py-24 bg-[#011429] text-white relative overflow-hidden">
        {/* Tricolor Glowing Accents (Sleek and subtle) */}
        <div className="absolute -right-20 -bottom-20 w-[450px] h-[450px] bg-emerald-500/5 rounded-full blur-[140px]" />
        <div className="absolute -left-20 -top-20 w-[450px] h-[450px] bg-orange-500/5 rounded-full blur-[140px]" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <Flag className="w-4 h-4 text-orange-500" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-300">Proud Contribution to the Nation</span>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
                Engineering <span className="text-[#FFC107]">Self-Reliance</span> & National Progress
              </h2>
              
              <div className="space-y-4 text-blue-100/70 text-sm md:text-base leading-relaxed font-semibold italic">
                <p>
                  One of the proudest milestones in our journey has been contributing our technical expertise and innovation capabilities toward critical domains. We have also contributed technical expertise toward projects aligned with national innovation and defence-oriented initiatives, which remains a matter of pride for our team.
                </p>
                <p>
                  This opportunity represents not only a professional achievement but also a matter of immense pride and national contribution for our entire team.
                </p>
                <p>
                  At PRAYOG INDIA ROBOTICS, we believe technology and innovation should contribute toward nation-building, self-reliance, research, and the development of future-ready technological ecosystems for India.
                </p>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white/10 border border-white/10 backdrop-blur-md rounded-3xl p-8 space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-[#FFC107]/10 flex items-center justify-center text-[#FFC107] mx-auto">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-wider">National Innovation Alignment</h3>
              <p className="text-xs text-slate-400 font-semibold italic leading-relaxed">
                Empowering the next-generation workforce with high-end hardware prototyping expertise for self-reliant growth.
              </p>
              <div className="pt-4 flex justify-center gap-6">
                <div>
                  <div className="text-xs font-bold text-orange-400">INNOVATE</div>
                </div>
                <div className="text-slate-600">|</div>
                <div>
                  <div className="text-xs font-bold text-white">BUILD</div>
                </div>
                <div className="text-slate-600">|</div>
                <div>
                  <div className="text-xs font-bold text-emerald-400">NURTURE</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Core Team Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#01254d]/5 border border-[#01254d]/10">
              <Users className="w-4 h-4 text-[#01254d]" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#01254d]">Our Architects</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#01254d] tracking-tight">Our Core Leadership Team</h2>
            <p className="text-slate-500 font-medium italic">
              Meet the visionary founders and engineering specialists orchestrating the future of EdTech and industrial learning.
            </p>
          </div>

          {/* Primary Core Leaders */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            
            {/* Enamul Hassan */}
            <div className="bg-[#F8FAFC] border-t-4 border-[#01254d] rounded-3xl p-8 shadow-sm flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-16 h-16 rounded-full bg-[#01254d] text-white flex items-center justify-center font-extrabold text-lg shadow-md border border-[#FFC107]">
                    EH
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#01254d]/5 border border-[#01254d]/15 text-[9px] font-bold tracking-widest text-[#01254d] uppercase">Founder</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold text-[#01254d]">Enamul Hassan</h3>
                  <h4 className="text-xs font-bold text-[#FFC107] uppercase tracking-wider">Founder of Prayog India Robotics</h4>
                </div>
                <p className="text-xs text-slate-600 font-semibold italic leading-relaxed">
                  Founder of PRAYOG INDIA ROBOTICS PVT. LTD. and the visionary behind the journey that started in 2015 during his Engineering days. With a strong passion for Robotics, Embedded Systems, Innovation, and practical education, he laid the foundation of PRAYOGTECH and later expanded it into a complete EdTech and Innovation ecosystem focused on future technologies and skill development.
                </p>
              </div>
            </div>

            {/* Md. Shahnawaz Abbas */}
            <div className="bg-[#F8FAFC] border-t-4 border-[#FFC107] rounded-3xl p-8 shadow-sm flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 md:col-span-1">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-16 h-16 rounded-full bg-[#FFC107] text-[#01254d] flex items-center justify-center font-extrabold text-lg shadow-md">
                    SA
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#FFC107]/20 border border-[#FFC107]/40 text-[9px] font-bold tracking-widest text-[#01254d] uppercase">Research & Training Manager</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold text-[#01254d]">Md. Shahnawaz Abbas</h3>
                  <h4 className="text-xs font-bold text-[#01254d]/60 uppercase tracking-wider">Research & Training Manager</h4>
                </div>
                <p className="text-xs text-slate-600 font-semibold italic leading-relaxed">
                  Md. Shahnawaz Abbas has been one of the strongest pillars behind the growth and success of PRAYOG INDIA ROBOTICS since the very beginning of the journey. More than a team member, he has contributed with the dedication and leadership of a co-founder in shaping the organization’s vision, research activities, practical learning ecosystem, technical programs, and innovation culture. As the backbone of the organization, he has continuously played a vital role in developing research-driven learning methodologies, technical workshops, innovation-based projects, and student engagement systems. His dedication, leadership, and technical expertise have helped build PRAYOG INDIA ROBOTICS into a trusted platform for Robotics, Embedded Systems, IoT, Drone Technology, Automation, and STEM Education.
                </p>
              </div>
            </div>

            {/* Emraan Hassan */}
            <div className="bg-[#F8FAFC] border-t-4 border-[#01254d] rounded-3xl p-8 shadow-sm flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-16 h-16 rounded-full bg-[#01254d] text-white flex items-center justify-center font-extrabold text-lg shadow-md border border-[#FFC107]">
                    EH
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#01254d]/5 border border-[#01254d]/15 text-[9px] font-bold tracking-widest text-[#01254d] uppercase">Technology Specialist</span>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold text-[#01254d]">Emraan Hassan</h3>
                  <h4 className="text-xs font-bold text-[#FFC107] uppercase tracking-wider">Robotics & Emerging Tech Specialist</h4>
                </div>
                <p className="text-xs text-slate-600 font-semibold italic leading-relaxed">
                  Although recently joined, Emraan Hassan has already become an important driving force in taking the mission of PRAYOG INDIA ROBOTICS forward with energy, dedication, and technical excellence. With strong expertise in Robotics, Embedded Systems, IoT, and Drone Technology, he actively contributes toward practical technology learning, innovation-based projects, technical mentorship, and future-focused development activities. His passion for emerging technologies and hands-on problem-solving reflects the innovative spirit of the organization. His commitment to empowering students with practical technical skills and future-ready knowledge is helping strengthen the organization’s vision of building a new generation of innovators, creators, and technology leaders.
                </p>
              </div>
            </div>

          </div>

          {/* Secondary Core Engineers Grid */}
          <div className="pt-16">
            <h3 className="text-xl font-extrabold text-[#01254d] uppercase tracking-wider mb-8 text-center md:text-left">
              Core Engineering Team
            </h3>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Jay Prakash Kumar */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-[#01254d]/5 text-[#01254d] flex items-center justify-center font-extrabold text-sm mb-4">
                  JK
                </div>
                <h4 className="font-extrabold text-[#01254d] text-base mb-1">Jay Prakash Kumar</h4>
                <p className="text-[10px] font-bold text-[#FFC107] uppercase tracking-widest mb-3">Sr. Embedded Engineer</p>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed italic">
                  Specialized in Embedded Systems, IoT, Electronics Design, Circuit Development, and Hardware Prototyping with expertise in real-time embedded technologies and practical hardware systems.
                </p>
              </div>

              {/* Nikhil Khakha */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-[#01254d]/5 text-[#01254d] flex items-center justify-center font-extrabold text-sm mb-4">
                  NK
                </div>
                <h4 className="font-extrabold text-[#01254d] text-base mb-1">Nikhil Khakha</h4>
                <p className="text-[10px] font-bold text-[#FFC107] uppercase tracking-widest mb-3">Drone Engineer</p>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed italic">
                  Focused on Drone Technology, UAV Systems, Drone Training, and practical implementation of aerial robotics technologies.
                </p>
              </div>

              {/* Saheb Ali */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-[#01254d]/5 text-[#01254d] flex items-center justify-center font-extrabold text-sm mb-4">
                  SA
                </div>
                <h4 className="font-extrabold text-[#01254d] text-base mb-1">Saheb Ali</h4>
                <p className="text-[10px] font-bold text-[#FFC107] uppercase tracking-widest mb-3">Automation Engineer</p>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed italic">
                  Specialized in Industrial Automation, Control Systems, Smart Technologies, and automation-driven innovation systems.
                </p>
              </div>

              {/* Vivek Ranjan */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-[#FFC107]/10 text-[#01254d] flex items-center justify-center font-extrabold text-sm mb-4">
                  VR
                </div>
                <h4 className="font-extrabold text-[#01254d] text-base mb-1">Vivek Ranjan</h4>
                <p className="text-[10px] font-bold text-[#01254d]/60 uppercase tracking-widest mb-3">Sr. Graphic Designer</p>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed italic">
                  One of the oldest and most dedicated members associated with the organization since the early stages of the journey. He has played a major role in shaping the visual identity, creative branding, digital presence, and professional design ecosystem of PRAYOG INDIA ROBOTICS through innovative and impactful graphic designing.
                </p>
              </div>

            </div>
          </div>

          {/* Guest Faculty Grid */}
          <div className="mt-16 pt-16">
            <h3 className="text-xl font-extrabold text-[#01254d] uppercase tracking-wider mb-8 text-center md:text-left">
              Guest Faculty & Technical Experts
            </h3>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Aman Raj */}
              <div className="bg-[#F8FAFC] border border-slate-100 rounded-2xl p-6 hover:border-[#FFC107]/40 transition-colors">
                <h4 className="font-extrabold text-[#01254d] text-base mb-1">Aman Raj</h4>
                <p className="text-[10px] font-bold text-[#FFC107] uppercase tracking-widest mb-3">Robotics & Automation Engineer</p>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed italic">
                  Guest Faculty and technical mentor specializing in Robotics, Automation Systems, and practical engineering applications.
                </p>
              </div>

              {/* Anant Verma */}
              <div className="bg-[#F8FAFC] border border-slate-100 rounded-2xl p-6 hover:border-[#FFC107]/40 transition-colors">
                <h4 className="font-extrabold text-[#01254d] text-base mb-1">Anant Verma</h4>
                <p className="text-[10px] font-bold text-[#FFC107] uppercase tracking-widest mb-3">Robotics Engineer</p>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed italic">
                  Focused on Robotics System Design, robotics implementation, and innovation-based project development.
                </p>
              </div>

              {/* Sunny Kumar */}
              <div className="bg-[#F8FAFC] border border-slate-100 rounded-2xl p-6 hover:border-[#FFC107]/40 transition-colors">
                <h4 className="font-extrabold text-[#01254d] text-base mb-1">Sunny Kumar</h4>
                <p className="text-[10px] font-bold text-[#FFC107] uppercase tracking-widest mb-3">Sr. Web Developer</p>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed italic">
                  Responsible for advanced web technologies, platform development, and digital infrastructure supporting modern EdTech ecosystems.
                </p>
              </div>

              {/* Belal Khan */}
              <div className="bg-[#F8FAFC] border border-slate-100 rounded-2xl p-6 hover:border-[#FFC107]/40 transition-colors">
                <h4 className="font-extrabold text-[#01254d] text-base mb-1">Belal Khan</h4>
                <p className="text-[10px] font-bold text-[#FFC107] uppercase tracking-widest mb-3">Sr. Android Developer</p>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed italic">
                  Specialized in Android Application Development, mobile technology solutions, and software-driven innovation systems.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 bg-[#01254d] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FFC107]/10 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-6 text-center space-y-8 relative z-10">
          <div className="w-16 h-16 rounded-full bg-[#FFC107]/10 flex items-center justify-center text-[#FFC107] mx-auto">
            <Heart className="w-8 h-8 animate-pulse" />
          </div>
          
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Building the Future <span className="text-[#FFC107]">Through Innovation</span>
          </h2>
          
          <p className="text-blue-100/70 text-base md:text-lg leading-relaxed max-w-3xl mx-auto font-semibold italic">
            At PRAYOG INDIA ROBOTICS, we are not just teaching technologies — we are building an ecosystem where ideas become innovations, learning becomes practical, and students become future technology leaders.
          </p>

          <p className="text-slate-400 text-xs md:text-sm max-w-2xl mx-auto font-medium">
            Whether you are a school student exploring Robotics for the first time, an engineering student seeking industry-ready skills, a startup developing innovative solutions, or an institution planning future-ready STEM Labs — we are here to support your innovation journey.
          </p>

          <h3 className="text-lg font-bold text-[#FFC107] uppercase tracking-widest pt-4">
            We invite students, institutions, innovators, and organizations to collaborate with us in shaping the future of technology education in India
          </h3>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-6">
            <Link href="/contact" className="px-10 py-5 bg-[#FFC107] text-[#01254d] font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-white hover:scale-105 transition-all duration-300 shadow-xl shadow-[#FFC107]/20 flex items-center gap-3">
              <span>Collaborate With Us</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
