"use client";

import { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "What is the age group for your robotics workshops?",
    answer: "We have specialized modules for students aged 7 to 18 years, as well as advanced engineering-level workshops for college students and professionals."
  },
  {
    question: "Do students get a certificate after completion?",
    answer: "Yes, every student receives an industry-recognized certificate from Prayog India upon successful completion of the workshop and final project."
  },
  {
    question: "Are the workshops hands-on or theoretical?",
    answer: "Our curriculum is 100% hands-on. We believe in 'Learning by Doing', where students build actual robots and program them using professional tools."
  },
  {
    question: "Do I need to bring my own laptop or robot kit?",
    answer: "We provide all the necessary industrial-grade robotic kits and equipment. However, carrying a personal laptop is mandatory for programming the robots and coding exercises."
  },
  {
    question: "Can these workshops help in school/college projects?",
    answer: "Absolutely. Our mentors provide guidance for academic projects, science fairs, and international robotics competitions."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left Side - Content */}
          <div className="lg:w-1/3">
            <div className="sticky top-32">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <HelpCircle size={24} />
              </div>
              <h4 className="text-navy font-bold uppercase tracking-widest text-[10px] md:text-xs mb-3">FAQ Section</h4>
              <h2 className="text-2xl md:text-5xl font-heading font-bold text-slate-900 mb-6 leading-tight">
                Frequently Asked <span className="text-navy">Questions</span>
              </h2>
              <p className="text-slate-500 mb-8 leading-relaxed text-sm md:text-base">
                Everything you need to know about our workshops, certifications, and learning methodology.
              </p>
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                <p className="text-sm font-bold text-slate-900 mb-2">Still have questions?</p>
                <p className="text-xs text-slate-500 mb-4">Our support team is here to help you 24/7.</p>
                <button className="text-navy font-bold text-xs uppercase tracking-widest hover:text-primary transition-colors">
                  Contact Support &rarr;
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Accordions */}
          <div className="lg:w-2/3 space-y-4">
            {faqs.map((faq, i) => (
              <div 
                key={i} 
                className={`group rounded-3xl transition-all duration-500 border ${
                  openIndex === i ? "bg-white border-primary shadow-xl shadow-primary/5" : "bg-slate-50 border-slate-100 hover:border-slate-200"
                }`}
              >
                <button 
                  onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left"
                >
                  <span className={`text-sm md:text-lg font-heading font-bold transition-colors ${
                    openIndex === i ? "text-navy" : "text-slate-700 group-hover:text-navy"
                  }`}>
                    {faq.question}
                  </span>
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                    openIndex === i ? "bg-primary text-secondary rotate-180" : "bg-white text-slate-400 group-hover:bg-slate-200"
                  }`}>
                    {openIndex === i ? <Minus size={18} /> : <Plus size={18} />}
                  </div>
                </button>
                
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-8 pt-2">
                        <div className="w-full h-px bg-slate-100 mb-6" />
                        <p className="text-slate-500 leading-relaxed text-xs md:text-base">
                          {faq.answer}
                        </p>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
