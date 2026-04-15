import Image from "next/image";

type ImageGallerySectionProps = {
  images: string[];
};

export default function ImageGallerySection({ images }: ImageGallerySectionProps) {
  const fallbackGallery = ["/gallery/visual1.jpg", "/gallery/visual2.jpg", "/gallery/visual3.jpg"];
  const gallery = (images.length ? images : fallbackGallery).slice(0, 3);
  const galleryFraming = ["object-center", "object-center", "object-center"];

  return (
    <section className="px-6 pb-8 pt-8 lg:px-12" id="gallery">
      <div className="mx-auto max-w-7xl rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(12,14,18,0.92),rgba(8,9,12,0.95))] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.55)] lg:p-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-accent/80">Atelier Archive</p>
            <h3 className="mt-2 font-display text-3xl text-stone-50">Motor Car Studies</h3>
          </div>
          <p className="hidden text-xs uppercase tracking-[0.28em] text-stone-500 md:block">
            Material and build references
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {gallery.map((src, index) => (
            <article
              key={`${src}-${index}`}
              className="overflow-hidden rounded-[1.2rem] border border-white/10 bg-black/35"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={src}
                  alt={`Gallery visual ${index + 1}`}
                  fill
                  className={`object-cover ${galleryFraming[index] ?? "object-center"}`}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <p className="text-xs uppercase tracking-[0.26em] text-stone-400">
                  Study {index + 1}
                </p>
                <p className="text-[10px] uppercase tracking-[0.26em] text-stone-500">/public/gallery</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
