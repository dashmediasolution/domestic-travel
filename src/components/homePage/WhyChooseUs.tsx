"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";

export default function WhyChooseUs() {
    const features = [
        "Well-Planned Journeys",
        "Upfront Package Pricing",
        "Private & Group Tours",
        "Curated Local Experiences",
        "Personalized Travel Assistance",
        "End-to-End Trip Support",
    ];

    return (
        <section
            className="
                w-full
                overflow-hidden
                bg-white
                px-3
                pb-8

                sm:px-5
                sm:py-5

                md:px-6

                lg:px-12
                lg:pb-12
            "
        >
            <div
                className="
                    mx-auto
                    grid
                    w-full
                    max-w-[1400px]
                    items-center
                    gap-8

                    sm:gap-10

                    lg:grid-cols-[1.05fr_0.95fr]
                    lg:gap-8

                    xl:gap-12
                "
            >
                {/* LEFT CONTENT */}
                <div className="w-full">
                    {/* Eyebrow */}
                    <h3
                        className="
                            text-[18px]
                            font-medium
                            leading-[1.2]
                            tracking-[-0.4px]
                            text-black

                            sm:text-[21px]

                            md:text-[23px]

                            lg:text-[25px]
                        "
                    >
                        Why Choose Us?
                    </h3>

                    {/* Main Heading */}
                    <h2
                        className="
                            mt-3
                            max-w-[520px]
                            text-[30px]
                            font-medium
                            leading-[1.08]
                            tracking-[-1px]
                            text-black

                            sm:mt-5
                            sm:text-[36px]

                            md:text-[42px]

                            lg:mt-6
                            lg:text-[46px]
                        "
                    >
                        Your Journey, Made Simple. Perfect Trip. 

                        <br className="hidden sm:block" />
                        <span className="sm:hidden"> </span>
                       Just a Tap Away
                    </h2>

                    {/* Description */}
                    <p
                        className="
                            mt-3
                            max-w-[600px]
                            text-[13px]
                            font-normal
                            leading-[20px]
                            text-[#A7ADB8]

                            sm:mt-4
                            sm:text-[15px]
                            sm:leading-[23px]

                            md:text-[17px]
                            md:leading-[24px]

                            lg:text-[18px]
                            lg:leading-[25px]
                        "
                    >
                       Discover, plan, and book memorable journeys with ease. From thoughtfully planned tour packages to exciting destinations, Holiday Turtle helps make every trip smooth, enjoyable, and stress-free.

                    </p>

                    {/* FEATURES */}
                    <div
                        className="
                            mt-5
                            grid
                            grid-cols-1
                            gap-2.5

                            sm:mt-7
                            sm:grid-cols-2
                            sm:gap-4
                        "
                    >
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                 className="
                                    group
                                    flex
                                    min-h-[58px]
                                    w-full
                                    items-center
                                    justify-between
                                    rounded-[13px]
                                    border
                                    border-[#2FC2B0]
                                    bg-white
                                    px-2.5
                                    py-2
                                    transition-all
                                    duration-300
                                    hover:bg-[#F5FFFD]
                                    hover:shadow-[0_6px_20px_rgba(47,194,176,0.12)]

                                    sm:min-h-[66px]
                                    sm:rounded-[15px]
                                    sm:px-3
                                    sm:py-3
                                "
                            >
                                {/* Icon + Text */}
                                <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                                    {/* Icon */}
                                    <div
                                        className="
                                            flex
                                            h-9
                                            w-9
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-[#E8FFFB]
                                            transition-all
                                            duration-300
                                            group-hover:bg-[#2FC2B0]

                                            sm:h-10
                                            sm:w-10

                                            lg:h-11
                                            lg:w-11
                                        "
                                    >
                                        <Tag
                                            className="
                                                h-4.5
                                                w-4.5
                                                text-[#2FC2B0]
                                                transition-colors
                                                duration-300
                                                group-hover:text-white

                                                sm:h-5
                                                sm:w-5

                                                lg:h-6
                                                lg:w-6
                                            "
                                            strokeWidth={1.8}
                                        />
                                    </div>

                                    {/* Text */}
                                    <span
                                        className="
                                            min-w-0
                                            truncate
                                            text-[12px]
                                            font-medium
                                            leading-tight
                                            text-black

                                            sm:text-[13px]

                                            md:text-[14px]

                                            lg:text-[16px]
                                        "
                                    >
                                        {feature}
                                    </span>
                                </div>

                                {/* Arrow */}
                                {/* <ArrowRight
                                    className="
                                        ml-2
                                        h-4
                                        w-4
                                        shrink-0
                                        text-[#2FC2B0]
                                        transition-transform
                                        duration-300
                                        group-hover:translate-x-1

                                        sm:h-5
                                        sm:w-5
                                    "
                                    strokeWidth={1.8}
                                /> */}
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT IMAGE */}
                <div
                    className="
                        relative
                        mx-auto
                        h-[300px]
                        w-full
                        max-w-[360px]

                        sm:h-[400px]
                        sm:max-w-[480px]

                        md:h-[460px]
                        md:max-w-[540px]

                        lg:h-[540px]
                        lg:max-w-[600px]

                        xl:h-[570px]
                    "
                >
                    <Image
                        src="/images/phoneImage.webp"
                        alt="Wander India travel app"
                        fill
                        priority
                      sizes="(max-width: 640px) 90vw, (max-width: 768px) 80vw, (max-width: 1024px) 55vw, 50vw"
                        className="object-contain"
                    />
                </div>
            </div>
        </section>
    );
}