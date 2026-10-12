"use client";

import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
    BadgeCheck,
    Headphones,
    Heart,
    Leaf,
    MapPin,
    Mountain,
    Send,
    ShieldCheck,
} from "lucide-react";


const companyLinks = [
    {
        label: "About Us",
        href: "/about-us",
    },
    {
        label: "Contact Us",
        href: "/contact-us",
    },
    {
        label: "Blog",
        href: "/blogs",
    },
];


const supportLinks = [

    {
        label: "Privacy Policy",
        href: "/privacy-policy",
    },
    {
        label: "Terms & Conditions",
        href: "/terms-and-conditions",
    },
    {
        label: "Cancelation & Refund Policy",
        href: "/cancellation-refund-policy",
    },
];


/* =========================================================
   TOP DESTINATIONS
========================================================= */

const destinationLinks = [
    {
        label: "Manali",
        href: "/package/himachal-pradesh/manali",
    },
    {
        label: "Goa",
        href: "/destinations/goa",
    },
    {
        label: "Kerala",
        href: "/destinations/kerala",
    },
    {
        label: "Rajasthan",
        href: "/destinations/rajasthan",
    },
    {
        label: "Ladakh",
        href: "/destinations/ladakh",
    },
    {
        label: "Uttarakhand",
        href: "/destinations/uttarakhand",
    },
    {
        label: "Kashmir",
        href: "/package/kashmir",
    },
    {
        label: "Andaman & Nicobar",
        href: "/package/andaman-nicobar",
    },
    {
        label: "Meghalaya",
        href: "/destinations/meghalaya",
    },
];


/* =========================================================
   POPULAR DESTINATIONS
========================================================= */

const popularDestinations = [
    {
        label: "Goa",
        href: "/package/goa",
    },
    {
        label: "Manali",
        href: "/package/himachal-pradesh/manali",
    },
    {
        label: "Kerala",
        href: "/destinations/kerala",
    },
    {
        label: "Jaipur",
        href: "/package/rajasthan/jaipur",
    },
    {
        label: "Udaipur",
        href: "/package/rajasthan/udaipur",
    },
    {
        label: "Darjeeling",
        href: "/package/darjeeling",
    },
    {
        label: "Rishikesh",
        href: "/package/uttarakhand/rishikesh",
    },
    {
        label: "Mussoorie",
        href: "/package/uttarakhand/mussoorie",
    },
    {
        label: "Nainital",
        href: "/package/uttarakhand/nainital",
    },
    {
        label: "Andaman & Nicobar",
        href: "/package/andaman-nicobar",
    },
    {
        label: "Ladakh",
        href: "/destinations/ladakh",
    },
    {
        label: "Varanasi",
        href: "/package/uttar-pradesh/varanasi",
    },
    {
        label: "Jaisalmer",
        href: "/package/rajasthan/jaisalmer",
    },
    {
        label: "Ooty",
        href: "/package/tamil-nadu/ooty",
    },
    {
        label: "Jim Corbett",
        href: "/package/uttarakhand/jim-corbett",
    },
];


/* =========================================================
   TRAVEL CATEGORIES
========================================================= */

const travelCategories = [
    {
        label: "Flights",
        href: "/flights",
    },
    {
        label: "Hotels",
        href: "/hotels",
    },
    {
        label: "Buses",
        href: "/bus",
    },
    {
        label: "Mountains",
        href: "/category/mountains",
    },
    {
        label: "Nature",
        href: "/category/nature",
    },
    {
        label: "Desert",
        href: "/category/desert",
    },
    {
        label: "Lakes",
        href: "/category/lakes",
    },
    {
        label: "Adventure",
        href: "/dcategory/adventure",
    },
    {
        label: "Spiritual",
        href: "/category/spiritual",
    },
];


/* =========================================================
   SOCIAL
========================================================= */



/* =========================================================
   FEATURES
========================================================= */

