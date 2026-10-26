"use client";

import {
    ArrowRight,
    BadgeCheck,
    CalendarCheck,
    Headphones,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import ContactInquiryForm from "@/app/(site)/ContactInquiryForm";

export default function Memories() {
    return (
        <section className="w-full">
            <div
                className="
                    relative
                    mx-auto
                    min-h-[430px]
                    w-full
                    max-w-[95%]
                    overflow-hidden
                    rounded-2xl
                    border
                    bg-[#00383B]
                    bg-cover
                    bg-center
                    bg-no-repeat
                    sm:min-h-[390px]
                    sm:rounded-3xl
                    md:min-h-[410px]
                    lg:min-h-[446px]
                "
                style={{
                    backgroundImage:
                        "url('/images/CTABanner.png')",
                }}
            >
                {/* Dark Gradient */}
                <div
                    className="
                        absolute
                        inset-0
                        z-10
                        bg-linear-to-tr
                        from-black/50
                        via-black/20
                        via-30%
                        to-transparent
                    "
                />

                {/* Content */}
                <div
                    className="
                        relative
                        z-10
                        flex
                        min-h-[430px]
                        w-full
                        flex-col
                        justify-center
                        px-5
                        py-8
                        sm:min-h-[390px]
                        sm:px-8
                        sm:py-10
                        md:min-h-[410px]
                        md:px-10
                        lg:min-h-[446px]
                        lg:w-[62%]
                        lg:px-12
                        xl:px-14
                    "
                >
                    {/* Small Heading */}
                    <p
                        className="
                            text-2xl
                            font-medium
                            italic
                            leading-none
                            tracking-wide
                            text-white
                            sm:text-3xl
                            md:text-[2.6rem]
                            lg:text-[2rem]
                        "
                        style={{
                            fontFamily: "cursive",
                        }}
                    >
                        Your Next Adventure
                    </p>

                    {/* Main Heading */}
                    <h2
                        className="
                            mt-1
                            text-4xl
                            font-medium
                            uppercase
                            leading-[0.9]
                            tracking-tight
                            text-white
                            sm:text-5xl
                            md:text-6xl
                            lg:text-7xl
                            xl:text-[5.5rem]
                        "
                    >
                        Awaits You!
                    </h2>

                    {/* Description */}
                    <p
                        className="
                            mt-4
                            max-w-[430px]
                            text-[11px]
                            leading-relaxed
                            text-white/85
                            sm:mt-5
                            sm:text-xs
                            md:text-sm
                            lg:text-[16px]
                        "
                    >
                        Explore breathtaking destinations around the
                        <br className="hidden sm:block" />
                        world with handpicked tour packages and great value.
                    </p>

                    {/* Features */}
                    <div
                        className="
                            mt-5
                            flex
                            max-w-[500px]
                            flex-wrap
                            items-center
                            gap-x-3
                            gap-y-3
                            sm:mt-6
                            sm:gap-x-4
                            md:gap-x-5
                        "
                    >
                        {/* Best Prices */}
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <div className="flex size-7 shrink-0 items-center justify-center rounded-full border border-primary/70 sm:size-8">
                                <Sparkles className="size-3.5 text-primary sm:size-4" />
                            </div>

                            <span className="text-[8px] font-medium leading-tight text-white sm:text-[12px]">
                                Best
                                <br />
                                Prices
                            </span>
                        </div>

                        <div className="hidden h-8 w-px bg-white/30 sm:block" />

                        {/* Safe & Secure */}
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <div className="flex size-7 shrink-0 items-center justify-center rounded-full border border-primary/70 sm:size-8">
                                <ShieldCheck className="size-3.5 text-primary sm:size-4" />
                            </div>

                            <span className="text-[8px] font-medium leading-tight text-white sm:text-[12px]">
                                Safe &
                                <br />
                                Secure
                            </span>
                        </div>

                        <div className="hidden h-8 w-px bg-white/30 sm:block" />

                        {/* Support */}
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <div className="flex size-7 shrink-0 items-center justify-center rounded-full border border-primary/70 sm:size-8">
                                <Headphones className="size-3.5 text-primary sm:size-4" />
                            </div>

                            <span className="text-[8px] font-medium leading-tight text-white sm:text-[12px]">
                                24×7
                                <br />
                                Support
                            </span>
                        </div>

                        <div className="hidden h-8 w-px bg-white/30 sm:block" />

                        {/* Easy Booking */}
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <div className="flex size-7 shrink-0 items-center justify-center rounded-full border border-primary/70 sm:size-8">
                                <CalendarCheck
                                    className="size-3.5 text-primary sm:size-4"
                                 />
                            </div>

                            <span className="text-[8px] font-medium leading-tight text-white sm:text-[12px]">
                                Easy
                                <br />
                                Booking
                            </span>
                        </div>
                    </div>

                    {/* CTA + Dialog */}
                    <div className="mt-6 sm:mt-7">
                        <Dialog     >
                            <DialogTrigger  >
                                <Button
                                    type="button"
                                    className="
                                        h-9
                                        cursor-pointer
                                        rounded-md
                                        bg-primary
                                        px-4
                                        text-[10px]
                                        font-bold
                                        uppercase
                                        text-white
                                        shadow-md
                                        transition-all
                                        hover:bg-primary/90
                                        hover:shadow-lg
                                        sm:h-10
                                        sm:px-5
                                        sm:text-[11px]
                                    "
                                >
                                    Plan Your Trip
                                    <ArrowRight className="ml-1.5 size-3.5 sm:size-4" />
                                </Button>
                            </DialogTrigger>

                            <DialogContent
                                className="
                                    w-[calc(100vw-24px)]
                                    max-w-[770px]
                                    max-h-[calc(100vh-24px)]
                                    overflow-y-auto
                                    overflow-x-hidden
                                    rounded-2xl
                                    border-0
                                    bg-white
                                    p-0
                                    shadow-2xl

                                    sm:w-[92vw]
                                    sm:max-w-[770px]
                                    sm:rounded-3xl

                                    lg:h-[560px]
                                    lg:max-h-[560px]
                                "
                            >
                                <DialogHeader className="sr-only">
                                    <DialogTitle>Plan Your Trip</DialogTitle>

                                    <DialogDescription>
                                        Fill out the inquiry form and our travel experts will
                                        contact you.
                                    </DialogDescription>
                                </DialogHeader>

                                <ContactInquiryForm />
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Memories Badge */}
                <div
                    className="
                        absolute
                        right-3
                        top-4
                        z-20
                        flex
                        size-[82px]
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-white/80
                        bg-white/90
                        shadow-lg
                        backdrop-blur-sm
                        sm:right-6
                        sm:top-6
                        sm:size-[100px]
                        md:right-8
                        md:top-8
                        md:size-[115px]
                        lg:right-8
                        lg:top-8
                        lg:size-[125px]
                        xl:right-12
                        xl:top-10
                    "
                >
                    <div
                        className="
                            flex
                            size-[68px]
                            flex-col
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-[#00383B]/30
                            text-center
                            sm:size-[84px]
                            md:size-[98px]
                            lg:size-[108px]
                        "
                    >
                        <BadgeCheck className="mb-0.5 size-4 text-[#00383B] sm:size-5" />

                        <span className="text-[8px] font-bold uppercase leading-tight text-[#00383B] sm:text-[9px] md:text-[10px]">
                            Memories
                            <br />
                            That Last
                        </span>

                        <span
                            className="
                                mt-0.5
                                text-[10px]
                                italic
                                text-primary
                                sm:text-xs
                                md:text-sm
                            "
                        >
                            A Lifetime
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}