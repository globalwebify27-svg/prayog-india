"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  ChevronRight, 
  CheckCircle2, 
  MapPin, 
  Building2, 
  Calendar,
  Zap,
  ShieldCheck,
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  Bot,
  Cpu,
  Wifi,
  Rocket,
  Box,
  Microscope,
  Lightbulb,
  Award,
  Users,
  Target
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyAction from "@/components/StickyAction";
import Link from "next/link";

export default function InternshipsPage() {
  const [internships, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pageContent, setPageContent] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('/api/courses').then(res => res.json()),
      fetch('/api/pages?slug=internships').then(res => res.json())
    ]).then(([coursesData, pageData]) => {
      setCourses(Array.isArray(coursesData) ? coursesData.filter(c => c.is_internship === 1) : []);
      if (pageData.success && pageData.data?.content) {
        setPageContent(pageData.data.content);
      }
      setLoading(false);
    }).catch(err => { console.error("Error fetching data:", err); setLoading(false); });
  }, []);

  const content = pageContent || {
    heroTitleLine1: "Industrial Internships &",
    heroTitleLine2: "Real-World Projects",
    heroSubtitle: "Bridge the gap between Academic & Industry",
    heroDescription: "Step into the real world of technology with our intensive internship programs. Work on live projects, gain hands-on experience with cutting-edge tools, and build a resume that stands out to top employers.",
    heroBadge: "Career-Defining Experience",
    aboutTitle: "Gain True Industrial Exposure",
    aboutDescription1: "Our internships provide students and graduates with the rare opportunity to work on actual industry problems. You aren't just learning theory; you are applying it to build real solutions.",
    aboutDescription2: "Under the guidance of industry veterans, interns will tackle projects in AI, Robotics, Web Development, and IoT.",
    aboutDescription3: "By the end of the program, interns will have a portfolio of working projects, a deep understanding of professional workflows, and an official experience certificate.",
    ctaTitle: "Start Your Professional Journey Today",
    ctaQuote: "\"Experience is the bridge between textbook knowledge and professional success.\""
  };

  return (
    <main className="min-h-screen bg-slate-50 font-body">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 z-0 opacity-30 mix-blend-overlay">
          <img src={content.heroImage || "/assets/internship.png"} alt="Internship Training" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_100%)]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-sm font-bold mb-8 text-gold shadow-lg shadow-gold/10">
              <Sparkles className="w-4 h-4" />
              <span className="tracking-widest uppercase text-xs">{content.heroBadge}</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight leading-tight">
              {content.heroTitleLine1} <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-300 to-amber-200 drop-shadow-sm">
                {content.heroTitleLine2}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 mb-8 max-w-3xl mx-auto font-medium">
              {content.heroSubtitle}
            </p>
            <p className="text-base md:text-lg text-slate-300 max-w-4xl mx-auto leading-relaxed mb-12">
              {content.heroDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#openings" className="px-8 py-4 bg-gold text-navy font-bold rounded-xl hover:bg-yellow-400 transition-all shadow-lg hover:shadow-gold/20 hover:-translate-y-1">
                View Open Internships
              </Link>
            </div>
          </motion.div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg className="relative block w-full h-[50px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.06,130.83,120.22,192.39,105.44Z" className="fill-slate-50"></path>
          </svg>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-20 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-blue-100">
                <Target size={14} /> Career Accelerator
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-8 leading-tight">{content.aboutTitle}</h2>
              <div className="space-y-6">
                <p className="text-slate-600 leading-relaxed text-lg border-l-4 border-gold pl-4 bg-slate-50 p-4 rounded-r-2xl">
                  {content.aboutDescription1}
                </p>
                <p className="text-slate-600 leading-relaxed">
                  {content.aboutDescription2}
                </p>
                <p className="text-slate-700 leading-relaxed font-semibold flex items-start gap-3 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                  {content.aboutDescription3}
                </p>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="bg-navy rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl"></div>
                <h3 className="text-2xl font-bold mb-6 text-gold">Why We Are Different</h3>
                <p className="text-slate-300 mb-6 text-sm leading-relaxed">
                  Most students learn technology only through books and theory. However, industries demand practical problem-solving, technical creativity, and implementation skills. Our focus is <strong>"Learning by Building"</strong>. Students work directly with:
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    "Real Robotics Systems", "Embedded Dev Boards",
                    "IoT Devices", "Drones & UAV Systems",
                    "Sensors & Actuators", "Automation Projects",
                    "3D Printers", "Electronics Components",
                    "Industrial Tools", "AI & Smart Systems"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-slate-200">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Active Openings / Dynamic Feed */}
      <section id="openings" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">Active Internship Openings</h2>
            <p className="text-slate-600 text-lg">Explore and apply for our current hands-on internship opportunities.</p>
          </div>

          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="w-12 h-12 border-4 border-navy border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : internships.length === 0 ? (
              <div className="text-center py-12 text-slate-500 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <Briefcase size={40} className="text-slate-200 mx-auto mb-4" />
                <p className="font-medium">No active internship openings at the moment. Please check back later.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {internships.map(course => (
                  <div key={course.id} className="relative bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-xl hover:border-gold/30 transition-all flex flex-col group">
                    <Link href={`/courses/${course.id}`} className="absolute inset-0 z-10" aria-label={`View details for ${course.title}`} />
                    <div className="h-48 bg-slate-100 relative overflow-hidden pointer-events-none">
                      <img src={course.image || "/assets/logo.png"} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-4 left-4">
                        <span className="text-xs font-bold px-3 py-1 bg-white/90 text-navy backdrop-blur-sm rounded-full shadow-sm">
                          Internship
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="font-bold text-xl text-navy mb-4 line-clamp-2 group-hover:text-gold transition-colors">{course.title}</h3>
                      <div className="flex-grow"></div>
                      <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100">
                        <span className="text-lg font-black text-slate-700">
                          {Number(course.price) > 0 ? `₹${Number(course.price).toLocaleString('en-IN')}` : 'Stipend Based'}
                        </span>
                        <Link
                          href={`/courses/${course.id}`}
                          className="relative z-20 px-6 py-2 bg-navy text-white font-bold rounded-full text-sm hover:bg-gold hover:text-navy transition-colors shadow-md"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Programs Offered */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">Internship Programs We Offer</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Students are encouraged to innovate, experiment, design, test, troubleshoot, and develop practical technology projects under expert guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Robotics */}
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 hover:shadow-xl hover:border-gold/30 transition-all group">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Bot size={28} />
              </div>
              <h3 className="text-xl font-bold text-navy mb-3">Robotics Internship</h3>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                Designed for students who want practical exposure in robotics engineering, automation systems, embedded robotics, and intelligent machine development.
              </p>
              <h4 className="font-bold text-navy text-sm mb-3">Projects Include:</h4>
              <ul className="space-y-2 text-sm text-slate-500 mb-6">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gold rounded-full"></div> Line Follower & Obstacle Avoiding Robots</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gold rounded-full"></div> BT App Controlled & Smart Automation</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gold rounded-full"></div> IoT-Based Surveillance Robotics</li>
              </ul>
            </div>

            {/* Embedded */}
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 hover:shadow-xl hover:border-gold/30 transition-all group">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Cpu size={28} />
              </div>
              <h3 className="text-xl font-bold text-navy mb-3">Embedded Systems</h3>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                Learn embedded technology through real hardware implementation. Hands-on exposure to embedded programming, electronics, and hardware interfacing.
              </p>
              <h4 className="font-bold text-navy text-sm mb-3">Students Learn:</h4>
              <ul className="space-y-2 text-sm text-slate-500 mb-6">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gold rounded-full"></div> Embedded C, Arduino, ESP32, NodeMCU</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gold rounded-full"></div> Raspberry Pi, GPIO & Sensor Interfacing</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gold rounded-full"></div> PCB Concepts & Electronics Design</li>
              </ul>
            </div>

            {/* IoT */}
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 hover:shadow-xl hover:border-gold/30 transition-all group">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Wifi size={28} />
              </div>
              <h3 className="text-xl font-bold text-navy mb-3">IoT Internship</h3>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                Build Smart Connected Systems. Focuses on practical smart technology development and connected device communication.
              </p>
              <h4 className="font-bold text-navy text-sm mb-3">Projects Include:</h4>
              <ul className="space-y-2 text-sm text-slate-500 mb-6">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gold rounded-full"></div> Smart Home Automation</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gold rounded-full"></div> IoT Weather & Security Monitoring</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gold rounded-full"></div> Industrial IoT & Smart Agriculture</li>
              </ul>
            </div>

            {/* Drone */}
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 hover:shadow-xl hover:border-gold/30 transition-all group">
              <div className="w-14 h-14 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Rocket size={28} />
              </div>
              <h3 className="text-xl font-bold text-navy mb-3">Drone Technology</h3>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                Explore the Future of UAV & Drone Engineering. Provides practical exposure to drone systems, assembly, and UAV engineering concepts.
              </p>
              <h4 className="font-bold text-navy text-sm mb-3">Practical Exposure:</h4>
              <ul className="space-y-2 text-sm text-slate-500 mb-6">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gold rounded-full"></div> Drone Hardware & Propulsion Systems</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gold rounded-full"></div> Flight Setup, Controllers & Calibration</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gold rounded-full"></div> FPV Technology & Troubleshooting</li>
              </ul>
            </div>

            {/* 3D Design */}
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 hover:shadow-xl hover:border-gold/30 transition-all group">
              <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Box size={28} />
              </div>
              <h3 className="text-xl font-bold text-navy mb-3">3D Designs & Slicing</h3>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                Convert Creative Ideas into Real Physical Prototypes. For students interested in innovation, manufacturing, and prototyping.
              </p>
              <h4 className="font-bold text-navy text-sm mb-3">Modules Include:</h4>
              <ul className="space-y-2 text-sm text-slate-500 mb-6">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gold rounded-full"></div> 3D Modeling & CAD Designing</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gold rounded-full"></div> 3D Printer Handling & Slicing Software</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gold rounded-full"></div> Product Design & Visualization</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Lab and Infrastructure */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Lab Image/Content */}
            <div>
              <div className="bg-blue-100 text-blue-800 text-sm font-bold px-4 py-2 rounded-full inline-block mb-4">
                Advanced Lab & Ecosystem
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">Advanced Practical Lab & Innovation Ecosystem</h2>
              <p className="text-slate-600 mb-8 text-lg">
                One of our biggest strengths is our advanced practical learning infrastructure. Students are free to use equipment and experiment with innovative ideas under mentor guidance.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  "2000+ Electronics Components",
                  "Advanced Sensors & Actuators",
                  "Arduino & Embedded Boards",
                  "ESP32, NodeMCU & Pi",
                  "IoT Devices & Modules",
                  "Drone & UAV Systems",
                  "3D Printers & Prototyping",
                  "Electronics Testing Tools"
                ].map((li, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-slate-700 font-medium bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{li}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Who Can Join */}
            <div className="bg-navy p-8 md:p-12 rounded-3xl shadow-xl text-white relative overflow-hidden">
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-gold/10 rounded-full blur-3xl"></div>
              <h3 className="text-2xl font-bold mb-6">Who Can Join?</h3>
              <p className="text-slate-300 text-sm mb-6">
                Whether you are a beginner or already have technical knowledge, our structured practical learning model helps students improve skills step-by-step.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Diploma & Polytechnic",
                  "B.Tech & Final Year Students",
                  "BCA & MCA Students",
                  "B.Sc IT Students",
                  "Electronics & CS Students",
                  "Technology Enthusiasts"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/5">
                    <Users className="w-4 h-4 text-gold shrink-0" />
                    <span className="text-sm font-semibold text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Achievements and Experts */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">Learn from Expert Trainers</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Our internship programs are guided by experienced engineers, robotics experts, embedded developers, drone mentors, and innovation professionals with over 10 years of practical experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center hover:-translate-y-1 transition-transform">
              <div className="w-16 h-16 bg-gold/20 text-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <Award size={32} />
              </div>
              <h4 className="font-bold text-navy mb-2">TechFest Winners</h4>
              <p className="text-sm text-slate-500">Won the IIT Bombay TechFest Robo Battle defeating teams from 24 countries.</p>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center hover:-translate-y-1 transition-transform">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck size={32} />
              </div>
              <h4 className="font-bold text-navy mb-2">Indian Army Training</h4>
              <p className="text-sm text-slate-500">Provided technical training support to various units of the Indian Army.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center hover:-translate-y-1 transition-transform">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb size={32} />
              </div>
              <h4 className="font-bold text-navy mb-2">Young Innovator Award</h4>
              <p className="text-sm text-slate-500">Honored with the prestigious award for innovation in science & technology.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center hover:-translate-y-1 transition-transform">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 size={32} />
              </div>
              <h4 className="font-bold text-navy mb-2">Govt. Recognition</h4>
              <p className="text-sm text-slate-500">Developed sanitizing machines recognized by the Jharkhand Govt during COVID-19.</p>
            </div>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-16 bg-navy relative overflow-hidden border-t-8 border-gold">
        {/* Texture: Grid pattern */}
        <div className="absolute inset-0 bg-[url('/assets/grid-pattern.svg')] opacity-20"></div>
        <div className="absolute right-0 top-0 h-full w-1/2 bg-white/5 skew-x-12 translate-x-32"></div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center px-4">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-gold text-navy text-sm font-black mb-8 uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
            <Rocket className="w-4 h-4" />
            <span>Admissions Open</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight tracking-tight text-white uppercase drop-shadow-lg">
            {content.ctaTitle.split(' ').map((word, i, arr) => 
              i >= arr.length - 2 ? <span key={i} className="text-gold">{word} </span> : word + ' '
            )}
          </h2>

          <div className="h-1.5 w-32 bg-gold mx-auto mb-8 rounded-full shadow-[0_0_15px_rgba(255,193,7,0.5)]"></div>

          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto font-medium italic drop-shadow-md">
            {content.ctaQuote}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="#openings" className="w-full sm:w-auto inline-flex items-center justify-center px-12 py-5 bg-gold text-navy font-black text-lg hover:bg-yellow-400 transition-all shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none group uppercase">
              Enroll for Internship
              <ArrowRight className="ml-3 w-6 h-6" />
            </Link>
            <Link href="/contact" className="w-full sm:w-auto inline-flex items-center justify-center px-12 py-5 bg-transparent text-white font-black text-lg border-2 border-white hover:bg-white hover:text-navy transition-all uppercase">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <StickyAction />

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden shadow-2xl relative">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-xl font-bold text-navy">Internship Openings</h3>
                <p className="text-sm text-slate-500">Select an internship to view details</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-grow bg-slate-50/50">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="w-10 h-10 border-4 border-navy border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : internships.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  No active internship openings at the moment.
                </div>
              ) : (
                <div className="space-y-4">
                  {internships.map(job => (
                    <div key={job.id} className="relative bg-white border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-4 hover:border-gold/50 transition-colors shadow-sm">
                      <Link href={`/courses/${job.id}`} className="absolute inset-0 z-10 rounded-2xl" aria-label={`View details for ${job.title}`} />
                      <div className="flex-grow text-center sm:text-left relative z-10 pointer-events-none">
                        <h4 className="font-bold text-navy line-clamp-1">{job.title}</h4>
                        <div className="flex items-center justify-center sm:justify-start gap-2 mt-1 mb-2">
                          <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded">
                            {job.company || "Prayog India"}
                          </span>
                          {job.location && (
                            <span className="text-xs font-bold text-slate-600">
                              {job.location}
                            </span>
                          )}
                        </div>
                      </div>
                      <Link 
                        href={`/courses/${job.id}`} 
                        className="relative z-20 w-full sm:w-auto px-6 py-2 bg-navy text-white font-bold rounded-xl flex items-center justify-center hover:bg-gold hover:text-navy transition-all shrink-0"
                      >
                        View Details
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
