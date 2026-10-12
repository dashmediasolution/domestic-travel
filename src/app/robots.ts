import type { MetadataRoute } from "next";

const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: [
                "/admin/",
                "/api/",
                "/login/",
                "/search-results",

            ],
        },
        sitemap: `${NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
        host: NEXT_PUBLIC_SITE_URL,
    };
}
