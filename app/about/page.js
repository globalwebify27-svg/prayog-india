"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play, X, ChevronRight, ChevronLeft, Quote } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const team = [
  { 
    name: "Enamul Hassan", 
    role: "Founder & Visionary", 
    initial: "EH", 
    img: "/assets/t1.png",
    bio: "Founder of PRAYOG INDIA ROBOTICS PVT. LTD. — the visionary who started this journey in 2015 during his Engineering days, driven by a passion for Robotics, Embedded Systems, and practical education.", 
    color: "#01254d",
    specialties: ["Strategic Growth", "Embedded Systems", "Robotics"],
    focus: "National STEM Scaling"
  },
  { 
    name: "Md. Shahnawaz Abbas", 
    role: "Research & Training Manager", 
    initial: "SA", 
    img: "/assets/t2.png",
    bio: "One of the strongest pillars behind PRAYOG's growth. With co-founder-level dedication, he shaped the research, learning methodology, workshops, and innovation culture of the organization.", 
    color: "#1a3f70",
    specialties: ["IoT Networks", "Applied Research", "STEM Labs Setup"],
    focus: "Ecosystem Development"
  },
  { 
    name: "Emraan Hassan", 
    role: "Robotics & Emerging Tech Specialist", 
    initial: "EH", 
    img: "/assets/t3.png",
    bio: "A driving force with expertise in Robotics, Embedded Systems, IoT, and Drone Technology. His passion for hands-on learning embodies the spirit of innovation at PRAYOG.", 
    color: "#0d2d52",
    specialties: ["Drone Engineering", "Sensors & Telemetry", "Workshop Design"],
    focus: "UAV Systems & Flight Control"
  },
  { 
    name: "Jay Prakash Kumar", 
    role: "Sr. Embedded Engineer", 
    initial: "JK", 
    img: "/assets/t1.png",
    bio: "Specialized in Embedded Systems, IoT, Electronics Design, and Hardware Prototyping with deep expertise in real-time embedded technologies.", 
    color: "#01254d",
    specialties: ["Circuit Design", "Firmware (C++)", "Prototyping"],
    focus: "Microcontrollers & RTOS"
  },
  { 
    name: "Nikhil Khakha", 
    role: "Drone Engineer", 
    initial: "NK", 
    img: "/assets/t2.png",
    bio: "Focused on Drone Technology, UAV Systems, and aerial robotics — guiding students through the technical and regulatory aspects of drone engineering.", 
    color: "#1a3f70",
    specialties: ["Aerodynamics", "PX4 Autopilot", "DGCA Compliance"],
    focus: "UAV Assembly & Flight Operations"
  },
  { 
    name: "Saheb Ali", 
    role: "Automation Engineer", 
    initial: "SA", 
    img: "/assets/t3.png",
    bio: "Specialized in Industrial Automation, Control Systems, and Smart Technologies — bridging the gap between academic theory and real industrial practice.", 
    color: "#0d2d52",
    specialties: ["PLC Programming", "SCADA Integration", "Control Logic"],
    focus: "Industrial Automation Systems"
  },
  { 
    name: "Vivek Ranjan", 
    role: "Sr. Graphic Designer", 
    initial: "VR", 
    img: "/assets/t1.png",
    bio: "One of the earliest members who shaped PRAYOG's entire visual identity, creative branding, and digital presence through impactful graphic design.", 
    color: "#01254d",
    specialties: ["Visual Design", "Creative Branding", "UX/UI Prototyping"],
    focus: "Digital & Media Presence"
  },
];

const guestFaculty = [
  { name: "Aman Raj", role: "Robotics & Automation Engineer", desc: "Guest Faculty and technical mentor specializing in Robotics, Automation Systems, and practical engineering applications.", initial: "AR" },
  { name: "Anant Verma", role: "Robotics Engineer", desc: "Focused on Robotics System Design, robotics implementation, and innovation-based project development.", initial: "AV" },
  { name: "Sunny Kumar", role: "Sr. Web Developer", desc: "Responsible for advanced web technologies, platform development, and digital infrastructure supporting modern EdTech ecosystems.", initial: "SK" },
  { name: "Belal Khan", role: "Sr. Android Developer", desc: "Specialized in Android Application Development, mobile technology solutions, and software-driven innovation systems.", initial: "BK" },
];

