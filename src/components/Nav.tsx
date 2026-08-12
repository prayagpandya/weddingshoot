"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Our Story", href: "/our-story" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Contact", href: "/contact" },
];

const serviceLinks = [
  { label: "Wedding Planning", href: "/wedding-planning" },
  { label: "Wedding Photography", href: "/wedding-photography" },
  { label: "Wedding Films", href: "/wedding-films" },
  { label: "Wedding Decor", href: "/wedding-decor" },
  { label: "Destination Weddings", href: "/destination-weddings" },
  { label: "Maternity", href: "/maternity-photography" },
  { label: "Newborn", href: "/newborn-photography" },
  { label: "Family", href: "/family-photography" },
];

export default function Nav({ socialLinks }: { socialLinks?: any }) {
  const [scrolled, setScrolled] = useState(false);

  const fallbackLinks = socialLinks || {
    instagram: "https://instagram.com",
  };

  const SocialIcons = ({ className = "" }: { className?: string }) => (
    <div className={`flex items-center gap-4 ${className}`}>
      {fallbackLinks?.instagram && (
        <a href={fallbackLinks.instagram} target="_blank" rel="noreferrer" className="transition-colors hover:text-gold">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
        </a>
      )}
      {fallbackLinks?.facebook && (
        <a href={fallbackLinks.facebook} target="_blank" rel="noreferrer" className="transition-colors hover:text-gold">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        </a>
      )}
      {fallbackLinks?.youtube && (
        <a href={fallbackLinks.youtube} target="_blank" rel="noreferrer" className="transition-colors hover:text-gold">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
        </a>
      )}
    </div>
  );
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const headerDark = open ? false : scrolled;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          open
            ? "bg-ink/90 backdrop-blur-md"
            : headerDark
            ? "bg-bone/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)]"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto relative flex max-w-7xl items-center justify-between px-6 py-4 md:py-5">
          {/* Left Side */}
          <div className="flex flex-1 justify-start items-center">
            <button
              onClick={() => setOpen(!open)}
              aria-label="Menu"
              className={`flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.3em] lg:hidden ${
                headerDark ? "text-ink" : "text-bone"
              }`}
            >
              <span className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 border border-current/30 rounded-full">
                <span
                  className={`block h-px w-4 bg-current transition-transform duration-300 ${
                    open ? "translate-y-[3.5px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`block h-px w-4 bg-current transition-transform duration-300 ${
                    open ? "-translate-y-[3.5px] -rotate-45" : ""
                  }`}
                />
              </span>
              <span className="hidden md:inline">{open ? "Close" : "Menu"}</span>
            </button>
            <nav className="hidden items-center gap-5 xl:gap-8 lg:flex">
              {["/", "/about", "/our-story"].map((href) => {
                const link = links.find((l) => l.href === href)!;
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`link-underline text-[0.68rem] uppercase tracking-[0.3em] transition-colors whitespace-nowrap ${
                      isActive
                        ? headerDark
                          ? "text-gold-deep font-semibold"
                          : "text-gold font-semibold"
                        : headerDark
                        ? "text-ink/80 hover:text-ink"
                        : "text-bone/85 hover:text-bone"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Center Logo */}
          <div className="flex justify-center lg:px-8">
            <Link href="/" className="group flex flex-col items-center">
              <img
                src="/teb logo.png"
                alt="The Eternal Bliss Logo"
                className={`h-16 sm:h-20 md:h-24 w-auto object-contain transition-all duration-500 ${
                  !headerDark ? "brightness-0 invert" : ""
                }`}
              />
              <span
                className={`block text-[0.55rem] uppercase tracking-[0.2em] transition-colors mt-2 ${
                  headerDark ? "text-gold-deep" : "text-gold"
                }`}
              >
                Since 2016
              </span>
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex flex-1 justify-end items-center gap-5 xl:gap-8">
            <nav className="hidden items-center gap-5 xl:gap-8 lg:flex">
              {["/portfolio", "/testimonials", "/contact"].map((href) => {
                const link = links.find((l) => l.href === href)!;
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`link-underline text-[0.68rem] uppercase tracking-[0.3em] transition-colors whitespace-nowrap ${
                      isActive
                        ? headerDark
                          ? "text-gold-deep font-semibold"
                          : "text-gold font-semibold"
                        : headerDark
                        ? "text-ink/80 hover:text-ink"
                        : "text-bone/85 hover:text-bone"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden lg:flex items-center">
              <SocialIcons className={`${headerDark ? "text-ink/80" : "text-bone/85"}`} />
            </div>
          </div>
        </div>
      </header>

      {/* Full-screen menu */}
      <div
        className={`fixed inset-0 z-40 bg-ink text-bone transition-all duration-500 ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="mx-auto flex h-full max-w-7xl flex-col justify-start gap-10 overflow-y-auto px-8 pt-36 pb-32 md:flex-row md:items-center md:justify-center md:gap-24 md:pt-24 md:pb-16">
          <div>
            <p className="eyebrow mb-6 text-gold">Explore</p>
            <ul className="space-y-4">
              {links.map((l, i) => {
                const isActive = pathname === l.href;
                return (
                  <li
                    key={l.href}
                    style={{ transitionDelay: `${i * 40}ms` }}
                    className={`transition-all duration-700 ${
                      open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                    }`}
                  >
                    <Link
                      href={l.href}
                      className={`h-display text-3xl transition-colors md:text-5xl ${
                        isActive ? "text-gold font-medium" : "text-bone/85 hover:text-gold"
                      }`}
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="eyebrow mb-6 text-gold">Services</p>
            <ul className="space-y-3">
              {serviceLinks.map((l, i) => (
                <li
                  key={l.href}
                  style={{ transitionDelay: `${200 + i * 40}ms` }}
                  className={`transition-all duration-700 ${
                    open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                  }`}
                >
                  <Link
                    href={l.href}
                    className="text-xs uppercase tracking-[0.25em] text-bone/60 transition-colors hover:text-gold md:text-sm"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="font-script mt-10 text-2xl text-gold md:text-3xl">
              Creating timeless memories
            </p>
            <div className={`mt-8 transition-all duration-700 ${open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`} style={{ transitionDelay: '500ms' }}>
              <p className="eyebrow mb-4 text-gold">Follow Us</p>
              <SocialIcons className="text-bone/70" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom CTA */}
      <div className={`fixed inset-x-0 bottom-0 z-30 ${open ? "hidden" : "flex md:hidden"}`}>
        <Link
          href="/contact"
          className="flex-1 bg-ink py-4 text-center text-[0.7rem] uppercase tracking-[0.35em] text-bone"
        >
          Enquire Now
        </Link>
        <a
          href="tel:+919810000000"
          className="flex-1 bg-gold py-4 text-center text-[0.7rem] uppercase tracking-[0.35em] text-ink"
        >
          Call Us
        </a>
      </div>
    </>
  );
}
