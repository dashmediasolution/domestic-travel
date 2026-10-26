"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Oswald } from "next/font/google";
import HeroSectionSkeleton from "./HeroSectionSkeleton";
const SLIDE_DURATION = 3000;

const oswald = Oswald({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

/* ============================================================
   API TYPES
============================================================ */

interface ApiDestination {
    id: string;
    name: string;
    subtitle: string;
    description: string
    heroImage:
    | {
        url: string;
        publicId: string | null;
    }
    | string;
    budget: string;
}

interface ApiResponse {
    success: boolean;
    destinations: ApiDestination[];
}

/* ============================================================
   HERO DESTINATION TYPE
============================================================ */

interface HeroDestination {
    id: string;
    name: string;
    subtitle: string
    image: string;
    background: string;
    redirect: string;
    description: string;
}

const getShortDescription = (text: string) => {
    const words = text.trim().split(/\s+/);

    if (words.length <= 20) {
        return text;
    }

    return `${words.slice(0, 20).join(" ")}...`;
};
/* ============================================================
   COMPONENT
============================================================ */

export default function HeroSection() {
    const [destinations, setDestinations] = useState<
        HeroDestination[]
    >([]);

    const [activeIndex, setActiveIndex] = useState(0);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);

    /* ============================================================
       FETCH FEATURED DESTINATIONS
    ============================================================ */

    useEffect(() => {
        const controller = new AbortController();

        const fetchDestinations = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(
                    "/api/featured-destinations",
                    {
                        method: "GET",
                        headers: {
                            Accept: "application/json",
                        },
                                cache: "no-store",

                        signal: controller.signal,
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch destinations: ${response.status}`
                    );
                }

                const data: ApiResponse = await response.json();

                if (
                    !data.success ||
                    !Array.isArray(data.destinations)
                ) {
                    throw new Error(
                        "Invalid destinations API response"
                    );
                }

                const formattedDestinations: HeroDestination[] =
                    data.destinations
                        .filter(
                            (destination) =>
                                destination?.id &&
                                destination?.name &&
                                destination?.heroImage
                        )
                        .map((destination) => {
                            /* ----------------------------------------
                               Get image URL
                            ---------------------------------------- */

                            const image =
                                typeof destination.heroImage ===
                                    "string"
                                    ? destination.heroImage
                                    : destination.heroImage.url;

                            /* ----------------------------------------
                               Generate destination slug
                            ---------------------------------------- */

                            const slug = destination.name
                                .trim()
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, "-")
                                .replace(/^-+|-+$/g, "");

                            return {
                                id: destination.id,
                                name: destination.name,
                                image,
                                subtitle: destination.subtitle,
                                background: image,
                                redirect: `/destinations/${slug}`,
                                description: destination.description
                            };
                        });

                setDestinations(formattedDestinations);

                setActiveIndex(0);
            } catch (err) {
                if (
                    err instanceof DOMException &&
                    err.name === "AbortError"
                ) {
                    return;
                }

                console.error(
                    "Failed to load featured destinations:",
                    err
                );

                setError(
                    err instanceof Error
                        ? err.message
                        : "Unable to load destinations"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDestinations();

        return () => {
            controller.abort();
        };
    }, []);

    /* ============================================================
       ACTIVE DESTINATION
    ============================================================ */

    const activeDestination =
        destinations[activeIndex];

    /* ============================================================
       NEXT SLIDE
    ============================================================ */

    const nextSlide = () => {
        if (destinations.length === 0) {
            return;
        }

        setActiveIndex(
            (current) =>
                (current + 1) % destinations.length
        );
    };

    /* ============================================================
       PREVIOUS SLIDE
    ============================================================ */

    const previousSlide = () => {
        if (destinations.length === 0) {
            return;
        }

        setActiveIndex(
            (current) =>
                (current -
                    1 +
                    destinations.length) %
                destinations.length
        );
    };

    /* ============================================================
       AUTO SLIDER
    ============================================================ */

    useEffect(() => {
        if (destinations.length <= 1) {
            return;
        }

        const interval = setInterval(() => {
            setActiveIndex(
                (current) =>
                    (current + 1) %
                    destinations.length
            );
        }, SLIDE_DURATION);

        return () => {
            clearInterval(interval);
        };
    }, [destinations.length]);

    /* ============================================================
       LOADING STATE
    ============================================================ */

    if (loading) {
        return (
            <HeroSectionSkeleton />

        );
    }

    /* ============================================================
       ERROR / EMPTY STATE
    ============================================================ */

    if (
        error ||
        destinations.length === 0 ||
        !activeDestination
    ) {
        return (
            <HeroSectionSkeleton />
        );
    }

    /* ============================================================
       UI
    ============================================================ */
    console.log(activeDestination, "dsfsfp")
    return (
        <section
            className="
                relative
                min-h-[40vh]
                w-full
                overflow-hidden
                bg-black

                sm:min-h-[40vh]

                lg:h-[calc(100vh-72px)]
                lg:min-h-[650px]
                lg:max-h-[900px]
            "
        >
            {/* =====================================================
                BACKGROUND SLIDES
            ===================================================== */}

            <div className="absolute inset-0 bg-black">
                {destinations.map(
                    (destination, index) => (
                        <motion.div
                            key={destination.id}
                            initial={false}
                            animate={{
                                opacity:
                                    activeIndex ===
                                        index
                                        ? 1
                                        : 0,

                                scale:
                                    activeIndex ===
                                        index
                                        ? 1
                                        : 1.04,
                            }}
                            transition={{
                                opacity: {
                                    duration: 0.5,
                                    ease: "easeInOut",
                                },

                                scale: {
                                    duration: 0.7,
                                    ease: "easeOut",
                                },
                            }}
                            className="
                                absolute
                                inset-0
                            "
                        >
                            <Image
                                src={
                                    destination.background
                                }
                                alt={`${destination.name} destination`}
                                fill
                                unoptimized
                                priority={
                                    index === 0
                                }
                                sizes="100vw"
                                className="object-cover"
                            />

                            <div
                                className="
                                    absolute
                                    inset-x-0
                                    bottom-0
                                    h-[55%]
                                    bg-linear-to-t
                                    from-black/45
                                    via-black/10
                                    to-transparent
                                "
                            />
                        </motion.div>
                    )
                )}
            </div>

            {/* =====================================================
                MAIN CONTENT
            ===================================================== */}

            <div
                className="
                    relative
                    z-10
                    mx-auto
                    flex
                    min-h-[40vh]
                    w-full
                    max-w-[1440px]
                    flex-col
                    px-5
                    pb-7
                    pt-24

                    sm:px-8
                    sm:pt-28

                    lg:h-full
                    lg:min-h-0
                    lg:px-12
                    lg:pb-10
                    lg:pt-0
                "
            >
                {/* =================================================
                    LEFT CONTENT
                ================================================= */}

                <div
                    className="
                        relative
                        bottom-10
                        flex
                        h-full
                        flex-1
                        flex-col
                        items-start
                        justify-center
                        gap-4
                        lg:top-8
                        lg:w-[54%]
                        md:bottom-8
                    "
                >
                    {/* TOP TEXT */}

                    {/* TOP TEXT */}
                    <p
                        className="
                            w-fit
                            max-w-[600px]
                            text-[13px]
                            font-bold
                            tracking-[-0.2px]
                            text-white
                            sm:text-[15px]
                        "
                    >
                        {activeDestination.subtitle}
                    </p>

                    {/* TITLE */}

                    <h1
                        className={`
                            ${oswald.className}
                            max-w-[700px]
                            text-[29px]
                            font-semibold
                            uppercase
                            leading-[1.1]
                            tracking-[0.5px]
                            text-white
                            sm:text-[38px]
                            md:text-[50px]
                            lg:text-[60px]
                            xl:text-[70px]
                        `}
                    >
                        Discover Your <br />
                        Next Holiday
                    </h1>

                    {/* DESTINATION DESCRIPTION */}

                    <motion.div
                        key={activeDestination.id}
                        initial={{
                            opacity: 0,
                            y: 25,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.4,
                            ease: [
                                0.22,
                                1,
                                0.36,
                                1,
                            ],
                        }}
                        className="
                            flex
                            w-full
                            max-w-[650px]
                            flex-col
                            gap-2
                        "
                    >
                        <p
                            className="
                                max-w-[470px]
                                text-[15px]
                                font-normal
                                leading-[1.3]
                                text-white
                                sm:text-[17px]
                                md:leading-[1.45]
                                lg:text-[18px]
                            "
                        >

                            {activeDestination.description}

                        </p>
                    </motion.div>

                    {/* PLAN TRIP */}

                    <Button
                        type="button"
                        onClick={() =>
                            window.dispatchEvent(
                                new Event(
                                    "open-query-form"
                                )
                            )
                        }
                        className="
                            h-9
                            shrink-0
                            rounded-full
                            bg-[#2FC2B0]
                            px-3
                            text-[12px]
                            font-medium
                            text-white
                            shadow-none
                            hover:bg-[#25AD9D]

                            sm:h-10
                            sm:px-4
                            sm:text-[13px]

                            md:text-[17px]
                        "
                    >
                        Plan your Trip

                        <ArrowRight
                            className="
                                ml-1
                                h-3.5
                                w-3.5

                                sm:ml-2
                                sm:h-4
                                sm:w-4
                            "
                        />
                    </Button>
                </div>

                {/* =================================================
                    DESTINATION CARDS
                ================================================= */}

                <div
                    className="
                        relative
                        mt-10
                        hidden
                        h-[300px]
                        w-full

                        lg:absolute
                        lg:right-[-10px]
                        lg:top-1/2
                        lg:mt-0
                        lg:flex
                        lg:h-[430px]
                        lg:w-[48%]
                        lg:-translate-y-1/2

                        xl:right-[-20px]
                        xl:w-[47%]
                    "
                >
                    {/* DOT PATTERN */}

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -left-3
                            -top-6
                            z-0
                            hidden
                            h-[185px]
                            w-[200px]
                            opacity-90
                            sm:block

                            lg:-left-9
                            lg:-top-0
                        "
                        style={{
                            backgroundImage:
                                "radial-gradient(circle, white 3px, transparent 3px)",
                            backgroundSize:
                                "12px 12px",
                        }}
                    />

                    <div className="absolute inset-0 overflow-visible">
                        {destinations.map(
                            (
                                destination,
                                index
                            ) => {
                                const relativeIndex =
                                    (index -
                                        activeIndex -
                                        1 +
                                        destinations.length) %
                                    destinations.length;

                                /*
                                 * Hide cards outside
                                 * the 4 visible slots.
                                 */

                                if (
                                    relativeIndex >
                                    3
                                ) {
                                    return null;
                                }

                                const cardPositions =
                                    [
                                        /* ACTIVE */
                                        {
                                            left: "0%",
                                            top: "35px",
                                            width: "235px",
                                            height: "320px",
                                            zIndex: 40,
                                        },

                                        /* SMALL 1 */
                                        {
                                            left: "249px",
                                            top: "60px",
                                            width: "187px",
                                            height: "280px",
                                            zIndex: 30,
                                        },

                                        /* SMALL 2 */
                                        {
                                            left: "450px",
                                            top: "60px",
                                            width: "187px",
                                            height: "280px",
                                            zIndex: 20,
                                        },

                                        /* SMALL 3 */
                                        {
                                            left: "650px",
                                            top: "60px",
                                            width: "187px",
                                            height: "280px",
                                            zIndex: 10,
                                        },
                                    ];

                                const position =
                                    cardPositions[
                                    relativeIndex
                                    ];

                                const isActive =
                                    relativeIndex ===
                                    0;

                                return (
                                    <motion.div
                                        key={
                                            destination.id
                                        }
                                        initial={
                                            relativeIndex ===
                                                0
                                                ? {
                                                    opacity: 0,
                                                    x: 80,
                                                }
                                                : false
                                        }
                                        animate={{
                                            left: position.left,
                                            top: position.top,
                                            width: position.width,
                                            height: position.height,
                                            opacity: 1,
                                            x: 0,
                                        }}
                                        transition={{
                                            duration:
                                                relativeIndex ===
                                                    0
                                                    ? 0.7
                                                    : relativeIndex ===
                                                        3
                                                        ? 0
                                                        : 0.7,

                                            ease: [
                                                0.22,
                                                1,
                                                0.36,
                                                1,
                                            ],
                                        }}
                                        className="
                                            absolute
                                            overflow-hidden
                                            rounded-[22px]
                                            border
                                            border-white/15
                                            shadow-[0_10px_35px_rgba(0,0,0,0.22)]
                                        "
                                        style={{
                                            zIndex:
                                                position.zIndex,
                                        }}
                                    >
                                        {/* IMAGE */}

                                        <Link
                                            href={
                                                destination.redirect
                                            }
                                        >
                                            <Image
                                                src={destination.image}
                                                alt={destination.name}
                                                fill
                                                priority={isActive}
                                                sizes="235px"
                                                className="
                                                object-cover
                                                transition-transform
                                                duration-700
                                                hover:scale-105
                                            "
                                            />
                                        </Link>

                                        {/* DESTINATION NAME */}

                                        <div
                                            className="
                                                absolute
                                                bottom-5
                                                left-4
                                                right-3
                                            "
                                        >
                                            <h2
                                                className={`
                                                    ${oswald.className}
                                                    font-semibold
                                                    uppercase
                                                    leading-none
                                                    tracking-[0.5px]
                                                    text-white
                                                    ${isActive
                                                        ? "text-[32px]"
                                                        : "text-[22px]"
                                                    }
                                                `}
                                            >
                                                {
                                                    destination.name
                                                }
                                            </h2>
                                        </div>
                                    </motion.div>
                                );
                            }
                        )}
                    </div>
                </div>

                {/* =================================================
                    CONTROLS
                ================================================= */}

                <div
                    className="
                        relative
                        z-50
                        bottom-20
                        hidden
                        items-center
                        justify-end
                        gap-3
                        lg:flex
                        lg:ml-[55%]
                        lg:mt-0
                        lg:justify-start
                    "
                >
                    {/* PREVIOUS */}

                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={previousSlide}
                        aria-label="Previous destination"
                        className="
                            h-9
                            w-9
                            rounded-full
                            border-white
                            bg-transparent
                            text-white
                            shadow-none
                            backdrop-blur-sm
                            hover:border-primary
                            hover:bg-primary
                            hover:text-white

                            sm:h-10
                            sm:w-10
                        "
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>

                    {/* NEXT */}

                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={nextSlide}
                        aria-label="Next destination"
                        className="
                            h-9
                            w-9
                            rounded-full
                            border-white
                            bg-transparent
                            text-white
                            shadow-none
                            backdrop-blur-sm
                            hover:border-primary
                            hover:bg-primary
                            hover:text-white

                            sm:h-10
                            sm:w-10
                        "
                    >
                        <ChevronRight className="h-5 w-5" />
                    </Button>

                    {/* PROGRESS BAR */}

                    <div
                        className="
                            hidden
                            h-[2px]
                            w-[250px]
                            overflow-hidden
                            bg-white/50

                            sm:block
                            md:w-[320px]
                            lg:w-[400px]
                            xl:w-[500px]
                        "
                    >
                        <motion.div
                            key={activeIndex}
                            initial={{
                                width: 0,
                            }}
                            animate={{
                                width: "100%",
                            }}
                            transition={{
                                duration:
                                    SLIDE_DURATION /
                                    1000,
                                ease: "linear",
                            }}
                            className="
                                h-full
                                bg-white
                            "
                        />
                    </div>

                    {/* SLIDE NUMBER */}

                    <motion.span
                        key={`number-${activeIndex}`}
                        initial={{
                            opacity: 0,
                            y: 8,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        className={`
                            ${oswald.className}
                            ml-1
                            text-[28px]
                            font-medium
                            leading-none
                            text-white
                            sm:text-[34px]
                        `}
                    >
                        {String(
                            activeIndex + 1
                        ).padStart(2, "0")}
                    </motion.span>
                </div>
            </div>
        </section>
    );
}