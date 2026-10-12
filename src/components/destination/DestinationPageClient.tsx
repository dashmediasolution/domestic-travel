 "use client";

import { useCallback, useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

import SearachBar from "@/components/homePage/SerachBar";
import AttractionsByDestination from "@/components/destination/AttractionsByDestination";
import { BestPackageByDestination } from "@/components/packagess/BestPackageByDestination";
import BestTimeToVisit from "@/components/packagess/BestTimeToVisit";
import TravelStories from "@/components/homePage/TravelStories";
import TravelersReviews from "@/components/Reviews";
import FAQSection from "@/app/(site)/FaqSection";
import DestinationHero from "@/components/destination/DestinationHero";
import Memories from "@/components/Memories";
import WhyVisit from "@/components/WhyVisit";
import ThingsToDo from "@/components/ThingsToDo";
import DestinationGallery from "@/components/DestinationGallery";
import { Spinner } from "../ui/spinner";

type DestinationPageClientProps = {
    slug: string;
};

export default function DestinationPageClient({
    slug: routeDestination,
}: DestinationPageClientProps) {
    const [destination, setDestination] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchDestination = useCallback(async () => {
        if (!routeDestination) {
            setDestination(null);
            setLoading(false);
            return;
        }

        try {
            console.log(routeDestination,"slug000")
            setLoading(true);

            const response = await fetch(
                `/api/destinations/${encodeURIComponent(routeDestination)}`,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                    },
                    cache: "no-store",
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch destination data: ${response.status}`
                );
            }

            const result = await response.json();

            if (!result.success || !result.data) {
                throw new Error(
                    result.message || "Failed to fetch destination"
                );
            }

            setDestination(result.data);
        } catch (error) {
            console.error("Destination fetch error:", error);
            setDestination(null);
        } finally {
            setLoading(false);
        }
    }, [routeDestination]);

    useEffect(() => {
        void fetchDestination();
    }, [fetchDestination]);

    if (loading) {
        return (
            <div className="flex min-h-screen w-screen items-center justify-center">
                <Spinner className="h-10 w-10 text-primary" />
            </div>
        );
    }

    if (!destination) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-white">
                <p className="text-gray-500">
                    Destination not found.
                </p>
            </main>
        );
    }

    const faqdest = destination.name
        .toLowerCase()
        .replace(/\s+/g, "-");

    return (
        <main className="w-screen bg-white">
            <DestinationHero
                imageUrl={destination?.heroImage?.url ?? ""}
                destination={destination?.name ?? ""}
                subtitle={destination?.subtitle ?? ""}
                description={destination?.description ?? ""}
                idealTrip={destination?.idealTrip ?? ""}
                budget={destination?.budget ?? ""}
                location={destination?.location ?? ""}
            />

            <SearachBar bottomPosition="2" />

            <section className="mx-auto w-[95%] px-2 pb-16 md:pt-2 lg:px-8">
                <div className="flex w-full flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
                    <div className="w-full lg:w-[75%]">
                        <p className="text-xs font-medium uppercase tracking-wider text-primary">
                            Discover
                        </p>

                        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-black">
                            Overview
                        </h2>

                        <p className="mt-3 w-full line text-md leading-6 text-gray-400 md:text-[16px]">
                            {destination?.description}
                        </p>

                        {destination?.activities?.length > 0 && (
                            <div className="mt-6 grid w-full grid-cols-2 gap-x-6 gap-y-5">
                                {destination.activities.map(
                                    (activity: string, index: number) => (
                                        <div
                                            key={`${activity}-${index}`}
                                            className="flex w-fit items-center gap-2.5"
                                        >
                                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                <Sparkles className="h-4 w-4" />
                                            </span>

                                            <span className="text-sm font-semibold text-gray-700 md:text-lg">
                                                {activity}
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>

                    <DestinationGallery
                        images={destination?.gallery ?? []}
                        destinationName={destination?.name ?? ""}
                    />
                </div>
            </section>

            <div className="flex w-full flex-col items-center justify-center gap-18">
                {destination?.attractions?.length > 0 && (
                    <AttractionsByDestination
                        destination={destination?.name}
                        attractions={destination?.attractions}
                    />
                )}

                {destination?.activities?.length > 0 && (
                    <div className="w-[91%]">
                        <ThingsToDo
                            title={`Best Experiences in ${destination?.name ?? ""}`}
                            activities={destination.activities}
                        />
                    </div>
                )}

                <div className="mb-8 flex w-[95%] flex-col gap-8 px-3 sm:px-5 md:px-6 lg:flex-row lg:items-start lg:justify-center lg:gap-14">
                    <div className="relative top-11 w-full">
                        <WhyVisit
                            items={destination?.whyVisit ?? []}
                            destination={destination?.name}
                        />
                    </div>

                    {destination?.bestTimeToVisit && (
                        <div className="relative top-10 md:full lg:w-[60%]">
                            <BestTimeToVisit
                                months={destination?.bestTimeToVisit}
                            />
                        </div>
                    )}
                </div>

                {destination?.packages?.length > 0 && (
                    <BestPackageByDestination
                        location={destination?.slug}
                        packages={destination?.packages}
                    />
                )}

                <div className="w-[95%]">
                    <TravelersReviews />
                </div>

                <TravelStories />

                <Memories />

                {faqdest && (
                    <FAQSection destinationSlug={faqdest} />
                )}
            </div>
        </main>
    );
}
 