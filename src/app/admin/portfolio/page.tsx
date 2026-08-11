"use client";
import { useState, useEffect } from "react";

type Orientation = "vertical" | "horizontal" | "auto";

interface PortfolioItem {
  _id: string;
  title: string;
  place: string;
  tag: string;
  categoryId: any;
  imageId: string;
  galleryImageIds?: string[];
  orientation?: Orientation;
}

const ORIENTATION_OPTIONS: { value: Orientation; label: string; icon: string }[] = [
  { value: "auto",       label: "Auto",       icon: "⚡" },
  { value: "vertical",   label: "Vertical",   icon: "📱" },
  { value: "horizontal", label: "Horizontal", icon: "🖥️" },
];

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);

  const [title, setTitle] = useState("");
  const [place, setPlace] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<FileList | null>(null);
  const [orientation, setOrientation] = useState<Orientation>("auto");
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  const [editModeId, setEditModeId] = useState<string | null>(null);
  const [existingGalleryIds, setExistingGalleryIds] = useState<string[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);

  const fetchData = async () => {
    const [resItems, resCats] = await Promise.all([
      fetch("/api/admin/portfolio"),
      fetch("/api/admin/categories"),
    ]);
    if (resItems.ok) setItems(await resItems.json());
    if (resCats.ok) {
      const cats = await resCats.json();
      setCategories(cats);
      if (cats.length > 0) setCategoryId(cats[0]._id);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleEdit = (item: PortfolioItem) => {
    setEditModeId(item._id);
    setTitle(item.title);
    setPlace(item.place);
    setCategoryId(item.categoryId?._id || item.categoryId || "");
    setOrientation(item.orientation || "auto");
    setExistingGalleryIds(item.galleryImageIds || []);
    setDeletedImageIds([]);
    setImage(null);
    setGalleryImages(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditModeId(null);
    setTitle("");
    setPlace("");
    setOrientation("auto");
    setExistingGalleryIds([]);
    setDeletedImageIds([]);
    setImage(null);
    setGalleryImages(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModeId && !image) return alert("Image is required");
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("place", place);
    formData.append("categoryId", categoryId);
    formData.append("orientation", orientation);
    if (image) formData.append("image", image);
    
    if (galleryImages) {
      for (let i = 0; i < galleryImages.length; i++) {
        formData.append("galleryImages", galleryImages[i]);
      }
    }

    if (editModeId) {
      formData.append("deletedImageIds", JSON.stringify(deletedImageIds));
      await fetch(`/api/admin/portfolio/${editModeId}`, { method: "PUT", body: formData });
    } else {
      await fetch("/api/admin/portfolio", { method: "POST", body: formData });
    }

    cancelEdit();
    setLoading(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/admin/portfolio/${id}`, { method: "DELETE" });
    fetchData();
  };

  const handleOrientationChange = async (id: string, newOrientation: Orientation) => {
    setSavingId(id);
    // Optimistic update
    setItems((prev) =>
      prev.map((item) => item._id === id ? { ...item, orientation: newOrientation } : item)
    );
    await fetch(`/api/admin/portfolio/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orientation: newOrientation }),
    });
    setSavingId(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* ── Upload Form ── */}
      <div>
        <h1 className="text-3xl h-display mb-8">Manage Portfolio</h1>

        <form onSubmit={handleSubmit} className="bg-zinc-900 p-6 border border-bone/10 space-y-4 max-w-2xl">
          <h2 className="text-xl h-display">{editModeId ? "Edit Album" : "Upload Image"}</h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-bone mb-2">Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
                className="w-full bg-black/50 border border-bone/20 p-2 text-bone focus:border-bone outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-bone mb-2">Place / Location</label>
              <input type="text" value={place} onChange={(e) => setPlace(e.target.value)} required
                className="w-full bg-black/50 border border-bone/20 p-2 text-bone focus:border-bone outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-bone mb-2">Category</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required
                className="w-full bg-black/50 border border-bone/20 p-2 text-bone focus:border-bone outline-none transition-colors">
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>

            {/* Orientation picker in upload form */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-bone mb-2">Image Orientation</label>
              <div className="flex gap-2">
                {ORIENTATION_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setOrientation(opt.value)}
                    className={`flex items-center gap-1.5 px-4 py-2 text-xs border transition-all duration-200
                      ${orientation === opt.value
                        ? "bg-bone text-ink border-bone font-semibold"
                        : "bg-transparent text-bone/60 border-bone/20 hover:border-bone/60 hover:text-bone"
                      }`}
                  >
                    <span>{opt.icon}</span>
                    <span className="uppercase tracking-wider text-[10px]">{opt.label}</span>
                  </button>
                ))}
              </div>
              <p className="mt-1.5 text-[10px] text-bone/30">
                Auto = detect from image size · Vertical = portrait · Horizontal = landscape
              </p>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-bone mb-2">Cover Image {editModeId && "(Optional - Leave blank to keep current)"}</label>
              <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} required={!editModeId}
                className="w-full bg-black/50 border border-bone/20 p-2 text-bone" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-bone mb-2">Album Gallery Images (Optional)</label>
              
              {editModeId && existingGalleryIds.length > 0 && (
                <div className="mb-4">
                  <p className="text-[10px] text-bone/50 mb-2">Existing Photos (click X to remove)</p>
                  <div className="flex flex-wrap gap-2">
                    {existingGalleryIds.map(gid => {
                      const isDeleted = deletedImageIds.includes(gid);
                      if (isDeleted) return null;
                      return (
                        <div key={gid} className="relative w-16 h-16 border border-bone/20 group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={`/api/images/${gid}`} alt="Gallery thumbnail" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => setDeletedImageIds(prev => [...prev, gid])} className="absolute top-0 right-0 bg-red-500/90 text-white text-[10px] w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">✕</button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              <input type="file" accept="image/*" multiple onChange={(e) => setGalleryImages(e.target.files)}
                className="w-full bg-black/50 border border-bone/20 p-2 text-bone" />
              <p className="mt-1.5 text-[10px] text-bone/30">
                {editModeId ? "Select additional photos to append to this album." : "Select multiple photos to create a swipeable album when this item is clicked."}
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <button type="submit" disabled={loading}
              className="bg-bone text-ink px-6 py-2 uppercase text-xs tracking-widest hover:bg-bone/80 transition-colors">
              {loading ? "Saving..." : (editModeId ? "Save Changes" : "Upload")}
            </button>
            {editModeId && (
              <button type="button" onClick={cancelEdit} disabled={loading}
                className="border border-bone/30 text-bone px-6 py-2 uppercase text-xs tracking-widest hover:bg-bone/10 transition-colors">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ── Portfolio Grid ── */}
      <div>
        <h2 className="text-xl h-display mb-4">Portfolio Images</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => {
            const current: Orientation = item.orientation ?? "auto";
            return (
              <div key={item._id} className="border border-bone/10 bg-zinc-900 group relative flex flex-col">
                {/* Image */}
                <div className="aspect-square relative overflow-hidden bg-black/50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/api/images/${item.imageId}`}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Action buttons */}
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-ink/90 text-bone border border-bone/30 text-xs px-2 py-1 hover:bg-bone hover:text-ink transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-500/90 text-white text-xs px-2 py-1 hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="px-3 pt-3 pb-1">
                  <p className="text-[9px] uppercase tracking-widest text-bone/50 mb-0.5">{item.tag}</p>
                  <p className="text-sm leading-tight font-medium truncate">{item.title}</p>
                  <p className="text-[10px] text-bone/40 mt-0.5 truncate">{item.place}</p>
                </div>

                {/* Orientation Toggle */}
                <div className="px-3 pb-3 pt-2">
                  <p className="text-[9px] uppercase tracking-widest text-bone/30 mb-1.5">Image Layout</p>
                  <div className="flex gap-1">
                    {ORIENTATION_OPTIONS.map((opt) => {
                      const isActive = current === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => handleOrientationChange(item._id, opt.value)}
                          disabled={savingId === item._id}
                          title={opt.label}
                          className={`flex items-center gap-1 px-2 py-1 text-[9px] border transition-all duration-200 flex-1 justify-center
                            ${isActive
                              ? "bg-bone text-ink border-bone font-bold"
                              : "bg-transparent text-bone/50 border-bone/15 hover:border-bone/50 hover:text-bone"
                            }
                            ${savingId === item._id ? "opacity-40 cursor-wait" : "cursor-pointer"}
                          `}
                        >
                          <span className="text-[11px]">{opt.icon}</span>
                          <span className="uppercase tracking-wider hidden sm:inline">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        {items.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-4 text-[11px] text-bone/40">
            <span>⚡ <strong className="text-bone/60">Auto</strong> — detect from image dimensions</span>
            <span>📱 <strong className="text-bone/60">Vertical</strong> — force portrait layout</span>
            <span>🖥️ <strong className="text-bone/60">Horizontal</strong> — force landscape layout</span>
          </div>
        )}
      </div>
    </div>
  );
}
