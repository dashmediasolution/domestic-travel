import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(request: Request) {
    let uploadedPublicId: string | null = null;

    try {
        const formData = await request.formData();

        const title = formData.get("title")?.toString().trim();
        const slug = formData.get("slug")?.toString().trim();
        const excerpt = formData.get("excerpt")?.toString().trim();
        const content = formData.get("content")?.toString();
        const category = formData.get("category")?.toString().trim();
        const tagsValue = formData.get("tags")?.toString();
        const metaDescription = formData.get("metaDescription")?.toString().trim();
        const metaTitle = formData.get("metaTitle")?.toString().trim();
        const keywords = JSON.parse(
            formData.get("keywords")?.toString() || "[]"
        ); const isPublished = formData.get("isPublished") === "true";

        const featuredImage = formData.get("featuredImage");
         if (!title || !slug || !content) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Title, slug and content are required",
                },
                {
                    status: 400,
                }
            );
        }

        let tags: string[] = [];

        if (tagsValue) {
            try {
                tags = JSON.parse(tagsValue);
            } catch {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Invalid tags",
                    },
                    {
                        status: 400,
                    }
                );
            }
        }

        if (!Array.isArray(tags)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Tags must be an array",
                },
                {
                    status: 400,
                }
            );
        }

        const existingBlog =
            await prisma.blog.findUnique({
                where: {
                    slug,
                },
            });

        if (existingBlog) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "A blog with this slug already exists",
                },
                {
                    status: 409,
                }
            );
        }

        let featuredImageData:
            | {
                url: string;
                publicId: string;
            }
            | undefined;

        if (
            featuredImage instanceof File &&
            featuredImage.size > 0
        ) {
            const bytes =
                await featuredImage.arrayBuffer();

            const buffer = Buffer.from(bytes);

            const uploadResult =
                await new Promise<any>(
                    (resolve, reject) => {
                        const uploadStream =
                            cloudinary.uploader.upload_stream(
                                {
                                    folder:
                                        "domesticTravel/blogs/featured",
                                    resource_type:
                                        "image",
                                },
                                (
                                    error,
                                    result
                                ) => {
                                    if (
                                        error ||
                                        !result
                                    ) {
                                        reject(
                                            error ||
                                            new Error(
                                                "Cloudinary upload failed"
                                            )
                                        );

                                        return;
                                    }

                                    resolve(result);
                                }
                            );

                        uploadStream.end(buffer);
                    }
                );

            featuredImageData = {
                url: uploadResult.secure_url,
                publicId: uploadResult.public_id,
            };

            uploadedPublicId =
                uploadResult.public_id;
        }

        let categoryId: string | null = null;

        if (category) {
            const categoryRecord =
                await prisma.blogCategory.upsert({
                    where: {
                        name: category,
                    },
                    update: {},
                    create: {
                        name: category,
                    },
                });

            categoryId = categoryRecord.id;
        }

        const blog = await prisma.blog.create({
            data: {
                title,
                slug,
                excerpt: excerpt || null,
                content,
                featuredImage:
                    featuredImageData,
                categoryId,
                tags,
                isPublished,
                metaDescription,
                metaTitle,
                keywords,
                publishedAt:
                    isPublished
                        ? new Date()
                        : null,
            },
            include: {
                category: true,
            },
        });

        return NextResponse.json(
            {
                success: true,
                message:
                    "Blog created successfully",
                data: blog,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error(
            "CREATE BLOG ERROR:",
            error
        );

        if (uploadedPublicId) {
            try {
                await cloudinary.uploader.destroy(
                    uploadedPublicId
                );
            } catch (cleanupError) {
                console.error(
                    "CLOUDINARY CLEANUP ERROR:",
                    cleanupError
                );
            }
        }

        if (
            error &&
            typeof error === "object" &&
            "code" in error &&
            error.code === "P2002"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "A blog with this slug or category already exists",
                },
                {
                    status: 409,
                }
            );
        }

        return NextResponse.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to create blog",
            },
            {
                status: 500,
            }
        );
    }
}