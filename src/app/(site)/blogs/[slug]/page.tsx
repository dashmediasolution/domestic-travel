import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
 
import { notFound } from "next/navigation";
import { CalendarDays, ChevronRight, Tag } from "lucide-react";
 
 
 

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
interface BlogPageProps {
    params: Promise<{
        slug: string;
    }>;
}

interface TocItem {
    id: string;
    text: string;
    level: number;
}
type RelatedBlog = Prisma.BlogGetPayload<{
    include: {
        category: true;
    };
}>;

function stripHtml(html: string) {
    return html
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/\s+/g, " ")
        .trim();
}



function createSlug(text: string) {
    return text
        .toLowerCase()
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "and")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

function prepareBlogContent(html: string) {
    const toc: TocItem[] = [];
    const usedIds = new Set<string>();

    const content = html.replace(
        /<(h2|h3)([^>]*)>([\s\S]*?)<\/\1>/gi,
        (match, tag, attributes, innerContent) => {
            const text = stripHtml(innerContent);

            if (!text) {
                return match;
            }

            let id = createSlug(text);

            if (!id) {
                id = `section-${toc.length + 1}`;
            }

            let finalId = id;
            let counter = 2;

            while (usedIds.has(finalId)) {
                finalId = `${id}-${counter}`;
                counter++;
            }

            usedIds.add(finalId);

            toc.push({
                id: finalId,
                text,
                level: tag.toLowerCase() === "h3" ? 3 : 2,
            });

            return `<${tag}${attributes} id="${finalId}">${innerContent}</${tag}>`;
        }
    );

    return {
        content,
        toc,
    };
}

 const SITE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/+$/, "");

export async function generateMetadata({
    params,
}: BlogPageProps): Promise<Metadata> {
    const { slug } = await params;

    const blog = await prisma.blog.findUnique({
        where: {
            slug,
        },
        select: {
            id: true,
            slug: true,
            title: true,
            excerpt: true,
            metaTitle: true,
            metaDescription: true,
            featuredImage: true,
            tags: true,
        },
    });

    if (!blog) {
        return {
            title: "Blog Not Found | Domestic Travel",
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    const title =
        blog.metaTitle?.trim() ||
        `${blog.title} | Domestic Travel`;

    const description =
        stripHtml(blog.metaDescription || blog.excerpt || "")
            .slice(0, 160)
            .trim() ||
        `Read ${blog.title} and discover helpful travel tips with Domestic Travel.`;

    const canonicalUrl =
        `${SITE_URL}/blogs/${encodeURIComponent(blog.slug)}`;

    const image = blog.featuredImage?.url;

    return {
        title,
        description,

        ...(blog.tags.length > 0
            ? { keywords: blog.tags }
            : {}),

        alternates: {
            canonical: canonicalUrl,
        },

        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-image-preview": "large",
            },
        },

        openGraph: {
            type: "article",
            siteName: "Domestic Travel",
            title,
            description,
            url: canonicalUrl,
            locale: "en_IN",
            ...(image
                ? {
                      images: [
                          {
                              url: image,
                              alt: blog.title,
                          },
                      ],
                  }
                : {}),
        },

        twitter: {
            card: image ? "summary_large_image" : "summary",
            title,
            description,
            ...(image ? { images: [image] } : {}),
        },
    };
}
 
