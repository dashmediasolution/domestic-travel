
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    Bot,
    ChevronRight,
    LoaderCircle,
    MessageCircle,
    RefreshCw,
    Send,
    Sparkles,
    X,
} from "lucide-react";

type Category = string;


type TravelPackage = {
    name: string;
    slug: string;
    price?: number | string | null;
    originalPrice?: number | string | null;
    heroImage?: string | { url?: string | null } | null;
    subtitle?: string | null;
    location?: string | null;
    duration?: string | number | null;
    href?: string;
    hasOffer?: boolean;
    offer?: {
        slug: string;
    } | null;
    destination?: {
        slug?: string;
        name?: string;
    } | null;
    locationSlug?: string;
};
type ChatMessage = {
    id: string;
    role: "assistant" | "user";
    text: string;
    packages?: TravelPackage[];
    showCategories?: boolean;
    time: string;
};

const INITIAL_TEXT =
    "Hi there! 👋 I'm Tara, your personal travel assistant. Tell me what kind of trip you're in the mood for today — be it adventure, relaxation, culture, or something else!";

const CATEGORY_STYLES: Record<string, { emoji: string; label: string }> = {
    adventure: { emoji: "🏔️", label: "Adventure" },
    beach: { emoji: "🌴", label: "Beach" },
    camping: { emoji: "⛺", label: "Camping" },
    desert: { emoji: "🏜️", label: "Desert" },
    heritage: { emoji: "🏛️", label: "Heritage" },
    lakes: { emoji: "💧", label: "Lakes" },
    relaxation: { emoji: "🍃", label: "Relaxation" },
    culture: { emoji: "🏛️", label: "Culture" },
    nature: { emoji: "🌲", label: "Nature" },
    romantic: { emoji: "♡", label: "Romantic" },
    "family trip": { emoji: "👨‍👩‍👧", label: "Family Trip" },
    honeymoon: { emoji: "💚", label: "Honeymoon" },
    "food & exploring": { emoji: "🍴", label: "Food & Exploring" },
    "something unique": { emoji: "✣", label: "Something Unique" },
};

function createMessage(
    message: Omit<ChatMessage, "id" | "time">,
): ChatMessage {
    return {
        ...message,
        id: `${Date.now()}-${Math.random()}`,
        time: new Date().toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
        }),
    };
}


function getPackageImage(item: TravelPackage): string | null {
    if (typeof item.heroImage === "string") {
        return item.heroImage || null;
    }

    if (
        item.heroImage &&
        typeof item.heroImage === "object" &&
        typeof item.heroImage.url === "string"
    ) {
        return item.heroImage.url || null;
    }

    return null;
}

function getPackages(result: unknown): TravelPackage[] {
    if (!result || typeof result !== "object") return [];

    const data = result as {
        packages?: unknown;
        data?: unknown;
    };

    const candidates = Array.isArray(data.packages)
        ? data.packages
        : Array.isArray(data.data)
            ? data.data
            : [];

    return candidates.filter(
        (item): item is TravelPackage =>
            typeof item === "object" &&
            item !== null &&
            typeof (item as TravelPackage).name === "string" &&
            typeof (item as TravelPackage).slug === "string",
    );
}

function getCategoryStyle(category: string) {
    return (
        CATEGORY_STYLES[category.toLowerCase()] || {
            emoji: "✦",
            label: category,
        }
    );
}

function TypingIndicator({ label }: { label: string }) {
    return (
        <div className="flex items-start gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e8f1e6] text-[#087c78]">
                <Sparkles size={14} />
            </div>

            <div className="flex flex-col items-start gap-1.5">
                <div
                    role="status"
                    aria-label={label}
                    className="flex h-9 items-center gap-1.5 rounded-xl rounded-tl-sm border border-[#eee9da] bg-white px-4 shadow-sm"
                >
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#159b9c] [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#159b9c] [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#159b9c]" />
                </div>

                <span className="pl-1 text-[10px] text-[#8c9487]">
                    {label}
                </span>
            </div>
        </div>
    );
}