const features = [
    {
        icon: ShieldCheck,
        title: "Safe & Secure Booking",
        description:
            "Your data is protected with advanced encryption.",
    },
    {
        icon: Headphones,
        title: "24/7 Customer Support",
        description:
            "We're always here to help, anytime, anywhere.",
    },
    {
        icon: BadgeCheck,
        title: "Best Price Guarantee",
        description:
            "Get the best deals on flights, hotels and packages.",
    },
    {
        icon: Leaf,
        title: "Sustainable Travel",
        description:
            "Travel thoughtfully and explore the world with a focus.",
    },
    {
        icon: Heart,
        title: "Millions of Happy Travelers",
        description:
            "Community of travelers discovering new destinations",
    },
];


export default function Footer() {
    return (
        <footer className="mt-10 w-full bg-[#F9FCFC] text-[#15546A]">

            <div
                className="
                    mx-auto
                    w-full
                    max-w-[1440px]
                    px-5
                    sm:px-7
                    md:px-10
                    lg:px-12
                "
            >

                {/* =====================================================
                    TOP FOOTER
                ====================================================== */}

                <div
                    className="
                        grid
                        grid-cols-1
                        gap-8
                        py-9

                        sm:grid-cols-2
                        sm:gap-10

                        md:gap-12

                        lg:grid-cols-[1.35fr_0.75fr_0.8fr_1.45fr]
                        lg:gap-0
                        lg:py-10
                    "
                >

                    {/* BRAND */}

                    <div className="lg:pr-10">

                        <Link
                            href="/"
                            className="inline-flex items-start"
                        >
                            <div className="flex flex-col">

                                <span
                                    className="
                                        font-serif
                                        text-[25px]
                                        font-bold
                                        italic
                                        leading-none
                                        tracking-[-1px]
                                        text-[#15546A]

                                        sm:text-[27px]

                                        lg:text-[29px]
                                    "
                                >
                                    Wander-India
                                </span>

                                <span
                                    className="
                                        mt-1
                                        text-center
                                        text-[7px]
                                        font-semibold
                                        tracking-[4px]
                                        text-[#5A8895]
                                    "
                                >
                                    EXPLORE
                                </span>

                            </div>
                        </Link>


                        <p
                            className="
                                mt-5
                                max-w-[260px]
                                text-[13px]
                                leading-[19px]
                                text-[#5A7F8B]

                                sm:text-[14px]

                                lg:text-[14px]
                                lg:leading-[21px]
                            "
                        >

                            Explore domestic and international
                            tour packages designed to create
                            lifelong memories you'll cherish.
                            .
                        </p>


                        {/* SOCIAL */}

                        {/* <div className="mt-5 flex items-center gap-5">

                            {socialLinks.map((social) => {
                                const Icon = social.icon;

                                return (
                                    <Link
                                        key={social.label}
                                        href={social.href}
                                        aria-label={social.label}
                                        className="
                                            text-[#15546A]
                                            transition-all
                                            duration-200
                                            hover:-translate-y-0.5
                                            hover:text-[#20BFAF]
                                        "
                                    >
                                        <Icon className="h-[17px] w-[17px]" />
                                    </Link>
                                );
                            })}

                        </div> */}

                    </div>


                    {/* COMPANY */}

                    <FooterColumn
                        title="Company"
                        links={companyLinks}
                    />


                    {/* SUPPORT */}

                    <FooterColumn
                        title="Support"
                        links={supportLinks}
                    />


                    {/* TOP DESTINATIONS */}

                    <div
                        className="
                            lg:border-l
                            lg:border-[#DCEDEE]
                            lg:px-7
                        "
                    >

                        <h3
                            className="
                                text-[15px]
                                font-bold
                                text-[#15546A]

                                lg:text-[15px]
                            "
                        >
                            Top Destinations
                        </h3>


                        <div
                            className="
                                mt-4
                                grid
                                grid-cols-2
                                gap-x-6
                                gap-y-3

                                sm:grid-cols-2
                            "
                        >

                            {destinationLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className="
                                        text-[12px]
                                        text-[#527B87]
                                        transition-colors
                                        hover:text-[#20BFAF]

                                        sm:text-[13px]
                                    "
                                >
                                    {link.label}
                                </Link>
                            ))}

                        </div>

                    </div>




                </div>


                {/* =====================================================
                    FEATURE STRIP
                ====================================================== */}

                <div
                    className="
                        border-y
                        border-[#DCEDEE]
                        py-6
                    "
                >

                    <div
                        className="
                            grid
                            grid-cols-1

                            sm:grid-cols-2

                            lg:grid-cols-5
                        "
                    >

                        {features.map((feature, index) => {

                            const Icon = feature.icon;

                            return (
                                <div
                                    key={feature.title}
                                    className={`
                                        flex
                                        items-start
                                        gap-4
                                        px-2
                                        py-4

                                        sm:px-5

                                        lg:py-2

                                        ${index !== 0
                                            ? "lg:border-l lg:border-[#DCEDEE]"
                                            : ""
                                        }
                                    `}
                                >

                                    <Icon
                                        className="
                                            mt-0.5
                                            h-8
                                            w-8
                                            shrink-0
                                            stroke-[1.5]
                                            text-[#17657B]

                                            sm:h-9
                                            sm:w-9
                                        "
                                    />


                                    <div>

                                        <h4
                                            className="
                                                text-[12px]
                                                font-bold
                                                text-[#15546A]

                                                sm:text-[13px]
                                            "
                                        >
                                            {feature.title}
                                        </h4>


                                        <p
                                            className="
                                                mt-1
                                                max-w-[190px]
                                                text-[10px]
                                                leading-[15px]
                                                text-[#668A94]

                                                sm:text-[11px]
                                                sm:leading-[16px]
                                            "
                                        >
                                            {feature.description}
                                        </p>

                                    </div>

                                </div>
                            );
                        })}

                    </div>

                </div>


                {/* =====================================================
                    POPULAR DESTINATIONS + CATEGORIES
                ====================================================== */}

                <div
                    className="
                        grid
                        grid-cols-1
                        gap-8
                        py-8

                        lg:grid-cols-[2fr_1fr]
                        lg:gap-0
                    "
                >

                    {/* POPULAR DESTINATIONS */}

                    <div className="lg:pr-10">

                        <h3
                            className="
                                text-[14px]
                                font-bold
                                text-[#15546A]

                                sm:text-[15px]
                            "
                        >
                            Popular Destinations
                        </h3>


                        <div className="mt-4 flex flex-wrap">

                            {popularDestinations.map(
                                (destination, index) => (
                                    <div
                                        key={destination.label}
                                        className="
                                            flex
                                            items-center
                                        "
                                    >

                                        <Link
                                            href={destination.href}
                                            className="
                                                text-[11px]
                                                leading-6
                                                text-[#5D838D]
                                                transition-colors
                                                hover:text-[#20BFAF]

                                                sm:text-[12px]

                                                lg:text-[13px]
                                            "
                                        >
                                            {destination.label}
                                        </Link>


                                        {index !==
                                            popularDestinations.length - 1 && (
                                                <span
                                                    className="
                                                    mx-2
                                                    text-[#B6CFD2]

                                                    sm:mx-2.5
                                                "
                                                >
                                                    |
                                                </span>
                                            )}

                                    </div>
                                )
                            )}

                        </div>

                    </div>


                    {/* TRAVEL CATEGORIES */}

                    <div
                        className="
                            lg:border-l
                            lg:border-[#DCEDEE]
                            lg:pl-8
                        "
                    >

                        <h3
                            className="
                                text-[14px]
                                font-bold
                                text-[#15546A]

                                sm:text-[15px]
                            "
                        >
                            Travel Categories
                        </h3>


                        <div className="mt-4 flex flex-wrap">

                            {travelCategories.map(
                                (category, index) => (
                                    <div
                                        key={category.label}
                                        className="flex items-center"
                                    >

                                        <Link
                                            href={category.href}
                                            className="
                                                text-[11px]
                                                leading-6
                                                text-[#5D838D]
                                                transition-colors
                                                hover:text-[#20BFAF]

                                                sm:text-[12px]

                                                lg:text-[13px]
                                            "
                                        >
                                            {category.label}
                                        </Link>


                                        {index !==
                                            travelCategories.length - 1 && (
                                                <span
                                                    className="
                                                    mx-2
                                                    text-[#B6CFD2]

                                                    sm:mx-2.5
                                                "
                                                >
                                                    |
                                                </span>
                                            )}

                                    </div>
                                )
                            )}

                        </div>

                    </div>

                </div>




                {/* =====================================================
                    BOTTOM BAR
                ====================================================== */}

                <div
                    className="
                        border-t
                        border-[#DCEDEE]
                        py-5
                    "
                >

                    <div
                        className="
                            flex
                            flex-col
                            gap-4

                            md:flex-row
                            md:items-center
                            md:justify-between
                        "
                    >

                        <p
                            className="
                                text-center
                                text-[10px]
                                text-[#668A94]

                                md:text-left

                                lg:text-[11px]
                            "
                        >
                            © 2026 Wander-India. All Rights Reserved.
                        </p>


                        <div
                            className="
                                flex
                                flex-wrap
                                items-center
                                justify-center
                                gap-2
                                text-[10px]
                                text-[#668A94]

                                lg:text-[11px]
                            "
                        >

                            <Link
                                href="/terms-and-conditions"
                                className="hover:text-[#20BFAF]"
                            >
                                Terms & Conditions
                            </Link>

                            <span className="text-[#C3D8DA]">
                                |
                            </span>

                            <Link
                                href="/privacy-policy"
                                className="hover:text-[#20BFAF]"
                            >
                                Privacy Policy
                            </Link>

                            <span className="text-[#C3D8DA]">
                                |
                            </span>

                        

                            <Link
                                href="/sitemap"
                                className="hover:text-[#20BFAF]"
                            >
                                Sitemap
                            </Link>

                        </div>


                        <div className="hidden items-center gap-2 lg:flex">

                            <span
                                className="
                                    font-serif
                                    text-[10px]
                                    italic
                                    text-[#527B87]
                                "
                            >
                                Travel More
                            </span>

                            <Mountain
                                className="
                                    h-8
                                    w-11
                                    text-[#527B87]
                                "
                            />

                            <span
                                className="
                                    font-serif
                                    text-[10px]
                                    italic
                                    text-[#527B87]
                                "
                            >
                                Worry Less
                            </span>

                        </div>

                    </div>

                </div>

            </div>

        </footer>
    );
}


/* =========================================================
   FOOTER COLUMN
========================================================= */

function FooterColumn({
    title,
    links,
}: {
    title: string;
    links: {
        label: string;
        href: string;
    }[];
}) {
    return (
        <div
            className="
                lg:border-l
                lg:border-[#DCEDEE]
                lg:px-7
            "
        >

            <h3
                className="
                    text-[15px]
                    font-bold
                    text-[#15546A]
                "
            >
                {title}
            </h3>


            <nav
                className="
                    mt-4
                    flex
                    flex-col
                    gap-3
                "
            >

                {links.map((link) => (
                    <Link
                        key={link.label}
                        href={link.href}
                        className="
                            text-[12px]
                            text-[#527B87]
                            transition-colors
                            hover:text-[#20BFAF]

                            sm:text-[13px]
                        "
                    >
                        {link.label}
                    </Link>
                ))}

            </nav>

        </div>
    );
}


/* =========================================================
   PAYMENT METHODS
========================================================= */

function PaymentMethods({
    className = "",
}: {
    className?: string;
}) {
    return (
        <div
            className={`
                flex
                items-center
                gap-5
                ${className}
            `}
        >

            <span
                className="
                    text-[17px]
                    font-black
                    italic
                    tracking-[-1px]
                    text-[#174C72]
                "
            >
                VISA
            </span>


            <span
                className="
                    relative
                    flex
                    h-4
                    w-7
                    items-center
                "
            >

                <span
                    className="
                        absolute
                        left-0
                        h-4
                        w-4
                        rounded-full
                        bg-[#EA001B]
                    "
                />

                <span
                    className="
                        absolute
                        right-0
                        h-4
                        w-4
                        rounded-full
                        bg-[#F79E1B]
                        opacity-90
                    "
                />

            </span>


            <span
                className="
                    text-[13px]
                    font-bold
                    italic
                    text-[#777777]
                "
            >
                UPI
            </span>


            <span
                className="
                    text-[14px]
                    font-black
                    tracking-[-0.5px]
                    text-[#1572B6]
                "
            >
                paytm
            </span>

        </div>
    );
}