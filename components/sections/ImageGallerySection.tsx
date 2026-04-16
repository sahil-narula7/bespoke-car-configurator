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
      <div className="mx-auto max-w-7xl rounded-[1.7rem] border border-[#2f241d]/20 bg-[linear-gradient(180deg,#f8f2e7,#efe3d3)] p-6 panel-glow lg:p-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-[#935243]">Atelier Archive</p>
            <h3 className="mt-2 font-display text-3xl text-[#1f1711]">Motor Car Studies</h3>
          </div>
          <p className="hidden text-xs uppercase tracking-[0.28em] text-[#6e5b4c] md:block">
            Material and build references
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {gallery.map((src, index) => (
            <article
              key={`${src}-${index}`}
              className="overflow-hidden rounded-[1.2rem] border border-[#2f241d]/15 bg-[#fff9f1]"
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
              <div className="flex items-center justify-between bg-[linear-gradient(90deg,#f7efdf,#f5ebdc)] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.26em] text-[#5f4f43]">
                  Study {index + 1}
                </p>
                <p className="text-[10px] uppercase tracking-[0.26em] text-[#8f7564]">/public/gallery</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
