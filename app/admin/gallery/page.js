"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Image as ImageIcon, MapPin, Tag } from "lucide-react";

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newImage, setNewImage] = useState({
    title: "",
    category: "Robotics",
    image_url: "",
    location: ""
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    const res = await fetch("/api/gallery?category=All");
    const data = await res.json();
    setImages(data);
    setLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newImage)
    });
    const data = await res.json();
    if (data.success) {
      setShowAddModal(false);
      setNewImage({ title: "", category: "Robotics", image_url: "", location: "" });
      fetchImages();
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this image from gallery?")) {
      const res = await fetch(`/api/gallery?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchImages();
    }
  };

  return (
    <div className="space-y-8 font-body">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Media Archive</h1>
          <p className="text-slate-500 text-sm mt-1">Manage institutional photos, workshop captures, and event highlights.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-navy text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-black transition-all shadow-md"
        >
          <Plus size={18} />
          <span>Upload Image</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {images.map((img) => (
          <motion.div 
            key={img.id}
            layout
            className="group relative aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-200"
          >
            <img src={img.image_url} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
              <div className="flex justify-end">
                <button onClick={() => handleDelete(img.id)} className="p-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="text-white">
                <p className="text-[10px] font-bold truncate">{img.title}</p>
                <p className="text-[8px] opacity-70 flex items-center gap-1 uppercase tracking-widest mt-1">
                  <Tag size={8} /> {img.category}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900">Add Image to Gallery</h3>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
               <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Image Title</label>
                  <input required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none" value={newImage.title} onChange={e => setNewImage({...newImage, title: e.target.value})} />
               </div>
               <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Category</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none cursor-pointer" value={newImage.category} onChange={e => setNewImage({...newImage, category: e.target.value})}>
                    <option>Robotics</option>
                    <option>AI Workshops</option>
                    <option>Drone Labs</option>
                    <option>IoT Projects</option>
                    <option>Institution</option>
                  </select>
               </div>
               <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Image URL</label>
                  <input required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none" placeholder="https://..." value={newImage.image_url} onChange={e => setNewImage({...newImage, image_url: e.target.value})} />
               </div>
               <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Location</label>
                  <input className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none" value={newImage.location} onChange={e => setNewImage({...newImage, location: e.target.value})} />
               </div>
               <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2 text-xs font-bold text-slate-500">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-navy text-white rounded-lg text-xs font-bold">Upload to Gallery</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
