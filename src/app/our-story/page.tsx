import type { Metadata } from "next";
import { Reveal, SectionHeading, GoldLink } from "@/components/ui";
import { connectToDatabase } from "@/lib/mongodb";
import OurStoryConfig from "@/models/OurStoryConfig";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Story — From One Camera to a Wedding Experience House",
  description:
    "The journey of The Eternal Bliss — founded in 2016 by Garima Dhingra, growing from a photography studio into a complete luxury wedding experience brand.",
};

export default async function OurStoryPage() {
  await connectToDatabase();
  let config = await OurStoryConfig.findById("our-story").lean();

  if (!config) {
    config = {
      hero: {
        imageId: "",
        eyebrow: "Our Story",
        scriptTitle: "since 2016",
        title: "Every love story deserves a storyteller",
        isVisible: true
      },
      timeline: {
        chapters: [
          {
            year: "2016",
            title: "A camera and a conviction",
            detail: "Garima Dhingra photographs her first wedding — and realises that what she is capturing is not events, but heirlooms. The Eternal Bliss is born.",
            imageId: ""
          },
          {
            year: "2018",
            title: "The studio opens its doors",
            detail: "Certified in newborn photography, Garima expands into maternity, newborn and family portraiture — life's gentlest chapters, kept forever.",
            imageId: ""
          },
          {
            year: "2020",
            title: "Films join the frame",
            detail: "A cinematography wing brings weddings to life in motion — teasers, feature films, drone cinema and same-day edits premiered at receptions.",
            imageId: ""
          },
          {
            year: "2022",
            title: "Design becomes destiny",
            detail: "The decor and planning studios launch. Mandaps, floral styling, complete production — The Eternal Bliss becomes a full experience house.",
            imageId: ""
          },
          {
            year: "Today",
            title: "Destinations without limits",
            detail: "From Udaipur's palaces to Goa's shores and beyond India's borders — 450+ celebrations later, the mission remains beautifully unchanged.",
            imageId: ""
          }
        ],
        isVisible: true
      },
      cta: {
        eyebrow: "The Next Chapter",
        title: "Perhaps it begins with you",
        buttonLabel: "Write It With Us",
        buttonLink: "/contact",
        isVisible: true
      }
    };
  }

  return (
    <>
      {config.hero?.isVisible !== false && (
        <section 
          className="relative flex min-h-[70svh] items-end overflow-hidden bg-ink"
          style={{ backgroundColor: config.hero?.bgColor || undefined, color: config.hero?.textColor || undefined }}
        >
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={config.hero?.imageId ? `/api/images/${config.hero.imageId}` : "/1S6A3355.JPG"}
              alt="The Eternal Bliss story"
              className="hero-zoom h-full w-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/40" />
          </div>
          <div className="relative mx-auto w-full max-w-7xl px-6 pb-20 pt-44">
            <p className={`fade-up eyebrow ${config.hero?.typography?.hideEyebrowOnMobile !== false ? 'hidden md:block' : 'block text-[0.6rem] md:text-xs'} ${config.hero?.typography?.eyebrowFont || ''}`} style={{ color: config.hero?.textColor || undefined }}>{config.hero?.eyebrow}</p>
            <p className={`fade-up mt-5 text-4xl text-gold ${config.hero?.typography?.subtitleFont || 'font-script'}`} style={{ animationDelay: "0.15s" }}>
              {config.hero?.scriptTitle}
            </p>
            <h1 className={`fade-up mt-2 max-w-4xl text-4xl text-bone md:text-7xl ${config.hero?.typography?.titleFont || 'h-display'}`} style={{ animationDelay: "0.3s", color: config.hero?.textColor || undefined }}>
              {config.hero?.title}
            </h1>
          </div>
        </section>
      )}

      {config.timeline?.isVisible !== false && (
        <section 
          className="mx-auto max-w-5xl px-6 py-24 md:py-32"
          style={{ backgroundColor: config.timeline?.bgColor || undefined, color: config.timeline?.textColor || undefined }}
        >
          <div className="space-y-24">
            {config.timeline?.chapters?.map((c: any, i: number) => (
              <Reveal key={c.year + i}>
                <div
                  className={`grid items-center gap-10 md:grid-cols-2 ${
                    i % 2 ? "md:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <div className="lux-img">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={c.imageId ? `/api/images/${c.imageId}` : (i === 0 ? "/1A7A1097.JPG" : i === 1 ? "/1A7A1150.JPG" : i === 2 ? "/1A7A1477.JPG" : i === 3 ? "/1A7A1555.JPG" : "/1S6A3248.JPG")}
                      alt={c.title}
                      className="aspect-[4/3] w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <p className={`text-4xl text-gold ${config.timeline?.typography?.subtitleFont || 'font-script'}`}>{c.year}</p>
                    <h2 className={`mt-3 text-3xl md:text-4xl ${config.timeline?.typography?.titleFont || 'h-display'}`} style={{ color: config.timeline?.textColor || undefined }}>{c.title}</h2>
                    <div className="gold-rule mt-5" />
                    <p className={`mt-6 leading-relaxed text-ink/70 ${config.timeline?.typography?.subtitleFont || ''}`} style={{ color: config.timeline?.textColor ? 'inherit' : undefined }}>{c.detail}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {config.cta?.isVisible !== false && (
        <section 
          className="bg-petal/50 py-24 text-center"
          style={{ backgroundColor: config.cta?.bgColor || undefined, color: config.cta?.textColor || undefined }}
        >
          <Reveal className="mx-auto max-w-2xl px-6">
            <SectionHeading
              eyebrow={config.cta?.eyebrow}
              title={config.cta?.title}
              center
              typography={config.cta?.typography}
            />
            <div className="mt-10 flex justify-center">
              <GoldLink href={config.cta?.buttonLink || "#"}>{config.cta?.buttonLabel}</GoldLink>
            </div>
          </Reveal>
        </section>
      )}
    </>
  );
}
