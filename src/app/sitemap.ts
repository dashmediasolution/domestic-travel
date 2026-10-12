 import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const SITE_URL = (
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://your-real-domain.com"
).replace(/\/+$/, "");

export const revalidate = 3600;

type SitemapEntry = MetadataRoute.Sitemap[number];

function createEntry(
    path: string,
    lastModified?: Date | string | null,
    priority = 0.7,
): SitemapEntry {
    return {
        url: `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`,
        lastModified: lastModified
            ? new Date(lastModified)
            : new Date(),
        changeFrequency: "weekly",
        priority,
    };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticPages: SitemapEntry[] = [
        createEntry("/", undefined, 1),
        createEntry("/about", undefined, 0.5),
        createEntry("/contact", undefined, 0.5),
        createEntry("/destinations", undefined, 0.9),
        createEntry("/package", undefined, 0.9),
        createEntry("/offers", undefined, 0.8),
        createEntry("/blog", undefined, 0.8),
        createEntry("/privacy-policy", undefined, 0.3),
        createEntry("/terms-and-conditions", undefined, 0.3),
    ];

    try {
        const [destinations, packages, offers, blogs] =
            await Promise.all([
                prisma.destination.findMany({
                    where: {
                        isPublished: true,
                    },
                    select: {
                        slug: true,
                        updatedAt: true,
                    },
                }),

                prisma.package.findMany({
                    where: {
                        isPublished: true,
                    },
                    select: {
                        slug: true,
                        updatedAt: true,
                        destination: {
                            select: {
                                slug: true,
                            },
                        },
                    },
                }),

                prisma.offer.findMany({
                    where: {
                        isActive: true,
                    },
                    select: {
                        slug: true,
                        updatedAt: true,
                        startDate: true,
                        endDate: true,
                    },
                }),

                prisma.blog.findMany({
                    where: {
                        isPublished: true,
                    },
                    select: {
                        slug: true,
                        updatedAt: true,
                    },
                }),
            ]);

        const destinationPages: SitemapEntry[] = destinations
            .filter((destination) => destination.slug)
            .map((destination) =>
                createEntry(
                    `/destinations/${destination.slug}`,
                    destination.updatedAt,
                    0.8,
                ),
            );

        const packagePages: SitemapEntry[] = packages
            .filter((item) => item.slug && item.destination?.slug)
            .map((item) =>
                createEntry(
                    `/package/${item.destination.slug}/${item.slug}`,
                    item.updatedAt,
                    0.8,
                ),
            );

        const now = new Date();

        const offerPages: SitemapEntry[] = offers
            .filter((offer) => {
                if (!offer.slug) return false;

                if (
                    offer.startDate &&
                    new Date(offer.startDate) > now
                ) {
                    return false;
                }

                if (
                    offer.endDate &&
                    new Date(offer.endDate) < now
                ) {
                    return false;
                }

                return true;
            })
            .map((offer) =>
                createEntry(
                    `/offers/package/${offer.slug}`,
                    offer.updatedAt,
                    0.7,
                ),
            );

        const blogPages: SitemapEntry[] = blogs
            .filter((blog) => blog.slug)
            .map((blog) =>
                createEntry(
                    `/blog/${blog.slug}`,
                    blog.updatedAt,
                    0.7,
                ),
            );

        const allPages = [
            ...staticPages,
            ...destinationPages,
            ...packagePages,
            ...offerPages,
            ...blogPages,
        ];

        const uniquePages = new Map<string, SitemapEntry>();

        for (const page of allPages) {
            uniquePages.set(page.url, page);
        }

        return Array.from(uniquePages.values());
    } catch (error) {
        console.error("Failed to generate sitemap:", error);

        return staticPages;
    }
}
 