"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
    ArrowRight,
    CalendarDays,
    Check,
    Clock3,
    MapPin,
    Search,
    Sparkles,
    Tag,
} from "lucide-react";

interface Destination {
    name: string;
    slug: string;
    image: string;
    location: string;
    idealTrip: string;
    budget: string | null;
    packageCount: number;
}

interface Package {
    name: string;
    slug: string;
    image: string;
    price: number;
    originalPrice: number;
    budget: string | null;
    duration: string | null;
    destination: {
        name: string;
        slug: string;
    };
    offer: {
        slug: string;
        title: string;
        discount: number | null;
        saveAmount: number | null;
        badgeText: string | null;
    } | null;
}

interface SearchResponse {
    destinations: Destination[];
    packages: Package[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

const MONTHS: Record<string, string> = {
    "1": "January",
    "2": "February",
    "3": "March",
    "4": "April",
    "5": "May",
    "6": "June",
    "7": "July",
    "8": "August",
    "9": "September",
    "10": "October",
    "11": "November",
    "12": "December",
};

export default function SearchResultsPage() {
    const searchParams = useSearchParams();

    const [data, setData] =
        useState<SearchResponse>({
            destinations: [],
            packages: [],
        });

    const [loading, setLoading] =
        useState(true);

    const query =
        searchParams.get("q") ?? "";

    const month =
        searchParams.get("month") ?? "";

    const maxPrice =
        searchParams.get("maxPrice") ?? "";

    const minPrice =
        searchParams.get("minPrice") ?? "";

    const budget =
        searchParams.get("budget") ?? "";

    const date =
        searchParams.get("date") ?? "";

    const page =
        searchParams.get("page") ?? "1";

    useEffect(() => {
        const controller =
            new AbortController();

        const loadResults = async () => {
            try {
                setLoading(true);

                const params =
                    new URLSearchParams();

                if (query) {
                    params.set("q", query);
                }

                if (month) {
                    params.set(
                        "month",
                        month
                    );
                }

                if (minPrice) {
                    params.set(
                        "minPrice",
                        minPrice
                    );
                }

                if (maxPrice) {
                    params.set(
                        "maxPrice",
                        maxPrice
                    );
                }

                if (budget) {
                    params.set(
                        "budget",
                        budget
                    );
                }

                if (date) {
                    params.set(
                        "date",
                        date
                    );
                }

                params.set(
                    "page",
                    page
                );

                params.set(
                    "limit",
                    "12"
                );

                const response =
                    await fetch(
                        `/api/search?${params.toString()}`,
                        {
                            signal:
                                controller.signal,
                        }
                    );

                if (!response.ok) {
                    throw new Error(
                        "Search failed"
                    );
                }

                const result =
                    await response.json();

                setData(result);
            } catch (error) {
                if (
                    error instanceof Error &&
                    error.name ===
                        "AbortError"
                ) {
                    return;
                }

                setData({
                    destinations: [],
                    packages: [],
                });
            } finally {
                if (
                    !controller.signal
                        .aborted
                ) {
                    setLoading(false);
                }
            }
        };

        loadResults();

        return () =>
            controller.abort();
    }, [
        query,
        month,
        minPrice,
        maxPrice,
        budget,
        date,
        page,
    ]);

    const totalResults =
        (data.pagination?.total ?? 0) +
        data.destinations.length;

    return (
        <main className="min-h-screen bg-[#f7faf9]">
            <SearchHero
                query={query}
                month={month}
                budget={budget}
                maxPrice={maxPrice}
                date={date}
                loading={loading}
            />

            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
                {loading ? (
                    <SearchSkeleton />
                ) : (
                    <>
                        {totalResults > 0 && (
                            <div className="mb-8 flex flex-col gap-4 border-b border-neutral-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <p className="text-sm font-medium text-primary">
                                        Search results
                                    </p>

                                    <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight text-[#00383b] sm:text-3xl">
                                        {query
                                            ? `Explore ${query}`
                                            : "Find your perfect getaway"}
                                    </h2>
                                </div>

                                {data.pagination && (
                                    <p className="text-sm text-neutral-500">
                                        {data.pagination.total.toLocaleString(
                                            "en-IN"
                                        )}{" "}
                                        packages found
                                    </p>
                                )}
                            </div>
                        )}

                        {data.destinations.length >
                            0 && (
                            <DestinationSection
                                destinations={
                                    data.destinations
                                }
                            />
                        )}

                        {data.packages.length >
                            0 && (
                            <PackageSection
                                packages={
                                    data.packages
                                }
                            />
                        )}

                        {!data.destinations
                            .length &&
                            !data.packages
                                .length && (
                                <EmptyState />
                            )}

                        {data.pagination &&
                            data.pagination
                                .totalPages >
                                1 && (
                                <Pagination
                                    currentPage={
                                        data
                                            .pagination
                                            .page
                                    }
                                    totalPages={
                                        data
                                            .pagination
                                            .totalPages
                                    }
                                    searchParams={
                                        searchParams
                                    }
                                />
                            )}
                    </>
                )}
            </section>
        </main>
    );
}

function SearchHero({
    query,
    month,
    budget,
    maxPrice,
    date,
    loading,
}: {
    query: string;
    month: string;
    budget: string;
    maxPrice: string;
    date: string;
    loading: boolean;
}) {
    return (
        <section className="relative overflow-hidden bg-[#00383b]">
            <div className="absolute -right-20 -top-24 size-72 rounded-full bg-primary/20 blur-3xl" />

            <div className="absolute -bottom-32 -left-20 size-80 rounded-full bg-[#63d5c5]/10 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
                <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#8de5d9] backdrop-blur">
                        <Sparkles className="size-3.5" />
                        Travel discovery
                    </div>

                    <h1 className="mt-5 font-heading text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                        {query
                            ? `Discover ${query}`
                            : "Where will you go next?"}
                    </h1>

                    <p className="mt-4 max-w-2xl text-sm leading-6 text-white/65 sm:text-base">
                        Explore handpicked destinations
                        and travel packages designed
                        for unforgettable experiences
                        across India.
                    </p>

                    {(query ||
                        month ||
                        budget ||
                        maxPrice ||
                        date) && (
                        <div className="mt-7 flex flex-wrap gap-2">
                            {query && (
                                <FilterPill>
                                    <Search className="size-3.5" />
                                    {query}
                                </FilterPill>
                            )}

                            {month && (
                                <FilterPill>
                                    <CalendarDays className="size-3.5" />
                                    {MONTHS[month] ??
                                        month}
                                </FilterPill>
                            )}

                            {budget && (
                                <FilterPill>
                                    <Tag className="size-3.5" />
                                    {budget}
                                </FilterPill>
                            )}

                            {maxPrice && (
                                <FilterPill>
                                    Up to ₹
                                    {Number(
                                        maxPrice
                                    ).toLocaleString(
                                        "en-IN"
                                    )}
                                </FilterPill>
                            )}

                            {date && (
                                <FilterPill>
                                    <CalendarDays className="size-3.5" />
                                    {date}
                                </FilterPill>
                            )}
                        </div>
                    )}
                </div>

                {loading && (
                    <div className="mt-8 flex items-center gap-2 text-sm text-white/50">
                        <span className="size-2 animate-pulse rounded-full bg-[#63d5c5]" />
                        Finding the best trips...
                    </div>
                )}
            </div>
        </section>
    );
}

function FilterPill({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/85 backdrop-blur">
            {children}
        </span>
    );
}

function DestinationSection({
    destinations,
}: {
    destinations: Destination[];
}) {
    return (
        <section>
            <div className="mb-5 flex items-end justify-between">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                        Popular places
                    </p>

                    <h2 className="mt-1 font-heading text-2xl font-bold text-[#00383b] sm:text-3xl">
                        Destinations for you
                    </h2>
                </div>

                <span className="hidden text-sm text-neutral-500 sm:block">
                    {destinations.length}{" "}
                    destinations
                </span>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {destinations.map(
                    (destination) => (
                        <DestinationCard
                            key={
                                destination.slug
                            }
                            destination={
                                destination
                            }
                        />
                    )
                )}
            </div>
        </section>
    );
}

function DestinationCard({
    destination,
}: {
    destination: Destination;
}) {
    return (
        <Link
            href={`/destinations/${destination.slug}`}
            className="group relative overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-neutral-200/80 transition duration-300 hover:-translate-y-1.5 hover:shadow-xl"
        >
            <div className="relative h-[280px] overflow-hidden">
                {destination.image ? (
                    <Image
                        src={
                            destination.image
                        }
                        alt={
                            destination.name
                        }
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="h-full w-full bg-neutral-200" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

                {destination.budget && (
                    <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#00383b] shadow-sm">
                        {destination.budget}
                    </span>
                )}

                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <div className="flex items-center gap-1.5 text-xs text-white/75">
                        <MapPin className="size-3.5" />
                        <span className="truncate">
                            {destination.location ||
                                "India"}
                        </span>
                    </div>

                    <h3 className="mt-1 font-heading text-2xl font-bold">
                        {destination.name}
                    </h3>

                    {destination.idealTrip && (
                        <p className="mt-1 line-clamp-1 text-xs text-white/70">
                            {destination.idealTrip}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between px-4 py-3.5">
                <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-500">
                    <Check className="size-3.5 text-primary" />

                    {destination.packageCount ===
                    1
                        ? "1 package"
                        : `${destination.packageCount} packages`}
                </div>

                <span className="flex size-8 items-center justify-center rounded-full bg-[#e8f8f5] text-primary transition group-hover:bg-primary group-hover:text-white">
                    <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                </span>
            </div>
        </Link>
    );
}

function PackageSection({
    packages,
}: {
    packages: Package[];
}) {
    return (
        <section className="mt-14">
            <div className="mb-5 flex items-end justify-between">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                        Curated trips
                    </p>

                    <h2 className="mt-1 font-heading text-2xl font-bold text-[#00383b] sm:text-3xl">
                        Packages you'll love
                    </h2>
                </div>

                <span className="hidden text-sm text-neutral-500 sm:block">
                    {packages.length} trips
                </span>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {packages.map((item) => (
                    <PackageCard
                        key={`${item.destination.slug}-${item.slug}`}
                        item={item}
                    />
                ))}
            </div>
        </section>
    );
}

function PackageCard({
    item,
}: {
    item: Package;
}) {
    const hasDiscount =
        item.originalPrice >
        item.price;

    return (
        <Link
            href={`/package/${item.destination.slug}/${item.slug}`}
            className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-neutral-200/80 transition duration-300 hover:-translate-y-1.5 hover:shadow-xl"
        >
            <div className="relative h-[230px] overflow-hidden">
                {item.image ? (
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="h-full w-full bg-neutral-200" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/10" />

                {item.offer?.badgeText ? (
                    <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-[#00383b] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white">
                        <Sparkles className="size-3" />
                        {item.offer.badgeText}
                    </span>
                ) : item.budget ? (
                    <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#00383b]">
                        {item.budget}
                    </span>
                ) : null}

                {hasDiscount && (
                    <span className="absolute right-4 top-4 rounded-full bg-white px-2.5 py-1.5 text-[10px] font-bold text-[#d14b43] shadow-sm">
                        {item.offer?.discount
                            ? `${Math.round(
                                  item.offer
                                      .discount
                              )}% OFF`
                            : "SPECIAL OFFER"}
                    </span>
                )}

                <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-1.5 text-xs text-white/75">
                        <MapPin className="size-3.5" />

                        {item.destination.name}
                    </div>
                </div>
            </div>

            <div className="px-5">
                <h3 className="line-clamp-2 min-h-[52px] font-heading text-lg font-bold leading-6 text-[#00383b]">
                    {item.name}
                </h3>

                <div className="mt-3 flex flex-wrap gap-2">
                    {item.duration && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-600">
                            <Clock3 className="size-3.5 text-primary" />
                            {item.duration}
                        </span>
                    )}

                    {item.budget && (
                        <span className="rounded-full bg-[#e8f8f5] px-2.5 py-1 text-[11px] font-medium text-primary">
                            {item.budget}
                        </span>
                    )}
                </div>

                <div className="mt-5 flex items-end justify-between gap-3 border-t border-neutral-100 pt-4">
                    <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-400">
                            Starting from
                        </p>

                        <div className="mt-0.5 flex items-baseline gap-2">
                            <span className="text-lg font-bold text-primary">
                                ₹
                                {item.price.toLocaleString(
                                    "en-IN"
                                )}
                            </span>

                            {hasDiscount && (
                                <span className="text-xs text-neutral-400 line-through">
                                    ₹
                                    {item.originalPrice.toLocaleString(
                                        "en-IN"
                                    )}
                                </span>
                            )}
                        </div>
                    </div>

                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-white transition duration-300 group-hover:translate-x-1">
                        <ArrowRight className="size-4" />
                    </span>
                </div>

                {item.offer?.saveAmount &&
                    item.offer.saveAmount >
                        0 && (
                        <p className="mt-3 text-[11px] font-medium text-[#218a7c]">
                            Save ₹
                            {item.offer.saveAmount.toLocaleString(
                                "en-IN"
                            )}{" "}
                            on this trip
                        </p>
                    )}
            </div>
        </Link>
    );
}

function EmptyState() {
    return (
        <div className="flex min-h-[430px] flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-300 bg-white px-6 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-[#e8f8f5]">
                <Search className="size-7 text-primary" />
            </div>

            <h2 className="mt-5 font-heading text-2xl font-bold text-[#00383b]">
                No trips found
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-neutral-500">
                We couldn't find a trip matching
                your current search. Try a different
                destination, month, budget, or price
                range.
            </p>

            <Link
                href="/search-results"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
                Explore all trips
                <ArrowRight className="size-4" />
            </Link>
        </div>
    );
}

function Pagination({
    currentPage,
    totalPages,
    searchParams,
}: {
    currentPage: number;
    totalPages: number;
    searchParams: ReturnType<
        typeof useSearchParams
    >;
}) {
    const createUrl = (
        page: number
    ) => {
        const params =
            new URLSearchParams(
                searchParams.toString()
            );

        if (page <= 1) {
            params.delete("page");
        } else {
            params.set(
                "page",
                String(page)
            );
        }

        const queryString =
            params.toString();

        return queryString
            ? `/search-results?${queryString}`
            : "/search-results";
    };

    const pages = [];

    const start = Math.max(
        1,
        currentPage - 2
    );

    const end = Math.min(
        totalPages,
        currentPage + 2
    );

    for (
        let page = start;
        page <= end;
        page++
    ) {
        pages.push(page);
    }

    return (
        <div className="mt-12 flex items-center justify-center gap-2">
            {currentPage > 1 && (
                <Link
                    href={createUrl(
                        currentPage - 1
                    )}
                    className="flex size-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition hover:border-primary hover:text-primary"
                >
                    <ArrowRight className="size-4 rotate-180" />
                </Link>
            )}

            {pages.map((page) => (
                <Link
                    key={page}
                    href={createUrl(page)}
                    className={`flex size-10 items-center justify-center rounded-full text-sm font-semibold transition ${
                        page === currentPage
                            ? "bg-primary text-white"
                            : "border border-neutral-200 bg-white text-neutral-600 hover:border-primary hover:text-primary"
                    }`}
                >
                    {page}
                </Link>
            ))}

            {currentPage <
                totalPages && (
                <Link
                    href={createUrl(
                        currentPage + 1
                    )}
                    className="flex size-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition hover:border-primary hover:text-primary"
                >
                    <ArrowRight className="size-4" />
                </Link>
            )}
        </div>
    );
}

function SearchSkeleton() {
    return (
        <div className="space-y-14">
            <section>
                <div className="mb-6 space-y-2">
                    <div className="h-3 w-24 animate-pulse rounded bg-neutral-200" />
                    <div className="h-8 w-56 animate-pulse rounded bg-neutral-200" />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {Array.from({
                        length: 4,
                    }).map((_, index) => (
                        <div
                            key={index}
                            className="overflow-hidden rounded-3xl bg-white shadow-sm"
                        >
                            <div className="h-[280px] animate-pulse bg-neutral-200" />

                            <div className="space-y-3 p-4">
                                <div className="h-4 w-2/3 animate-pulse rounded bg-neutral-200" />

                                <div className="h-3 w-1/2 animate-pulse rounded bg-neutral-200" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <div className="mb-6 space-y-2">
                    <div className="h-3 w-24 animate-pulse rounded bg-neutral-200" />
                    <div className="h-8 w-64 animate-pulse rounded bg-neutral-200" />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {Array.from({
                        length: 8,
                    }).map((_, index) => (
                        <div
                            key={index}
                            className="overflow-hidden rounded-3xl bg-white shadow-sm"
                        >
                            <div className="h-[230px] animate-pulse bg-neutral-200" />

                            <div className="space-y-3 p-5">
                                <div className="h-5 w-4/5 animate-pulse rounded bg-neutral-200" />

                                <div className="h-4 w-1/2 animate-pulse rounded bg-neutral-200" />

                                <div className="h-5 w-1/3 animate-pulse rounded bg-neutral-200" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}