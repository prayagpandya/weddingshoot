"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback, type ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";

/* ---------------- Reveal on scroll ---------------- */
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("is-visible");
            io.disconnect();
          }
        });
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

/* ---------------- Section heading ---------------- */
export function SectionHeading({
  eyebrow,
  title,
  script,
  light = false,
  center = false,
  typography,
}: {
  eyebrow: string;
  title: string;
  script?: string;
  light?: boolean;
  center?: boolean;
  typography?: {
    titleFont?: string;
    subtitleFont?: string;
    eyebrowFont?: string;
    hideEyebrowOnMobile?: boolean;
  };
}) {
  return (
    <Reveal className={center ? "text-center" : ""}>
      <p className={`eyebrow ${typography?.hideEyebrowOnMobile !== false ? 'hidden md:block' : 'block text-[0.6rem] md:text-xs'} ${typography?.eyebrowFont || ''}`}>{eyebrow}</p>
      {script && (
        <p className={`text-3xl text-gold mt-4 md:text-4xl ${typography?.subtitleFont || 'font-script'}`}>{script}</p>
      )}
      <h2
        className={`mt-3 ${light ? "text-bone" : "text-ink"} ${typography?.titleFont || 'h-display'}`}
        style={{ fontSize: "var(--section-heading-size)" }}
      >
        {title}
      </h2>
      <div className={`gold-rule mt-6 ${center ? "mx-auto" : ""}`} />
    </Reveal>
  );
}

