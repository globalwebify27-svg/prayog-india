"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyAction from "@/components/StickyAction";
import { 
  Bot, 
  Cpu, 
  Wifi, 
  Rocket, 
  Code, 
  Zap, 
  Box, 
  Lightbulb, 
  Target,
  Users,
  Award,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  HeartPulse,
  Brain,
  Microscope,
  Eye,
  Smile,
  GraduationCap,
  ArrowRight
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function OneOnOnePageContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageContent, setPageContent] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/courses").then(res => res.json()),
      fetch("/api/pages?slug=one-on-one").then(res => res.json())
    ]).then(([coursesData, pageData]) => {
      setCourses(Array.isArray(coursesData) ? coursesData.filter(c => c.is_one_to_one === 1) : []);
      if (pageData.success && pageData.data?.content) {
        setPageContent(pageData.data.content);
      }
      setLoading(false);
    }).catch(err => { console.error("Error fetching data:", err); setLoading(false); });
  }, []);

  const content = pageContent || {
    heroTitleLine1: "Master Technology with",
    heroTitleLine2: "1:1 Expert Mentorship",
    heroSubtitle: "Personalized Learning for Maximum Growth",
    heroDescription: "Experience customized learning paths tailored strictly to your child's pace and interests. Our 1:1 training ensures 100% attention, faster concept grasping, and deep practical engagement.",
    heroBadge: "Premium Personal Mentorship",
    aboutTitle: "Why Choose 1:1 Mentorship?",
    aboutDescription1: "Every student learns differently. Our 1:1 programs are designed to adapt to the individual learning style of your child, focusing on their strengths and addressing their specific challenges.",
    aboutDescription2: "With dedicated mentorship, students can explore advanced robotics, complex coding, and IoT projects without the pressure of keeping up with a batch.",
    aboutDescription3: "Personalized attention guarantees higher confidence and better understanding of core STEM concepts.",
    ctaTitle: "Transform Their Future with Dedicated Guidance",
    ctaQuote: "\"Personalized attention is the catalyst that turns curiosity into lifelong passion.\""
  };

  return (
    <main className="min-h-screen bg-slate-50 font-body">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 z-0">
          <img src={content.heroImage || "/assets/one_on_one_robotics_training.png"} alt="1:1 Robotics Training" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-navy/85"></div>
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Link href="#openings" className="px-8 py-4 bg-gold text-navy font-bold rounded-xl hover:bg-yellow-400 transition-all shadow-lg hover:shadow-gold/20 hover:-translate-y-1">
                Explore Programs
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

      {/* Introduction (The Gap) */}
      <section className="py-20 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">{content.aboutTitle}</h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                {content.aboutDescription1}
              </p>
              <div className="bg-white p-6 border-l-4 border-gold rounded-r-2xl shadow-sm mb-6">
                <p className="text-navy font-medium italic">
                  {content.aboutDescription2}
                </p>
              </div>
              <p className="text-slate-600 leading-relaxed mb-6">
                {content.aboutDescription3}
              </p>
            </div>
            
            <div className="bg-navy rounded-3xl p-10 text-white relative shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl"></div>
              <h3 className="text-2xl font-bold mb-8 text-gold">Program Focus Areas</h3>
              <p className="text-slate-300 mb-8 text-sm">Unlike regular classroom training, this program focuses entirely on the individual student’s:</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Learning Speed", "Innovation Capability",
                  "Interest Area", "Academic Goals",
                  "Technical Level", "Career Goals",
                  "Creativity", "Project Development"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Target className="w-4 h-4 text-gold" />
                    </div>
                    <span className="text-sm font-medium text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Programs Section */}
      <section className="py-20 bg-slate-50" id="openings">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">Available 1:1 Training Programs</h2>
            <p className="text-slate-600 text-lg">Explore our currently active personalized training batches and enroll today.</p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-12 h-12 border-4 border-navy border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12 text-slate-500 bg-white rounded-3xl border border-slate-100 shadow-sm">
              No training courses available at the moment. Please check back later.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map(course => (
                <div key={course.id} className="relative bg-navy border border-white/10 rounded-3xl overflow-hidden hover:shadow-[0_10px_40px_rgba(255,193,7,0.15)] hover:border-gold/30 transition-all duration-500 flex flex-col group">
                  <Link href={`/courses/${course.id}`} className="absolute inset-0 z-10" aria-label={`View details for ${course.title}`} />
                  <div className="h-56 bg-slate-800 relative overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-navy/40 group-hover:bg-transparent transition-colors z-10 duration-500"></div>
                    <img src={course.image || "/assets/logo.png"} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-4 left-4 z-20">
                      <span className="text-xs font-black px-4 py-1.5 bg-gold text-navy rounded-full shadow-[0_0_15px_rgba(255,193,7,0.5)] tracking-wide uppercase">
                        Premium 1:1 Focus
                      </span>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-grow relative pointer-events-none">
                    <div className="absolute top-0 right-8 -translate-y-1/2 bg-blue-600 w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] border-4 border-navy z-20 group-hover:scale-110 transition-transform duration-500">
                       <Zap className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-2xl text-white mb-3 line-clamp-2 group-hover:text-gold transition-colors relative z-10">{course.title}</h3>
                    <p className="text-slate-400 text-sm mb-6 line-clamp-2 relative z-10">Exclusive one-to-one mentorship with customized learning speed and dedicated project development.</p>
                    <div className="flex-grow"></div>
                    
                    <div className="flex gap-2 mb-8 text-[10px] font-bold text-slate-300 uppercase tracking-wider flex-wrap">
                       <span className="bg-white/5 px-2.5 py-1.5 rounded flex items-center gap-1.5"><Users size={12} className="text-blue-400"/> Personal Mentor</span>
                       <span className="bg-white/5 px-2.5 py-1.5 rounded flex items-center gap-1.5"><Rocket size={12} className="text-emerald-400"/> Custom Pace</span>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-white/10">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Investment</span>
                        <span className="text-2xl font-black text-gold drop-shadow-md">
                          ₹{Number(course.price).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <Link 
                        href={`/register?course=${course.id}`} 
                        className="relative z-20 pointer-events-auto px-8 py-3 bg-white text-navy font-black rounded-xl text-sm hover:bg-gold hover:scale-105 transition-all shadow-md group-hover:shadow-[0_0_20px_rgba(255,193,7,0.4)]"
                      >
                        Enroll Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* What is Our 1:1 Training Program? & Technologies Covered */}
      <section className="py-20 bg-white" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">What is Our 1:1 Training Program?</h2>
            <p className="text-slate-600 text-lg">
              An exclusive personalized learning program where one dedicated trainer works directly with one student for complete customized technical learning and innovation development.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {[
              { title: "Individual Attention", icon: Eye, color: "text-blue-500", bg: "bg-blue-50" },
              { title: "Personalized Mentorship", icon: Users, color: "text-purple-500", bg: "bg-purple-50" },
              { title: "Customized Curriculum", icon: Code, color: "text-emerald-500", bg: "bg-emerald-50" },
              { title: "Hands-On Learning", icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
              { title: "Project-Based Training", icon: Rocket, color: "text-sky-500", bg: "bg-sky-50" },
              { title: "Innovation Guidance", icon: Lightbulb, color: "text-pink-500", bg: "bg-pink-50" },
              { title: "Live Problem-Solving", icon: Brain, color: "text-indigo-500", bg: "bg-indigo-50" },
              { title: "Advanced Tech Exposure", icon: Cpu, color: "text-teal-500", bg: "bg-teal-50" },
            ].map((feature, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-100 p-6 rounded-2xl flex items-center gap-4 hover:-translate-y-1 hover:shadow-md transition-all">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${feature.bg} ${feature.color}`}>
                  <feature.icon size={24} />
                </div>
                <h4 className="font-bold text-navy text-sm">{feature.title}</h4>
              </div>
            ))}
          </div>

          <div className="bg-white p-10 md:p-16 border-y-4 border-navy relative overflow-hidden shadow-sm">
            {/* Texture: Subtle Dot Pattern instead of gradients */}
            <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
            
            <div className="text-center mb-16 relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-navy mb-6 uppercase tracking-tight">Core Curriculum</h2>
              <div className="h-1 w-24 bg-gold mx-auto mb-6"></div>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium">Focused learning modules in advanced industrial technologies.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-20 relative z-10 max-w-6xl mx-auto px-4">
              {[
                { name: "Robotics", icon: Bot },
                { name: "STEM Education", icon: GraduationCap },
                { name: "Artificial Intelligence", icon: Brain },
                { name: "Embedded Systems", icon: Cpu },
                { name: "Internet of Things", icon: Wifi },
                { name: "Drone Technology", icon: Rocket },
                { name: "Coding & Programming", icon: Code },
                { name: "Electronics & Automation", icon: Zap },
                { name: "Arduino & Raspberry Pi", icon: Box },
                { name: "ESP32 Systems", icon: Cpu },
                { name: "3D Designing", icon: Box },
                { name: "Real-Time Projects", icon: Target }
              ].map((tech, i) => (
                <div key={i} className="bg-white border border-slate-200 p-6 flex flex-col items-center justify-center text-center hover:border-navy hover:shadow-lg transition-all group rounded-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/assets/grid-pattern.svg')] opacity-0 group-hover:opacity-5 transition-opacity"></div>
                  
                  <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-navy group-hover:border-navy transition-colors relative z-10 shadow-sm">
                     <tech.icon className="w-8 h-8 text-navy group-hover:text-gold transition-colors" />
                  </div>
                  <span className="font-bold text-navy relative z-10">{tech.name}</span>
                </div>
              ))}
            </div>

            <div className="bg-navy relative z-10 shadow-xl border-l-8 border-gold p-10">
              <div className="absolute inset-0 bg-[url('/assets/grid-pattern.svg')] opacity-10"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-white mb-8 tracking-tight uppercase">Eligible Candidates</h3>
                <div className="flex flex-wrap gap-4">
                  {[
                    "School Students (Class 1–12)", "Diploma Students", "Polytechnic Students", "Engineering Students",
                    "BCA / MCA Students", "B.Sc IT Students", "Technology Enthusiasts", "Innovators"
                  ].map((audience, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white/5 px-5 py-3 border border-white/10 hover:bg-gold hover:text-navy transition-colors text-white font-bold text-sm cursor-default">
                      <div className="w-2 h-2 bg-gold"></div>
                      {audience}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>



      {/* 10 Major Benefits */}
      <section className="py-20 bg-navy text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[100px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gold">10 Major Benefits of 1:1 Personalized Training</h2>
            <p className="text-lg text-slate-300">
              Why 1:1 Training is More Powerful Than Regular Classroom Learning
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "1. 100% Personalized Attention",
                desc: "The biggest advantage. The trainer focuses entirely on one student’s understanding level, learning style, and progress, helping them learn faster and more effectively."
              },
              {
                title: "2. Customized Learning Path",
                desc: "Whether you want to learn Robotics, AI, or build projects, we customize the learning structure according to your specific goals and interests."
              },
              {
                title: "3. Faster Concept Clarity",
                desc: "Ask unlimited questions freely. Trainers explain concepts using practical demonstrations, real hardware, and interactive step-by-step guidance."
              },
              {
                title: "4. Practical Hands-On Learning",
                desc: "We believe technology must be learned practically. Students work directly with Robotics Kits, Sensors, Arduino, Drones, and 3D Printers."
              },
              {
                title: "5. Boosts Academic Performance",
                desc: "Our programs connect with school/college academics. Students improve in Science, Math, Logic, and Problem Solving through practical understanding."
              },
              {
                title: "6. Encourages Innovation & Creativity",
                desc: "Students are encouraged to think independently, explore ideas, create new concepts, and build custom projects freely."
              },
              {
                title: "7. Builds Strong Confidence",
                desc: "Overcome hesitation and build technical confidence. Present projects proudly and develop independent thinking."
              },
              {
                title: "8. Ideal for All Levels",
                desc: "Works perfectly for complete beginners, slow learners, highly creative students, or advanced technical learners seeking deep expertise."
              },
              {
                title: "9. Project-Based Learning",
                desc: "Build real projects, working models, and innovation prototypes instead of just learning theory or performing predefined tasks."
              },
              {
                title: "10. Direct Mentor Interaction",
                desc: "Get direct access to expert mentors with 10+ years of practical experience for technical guidance, career awareness, and innovation direction."
              }
            ].map((benefit, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors">
                <h3 className="text-xl font-bold text-gold mb-3">{benefit.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Parents Prefer Us & Lab Infrastructure */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Parents Section */}
            <div className="bg-white p-10 md:p-12 rounded-3xl shadow-xl border border-slate-100">
              <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mb-6">
                <HeartPulse size={32} />
              </div>
              <h2 className="text-3xl font-bold text-navy mb-6">Why Parents Prefer 1:1 Training</h2>
              <p className="text-slate-600 mb-6">
                Parents today want more than traditional tuition classes. They want their children to develop confidence, improve creativity, learn future technologies, and become innovative thinkers.
              </p>
              <h4 className="font-bold text-navy mb-4">Students Receive:</h4>
              <ul className="space-y-3 mb-8">
                {[
                  "Better Attention & Concept Clarity",
                  "Better Learning Results",
                  "Personalized Support",
                  "Safe Learning Environment",
                  "Skill Development Beyond Textbooks"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="p-4 bg-slate-50 border-l-4 border-navy rounded-r-lg">
                <p className="text-navy font-semibold">Creates long-term educational and personal growth.</p>
              </div>
            </div>

            {/* Lab & Achievements */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">Advanced Innovation Lab & Mentorship</h2>
              <p className="text-slate-600 mb-8 text-lg">
                One of our biggest strengths is our advanced practical learning infrastructure. Students explore technology practically and build innovative solutions freely using:
              </p>
              <div className="grid grid-cols-2 gap-4 mb-10">
                {[
                  "2000+ Electronics Components",
                  "Robotics Kits & Drones",
                  "Arduino, ESP32 & Pi",
                  "3D Printers & Design Tools"
                ].map((li, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-navy font-bold bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <Box className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>{li}</span>
                  </div>
                ))}
              </div>

              <h3 className="text-2xl font-bold text-navy mb-4">Learn from Award-Winning Mentors</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1"><Award className="text-gold w-6 h-6" /></div>
                  <div>
                    <h4 className="font-bold text-navy">IIT Bombay TechFest Winners</h4>
                    <p className="text-sm text-slate-500">Defeated teams from 24 countries in Robo Battle.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1"><ShieldCheck className="text-emerald-600 w-6 h-6" /></div>
                  <div>
                    <h4 className="font-bold text-navy">Indian Army Training Support</h4>
                    <p className="text-sm text-slate-500">Conducted technical training for units of the Indian Army.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1"><Lightbulb className="text-orange-500 w-6 h-6" /></div>
                  <div>
                    <h4 className="font-bold text-navy">Young Innovator & Govt Recognition</h4>
                    <p className="text-sm text-slate-500">Honored for innovation and recognized by Jharkhand Govt.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-navy relative overflow-hidden border-t-8 border-gold">
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
              Start Your Journey
              <ArrowRight className="ml-3 w-6 h-6" />
            </Link>
            <Link href="/contact" className="w-full sm:w-auto inline-flex items-center justify-center px-12 py-5 bg-transparent text-white font-black text-lg border-2 border-white hover:bg-white hover:text-navy transition-all uppercase">
              Contact Academy
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
                <h3 className="text-xl font-bold text-navy">Training Programs</h3>
                <p className="text-sm text-slate-500">Select a course to enroll</p>
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
              ) : courses.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  No training courses available at the moment.
                </div>
              ) : (
                <div className="space-y-4">
                  {courses.map(course => (
                    <div key={course.id} className="relative bg-white border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-4 hover:border-gold/50 transition-colors shadow-sm">
                      <Link href={`/courses/${course.id}`} className="absolute inset-0 z-10 rounded-2xl" aria-label={`View details for ${course.title}`} />
                      <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-slate-100 hidden sm:block relative z-10 pointer-events-none">
                        <img src={course.image || "/assets/logo.png"} alt={course.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow text-center sm:text-left relative z-10 pointer-events-none">
                        <h4 className="font-bold text-navy line-clamp-1">{course.title}</h4>
                        <div className="flex items-center justify-center sm:justify-start gap-2 mt-1 mb-2">
                          <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded">
                            1:1 Training
                          </span>
                          <span className="text-xs font-bold text-slate-600">
                            ₹{Number(course.price).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                      <Link 
                        href={`/register?course=${course.id}`} 
                        className="relative z-20 w-full sm:w-auto px-6 py-2 bg-navy text-white font-bold rounded-xl flex items-center justify-center hover:bg-gold hover:text-navy transition-all shrink-0"
                      >
                        Enroll Now
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
