import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
    params: Promise<{
        slug: string;
    }>;
};

export async function GET(
    request: NextRequest,
    { params }: RouteContext
) {
    try {
        const { slug } = await params;

        if (!slug) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Destination slug is required",
                },
                { status: 400 }
            );
        }

        const now = new Date();

      const destination = await prisma.destination.findUnique({
    where: {
        slug,
    },

    include: {
children: {
    where: {
        isPublished: true,
    },
    select: {
        id: true,
        name: true,
        slug: true,
        subtitle: true,
        location: true,
        budget: true,
        heroImage: true,
        parentId: true,
        isFeatured: true,
    },
    orderBy: {
        name: "asc",
    },
},
        attractions: {
            orderBy: {
                sortOrder: "asc",
            },
        },

        faqs: {
            orderBy: {
                sortOrder: "asc",
            },
        },

        packages: {
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                name: true,
                slug: true,
                subtitle: true,
                originalPrice: true,
                heroImage: true,

                offers: {
                    select: {
                        id: true,
                        title: true,
                        type: true,
                        slug: true,
                        endDate: true,
                        badgeText: true,
                        isActive: true,
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        },
    },
});

        if (!destination) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Destination not found",
                },
                { status: 404 }
            );
        }

        const packages = destination.packages.map((pkg) => {
            const activeOffer =
                pkg.offers.find(
                    (offer) => offer.type !== "EARLY_BIRD"
                ) ?? null;

            const earlyBirdOffer =
                pkg.offers.find(
                    (offer) => offer.type === "EARLY_BIRD"
                ) ?? null;

            return {
                id: pkg.id,
                name: pkg.name,
                slug: pkg.slug,
                subtitle: pkg.subtitle,
                originalPrice: pkg.originalPrice,
                heroImage: pkg.heroImage,

                hasOffer: Boolean(activeOffer),
                offer: activeOffer,

                hasEarlyBird: Boolean(earlyBirdOffer),
                earlyBird: earlyBirdOffer,
            };
        });

        return NextResponse.json(
            {
                success: true,

                data: {
                    ...destination,
                    packages,
                },
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error("Destination API error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch destination",
                error:
                    error instanceof Error
                        ? error.message
                        : "Unknown error",
            },
            {
                status: 500,
            }
        );
    }
}