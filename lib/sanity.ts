import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export type Amenity = {
  title: string;
  description: string;
};

export type LandingContent = {
  heroTitle: string;
  heroSubtitle: string;
  heroKicker: string;
  galleryImages: string[];
  amenitiesTitle: string;
  amenities: Amenity[];
  videoTitle: string;
  videoDescription: string;
  videoUrl: string;
  ctaTitle: string;
  ctaDescription: string;
};

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";

const hasSanityConfig = Boolean(projectId && dataset);

export const client = hasSanityConfig
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    })
  : null;

export const urlFor = client ? imageUrlBuilder(client) : null;

const landingQuery = `*[_type == "landingPage"][0]{
  heroTitle,
  heroSubtitle,
  heroKicker,
  galleryImages,
  amenitiesTitle,
  amenities[]{title, description},
  videoTitle,
  videoDescription,
  videoUrl,
  ctaTitle,
  ctaDescription
}`;

const fallbackContent: LandingContent = {
  heroTitle: "Bespoke\nBy Appointment",
  heroSubtitle:
    "Sahil Narula Atelier provides a discreet, deeply personalized commissioning experience for clients seeking singular motor cars crafted around their vision.",
  heroKicker: "Automotive Bespoke Division",
  galleryImages: [
    "/gallery/visual1.jpg",
    "/gallery/visual2.jpg",
    "/gallery/visual3.jpg",
  ],
  amenitiesTitle: "What We Build",
  amenities: [
    {
      title: "Coachbuilt Exteriors",
      description: "Custom bodywork, refined proportions, and discreet aero details shaped in-house.",
    },
    {
      title: "Tailored Interiors",
      description: "Hand-finished cabins in leather, Alcantara, wood, and metal selected to match your brief.",
    },
    {
      title: "Performance Integration",
      description: "Suspension, braking, and drivetrain packages calibrated for road, track, or touring use.",
    },
    {
      title: "Workshop Service",
      description: "Commission management, restoration support, and aftercare handled by a dedicated team.",
    },
  ],
  videoTitle: "Product Motion",
  videoDescription:
    "See our product design language, signature details, and finished builds in motion.",
  videoUrl: "/gallery/video2.mp4",
  ctaTitle: "Begin Your Commission",
  ctaDescription:
    "Share your vision to begin a private commission review with the atelier.",
};

export async function getLandingContent(): Promise<LandingContent> {
  if (!client) {
    return fallbackContent;
  }

  try {
    const data = await client.fetch<Partial<LandingContent> | null>(landingQuery);

    if (!data) {
      return fallbackContent;
    }

    const mergedAmenities = data.amenities?.length
      ? data.amenities
          .filter((amenity): amenity is Amenity => Boolean(amenity?.title && amenity?.description))
          .map((amenity) => ({ title: amenity.title, description: amenity.description }))
      : fallbackContent.amenities;

    return {
      ...fallbackContent,
      ...data,
      heroTitle: data.heroTitle ?? fallbackContent.heroTitle,
      heroSubtitle: data.heroSubtitle ?? fallbackContent.heroSubtitle,
      heroKicker: data.heroKicker ?? fallbackContent.heroKicker,
      galleryImages: data.galleryImages?.length ? data.galleryImages : fallbackContent.galleryImages,
      amenitiesTitle: data.amenitiesTitle ?? fallbackContent.amenitiesTitle,
      amenities: mergedAmenities,
      videoTitle: data.videoTitle ?? fallbackContent.videoTitle,
      videoDescription: data.videoDescription ?? fallbackContent.videoDescription,
      videoUrl: data.videoUrl ?? fallbackContent.videoUrl,
      ctaTitle: data.ctaTitle ?? fallbackContent.ctaTitle,
      ctaDescription: data.ctaDescription ?? fallbackContent.ctaDescription,
    };
  } catch {
    return fallbackContent;
  }
}
