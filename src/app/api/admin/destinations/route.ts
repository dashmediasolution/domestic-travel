import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

import { destinationSchema } from "@/lib/validations/destination";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 7 * 1024 * 1024;
const MAX_GALLERY_IMAGES = 15;
const MAX_ATTRACTIONS = 30;

const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

type CloudinaryUpload = {
    url: string;
    publicId: string;
};

type AttractionInput = {
    id: string;
    name: string;
    description: string;
    imageUrl?: string;
};

type WhyVisitInput = {
    id?: string;
    title: string;
    description: string;
};

async function uploadToCloudinary(
    file: File,
    folder: string
): Promise<CloudinaryUpload> {
    if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error(
            `${file.name}: Only JPG, PNG and WEBP images are allowed`
        );
    }

    if (file.size > MAX_FILE_SIZE) {
        throw new Error(
            `${file.name}: Image size cannot exceed 5MB`
        );
    }

    const buffer = Buffer.from(
        await file.arrayBuffer()
    );

    return new Promise((resolve, reject) => {
        const uploadStream =
            cloudinary.uploader.upload_stream(
                {
                    folder,
                    resource_type: "image",
                },
                (error, result) => {
                    if (error || !result) {
                        reject(
                            new Error(
                                error?.message ||
                                "Cloudinary upload failed"
                            )
                        );

                        return;
                    }

                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id,
                    });
                }
            );

        uploadStream.end(buffer);
    });
}

function parseJsonArray(
    value: FormDataEntryValue | null
): string[] {
    if (!value || typeof value !== "string") {
        return [];
    }

    try {
        const parsed = JSON.parse(value);

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed
            .filter(
                (item): item is string =>
                    typeof item === "string"
            )
            .map((item) => item.trim())
            .filter(Boolean);
    } catch {
        return [];
    }
}

function parseWhyVisit(
    value: FormDataEntryValue | null
): WhyVisitInput[] {
    if (!value || typeof value !== "string") {
        return [];
    }

    try {
        const parsed = JSON.parse(value);

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed
            .filter(
                (item): item is WhyVisitInput =>
                    item !== null &&
                    typeof item === "object" &&
                    typeof item.title === "string" &&
                    typeof item.description === "string"
            )
            .map((item) => ({
                ...(typeof item.id === "string"
                    ? { id: item.id }
                    : {}),
                title: item.title.trim(),
                description:
                    item.description.trim(),
            }))
            .filter(
                (item) =>
                    item.title.length > 0 ||
                    item.description.length > 0
            );
    } catch {
        return [];
    }
}

function parseAttractions(
    value: FormDataEntryValue | null
): AttractionInput[] {
    if (!value || typeof value !== "string") {
        return [];
    }

    try {
        const parsed = JSON.parse(value);

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed
            .filter(
                (item): item is AttractionInput =>
                    item !== null &&
                    typeof item === "object" &&
                    typeof item.id === "string" &&
                    typeof item.name === "string" &&
                    typeof item.description === "string"
            )
            .map((item) => ({
                id: item.id,
                name: item.name.trim(),
                description: item.description.trim(),
                imageUrl:
                    typeof item.imageUrl === "string"
                        ? item.imageUrl.trim()
                        : "",
            }));
    } catch {
        return [];
    }
}
function parseBoolean(
    value: FormDataEntryValue | null
): boolean {
    return value === "true";
}

