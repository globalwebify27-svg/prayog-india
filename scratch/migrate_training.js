const fs = require('fs');

const pageContent = fs.readFileSync('app/training/page.js', 'utf-8');

// We want to create app/training/TrainingPageContent.js
let clientContent = `"use client";

import { useState, useEffect } from "react";
` + pageContent.replace(/export const metadata = \{[\s\S]*?\};\n\n/, '')
               .replace(/export default function TrainingPage\(\) \{/, 'export default function TrainingPageContent() {\n  const [isModalOpen, setIsModalOpen] = useState(false);\n  const [courses, setCourses] = useState([]);\n  const [loading, setLoading] = useState(false);\n\n  useEffect(() => {\n    if (isModalOpen && courses.length === 0) {\n      setLoading(true);\n      fetch("/api/courses").then(res => res.json()).then(data => {\n        setCourses(data.filter(c => c.is_one_to_one === 1));\n        setLoading(false);\n      }).catch(err => { console.error(err); setLoading(false); });\n    }\n  }, [isModalOpen, courses.length]);\n');

// Add the modal to the bottom just before </main>
const modalCode = `
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
                    <div key={course.id} className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-4 hover:border-gold/50 transition-colors shadow-sm">
                      <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-slate-100 hidden sm:block">
                        <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow text-center sm:text-left">
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
                        href={\`/register?course=\${course.id}\`} 
                        className="w-full sm:w-auto px-6 py-2 bg-navy text-white font-bold rounded-xl flex items-center justify-center hover:bg-gold hover:text-navy transition-all shrink-0"
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
    </main>`;

clientContent = clientContent.replace('    </main>', modalCode);

// Replace "Enroll Your Child Now" Link with button
clientContent = clientContent.replace(
  /<Link href="\/contact" className="px-8 py-4 bg-gold text-navy font-bold rounded-xl hover:bg-yellow-400 transition-all shadow-lg hover:shadow-gold\/20 hover:-translate-y-1">\s*Enroll Your Child Now\s*<\/Link>/,
  '<button onClick={() => setIsModalOpen(true)} className="px-8 py-4 bg-gold text-navy font-bold rounded-xl hover:bg-yellow-400 transition-all shadow-lg hover:shadow-gold/20 hover:-translate-y-1">Enroll Your Child Now</button>'
);

// Replace Program cards div with button
clientContent = clientContent.replace(
  /<div key=\{idx\} className="group p-6 rounded-2xl border border-slate-100 hover:border-gold\/30 hover:shadow-xl transition-all duration-300 bg-white hover:-translate-y-1">/g,
  '<button key={idx} onClick={() => setIsModalOpen(true)} className="group p-6 rounded-2xl border border-slate-100 hover:border-gold/30 hover:shadow-xl transition-all duration-300 bg-white hover:-translate-y-1 text-left w-full flex flex-col items-center">'
);
clientContent = clientContent.replace(
  /<\/div>\s*\}\)\)/g,
  '</button>\n            ))'
);

// Replace CTA "Book a Demo Class Today" Link with button
clientContent = clientContent.replace(
  /<Link href="\/contact" className="inline-block px-10 py-5 bg-gold text-navy font-bold text-lg rounded-full hover:bg-yellow-400 transition-all shadow-xl hover:shadow-gold\/30 hover:-translate-y-1">\s*Book a Demo Class Today\s*<\/Link>/,
  '<button onClick={() => setIsModalOpen(true)} className="inline-block px-10 py-5 bg-gold text-navy font-bold text-lg rounded-full hover:bg-yellow-400 transition-all shadow-xl hover:shadow-gold/30 hover:-translate-y-1">Book a Demo Class Today</button>'
);

fs.writeFileSync('app/training/TrainingPageContent.js', clientContent);

// Now recreate app/training/page.js
const serverContent = `import TrainingPageContent from "./TrainingPageContent";

export const metadata = {
  title: "Training Programs | Robotics & STEM Education | Prayog India",
  description: "Future-focused learning ecosystem for Class 1 to 12. STEM, AI, IoT, Robotics, Drone Technology, and Coding practical activities.",
};

export default function TrainingPage() {
  return <TrainingPageContent />;
}
`;
fs.writeFileSync('app/training/page.js', serverContent);

console.log("Migration complete!");
