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
          <p className="mb-4 font-sans text-xs uppercase tracking-[0.35em] text-[#d0b07a]">Services</p>
          <h2 className="font-display text-4xl text-[#efe4d1] sm:text-5xl">{title}</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {amenities.map((amenity) => (
            <article
              data-amenity
              key={amenity.title}
              className="rounded-[1.4rem] border border-[#d9c6a1]/18 bg-[linear-gradient(170deg,#162131,#101926)] p-8 panel-glow"
            >
              <h3 className="font-display text-2xl text-[#efe4d1]">{amenity.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#c7bcae]">{amenity.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
