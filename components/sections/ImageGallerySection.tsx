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
      <div className="mx-auto max-w-7xl rounded-[1.7rem] border border-[#d9c6a1]/18 bg-[linear-gradient(180deg,#142031,#0d1622)] p-6 panel-glow lg:p-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-[#d0b07a]">Atelier Archive</p>
            <h3 className="mt-2 font-display text-3xl text-[#efe4d1]">Motor Car Studies</h3>
          </div>
          <p className="hidden text-xs uppercase tracking-[0.28em] text-[#c0b4a2] md:block">
            Material and build references
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {gallery.map((src, index) => (
            <article
              key={`${src}-${index}`}
              className="overflow-hidden rounded-[1.2rem] border border-[#d9c6a1]/18 bg-[#111b29]"
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
              <div className="flex items-center justify-between bg-[linear-gradient(90deg,#162233,#111b29)] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.26em] text-[#d7c7b0]">
                  Study {index + 1}
                </p>
                <p className="text-[10px] uppercase tracking-[0.26em] text-[#bda479]">/public/gallery</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