const milestones = [
  { year: "2015", title: "The Beginning", desc: "Enamul Hassan founded PRAYOGTECH during his engineering days — a bold vision to make advanced technology affordable and accessible for every student in India.", img: "/assets/hero1.png" },
  { year: "2016–2024", title: "Ecosystem Growth", desc: "What started with Robotics kits and Arduino accessories grew into a full ecosystem — Embedded Systems, IoT, Drone Technology, AI, Automation, and STEM Education.", img: "/assets/one_on_one_robotics_training.png" },
  { year: "2025", title: "Corporate Leap", desc: "The vision formalized into PRAYOG INDIA ROBOTICS PVT. LTD. — a stronger foundation to build India's next-generation EdTech and Innovation ecosystem.", img: "/assets/internship.png" },
  { year: "Today", title: "Bridging the Gap", desc: "Bridging theory and industry through practical learning, research-driven training, innovation workshops, STEM Labs, and internship programs across India.", img: "/assets/summer_camp.png" },
];

const services = [
  "Robotics Training", "Embedded Systems & IoT", "Drone Technology", 
  "AI & STEM Education", "3D Design & Printing", "Automation Projects",
  "Internship Programs", "STEM Lab Setup", "Industry Workshops", "Hardware Learning"
];

const stats = [
  { value: "10,000+", label: "Students Trained" },
  { value: "100+", label: "Schools & Colleges" },
  { value: "50+", label: "Workshops" },
  { value: "10+", label: "Years of Impact" },
];

