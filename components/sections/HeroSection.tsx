"use client";

import { useState } from "react";
import HeroCanvas from "@/components/3d/HeroCanvas";
import Image from "next/image";

type HeroSectionProps = {
  kicker: string;
  title: string;
  subtitle: string;
};

export default function HeroSection({
  kicker,
  title,
  subtitle,
}: HeroSectionProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <section className="relative overflow-hidden px-4 pb-4 pt-6 md:px-6" id="hero">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[1.8rem] border border-[#d9c6a1]/16 bg-[#101925] panel-glow">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(239,228,209,0.02),rgba(239,228,209,0)_18%)]" />

        <div className="relative z-10 px-4 py-4 md:px-7 md:py-5">
          <header className="flex items-center justify-between border-b border-[#d9c6a1]/16 pb-4">
            <div className="flex items-center gap-3">
              <div className="relative h-9 w-9 overflow-hidden rounded-[0.4rem] border border-[#d9c6a1]/45 bg-[#6a1b2d]">
                <Image
                  src="/favicon.ico"
                  alt="Sahil Narula Atelier mark"
                  fill
                  sizes="36px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="leading-none">
                <p className="font-sans text-[9px] uppercase tracking-[0.45em] text-[#d9c6a1]">Sahil Narula Atelier</p>
                <p className="mt-1 font-display text-sm tracking-[0.18em] text-[#f0e5d3]">Automotive Bespoke Division</p>
              </div>
            </div>

            <nav className="hidden items-center gap-6 text-[10px] uppercase tracking-[0.32em] text-[#c0b4a2] md:flex lg:gap-8">
              <a href="#hero" className="transition hover:text-[#f0e5d3]">Home</a>
              <a href="#about" className="transition hover:text-[#f0e5d3]">About</a>
              <a href="#features" className="transition hover:text-[#f0e5d3]">Services</a>
              <a href="#video" className="transition hover:text-[#f0e5d3]">Product</a>
              <a href="#contact" className="transition hover:text-[#f0e5d3]">Contact</a>
            </nav>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="grid h-9 w-9 place-items-center rounded-full border border-[#d9c6a1]/20 bg-white/8 text-[#f0e5d3] md:hidden"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav"
            >
              <span className="block h-px w-4 bg-current" />
            </button>
          </header>

          {mobileMenuOpen ? (
            <nav
              id="mobile-nav"
              className="mt-4 grid gap-2 rounded-2xl border border-[#d9c6a1]/20 bg-[#0f1824]/95 p-4 text-[10px] uppercase tracking-[0.3em] text-[#c8bbab] md:hidden"
            >
              <a href="#hero" onClick={() => setMobileMenuOpen(false)} className="py-2 transition hover:text-[#f0e5d3]">Home</a>
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="py-2 transition hover:text-[#f0e5d3]">About</a>
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="py-2 transition hover:text-[#f0e5d3]">Services</a>
              <a href="#video" onClick={() => setMobileMenuOpen(false)} className="py-2 transition hover:text-[#f0e5d3]">Product</a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="py-2 transition hover:text-[#f0e5d3]">Contact</a>
            </nav>
          ) : null}

          <div className="grid gap-8 py-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:py-14">
            <div data-reveal className="max-w-xl space-y-5 lg:pr-4">
              <p className="font-sans text-[10px] uppercase tracking-[0.45em] text-[#d0b07a]">{kicker}</p>
              <h1 className="max-w-[15ch] whitespace-pre-line font-display text-[clamp(2.8rem,5.2vw,4.4rem)] uppercase leading-[0.92] tracking-[0.015em] text-[#f0e5d3]">
                {title}
              </h1>
              <p className="max-w-md text-sm leading-relaxed text-[#c5baab] sm:text-base">{subtitle}</p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#contact"
                  className="rounded-[0.35rem] border border-[#d9c6a1]/45 bg-[#7b1f33] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#fbf6ef] transition hover:bg-[#5f1628]"
                >
                  Begin Your Commission
                </a>
                <a
                  href="#features"
                  className="inline-flex items-center gap-2 rounded-[0.25rem] px-1 py-3 text-[10px] font-medium uppercase tracking-[0.24em] text-[#c8bbab] transition hover:text-[#f0e5d3]"
                >
                  Explore Craftsmanship
                  <span className="inline-block h-2 w-2 rounded-full border border-current" />
                </a>
              </div>
            </div>

            <div data-reveal className="relative h-[42svh] min-h-[24rem] overflow-hidden rounded-[1.7rem] border border-[#233146]/24 bg-[#0c131d] shadow-[0_14px_30px_rgba(5,10,17,0.42)] sm:h-[48svh] lg:h-[clamp(32rem,68vh,52rem)]">
              <HeroCanvas />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0f1a2a]/88 via-[#0f1a2a]/42 to-transparent" />
            </div>
          </div>

          <div id="about" className="grid gap-6 border-t border-[#d9c6a1]/14 py-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[1.5rem] border border-[#d9c6a1]/24 bg-[#142234] p-5">
                <div className="relative mb-4 h-36 overflow-hidden rounded-[1.2rem] border border-[#d9c6a1]/16">
                  <Image
                    src="/gallery/about.jpg"
                    alt="Featured automotive visual"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,rgba(0,0,0,0.6)_100%)]" />
                </div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-[#dfc598]">About</p>
                <p className="mt-3 text-sm leading-relaxed text-[#efe4d1]">
                  Sahil Narula Atelier curates one-off motor car commissions with bespoke engineering,
                  elevated interiors, and discreet ownership support.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-[#d9c6a1]/24 bg-[#142234] p-5">
                <div className="mb-4 grid grid-cols-2 gap-3">
                  <div className="relative h-20 overflow-hidden rounded-[0.9rem] border border-[#d9c6a1]/14">
                    <Image
                      src="/gallery/interior.jpg"
                      alt="Luxury interior detail"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 45vw, 14vw"
                    />
                    <div className="absolute inset-0 bg-black/15" />
                  </div>
                  <div className="relative h-20 overflow-hidden rounded-[0.9rem] border border-[#d9c6a1]/14">
                    <Image
                      src="/gallery/lamp.jpg"
                      alt="Signature lamp detail"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 45vw, 14vw"
                    />
                    <div className="absolute inset-0 bg-black/15" />
                  </div>
                </div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-[#dfc598]">Highlights</p>
                <ul className="mt-4 space-y-4 text-sm text-[#efe4d1]">
                  <li className="border-b border-[#d9c6a1]/16 pb-3">Commissioned bodywork with precise proportions and clean surfacing</li>
                  <li className="border-b border-[#d9c6a1]/16 pb-3">Tailored cabin materials selected for comfort, tactility, and durability</li>
                  <li>Dedicated aftercare and workshop support from build to delivery</li>
                </ul>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[#d9c6a1]/24 bg-[#142234] p-6 lg:p-8">
              <div className="relative mb-5 h-28 overflow-hidden rounded-[1rem] border border-[#d9c6a1]/16">
                <video
                  className="h-full w-full object-cover"
                  src="/gallery/video.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  aria-label="Night drive visual"
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.65),rgba(0,0,0,0.2))]" />
              </div>
              <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-[#dfc598]">Workshop process</p>
              <h2 className="mt-3 max-w-xl font-display text-3xl text-[#efe4d1] sm:text-4xl">
                From first brief to final reveal, every line is considered and every detail is personal.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#efe4d1]/88">
                We shape commissions for clients seeking an automobile that reflects identity,
                craftsmanship, and long-term distinction.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
