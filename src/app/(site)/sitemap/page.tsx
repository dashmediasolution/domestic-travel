
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
      <section className="relative overflow-hidden bg-[#00383B] px-5 py-16 text-white sm:py-20">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#2FC2B0]/20 blur-3xl" />
        <div className="absolute -bottom-28 -left-16 h-64 w-64 rounded-full bg-[#2FC2B0]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-[#8BE8DC]">
            <FileText className="h-4 w-4" />
            Website Navigation
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            HTML Sitemap
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
            Find important pages on WANDER-INDIA, including destinations,
            travel packages, special offers, and travel guides.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <div className="rounded-xl border border-white/15 bg-white/10 px-5 py-3">
              <p className="text-2xl font-bold text-[#8BE8DC]">
                {totalLinks}
              </p>
              <p className="text-sm text-white/70">Website links</p>
            </div>

            <div className="rounded-xl border border-white/15 bg-white/10 px-5 py-3">
              <p className="text-2xl font-bold text-[#8BE8DC]">
                {sections.length}
              </p>
              <p className="text-sm text-white/70">Categories</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Explore Our Website
            </h2>
            <p className="mt-2 text-slate-600">
              Browse pages by category to quickly find what you need.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {sections.map((section) => {
              const Icon = section.icon;

              return (
                <div
                  key={section.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-[#2FC2B0]/60 hover:shadow-md sm:p-7"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#2FC2B0]/10 text-[#168F83]">
                      <Icon className="h-6 w-6" />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {section.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {section.description}
                      </p>
                    </div>
                  </div>

                  <div className="my-5 h-px bg-slate-100" />

                  {section.links.length > 0 ? (
                    <ul className="space-y-3">
                      {section.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="group flex items-start gap-2 text-sm leading-6 text-slate-600 transition hover:text-[#168F83]"
                          >
                            <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[#2FC2B0] transition-transform group-hover:translate-x-1" />
                            <span>{link.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-400">
                      No published pages available yet.
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-12 rounded-2xl border border-[#2FC2B0]/30 bg-[#2FC2B0]/5 p-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Planning your next trip?
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Discover destinations or contact our team for assistance.
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-3 sm:mt-0">
              <Link
                href="/search-results"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2FC2B0] px-5 py-3 text-sm font-semibold text-[#00383B] transition hover:bg-[#26AD9D]"
              >
                Explore Destinations
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/contact-us"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#2FC2B0] hover:text-[#168F83]"
              >
                <Mail className="h-4 w-4" />
                Contact Us
              </Link>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-slate-500">
            Looking for the XML sitemap for search engines?{" "}
            <a
              href={`${SITE_URL}/sitemap.xml`}
              className="font-semibold text-[#168F83] underline-offset-4 hover:underline"
            >
              View XML Sitemap
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
