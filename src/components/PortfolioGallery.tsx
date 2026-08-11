"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Reveal } from "@/components/ui";

interface PortfolioItem {
  _id?: string;
  title: string;
  place: string;
  tag: string;
  imageId: string;
  galleryImageIds?: string[];
  orientation?: 'vertical' | 'horizontal' | 'auto';
}

interface ActiveAlbumState {
  item: PortfolioItem;
  imageIds: string[];
  currentIndex: number;
}

/* ---------- Single portfolio card — extracted to fix Rules of Hooks ---------- */
function PortfolioCard({
  item: p,
  index: i,
  onOpen,
}: {
  item: PortfolioItem;
  index: number;
  onOpen: (index: number) => void;
}) {
  const [orientation, setOrientation] = useState<"vertical" | "horizontal">(
    p.orientation === "horizontal"
      ? "horizontal"
      : p.orientation === "vertical"
      ? "vertical"
      : "vertical"
  );

  const isHorizontal = orientation === "horizontal";

  return (
    <Reveal
      delay={(i % 3) * 100}
      className={isHorizontal ? "col-span-1 md:col-span-2" : "col-span-1"}
    >
      <article
        onClick={() => onOpen(i)}
        className="group cursor-pointer"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onOpen(i)}
        aria-label={`View ${p.title}`}
      >
        <div className="lux-img relative overflow-hidden rounded-sm bg-ink/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/images/${p.imageId}`}
            alt={`${p.title} — ${p.place}`}
            onLoad={(e) => {
              if (!p.orientation || p.orientation === "auto") {
                const img = e.currentTarget;
                if (img.naturalWidth > img.naturalHeight * 1.1) {
                  setOrientation("horizontal");
                } else {
                  setOrientation("vertical");
                }
              }
            }}
            className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
              isHorizontal ? "aspect-[16/9] md:aspect-[16/10]" : "aspect-[4/5]"
            }`}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-ink/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="bg-bone/90 backdrop-blur-md text-ink px-4 py-2 text-[0.6rem] uppercase tracking-[0.3em]">
              Click to View
            </span>
          </div>
        </div>
        <div className="mt-5 flex items-baseline justify-between gap-4">
          <h2 className="h-display text-2xl group-hover:text-gold transition-colors">{p.title}</h2>
          <span className="shrink-0 text-[0.6rem] uppercase tracking-[0.3em] text-gold">
            {p.tag}
          </span>
        </div>
        <p className="mt-1 text-sm text-ink/50">{p.place}</p>
      </article>
    </Reveal>
  );
}

export default function PortfolioGallery({ items }: { items: PortfolioItem[] }) {
  const [activeAlbum, setActiveAlbum] = useState<ActiveAlbumState | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const imageRef = useRef<HTMLImageElement>(null);

  // Extract unique categories
  const categories = ["All", ...Array.from(new Set(items.map((i) => i.tag).filter(Boolean)))];

  const filteredItems = activeCategory === "All"
    ? items
    : items.filter((i) => i.tag === activeCategory);

  const resetTransform = () => {
    setRotation(0);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const openLightbox = (index: number) => {
    const item = filteredItems[index];
    // Include cover image if they just want that, otherwise load the gallery
    const imageIds = item.galleryImageIds && item.galleryImageIds.length > 0 
      ? item.galleryImageIds 
      : [item.imageId];
      
    setActiveAlbum({ item, imageIds, currentIndex: 0 });
    resetTransform();
  };

  const closeLightbox = () => {
    setActiveAlbum(null);
    resetTransform();
  };

  const handlePrev = useCallback(() => {
    if (!activeAlbum) return;
    resetTransform();
    setActiveAlbum((prev) => {
      if (!prev) return null;
      const newIndex = prev.currentIndex === 0 ? prev.imageIds.length - 1 : prev.currentIndex - 1;
      return { ...prev, currentIndex: newIndex };
    });
  }, [activeAlbum]);

  const handleNext = useCallback(() => {
    if (!activeAlbum) return;
    resetTransform();
    setActiveAlbum((prev) => {
      if (!prev) return null;
      const newIndex = prev.currentIndex === prev.imageIds.length - 1 ? 0 : prev.currentIndex + 1;
      return { ...prev, currentIndex: newIndex };
    });
  }, [activeAlbum]);

  const rotateLeft = () => {
    setRotation((r) => (r - 90) % 360);
  };

  const rotateRight = () => {
    setRotation((r) => (r + 90) % 360);
  };

  const zoomIn = () => {
    setZoom((z) => Math.min(z + 0.5, 4));
  };

  const zoomOut = () => {
    setZoom((z) => {
      const nextZoom = Math.max(z - 0.5, 1);
      if (nextZoom === 1) setPosition({ x: 0, y: 0 });
      return nextZoom;
    });
  };

  const handleDoubleClick = () => {
    if (zoom > 1) {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    } else {
      setZoom(2.2);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  };

  // Mouse Drag / Pan when zoomed in
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Keyboard navigation & shortcuts
  useEffect(() => {
    if (!activeAlbum) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "r" || e.key === "R") rotateRight();
      if (e.key === "+" || e.key === "=") zoomIn();
      if (e.key === "-") zoomOut();
      if (e.key === "0") {
        setZoom(1);
        setPosition({ x: 0, y: 0 });
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeAlbum, handlePrev, handleNext]);

  const activeItem = activeAlbum?.item || null;
  const activeImageId = activeAlbum ? activeAlbum.imageIds[activeAlbum.currentIndex] : null;

  return (
    <>
      {/* Category Filters */}
      {categories.length > 2 && (
        <div className="mb-14 flex flex-wrap items-center justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setActiveAlbum(null);
              }}
              className={`px-5 py-2 text-[0.65rem] uppercase tracking-[0.3em] transition-all duration-300 ${
                activeCategory === cat
                  ? "border border-ink bg-ink text-bone"
                  : "border border-ink/15 text-ink/70 hover:border-ink/50 hover:text-ink"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Portfolio Grid */}
      {filteredItems.length === 0 ? (
        <p className="text-center text-ink/50 text-xl py-20">No images found in this collection.</p>
      ) : (
        <div className="grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3 items-start">
          {filteredItems.map((p, i) => (
            <PortfolioCard key={p._id || i} item={p} index={i} onOpen={openLightbox} />
          ))}
        </div>
      )}

      {/* Interactive Lightbox Modal */}
      {activeItem && activeAlbum && activeImageId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md transition-opacity duration-300 select-none"
          onClick={closeLightbox}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Top Bar / Controls */}
          <div
            className="absolute top-0 inset-x-0 z-20 flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-gradient-to-b from-black/90 to-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-bone/80 text-[0.7rem] uppercase tracking-[0.3em]">
              {activeAlbum.currentIndex + 1} / {activeAlbum.imageIds.length}
            </div>

            {/* Controls: Zoom, Rotate & Close */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              {/* Zoom Controls */}
              <div className="flex items-center rounded border border-bone/20 bg-black/40 overflow-hidden">
                <button
                  onClick={zoomOut}
                  disabled={zoom <= 1}
                  title="Zoom Out (-)"
                  aria-label="Zoom Out"
                  className="px-3 py-1.5 text-[0.75rem] text-bone hover:bg-bone/20 disabled:opacity-30 transition-colors"
                >
                  −
                </button>
                <span className="px-2 text-[0.65rem] uppercase tracking-[0.1em] text-gold font-mono">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={zoomIn}
                  disabled={zoom >= 4}
                  title="Zoom In (+)"
                  aria-label="Zoom In"
                  className="px-3 py-1.5 text-[0.75rem] text-bone hover:bg-bone/20 disabled:opacity-30 transition-colors"
                >
                  +
                </button>
              </div>

              {/* Rotation Controls */}
              <button
                onClick={rotateLeft}
                title="Rotate Left 90°"
                aria-label="Rotate Left"
                className="flex items-center gap-1 px-3 py-1.5 rounded border border-bone/20 text-[0.65rem] uppercase tracking-[0.2em] text-bone hover:border-gold hover:text-gold transition-colors"
              >
                <span>↺</span> <span className="hidden sm:inline">Rotate</span> Left
              </button>
              <button
                onClick={rotateRight}
                title="Rotate Right 90°"
                aria-label="Rotate Right"
                className="flex items-center gap-1 px-3 py-1.5 rounded border border-bone/20 text-[0.65rem] uppercase tracking-[0.2em] text-bone hover:border-gold hover:text-gold transition-colors"
              >
                <span>↻</span> <span className="hidden sm:inline">Rotate</span> Right
              </button>

              {(zoom > 1 || rotation !== 0) && (
                <button
                  onClick={resetTransform}
                  title="Reset Zoom & Rotation"
                  className="px-3 py-1.5 rounded border border-gold/40 text-[0.65rem] uppercase tracking-[0.2em] text-gold hover:bg-gold hover:text-ink transition-colors"
                >
                  Reset
                </button>
              )}

              {/* Close Button */}
              <button
                onClick={closeLightbox}
                aria-label="Close modal"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-bone/30 text-bone hover:border-gold hover:text-gold transition-colors ml-2 text-lg"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Navigation Arrow Left */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Previous image"
            className="absolute left-4 md:left-8 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-bone/30 bg-black/40 text-bone backdrop-blur-sm transition-all hover:scale-110 hover:border-gold hover:text-gold hover:bg-black/80"
          >
            ←
          </button>

          {/* Navigation Arrow Right */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Next image"
            className="absolute right-4 md:right-8 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-bone/30 bg-black/40 text-bone backdrop-blur-sm transition-all hover:scale-110 hover:border-gold hover:text-gold hover:bg-black/80"
          >
            →
          </button>

          {/* Center Image Container */}
          <div
            className={`relative flex h-full w-full items-center justify-center overflow-hidden p-6 ${
              zoom > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-zoom-in"
            }`}
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={handleDoubleClick}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imageRef}
              src={`/api/images/${activeImageId}`}
              alt={activeItem.title}
              style={{
                transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${zoom})`,
                maxHeight: rotation % 180 !== 0 ? "70vw" : "80vh",
                maxWidth: rotation % 180 !== 0 ? "70vh" : "85vw",
              }}
              className="object-contain transition-transform duration-200 ease-out shadow-2xl rounded pointer-events-auto"
            />
          </div>

          {/* Bottom Info Bar */}
          <div
            className="absolute bottom-0 inset-x-0 z-20 flex flex-col items-center justify-center px-6 py-5 text-center bg-gradient-to-t from-black/90 to-transparent pointer-events-none"
          >
            <span className="text-[0.6rem] uppercase tracking-[0.35em] text-gold mb-1">
              {activeItem.tag}
            </span>
            <h3 className="h-display text-2xl text-bone md:text-3xl">{activeItem.title}</h3>
            <p className="text-xs text-bone/60 mt-1">{activeItem.place}</p>
            <p className="text-[0.55rem] uppercase tracking-[0.2em] text-bone/40 mt-2">
              Double click or scroll to zoom · Drag when zoomed
            </p>
          </div>
        </div>
      )}
    </>
  );
}
