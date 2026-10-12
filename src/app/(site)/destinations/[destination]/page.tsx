 import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import DestinationPageClient from "@/components/destination/DestinationPageClient";

type PageProps = {
    params: Promise<{ destination: string }>;
};

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
const { destination: slug } = await params;
    const destination = await prisma.destination.findFirst({
        where: {
            slug,
            isPublished: true,
        },
        select: {
            name: true,
            slug: true,
            metaTitle: true,
            metaDescription: true,
            keywords: true,
            heroImage: true,
        },
    });

    if (!destination) {
        return {
            title: "Destination Not Found | Domestic Travel",
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    const siteUrl = (
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    ).replace(/\/+$/, "");

    const title =
        destination.metaTitle?.trim() ||
        `${destination.name} Travel Guide | Domestic Travel`;

    const description =
        destination.metaDescription?.trim() ||
        `Explore ${destination.name}, discover the best places to visit, and plan your trip with Domestic Travel.`;

    const canonicalUrl = `${siteUrl}/destinations/${encodeURIComponent(destination.slug)}`;
    const image = destination.heroImage?.url;

    return {
        title,
        description,
        ...(destination.keywords.length > 0
            ? { keywords: destination.keywords }
            : {}),
        alternates: {
            canonical: canonicalUrl,
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-image-preview": "large",
            },
        },
        openGraph: {
            type: "website",
            siteName: "Domestic Travel",
            title,
            description,
            url: canonicalUrl,
            locale: "en_IN",
            ...(image
                ? {
                      images: [
                          {
                              url: image,
                              alt: destination.name,
                          },
                      ],
                  }
                : {}),
        },
        twitter: {
            card: image ? "summary_large_image" : "summary",
            title,
            description,
            ...(image ? { images: [image] } : {}),
        },
    };
}
export default async function DestinationPage({
  params,
}: PageProps) {
    const { destination: slug } = await params;
 
    return <DestinationPageClient slug={slug} />;
}
 