export default async function BlogPage({
    params,
}: BlogPageProps) {
    const { slug } = await params;

    const blog = await prisma.blog.findUnique({
        where: {
            slug,
        },
        include: {
            category: true,
        },
    });

    if (!blog) {
        notFound();
    }

    const { content: preparedContent, toc } =
        prepareBlogContent(blog.content);


    const formattedDate = blog.publishedAt
        ? new Intl.DateTimeFormat("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        }).format(blog.publishedAt)
        : null;

    const relatedBlogs = blog.categoryId
        ? await prisma.blog.findMany({
            where: {
                categoryId: blog.categoryId,
                id: {
                    not: blog.id,
                },
                publishedAt: {
                    not: null,
                },
            },
            include: {
                category: true,
            },
            orderBy: {
                publishedAt: "desc",
            },
            take: 4,
        })
        : [];

    return (
        <main className="min-h-screen bg-white">
            <article className="w-full">
                {/* Hero */}
                <section className="relative mx-auto w-full max-w-[1440px] overflow-hidden">
                    <div className="relative h-[430px] w-full sm:h-[480px] lg:h-[560px]">
                        {blog.featuredImage?.url ? (
                            <Image
                                src={blog.featuredImage.url}
                                alt={blog.title}
                                fill
                                priority
                                className="object-cover"
                                sizes="100vw"
                            />
                        ) : (
                            <div className="absolute inset-0 bg-[#00383B]" />
                        )}


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
                        <div className="absolute inset-x-0 bottom-0 z-10">
                            <div className="mx-auto w-full max-w-7xl px-5 pb-8 sm:px-8 sm:pb-10 lg:px-10 lg:pb-14">
                                <div className="max-w-5xl">
                                    {blog.category && (
                                        <Link
                                            href={`/blogs/category/${encodeURIComponent(
                                                blog.category.name
                                            )}`}
                                            className="mb-4 inline-flex rounded-full bg-[#2FC2B0] px-3 py-1 text-[11px] font-semibold text-white sm:px-4 sm:py-1.5 sm:text-xs"
                                        >
                                            {blog.category.name}
                                        </Link>
                                    )}

                                    <h1 className="max-w-5xl text-3xl font-bold leading-[1.08] tracking-tight text-white sm:text-xl md:text-3xl lg:text-3xl xl:text-4xl">
                                        {blog.title}
                                    </h1>
                                    <p className="text-white my-8">{blog.excerpt}</p>
                                    <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs font-medium text-white/95 sm:text-sm">
                                        {formattedDate && (
                                            <div className="flex items-center gap-2">
                                                <CalendarDays className="size-4 shrink-0" />
                                                <span>{formattedDate}</span>
                                            </div>
                                        )}



                                        {blog.category && (
                                            <div className="flex items-center gap-2">
                                                <Tag className="size-4 shrink-0" />
                                                <span>
                                                    {blog.category.name}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Content */}
                <section className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-14">
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_350px]">
                        {/* Main Content */}
                        <div className="min-w-0">


                            <div
                                className="
                                    text-[15px]
                                    leading-7
                                    text-gray-600
                                    sm:text-base
                                    sm:leading-8
                                    lg:text-[17px]
                                    lg:leading-8

                                    [&_h1]:mb-5
                                    [&_h1]:mt-10
                                    [&_h1]:text-3xl
                                    [&_h1]:font-bold
                                    [&_h1]:leading-tight
                                    [&_h1]:text-[#00383B]
                                    sm:[&_h1]:text-4xl

                                    [&_h2]:mb-4
                                    [&_h2]:mt-10
                                    [&_h2]:text-2xl
                                    [&_h2]:font-bold
                                    [&_h2]:leading-tight
                                    [&_h2]:text-[#00383B]
                                    sm:[&_h2]:text-3xl

                                    [&_h3]:mb-3
                                    [&_h3]:mt-8
                                    [&_h3]:text-xl
                                    [&_h3]:font-bold
                                    [&_h3]:leading-tight
                                    [&_h3]:text-[#00383B]
                                    sm:[&_h3]:text-2xl

                                    [&_h4]:mb-3
                                    [&_h4]:mt-7
                                    [&_h4]:text-lg
                                    [&_h4]:font-bold
                                    [&_h4]:text-[#00383B]
                                    sm:[&_h4]:text-xl

                                    [&_h5]:mb-2
                                    [&_h5]:mt-6
                                    [&_h5]:text-base
                                    [&_h5]:font-bold
                                    [&_h5]:text-[#00383B]
                                    sm:[&_h5]:text-lg

                                    [&_h6]:mb-2
                                    [&_h6]:mt-5
                                    [&_h6]:text-sm
                                    [&_h6]:font-bold
                                    [&_h6]:text-[#00383B]
                                    sm:[&_h6]:text-base

                                    [&_p]:mb-5

                                    [&_ul]:mb-6
                                    [&_ul]:list-disc
                                    [&_ul]:pl-6

                                    [&_ol]:mb-6
                                    [&_ol]:list-decimal
                                    [&_ol]:pl-6

                                    [&_li]:mb-2

                                    [&_li>p]:mb-1

                                    [&_a]:font-medium
                                    [&_a]:text-[#20BFAF]
                                    [&_a]:underline
                                    [&_a]:underline-offset-4

                                    [&_blockquote]:my-8
                                    [&_blockquote]:border-l-4
                                    [&_blockquote]:border-[#2FC2B0]
                                    [&_blockquote]:pl-5
                                    [&_blockquote]:italic
                                    [&_blockquote]:text-gray-500

                                    [&_img]:my-8
                                    [&_img]:h-auto
                                    [&_img]:w-full
                                    [&_img]:rounded-xl
                                    sm:[&_img]:rounded-2xl

                                    [&_strong]:font-bold
                                    [&_strong]:text-[#00383B]

                                    [&_em]:italic

                                    [&_hr]:my-10
                                    [&_hr]:border-gray-200

                                    [&_code]:rounded
                                    [&_code]:bg-gray-100
                                    [&_code]:px-1.5
                                    [&_code]:py-1
                                    [&_code]:text-sm
                                    [&_code]:text-[#00383B]

                                    [&_pre]:my-8
                                    [&_pre]:overflow-x-auto
                                    [&_pre]:rounded-xl
                                    [&_pre]:bg-[#00383B]
                                    [&_pre]:p-4
                                    [&_pre]:text-sm
                                    [&_pre]:text-white

                                    [&_pre_code]:bg-transparent
                                    [&_pre_code]:p-0
                                    [&_pre_code]:text-white
                                "
                                dangerouslySetInnerHTML={{
                                    __html: preparedContent,
                                }}
                            />

                            {/* Tags */}
                            {blog.tags.length > 0 && (
                                <div className="mt-10 border-t border-gray-200 pt-7 sm:mt-14">
                                    <div className="flex flex-wrap gap-2">
                                        {blog.tags.map((tag: string) => (
                                            <span
                                                key={tag}
                                                className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 sm:px-4 sm:py-2 sm:text-sm"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <aside className="w-full lg:w-auto">
                            <div className="space-y-5 lg:sticky lg:top-24">
                                {/* Table of Contents */}
                                {toc.length > 0 && (
                                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                                        <div className="border-b border-gray-100 px-5 py-4">
                                            <h2 className="text-sm font-semibold text-[#00383B]">
                                                Table of Contents
                                            </h2>
                                        </div>

                                        <nav className="p-3">
                                            {toc.map((item, index) => (
                                                <a
                                                    key={item.id}
                                                    href={`#${item.id}`}
                                                    className={`
                                                        group
                                                        flex
                                                        items-start
                                                        gap-2.5
                                                        rounded-lg
                                                        px-2
                                                        py-2
                                                        text-xs
                                                        leading-5
                                                        transition-colors
                                                        hover:bg-[#2FC2B0]/5
                                                        ${item.level === 3
                                                            ? "pl-7"
                                                            : ""
                                                        }
                                                    `}
                                                >
                                                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#2FC2B0] text-[9px] font-semibold text-white">
                                                        {String(
                                                            index + 1
                                                        ).padStart(2, "0")}
                                                    </span>

                                                    <span className="text-gray-600 transition-colors group-hover:text-[#00383B]">
                                                        {item.text}
                                                    </span>
                                                </a>
                                            ))}
                                        </nav>
                                    </div>
                                )}

                                {/* Related Blogs */}
                                {relatedBlogs.length > 0 && (
                                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                                        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                                            <h2 className="text-sm font-semibold text-[#00383B]">
                                                Related Blogs
                                            </h2>

                                            <Link
                                                href="/blogs"
                                                className="flex items-center gap-1 text-[10px] font-medium text-[#2FC2B0] transition-colors hover:text-[#00383B]"
                                            >
                                                View All
                                                <ChevronRight className="size-3" />
                                            </Link>
                                        </div>

                                        <div className="divide-y divide-gray-100">
                                            {relatedBlogs.map((relatedBlog: RelatedBlog) => {
                                                const relatedDate =
                                                    relatedBlog.publishedAt
                                                        ? new Intl.DateTimeFormat(
                                                            "en-IN",
                                                            {
                                                                day: "numeric",
                                                                month: "short",
                                                                year: "numeric",
                                                            }
                                                        ).format(
                                                            relatedBlog.publishedAt
                                                        )
                                                        : null;

                                                return (
                                                    <Link
                                                        key={relatedBlog.id}
                                                        href={`/blogs/${relatedBlog.slug}`}
                                                        className="group flex gap-3 p-4 transition-colors hover:bg-gray-50"
                                                    >
                                                        <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg">
                                                            {relatedBlog
                                                                .featuredImage
                                                                ?.url ? (
                                                                <Image
                                                                    src={
                                                                        relatedBlog
                                                                            .featuredImage
                                                                            .url
                                                                    }
                                                                    alt={
                                                                        relatedBlog.title
                                                                    }
                                                                    fill
                                                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                                    sizes="80px"
                                                                />
                                                            ) : (
                                                                <div className="h-full w-full bg-[#00383B]" />
                                                            )}
                                                        </div>

                                                        <div className="min-w-0">
                                                            <h3 className="line-clamp-2 text-xs font-semibold leading-5 text-[#00383B] transition-colors group-hover:text-[#2FC2B0]">
                                                                {
                                                                    relatedBlog.title
                                                                }
                                                            </h3>

                                                            {relatedDate && (
                                                                <p className="mt-1 text-[10px] text-gray-400">
                                                                    {
                                                                        relatedDate
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </aside>
                    </div>
                </section>
            </article>
        </main>
    );
}