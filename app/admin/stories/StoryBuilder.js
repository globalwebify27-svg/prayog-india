"use client";

import { useState } from "react";
import { 
  Type, 
  Image as ImageIcon, 
  Video, 
  Quote, 
  Layout, 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown,
  Link as LinkIcon,
  Save,
  Eye,
  X,
  PlusCircle,
  FileText
} from "lucide-react";
import { motion, Reorder, AnimatePresence } from "framer-motion";

export default function StoryBuilder({ initialData, onSave, isSaving }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail || "");
  const [banner, setBanner] = useState(initialData?.banner_image || "");
  const [category, setCategory] = useState(initialData?.category || "Industrial");
  const [author, setAuthor] = useState(initialData?.author || "Prayog India Labs");
  const [content, setContent] = useState(initialData?.content || []);

  const addSection = (type) => {
    const newSection = {
      type,
      title: type === 'text' ? 'New Section' : '',
      value: type === 'gallery' ? [] : '',
      caption: '',
      author: ''
    };
    setContent([...content, newSection]);
  };

  const removeSection = (index) => {
    setContent(content.filter((_, i) => i !== index));
  };

  const updateSection = (index, field, value) => {
    const newContent = [...content];
    newContent[index][field] = value;
    setContent(newContent);
  };

  const moveSection = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === content.length - 1) return;
    const newContent = [...content];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newContent[index], newContent[targetIndex]] = [newContent[targetIndex], newContent[index]];
    setContent(newContent);
  };

  const handleSave = () => {
    onSave({
      title,
      slug,
      excerpt,
      thumbnail,
      banner_image: banner,
      category,
      author,
      content
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1 font-display">
            {initialData ? 'Edit Narrative' : 'New Narrative'}
          </h1>
          <p className="text-slate-500 text-sm font-medium">Drafting institutional success case study.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-50 transition-all uppercase tracking-widest">
            <Eye size={16} /> Preview
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3 bg-navy text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-all shadow-xl shadow-navy/10 uppercase tracking-widest disabled:opacity-50"
          >
            <Save size={16} /> {isSaving ? 'Syncing...' : 'Save Narrative'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Main Editor */}
        <div className="lg:col-span-8 space-y-8">
          {/* Metadata Section */}
          <div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-sm space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Main Narrative Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a compelling title..."
                className="w-full text-4xl font-bold text-navy placeholder:text-slate-200 focus:outline-none bg-transparent"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-slate-50">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Unique URL Slug</label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input 
                    type="text" 
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e-learning-transformation"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-navy/5"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Category / Vertical</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:outline-none"
                >
                  <option>Industrial</option>
                  <option>Academic</option>
                  <option>Laboratory</option>
                  <option>Community</option>
                  <option>Government</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Narrative Abstract / Excerpt</label>
              <textarea 
                rows="3"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief summary of the success story..."
                className="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium leading-relaxed focus:outline-none italic text-slate-600"
              />
            </div>
          </div>

          {/* Dynamic Sections Area */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4 ml-1">
              <Layout size={14} /> Story Components
            </h3>
            
            <div className="space-y-6">
              {content.map((section, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[2rem] border border-slate-100 shadow-sm relative group/section"
                >
                  {/* Actions Header */}
                  <div className="px-8 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between rounded-t-[2rem]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center text-white">
                        {section.type === 'text' && <Type size={14} />}
                        {section.type === 'image' && <ImageIcon size={14} />}
                        {section.type === 'video' && <Video size={14} />}
                        {section.type === 'quote' && <Quote size={14} />}
                        {section.type === 'gallery' && <Layout size={14} />}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        Component {idx + 1}: {section.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => moveSection(idx, 'up')} className="p-2 text-slate-400 hover:text-navy transition-colors"><MoveUp size={14} /></button>
                      <button onClick={() => moveSection(idx, 'down')} className="p-2 text-slate-400 hover:text-navy transition-colors"><MoveDown size={14} /></button>
                      <button onClick={() => removeSection(idx)} className="p-2 text-rose-400 hover:text-rose-600 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </div>

                  <div className="p-8 space-y-6">
                    {section.type === 'text' && (
                      <>
                        <input 
                          type="text" 
                          value={section.title}
                          onChange={(e) => updateSection(idx, 'title', e.target.value)}
                          placeholder="Section Heading"
                          className="w-full text-xl font-bold text-slate-900 border-b border-transparent focus:border-slate-100 focus:outline-none mb-4"
                        />
                        <textarea 
                          rows="6"
                          value={section.value}
                          onChange={(e) => updateSection(idx, 'value', e.target.value)}
                          placeholder="Write your story section here..."
                          className="w-full p-0 text-slate-600 leading-relaxed font-medium focus:outline-none resize-none bg-transparent"
                        />
                      </>
                    )}

                    {section.type === 'image' && (
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Image URL</label>
                            <input 
                              type="text" 
                              value={section.value}
                              onChange={(e) => updateSection(idx, 'value', e.target.value)}
                              placeholder="https://..."
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Caption</label>
                            <input 
                              type="text" 
                              value={section.caption}
                              onChange={(e) => updateSection(idx, 'caption', e.target.value)}
                              placeholder="Image description..."
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold"
                            />
                          </div>
                        </div>
                        <div className="aspect-video bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden relative">
                          {section.value ? (
                            <img src={section.value} className="w-full h-full object-cover" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-200">
                              <ImageIcon size={40} />
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {section.type === 'video' && (
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">YouTube / Video URL</label>
                        <input 
                          type="text" 
                          value={section.value}
                          onChange={(e) => updateSection(idx, 'value', e.target.value)}
                          placeholder="https://youtube.com/watch?v=..."
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold"
                        />
                      </div>
                    )}

                    {section.type === 'quote' && (
                      <div className="space-y-4">
                        <textarea 
                          rows="2"
                          value={section.value}
                          onChange={(e) => updateSection(idx, 'value', e.target.value)}
                          placeholder="Enter a powerful quote..."
                          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-lg font-bold italic text-navy focus:outline-none"
                        />
                        <input 
                          type="text" 
                          value={section.author}
                          onChange={(e) => updateSection(idx, 'author', e.target.value)}
                          placeholder="Quote Author Name"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold"
                        />
                      </div>
                    )}

                    {section.type === 'gallery' && (
                      <div className="space-y-4">
                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Image URLs (one per line)</label>
                         <textarea 
                          rows="4"
                          value={Array.isArray(section.value) ? section.value.join('\n') : ''}
                          onChange={(e) => updateSection(idx, 'value', e.target.value.split('\n'))}
                          placeholder="https://url1.com\nhttps://url2.com"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold font-mono"
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Component Adder */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-10 border-t border-slate-50">
              <button onClick={() => addSection('text')} className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-100 hover:border-navy hover:bg-slate-50 transition-all gap-2 group">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-navy group-hover:text-white transition-all"><Type size={18} /></div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Text Block</span>
              </button>
              <button onClick={() => addSection('image')} className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-100 hover:border-navy hover:bg-slate-50 transition-all gap-2 group">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-navy group-hover:text-white transition-all"><ImageIcon size={18} /></div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Single Image</span>
              </button>
              <button onClick={() => addSection('gallery')} className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-100 hover:border-navy hover:bg-slate-50 transition-all gap-2 group">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-navy group-hover:text-white transition-all"><Layout size={18} /></div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Image Gallery</span>
              </button>
              <button onClick={() => addSection('video')} className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-100 hover:border-navy hover:bg-slate-50 transition-all gap-2 group">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-navy group-hover:text-white transition-all"><Video size={18} /></div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Video Feed</span>
              </button>
              <button onClick={() => addSection('quote')} className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-100 hover:border-navy hover:bg-slate-50 transition-all gap-2 group">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-navy group-hover:text-white transition-all"><Quote size={18} /></div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Highlight Quote</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm sticky top-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
              <FileText size={14} /> Assets & Identity
            </h3>

            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Narrative Thumbnail</label>
                <div className="aspect-[4/3] rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden relative group/thumb">
                  {thumbnail ? (
                    <img src={thumbnail} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-200">
                      <ImageIcon size={32} className="mb-2" />
                      <span className="text-[8px] font-bold uppercase tracking-widest">No Selection</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-navy/60 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                    <input 
                      type="text" 
                      value={thumbnail}
                      onChange={(e) => setThumbnail(e.target.value)}
                      placeholder="Paste Thumbnail URL"
                      className="w-[80%] px-3 py-2 bg-white rounded-lg text-[10px] font-bold outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-8 border-t border-slate-50">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Main Banner Image</label>
                <input 
                  type="text" 
                  value={banner}
                  onChange={(e) => setBanner(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold"
                />
              </div>

              <div className="space-y-4 pt-8 border-t border-slate-50">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Narrative Author</label>
                <input 
                  type="text" 
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="PI Communications"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold"
                />
              </div>

              <div className="pt-8 space-y-4">
                <div className="p-6 bg-navy rounded-3xl text-white relative overflow-hidden shadow-2xl shadow-navy/20">
                  <PlusCircle className="absolute -top-4 -right-4 text-primary opacity-10" size={80} />
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Publishing Protocol</p>
                  <p className="text-sm font-medium leading-relaxed opacity-60">
                    Ensure all industrial assets and laboratory images are verified for institutional distribution.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
