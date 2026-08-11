import Link from "next/link";
import { connectToDatabase } from "@/lib/mongodb";
import HomeConfig from "@/models/HomeConfig";

import {
  Reveal,
  SectionHeading,
  GoldLink,
  Marquee,
  ExploreCards,
  SwipeableStories,
} from "@/components/ui";
import HeroCarousel from "@/components/HeroCarousel";
import HomeImageGallery from "@/components/HomeImageGallery";
import {
  SITE,
  highlights,
  portfolio,
  processSteps,
} from "@/lib/data";

export const dynamic = "force-dynamic";

const experiences = [
  {
    title: "Wedding Planning",
    href: "/wedding-planning",
    image: "/6.jpg",
    note: "Complete celebration curation",
  },
  {
    title: "Photography",
    href: "/wedding-photography",
    image: "/7.jpg",
    note: "Editorial, candid, timeless",
  },
  {
    title: "Wedding Films",
    href: "/wedding-films",
    image: "/8.jpg",
    note: "Cinema from your celebration",
  },
  {
    title: "Destinations",
    href: "/destination-weddings",
    image: "/9.jpg",
    note: "Palaces, beaches, beyond",
  },
];

const collections = [
  { title: "Maternity", href: "/maternity-photography", image: "/DSC-1288-Original Final copy.jpg" },
  { title: "Newborn", href: "/newborn-photography", image: "/DSC_0227.jpg" },
  { title: "Family", href: "/family-photography", image: "/DSC_0273 copy 2.png" },
];