export async function POST(
    request: NextRequest
) {
    const uploadedPublicIds: string[] = [];

    let createdDestinationId: string | null = null;

    try {
        const formData =
            await request.formData();

        const name = String(
            formData.get("name") || ""
        ).trim();

        const slug = String(
            formData.get("slug") || ""
        ).trim();

        const subtitle = String(
            formData.get("subtitle") || ""
        ).trim();

        const description = String(
            formData.get("description") || ""
        ).trim();
const parentId = String(
    formData.get("parentId") || ""
).trim();
        const location = String(
            formData.get("location") || ""
        ).trim();

        const idealTrip = String(
            formData.get("idealTrip") || ""
        ).trim();
        const budget = String(
            formData.get("budget") || ""
        ).trim();
 
        const heroImageUrl = String(
            formData.get("heroImageUrl") || ""
        ).trim();

        const metaTitle = String(
            formData.get("metaTitle") || ""
        ).trim();

        const metaDescription = String(
            formData.get("metaDescription") || ""
        ).trim();

        const activities = parseJsonArray(
            formData.get("activities")
        );

        const bestTimeToVisit = parseJsonArray(
            formData.get("bestTimeToVisit")
        );

        const keywords = parseJsonArray(
            formData.get("keywords")
        );

        const whyVisit = parseWhyVisit(
            formData.get("whyVisit")
        );

        const attractions = parseAttractions(
            formData.get("attractions")
        );

        const isPublished = parseBoolean(
            formData.get("isPublished")
        );

        const isFeatured = parseBoolean(
            formData.get("isFeatured")
        );

        if (
            attractions.length >
            MAX_ATTRACTIONS
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: `You can add a maximum of ${MAX_ATTRACTIONS} attractions`,
                    field: "attractions",
                },
                { status: 400 }
            );
        }

        const validation =
            destinationSchema.safeParse({
                name,
                slug,
                subtitle,
                description,
                location,
                idealTrip,
                budget,
                activities,
                bestTimeToVisit,
                whyVisit,
                attractions: attractions.map(
                    (attraction) => ({
                        name: attraction.name.trim(),
                        description:
                            attraction.description.trim(),
                    })
                ),
                metaTitle,
                metaDescription,
                parentId,
                keywords,
                isPublished,
                isFeatured,
            });

        if (!validation.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Validation failed",
                    errors: z.flattenError(
                        validation.error
                    ),
                },
                { status: 400 }
            );
        }

        const data = validation.data;

        const existingDestination =
            await prisma.destination.findUnique({
                where: {
                    slug: data.slug,
                },
            });

        if (existingDestination) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "A destination with this slug already exists",
                    field: "slug",
                },
                { status: 409 }
            );
        }

        const galleryFiles = formData
            .getAll("gallery")
            .filter(
                (file): file is File =>
                    file instanceof File && file.size > 0
            );

        if (galleryFiles.length > MAX_GALLERY_IMAGES) {
            return NextResponse.json(
                {
                    success: false,
                    message: `You can upload a maximum of ${MAX_GALLERY_IMAGES} gallery images`,
                    field: "gallery",
                },
                { status: 400 }
            );
        }

        const heroFile = formData.get("heroImage");
        let heroUpload: CloudinaryUpload;

        if (heroFile instanceof File && heroFile.size > 0) {
            heroUpload = await uploadToCloudinary(
                heroFile,
                "domesticTravel/destinations"
            );
            uploadedPublicIds.push(heroUpload.publicId);
        } else {
            let parsedHeroUrl: URL;

            try {
                parsedHeroUrl = new URL(heroImageUrl);
            } catch {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Provide a valid hero image URL or upload an image",
                        field: "heroImage",
                    },
                    { status: 400 }
                );
            }

            if (!["http:", "https:"].includes(parsedHeroUrl.protocol)) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Hero image URL must use HTTP or HTTPS",
                        field: "heroImage",
                    },
                    { status: 400 }
                );
            }

            heroUpload = {
                url: parsedHeroUrl.toString(),
                publicId: "",
            };
        }

        const galleryUploads: CloudinaryUpload[] =
            [];

        for (const file of galleryFiles) {
            const upload =
                await uploadToCloudinary(
                    file,
                    "domesticTravel/destinations/gallery"
                );

            uploadedPublicIds.push(
                upload.publicId
            );

            galleryUploads.push(upload);
        }

     const attractionUploads: {
    id: string;
    name: string;
    description: string;
    image: CloudinaryUpload;
}[] = [];