export default function AboutPage() {
  const [showVideo, setShowVideo] = useState(false);
  const [activeMilestone, setActiveMilestone] = useState(0);
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);
  const [isSliderHovered, setIsSliderHovered] = useState(false);
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);
  const [teamList, setTeamList] = useState(team);
  const [facultyList, setFacultyList] = useState(guestFaculty);
  const heroRef = useRef(null);
  const sliderRef = useRef(null);
  
  useEffect(() => {
    async function loadData() {
      try {
        const teamRes = await fetch("/api/about/team");
        const teamData = await teamRes.json();
        if (teamData.success && teamData.team?.length > 0) {
          setTeamList(teamData.team);
        }
      } catch (err) {
        console.error("Failed to fetch team list", err);
      }

      try {
        const facRes = await fetch("/api/about/faculty");
        const facData = await facRes.json();
        if (facData.success && facData.faculty?.length > 0) {
          const mapped = facData.faculty.map(f => ({
            ...f,
            desc: f.desc_text
          }));
          setFacultyList(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch faculty list", err);
      }
    }
    loadData();
  }, []);

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      let nextIndex = activeTeamIndex;
      if (direction === "left") {
        nextIndex = Math.max(0, activeTeamIndex - 1);
      } else {
        nextIndex = Math.min(teamList.length - 1, activeTeamIndex + 1);
      }
      
      const children = sliderRef.current.children;
      if (children && children[nextIndex]) {
        const targetScroll = children[nextIndex].offsetLeft - sliderRef.current.offsetLeft;
        sliderRef.current.scrollTo({
          left: targetScroll,
          behavior: "smooth"
        });
        setActiveTeamIndex(nextIndex);
      }
    }
  };

  const handleSliderScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft } = sliderRef.current;
      const children = sliderRef.current.children;
      if (children && children.length > 0) {
        let closestIndex = 0;
        let minDiff = Infinity;
        for (let i = 0; i < children.length; i++) {
          const diff = Math.abs(children[i].offsetLeft - sliderRef.current.offsetLeft - scrollLeft);
          if (diff < minDiff) {
            minDiff = diff;
            closestIndex = i;
          }
        }
        // Only update state if it actually changed to prevent unnecessary renders
        setActiveTeamIndex((prev) => (closestIndex !== prev ? closestIndex : prev));
      }
    }
  };

  // Smooth Autosliding Effect (Index-Based for CSS Snap compatibility)
  useEffect(() => {
    if (selectedTeamMember || isSliderHovered || teamList.length === 0) return;

    const interval = setInterval(() => {
      if (sliderRef.current) {
        const nextIndex = (activeTeamIndex + 1) % teamList.length;
        const children = sliderRef.current.children;
        if (children && children[nextIndex]) {
          const targetScroll = children[nextIndex].offsetLeft - sliderRef.current.offsetLeft;
          sliderRef.current.scrollTo({
            left: targetScroll,
            behavior: "smooth"
          });
          setActiveTeamIndex(nextIndex);
        }
      }
    }, 3800); // Trigger every 3.8s for natural pacing

    return () => clearInterval(interval);
  }, [selectedTeamMember, isSliderHovered, activeTeamIndex, teamList]);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Telemetry items for interactive hero list
  const heroBadges = [
    { title: "Robotics", desc: "Autonomous mechanical rigs & kinematics", color: "from-[#FFC107] to-amber-500" },
    { title: "IoT & Embedded", desc: "Microcontroller logic & cloud telemetry", color: "from-blue-400 to-[#01254d]" },
    { title: "Drone Tech", desc: "Autopilot flight dynamics & UAV structural builds", color: "from-emerald-400 to-teal-600" },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden font-body antialiased">
      <Header />

      {/* ── HIGH-END HERO SECTION ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-24 pb-20 overflow-hidden bg-[#010c18]">
        {/* Parallax Background Image with complex visual treatment */}
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0">
          <Image src="/assets/hero2.png" alt="Prayog India Robotics" fill className="object-cover object-center scale-105" priority />
          {/* Futuristic High-Contrast Grid & Color Overlays */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#01254d] via-[#011429]/90 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#01254d] to-transparent" />
          {/* Animated floating ambient glow spots */}
          <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-[#FFC107]/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full mt-10 md:mt-0">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <motion.div 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
              >
                <span className="w-2 h-2 rounded-full bg-[#FFC107] animate-ping" />
                <span className="text-[#FFC107] font-black uppercase tracking-widest text-[10px]">
                  PRAYOG INDIA ROBOTICS PVT. LTD.
                </span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 25 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-[1.05] tracking-tight"
              >
                Building India&apos;s <br />
                Future Through <br />
                <span className="text-[#FFC107] relative inline-block">
                  Innovation
                  <span className="absolute bottom-1 left-0 w-full h-[6px] bg-[#FFC107]/20 rounded-full" />
                </span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-blue-100/80 text-base sm:text-lg max-w-xl leading-relaxed"
              >
                An EdTech and Innovation enterprise transforming technical education in India through practical learning, active research, and industry-oriented skill development.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap gap-4 pt-2"
              >
                <Link href="/contact" className="px-8 py-4 bg-[#FFC107] text-[#01254d] font-black text-xs uppercase tracking-widest rounded-full hover:bg-white transition-all duration-300 flex items-center gap-2 shadow-lg shadow-[#FFC107]/10">
                  Work With Us <ArrowRight className="w-4 h-4" />
                </Link>
                <button onClick={() => setShowVideo(true)}
                  className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 font-black text-xs uppercase tracking-widest rounded-full hover:bg-[#FFC107] hover:text-[#01254d] hover:border-transparent transition-all duration-300 flex items-center gap-2 shadow-lg">
                  <Play className="w-4 h-4 fill-current" /> Watch Our Story
                </button>
              </motion.div>
            </div>

            {/* Right Interactive Telemetry Console */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, x: 30 }} 
              animate={{ opacity: 1, scale: 1, x: 0 }} 
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-5"
            >
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                  <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest font-mono">Core Training Verticals</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[9px] font-black uppercase tracking-wider">Online</span>
                </div>

                <div className="space-y-4">
                  {heroBadges.map((badge, idx) => (
                    <motion.div 
                      key={idx}
                      whileHover={{ scale: 1.02, x: 4 }}
                      className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/15 transition-all duration-300 group cursor-default"
                    >
                      <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 bg-gradient-to-r ${badge.color} group-hover:scale-125 transition-transform`} />
                      <div>
                        <h4 className="text-white font-black text-sm uppercase tracking-wide group-hover:text-[#FFC107] transition-colors">{badge.title}</h4>
                        <p className="text-white/60 text-xs mt-1 leading-relaxed">{badge.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <p className="text-[10px] text-center text-white/40 mt-6 font-mono font-bold uppercase tracking-wider">
                  ✦ Dynamic Hands-on Pedagogy ✦
                </p>
              </div>
            </motion.div>

          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce pointer-events-none hidden md:block">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center pt-2">
            <div className="w-1.5 h-2.5 bg-white/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* ── VIDEO MODAL ── */}
      <AnimatePresence>
        {showVideo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setShowVideo(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
              <iframe className="w-full h-full" src="https://www.youtube.com/embed/kRaxlc2Fblk?autoplay=1"
                title="Prayog India" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              <button onClick={() => setShowVideo(false)} className="absolute top-3 right-3 w-9 h-9 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black transition-colors">
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── STATS STRIP ── */}
      <section className="bg-[#01254d] py-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
              <div className="text-4xl md:text-5xl font-black text-[#FFC107] mb-1">{s.value}</div>
              <div className="text-white/60 text-xs font-bold uppercase tracking-wider">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── OUR STORY ── */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <p className="text-[#FFC107] font-bold uppercase tracking-widest text-sm mb-4">Our Story</p>
            <h2 className="text-4xl md:text-5xl font-black text-[#01254d] leading-tight mb-6">
              A Decade of Turning Ideas Into Reality
            </h2>
            <div className="space-y-5 text-slate-655 leading-relaxed text-[15px] font-medium">
              <p>PRAYOG INDIA ROBOTICS PVT. LTD. began in 2015 when Enamul Hassan, still an engineering student himself, saw the gap between what universities taught and what industry actually needed.</p>
              <p>Armed with nothing but passion and a handful of robotics kits, he started PRAYOGTECH — a movement to make advanced technology affordable and hands-on for every student in India.</p>
              <p>Over a decade, that seed grew into a full-fledged EdTech and Innovation company serving 10,000+ students, setting up STEM labs in 100+ institutions, and building one of India&apos;s most practical technical learning ecosystems.</p>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <Image src="/assets/signature.png" alt="Founder signature" width={120} height={50} className="object-contain opacity-70" />
              <div>
                <div className="font-bold text-[#01254d]">Enamul Hassan</div>
                <div className="text-sm text-slate-500">Founder, Prayog India Robotics</div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="relative">
            <div className="relative h-[520px] rounded-3xl overflow-hidden shadow-2xl">
              <Image src="/assets/about-img.png" alt="About Prayog India" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#01254d]/50 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-[#FFC107] rounded-2xl p-5 shadow-xl">
              <div className="text-[#01254d] font-black text-3xl">10+</div>
              <div className="text-[#01254d]/80 text-xs font-semibold uppercase tracking-wider">Years of Innovation</div>
            </div>
            <div className="absolute -top-6 -right-6 w-32 h-32 rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-white flex items-center justify-center">
              <Image src="/assets/logo.png" alt="Logo" fill className="object-contain p-2 bg-white" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── MISSION & VISION ── */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/assets/hero3.png" alt="Mission" fill className="object-cover animate-pulse" style={{ animationDuration: "12s" }} />
          <div className="absolute inset-0 bg-[#01254d]/92" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Quote className="w-12 h-12 text-[#FFC107]/40 mb-4" />
            <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-wide">Our Mission</h2>
            <p className="text-white/75 text-lg leading-relaxed">
              To revolutionize technical education in India through practical learning, innovation, affordability, and future-ready skill development — making Robotics, AI, IoT, Drones, and STEM accessible to all.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <Quote className="w-12 h-12 text-[#FFC107]/40 mb-4" />
            <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-wide">Our Vision</h2>
            <p className="text-white/75 text-lg leading-relaxed">
              To become India&apos;s leading EdTech and Innovation Platform — where students, innovators, startups, and institutions transform ideas into impactful real-world innovations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── JOURNEY TIMELINE ── */}
      <section className="py-28 bg-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-[#FFC107] font-bold uppercase tracking-widest text-sm mb-3">Our Journey</p>
            <h2 className="text-4xl md:text-5xl font-black text-[#01254d]">A Decade of Milestones</h2>
          </motion.div>

          {/* Tab selectors */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {milestones.map((m, i) => (
              <button key={i} onClick={() => setActiveMilestone(i)}
                className={`px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 ${activeMilestone === i ? "bg-[#01254d] text-white shadow-lg scale-105" : "bg-white border border-slate-200 text-slate-600 hover:border-[#01254d]"}`}>
                {m.year}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeMilestone}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative h-[380px] md:h-[460px] rounded-3xl overflow-hidden shadow-2xl">
                <Image src={milestones[activeMilestone].img} alt={milestones[activeMilestone].title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#01254d]/70 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <span className="text-6xl font-black text-white/20">{milestones[activeMilestone].year}</span>
                </div>
              </div>
              <div className="space-y-6">
                <div className="text-[#FFC107] font-bold uppercase tracking-widest text-sm">{milestones[activeMilestone].year}</div>
                <h3 className="text-3xl md:text-4xl font-black text-[#01254d] leading-tight">
                  {milestones[activeMilestone].title}
                </h3>
                <p className="text-slate-600 text-lg leading-relaxed">
                  {milestones[activeMilestone].desc}
                </p>
                <div className="flex gap-2">
                  {milestones.map((_, i) => (
                    <button key={i} onClick={() => setActiveMilestone(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${i === activeMilestone ? "w-10 bg-[#FFC107]" : "w-4 bg-slate-300"}`} />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── WHAT WE DO ── */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <p className="text-[#FFC107] font-bold uppercase tracking-widest text-sm mb-4">What We Do</p>
              <h2 className="text-4xl md:text-5xl font-black text-[#01254d] leading-tight mb-8">
                Turning Learners Into Builders
              </h2>
              <div className="flex flex-wrap gap-3">
                {services.map((s, i) => (
                  <motion.span key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                    className="px-4 py-2 bg-[#01254d]/5 hover:bg-[#01254d] hover:text-white border border-[#01254d]/10 text-[#01254d] rounded-full text-sm font-semibold cursor-default transition-all duration-300">
                    {s}
                  </motion.span>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
              className="grid grid-cols-2 gap-4">
              {["/assets/m1.png", "/assets/m2.png", "/assets/m3.png", "/assets/m4.png"].map((src, i) => (
                <div key={i} className={`relative rounded-2xl overflow-hidden shadow-md ${i === 0 ? "col-span-2 h-52" : "h-44"}`}>
                  <Image src={src} alt="" fill className="object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── PREMIUM INTERACTIVE TEAM SLIDER & PROFILE MODAL ── */}
      <section className="py-28 bg-slate-50/70 border-y border-slate-200/60 relative overflow-hidden">
        {/* Custom scrollbar hiding styling injected directly */}
        <style dangerouslySetInnerHTML={{__html: `
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}} />

        {/* Soft elegant blur decorations */}
        <div className="absolute top-0 right-1/4 w-[350px] h-[350px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[350px] h-[350px] bg-[#FFC107]/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="text-left">
              <p className="text-[#FFC107] font-semibold uppercase tracking-widest text-xs mb-2 font-mono">The Brains Behind Prayog</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#01254d] tracking-tight">Meet Our Core Team</h2>
              <p className="text-slate-500 text-sm mt-2 max-w-xl">Slide through our core engineering and leadership team. Click any card to explore their full professional profile and specialties.</p>
            </div>
            
            {/* Navigation buttons */}
            <div className="flex gap-3 shrink-0">
              <button 
                onClick={() => scrollSlider("left")}
                className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-[#01254d] hover:text-white text-[#01254d] flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => scrollSlider("right")}
                className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-[#01254d] hover:text-white text-[#01254d] flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          {/* Horizontal Slider Track */}
          <div 
            ref={sliderRef}
            onMouseEnter={() => setIsSliderHovered(true)}
            onMouseLeave={() => setIsSliderHovered(false)}
            onScroll={handleSliderScroll}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-6 no-scrollbar cursor-grab active:cursor-grabbing"
          >
            {teamList.map((m, idx) => (
              <motion.div 
                key={idx}
                onClick={() => setSelectedTeamMember(m)}
                whileHover={{ y: -6 }}
                className="snap-start shrink-0 w-[290px] sm:w-[325px] bg-white border border-slate-100 hover:border-slate-200 rounded-2xl p-4 transition-all duration-300 cursor-pointer group flex flex-col justify-between h-[440px] shadow-[0_5px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_30px_rgba(1,37,77,0.06)]"
              >
                <div>
                  <div className="relative h-[250px] w-full rounded-xl overflow-hidden bg-slate-50 border border-slate-100/50">
                    <Image src={m.img} alt={m.name} fill className="object-cover group-hover:scale-102 transition-transform duration-500" />
                    
                    {/* Focus badge overlay */}
                    <div className="absolute bottom-3 left-3 bg-white/95 px-3 py-1 rounded-full shadow-sm">
                      <p className="text-[#01254d] text-[10px] font-bold tracking-wider">{m.focus}</p>
                    </div>
                  </div>
                  
                  <h3 className="text-[#01254d] text-lg font-bold tracking-tight mt-4 group-hover:text-[#01254d]/85 transition-colors">{m.name}</h3>
                  <p className="text-slate-500 text-sm font-medium mt-0.5">{m.role}</p>
                </div>
                
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-3">
                  <span className="text-xs text-slate-400 group-hover:text-[#01254d] transition-colors">View Profile</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#01254d] group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── MODAL OVERLAY ── */}
        <AnimatePresence>
          {selectedTeamMember && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md"
              onClick={() => setSelectedTeamMember(null)}
            >
              <motion.div 
                initial={{ scale: 0.94, y: 20, opacity: 0 }} 
                animate={{ scale: 1, y: 0, opacity: 1 }} 
                exit={{ scale: 0.94, y: 20, opacity: 0 }}
                transition={{ type: "spring", damping: 28, stiffness: 350 }}
                className="relative w-full max-w-3xl bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-2xl p-6 sm:p-8 max-h-[85vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                <button 
                  onClick={() => setSelectedTeamMember(null)}
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-full flex items-center justify-center border border-slate-200/50 transition-all duration-200 z-10"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="grid md:grid-cols-12 gap-8 items-start mt-6 md:mt-0">
                  {/* Left portrait detail */}
                  <div className="md:col-span-5">
                    <div className="relative w-full aspect-[4/5] sm:aspect-square md:aspect-[4/5] rounded-xl overflow-hidden border border-slate-100 shadow-md bg-slate-50">
                      <Image src={selectedTeamMember.img} alt={selectedTeamMember.name} fill className="object-cover" />
                    </div>
                  </div>

                  {/* Right description details */}
                  <div className="md:col-span-7 text-left">
                    <div>
                      <span className="text-[#FFC107] font-semibold text-xs uppercase tracking-widest">{selectedTeamMember.focus}</span>
                      <h2 className="text-3xl font-extrabold text-[#01254d] tracking-tight mt-1">
                        {selectedTeamMember.name}
                      </h2>
                      <p className="text-slate-500 text-sm font-medium mt-0.5">
                        {selectedTeamMember.role}
                      </p>
                    </div>

                    <div className="border-t border-slate-100 pt-5 mt-5">
                      <p className="text-slate-600 text-sm sm:text-base leading-relaxed border-l-2 border-[#FFC107] pl-4 italic">
                        {selectedTeamMember.bio}
                      </p>
                    </div>

                    <div className="border-t border-slate-100 pt-5 mt-5">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Core Competencies</span>
                      <div className="flex flex-wrap gap-2">
                        {selectedTeamMember.specialties.map((spec, sIdx) => (
                          <span 
                            key={sIdx}
                            className="px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-600 text-xs font-medium"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-5 mt-5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <a href="#" onClick={e => e.preventDefault()} className="w-8 h-8 rounded-full bg-slate-50 hover:bg-[#01254d] hover:text-white text-slate-500 flex items-center justify-center border border-slate-200/50 transition-all font-mono text-xs font-bold shadow-sm">in</a>
                        <a href="#" onClick={e => e.preventDefault()} className="w-8 h-8 rounded-full bg-slate-50 hover:bg-[#01254d] hover:text-white text-slate-500 flex items-center justify-center border border-slate-200/50 transition-all font-mono text-xs font-bold shadow-sm">git</a>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Prayog India</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── GUEST FACULTY ── */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
            <p className="text-[#FFC107] font-bold uppercase tracking-widest text-sm mb-2">Extended Network</p>
            <h2 className="text-3xl md:text-4xl font-black text-[#01254d]">Guest Faculty & Technical Experts</h2>
            <p className="text-slate-500 text-sm mt-3 max-w-xl">Seasoned industry professionals who bring real-world expertise directly into our learning ecosystem.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {facultyList.map((g, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-[#FFC107]/40 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm text-white mb-5"
                  style={{ background: "linear-gradient(135deg, #01254d, #1a3f70)" }}>
                  {g.initial}
                </div>
                <h3 className="font-bold text-[#01254d] text-base mb-1">{g.name}</h3>
                <p className="text-[#FFC107] text-xs font-semibold uppercase tracking-wider mb-3">{g.role}</p>
                <p className="text-slate-500 text-sm leading-relaxed">{g.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NATION BUILDING ── */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
            <div className="relative h-[420px] rounded-3xl overflow-hidden shadow-2xl">
              <Image src="/assets/hero-indian-2.png" alt="Nation Building" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#01254d]/30 to-transparent" />
            </div>
            <div className="absolute -bottom-5 -right-5 bg-white rounded-2xl shadow-xl p-5 border border-slate-100">
              <div className="text-3xl font-black text-[#01254d]">🇮🇳</div>
              <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-1">Atmanirbhar Bharat</div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <p className="text-[#FFC107] font-bold uppercase tracking-widest text-sm mb-4">Nation Building</p>
            <h2 className="text-4xl md:text-5xl font-black text-[#01254d] leading-tight mb-6">
              Our Contribution to India
            </h2>
            <div className="space-y-5 text-slate-655 leading-relaxed text-[15px] font-medium">
              <p>One of our proudest achievements has been contributing technical expertise and innovation capabilities toward national innovation and defence-oriented initiatives — a matter of immense pride for our entire team.</p>
              <p>At PRAYOG INDIA ROBOTICS, we believe technology and innovation must contribute toward nation-building, self-reliance, research, and developing future-ready technological ecosystems for India.</p>
            </div>
            <div className="flex gap-6 mt-8 pt-8 border-t border-slate-100">
              {["INVENT", "SECURE", "DEVELOP"].map((w, i) => (
                <div key={i} className="text-center">
                  <div className="text-[#01254d] font-black text-sm uppercase tracking-widest">{w}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-36 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/assets/indian-hero.png" alt="CTA" fill className="object-cover" />
          <div className="absolute inset-0 bg-[#01254d]/90" />
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <p className="text-[#FFC107] font-bold uppercase tracking-widest text-sm mb-4">Join The Movement</p>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
            Build the Future With Us
          </h2>
          <p className="text-white/70 text-lg leading-relaxed mb-10">
            Whether you are a student, institution, innovator, or organization — we are here to support your journey into the world of technology, innovation, and practical learning.
          </p>
          <Link href="/contact"
            className="inline-flex items-center gap-3 px-10 py-5 bg-[#FFC107] text-[#01254d] font-black text-sm uppercase tracking-wider rounded-full hover:bg-white hover:scale-105 transition-all duration-300 shadow-2xl">
            Collaborate With Us <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
