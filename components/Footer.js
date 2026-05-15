"use client";

import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { useSettings } from "./SettingsContext";

export default function Footer() {
  const settings = useSettings();

  return (
    <footer className="bg-navy text-white pt-20 pb-10 font-body">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <img src={settings?.logo_url || "/assets/logo.png"} alt="Prayog India" className="h-10 object-contain" />
            </Link>
            <div className="space-y-1">
              <h3 className="text-white font-bold text-xs uppercase tracking-widest">PRAYOG INDIA ROBOTICS PVT. LTD.</h3>
              <p className="text-blue-100/40 text-sm leading-relaxed font-medium">
                India's premier institutional hub for industrial robotics, AI, and hardware innovation. Empowering the next generation of engineers through technical mastery.
              </p>
            </div>
            <div className="flex items-center space-x-5 pt-2">
              <Link href={settings?.facebook_url || "#"} target="_blank" className="text-white/30 hover:text-primary transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3.61l.39-4H14V7a1 1 0 0 1 1-1h3z"/></svg>
              </Link>
              <Link href={settings?.youtube_url || "#"} target="_blank" className="text-white/30 hover:text-primary transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.14 1 12 1 12s0 3.86.42 5.58a2.78 2.78 0 0 0 1.94 2c1.71.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.86 23 12 23 12s0-3.86-.42-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
              </Link>
              <Link href={settings?.linkedin_url || "#"} target="_blank" className="text-white/30 hover:text-primary transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </Link>
              <Link href={settings?.instagram_url || "#"} target="_blank" className="text-white/30 hover:text-primary transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </Link>
            </div>
          </div>

          {/* Institutional Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-8 text-primary">Institutional</h4>
            <ul className="space-y-4 text-[13px] text-blue-100/50 font-medium">
              <li><Link href="/about" className="hover:text-white transition-colors">Our Vision</Link></li>
              <li><Link href="/faculties" className="hover:text-white transition-colors">Expert Faculty</Link></li>
              <li><Link href="/infrastructure" className="hover:text-white transition-colors">Research Labs</Link></li>
              <li><Link href="/placements" className="hover:text-white transition-colors">Career Records</Link></li>
              <li><Link href="/admissions" className="hover:text-white transition-colors">Admissions 2026</Link></li>
            </ul>
          </div>

          {/* Academic Paths */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-8 text-primary">Student Center</h4>
            <ul className="space-y-4 text-[13px] text-blue-100/50 font-medium">
              <li><Link href="/courses" className="hover:text-white transition-colors">Academic Programs</Link></li>
              <li><Link href="/internships" className="hover:text-white transition-colors">Industrial Internship</Link></li>
              <li><Link href="/scholarships" className="hover:text-white transition-colors">Scholarship Hub</Link></li>
              <li><Link href="/stories" className="hover:text-white transition-colors">Success Stories</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">Knowledge Base</Link></li>
            </ul>
          </div>

          {/* Regional Hub */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-8 text-primary">Regional Hub</h4>
            <ul className="space-y-5 text-[13px] text-blue-100/50 font-medium">
              <li className="flex items-start space-x-3">
                <MapPin size={16} className="text-primary/50 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{settings?.footer_address || "1st Floor, City Centre, Club Road, Ranchi - 834001"}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={16} className="text-primary/50 shrink-0" />
                <span>{settings?.footer_phone || "+91 7033066338"}</span>
              </li>
              <li className="flex items-start space-x-3">
                <Mail size={16} className="text-primary/50 shrink-0 mt-0.5" />
                <div className="flex flex-col space-y-1">
                  <span>{settings?.footer_email || "info@prayogindiarobotics.com"}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Bar */}
        <div className="border-t border-white/5 mt-20 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/20 space-y-4 md:space-y-0">
          <p>© {new Date().getFullYear()} PRAYOG INDIA ROBOTICS PVT. LTD. All rights reserved.</p>
          <div className="flex space-x-8">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link>
            <Link href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
