import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MONTHS: Record<string, number> = {
    january: 1,
    february: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    september: 9,
    october: 10,
    november: 11,
    december: 12,
};

const MAX_LIMIT = 50;

function parseNumber(value: string | null) {
    if (!value) {
        return null;
    }

    const number = Number(value);

    return Number.isFinite(number) ? number : null;
}

function parseMonth(value: string | null) {
    if (!value) {
        return null;
    }

    const numericMonth = Number(value);

    if (
        Number.isInteger(numericMonth) &&
        numericMonth >= 1 &&
        numericMonth <= 12
    ) {
        return numericMonth;
    }

    return MONTHS[value.toLowerCase()] ?? null;
}

function parseDate(value: string | null) {
    if (!value) {
        return null;
    }

    const date = new Date(`${value}T00:00:00.000Z`);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return date;
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const query =
            searchParams.get("q")?.trim() ?? "";

        const destination =
            searchParams.get("destination")?.trim() ?? "";

        const budget =
            searchParams.get("budget")?.trim() ?? "";

        const minPrice = parseNumber(
            searchParams.get("minPrice")
        );

        const maxPrice = parseNumber(
            searchParams.get("maxPrice")
        );

        const month = parseMonth(
            searchParams.get("month")
        );

        const selectedDate = parseDate(
            searchParams.get("date")
        );

        const requestedPage = parseNumber(
            searchParams.get("page")
        );

        const requestedLimit = parseNumber(
            searchParams.get("limit")
        );

        const page = Math.max(
            1,
            Math.floor(requestedPage ?? 1)
        );

        const limit = Math.min(
            MAX_LIMIT,
            Math.max(
                1,
                Math.floor(requestedLimit ?? 12)
            )
        );

        if (
            minPrice !== null &&
            maxPrice !== null &&
            minPrice > maxPrice
        ) {
            return NextResponse.json(
                {
                    message:
                        "Minimum price cannot be greater than maximum price.",
                },
                {
                    status: 400,
                }
            );
        }

        if (
            searchParams.has("month") &&
            month === null
        ) {
            return NextResponse.json(
                {
                    message: "Invalid month.",
                },
                {
                    status: 400,
                }
            );
        }

        if (
            searchParams.has("date") &&
            selectedDate === null
        ) {
            return NextResponse.json(
                {
                    message:
                        "Invalid date. Use YYYY-MM-DD.",
                },
                {
                    status: 400,
                }
            );
        }

        /*
         * --------------------------------------------------
         * DESTINATIONS
         * --------------------------------------------------
         */

        const destinationWhere: any = {
            isPublished: true,
        };

        const destinationSearchTerms = [];

        if (query) {
            destinationSearchTerms.push(
                {
                    name: {
                        contains: query,
                        mode: "insensitive",
                    },
                },
                {
                    slug: {
                        contains: query,
                        mode: "insensitive",
                    },
                },
                {
                    location: {
                        contains: query,
                        mode: "insensitive",
                    },
                }
            );
        }

        if (destination) {
            destinationSearchTerms.push(
                {
                    name: {
                        contains: destination,
                        mode: "insensitive",
                    },
                },
                {
                    slug: {
                        contains: destination,
                        mode: "insensitive",
                    },
                }
            );
        }

        if (destinationSearchTerms.length > 0) {
            destinationWhere.OR =
                destinationSearchTerms;
        }

        const matchingDestinations =
            await prisma.destination.findMany({
                where: destinationWhere,

                select: {
                    id: true,
                    name: true,
                    slug: true,
                    location: true,
                    idealTrip: true,
                    budget: true,

                    heroImage: {
                        select: {
                            url: true,
                        },
                    },

                    packages: {
                        where: {
                            isPublished: true,
                        },

                        select: {
                            id: true,
                        },
                    },
                },

                orderBy: [
                    {
                        isFeatured: "desc",
                    },
                    {
                        name: "asc",
                    },
                ],

             });

        const destinationIds =
            matchingDestinations.map(
                (item) => item.id
            );

        /*
         * --------------------------------------------------
         * PACKAGES
         * --------------------------------------------------
         */

        const packageWhere: any = {
            isPublished: true,
        };

        const packageSearchTerms = [];

        if (query) {
            packageSearchTerms.push(
                {
                    name: {
                        contains: query,
                        mode: "insensitive",
                    },
                },
                {
                    slug: {
                        contains: query,
                        mode: "insensitive",
                    },
                },
                {
                    category: {
                        contains: query,
                        mode: "insensitive",
                    },
                }
            );

            /*
             * Searching "Goa" should also return
             * packages belonging to Goa.
             */
            if (destinationIds.length > 0) {
                packageSearchTerms.push({
                    destinationId: {
                        in: destinationIds,
                    },
                });
            }
        }

        if (packageSearchTerms.length > 0) {
            packageWhere.OR =
                packageSearchTerms;
        }

        /*
         * Explicit destination filter
         */
        if (destination) {
            packageWhere.destinationId =
                destinationIds.length > 0
                    ? {
                          in: destinationIds,
                      }
                    : {
                          in: [],
                      };
        }

        /*
         * If there is no text search but destinations
         * matched, include their packages.
         */
        if (
            !query &&
            !destination &&
            destinationIds.length > 0
        ) {
            packageWhere.destinationId = {
                in: destinationIds,
            };
        }

        /*
         * Budget
         */
        if (budget) {
            packageWhere.budget = {
                equals: budget,
                mode: "insensitive",
            };
        }

        /*
         * Price
         */
        if (
            minPrice !== null ||
            maxPrice !== null
        ) {
            packageWhere.originalPrice = {};

            if (minPrice !== null) {
                packageWhere.originalPrice.gte =
                    minPrice;
            }

            if (maxPrice !== null) {
                packageWhere.originalPrice.lte =
                    maxPrice;
            }
        }

        /*
         * Month
         *
         * NOTE:
         * Your current Prisma schema does NOT have
         * availableMonths.
         *
         * Therefore month filtering cannot be performed
         * directly against Package.
         *
         * We intentionally do not add/change your schema.
         */

        /*
         * Date
         *
         * Your Package model also does not have
         * availableFrom / availableUntil.
         *
         * Therefore date availability cannot be filtered
         * from Package.
         */

        const skip =
            (page - 1) * limit;

        const now = new Date();

        const [total, packages] =
            await prisma.$transaction([
                prisma.package.count({
                    where: packageWhere,
                }),

                prisma.package.findMany({
                    where: packageWhere,

                    select: {
                        name: true,
                        slug: true,
                        originalPrice: true,
                        budget: true,
                        duration: true,

                        heroImage: {
                            select: {
                                url: true,
                            },
                        },

                        destination: {
                            select: {
                                name: true,
                                slug: true,
                            },
                        },

                        offers: {
                            where: {
                                isActive: true,

                                startDate: {
                                    lte: now,
                                },

                                endDate: {
                                    gte: now,
                                },
                            },

                            select: {
                                slug: true,
                                title: true,
                                offerPrice: true,
                                originalPrice: true,
                                discount: true,
                                saveAmount: true,
                                badgeText: true,
                            },

                            orderBy: [
                                {
                                    isFeatured: "desc",
                                },
                                {
                                    offerPrice: "asc",
                                },
                            ],

                            take: 1,
                        },
                    },

                    orderBy: [
                        {
                            isFeatured: "desc",
                        },
                        {
                            createdAt: "desc",
                        },
                    ],

                    skip,
                    take: limit,
                }),
            ]);

        /*
         * --------------------------------------------------
         * FORMAT DESTINATIONS
         * --------------------------------------------------
         */

        const destinationResults =
            matchingDestinations.map(
                (item) => ({
                    name: item.name,
                    slug: item.slug,

                    image:
                        item.heroImage?.url ?? "",

                    location:
                        item.location ?? "",

                    idealTrip:
                        item.idealTrip ?? "",

                    budget:
                        item.budget ?? null,

                    packageCount:
                        item.packages.length,
                })
            );

        /*
         * --------------------------------------------------
         * FORMAT PACKAGES
         * --------------------------------------------------
         */

        const packageResults =
            packages.map((item) => {
                const offer =
                    item.offers[0] ?? null;

                const price = offer
                    ? offer.offerPrice
                    : item.originalPrice;

                const originalPrice =
                    offer?.originalPrice ??
                    item.originalPrice;

                return {
                    name: item.name,

                    slug: item.slug,

                    image:
                        item.heroImage?.url ?? "",

                    price,

                    originalPrice,

                    budget:
                        item.budget ?? null,

                    duration:
                        item.duration ?? null,

                    destination:
                        item.destination,

                    offer: offer
                        ? {
                              slug: offer.slug,
                              title: offer.title,
                              discount:
                                  offer.discount ??
                                  null,
                              saveAmount:
                                  offer.saveAmount ??
                                  null,
                              badgeText:
                                  offer.badgeText ??
                                  null,
                          }
                        : null,
                };
            });

        const totalPages =
            Math.ceil(total / limit);

        return NextResponse.json(
            {
                destinations:
                    destinationResults,

                packages:
                    packageResults,

                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                },
            },
            {
                headers: {
                    "Cache-Control":
                        "public, s-maxage=60, stale-while-revalidate=300",
                },
            }
        );
    } catch (error) {
        console.error(
            "Search API error:",
            error
        );

        return NextResponse.json(
            {
                message:
                    "Failed to search destinations and packages.",
            },
            {
                status: 500,
            }
        );
    }
}