export default async function HomePage() {
  await connectToDatabase();
  let config = await HomeConfig.findById("home").lean();

  if (!config) {
    config = {
      hero: {
        subtitle: "Creating timeless memories",
        title: "Where every celebration becomes",
        titleHighlight: "\"Eternal\"",
        imageIds: []
      },
      explore: {
        layout: "carousel",
        cardShape: "portrait",
        spacing: "medium",
        items: []
      },
      gallery: {},
      stories: {},
      cta: {}
    };
  }

  const heroImages = config.hero.imageIds.length > 0
    ? config.hero.imageIds.map((id: string) => `/api/images/${id}`)
    : ["/DSC_0504.jpg", "/DSC_0635 copy.jpg", "/DSC_0724.jpg", "/1A7A1097.JPG"];

  const exploreItems = config.explore.items.length > 0
    ? config.explore.items.map((item: any) => ({
      label: item.label,
      href: item.href,
      image: item.imageId ? `/api/images/${item.imageId}` : "/12.jpg"
    }))
    : highlights;

  return (
    <>
      {/* 1 — Cinematic Hero */}
      {config.hero?.isVisible !== false && (
        <section 
          className="relative flex min-h-svh items-end overflow-hidden bg-ink"
          style={{ 
            backgroundColor: config.hero?.bgColor || undefined, 
            color: config.hero?.textColor || undefined 
          }}
        >
          <div className="absolute inset-0">
          <HeroCarousel images={heroImages} />
        </div>
        <div className="relative mx-auto w-full max-w-7xl px-6 pb-24 pt-40 md:pb-32">
          <p
            className={`fade-up ${config.hero.typography?.subtitleFont || 'font-script'} mt-6 text-bone`}
            style={{ animationDelay: "0.6s", fontSize: "var(--hero-subtitle-size)" }}
          >
            {config.hero.subtitle}
          </p>
          <h1
            className={`fade-up ${config.hero.typography?.titleFont || 'h-display'} mt-2 max-w-5xl text-bone`}
            style={{ animationDelay: "0.8s", fontSize: "var(--hero-title-size)", lineHeight: "1.1" }}
          >
            {config.hero.title} <span className="font-sans text-white  font-bold text-[0.9em] inline-block -translate-y-1 uppercase">{config.hero.titleHighlight}</span>
          </h1>
          <div
            className="fade-up mt-10 flex flex-wrap items-center gap-6"
            style={{ animationDelay: "1.05s" }}
          >
            <GoldLink href="/contact" dark>
              Begin Your Story
            </GoldLink>
            <Link
              href="/portfolio"
              className="link-underline text-[0.7rem] uppercase tracking-[0.35em] text-bone/80"
            >
              View Portfolio
            </Link>
          </div>
        </div>
        <div className={`absolute bottom-8 right-8 ${config.hero.typography?.hideEyebrowOnMobile !== false ? 'hidden md:block' : 'block text-[0.4rem] md:text-[0.6rem]'} text-[0.6rem] uppercase tracking-[0.4em] text-bone/50 ${config.hero.typography?.eyebrowFont || 'font-sans'}`}>
          Since 2016
        </div>
      </section>
      )}

      {/* 2 — Explore Cards Section */}
      {config.explore?.isVisible !== false && (
        <section 
          className="border-b border-ink/8 bg-bone py-16 md:py-24"
          style={{ 
            backgroundColor: config.explore?.bgColor || undefined, 
            color: config.explore?.textColor || undefined 
          }}
        >
          <Reveal>
            <p className={`eyebrow mb-12 text-center ${config.explore.typography?.hideEyebrowOnMobile !== false ? 'hidden md:block' : 'block text-xs md:text-sm'} ${config.explore.typography?.eyebrowFont || ''}`} style={{ color: config.explore?.textColor || undefined }}>Explore Our World</p>
          {exploreItems.length > 0 ? (
            <ExploreCards
              items={exploreItems}
              layout={config.explore.layout}
              cardShape={config.explore.cardShape}
              spacing={config.explore.spacing}
              hideEyebrowTextOnMobile={config.explore.hideEyebrowTextOnMobile}
              titleFont={config.explore.titleFont}
            />
          ) : (
            <p className="text-center text-ink/50 text-sm">No explore items configured yet.</p>
          )}
        </Reveal>
        </section>
      )}

      {/* 3 — Editorial Image Showcase */}
      {config.gallery?.isVisible !== false && (
        <div style={{ backgroundColor: config.gallery?.bgColor || undefined, color: config.gallery?.textColor || undefined }}>
          <HomeImageGallery />
        </div>
      )}



      {/* Marquee */}
      {/* <Marquee
        items={["Planning", "Photography", "Films", "Decor", "Destinations", "Studio"]}
      /> */}

      {/* 4 — Signature Experiences */}
      {/* <section className="bg-ink py-24 text-bone md:py-36">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <SectionHeading
              eyebrow="Signature Experiences"
              title="One house, every craft"
              light
            />
            <Reveal delay={200}>
              <GoldLink href="/contact" dark>
                Get in Touch
              </GoldLink>
            </Reveal>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-4">
            {experiences.map((e, i) => (
              <Reveal key={e.title} delay={i * 100}>
                <Link href={e.href} className="group block">
                  <div className="lux-img">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
      {/* <img
                      src={e.image}
                      alt={e.title}
                      className="aspect-[3/4] w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <p className="mt-5 text-[0.6rem] uppercase tracking-[0.35em] text-bone">
                    {e.note}
                  </p>
                  <h3 className="h-display mt-2 text-2xl text-bone transition-colors group-hover:text-bone">
                    {e.title} <span className="text-bone">→</span>
                  </h3>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section> */}

      {/* 5 — Wedding Stories */}
      {config.stories?.isVisible !== false && (
        <section 
          className="mx-auto max-w-7xl px-6 py-24 md:py-36"
          style={{ 
            backgroundColor: config.stories?.bgColor || undefined, 
            color: config.stories?.textColor || undefined 
          }}
        >
          <SectionHeading
          eyebrow="WEDDING STORIES"
          script=""
          title=""
          center
          typography={config.stories?.typography}
        />
        <div className="mt-16">
          <SwipeableStories items={portfolio.slice(0, 5)} />
        </div>
        <Reveal className="mt-14 text-center">
          <GoldLink href="/portfolio">View Full Portfolio</GoldLink>
        </Reveal>
        </section>
      )}

      {/* 6 — Featured Film */}
      {/* <section className="relative overflow-hidden bg-ink">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
      {/* <img
            src="/DSC_0508.JPG"
            alt="Featured wedding film"
            className="h-full w-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/80 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-32 md:py-44">
          <Reveal>
            <p className="eyebrow">Featured Film</p>
            <p className="font-script mt-4 text-4xl text-bone">Meera & Kabir</p>
            <h2 className="h-display mt-2 max-w-2xl text-4xl text-bone md:text-6xl">
              “A sunset in Goa, and a promise for every lifetime”
            </h2>
            <div className="mt-10 flex items-center gap-6">
              <Link
                href="/wedding-films"
                className="group flex h-20 w-20 items-center justify-center rounded-full border border-bone/40 text-bone transition-all duration-500 hover:scale-105 hover:border-gold hover:text-bone"
                aria-label="Watch wedding films"
              >
                <span className="ml-1 text-xl">▶</span>
              </Link>
              <span className="text-[0.65rem] uppercase tracking-[0.35em] text-bone/60">
                Watch our films
              </span>
            </div>
          </Reveal>
        </div>
      </section> */}

      {/* 7+8 — Decor Gallery & Photography Collections */}
      {/* <section className="mx-auto max-w-7xl px-6 py-24 md:py-36">
        <div className="grid items-center gap-14 md:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Decor & Design"
              script="spaces that feel like poetry"
              title="Venues transformed into dreamscapes"
            />
            <Reveal delay={150}>
              <p className="mt-8 leading-relaxed text-ink/70">
                Mandaps that frame your vows, florals that perfume the evening,
                stages designed like editorials. Our in-house decor studio
                designs every function from a blank canvas.
              </p>
              <div className="mt-10">
                <GoldLink href="/wedding-decor">Explore Decor</GoldLink>
              </div>
            </Reveal>
          </div>
          <Reveal className="lux-img" delay={100}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
      {/* <img
              src="/DSC_0548 (1).JPG"
              alt="Luxury wedding decor"
              className="aspect-[4/5] w-full object-cover"
              loading="lazy"
            />
          </Reveal>
        </div> */}
      {/* 
      <div className="mt-28">
        <SectionHeading
          eyebrow="The Photography Studio"
          title="Life's gentlest chapters, beautifully kept"
          center
        />
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {collections.map((c, i) => (
            <Reveal key={c.title + i} delay={i * 120}>
              <Link href={c.href} className="group block">
                <div className="lux-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
      {/* <img
        src={c.image}
        alt={`${c.title} photography`}
        className="aspect-square w-full object-cover"
        loading="lazy"
      />
    </div >
      <h3 className="h-display mt-5 text-center text-2xl transition-colors group-hover:text-ink">
        {c.title}
      </h3>
              </Link >
            </Reveal > */}
      {/* // )) */}
      {/* } */}
      {/* // </div > */}
      {/* // </div > */}
      {/* // </section > */}

      {/* 9 — Planning Process */}
      {/* < section className="bg-petal/50 py-24 md:py-32" >
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading eyebrow="The Process" title="How the magic unfolds" center />
          <div className="mt-16 grid gap-10 md:grid-cols-4">
            {processSteps.map((s, i) => (
              <Reveal key={s.n} delay={i * 120} className="text-center md:text-left">
                <p className="h-display text-6xl text-bone/50">{s.n}</p>
                <h3 className="h-display mt-4 text-2xl">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/60">{s.detail}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section > */}



      {/* 11 — Instagram Feed */}
      {/* < section className="border-y border-ink/8 bg-bone py-20" >
        <Reveal className="text-center">
          <p className="eyebrow">Instagram</p>
          <p className="font-script mt-3 text-4xl text-bone">{SITE.instagram}</p>
        </Reveal>
        <div className="mt-12 grid grid-cols-3 gap-2 px-2 md:grid-cols-6">
          {["/10.jpg", "/11.jpg", "/12.jpg", "/6.jpg", "/7.jpg", "/8.jpg"].map(
            (img, i) => (
              <Reveal key={img} delay={i * 80} className="lux-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
      {/* <img
                  src={img}
                  alt="The Eternal Bliss on Instagram"
                  className="aspect-square w-full object-cover"
                  loading="lazy"
                />
              </Reveal>
            )
          )}
        </div>
      </section > */}

      {/* 12 — CTA */}
      {config.cta?.isVisible !== false && (
        <section 
          className="relative overflow-hidden bg-ink py-16 text-center text-bone md:py-24"
          style={{ 
            backgroundColor: config.cta?.bgColor || undefined, 
            color: config.cta?.textColor || undefined 
          }}
        >
          {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/DSC_0508.JPG"
            alt="Luxury Wedding"
            className="h-full w-full object-cover opacity-40 scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/80 to-ink/90" />
        </div>

        <Reveal className="relative z-10 mx-auto max-w-3xl px-6">
          <p className="font-script text-3xl text-gold md:text-4xl">your forever begins here</p>
          <h2 className="h-display mt-2 text-3xl md:text-5xl">
            Let&apos;s create something eternal
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-xs md:text-sm leading-relaxed text-bone/70">
            Tell us about your celebration — a wedding, a destination dream, a
            new life on the way. We&apos;ll write back within 24 hours.
          </p>
          <div className="mt-8 flex justify-center">
            <GoldLink href="/contact" dark>
              Enquire Now
            </GoldLink>
          </div>
        </Reveal>
        </section>
      )}
    </>
  );
}
