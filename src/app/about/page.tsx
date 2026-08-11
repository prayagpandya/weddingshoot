import type { Metadata } from "next";
import { Reveal, SectionHeading, GoldLink, Marquee } from "@/components/ui";
import { fallbackTestimonials } from "@/lib/data";
import { connectToDatabase } from "@/lib/mongodb";
import AboutConfig from "@/models/AboutConfig";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us — A Luxury Wedding Experience House",
  description:
    "The Eternal Bliss is a complete luxury wedding experience brand founded by Garima Dhingra in 2016 — planning, decor, photography, films, invitations and entertainment.",
};

export default async function AboutPage() {
  await connectToDatabase();
  let config = await AboutConfig.findById("about").lean();
  
  if (!config) {
    config = {
      hero: {
        eyebrow: "About The Eternal Bliss",
        scriptTitle: "more than photography",
        title: "A complete luxury wedding experience house",
        isVisible: true
      },
      founder: {
        imageId: "",
        eyebrow: "The Founder",
        scriptTitle: "Garima Dhingra",
        title: "The woman behind the bliss",
        bullets: [
          "— Wedding Experience Curator",
          "— Certified Newborn Photographer",
          "— Luxury Wedding Planner",
          "— Decor Specialist"
        ],
        content: "Since 2016, Garima has led The Eternal Bliss with a singular philosophy: curate emotions, preserve memories, and transform celebrations into timeless experiences. Under her direction, a photography studio grew into one of India's most complete wedding experience houses — planning, decor, films, invitations, entertainment and fine-art photography under one roof.",
        buttonLabel: "Read Our Story",
        buttonLink: "/our-story",
        isVisible: true
      },
      stats: {
        items: [
          { n: "2016", label: "Founded" },
          { n: "450+", label: "Celebrations" },
          { n: "30+", label: "Destinations" },
          { n: "1", label: "Promise: Perfection" }
        ],
        isVisible: true
      },
      philosophy: {
        eyebrow: "Philosophy",
        title: "What we believe",
        values: [
          { title: "Curate Emotions", detail: "Every celebration is designed around the people in it — their rituals, their humour, their tears of joy." },
          { title: "Preserve Memories", detail: "Photographs, films and albums crafted as heirlooms — made to be held by generations that follow." },
          { title: "Transform Celebrations", detail: "Planning, decor and production woven into a single, seamless, timeless experience." }
        ],
        mission: "Deliver complete wedding experiences through planning, storytelling, photography, decor, films and flawless execution.",
        vision: "Become one of India's leading luxury wedding experience companies.",
        isVisible: true
      },
      testimonials: { isVisible: true },
      cta: {
        imageId: "",
        title: "Come, be part of our story",
        buttonLabel: "Start a Conversation",
        buttonLink: "/contact",
        isVisible: true
      }
    };
  }

  return (
    <>
      {config.hero?.isVisible !== false && (
        <section 
          className="bg-ink pb-24 pt-44 text-bone"
          style={{ backgroundColor: config.hero?.bgColor || undefined, color: config.hero?.textColor || undefined }}
        >
          <div className="mx-auto max-w-7xl px-6">
            <p className={`fade-up eyebrow ${config.hero?.typography?.hideEyebrowOnMobile !== false ? 'hidden md:block' : 'block text-[0.6rem] md:text-xs'} ${config.hero?.typography?.eyebrowFont || ''}`} style={{ color: config.hero?.textColor || undefined }}>{config.hero?.eyebrow}</p>
            <p className={`fade-up mt-5 text-4xl text-gold ${config.hero?.typography?.subtitleFont || 'font-script'}`} style={{ animationDelay: "0.15s" }}>
              {config.hero?.scriptTitle}
            </p>
            <h1 className={`fade-up mt-2 max-w-4xl text-4xl md:text-7xl ${config.hero?.typography?.titleFont || 'h-display'}`} style={{ animationDelay: "0.3s" }}>
              {config.hero?.title}
            </h1>
          </div>
        </section>
      )}

      {config.founder?.isVisible !== false && (
        <section 
          className="mx-auto max-w-7xl px-6 py-24 md:py-32"
          style={{ backgroundColor: config.founder?.bgColor || undefined, color: config.founder?.textColor || undefined }}
        >
          <div className="grid items-center gap-14 md:grid-cols-2">
            <Reveal className="lux-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={config.founder?.imageId ? `/api/images/${config.founder.imageId}` : "/10.jpg"}
                alt="Founder"
                className="aspect-[4/5] w-full object-cover"
              />
            </Reveal>
            <div>
              <SectionHeading
                eyebrow={config.founder?.eyebrow}
                script={config.founder?.scriptTitle}
                title={config.founder?.title}
                typography={config.founder?.typography}
              />
              <Reveal delay={150}>
                <ul className={`mt-8 space-y-3 text-sm uppercase tracking-[0.25em] text-ink/60 ${config.founder?.typography?.subtitleFont || ''}`} style={{ color: config.founder?.textColor ? 'inherit' : undefined }}>
                  {config.founder?.bullets?.map((b: string, i: number) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
                <p className={`mt-8 leading-relaxed text-ink/70 ${config.founder?.typography?.subtitleFont || ''}`} style={{ color: config.founder?.textColor ? 'inherit' : undefined }}>
                  {config.founder?.content}
                </p>
                <div className="mt-10">
                  <GoldLink href={config.founder?.buttonLink || "#"}>{config.founder?.buttonLabel}</GoldLink>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {config.stats?.isVisible !== false && (
        <section 
          className="bg-petal/50 py-20"
          style={{ backgroundColor: config.stats?.bgColor || undefined, color: config.stats?.textColor || undefined }}
        >
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 text-center md:grid-cols-4">
            {config.stats?.items?.map((s: any, i: number) => (
              <Reveal key={s.label} delay={i * 100}>
                <p className={`text-5xl text-gold-deep md:text-6xl ${config.stats?.typography?.titleFont || 'h-display'}`}>{s.n}</p>
                <p className={`mt-2 text-[0.62rem] uppercase tracking-[0.3em] text-ink/60 ${config.stats?.typography?.eyebrowFont || ''}`} style={{ color: config.stats?.textColor ? 'inherit' : undefined }}>
                  {s.label}
                </p>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {config.philosophy?.isVisible !== false && (
        <section 
          className="mx-auto max-w-7xl px-6 py-24 md:py-32"
          style={{ backgroundColor: config.philosophy?.bgColor || undefined, color: config.philosophy?.textColor || undefined }}
        >
          <SectionHeading eyebrow={config.philosophy?.eyebrow} title={config.philosophy?.title} center typography={config.philosophy?.typography} />
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {config.philosophy?.values?.map((v: any, i: number) => (
              <Reveal key={v.title} delay={i * 120}>
                <div className="h-full border border-ink/10 bg-white/60 p-10 text-center backdrop-blur-sm shadow-sm" style={{ backgroundColor: config.philosophy?.bgColor ? 'transparent' : undefined }}>
                  <p className={`text-3xl text-gold ${config.philosophy?.typography?.subtitleFont || 'font-script'}`}>{String(i + 1).padStart(2, "0")}</p>
                  <h3 className={`mt-4 text-2xl ${config.philosophy?.typography?.titleFont || 'h-display'}`}>{v.title}</h3>
                  <p className={`mt-4 text-sm leading-relaxed text-ink/60 ${config.philosophy?.typography?.subtitleFont || ''}`} style={{ color: config.philosophy?.textColor ? 'inherit' : undefined }}>{v.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mx-auto mt-24 max-w-3xl border-l-2 border-gold pl-8">
            <p className={`eyebrow ${config.philosophy?.typography?.hideEyebrowOnMobile !== false ? 'hidden md:block' : 'block text-[0.6rem] md:text-xs'} ${config.philosophy?.typography?.eyebrowFont || ''}`} style={{ color: config.philosophy?.textColor || undefined }}>Mission</p>
            <p className={`mt-3 text-2xl leading-relaxed text-ink/80 ${config.philosophy?.typography?.subtitleFont || 'font-serif'}`} style={{ color: config.philosophy?.textColor ? 'inherit' : undefined }}>
              {config.philosophy?.mission}
            </p>
            <p className={`eyebrow mt-10 ${config.philosophy?.typography?.hideEyebrowOnMobile !== false ? 'hidden md:block' : 'block text-[0.6rem] md:text-xs'} ${config.philosophy?.typography?.eyebrowFont || ''}`} style={{ color: config.philosophy?.textColor || undefined }}>Vision</p>
            <p className={`mt-3 text-2xl leading-relaxed text-ink/80 ${config.philosophy?.typography?.subtitleFont || 'font-serif'}`} style={{ color: config.philosophy?.textColor ? 'inherit' : undefined }}>
              {config.philosophy?.vision}
            </p>
          </Reveal>
        </section>
      )}

      {/* Testimonials Section */}
      {config.testimonials?.isVisible !== false && (
        <section 
          className="bg-bone py-24 md:py-32 border-t border-ink/8"
          style={{ backgroundColor: config.testimonials?.bgColor || undefined, color: config.testimonials?.textColor || undefined }}
        >
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeading
              eyebrow="KIND WORDS FROM OUR"
              script="blessed couples"
              title="TEB Family Stories"
              center
              typography={config.testimonials?.typography}
            />
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {fallbackTestimonials.map((t, i) => (
                <Reveal key={t.id} delay={i * 120}>
                  <figure className="flex h-full flex-col border border-ink/10 bg-white/70 backdrop-blur-sm p-8 md:p-10 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-md" style={{ backgroundColor: config.testimonials?.bgColor ? 'transparent' : undefined }}>
                    <div className="flex items-center gap-1 text-gold text-sm">
                      {"★".repeat(t.rating ?? 5)}
                    </div>
                    <blockquote className={`mt-6 flex-1 text-lg leading-relaxed text-ink/80 italic ${config.testimonials?.typography?.subtitleFont || 'font-serif'}`} style={{ color: config.testimonials?.textColor ? 'inherit' : undefined }}>
                      “{t.quote}”
                    </blockquote>
                    <figcaption className="mt-8 pt-6 border-t border-ink/10">
                      <p className={`text-xl text-ink ${config.testimonials?.typography?.titleFont || 'h-display'}`} style={{ color: config.testimonials?.textColor ? 'inherit' : undefined }}>{t.couple}</p>
                      <p className={`mt-1 text-[0.62rem] uppercase tracking-[0.3em] text-gold-deep ${config.testimonials?.typography?.eyebrowFont || 'font-sans'}`}>
                        {t.event} · {t.location}
                      </p>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <Marquee items={["Trust", "Craftsmanship", "Elegance", "Emotion"]} />

      {config.cta?.isVisible !== false && (
        <section 
          className="relative overflow-hidden bg-ink py-16 text-center text-bone md:py-20"
          style={{ backgroundColor: config.cta?.bgColor || undefined, color: config.cta?.textColor || undefined }}
        >
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={config.cta?.imageId ? `/api/images/${config.cta.imageId}` : "/12.jpg"}
              alt="Luxury Wedding"
              className="h-full w-full object-cover opacity-35 scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/80 to-ink/90" />
          </div>
          <Reveal className="relative z-10 mx-auto max-w-2xl px-6">
            <h2 className={`text-3xl md:text-5xl ${config.cta?.typography?.titleFont || 'h-display'}`}>
              {config.cta?.title}
            </h2>
            <div className="mt-8 flex justify-center">
              <GoldLink href={config.cta?.buttonLink || "#"} dark>
                {config.cta?.buttonLabel}
              </GoldLink>
            </div>
          </Reveal>
        </section>
      )}
    </>
  );
}
