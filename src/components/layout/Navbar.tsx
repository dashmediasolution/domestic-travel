"use client";

import React from "react";
import Link from "next/link";
import {
    Menu,
    Search,
    Phone,
    X,
    ChevronDown,
    MessageSquare,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { TbPlaneInflight } from "react-icons/tb";
import { IoBusOutline } from "react-icons/io5";
import { FiMapPin } from "react-icons/fi";

import {
    FaRegBuilding,
    FaUmbrellaBeach,
    FaMountain,
    FaHiking,
    FaCampground,
    FaLeaf,
    FaWater,
    FaMosque,
    FaChurch,
} from "react-icons/fa";

import { GiDesert, GiTempleDoor } from "react-icons/gi";

export default function Navbar() {
    const [categories, setCategories] = useState<string[]>([]);
    const [destination, setDestinations] = useState<any>([]);
    const pathname = usePathname();

    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const [destinationsOpen, setDestinationsOpen] = useState(false);

    // =========================
    // SCROLL HANDLER
    // =========================

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 30);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // =========================
    // MOBILE BODY SCROLL
    // =========================

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileMenuOpen]);

    // =========================
    // QUERY FORM
    // =========================

    const openQueryForm = () => {
        setMobileMenuOpen(false);
        window.dispatchEvent(new Event("open-query-form"));
    };

    // =========================
    // FETCH CATEGORIES
    // =========================

    const fetchCategories = async () => {
        try {
            const category = await fetch("/api/categories", {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
                cache: "no-store",
            });

            const response = await category.json();


            if (!response.success) {
                throw new Error(
                    response.message || "Failed to fetch Category"
                );
            }

            setCategories(response?.data || []);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
            setCategories([]);
        }
    };
    const fetchDestinations = async () => {
        try {
            const category = await fetch("/api/destinations-name", {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
                cache: "no-store",
            });

            const response = await category.json();


            if (!response.success) {
                throw new Error(
                    response.message || "Failed to fetch Category"
                );
            }

            setDestinations(response?.data || []);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
            setDestinations([]);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            await Promise.all([
                fetchCategories(),
                fetchDestinations(),
            ]);
        };

        loadData();
    }, []);

    // =========================
    // CATEGORY ICON
    // =========================

    const getCategoryIcon = (category: string) => {
        const name = category.toLowerCase();

        if (name.includes("beach")) {
            return <FaUmbrellaBeach className="h-5 w-5" />;
        }

        if (name.includes("mountain")) {
            return <FaMountain className="h-5 w-5" />;
        }

        if (name.includes("desert")) {
            return <GiDesert className="h-5 w-5" />;
        }

        if (name.includes("lake")) {
            return <FaWater className="h-5 w-5" />;
        }

        if (name.includes("adventure")) {
            return <FaHiking className="h-5 w-5" />;
        }

        if (name.includes("camp")) {
            return <FaCampground className="h-5 w-5" />;
        }

        if (name.includes("spiritual")) {
            return <GiTempleDoor className="h-5 w-5" />;
        }

        if (name.includes("nature")) {
            return <FaLeaf className="h-5 w-5" />;
        }

        if (name.includes("religious")) {
            return <FaMosque className="h-5 w-5" />;
        }

        if (name.includes("church")) {
            return <FaChurch className="h-5 w-5" />;
        }

        // Default icon
        return <FiMapPin className="h-5 w-5" />;
    };



    const navItems = [
        {
            label: "Flights",
            href: "/flights",
            icon: <TbPlaneInflight className="h-5 w-5 shrink-0" />,
        },
        {
            label: "Hotels",
            href: "/hotels",
            icon: <FaRegBuilding className="h-5 w-5 shrink-0" />,
        },
        {
            label: "Bus",
            href: "/bus",
            icon: <IoBusOutline className="h-5 w-5 shrink-0" />,
        },
    ];
    // const destinationEmojis: Record<string, string> = {
    //     goa: "🏖️",
    //     uttarakhand: "🏔️",
    //     rajasthan: "🏜️",
    //     "himachal-pradesh": "🏔️",
    //     ladakh: "🏕️",
    //     "tamil-nadu": "🛕",
    // };
    return (
        <>
            <nav
                className={`
                    fixed
                    left-0
                    right-0
                    top-0
                    z-50
                    w-full
                    transition-all
                    duration-300
                    ${scrolled || mobileMenuOpen
                        ? "bg-white text-black shadow-sm"
                        : "bg-transparent text-white"
                    }
                `}
            >
                <div
                    className="
                        mx-auto
                        flex
                        h-16
                        w-full
                        max-w-[95%]
                        items-center
                        justify-between
                        px-4
                        sm:px-6
                        lg:px-8
                    "
                >
                    {/* ================= LOGO ================= */}

                    <Link
                        href="/"
                        className="
                            shrink-0
                            text-base
                            font-semibold
                            tracking-tight
                            sm:text-lg
                        "
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Domestic - Travel
                    </Link>

                    {/* ================= DESKTOP NAV ================= */}

                    <NavigationMenu className="hidden md:flex">
                        <NavigationMenuList className="gap-3">

                            {/* ================= FLIGHTS ================= */}

                            <NavigationMenuItem>
                                <Link
                                    href="/flights"
                                    className={`
                                        flex
                                        items-center
                                        gap-2
                                        px-3
                                        py-1.5
                                        text-[15px]
                                        font-medium
                                        transition-colors
                                        hover:bg-white/10
                                        hover:text-primary
                                        ${pathname === "/flights"
                                            ? "border-b-2 border-b-primary"
                                            : "border-b-2 border-b-transparent"
                                        }
                                    `}
                                >
                                    <TbPlaneInflight className="h-5 w-5" />
                                    Flights
                                </Link>
                            </NavigationMenuItem>

                            {/* ================= HOTELS ================= */}

                            <NavigationMenuItem>
                                <Link
                                    href="/hotels"
                                    className={`
                                        flex
                                        items-center
                                        gap-2
                                        px-3
                                        py-1.5
                                        text-[15px]
                                        font-medium
                                        transition-colors
                                        hover:bg-white/10
                                        hover:text-primary
                                        ${pathname === "/hotels"
                                            ? "border-b-2 border-b-primary"
                                            : "border-b-2 border-b-transparent"
                                        }
                                    `}
                                >
                                    <FaRegBuilding className="h-5 w-5" />
                                    Hotels
                                </Link>
                            </NavigationMenuItem>

                            {/* ================= BUS ================= */}

                            <NavigationMenuItem>
                                <Link
                                    href="/bus"
                                    className={`
                                        flex
                                        items-center
                                        gap-2
                                        px-3
                                        py-1.5
                                        text-[15px]
                                        font-medium
                                        transition-colors
                                        hover:bg-white/10
                                        hover:text-primary
                                        ${pathname === "/bus"
                                            ? "border-b-2 border-b-primary"
                                            : "border-b-2 border-b-transparent"
                                        }
                                    `}
                                >
                                    <IoBusOutline className="h-5 w-5" />
                                    Bus
                                </Link>
                            </NavigationMenuItem>

                            {/* ================= CATEGORIES ================= */}

                            <NavigationMenuItem>
                                <NavigationMenuTrigger
                                    className="
                                        bg-transparent
                                        text-[15px]
                                        font-medium
                                        hover:bg-white/10
                                        hover:text-primary
                                        data-[state=open]:bg-white/10
                                        data-[state=open]:text-primary
                                    "
                                >
                                    <FaUmbrellaBeach className="mr-2 h-5 w-5" />
                                    Categories
                                </NavigationMenuTrigger>

                                <NavigationMenuContent>
                                    <div className="w-[420px] p-3">

                                        <div className="mb-4">
                                            <h3 className="text-sm font-semibold">
                                                Explore by Category
                                            </h3>

                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Find your perfect trip based on
                                                your travel style.
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">

                                            {categories.map(
                                                (category, index) => (
                                                    <Link
                                                        key={index}
                                                        href={`/category/${category
                                                            .toLowerCase()
                                                            .replace(
                                                                /\s+/g,
                                                                "-"
                                                            )}`}
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-3
                                                            rounded-xl
                                                            p-3
                                                            no-underline
                                                            outline-none
                                                            transition-colors
                                                            hover:bg-muted
                                                        "
                                                    >

                                                        {/* CATEGORY ICON */}

                                                        <span
                                                            className="
                                                                flex
                                                                h-10
                                                                w-10
                                                                shrink-0
                                                                items-center
                                                                justify-center
                                                                rounded-lg
                                                                bg-muted
                                                                text-primary
                                                            "
                                                        >
                                                            {getCategoryIcon(
                                                                category
                                                            )}
                                                        </span>

                                                        {/* CATEGORY NAME */}

                                                        <div>
                                                            <p className="text-sm font-medium">
                                                                {category}
                                                            </p>
                                                        </div>

                                                    </Link>
                                                )
                                            )}

                                        </div>

                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            {/* ================= DESTINATIONS ================= */}



                            <NavigationMenuItem>
                                <NavigationMenuTrigger
                                    className="
                                    bg-transparent text-sm font-medium
                                    hover:bg-white/10 hover:text-[#31C4AF]
                                    data-[state=open]:bg-white/10
                                    data-[state=open]:text-[#31C4AF]
                                    "
                                >
                                    <FiMapPin className="mr-1.5 h-4 w-4" />
                                    Destinations
                                </NavigationMenuTrigger>

                                <NavigationMenuContent>
                                    <div className="w-[min(680px,calc(100vw-2rem))] p-3">
                                        <div className="mb-2 flex items-center justify-between">
                                            <h3 className="text-xs font-semibold text-slate-900">
                                                All cities
                                            </h3>
                                            <span className="text-[11px] text-slate-500">
                                                {destination.length} cities
                                            </span>
                                        </div>

                                        <div
                                            className="
                                            max-h-[250px] overflow-y-auto overscroll-contain pr-1.5
                                            [scrollbar-width:thin]
                                            [scrollbar-color:#31C4AF_#F1F5F9]
                                            [&::-webkit-scrollbar]:w-1
                                            [&::-webkit-scrollbar-track]:bg-slate-100
                                            [&::-webkit-scrollbar-thumb]:rounded-full
                                            [&::-webkit-scrollbar-thumb]:bg-[#31C4AF]
                                            "
                                        >
                                            <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-4">
                                                {destination.map((item: any) => (
                                                    <Link
                                                        key={item.slug}
                                                        href={`/destinations/${item.slug}`}
                                                        className="
                                                                    group flex min-w-0 items-center gap-1.5
                                                                    rounded-lg border border-slate-200 bg-white
                                                                    px-2 py-2 transition-colors
                                                                    hover:border-[#31C4AF]
                                                                    hover:bg-[#31C4AF]/5
                                                                "
                                                    >
                                                        <span
                                                            className="
                                                                flex h-6 w-6 shrink-0 items-center justify-center
                                                                rounded-md bg-slate-100 text-slate-500
                                                                group-hover:bg-[#31C4AF]/10
                                                                group-hover:text-[#31C4AF]
                                                                "
                                                        >
                                                            <FiMapPin className="h-3 w-3" />
                                                        </span>

                                                        <span className="truncate text-xs text-slate-700 group-hover:text-[#168F80]">
                                                            {item.name}
                                                        </span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-2 border-t border-slate-100 pt-2 text-center">
                                            <p className="text-[10px] text-slate-500">
                                                Select a city to explore its destination.
                                            </p>
                                        </div>
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>



                        </NavigationMenuList>
                    </NavigationMenu>

                    {/* ================= DESKTOP ACTIONS ================= */}

                    <div className="hidden items-center gap-5 md:flex">

                        {/* QUERY */}

                        <Button
                            type="button"
                            variant="ghost"
                            onClick={openQueryForm}
                            className={`
                                h-10
                                cursor-pointer
                                rounded-full
                                border
                                bg-transparent
                                px-3
                                shadow-none
                                transition-all
                                duration-200
                                hover:border-primary
                                hover:bg-primary
                                hover:text-white
                                ${scrolled
                                    ? "border-black/20 text-black"
                                    : "border-white text-white"
                                }
                            `}
                        >
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Query
                        </Button>

                        {/* PHONE */}

                        <a
                            href="tel:+919876543210"
                            className={`
                                flex
                                h-10
                                items-center
                                gap-2
                                rounded-full
                                border
                                bg-transparent
                                px-3
                                shadow-none
                                transition-all
                                duration-200
                                hover:border-primary
                                hover:bg-primary
                                hover:text-white
                                ${scrolled
                                    ? "border-black/20 text-black"
                                    : "border-white text-white"
                                }
                            `}
                        >
                            <Phone className="h-5 w-5 shrink-0" />

                            <span className="hidden text-sm font-medium md:block">
                                +91 98765 43210
                            </span>
                        </a>

                    </div>

                    {/* ================= MOBILE MENU BUTTON ================= */}

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={
                            mobileMenuOpen ? "Close menu" : "Open menu"
                        }
                        onClick={() =>
                            setMobileMenuOpen(!mobileMenuOpen)
                        }
                        className={`
                            h-9
                            w-9
                            md:hidden
                            cursor-pointer
                            rounded-full
                            border
                            bg-transparent
                            shadow-none
                            transition-all
                            duration-200
                            hover:border-primary
                            hover:bg-primary
                            hover:text-white
                            ${scrolled || mobileMenuOpen
                                ? "border-black/20 text-black"
                                : "border-white text-white"
                            }
                        `}
                    >
                        {mobileMenuOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </Button>

                </div>

                {/* ================= MOBILE NAV ================= */}

                <div
                    className={`
                        overflow-hidden
                        border-t
                        border-black/10
                        bg-white
                        transition-all
                        duration-300
                        md:hidden
                        ${mobileMenuOpen
                            ? "max-h-[700px] opacity-100"
                            : "max-h-0 opacity-0"
                        }
                    `}
                >

                    <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6">

                        <div className="flex flex-col">

                            {/* ================= MOBILE MAIN LINKS ================= */}

                            {navItems.map((item, index) => (
                                <Link
                                    key={index}
                                    href={item.href}
                                    onClick={() =>
                                        setMobileMenuOpen(false)
                                    }
                                    className={`
                                        flex
                                        min-h-12
                                        items-center
                                        gap-3
                                        rounded-none
                                        px-3
                                        text-[15px]
                                        font-medium
                                        text-black
                                        transition-colors
                                        hover:bg-black/5
                                        hover:text-primary
                                        ${pathname === item.href
                                            ? "border-b-2 border-b-primary"
                                            : "border-b-2 border-b-transparent"
                                        }
                                    `}
                                >
                                    {item.icon}

                                    <span>{item.label}</span>
                                </Link>
                            ))}

                            {/* ================= MOBILE CATEGORIES ================= */}

                            <div className="mt-2 rounded-xl bg-gray-50 p-3">

                                <button
                                    type="button"
                                    aria-expanded={categoriesOpen}
                                    onClick={() =>
                                        setCategoriesOpen(
                                            (open) => !open
                                        )
                                    }
                                    className="
                                        flex
                                        w-full
                                        items-center
                                        justify-between
                                        rounded-lg
                                        px-2
                                        py-2
                                        text-left
                                        hover:bg-white
                                    "
                                >

                                    <span className="flex items-center gap-2">

                                        <FaUmbrellaBeach className="h-5 w-5" />

                                        <span className="font-medium">
                                            Categories
                                        </span>

                                    </span>

                                    <ChevronDown
                                        className={`
                                            h-5
                                            w-5
                                            transition-transform
                                            ${categoriesOpen
                                                ? "rotate-180"
                                                : ""
                                            }
                                        `}
                                    />

                                </button>

                                {categoriesOpen && (
                                    <div className="mt-2 grid grid-cols-2 gap-1">

                                        {categories.map(
                                            (category, index) => (
                                                <Link
                                                    key={index}
                                                    href={`/category/${category
                                                        .toLowerCase()
                                                        .replace(
                                                            /\s+/g,
                                                            "-"
                                                        )}`}
                                                    onClick={() =>
                                                        setMobileMenuOpen(
                                                            false
                                                        )
                                                    }
                                                    className="
                                                        flex
                                                        items-center
                                                        gap-2.5
                                                        rounded-lg
                                                        px-2
                                                        py-2
                                                        text-sm
                                                        text-gray-700
                                                        hover:bg-white
                                                        hover:text-primary
                                                    "
                                                >

                                                    {/* ICON */}

                                                    <span
                                                        className="
                                                            flex
                                                            h-8
                                                            w-8
                                                            shrink-0
                                                            items-center
                                                            justify-center
                                                            rounded-md
                                                            bg-white
                                                            text-primary
                                                        "
                                                    >
                                                        {getCategoryIcon(
                                                            category
                                                        )}
                                                    </span>

                                                    {/* NAME */}

                                                    <span>
                                                        {category}
                                                    </span>

                                                </Link>
                                            )
                                        )}

                                    </div>
                                )}

                            </div>


                            {/* ================= MOBILE DESTINATIONS ================= */}

                            <div className="mt-2 rounded-xl bg-gray-50 p-3">
                                <button
                                    type="button"
                                    aria-expanded={destinationsOpen}
                                    onClick={() =>
                                        setDestinationsOpen(
                                            (open) => !open
                                        )
                                    }
                                    className="
            flex
            w-full
            items-center
            justify-between
            rounded-lg
            px-2
            py-2
            text-left
            hover:bg-white
        "
                                >
                                    <span className="flex items-center gap-2">
                                        <FiMapPin className="h-5 w-5" />

                                        <span className="font-medium">
                                            Destinations
                                        </span>
                                    </span>

                                    <ChevronDown
                                        className={`
                h-5
                w-5
                transition-transform
                ${destinationsOpen
                                                ? "rotate-180"
                                                : ""
                                            }
            `}
                                    />
                                </button>

                                {destinationsOpen && (
                                    <div className="mt-2 grid grid-cols-2 gap-1">
                                        {destination.map(
                                            (item: {
                                                name: string;
                                                slug: string;
                                            }) => (
                                                <Link
                                                    key={item.slug}
                                                    href={`/destinations/${item.slug}`}
                                                    onClick={() =>
                                                        setMobileMenuOpen(
                                                            false
                                                        )
                                                    }
                                                    className="
                            flex
                            items-center
                            gap-2
                            rounded-lg
                            px-2
                            py-2
                            text-sm
                            text-gray-700
                            hover:bg-white
                            hover:text-primary
                        "
                                                >
                                                    <span>
                                                        {item.name}
                                                    </span>
                                                </Link>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="my-3 h-px w-full bg-black/10" />

                            {/* ================= MOBILE ACTIONS ================= */}

                            <div className="mt-2 flex gap-2">

                                {/* QUERY */}

                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={openQueryForm}
                                    className="
                                        h-11
                                        flex-1
                                        cursor-pointer
                                        rounded-full
                                        border
                                        border-black/20
                                        bg-transparent
                                        text-black
                                        shadow-none
                                        hover:border-primary
                                        hover:bg-primary
                                        hover:text-white
                                    "
                                >
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    Query
                                </Button>

                                {/* CONTACT */}

                                <a
                                    href="tel:+919876543210"
                                    className="
                                        flex
                                        h-11
                                        flex-1
                                        items-center
                                        justify-center
                                        rounded-full
                                        border
                                        border-black/20
                                        text-sm
                                        font-medium
                                        text-black
                                        hover:border-primary
                                        hover:bg-primary
                                        hover:text-white
                                    "
                                >
                                    <Phone className="mr-2 h-4 w-4" />
                                    Contact
                                </a>

                                {/* SEARCH */}

                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="
                                        h-11
                                        flex-1
                                        cursor-pointer
                                        rounded-full
                                        border
                                        border-black/20
                                        bg-transparent
                                        text-black
                                        shadow-none
                                        hover:border-primary
                                        hover:bg-primary
                                        hover:text-white
                                    "
                                >
                                    <Search className="mr-2 h-4 w-4" />
                                    Search
                                </Button>

                            </div>

                        </div>

                    </div>

                </div>
            </nav>
        </>
    );
}