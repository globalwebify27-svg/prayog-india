"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  User, ChevronDown, Search, ShoppingCart, Menu, X
} from "lucide-react";
import { useSettings } from "./SettingsContext";

export default function Header() {
  const settings = useSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Main Header - Floating Transformation */}
      <header className={`fixed w-full z-50 transition-all duration-500 ease-in-out top-0 font-body`}>
        <div className={`w-full transition-all duration-500 ${
          isScrolled 
            ? "bg-navy/95 backdrop-blur-md px-8 py-3 shadow-lg border-b border-white/10" 
            : "bg-navy px-4 md:px-12 py-5 border-b border-white/5"
        }`}>
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <img 
                src={settings?.logo_url || "/assets/logo.png"} 
                alt="Prayog India" 
                className={`transition-all duration-500 ${isScrolled ? "h-8 md:h-9" : "h-9 md:h-12"} object-contain`}
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8 text-sm font-semibold text-white/80">
              <Link href="/about" className="hover:text-primary transition-colors">About</Link>
              <Link href="/courses" className="hover:text-primary transition-colors">Programs</Link>
              <Link href="/admissions" className="hover:text-primary transition-colors">Admissions</Link>
              <Link href="/internships" className="hover:text-primary transition-colors">Internships</Link>
              <Link href="/placements" className="hover:text-primary transition-colors">Placements</Link>
              <Link href="/gallery" className="hover:text-primary transition-colors">Media</Link>
            </nav>


            {/* Right Actions */}
            <div className="flex items-center space-x-6">
              <button 
                onClick={() => alert("Institutional search initializing...")}
                className="text-white/40 hover:text-white transition-colors"
              >
                <Search size={18} />
              </button>
              
              <Link href="/login" className="text-white/60 hover:text-primary transition-colors text-xs font-bold uppercase tracking-wider hidden md:block">
                Sign In
              </Link>
              
              <Link href="/register" className="bg-primary text-navy px-6 py-2 rounded-lg font-bold hover:bg-white transition-all shadow-md text-xs whitespace-nowrap">
                Enroll Now
              </Link>

              {/* Mobile Menu Toggle */}
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden text-white">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-navy p-10 lg:hidden flex flex-col justify-center items-center space-y-8 text-xl font-bold text-white">
          <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-8 right-8 text-white/40">
            <X size={32} />
          </button>
          <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">About</Link>
          <Link href="/courses" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">Programs</Link>
          <Link href="/admissions" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">Admissions</Link>
          <Link href="/internships" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">Internships</Link>
          <Link href="/placements" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">Placements</Link>
          <Link href="/gallery" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">Media</Link>
          <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="bg-primary text-navy px-10 py-3 rounded-xl text-sm font-bold uppercase tracking-widest shadow-lg">Enroll Now</Link>
        </div>
      )}

    </>
  );
}
