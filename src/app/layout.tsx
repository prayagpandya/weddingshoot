import type { Metadata } from "next";
import type { ReactNode } from "react";
import { connectToDatabase } from "@/lib/mongodb";
import ThemeConfig from "@/models/ThemeConfig";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  metadataBase: new URL("https://theeternalbliss.in"),
  title: {
    default: "The Eternal Bliss | Luxury Wedding Experiences Since 2016",
    template: "%s | The Eternal Bliss",
  },
  description:
    "The Eternal Bliss is a luxury wedding experience house — wedding planning, photography, cinematic films, decor, destination weddings, maternity and newborn photography. Creating timeless memories since 2016.",
  openGraph: {
    title: "The Eternal Bliss | Luxury Wedding Experiences",
    description:
      "Complete luxury wedding experiences — planning, decor, photography, films and celebration curation by Garima Dhingra. Since 2016.",
    type: "website",
    images: [{ url: "/12.jpg", width: 1200, height: 630 }],
  },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "The Eternal Bliss",
  slogan: "Creating Timeless Memories Since 2016",
  founder: { "@type": "Person", name: "Garima Dhingra" },
  email: "hello@theeternalbliss.in",
  areaServed: "India",
  knowsAbout: [
    "Wedding Planning",
    "Wedding Photography",
    "Wedding Films",
    "Wedding Decor",
    "Destination Weddings",
    "Newborn Photography",
  ],
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  await connectToDatabase();
  let themeConfig = await ThemeConfig.findById("theme").lean();
  
  if (!themeConfig) {
    themeConfig = {
      colors: {
        ink: "#000000",
        bone: "#edddd3",
        gold: "#c5a880",
        background: "#edddd3",
      },
      typography: {
        heroTitleSize: 2.5,
        heroSubtitleSize: 1.25,
        exploreTitleSize: 1.125,
        sectionHeadingSize: 1.75,
      }
    };
  }

  const getResponsiveFontSize = (val: number) => {
    return `clamp(${val * 0.5}rem, ${val}vw + 1rem, ${val}rem)`;
  };

  const customThemeCSS = `
    :root {
      --color-ink: ${themeConfig.colors?.ink || '#000000'} !important;
      --color-bone: ${themeConfig.colors?.bone || '#edddd3'} !important;
      --color-gold: ${themeConfig.colors?.gold || '#c5a880'} !important;
      --color-background: ${themeConfig.colors?.background || '#edddd3'} !important;
      
      --hero-title-size: ${getResponsiveFontSize(themeConfig.typography?.heroTitleSize || 2.5)} !important;
      --hero-subtitle-size: ${getResponsiveFontSize(themeConfig.typography?.heroSubtitleSize || 1.25)} !important;
      --explore-title-size: ${getResponsiveFontSize(themeConfig.typography?.exploreTitleSize || 1.125)} !important;
      --section-heading-size: ${getResponsiveFontSize(themeConfig.typography?.sectionHeadingSize || 1.75)} !important;
    }
    
    body {
      background-color: var(--color-background) !important;
      color: var(--color-ink) !important;
    }
  `;

  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: customThemeCSS }} />
      </head>
      <body className="bg-bone text-ink antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <SmoothScroll>
          <Nav />
          <main className="pb-14 md:pb-0">{children}</main>
          <Footer />
          <WhatsAppButton />
        </SmoothScroll>
      </body>
    </html>
  );
}
