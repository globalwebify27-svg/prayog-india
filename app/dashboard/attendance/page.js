"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera, 
  MapPin, 
  ShieldCheck, 
  RefreshCcw, 
  CheckCircle2, 
  Clock, 
  Scan,
  Zap,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

export default function AttendancePage() {
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [selfie, setSelfie] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    fetch("/api/student/dashboard")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.enrollments) {
          setEnrollments(data.data.enrollments);
          if (data.data.enrollments.length > 0) {
            setSelectedEnrollment(data.data.enrollments[0]);
          }
        }
      });
  }, []);

  // Initialize Geolocation
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setStep(2);
        },
        (err) => alert("Please enable location access to mark attendance.")
      );
    }
  };

  // Initialize Camera
  const startCamera = async () => {
    try {
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Camera access denied.");
    }
  };

  const captureSelfie = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);
      setSelfie(canvas.toDataURL("image/png"));
      stopCamera();
      setStep(3);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setIsCapturing(false);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitAttendance = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location,
          selfie,
          courseId: selectedEnrollment?.course_id || 1, 
          batchId: selectedEnrollment?.batch_id || 1   
        })
      });

      const data = await res.json();
      if (data.success) {
        setStep(4);
      } else {
        alert(data.message || "Failed to log attendance");
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 font-body pb-10">
      <div className="text-center md:text-left">
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Session Verification</h1>
        <p className="text-slate-500 text-sm mt-1">Multi-factor attendance logging for Prayog India hubs.</p>
      </div>

      <div className="bg-white rounded-2xl p-6 md:p-10 border border-slate-200 shadow-sm relative overflow-hidden">
        
        <AnimatePresence mode="wait">
          {/* Step 1: Geo Location */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-center py-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-6">
                <MapPin size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Location check</h3>
              <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto leading-relaxed">We need to verify that you are physically present at the institutional hub before starting the session.</p>
              
              {enrollments.length > 0 && (
                <div className="mb-8 max-w-xs mx-auto text-left">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Select Session</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm font-semibold focus:border-navy outline-none"
                    onChange={(e) => setSelectedEnrollment(enrollments[e.target.value])}
                  >
                    {enrollments.map((e, idx) => (
                      <option key={e.id} value={idx}>{e.title}</option>
                    ))}
                  </select>
                </div>
              )}

              <button onClick={getLocation} className="bg-navy text-white px-8 py-3 rounded-lg font-semibold text-sm hover:bg-black transition-all shadow-sm flex items-center justify-center mx-auto space-x-2">
                <span>Enable location services</span>
                <Zap size={16} className="text-primary" />
              </button>
            </motion.div>
          )}

          {/* Step 2: Selfie Capture */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center">
              <div className="relative w-full aspect-video bg-slate-900 rounded-xl overflow-hidden mb-6 border border-slate-200 shadow-inner">
                {!isCapturing ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button onClick={startCamera} className="bg-white text-navy px-6 py-2.5 rounded-lg font-semibold text-xs border border-slate-200 shadow-sm">Initialize camera</button>
                  </div>
                ) : (
                  <>
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    <div className="absolute inset-0 border-[15px] border-navy/10 pointer-events-none">
                      <div className="w-full h-full border-2 border-white/30 border-dashed rounded-lg flex items-center justify-center">
                        <Scan size={48} className="text-white/10" />
                      </div>
                    </div>
                  </>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Biometric verification</h3>
              <p className="text-slate-500 text-sm mb-10">Position your face within the frame and ensure good lighting.</p>
              <button onClick={captureSelfie} disabled={!isCapturing} className="bg-navy text-white px-8 py-3 rounded-lg font-semibold text-sm hover:bg-black transition-all shadow-sm mx-auto flex items-center space-x-2 disabled:opacity-50">
                <Camera size={18} />
                <span>Verify identity</span>
              </button>
            </motion.div>
          )}

          {/* Step 3: Review & Submit */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center">
              <div className="w-32 h-32 rounded-2xl border-4 border-slate-50 overflow-hidden mx-auto mb-8 shadow-md">
                <img src={selfie} alt="Selfie" className="w-full h-full object-cover" />
              </div>
              
              <div className="bg-slate-50 rounded-xl p-5 mb-10 text-left border border-slate-100 max-w-sm mx-auto">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Metadata</span>
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold">Ready</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-slate-600">
                    <MapPin size={14} className="text-navy" />
                    <span className="text-[11px] font-semibold">Coords: {location?.lat.toFixed(4)}, {location?.lng.toFixed(4)}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-600">
                    <Clock size={14} className="text-navy" />
                    <span className="text-[11px] font-semibold">Timestamp: {new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={() => setStep(2)} className="px-8 py-3 rounded-lg border border-slate-200 text-slate-500 font-semibold text-sm hover:bg-slate-50 transition-all flex items-center justify-center space-x-2">
                  <RefreshCcw size={16} />
                  <span>Retake</span>
                </button>
                <button onClick={submitAttendance} disabled={isSubmitting} className="px-8 py-3 bg-navy text-white rounded-lg font-semibold text-sm hover:bg-black transition-all shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50">
                  <CheckCircle2 size={16} />
                  <span>{isSubmitting ? "Finalizing..." : "Submit attendance"}</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
              <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-6 relative">
                <CheckCircle2 size={40} />
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }} className="absolute -top-1 -right-1 w-7 h-7 bg-navy rounded-full flex items-center justify-center text-white shadow">
                  <ShieldCheck size={14} />
                </motion.div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Attendance logged</h3>
              <p className="text-slate-500 text-sm mb-10 max-w-sm mx-auto leading-relaxed">Your presence has been securely verified and recorded. You may now proceed with your session.</p>
              <Link href="/dashboard" className="inline-flex items-center space-x-2 text-navy font-bold text-sm hover:text-primary transition-colors">
                <span>Back to dashboard</span>
                <ChevronRight size={16} />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
      
      <div className="flex items-center justify-center space-x-2 text-[10px] font-semibold text-slate-400 uppercase tracking-widest pt-4">
        <ShieldCheck size={12} />
        <span>End-to-end encrypted session tracking</span>
      </div>
    </div>
  );
}
