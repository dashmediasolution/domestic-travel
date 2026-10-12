 import type { Metadata } from "next";
import "./globals.css";

import { Plus_Jakarta_Sans, Inter } from "next/font/google";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default: "Domestic Travel | Explore India & Holiday Packages",
        template: "%s | Domestic Travel",
    },

    description:
        "Discover India's best travel destinations, holiday packages, sightseeing experiences, and seasonal travel offers. Plan your next trip with Domestic Travel.",

    applicationName: "Domestic Travel",

    alternates: {
        canonical: "/",
    },

    openGraph: {
        type: "website",
        url: "/",
        siteName: "Domestic Travel",
        title: "Domestic Travel | Explore India & Holiday Packages",
        description:
            "Explore beautiful destinations across India, discover curated holiday packages, and plan your next travel experience.",
        locale: "en_IN",
        images: [
            {
                url: "/images/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Discover India with Domestic Travel",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: "Domestic Travel | Explore India & Holiday Packages",
        description:
            "Discover destinations, holiday packages, and travel experiences across India.",
        images: ["/images/og-image.jpg"],
    },

    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        },
    },

    category: "travel",
};

const plusJakartaSans = Plus_Jakarta_Sans({
    variable: "--font-plus-jakarta",
    subsets: ["latin"],
    display: "swap",
});

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    display: "swap",
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en-IN"
            className={`${plusJakartaSans.variable} ${inter.variable} h-full antialiased`}
        >
            <body className="min-h-full">{children}</body>
        </html>
    );
}
 