
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  MapPin,
  Package,
  Tags,
  BookOpen,
  FileText,
  Home,
  Mail,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "HTML Sitemap | WANDER-INDIA",
  description:
    "Explore all destinations, travel packages, special offers, and travel blogs on WANDER-INDIA.",
  alternates: {
    canonical: "/sitemap",
  },
};

export const revalidate = 3600;

const SITE_URL = (
  process.env.SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://your-real-domain.com"
).replace(/\/+$/, "");

type SitemapLink = {
  title: string;
  href: string;
};

type SitemapSection = {
  title: string;
  description: string;
  icon: typeof Home;
  links: SitemapLink[];
};

function formatSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default async function SitemapPage() {
  const now = new Date();

  const [destinations, packages, offers, blogs] = await Promise.all([
    prisma.destination.findMany({
      where: {
        isPublished: true,
      },
      select: {
        slug: true,
      },
      orderBy: {
        slug: "asc",
      },
    }),

    prisma.package.findMany({
      where: {
        isPublished: true,
      },
      select: {
        slug: true,
        destination: {
          select: {
            slug: true,
          },
        },
      },
      orderBy: {
        slug: "asc",
      },
    }),

    prisma.offer.findMany({
      where: {
        isActive: true,
      },
      select: {
        slug: true,
        startDate: true,
        endDate: true,
      },
      orderBy: {
        slug: "asc",
      },
    }),

    prisma.blog.findMany({
      where: {
        isPublished: true,
      },
      select: {
        slug: true,
      },
      orderBy: {
        slug: "asc",
      },
    }),
  ]);

  const staticLinks: SitemapLink[] = [
    { title: "Home", href: "/" },
    { title: "About Us", href: "/about" },
    { title: "Contact Us", href: "/contact" },
    { title: "All Destinations", href: "/destinations" },
    { title: "Travel Packages", href: "/package" },
    { title: "Special Offers", href: "/offers" },
    { title: "Travel Blog", href: "/blog" },
    { title: "Privacy Policy", href: "/privacy-policy" },
    { title: "Terms and Conditions", href: "/terms-and-conditions" },
  ];

  const destinationLinks: SitemapLink[] = destinations
    .filter((item) => item.slug)
    .map((item) => ({
      title: formatSlug(item.slug),
      href: `/destinations/${item.slug}`,
    }));

  const packageLinks: SitemapLink[] = packages
    .filter((item) => item.slug && item.destination?.slug)
    .map((item) => ({
      title: formatSlug(item.slug),
      href: `/package/${item.destination.slug}/${item.slug}`,
    }));

  const offerLinks: SitemapLink[] = offers
    .filter((offer) => {
      if (!offer.slug) return false;

      if (offer.startDate && offer.startDate > now) {
        return false;
      }

      if (offer.endDate && offer.endDate < now) {
        return false;
      }

      return true;
    })
    .map((offer) => ({
      title: formatSlug(offer.slug),
      href: `/offers/package/${offer.slug}`,
    }));

  const blogLinks: SitemapLink[] = blogs
    .filter((item) => item.slug)
    .map((item) => ({
      title: formatSlug(item.slug),
      href: `/blog/${item.slug}`,
    }));

  const sections: SitemapSection[] = [
    {
      title: "Main Pages",
      description: "Explore the main pages of WANDER-INDIA.",
      icon: Home,
      links: staticLinks,
    },
    {
      title: "Destinations",
      description: "Discover destinations across India.",
      icon: MapPin,
      links: destinationLinks,
    },
    {
      title: "Travel Packages",
      description: "Find a holiday package for your next trip.",
      icon: Package,
      links: packageLinks,
    },
    {
      title: "Special Offers",
      description: "Browse currently available travel deals.",
      icon: Tags,
      links: offerLinks,
    },
    {
      title: "Travel Blogs",
      description: "Read travel guides, tips, and inspiration.",
      icon: BookOpen,
      links: blogLinks,
    },
    {
      title: "Legal Pages",
      description: "Review our website policies.",
      icon: ShieldCheck,
      links: staticLinks.filter((link) =>
        ["/privacy-policy", "/terms-and-conditions"].includes(link.href),
      ),
    },
  ];

  const totalLinks = sections.reduce(
    (total, section) => total + section.links.length,
    0,
  );

 
return (
  <main className="min-h-screen bg-slate-50">
    <section className="bg-[#00383B] px-5 py-12 text-white sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-[#8BE8DC]">
          <FileText className="h-4 w-4" />
          Website Navigation
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Explore WANDER-INDIA
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
          Find destinations, holiday packages, travel offers, and helpful
          travel guides in one place.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <div className="rounded-lg border border-white/10 bg-white/10 px-4 py-3">
            <p className="text-xl font-bold text-[#8BE8DC]">
              {totalLinks}
            </p>
            <p className="text-xs text-white/65">Available links</p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/10 px-4 py-3">
            <p className="text-xl font-bold text-[#8BE8DC]">
              {sections.length}
            </p>
            <p className="text-xs text-white/65">Categories</p>
          </div>
        </div>
      </div>
    </section>

    <section className="px-5 py-10 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            Browse by category
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Expand a category to view its pages.
          </p>
        </div>

        <div className="space-y-3">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <details
                key={section.title}
                open={section.title === "Main Pages"}
                className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-4 transition hover:bg-slate-50 sm:px-5 [&::-webkit-details-marker]:hidden">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#2FC2B0]/10 text-[#168F83]">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-900">
                      {section.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                      {section.description}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                    {section.links.length}
                  </span>

                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-90" />
                </summary>

                <div className="border-t border-slate-100 px-4 py-3 sm:px-5">
                  {section.links.length > 0 ? (
                    <ul className="grid max-h-64 grid-cols-1 gap-x-6 gap-y-1 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3">
                      {section.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-slate-600 transition hover:bg-[#2FC2B0]/10 hover:text-[#087D72]"
                          >
                            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#2FC2B0]" />
                            <span className="min-w-0 break-words">
                              {link.title}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="py-3 text-sm text-slate-400">
                      No published pages available yet.
                    </p>
                  )}
                </div>
              </details>
            );
          })}
        </div>

      
        <p className="mt-6 text-center text-sm text-slate-500">
          Looking for the XML sitemap?{" "}
          <a
            href={`${SITE_URL}/sitemap.xml`}
            className="font-medium text-[#168F83] underline underline-offset-4 hover:text-[#00383B]"
          >
            View XML Sitemap
          </a>
        </p>
      </div>
    </section>
  </main>
);

}
