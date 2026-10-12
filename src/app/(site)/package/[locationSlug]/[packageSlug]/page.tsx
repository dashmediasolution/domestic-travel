
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import PackageDestination from "@/components/packagess/PackageDestination";

type PageProps = {
    params: Promise<{
        locationSlug: string;
        packageSlug: string;
    }>;
};

type PackageSEO = {
    id?: string;
    name?: string;
    slug?: string;
    metaTitle?: string | null;
    metaDescription?: string | null;
    keywords?: string[] | null;
    noIndex?: boolean;
    heroImage?: {
        url?: string | null;
    } | null;
    offers?: Array<{
        slug?: string;
    }>;
};

const SITE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/+$/, "");

async function getPackage(
    locationSlug: string,
    packageSlug: string
): Promise<PackageSEO | null> {
    try {
        const destination = await prisma.destination.findFirst({
            where: {
                slug: locationSlug,
                isPublished: true,
            },
            select: {
                id: true,
            },
        });

        if (!destination) {
            console.error("SEO: Destination not found:", locationSlug);
            return null;
        }

        const packageData = await prisma.package.findFirst({
            where: {
                slug: packageSlug,
                destinationId: destination.id,
                isPublished: true,
            },
            select: {
                id: true,
                name: true,
                slug: true,
                metaTitle: true,
                metaDescription: true,
                keywords: true,
                heroImage: true,
                offers: {
                    where: {
                        isActive: true,
                    },
                    orderBy: {
                        endDate: "asc",
                    },
                    select: {
                        slug: true,
                    },
                },
            },
        });

        if (!packageData) {
            console.error(
                "SEO: Package not found:",
                locationSlug,
                packageSlug
            );
            return null;
        }

        return packageData as unknown as PackageSEO;
    } catch (error) {
        console.error("Failed to fetch package SEO:", error);
        return null;
    }
}

function getPackageTitle(data: PackageSEO): string {
    return (
        data.metaTitle?.trim() ||
        data.name?.trim() ||
        "Travel Package | Domestic Travel"
    );
}

function getPackageDescription(data: PackageSEO): string {
    return (
        data.metaDescription?.trim() ||
        `Explore ${data.name || "this travel package"} and plan your next trip with Domestic Travel.`
    );
}


function getPackageKeywords(
    keywords: PackageSEO["keywords"]
): string[] {
    if (!Array.isArray(keywords)) {
        return [];
    }

    return keywords
        .filter(
            (keyword): keyword is string =>
                typeof keyword === "string" &&
                keyword.trim().length > 0
        )
        .map((keyword) => keyword.trim());
}


export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { locationSlug, packageSlug } = await params;

    const data = await getPackage(locationSlug, packageSlug);

    if (!data) {
        return {
            title: "Package Not Found | Domestic Travel",
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    const title = getPackageTitle(data);
    const description = getPackageDescription(data);
    const keywords = getPackageKeywords(data.keywords);
    const image = data.heroImage?.url;

    const canonicalUrl = new URL(
        `/package/${encodeURIComponent(locationSlug)}/${encodeURIComponent(packageSlug)}`,
        SITE_URL
    ).toString();

    return {
        title,
        description,
        ...(keywords.length > 0 ? { keywords } : {}),
        alternates: {
            canonical: canonicalUrl,
        },
        robots: {
            index: data.noIndex !== true,
            follow: true,
            googleBot: {
                index: data.noIndex !== true,
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
                            alt: data.name || title,
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

export default async function PackagePage({
    params,
}: PageProps) {
    const { locationSlug, packageSlug } = await params;

    return (
        <PackageDestination
            locationSlug={locationSlug}
            packageSlug={packageSlug}
        />
    );
}