/* ---------------- Gold button ---------------- */
export function GoldLink({
  href,
  children,
  dark = false,
}: {
  href: string;
  children: ReactNode;
  dark?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-4 border px-8 py-4 text-[0.7rem] uppercase tracking-[0.35em] transition-all duration-500 ${dark
        ? "border-bone/40 text-bone hover:bg-bone hover:text-ink"
        : "border-ink/30 text-ink hover:bg-ink hover:text-bone"
        }`}
    >
      {children}
      <span className="transition-transform duration-500 group-hover:translate-x-1.5">
        →
      </span>
    </Link>
  );
}

/* ---------------- Infinite marquee ---------------- */
export function Marquee({ items, light = false }: { items: string[]; light?: boolean }) {
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden py-6">
      <div className="marquee-track">
        {row.map((item, i) => (
          <span
            key={i}
            className={`h-display flex items-center whitespace-nowrap text-4xl md:text-6xl ${light ? "text-bone/25" : "text-ink/15"
              }`}
          >
            {item}
            <span className="mx-8 text-gold text-2xl md:text-3xl">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Single Explore Card (extracted so hooks are used legally) ---------------- */
function ExploreCard({
  h,
  cardShape,
  layout,
  hideEyebrowTextOnMobile,
  titleFont,
}: {
  h: { label: string; image: string; href: string; orientation?: "vertical" | "horizontal" | "auto" };
  cardShape: "portrait" | "square" | "landscape" | "circle";
  layout: "carousel" | "grid";
  hideEyebrowTextOnMobile?: boolean;
  titleFont?: string;
}) {
  const [orientation, setOrientation] = useState<"vertical" | "horizontal">(
    h.orientation === "horizontal"
      ? "horizontal"
      : h.orientation === "vertical"
        ? "vertical"
        : cardShape === "landscape"
          ? "horizontal"
          : "vertical"
  );

  const isHorizontal = orientation === "horizontal";

  const itemShapeClass =
    cardShape === "circle"
      ? "aspect-square rounded-full"
      : cardShape === "square"
        ? "aspect-square"
        : isHorizontal
          ? "aspect-[16/10]"
          : "aspect-[4/5]";

  const itemWidthClass =
    layout === "carousel"
      ? isHorizontal
        ? "w-80 md:w-[26rem]"
        : "w-64 md:w-72"
      : isHorizontal
        ? "col-span-1 md:col-span-2 w-full"
        : "col-span-1 w-full";

  return (
    <Link
      href={h.href}
      className={`group relative flex flex-col overflow-hidden ${itemShapeClass} ${itemWidthClass} ${layout === "carousel" ? "shrink-0" : ""
        }`}
      draggable={false}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={h.image}
        alt={h.label}
        onLoad={(e) => {
          if (!h.orientation || h.orientation === "auto") {
            const img = e.currentTarget;
            if (img.naturalWidth > img.naturalHeight * 1.1) {
              setOrientation("horizontal");
            } else {
              setOrientation("vertical");
            }
          }
        }}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
      <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 pointer-events-none">
        <span className={`${hideEyebrowTextOnMobile !== false ? "hidden md:block" : "block text-[0.6rem]"} md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] text-bone mb-1 md:mb-2 opacity-80 transition-opacity duration-500 group-hover:opacity-100`}>
          Explore
        </span>
        <span 
          className={`block ${titleFont || 'h-display'} text-bone transition-transform duration-500 group-hover:translate-x-1`}
          style={{ fontSize: "var(--explore-title-size)", lineHeight: "1.1" }}
        >
          {h.label}
        </span>
      </div>
    </Link>
  );
}

/* ---------------- Editorial Portrait & Landscape Category Cards ---------------- */
export function ExploreCards({
  items,
  layout = "carousel",
  cardShape = "portrait",
  spacing = "medium",
  hideEyebrowTextOnMobile,
  titleFont,
}: {
  items: { label: string; image: string; href: string; orientation?: "vertical" | "horizontal" | "auto" }[];
  layout?: "carousel" | "grid";
  cardShape?: "portrait" | "square" | "landscape" | "circle";
  spacing?: "small" | "medium" | "large";
  hideEyebrowTextOnMobile?: boolean;
  titleFont?: string;
}) {
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
    active: layout === "carousel",
  });

  const gapClass = spacing === "small" ? "gap-2 md:gap-4" : spacing === "large" ? "gap-6 md:gap-10" : "gap-4 md:gap-6";

  if (layout === "grid") {
    return (
      <div className="w-full px-6 md:px-12 lg:px-20">
        <div className={`grid grid-cols-2 md:grid-cols-4 ${gapClass}`}>
          {items.map((h) => (
            <ExploreCard key={h.label} h={h} cardShape={cardShape} layout={layout} hideEyebrowTextOnMobile={hideEyebrowTextOnMobile} titleFont={titleFont} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden w-full px-6 md:px-12 lg:px-20" ref={emblaRef}>
      <div className={`flex ${gapClass} touch-pan-y cursor-grab active:cursor-grabbing`}>
        {items.map((h) => (
          <ExploreCard key={h.label} h={h} cardShape={cardShape} layout={layout} hideEyebrowTextOnMobile={hideEyebrowTextOnMobile} titleFont={titleFont} />
        ))}
      </div>
    </div>
  );
}

/* ---------------- Breadcrumbs ---------------- */
export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[0.65rem] uppercase tracking-[0.3em] text-ink/50">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span className="text-gold">/</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-gold transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-ink/80">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ---------------- Album Modal ---------------- */
function AlbumModal({
  album,
  onClose,
}: {
  album: { title: string; place: string; images: string[] };
  onClose: () => void;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    containScroll: "trimSnaps",
  });

  const images = Array.isArray(album) ? album : (album?.images || []);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [rotations, setRotations] = useState<Record<number, number>>({});

  const rotateImage = useCallback(() => {
    setRotations((prev) => ({
      ...prev,
      [selectedIndex]: (prev[selectedIndex] || 0) - 90,
    }));
  }, [selectedIndex]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-ink/95 backdrop-blur-xl transition-all duration-500 opacity-100">
      <div className="flex items-center justify-between p-6">
        <div className="flex flex-col">
          <span className="text-bone h-display text-2xl tracking-wide">{album.title}</span>
          <span className="text-bone/60 text-[0.6rem] uppercase tracking-[0.3em] mt-1">{album.place}</span>
        </div>
        <button
          onClick={onClose}
          className="text-bone/70 hover:text-gold transition-colors p-2 rounded-full border border-bone/20 hover:border-gold/50"
          aria-label="Close Gallery"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
        </button>
      </div>

      <div className="flex-1 relative overflow-hidden flex items-center group">
        <button
          onClick={scrollPrev}
          className="absolute left-4 md:left-8 z-10 p-3 rounded-full bg-ink/50 text-bone border border-bone/20 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-ink hover:text-gold disabled:opacity-0"
          disabled={selectedIndex === 0}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
        </button>

        <div className="w-full h-full overflow-hidden" ref={emblaRef}>
          <div className="flex h-full touch-pan-y cursor-grab active:cursor-grabbing">
            {images.map((img, i) => (
              <div key={i} className="flex-[0_0_100%] h-full flex items-center justify-center p-4 md:p-12">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={`Album image ${i + 1}`}
                  className="max-h-full max-w-full object-contain pointer-events-none rounded-sm shadow-2xl ring-1 ring-bone/10"
                  style={{ transform: `rotate(${rotations[i] || 0}deg)`, transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)" }}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={scrollNext}
          className="absolute right-4 md:right-8 z-10 p-3 rounded-full bg-ink/50 text-bone border border-bone/20 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-ink hover:text-gold disabled:opacity-0"
          disabled={selectedIndex === album.images.length - 1}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
        </button>
      </div>

      <div className="p-6 grid grid-cols-3 items-center text-bone/50 text-[0.65rem] uppercase tracking-[0.3em]">
        <div />
        <div className="text-center">
          <span>{selectedIndex + 1} / {images.length}</span>
        </div>
        <div className="flex justify-end">
          <button
            onClick={rotateImage}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-bone/20 bg-ink/50 backdrop-blur-sm hover:bg-bone hover:text-ink hover:border-bone transition-all duration-300"
            aria-label="Rotate Image"
          >
            Rotate
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Swipeable Wedding Stories ---------------- */
export function SwipeableStories({
  items,
}: {
  items: { title: string; image: string; tag: string; place: string; images?: string[] }[];
}) {
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const [activeAlbum, setActiveAlbum] = useState<{ title: string; place: string; images: string[] } | null>(null);

  // Close modal with escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveAlbum(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <div className="overflow-hidden w-full" ref={emblaRef}>
        <div className="flex gap-6 touch-pan-y cursor-grab active:cursor-grabbing">
          {items.map((p) => (
            <div key={p.title} className="group block shrink-0 w-80 md:w-96">
              <button
                onClick={() => p.images ? setActiveAlbum({ title: p.title, place: p.place, images: p.images }) : null}
                className="block w-full text-left"
                draggable={false}
              >
                <div className="lux-img overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.title}
                    className="aspect-[4/5] w-full object-cover pointer-events-none transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="mt-5 flex items-baseline justify-between pointer-events-none">
                  <h3 className="h-display text-2xl transition-colors group-hover:text-ink/70">{p.title}</h3>
                  <span className="text-[0.6rem] uppercase tracking-[0.3em] text-ink/70">
                    {p.tag}
                  </span>
                </div>
                <p className="mt-1 text-sm text-ink/50 pointer-events-none">{p.place}</p>
              </button>
            </div>
          ))}
        </div>
      </div>

      {activeAlbum && (
        <AlbumModal album={activeAlbum} onClose={() => setActiveAlbum(null)} />
      )}
    </>
  );
}
