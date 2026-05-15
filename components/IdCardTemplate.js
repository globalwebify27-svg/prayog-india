import React from 'react';
import { QrCode, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

const IdCardTemplate = ({
  studentName = "Student Name",
  studentId = "STU-0000",
  courseName = "Academic Program",
  photo = null,
  validity = "2024-2025",
  qrCodeData = "https://prayogindiarobotics.com/verify",
  bloodGroup = "O+",
  emergencyContact = "+91 98765 43210",
  logoUrl = "/assets/logo.png"
}) => {
  return (
    <div id="id-card-element" className="w-[320px] h-[500px] bg-white rounded-[24px] shadow-2xl overflow-hidden font-body relative border-2 border-slate-100">
      {/* Header Pattern */}
      <div className="absolute top-0 left-0 w-full h-40 bg-navy overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-2xl"></div>
        <div className="absolute top-20 -left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>

        <div className="relative pt-6 px-6 flex flex-col items-center text-center">
          <img src={logoUrl} alt="Logo" className="h-10 brightness-200 mb-2 object-contain" />
          <h2 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Student Identity Card</h2>
          <p className="text-[8px] text-white/60 uppercase font-medium mt-1">Official Academic Credential</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative mt-28 px-6 flex flex-col items-center">
        {/* Photo Container */}
        <div className="w-32 h-32 rounded-3xl bg-white p-1.5 shadow-xl border border-slate-100 z-10">
          <div className="w-full h-full rounded-2xl bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-50">
            {photo ? (
              <img src={photo} alt={studentName} className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center text-slate-300">
                <ShieldCheck size={40} className="mb-1" />
                <span className="text-[8px] font-bold uppercase">No Image</span>
              </div>
            )}
          </div>
        </div>

        {/* Identity Info */}
        <div className="mt-4 text-center w-full">
          <h3 className="text-xl font-bold text-slate-900 leading-tight">{studentName}</h3>
          <div className="inline-block mt-1 px-3 py-1 bg-primary/10 rounded-full">
            <span className="text-[10px] font-bold text-navy uppercase tracking-wider">{courseName}</span>
          </div>
        </div>

        {/* Grid Details */}
        <div className="mt-6 w-full grid grid-cols-2 gap-4">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mb-1">Student ID</p>
            <p className="text-xs font-bold text-navy">{studentId}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mb-1">Validity</p>
            <p className="text-xs font-bold text-navy">{validity}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mb-1">Blood Group</p>
            <p className="text-xs font-bold text-navy">{bloodGroup}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mb-1">Emergency</p>
            <p className="text-xs font-bold text-navy">{emergencyContact}</p>
          </div>
        </div>

        {/* Footer with QR */}
        <div className="mt-6 w-full flex items-center justify-between border-t border-slate-100 pt-6">
          <div className="flex flex-col items-start">
            <div className="flex items-center text-[8px] text-slate-500 font-medium mb-1">
              <MapPin size={10} className="mr-1 text-primary" />
              <span>Prayog India Digital Campus</span>
            </div>
            <div className="flex items-center text-[8px] text-slate-500 font-medium">
              <ShieldCheck size={10} className="mr-1 text-emerald-500" />
              <span>Authenticated Document</span>
            </div>
          </div>

          <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-sm">
            {/* This would be a real QR code in production, for now using an icon */}
            <div className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-lg">
              <QrCode size={24} className="text-navy" />
            </div>
          </div>
        </div>
      </div>

      {/* Side Accent */}
      <div className="absolute top-0 right-0 w-2 h-full bg-primary/20"></div>
    </div>
  );
};

export default IdCardTemplate;