export default function TravelChatbot() {
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [showWelcomeTyping, setShowWelcomeTyping] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [loadingPackages, setLoadingPackages] = useState(false);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState("");
    const [input, setInput] = useState("");

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const requestId = useRef(0);

    const busy = loadingPackages || searching;

    const addMessage = useCallback(
        (message: Omit<ChatMessage, "id" | "time">) => {
            setMessages((previous) => [
                ...previous,
                createMessage(message),
            ]);
        },
        [],
    );

    const loadCategories = useCallback(async () => {
        setLoadingCategories(true);
        setError("");

        try {
            const response = await fetch("/api/categories", {
                method: "GET",
                cache: "no-store",
            });

            if (!response.ok) {
                throw new Error("Unable to load travel categories.");
            }

            const result = await response.json();

            const rawCategories = Array.isArray(result?.data)
                ? result.data
                : Array.isArray(result?.categories)
                    ? result.categories
                    : [];

            const categoryList: string[] = rawCategories
                .map((category: unknown) => {
                    if (typeof category === "string") {
                        return category;
                    }

                    if (
                        typeof category === "object" &&
                        category !== null &&
                        "name" in category &&
                        typeof category.name === "string"
                    ) {
                        return category.name;
                    }

                    return "";
                })
                .filter(
                    (category: string) => category.trim().length > 0,
                );

            setCategories(categoryList);

            if (categoryList.length === 0) {
                setError("No travel categories are available right now.");
            }
        } catch (err) {
            console.error("Category loading error:", err);
            setError("Unable to load categories. Please try again.");
        } finally {
            setLoadingCategories(false);
        }
    }, []);

    useEffect(() => {
        if (open && categories.length === 0 && !loadingCategories) {
            void loadCategories();
        }
    }, [open, categories.length, loadingCategories, loadCategories]);

    useEffect(() => {
        if (!open || messages.length > 0) return;

        setShowWelcomeTyping(true);

        const timeout = window.setTimeout(() => {
            setMessages([
                createMessage({
                    role: "assistant",
                    text: INITIAL_TEXT,
                    showCategories: true,
                }),
            ]);

            setShowWelcomeTyping(false);
        }, 1800);

        return () => window.clearTimeout(timeout);
    }, [open, messages.length]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    }, [messages, loadingCategories, loadingPackages, searching]);

    const resetChat = () => {
        requestId.current += 1;

        setMessages([]);
        setShowWelcomeTyping(false);

        setInput("");
        setError("");
        setLoadingPackages(false);
        setSearching(false);

        void loadCategories();
    };

    const chooseCategory = async (category: Category) => {
        if (busy) return;

        const currentRequest = ++requestId.current;

        setLoadingPackages(true);
        setError("");

        addMessage({
            role: "user",
            text: `${getCategoryStyle(category).emoji} ${category}`,
        });

        try {
            const response = await fetch(
                `/api/categories/${encodeURIComponent(category)}`,
                {
                    method: "GET",
                    cache: "no-store",
                },
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result?.message ||
                    "Unable to load packages for this category.",
                );
            }

            if (currentRequest !== requestId.current) return;

            const packages = getPackages(result);

            addMessage({
                role: "assistant",
                text:
                    packages.length > 0
                        ? `Perfect! ✨ Here are ${packages.length === 1 ? "a few details about this getaway" : "some"} ${category.toLowerCase()} ${packages.length === 1 ? "option" : "getaways"} to inspire your next trip.`
                        : `I couldn't find any packages in ${category} right now. Try another mood or search for a destination.`,
                packages,
                showCategories: packages.length === 0,
            });
        } catch (err) {
            if (currentRequest !== requestId.current) return;

            console.error("Package loading error:", err);
            setError("Unable to load packages. Please try again.");

            addMessage({
                role: "assistant",
                text: `Sorry, I couldn't load packages for ${category}. Please try again.`,
                showCategories: true,
            });
        } finally {
            if (currentRequest === requestId.current) {
                setLoadingPackages(false);
            }
        }
    };

    const searchPackages = async () => {
        const query = input.trim();

        if (query.length < 2 || busy) return;

        const currentRequest = ++requestId.current;

        setSearching(true);
        setError("");
        setInput("");

        addMessage({
            role: "user",
            text: query,
        });

        try {
            const response = await fetch(
                `/api/chatbot?name=${encodeURIComponent(query)}`,
                {
                    method: "GET",
                    cache: "no-store",
                },
            );

            const result = await response.json();
            console.log(result, "result")
            if (!response.ok) {
                throw new Error(
                    result?.message || "Unable to search packages.",
                );
            }

            if (currentRequest !== requestId.current) return;

            const packages = getPackages(result);

            addMessage({
                role: "assistant",
                text:
                    packages.length > 0
                        ? `I found ${packages.length} ${packages.length === 1 ? "trip" : "trips"} matching "${query}". Here are some getaways you might love! ✨`
                        : `I couldn't find packages matching "${query}". Try Goa, Uttarakhand, Adventure, or another travel interest.`,
                packages,
                showCategories: packages.length === 0,
            });
        } catch (err) {
            if (currentRequest !== requestId.current) return;

            console.error("Package search error:", err);
            setError("Unable to search packages. Please try again.");

            addMessage({
                role: "assistant",
                text: "Sorry, I couldn't complete that search. Please try again.",
            });
        } finally {
            if (currentRequest === requestId.current) {
                setSearching(false);
            }
        }
    };


    const openPackage = (item: TravelPackage) => {
        setOpen(false);

        if (item.hasOffer && item.offer?.slug) {
            router.push(`/offers/package/${item.offer.slug}`);
            return;
        }

        const destinationSlug =
            item.destination?.slug || item.locationSlug;

        const href =
            item.href ||
            (destinationSlug
                ? `/package/${destinationSlug}/${item.slug}`
                : `/package/${item.slug}`);

        if (!href.startsWith("/") || href.startsWith("//")) {
            return;
        }

        router.push(href);
    };

    const formatPrice = (price?: number | string | null) => {
        if (
            price === null ||
            price === undefined ||
            price === "" ||
            !Number.isFinite(Number(price))
        ) {
            return "Price on request";
        }

        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(Number(price));
    };

    const renderCategories = () => {
        if (loadingCategories) {
            return (
                <div className="flex items-center gap-2 py-3 pl-9 text-xs text-[#818779]">
                    <LoaderCircle
                        size={14}
                        className="animate-spin text-[#159b9c]"
                    />
                    Finding your travel moods...
                </div>
            );
        }

        if (categories.length === 0) return null;

        return (
            <div className="mt-3 flex flex-wrap gap-2 pl-9">
                {categories.map((category) => {
                    const style = getCategoryStyle(category);

                    return (
                        <button
                            key={category}
                            type="button"
                            disabled={busy}
                            onClick={() => void chooseCategory(category)}
                            className="flex items-center gap-1.5 rounded-full border border-[#e8e6d9] bg-white px-3 py-2 text-[10px] font-medium text-[#35584f] shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition hover:border-[#159b9c] hover:bg-[#edf8f1] disabled:cursor-not-allowed disabled:opacity-50 sm:px-3.5 sm:text-[11px]"
                        >
                            <span>{style.emoji}</span>
                            {style.label}
                        </button>
                    );
                })}
            </div>
        );
    };

    return (
        <>
            {!open && (

                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    aria-label="Open WanderAI travel assistant"
                    className="group fixed bottom-5 right-5 z-50 flex h-[62px] w-[62px] items-center justify-center rounded-[22px] bg-gradient-to-br from-[#20b8ad] via-[#159b9c] to-[#087e83] text-white shadow-[0_8px_30px_rgba(21,155,156,0.35)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_12px_35px_rgba(21,155,156,0.45)] active:scale-95 sm:bottom-6 sm:right-6"
                >
                    <span className="absolute inset-[1px] rounded-[21px] border border-white/20" />

                    <Image
                        src="/images/aiChatbot.png"
                        alt="Tara AI travel assistant"
                        width={62}
                        height={62}
                        priority
                        className="relative h-full w-full rounded-[22px] object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border-[2.5px] border-white bg-[#a3f56d]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#247b35]" />
                    </span>

                    <span className="pointer-events-none absolute bottom-[72px] right-0 w-max translate-y-2 rounded-xl border border-[#e5efeb] bg-white px-3.5 py-2 text-xs font-semibold text-[#174b49] opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        Plan your next trip ✨
                        <span className="absolute -bottom-1 right-5 h-2 w-2 rotate-45 border-b border-r border-[#e5efeb] bg-white" />
                    </span>
                </button>
            )}

            {open && (
                <section
                    aria-label="WanderAI travel assistant"

                    className="fixed inset-x-2 bottom-2 z-50 flex h-[min(560px,calc(100dvh-16px))] flex-col overflow-hidden rounded-[20px] border border-[#e9e4d4] bg-[#fffdf6] shadow-[0_20px_70px_rgba(15,42,35,0.22)] sm:inset-x-auto sm:bottom-5 sm:right-5 sm:h-[min(580px,calc(100dvh-40px))] sm:w-[min(420px,calc(100vw-40px))] sm:rounded-[22px]"                >
                    <header className="flex shrink-0 items-center justify-between border-b border-[#f0ecdf] bg-[#fffdf6] px-4 py-3">
                        <div className="flex min-w-0 items-center gap-2.5">
                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-[#d9eee8] bg-white">
                                <Image
                                    src="/images/aiChatbot.png"
                                    alt="Tara"
                                    width={40}
                                    height={40}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="min-w-0">
                                <h2 className="text-[13px] font-bold tracking-tight text-[#123d3b]">
                                    Tara <Sparkles size={12} className="inline text-[#159b9c]" />
                                </h2>

                                <p className="mt-0.5 text-[10px] text-[#648078]">
                                    Your AI Travel Companion
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={resetChat}
                                aria-label="Start a new chat"
                                title="New chat"
                                className="rounded-full p-2 text-[#6b8178] transition hover:bg-[#f1f2e8] hover:text-[#087c78]"
                            >
                                <RefreshCw size={15} />
                            </button>

                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                aria-label="Close chat"
                                className="rounded-full p-2 text-[#527168] transition hover:bg-[#f1f2e8]"
                            >
                                <X size={17} />
                            </button>
                        </div>
                    </header>

                    <div className="flex shrink-0 items-center gap-1.5 border-b border-[#f1ecde] bg-[#fffdf6] px-4 py-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#30b78a]" />
                        <p className="text-[10px] text-[#668178]">
                            Discover your next adventure
                        </p>
                    </div>

                    <div
                        aria-live="polite"
                        className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-3 py-4 sm:px-4 sm:py-5"
                    >
                        {messages.map((message) => (
                            <div key={message.id} className="w-full">
                                {message.role === "assistant" ? (
                                    <div className="flex items-start gap-2">
                                        <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full border border-[#d9eee8] bg-white">
                                            <Image
                                                src="/images/aiChatbot.png"
                                                alt="Tara"
                                                width={28}
                                                height={28}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="min-w-0 max-w-[88%] sm:max-w-[85%]">
                                            <div className="rounded-[15px] rounded-tl-[5px] border border-[#f0ecdf] bg-white px-3 py-2.5 shadow-[0_2px_8px_rgba(29,60,43,0.025)]">
                                                <p className="whitespace-pre-wrap text-[11px] leading-[1.8] text-[#34584f] sm:text-[12px]">
                                                    {message.text}
                                                </p>
                                            </div>

                                            <p className="mt-1 px-1 text-[9px] text-[#a0a397]">
                                                Tara · {message.time}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-end pl-10">
                                        <div className="max-w-[95%] sm:max-w-[88%]">
                                            <div className="rounded-[15px] rounded-br-[5px] border border-[#f5e7a5] bg-[#fff1b8] px-3 py-2.5 shadow-[0_2px_8px_rgba(29,60,43,0.025)]">
                                                <p className="whitespace-pre-wrap text-[11px] leading-[1.8] text-[#46533e] sm:text-[12px]">
                                                    {message.text}
                                                </p>
                                            </div>

                                            <p className="mt-1 pr-1 text-right text-[9px] text-[#a0a397]">
                                                {message.time}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {message.role === "assistant" &&
                                    message.showCategories &&
                                    renderCategories()}

                                {message.packages &&
                                    message.packages.length > 0 && (
                                        <div className="mt-3 pl-9">
                                            <div className="mb-2 flex items-center justify-between gap-2">
                                                <p className="text-[10px] font-semibold text-[#456459]">
                                                    Recommended getaways
                                                </p>
                                                <span className="text-[9px] text-[#919687]">
                                                    {message.packages.length}{" "}
                                                    {message.packages.length ===
                                                        1
                                                        ? "trip"
                                                        : "trips"}
                                                </span>
                                            </div>

                                            <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 [scrollbar-width:thin] [scrollbar-color:#d8dfd0_transparent]">
                                                {message.packages.map(
                                                    (item, index) => {
                                                        const image =
                                                            getPackageImage(
                                                                item,
                                                            );

                                                        const price =
                                                            item.originalPrice ??
                                                            item.price;

                                                        return (
                                                            <button
                                                                key={item.slug}
                                                                type="button"
                                                                onClick={() =>
                                                                    openPackage(
                                                                        item,
                                                                    )
                                                                }
                                                                className="group relative w-[145px] shrink-0 snap-start overflow-hidden rounded-[12px] border border-[#e9e6d8] bg-white text-left transition duration-200 hover:-translate-y-0.5 hover:border-[#159b9c] hover:shadow-md sm:w-[155px]"
                                                            >
                                                                <div className="relative h-[94px] overflow-hidden bg-[#e6f0e5]">
                                                                    {image ? (
                                                                        <img
                                                                            src={
                                                                                image
                                                                            }
                                                                            alt={
                                                                                item.name
                                                                            }
                                                                            loading="lazy"
                                                                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                                                        />
                                                                    ) : (
                                                                        <div className="flex h-full items-center justify-center text-3xl">
                                                                            🌄
                                                                        </div>
                                                                    )}

                                                                    {index ===
                                                                        0 && (
                                                                            <span className="absolute left-1.5 top-1.5 rounded-md bg-[#ffeb8b] px-1.5 py-1 text-[8px] font-bold text-[#4e4c2a] shadow-sm">
                                                                                ✨
                                                                                Top
                                                                                Pick
                                                                            </span>
                                                                        )}
                                                                </div>

                                                                <div className="p-2">
                                                                    <h3 className="line-clamp-1 text-[11px] font-bold text-[#173e3b]">
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </h3>

                                                                    {item.subtitle && (
                                                                        <p className="mt-0.5 line-clamp-1 text-[9px] text-[#879187]">
                                                                            {
                                                                                item.subtitle
                                                                            }
                                                                        </p>
                                                                    )}

                                                                    <div className="mt-2 flex items-center justify-between gap-1">
                                                                        <div className="min-w-0">
                                                                            <p className="truncate text-[11px] font-bold text-[#087e78]">
                                                                                {formatPrice(
                                                                                    price,
                                                                                )}
                                                                            </p>
                                                                            <p className="mt-0.5 text-[8px] text-[#92988b]">
                                                                                Per
                                                                                person
                                                                            </p>
                                                                        </div>

                                                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#075e59] text-white transition group-hover:bg-[#159b9c]">
                                                                            <ChevronRight
                                                                                size={
                                                                                    13
                                                                                }
                                                                            />
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </button>
                                                        );
                                                    },
                                                )}
                                            </div>
                                        </div>
                                    )}
                            </div>
                        ))}

                        {showWelcomeTyping && (
                            <TypingIndicator label="Tara is thinking..." />
                        )}

                        {loadingPackages && (
                            <TypingIndicator label="Finding adventure-packed getaways..." />
                        )}

                        {searching && (
                            <TypingIndicator label="Exploring destinations for you..." />
                        )}

                        {error && (
                            <div className="ml-9 rounded-xl border border-[#f1d9cd] bg-[#fff4ee] p-3 text-[11px] leading-5 text-[#a34835]">
                                <p>{error}</p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setError("");
                                        void loadCategories();
                                    }}
                                    className="mt-1 font-semibold underline underline-offset-2"
                                >
                                    Try again
                                </button>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    <footer className="shrink-0 border-t border-[#eee9dc] bg-[#fffdf6] p-3 sm:p-3.5">
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                void searchPackages();
                            }}
                        >
                            <div className="flex items-center gap-2 rounded-full border border-[#e8e4d6] bg-white py-1.5 pl-4 pr-1.5 transition focus-within:border-[#7bc9b5] focus-within:ring-2 focus-within:ring-[#159b9c]/10">
                                <Sparkles
                                    size={14}
                                    className="shrink-0 text-[#78a79a]"
                                />

                                <input
                                    type="text"
                                    value={input}
                                    onChange={(event) =>
                                        setInput(event.target.value)
                                    }
                                    placeholder="Write your next destination here...."
                                    aria-label="Describe your ideal trip"
                                    maxLength={100}
                                    className="min-w-0 flex-1 bg-transparent py-2 text-[11px] text-[#34584f] outline-none placeholder:text-[#a1a596] sm:text-[12px]"
                                />

                                <button
                                    type="submit"
                                    disabled={
                                        input.trim().length < 2 || busy
                                    }
                                    aria-label="Send message"
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ffdb55] text-[#075c55] transition hover:bg-[#ffce2f] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {searching ? (
                                        <LoaderCircle
                                            size={15}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <Send size={15} />
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="mt-2 flex items-center justify-between px-1">
                            <button
                                type="button"
                                disabled={busy || loadingCategories}
                                onClick={() =>
                                    addMessage({
                                        role: "assistant",
                                        text: "What's your mood today? Pick a category below, and I'll help you discover your next getaway. 🌿",
                                        showCategories: true,
                                    })
                                }
                                className="text-[9px] font-medium text-[#758579] transition hover:text-[#087e78] disabled:opacity-40"
                            >
                                Browse travel moods
                            </button>

                            <span className="text-[9px] text-[#a0a397]">
                                Made for your next getaway ✨
                            </span>
                        </div>
                    </footer>
                </section>
            )}
        </>
    );
}