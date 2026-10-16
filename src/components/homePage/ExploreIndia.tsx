
"use client";

import { Headphones, MapPin, MapPinned, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

const features = [
    {
        title: "Top Destinations",
        description: "Handpicked places to visit",
        icon: MapPin,
    },
    {
        title: "Best Price Guarantee",
        description: "We ensure you the best price",
        icon: Tags,
    },
    {
        title: "Local Experiences",
        description: "Authentic local experiences",
        icon: MapPinned,
    },
    {
        title: "24 / 7 Support",
        description: "We are always here to help",
        icon: Headphones,
    },
];

export default function ExploreIndia() {
    return (
        <section
            className="
                w-full
                bg-white
                px-3
                py-8
                sm:px-5
                sm:py-10
                md:px-6
                lg:px-12
                lg:py-16
            "
        >
            <div
                className="
                    mx-auto
                    grid
                    w-full
                    max-w-[1400px]
                    grid-cols-1
                    items-center
                    gap-7
                    sm:gap-9
                    md:gap-10
                    lg:grid-cols-[0.85fr_1.55fr_0.9fr]
                    lg:gap-8
                "
            >
                {/* LEFT CONTENT */}

                <div className="z-10 w-full">
                    <p
                        className="
                            text-[13px]
                            font-normal
                            tracking-[-0.1px]
                            text-[#20BFAF]
                            sm:text-[15px]
                            lg:text-[17px]
                        "
                    >
                        EXPLORE INDIA
                    </p>

                    <h2
                        className="
                            mt-2.5
                            max-w-[330px]
                            text-[32px]
                            font-medium
                            leading-[1.05]
                            tracking-[-1px]
                            text-black
                            sm:mt-3
                            sm:text-[40px]
                            md:text-[44px]
                            lg:mt-4
                            lg:text-[50px]
                            lg:tracking-[-1.5px]
                        "
                    >
                        Explore World
                        <br />
                        on Map
                    </h2>

                    <p
                        className="
                            mt-3
                            max-w-[390px]
                            text-[14px]
                            font-normal
                            leading-[21px]
                            text-[#A7ADB8]
                            sm:text-[17px]
                            sm:leading-[25px]
                            lg:text-[20px]
                            lg:leading-[30px]
                        "
                    >
                        Hover over a state to discover top
                        destinations, attractions and
                        experiences.
                    </p>

                
                </div>

                {/* MAP */}

                <div
                    className="
                        relative
                        mx-auto
                        h-[230px]
                        w-full
                        max-w-[430px]
                        sm:h-[300px]
                        sm:max-w-[520px]
                        md:h-[350px]
                        md:max-w-[600px]
                        lg:h-[400px]
                        lg:max-w-none
                    "
                >
                    <Image
                        src="/images/worldmap001.svg"
                        alt="World map"
                        fill
                        priority
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 50vw"
                    />
                </div>

                {/* FEATURES CARD */}

                <Card
                    className="
                        w-full
                        rounded-[18px]
                        border-none
                        bg-white
                        p-4
                        shadow-[0_2px_15px_rgba(0,0,0,0.10)]
                        sm:rounded-[22px]
                        sm:p-5
                        md:p-6
                        lg:rounded-[24px]
                        lg:p-7
                    "
                >
                    <div className="flex flex-col gap-4 sm:gap-5">
                        {features.map((feature) => {
                            const Icon = feature.icon;

                            return (
                                <div
                                    key={feature.title}
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                        sm:gap-4
                                    "
                                >
                                    {/* Icon */}

                                    <div
                                        className="
                                            flex
                                            h-8
                                            w-8
                                            shrink-0
                                            items-center
                                            justify-center
                                            text-[#20BFAF]
                                            sm:h-9
                                            sm:w-9
                                        "
                                    >
                                        <Icon
                                            className="
                                                h-6
                                                w-6
                                                sm:h-7
                                                sm:w-7
                                                lg:h-8
                                                lg:w-8
                                            "
                                            strokeWidth={1.8}
                                        />
                                    </div>

                                    {/* Text */}

                                    <div className="min-w-0">
                                        <h3
                                            className="
                                                text-[13px]
                                                font-medium
                                                leading-[17px]
                                                tracking-[-0.2px]
                                                text-black
                                                sm:text-[15px]
                                                sm:leading-[20px]
                                                lg:text-[18px]
                                                lg:leading-[22px]
                                                lg:tracking-[-0.3px]
                                            "
                                        >
                                            {feature.title}
                                        </h3>

                                        <p
                                            className="
                                                mt-0.5
                                                text-[11px]
                                                font-normal
                                                leading-[15px]
                                                text-[#A7ADB8]
                                                sm:mt-1
                                                sm:text-[13px]
                                                sm:leading-[18px]
                                                lg:text-[16px]
                                                lg:leading-[20px]
                                            "
                                        >
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>
        </section>
    );
}