for (const attraction of attractions) {
    const imageField = formData.get(
        `attractionImage_${attraction.id}`
    );

    let attractionImage: CloudinaryUpload;

    // Upload image
    if (
        imageField instanceof File &&
        imageField.size > 0
    ) {
        attractionImage = await uploadToCloudinary(
            imageField,
            "domesticTravel/attractions"
        );

        uploadedPublicIds.push(
            attractionImage.publicId
        );
    } else {
        // Image URL
        const imageUrl = attraction.imageUrl?.trim();

        if (!imageUrl) {
            throw new Error(
                `Provide an image URL or upload an image for attraction "${attraction.name}"`
            );
        }

        let parsedUrl: URL;

        try {
            parsedUrl = new URL(imageUrl);
        } catch {
            throw new Error(
                `Invalid image URL for attraction "${attraction.name}"`
            );
        }

        if (
            !["http:", "https:"].includes(
                parsedUrl.protocol
            )
        ) {
            throw new Error(
                `Image URL must use HTTP or HTTPS for attraction "${attraction.name}"`
            );
        }

        attractionImage = {
            url: parsedUrl.toString(),
            publicId: "",
        };
    }

    attractionUploads.push({
        id: attraction.id,
        name: attraction.name.trim(),
        description: attraction.description.trim(),
        image: attractionImage,
    });
}

        const destination =
            await prisma.$transaction(
                async (tx) => {
                    const created =
                        await tx.destination.create({
                            data: {
                                name: data.name,
                                slug: data.slug,

                                subtitle:
                                    data.subtitle ||
                                    null,

                                description:
                                    data.description ||
                                    null,
 parentId: parentId || null,
                                location:
                                    data.location ||
                                    null,

                                idealTrip:
                                    data.idealTrip ||
                                    null,

                                budget:
                                    data.budget ||
                                    null,

                                activities:
                                    data.activities,

                                bestTimeToVisit:
                                    data.bestTimeToVisit,

                                whyVisit:
                                    data.whyVisit,

                                heroImage: {
                                    url: heroUpload.url,
                                    publicId: heroUpload.publicId,
                                },

                                gallery:
                                    galleryUploads,

                                metaTitle:
                                    data.metaTitle ||
                                    null,

                                metaDescription:
                                    data.metaDescription ||
                                    null,

                                keywords:
                                    data.keywords,

                                isPublished:
                                    data.isPublished,

                                isFeatured:
                                    data.isFeatured,

                                publishedAt:
                                    data.isPublished
                                        ? new Date()
                                        : null,
                            },
                        });

                    if (
                        attractionUploads.length >
                        0
                    ) {
                        await tx.attraction.createMany({
                            data: attractionUploads.map(
                                (
                                    attraction,
                                    index
                                ) => ({
                                    name:
                                        attraction.name,

                                    description:
                                        attraction.description,

                                    imageUrl:
                                        attraction
                                            .image.url,

                                    publicId:
                                        attraction
                                            .image
                                            .publicId || null,

                                    destinationId:
                                        created.id,

                                    isPublished:
                                        true,

                                    sortOrder:
                                        index,
                                })
                            ),
                        });
                    }

                    return created;
                }
            );

        createdDestinationId =
            destination.id;

        const completeDestination =
            await prisma.destination.findUnique({
                where: {
                    id: destination.id,
                },
                include: {
                    attractions: {
                        orderBy: {
                            sortOrder: "asc",
                        },
                    },
                },
            });

        return NextResponse.json(
            {
                success: true,
                message:
                    "Destination created successfully",
                data: completeDestination,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error(
            "CREATE_DESTINATION_ERROR:",
            error
        );

        if (createdDestinationId) {
            try {
                await prisma.destination.delete({
                    where: {
                        id: createdDestinationId,
                    },
                });
            } catch (deleteError) {
                console.error(
                    "DESTINATION_ROLLBACK_ERROR:",
                    deleteError
                );
            }
        }

        if (
            uploadedPublicIds.length > 0
        ) {
            await Promise.allSettled(
                uploadedPublicIds.map(
                    (publicId) =>
                        cloudinary.uploader.destroy(
                            publicId
                        )
                )
            );
        }

        return NextResponse.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to create destination",
            },
            { status: 500 }
        );
    }
}