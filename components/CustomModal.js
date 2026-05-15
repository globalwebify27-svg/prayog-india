"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, CheckCircle2, Info, HelpCircle } from "lucide-react";

export default function CustomModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  type = "info", // "info", "success", "warning", "error", "question"
  showConfirm = true,
  showCancel = true
}) {
  const icons = {
    info: <Info className="text-blue-500" size={24} />,
    success: <CheckCircle2 className="text-emerald-500" size={24} />,
    warning: <AlertCircle className="text-amber-500" size={24} />,
    error: <AlertCircle className="text-rose-500" size={24} />,
    question: <HelpCircle className="text-navy" size={24} />
  };

  const colors = {
    info: "bg-blue-50 border-blue-100 text-blue-600",
    success: "bg-emerald-50 border-emerald-100 text-emerald-600",
    warning: "bg-amber-50 border-amber-100 text-amber-600",
    error: "bg-rose-50 border-rose-100 text-rose-600",
    question: "bg-slate-50 border-slate-100 text-navy"
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden"
          >
            {/* Header / Icon Area */}
            <div className="p-8 pb-4 flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm border ${colors[type]}`}>
                {icons[type]}
              </div>
              <h3 className="text-xl font-black text-navy uppercase tracking-tight mb-2">
                {title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium whitespace-pre-line text-left w-full px-2">
                {description}
              </p>
            </div>

            {/* Actions */}
            <div className="p-8 pt-4 flex flex-col gap-3">
              {showConfirm && (
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] ${
                    type === 'error' ? 'bg-rose-600 text-white shadow-rose-200' :
                    type === 'success' ? 'bg-emerald-600 text-white shadow-emerald-200' :
                    'bg-navy text-white shadow-navy/20'
                  }`}
                >
                  {confirmText}
                </button>
              )}
              
              {showCancel && (
                <button
                  onClick={onClose}
                  className="w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 hover:text-navy transition-colors"
                >
                  {cancelText}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
