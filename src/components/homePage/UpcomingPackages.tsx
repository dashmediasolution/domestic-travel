"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    ArrowUpRight,
    ChevronLeft,
    ChevronRight,
    Phone,
} from "lucide-react";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel";

import { Button } from "@/components/ui/button";

export default function UpcomingPackages() {
    const router = useRouter();

    const [packages, setPackages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [api, setApi] = useState<CarouselApi>();

    useEffect(() => {
        const fetchUpcomingPackages = async () => {
            try {
                setLoading(true);

                const response = await fetch(
                    "/api/upcomming",
                    {
                        cache: "no-store",
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to fetch upcoming packages"
                    );
                }

                const result: any =
                    await response.json();

                setPackages(result?.data ?? []);
            } catch (error) {
                console.error(
                    "Failed to fetch upcoming packages:",
                    error
                );

                setPackages([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUpcomingPackages();
    }, []);


    console.log(packages,"upcome")
    const handlePackageClick = (
        item: any
    ) => {
        if (
            item?.destination?.slug &&
            item?.slug
        ) {
            router.push(
                `/package/${item.destination.slug}/${item.slug}`
            );
        }
    };

    return (
        <section
            className="
                w-full
                overflow-hidden
                bg-white
                px-5
                sm:px-8
                md:py-10
                lg:py-12
            "
        >
            <div className="mx-auto w-[99%]">

                {/* HEADER */}

                <div
                    className="
                        mb-5
                        flex
                        items-center
                        justify-between
                        gap-3
                        sm:mb-7
                    "
                >
                    <h2
                        className="
                            min-w-0
                            text-[18px]
                            font-medium
                            leading-tight
                            tracking-[-0.4px]
                            text-black
                            sm:text-[25px]
                            sm:tracking-[-0.6px]
                        "
                    >
                        Browse Trending Packages
                    </h2>
                </div>

                {/* CAROUSEL */}

                <Carousel
                    setApi={setApi}
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent
                        className="
                            -ml-3
                            sm:-ml-4
                            lg:-ml-6
                        "
                    >
                        {/* LOADING */}

                        {loading ? (
                            Array.from({
                                length: 3,
                            }).map(
                                (_, index) => (
                                    <CarouselItem
                                        key={index}
                                        className="
                                            basis-[82%]
                                            pl-3
                                            sm:basis-[65%]
                                            sm:pl-4
                                            md:basis-1/2
                                            md:pl-5
                                            lg:basis-1/3
                                            lg:pl-6
                                        "
                                    >
                                        <div
                                            className="
                                                h-[190px]
                                                w-full
                                                animate-pulse
                                                rounded-[18px]
                                                bg-gray-200
                                                sm:h-[220px]
                                                sm:rounded-[22px]
                                                md:h-[250px]
                                                lg:h-[286px]
                                                lg:rounded-[24px]
                                            "
                                        />
                                    </CarouselItem>
                                )
                            )
                        ) : packages.length === 0 ? (

                            /* EMPTY STATE */

                            <CarouselItem
                                className="
                                    basis-full
                                    pl-3
                                "
                            >
                                <div
                                    className="
                                        flex
                                        h-[190px]
                                        items-center
                                        justify-center
                                        rounded-[18px]
                                        bg-gray-100
                                        text-sm
                                        text-gray-500
                                        sm:h-[220px]
                                        md:h-[250px]
                                        lg:h-[286px]
                                    "
                                >
                                    No upcoming packages
                                    available
                                </div>
                            </CarouselItem>

                        ) : (

                            /* PACKAGES */

                            packages.map(
                                (item: any) => (
                                    <CarouselItem
                                        key={item.id}
                                        className="
                                            basis-[82%]
                                            pl-3
                                            sm:basis-[65%]
                                            sm:pl-4
                                            md:basis-1/2
                                            md:pl-5
                                            lg:basis-1/3
                                            lg:pl-6
                                        "
                                    >
                                        <div
                                            onClick={() =>
                                                handlePackageClick(
                                                    item
                                                )
                                            }
                                            className="
                                                group
                                                relative
                                                h-[190px]
                                                w-full
                                                cursor-pointer
                                                overflow-hidden
                                                rounded-[18px]
                                                bg-gray-200
                                                sm:h-[220px]
                                                sm:rounded-[22px]
                                                md:h-[250px]
                                                lg:h-[286px]
                                                lg:rounded-[24px]
                                            "
                                        >
                                            {/* IMAGE */}

                                            {item
                                                ?.heroImage
                                                ?.url ? (
                                                <Image
                                                    src={
                                                        item.heroImage.url
                                                    }
                                                    alt={
                                                        item.name ??
                                                        "Upcoming package"
                                                    }
                                                    fill
                                                    sizes="
                                                        (max-width: 640px) 82vw,
                                                        (max-width: 768px) 65vw,
                                                        (max-width: 1024px) 50vw,
                                                        33vw
                                                    "
                                                    className="
                                                        object-cover
                                                        transition-transform
                                                        duration-700
                                                        group-hover:scale-105
                                                    "
                                                />
                                            ) : (
                                                <div
                                                    className="
                                                        absolute
                                                        inset-0
                                                        bg-gray-300
                                                    "
                                                />
                                            )}

                                            {/* GRADIENT */}

                                            <div
                                                className="
                                                    absolute
                                                    inset-0
                                                    bg-gradient-to-t
                                                    from-black/80
                                                    via-black/20
                                                    to-transparent
                                                "
                                            />

                                            {/* TOP BADGES */}

                                            <div
                                                className="
                                                    absolute
                                                    left-3
                                                    right-3
                                                    top-3
                                                    flex
                                                    items-center
                                                    justify-between
                                                    gap-2
                                                    sm:left-4
                                                    sm:right-4
                                                    sm:top-4
                                                "
                                            >
                                                {/* UPCOMING */}

                                                <span
                                                    className="
                                                        rounded-[6px]
                                                        bg-white
                                                        px-2
                                                        py-1.5
                                                        text-[10px]
                                                        font-medium
                                                        leading-none
                                                        text-[#20BFAF]
                                                        shadow-sm
                                                        sm:px-3
                                                        sm:py-2
                                                        sm:text-[12px]
                                                    "
                                                >
                                                    Upcoming
                                                </span>

                                                {/* DESTINATION */}

                                                <span
                                                    className="
                                                        max-w-[55%]
                                                        truncate
                                                        rounded-[6px]
                                                        bg-white
                                                        px-2
                                                        py-1.5
                                                        text-[10px]
                                                        font-normal
                                                        leading-none
                                                        text-[#A7ADB8]
                                                        shadow-sm
                                                        sm:px-3
                                                        sm:py-2
                                                        sm:text-[12px]
                                                    "
                                                >
                                                    {item
                                                        ?.destination
                                                        ?.name ??
                                                        item.location ??
                                                        "India"}
                                                </span>
                                            </div>

                                            {/* CONTENT */}

                                            <div
                                                className="
                                                    absolute
                                                    bottom-0
                                                    left-0
                                                    right-0
                                                    flex
                                                    h-[82%]
                                                    flex-col
                                                    justify-between
                                                    p-3
                                                    sm:h-[85%]
                                                    sm:p-4
                                                    md:p-5
                                                    lg:p-5
                                                "
                                            >
                                                {/* PACKAGE INFO */}

                                                <div>
                                                    <h3
                                                        className="
                                                            line-clamp-1
                                                            text-[24px]
                                                            font-bold
                                                            leading-none
                                                            tracking-[0.5px]
                                                            text-white
                                                            sm:text-[30px]
                                                            md:text-[34px]
                                                            lg:text-[40px]
                                                        "
                                                    >
                                                        {item.name}
                                                    </h3>

                                                    <p
                                                        className="
                                                            mt-1
                                                            line-clamp-1
                                                            text-[11px]
                                                            font-normal
                                                            leading-tight
                                                            text-white
                                                            sm:text-[13px]
                                                            md:text-[15px]
                                                            lg:text-[17px]
                                                        "
                                                    >
                                                        {item.subtitle ??
                                                            item.location ??
                                                            ""}
                                                    </p>
                                                </div>

                                                {/* BOTTOM ROW */}

                                                <div
                                                    className="
                                                        flex
                                                        items-end
                                                        justify-between
                                                        gap-2
                                                    "
                                                >
                                                    {/* PRICE */}

                                                    <div>
                                                        <p
                                                            className="
                                                                text-[10px]
                                                                font-normal
                                                                leading-none
                                                                text-white
                                                                sm:text-[12px]
                                                                md:text-[13px]
                                                                lg:text-[15px]
                                                            "
                                                        >
                                                            Starting from
                                                        </p>

                                                        <div
                                                            className="
                                                                mt-1
                                                                flex
                                                                items-baseline
                                                                gap-1
                                                            "
                                                        >
                                                            {item.originalPrice !=
                                                            null ? (
                                                                <>
                                                                    <span
                                                                        className="
                                                                            text-[18px]
                                                                            font-semibold
                                                                            leading-none
                                                                            text-white
                                                                            sm:text-[21px]
                                                                            md:text-[23px]
                                                                            lg:text-[25px]
                                                                        "
                                                                    >
                                                                        ₹
                                                                        {Number(
                                                                            item.originalPrice
                                                                        ).toLocaleString(
                                                                            "en-IN"
                                                                        )}
                                                                    </span>

                                                                    <span
                                                                        className="
                                                                            text-[10px]
                                                                            font-normal
                                                                            text-white
                                                                            sm:text-[12px]
                                                                            lg:text-[14px]
                                                                        "
                                                                    >
                                                                        /person
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <span
                                                                    className="
                                                                        text-[18px]
                                                                        font-semibold
                                                                        leading-none
                                                                        text-white
                                                                        sm:text-[21px]
                                                                        md:text-[23px]
                                                                        lg:text-[25px]
                                                                    "
                                                                >
                                                                    Contact
                                                                    us
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* ACTION BUTTONS */}

                                                    <div
                                                        className="
                                                            flex
                                                            shrink-0
                                                            items-center
                                                            gap-1.5
                                                            sm:gap-2
                                                        "
                                                    >
                                                        {/* PHONE */}

                                                        <Button
                                                            type="button"
                                                            size="icon"
                                                            variant="outline"
                                                            className="
                                                                h-8
                                                                w-8
                                                                rounded-full
                                                                border-white
                                                                bg-transparent
                                                                text-white
                                                                shadow-none
                                                                hover:bg-white
                                                                hover:text-[#20BFAF]
                                                                sm:h-9
                                                                sm:w-9
                                                                md:h-10
                                                                md:w-10
                                                            "
                                                            onClick={(
                                                                event
                                                            ) => {
                                                                event.stopPropagation();

                                                                window.location.href =
                                                                    "tel:+919876543210";
                                                            }}
                                                        >
                                                            <Phone
                                                                className="
                                                                    h-3.5
                                                                    w-3.5
                                                                    sm:h-4
                                                                    sm:w-4
                                                                    md:h-5
                                                                    md:w-5
                                                                "
                                                            />
                                                        </Button>

                                                        {/* ARROW */}

                                                        <Button
                                                            type="button"
                                                            size="icon"
                                                            className="
                                                                h-8
                                                                w-8
                                                                rounded-full
                                                                bg-[#20BFAF]
                                                                text-white
                                                                shadow-none
                                                                transition-transform
                                                                duration-300
                                                                hover:scale-110
                                                                hover:bg-[#20BFAF]
                                                                sm:h-9
                                                                sm:w-9
                                                                md:h-10
                                                                md:w-10
                                                            "
                                                            onClick={(
                                                                event
                                                            ) => {
                                                                event.stopPropagation();

                                                                handlePackageClick(
                                                                    item
                                                                );
                                                            }}
                                                        >
                                                            <ArrowUpRight
                                                                className="
                                                                    h-3.5
                                                                    w-3.5
                                                                    sm:h-4
                                                                    sm:w-4
                                                                    md:h-5
                                                                    md:w-5
                                                                "
                                                            />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                )
                            )
                        )}
                    </CarouselContent>
                </Carousel>

                {/* BOTTOM CONTROLS */}

                <div
                    className="
                        mt-5
                        flex
                        items-center
                        justify-end
                        gap-3
                        sm:mt-6
                    "
                >
                    <div
                        className="
                            flex
                            shrink-0
                            items-center
                            gap-1.5
                            sm:gap-2
                        "
                    >
                        {/* PREVIOUS */}

                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() =>
                                api?.scrollPrev()
                            }
                            className="
                                h-8
                                w-8
                                rounded-full
                                border-[#D9DDE3]
                                bg-[#F8F9FA]
                                text-[#7180A5]
                                shadow-none
                                hover:border-[#20BFAF]
                                hover:bg-[#20BFAF]
                                hover:text-white
                                sm:h-10
                                sm:w-10
                            "
                        >
                            <ChevronLeft
                                className="
                                    h-4
                                    w-4
                                    sm:h-5
                                    sm:w-5
                                "
                            />
                        </Button>

                        {/* NEXT */}

                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() =>
                                api?.scrollNext()
                            }
                            className="
                                h-8
                                w-8
                                rounded-full
                                border-[#D9DDE3]
                                bg-[#F8F9FA]
                                text-[#7180A5]
                                shadow-none
                                hover:border-[#20BFAF]
                                hover:bg-[#20BFAF]
                                hover:text-white
                                sm:h-10
                                sm:w-10
                            "
                        >
                            <ChevronRight
                                className="
                                    h-4
                                    w-4
                                    sm:h-5
                                    sm:w-5
                                "
                            />
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}