import type { Amenity } from "@/lib/sanity";

type AmenitiesSectionProps = {
  title: string;
  amenities: Amenity[];
};

export default function AmenitiesSection({ title, amenities }: AmenitiesSectionProps) {
  return (
    <section className="relative px-6 py-28 lg:px-12" id="features">
      <div className="mx-auto max-w-7xl">
        <div data-reveal className="mb-14 max-w-2xl">
          <p className="mb-4 font-sans text-xs uppercase tracking-[0.35em] text-accent/70">Services</p>
          <h2 className="font-display text-4xl text-stone-100 sm:text-5xl">{title}</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {amenities.map((amenity) => (
            <article
              data-amenity
              key={amenity.title}
              className="rounded-2xl border border-stone-300/15 bg-gradient-to-b from-stone-100/10 to-stone-700/5 p-8 backdrop-blur-sm"
            >
              <h3 className="font-display text-2xl text-stone-50">{amenity.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-300">{amenity.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
