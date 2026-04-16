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
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[1.8rem] border border-[#2f241d]/20 bg-[linear-gradient(140deg,#fbf8f2_0%,#f1e8db_56%,#e8ddca_100%)] panel-glow">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_17%_14%,rgba(160,61,46,0.18),transparent_31%),radial-gradient(circle_at_84%_22%,rgba(200,116,97,0.12),transparent_24%)]" />

        <div className="relative z-10 px-4 py-4 md:px-7 md:py-5">
          <header className="flex items-center justify-between border-b border-[#2e221a]/15 pb-4">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-[0.4rem] border border-[#643328]/35 bg-[linear-gradient(180deg,#b7543f,#7e3022)] text-[10px] font-bold tracking-[0.25em] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.12)_inset]">
                N
              </div>
              <div className="leading-none">
                <p className="font-sans text-[9px] uppercase tracking-[0.45em] text-[#705948]">Sahil Narula Atelier</p>
                <p className="mt-1 font-display text-sm tracking-[0.18em] text-[#1d1713]">Automotive Bespoke Division</p>
              </div>
            </div>

            <nav className="hidden items-center gap-6 text-[10px] uppercase tracking-[0.32em] text-[#6c5c4d] md:flex lg:gap-8">
              <a href="#hero" className="transition hover:text-[#1f1712]">Home</a>
              <a href="#about" className="transition hover:text-[#1f1712]">About</a>
              <a href="#features" className="transition hover:text-[#1f1712]">Services</a>
              <a href="#video" className="transition hover:text-[#1f1712]">Product</a>
              <a href="#contact" className="transition hover:text-[#1f1712]">Contact</a>
            </nav>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="grid h-9 w-9 place-items-center rounded-full border border-[#2f241d]/20 bg-white/45 text-[#2f2118] md:hidden"
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
              className="mt-4 grid gap-2 rounded-2xl border border-[#2f241d]/20 bg-[#f7f2ea]/95 p-4 text-[10px] uppercase tracking-[0.3em] text-[#47372b] md:hidden"
            >
              <a href="#hero" onClick={() => setMobileMenuOpen(false)} className="py-2 transition hover:text-[#1f1712]">Home</a>
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="py-2 transition hover:text-[#1f1712]">About</a>
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="py-2 transition hover:text-[#1f1712]">Services</a>
              <a href="#video" onClick={() => setMobileMenuOpen(false)} className="py-2 transition hover:text-[#1f1712]">Product</a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="py-2 transition hover:text-[#1f1712]">Contact</a>
            </nav>
          ) : null}

          <div className="grid gap-8 py-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:py-14">
            <div data-reveal className="max-w-xl space-y-5 lg:pr-4">
              <p className="font-sans text-[10px] uppercase tracking-[0.45em] text-[#7d6150]">{kicker}</p>
              <h1 className="max-w-[15ch] whitespace-pre-line font-display text-[clamp(2.8rem,5.2vw,4.4rem)] uppercase leading-[0.92] tracking-[0.015em] text-[#1a1511]">
                {title}
              </h1>
              <p className="max-w-md text-sm leading-relaxed text-[#53483f] sm:text-base">{subtitle}</p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#contact"
                  className="rounded-[0.35rem] bg-[#a03d2e] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#fbf5ec] transition hover:bg-[#8a3427]"
                >
                  Begin Your Commission
                </a>
                <a
                  href="#features"
                  className="inline-flex items-center gap-2 rounded-[0.25rem] px-1 py-3 text-[10px] font-medium uppercase tracking-[0.24em] text-[#433127] transition hover:text-[#241711]"
                >
                  Explore Craftsmanship
                  <span className="inline-block h-2 w-2 rounded-full border border-current" />
                </a>
              </div>
            </div>

            <div data-reveal className="relative h-[42svh] min-h-[24rem] overflow-hidden rounded-[1.7rem] border border-[#2f241d]/20 bg-[linear-gradient(130deg,#28221e,#151311)] shadow-[0_25px_90px_rgba(63,40,28,0.55)] sm:h-[48svh] lg:h-[clamp(32rem,68vh,52rem)]">
              <HeroCanvas />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#120f0d] via-[#120f0d]/55 to-transparent" />
            </div>
          </div>

          <div id="about" className="grid gap-6 border-t border-[#2e221a]/15 py-7 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[1.5rem] border border-[#2f241d]/20 bg-[linear-gradient(180deg,#f8f2e8,#f2e6d8)] p-5">
                <div className="relative mb-4 h-36 overflow-hidden rounded-[1.2rem] border border-[#2f241d]/15">
                  <Image
                    src="/gallery/about.jpg"
                    alt="Featured automotive visual"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,rgba(0,0,0,0.6)_100%)]" />
                </div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-[#805f4b]">About</p>
                <p className="mt-3 text-sm leading-relaxed text-[#4c3e35]">
                  Sahil Narula Atelier curates one-off motor car commissions with bespoke engineering,
                  elevated interiors, and discreet ownership support.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-[#2f241d]/15 bg-[#fdf8f0]/85 p-5">
                <div className="mb-4 grid grid-cols-2 gap-3">
                  <div className="relative h-20 overflow-hidden rounded-[0.9rem] border border-[#2f241d]/12">
                    <Image
                      src="/gallery/interior.jpg"
                      alt="Luxury interior detail"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 45vw, 14vw"
                    />
                    <div className="absolute inset-0 bg-black/15" />
                  </div>
                  <div className="relative h-20 overflow-hidden rounded-[0.9rem] border border-[#2f241d]/12">
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
                <p className="text-[10px] uppercase tracking-[0.35em] text-[#805f4b]">Highlights</p>
                <ul className="mt-4 space-y-4 text-sm text-[#56463d]">
                  <li className="border-b border-[#2f241d]/10 pb-3">Commissioned bodywork with precise proportions and clean surfacing</li>
                  <li className="border-b border-[#2f241d]/10 pb-3">Tailored cabin materials selected for comfort, tactility, and durability</li>
                  <li>Dedicated aftercare and workshop support from build to delivery</li>
                </ul>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[#2f241d]/20 bg-[#f7efe3]/90 p-6 lg:p-8">
              <div className="relative mb-5 h-28 overflow-hidden rounded-[1rem] border border-[#2f241d]/15">
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
              <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-[#8d5344]">Workshop process</p>
              <h2 className="mt-3 max-w-xl font-display text-3xl text-[#221913] sm:text-4xl">
                From first brief to final reveal, every line is considered and every detail is personal.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#55453b]">
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
