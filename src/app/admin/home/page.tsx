"use client";
import { useState, useEffect } from "react";
import { ExploreCards } from "@/components/ui";

import SectionControls from "@/components/admin/SectionControls";
export default function HomeConfigPage() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Wrap setConfig so any change marks the page as dirty
  const updateConfig = (newConfig: any) => {
    setConfig(newConfig);
    setIsDirty(true);
  };

  useEffect(() => {
    fetch("/api/admin/home-config")
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        setLoading(false);
      });
  }, []);

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData
    });
    
    if (res.ok) {
      const { imageId } = await res.json();
      updateConfig({
        ...config,
        hero: {
          ...config.hero,
          imageIds: [...config.hero.imageIds, imageId]
        }
      });
    }
  };

  const removeHeroImage = (index: number) => {
    const newImages = [...config.hero.imageIds];
    newImages.splice(index, 1);
    updateConfig({
      ...config,
      hero: { ...config.hero, imageIds: newImages }
    });
  };

  const handleExploreItemUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData
    });
    
    if (res.ok) {
      const { imageId } = await res.json();
      const newItems = [...config.explore.items];
      newItems[index].imageId = imageId;
      updateConfig({
        ...config,
        explore: { ...config.explore, items: newItems }
      });
    }
  };

  const handleExploreGalleryUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData
    });
    
    if (res.ok) {
      const { imageId } = await res.json();
      const newItems = [...config.explore.items];
      newItems[index].galleryImageIds = [...(newItems[index].galleryImageIds || []), imageId];
      updateConfig({
        ...config,
        explore: { ...config.explore, items: newItems }
      });
    }
  };

  const removeExploreGalleryImage = (itemIndex: number, imgIndex: number) => {
    const newItems = [...config.explore.items];
    newItems[itemIndex].galleryImageIds.splice(imgIndex, 1);
    updateConfig({
      ...config,
      explore: { ...config.explore, items: newItems }
    });
  };

  const addExploreItem = () => {
    updateConfig({
      ...config,
      explore: {
        ...config.explore,
        items: [...config.explore.items, { label: "", href: "", imageId: "" }]
      }
    });
  };

  const updateExploreItem = (index: number, field: string, value: string) => {
    const newItems = [...config.explore.items];
    newItems[index] = { ...newItems[index], [field]: value };
    updateConfig({
      ...config,
      explore: { ...config.explore, items: newItems }
    });
  };

  const removeExploreItem = (index: number) => {
    const newItems = [...config.explore.items];
    newItems.splice(index, 1);
    updateConfig({
      ...config,
      explore: { ...config.explore, items: newItems }
    });
  };

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/admin/home-config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config)
    });
    setSaving(false);
    setIsDirty(false);
  };

  if (loading) return <div className="text-bone">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-32">
      {/* ── Top header with Save button ── */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl h-display">Homepage Settings</h1>
          {isDirty && (
            <p className="text-xs text-amber-400 mt-1 flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Unsaved changes
            </p>
          )}
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving || !isDirty}
          className={`px-8 py-3 uppercase text-xs tracking-widest font-bold transition-all duration-200
            ${isDirty
              ? "bg-bone text-ink hover:bg-bone/80 shadow-lg shadow-bone/20"
              : "bg-bone/20 text-bone/40 cursor-not-allowed"
            }`}
        >
          {saving ? "Saving..." : isDirty ? "Save Changes" : "Saved ✓"}
        </button>
      </div>
      
      {/* Hero Section */}
      <section className="bg-zinc-900 p-8 border border-bone/10 space-y-6">
        <h2 className="text-2xl h-display border-b border-bone/10 pb-4">Hero Section</h2>
        <SectionControls 
          title="Hero" 
          configData={config.hero} 
          onChange={(field, val) => updateConfig({ ...config, hero: { ...config.hero, [field]: val } })} 
        />

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-bone mb-2">Subtitle</label>
            <input 
              type="text" 
              value={config.hero.subtitle} 
              onChange={e => updateConfig({ ...config, hero: { ...config.hero, subtitle: e.target.value } })}
              className="w-full bg-black/50 border border-bone/20 p-2 text-bone outline-none" 
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-bone mb-2">Title</label>
            <input 
              type="text" 
              value={config.hero.title} 
              onChange={e => updateConfig({ ...config, hero: { ...config.hero, title: e.target.value } })}
              className="w-full bg-black/50 border border-bone/20 p-2 text-bone outline-none" 
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-bone mb-2">Title Highlight Word</label>
            <input 
              type="text" 
              value={config.hero.titleHighlight} 
              onChange={e => updateConfig({ ...config, hero: { ...config.hero, titleHighlight: e.target.value } })}
              className="w-full bg-black/50 border border-bone/20 p-2 text-bone outline-none" 
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-bone mb-4 mt-6">Carousel Images</label>
          <div className="flex flex-wrap gap-4 mb-4">
            {config.hero.imageIds.map((id: string, i: number) => (
              <div key={i} className="relative w-32 h-48 bg-black group border border-bone/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/api/images/${id}`} alt="Hero" className="w-full h-full object-cover opacity-80" />
                <button 
                  onClick={() => removeHeroImage(i)}
                  className="absolute top-2 right-2 bg-red-500 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >✕</button>
              </div>
            ))}
            <div className="w-32 h-48 border border-dashed border-bone/30 flex flex-col items-center justify-center relative hover:bg-bone/5 cursor-pointer transition-colors">
              <span className="text-bone/50 text-xs uppercase">+ Add Image</span>
              <input type="file" accept="image/*" onChange={handleUploadImage} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </div>
        </div>
      </section>

      {/* Explore Section */}
      <section className="bg-zinc-900 p-8 border border-bone/10 space-y-6">
        <h2 className="text-2xl h-display border-b border-bone/10 pb-4">Explore Our World Layout</h2>
        <SectionControls 
          title="Explore" 
          configData={config.explore} 
          onChange={(field, val) => updateConfig({ ...config, explore: { ...config.explore, [field]: val } })} 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-bone mb-2">Layout Mode</label>
            <select 
              value={config.explore.layout}
              onChange={e => updateConfig({ ...config, explore: { ...config.explore, layout: e.target.value } })}
              className="w-full bg-black/50 border border-bone/20 p-2 text-bone outline-none"
            >
              <option value="carousel">Swipe Carousel</option>
              <option value="grid">Grid</option>
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-bone mb-2">Card Shape</label>
            <select 
              value={config.explore.cardShape}
              onChange={e => updateConfig({ ...config, explore: { ...config.explore, cardShape: e.target.value } })}
              className="w-full bg-black/50 border border-bone/20 p-2 text-bone outline-none"
            >
              <option value="portrait">Portrait</option>
              <option value="square">Square</option>
              <option value="landscape">Landscape</option>
              <option value="circle">Circle</option>
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-bone mb-2">Spacing</label>
            <select 
              value={config.explore.spacing}
              onChange={e => updateConfig({ ...config, explore: { ...config.explore, spacing: e.target.value } })}
              className="w-full bg-black/50 border border-bone/20 p-2 text-bone outline-none"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4 mt-8">
            <h3 className="text-xl h-display">Explore Items</h3>
            <button onClick={addExploreItem} className="text-xs uppercase tracking-widest border border-bone/20 px-4 py-2 hover:bg-bone hover:text-ink transition-colors">+ Add Item</button>
          </div>
          
          <div className="space-y-4">
            {config.explore.items.map((item: any, i: number) => (
              <div key={i} className="flex flex-col gap-4 bg-black/30 p-4 border border-bone/10">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-black shrink-0 relative border border-bone/20">
                    {item.imageId ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={`/api/images/${item.imageId}`} alt="img" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-bone/50 text-center">No Image</div>
                    )}
                    <input type="file" accept="image/*" onChange={(e) => handleExploreItemUpload(i, e)} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                  
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-bone/50 mb-1">Label (e.g. Wedding Photography)</label>
                      <input type="text" value={item.label} onChange={e => updateExploreItem(i, "label", e.target.value)} className="w-full bg-black/50 border border-bone/20 p-2 text-bone outline-none text-sm" placeholder="e.g. Wedding" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-bone/50 mb-1">Link URL</label>
                      <input type="text" value={item.href} onChange={e => updateExploreItem(i, "href", e.target.value)} className="w-full bg-black/50 border border-bone/20 p-2 text-bone outline-none text-sm" placeholder="/wedding-photography" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-bone/50 mb-1">Orientation</label>
                      <select 
                        value={item.orientation || "auto"} 
                        onChange={e => updateExploreItem(i, "orientation", e.target.value)} 
                        className="w-full bg-black/50 border border-bone/20 p-2 text-bone outline-none text-sm"
                      >
                        <option value="auto">⚡ Auto-Detect</option>
                        <option value="vertical">📱 Vertical (Portrait)</option>
                        <option value="horizontal">🖥️ Horizontal (Landscape)</option>
                      </select>
                    </div>
                  </div>
                  
                  <button onClick={() => removeExploreItem(i)} className="text-red-500 hover:text-red-400 p-2">✕</button>
                </div>
                
                {/* Gallery Images Section */}
                <div className="border-t border-bone/10 pt-4 mt-2">
                  <label className="block text-[10px] uppercase tracking-widest text-bone/50 mb-3">Service Gallery Images (Shows on {item.href || 'service'} page)</label>
                  <div className="flex flex-wrap gap-2">
                    {(item.galleryImageIds || []).map((id: string, imgIdx: number) => (
                      <div key={imgIdx} className="relative w-16 h-16 bg-black group border border-bone/20">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`/api/images/${id}`} alt="Gallery" className="w-full h-full object-cover opacity-80" />
                        <button 
                          onClick={() => removeExploreGalleryImage(i, imgIdx)}
                          className="absolute top-1 right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >✕</button>
                      </div>
                    ))}
                    <div className="w-16 h-16 border border-dashed border-bone/30 flex flex-col items-center justify-center relative hover:bg-bone/5 cursor-pointer transition-colors">
                      <span className="text-bone/50 text-xl leading-none">+</span>
                      <input type="file" accept="image/*" onChange={(e) => handleExploreGalleryUpload(i, e)} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {config.explore.items.length === 0 && <p className="text-bone/50 text-sm">No items added yet.</p>}
          </div>
        </div>
      </section>

      {/* Other Sections */}
      <section className="bg-zinc-900 p-8 border border-bone/10 space-y-6">
        <h2 className="text-2xl h-display border-b border-bone/10 pb-4">Other Homepage Sections</h2>
        <p className="text-sm text-bone/60 mb-4">Toggle visibility or override colors for the remaining homepage sections.</p>
        
        <SectionControls 
          title="Image Gallery" 
          configData={config.gallery || {}} 
          onChange={(field, val) => updateConfig({ ...config, gallery: { ...(config.gallery || {}), [field]: val } })} 
        />
        <SectionControls 
          title="Wedding Stories" 
          configData={config.stories || {}} 
          onChange={(field, val) => updateConfig({ ...config, stories: { ...(config.stories || {}), [field]: val } })} 
        />
        <SectionControls 
          title="Call To Action (CTA)" 
          configData={config.cta || {}} 
          onChange={(field, val) => updateConfig({ ...config, cta: { ...(config.cta || {}), [field]: val } })} 
        />
      </section>

      {/* Live Preview */}
      <section className="bg-zinc-900 p-8 border border-bone/10 space-y-6 overflow-hidden">
        <h2 className="text-2xl h-display border-b border-bone/10 pb-4">Live Preview</h2>
        <div className="bg-bone py-12 -mx-8 px-8 border border-ink/10">
          {config.explore.items.length > 0 ? (
            <ExploreCards 
              items={config.explore.items.map((i: any) => ({ 
                ...i, 
                image: i.imageId ? `/api/images/${i.imageId}` : "/12.jpg" 
              }))} 
              layout={config.explore.layout}
              cardShape={config.explore.cardShape}
              spacing={config.explore.spacing}
              hideEyebrowTextOnMobile={config.explore.typography?.hideEyebrowOnMobile}
              titleFont={config.explore.typography?.titleFont}
            />
          ) : (
            <p className="text-center text-ink/50 text-sm">Add items to see preview</p>
          )}
        </div>
      </section>

      {/* ── Sticky floating save bar (appears only when there are unsaved changes) ── */}
      <div
        className={`fixed bottom-0 left-64 right-0 z-50 transition-all duration-300 ${
          isDirty ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-zinc-950 border-t border-bone/20 px-10 py-4 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-sm text-bone/70">You have unsaved changes</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => { setConfig(null); setIsDirty(false); setLoading(true); 
                fetch("/api/admin/home-config").then(r => r.json()).then(d => { setConfig(d); setLoading(false); }); }}
              className="text-xs uppercase tracking-widest text-bone/50 hover:text-bone transition-colors px-4 py-2 border border-bone/20 hover:border-bone/40"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-bone text-ink px-8 py-2.5 uppercase text-xs tracking-widest font-bold hover:bg-bone/90 transition-colors shadow-lg shadow-bone/20"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Saving...
                </span>
              ) : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
