import ScrollController from "@/components/ScrollController";
import ScrollTracker from "@/components/ScrollTracker";
import { ScrollProvider } from "@/components/ScrollContext";
import HeroSection from "@/components/sections/HeroSection";
import ImageGallerySection from "@/components/sections/ImageGallerySection";
import AmenitiesSection from "@/components/sections/AmenitiesSection";
import VideoSection from "@/components/sections/VideoSection";
import CTASection from "@/components/sections/CTASection";
import { getLandingContent } from "@/lib/sanity";

export default async function Home() {
  const content = await getLandingContent();

  return (
    <ScrollProvider>
      <ScrollController />
      <ScrollTracker />
      <main className="bg-site text-stone-100">
        <HeroSection
          kicker={content.heroKicker}
          title={content.heroTitle}
          subtitle={content.heroSubtitle}
        />
        <ImageGallerySection images={content.galleryImages} />
        <AmenitiesSection title={content.amenitiesTitle} amenities={content.amenities} />
        <VideoSection
          title={content.videoTitle}
          description={content.videoDescription}
          videoUrl={content.videoUrl}
        />
        <CTASection title={content.ctaTitle} description={content.ctaDescription} />
      </main>
    </ScrollProvider>
  );
}
