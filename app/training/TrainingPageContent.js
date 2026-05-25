"use client";

import { useState, useEffect } from "react";
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
  MonitorPlay,
  Box,
  Lightbulb,
  Microscope,
  Calculator,
  Brain,
  Target,
  Eye,
  Smile,
  Users,
  Award,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Sparkles,
  HeartPulse,
  ArrowRight
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function TrainingPageContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageContent, setPageContent] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/courses").then(res => res.json()),
      fetch("/api/pages?slug=training").then(res => res.json())
    ]).then(([coursesData, pageData]) => {
      setCourses(coursesData.filter(c => c.is_one_to_one !== 1 && c.is_internship !== 1));
      if (pageData.success && pageData.data.content) {
        setPageContent(pageData.data.content);
      }
      setLoading(false);
    }).catch(err => { console.error(err); setLoading(false); });
  }, []);

  const content = pageContent || {
    heroTitleLine1: "Robotics | STEM | AI | IoT",
    heroTitleLine2: "Drone Tech | 3D Design",
    heroSubtitle: "For Class 1–12 Students",
    heroDescription: "Education is changing rapidly. The world is moving toward Artificial Intelligence, Robotics, Automation, Smart Technologies, and Innovation-Based Learning. Today's students need much more than textbook knowledge to succeed in academics and future careers.",
    heroBadge: "Future Skills Begin Here",
    aboutTitle: "Building a Future-Focused Learning Ecosystem",
    aboutDescription1: "At PRAYOG INDIA ROBOTICS, we are building a future-focused learning ecosystem where students from Class 1 to 12 learn through practical activities, innovation projects, robotics systems, STEM education, electronics experiments, coding, AI tools, and real technology implementation.",
    aboutDescription2: "Our programs are specially designed to make learning exciting, interactive, practical, and deeply connected with school academics.",
    aboutDescription3: "Based in Ranchi, Jharkhand and expanding across India, we are helping students become confident learners, creative thinkers, and future innovators.",
    ctaTitle: "Give Your Child the Power of Future Education",
    ctaQuote: "\"We Don't Just Teach Technology — We Build Future Innovators, Thinkers & Leaders.\""
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-navy text-white">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 w-full h-[110%] -top-10 md:-top-20 z-0 opacity-40 mix-blend-luminosity">
          <img src={content.heroImage || "/assets/hero-indian-2.png"} alt="Robotics Training" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_100%)]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-sm font-medium mb-8 text-gold">
            <Sparkles className="w-4 h-4" />
            <span>{content.heroBadge}</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
            {content.heroTitleLine1} <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-yellow-300">
              {content.heroTitleLine2}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
            {content.heroSubtitle}
          </p>
          <p className="text-base md:text-lg text-slate-400 max-w-4xl mx-auto leading-relaxed mb-10">
            {content.heroDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setIsModalOpen(true)} className="px-8 py-4 bg-gold text-navy font-bold rounded-xl hover:bg-yellow-400 transition-all shadow-lg hover:shadow-gold/20 hover:-translate-y-1">Enroll Your Child Now</button>
            <Link href="#programs" className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all border border-white/10 backdrop-blur-sm">
              Explore Programs
            </Link>
          </div>
        </div>

        {/* Custom Torn Paper effect at the bottom */}
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
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">{content.aboutTitle}</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                {content.aboutDescription1}
              </p>
              <p className="text-slate-600 leading-relaxed mb-6">
                {content.aboutDescription2}
              </p>
              <p className="text-slate-600 leading-relaxed font-medium">
                {content.aboutDescription3}
              </p>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-blue-50 p-6 rounded-2xl">
                  <Lightbulb className="w-10 h-10 text-blue-600 mb-4" />
                  <h3 className="font-bold text-navy mb-2">Creativity</h3>
                  <p className="text-sm text-slate-600">Fostering out-of-the-box thinking</p>
                </div>
                <div className="bg-emerald-50 p-6 rounded-2xl">
                  <Target className="w-10 h-10 text-emerald-600 mb-4" />
                  <h3 className="font-bold text-navy mb-2">Problem-Solving</h3>
                  <p className="text-sm text-slate-600">Tackling real-world challenges</p>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="bg-purple-50 p-6 rounded-2xl">
                  <Brain className="w-10 h-10 text-purple-600 mb-4" />
                  <h3 className="font-bold text-navy mb-2">Logical Thinking</h3>
                  <p className="text-sm text-slate-600">Structured reasoning skills</p>
                </div>
                <div className="bg-amber-50 p-6 rounded-2xl">
                  <Zap className="w-10 h-10 text-amber-600 mb-4" />
                  <h3 className="font-bold text-navy mb-2">Innovation</h3>
                  <p className="text-sm text-slate-600">Practical technology exposure</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Programs Section */}
      <section className="py-20 bg-slate-50" id="openings">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">Available Training Programs</h2>
            <p className="text-slate-600 text-lg">Explore our currently active training batches and enroll today.</p>
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
                <div key={course.id} className="relative bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-xl hover:border-gold/30 transition-all flex flex-col group">
                  <Link href={`/courses/${course.id}`} className="absolute inset-0 z-10" aria-label={`View details for ${course.title}`} />
                  <div className="h-48 bg-slate-100 relative overflow-hidden pointer-events-none">
                    <img src={course.image || "/assets/logo.png"} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 left-4">
                      <span className="text-xs font-bold px-3 py-1 bg-white/90 text-navy backdrop-blur-sm rounded-full shadow-sm">
                        1:1 Training
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-bold text-xl text-navy mb-4 line-clamp-2 group-hover:text-gold transition-colors">{course.title}</h3>
                    <div className="flex-grow"></div>
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-100">
                      <span className="text-lg font-black text-slate-700">
                        ₹{Number(course.price).toLocaleString('en-IN')}
                      </span>
                      <Link
                        href={`/register?course=${course.id}`}
                        className="relative z-20 px-6 py-2 bg-navy text-white font-bold rounded-full text-sm hover:bg-gold hover:text-navy transition-colors shadow-md"
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

      {/* Programs List (Moved after available courses) */}
      <section id="programs" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-medium text-sm mb-4">
            Designed Specially for School Students (Class 1–12)
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">Technologies We Teach</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-16">
            We offer specialized courses across these cutting-edge domains, carefully structured according to age groups and learning levels so that every student can understand technology comfortably and confidently.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { icon: Microscope, title: "STEM Education", color: "text-blue-500", bg: "bg-blue-50" },
              { icon: Bot, title: "Basic Robotics", color: "text-emerald-500", bg: "bg-emerald-50" },
              { icon: Cpu, title: "Advanced Robotics", color: "text-red-500", bg: "bg-red-50" },
              { icon: Brain, title: "Artificial Intelligence", color: "text-purple-500", bg: "bg-purple-50" },
              { icon: Wifi, title: "Internet of Things", color: "text-amber-500", bg: "bg-amber-50" },
              { icon: Rocket, title: "Drone Technology", color: "text-sky-500", bg: "bg-sky-50" },
              { icon: Code, title: "Coding & Programming", color: "text-indigo-500", bg: "bg-indigo-50" },
              { icon: Zap, title: "Electronics Learning", color: "text-yellow-500", bg: "bg-yellow-50" },
              { icon: MonitorPlay, title: "Sensors & Automation", color: "text-teal-500", bg: "bg-teal-50" },
              { icon: Box, title: "3D Designing & Slicing", color: "text-orange-500", bg: "bg-orange-50" },
              { icon: Lightbulb, title: "Innovation Projects", color: "text-pink-500", bg: "bg-pink-50" },
            ].map((prog, idx) => (
              <div key={idx} className="group p-6 rounded-2xl border border-slate-100 hover:border-gold/30 hover:shadow-xl transition-all duration-300 bg-white hover:-translate-y-1 text-center flex flex-col items-center">
                <div className={`w-16 h-16 mx-auto rounded-full ${prog.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <prog.icon className={`w-8 h-8 ${prog.color}`} />
                </div>
                <h3 className="font-bold text-navy">{prog.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 15 Powerful Ways */}
      <section className="py-20 bg-navy text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">How Programs Improve Academics</h2>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto">
              "Will Robotics & STEM Education really help my child in studies?" The answer is absolutely <strong>YES</strong>.
              Here are 15 powerful ways we help your child academically & personally.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Science Becomes Practical", desc: "Electricity, motion, force, energy, magnetism made easy through real robotics models and circuits.", icon: Microscope },
              { title: "Mathematics Becomes Interesting", desc: "Using math practically for measurements, angles, and calculations in robotics.", icon: Calculator },
              { title: "Improves Logical Thinking", desc: "Trains students to think step-by-step and solve challenges intelligently.", icon: Brain },
              { title: "Strong Problem-Solving", desc: "Creates independent thinkers who can identify problems and build solutions.", icon: Target },
              { title: "Increases Focus", desc: "Exciting interactive activities improve attention span and concentration.", icon: Eye },
              { title: "Reduces Fear of Math & Science", desc: "Makes complex subjects simple, visual, practical, and fun.", icon: Smile },
              { title: "Boosts Creativity", desc: "Encourages students to build new ideas and design innovation projects.", icon: Lightbulb },
              { title: "Improves Communication", desc: "Group activities and project demonstrations build confidence and leadership.", icon: Users },
              { title: "Early Exposure to Future Tech", desc: "Huge advantage by learning AI, IoT, Automation, and Drones early.", icon: Rocket },
              { title: "Smart Learning, No Rote", desc: "Creates deep understanding rather than temporary memorization.", icon: CheckCircle2 },
              { title: "Develops Tech Confidence", desc: "Working directly with hardware helps students become future-ready.", icon: Cpu },
              { title: "Discovers Hidden Talents", desc: "Helps identify natural strengths in logic, creativity, or building.", icon: Sparkles },
              { title: "Productive Screen Time", desc: "Turns students from passive consumers to active technology creators.", icon: MonitorPlay },
              { title: "Prepares for Future Careers", desc: "Early exposure gives a long-term advantage in higher education.", icon: Award },
              { title: "Makes Learning Enjoyable", desc: "Keeps students excited, motivated, and curious to learn more every day.", icon: HeartPulse }
            ].map((item, idx) => {
              const Icon = item.icon || Bot;
              return (
                <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="bg-gold/20 p-3 rounded-xl text-gold shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">{idx + 1}. {item.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Advanced Lab & Achievements */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Lab Image/Content */}
            <div>
              <div className="bg-blue-100 text-blue-800 text-sm font-bold px-4 py-2 rounded-full inline-block mb-4">
                Advanced Infrastructure
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">Advanced Robotics & Innovation Lab</h2>
              <p className="text-slate-600 mb-8 text-lg">
                Students are free to explore, experiment, create, and innovate using real hardware systems in our practical technology infrastructure.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  "2000+ Electronics Components",
                  "Arduino, ESP32, NodeMCU, Raspberry Pi",
                  "IoT Accessories & Smart Devices",
                  "Drone Systems & 3D Printers"
                ].map((li, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>{li}</span>
                  </li>
                ))}
              </ul>
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <Award className="w-10 h-10 text-gold" />
                  <h3 className="font-bold text-navy text-xl">National-Level Experts</h3>
                </div>
                <p className="text-slate-600 text-sm">
                  Our mentors have 10+ years of experience. We proudly won the IIT Bombay TechFest Robo Battle (defeating 24 countries), trained Indian Army units, and received the Young Innovator Award.
                </p>
              </div>
            </div>

            {/* Why Parents Trust */}
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100">
              <h3 className="text-2xl font-bold text-navy mb-6 text-center">Why Parents Trust Us</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Academic Improvement",
                  "Practical Learning",
                  "Future Skill Development",
                  "Creativity Enhancement",
                  "Innovation-Based Education",
                  "Confidence Building",
                  "Safe Learning Environment",
                  "Real Technology Exposure"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <ShieldCheck className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-semibold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-gold/10 rounded-2xl border border-gold/20 text-center">
                <MapPin className="w-8 h-8 text-gold mx-auto mb-3" />
                <h4 className="font-bold text-navy mb-2">Available Across India</h4>
                <p className="text-sm text-slate-600">
                  Classes, Camps, and Workshops available in Ranchi, Jharkhand, and schools nationwide.
                </p>
              </div>
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

          <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight tracking-tight text-white uppercase">
            {content.ctaTitle.split(' ').map((word, i, arr) => 
              i >= arr.length - 2 ? <span key={i} className="text-gold">{word} </span> : word + ' '
            )}
          </h2>

          <div className="h-1 w-32 bg-white/20 mx-auto mb-8"></div>

          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto font-medium italic">
            {content.ctaQuote}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto inline-flex items-center justify-center px-12 py-5 bg-gold text-navy font-black text-lg hover:bg-yellow-400 transition-all shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none group uppercase">
              Enroll Now
              <ArrowRight className="ml-3 w-6 h-6" />
            </button>
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
                        <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
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
