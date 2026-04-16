import type { Amenity } from "@/lib/sanity";

type AmenitiesSectionProps = {
  title: string;
  amenities: Amenity[];
};

export default function AmenitiesSection({ title, amenities }: AmenitiesSectionProps) {
  return (
    <section className="relative px-6 py-24 lg:px-12" id="features">
      <div className="mx-auto max-w-7xl">
        <div data-reveal className="mb-14 max-w-2xl">
          <p className="mb-4 font-sans text-xs uppercase tracking-[0.35em] text-[#935243]">Services</p>
          <h2 className="font-display text-4xl text-[#1d1510] sm:text-5xl">{title}</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {amenities.map((amenity) => (
            <article
              data-amenity
              key={amenity.title}
              className="rounded-[1.4rem] border border-[#2f241d]/16 bg-[linear-gradient(170deg,#fff8ee,#f5ebdd)] p-8 panel-glow"
            >
              <h3 className="font-display text-2xl text-[#211811]">{amenity.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#5b4b41]">{amenity.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
