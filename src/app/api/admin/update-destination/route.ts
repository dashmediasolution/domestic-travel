import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import {
    deleteFromCloudinary,
    uploadBufferToCloudinary,
} from "@/lib/cloudinary-upload";

import { destinationSchema } from "@/lib/validations/destination";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 7 * 1024 * 1024;
const MAX_GALLERY_IMAGES = 15;
const MAX_ATTRACTIONS = 30;

const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg",
];

type GalleryImage = {
    url: string;
    publicId: string;
};

type AttractionInput = {
    id?: string;
    clientId?: string;
    name: string;
    description: string;
    imageUrl?: string;
    publicId?: string | null;
    sortOrder?: number;
};

function normalizeImageUrl(
    value: string,
    fieldName: string
) {
    let imageUrl: URL;

    try {
        imageUrl = new URL(value);
    } catch {
        throw new Error(
            `${fieldName} must be a valid HTTP or HTTPS URL`
        );
    }

    if (
        !["http:", "https:"].includes(
            imageUrl.protocol
        )
    ) {
        throw new Error(
            `${fieldName} must be a valid HTTP or HTTPS URL`
        );
    }

    return imageUrl.toString();
}

function parseJson(
    value: FormDataEntryValue | null
): unknown[] {
    if (
        typeof value !== "string" ||
        !value.trim()
    ) {
        return [];
    }

    try {
        const parsed = JSON.parse(value);

        return Array.isArray(parsed)
            ? parsed
            : [];
    } catch {
        return [];
    }
}

function parseBoolean(
    value: FormDataEntryValue | null
): boolean {
    return value === "true";
}

function validateImage(
    file: File,
    fieldName: string
) {
    if (!file || file.size === 0) {
        throw new Error(
            `${fieldName} is required`
        );
    }

    if (
        !ALLOWED_IMAGE_TYPES.includes(
            file.type
        )
    ) {
        throw new Error(
            `${fieldName} must be JPG, PNG or WEBP`
        );
    }

    if (file.size > MAX_FILE_SIZE) {
        throw new Error(
            `${fieldName} must be smaller than 7MB`
        );
    }
}

function isValidObjectId(value: string) {
    return /^[a-f\d]{24}$/i.test(value);
}

export async function PATCH(
    request: NextRequest
) {
    const newlyUploadedPublicIds: string[] = [];
    const oldPublicIdsToDelete: string[] = [];

    try {
        const { searchParams } = new URL(
            request.url
        );

        const destinationId =
            searchParams.get("id");

        if (
            !destinationId ||
            !isValidObjectId(destinationId)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "A valid destination id is required",
                },
                { status: 400 }
            );
        }

        /*
         * ------------------------------------------------
         * GET EXISTING DESTINATION
         * ------------------------------------------------
         */

        const existingDestination =
            await prisma.destination.findUnique({
                where: {
                    id: destinationId,
                },
                include: {
                    attractions: {
                        orderBy: {
                            sortOrder: "asc",
                        },
                    },
                },
            });

        if (!existingDestination) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Destination not found",
                },
                { status: 404 }
            );
        }

        /*
         * ------------------------------------------------
         * FORM DATA
         * ------------------------------------------------
         */

        const formData =
            await request.formData();

        /*
         * ------------------------------------------------
         * BASIC FIELDS
         * ------------------------------------------------
         */

        const name = String(
            formData.get("name") || ""
        );

        const slug = String(
            formData.get("slug") || ""
        );
const parentId = String(
    formData.get("parentId") || ""
).trim();
        const subtitle = String(
            formData.get("subtitle") || ""
        );

        const description = String(
            formData.get("description") || ""
        );

        const location = String(
            formData.get("location") || ""
        );

        const idealTrip = String(
            formData.get("idealTrip") || ""
        );

        const budget = String(
            formData.get("budget") || ""
        );

        const activities = parseJson(
            formData.get("activities")
        );

        const bestTimeToVisit = parseJson(
            formData.get("bestTimeToVisit")
        );

        const whyVisit = parseJson(
            formData.get("whyVisit")
        );

        const attractions =
            parseJson(
                formData.get("attractions")
            ) as AttractionInput[];

        const keywords = parseJson(
            formData.get("keywords")
        );

        const metaTitle = String(
            formData.get("metaTitle") || ""
        );

        const metaDescription = String(
            formData.get("metaDescription") || ""
        );

        const isPublished = parseBoolean(
            formData.get("isPublished")
        );

        const isFeatured = parseBoolean(
            formData.get("isFeatured")
        );

        /*
         * ------------------------------------------------
         * VALIDATE DESTINATION DATA
         * ------------------------------------------------
         */

        const validation =
            destinationSchema.safeParse({
                name,
                slug,
                subtitle,
                description,
                parentId,
                location,
                idealTrip,
                budget,
                activities,
                bestTimeToVisit,
                whyVisit,
                attractions:
                    attractions.map(
                        (attraction) => ({
                            name:
                                attraction.name,
                            description:
                                attraction.description,
                        })
                    ),
                metaTitle,
                metaDescription,
                keywords,
                isPublished,
                isFeatured,
            });

        if (!validation.success) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Validation failed",
                    errors:
                        validation.error.flatten(),
                },
                { status: 400 }
            );
        }

        const data = validation.data;

        /*
         * ------------------------------------------------
         * VALIDATE ATTRACTION COUNT
         * ------------------------------------------------
         */

        if (
            attractions.length >
            MAX_ATTRACTIONS
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Maximum ${MAX_ATTRACTIONS} attractions are allowed`,
                },
                { status: 400 }
            );
        }
/*
 * ------------------------------------------------
 * VALIDATE PARENT DESTINATION
 * ------------------------------------------------
 */

if (parentId) {
    if (!isValidObjectId(parentId)) {
        return NextResponse.json(
            {
                success: false,
                message: "Invalid parent destination ID",
            },
            { status: 400 }
        );
    }

    if (parentId === destinationId) {
        return NextResponse.json(
            {
                success: false,
                message: "A destination cannot be its own parent",
            },
            { status: 400 }
        );
    }

    const parentDestination =
        await prisma.destination.findUnique({
            where: {
                id: parentId,
            },
            select: {
                id: true,
                parentId: true,
            },
        });

    if (!parentDestination) {
        return NextResponse.json(
            {
                success: false,
                message: "Parent destination not found",
            },
            { status: 404 }
        );
    }

    // Prevent assigning a descendant as this destination's parent.
    const visited = new Set<string>();
    let currentParentId: string | null =
        parentDestination.id;

    while (currentParentId) {
        if (currentParentId === destinationId) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid parent: this would create a destination hierarchy cycle",
                },
                { status: 400 }
            );
        }

        if (visited.has(currentParentId)) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "The existing destination hierarchy contains a cycle",
                },
                { status: 400 }
            );
        }

        visited.add(currentParentId);
const currentParent: { parentId: string | null } | null =
    await prisma.destination.findUnique({
        where: {
            id: currentParentId,
        },
        select: {
            parentId: true,
        },
    });

currentParentId = currentParent?.parentId ?? null;

        currentParentId =
            currentParent?.parentId ?? null;
    }
}
        /*
         * ------------------------------------------------
         * CHECK SLUG
         * ------------------------------------------------
         */

        if (
            slug !==
            existingDestination.slug
        ) {
            const slugExists =
                await prisma.destination.findFirst(
                    {
                        where: {
                            slug,
                            id: {
                                not: destinationId,
                            },
                        },
                        select: {
                            id: true,
                        },
                    }
                );

            if (slugExists) {
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
        }

        /*
         * ------------------------------------------------
         * HERO IMAGE
         * ------------------------------------------------
         */

        let heroImage =
            existingDestination.heroImage;

        const heroFile =
            formData.get("heroImage");

        const heroImageUrl = String(
            formData.get("heroImageUrl") || ""
        ).trim();

        let replacementHeroImage: {
            url: string;
            publicId: string;
        } | null = null;

        if (
            heroFile instanceof File &&
            heroFile.size > 0
        ) {
            validateImage(
                heroFile,
                "Hero image"
            );

            const upload =
                await uploadBufferToCloudinary({
                    buffer: Buffer.from(
                        await heroFile.arrayBuffer()
                    ),
                    folder:
                        "domesticTravel/destinations",
                });

            newlyUploadedPublicIds.push(
                upload.publicId
            );

            replacementHeroImage = {
                url: upload.url,
                publicId:
                    upload.publicId,
            };
        } else if (heroImageUrl) {
            replacementHeroImage = {
                url: normalizeImageUrl(
                    heroImageUrl,
                    "Hero image URL"
                ),
                publicId: "",
            };
        }

        if (replacementHeroImage) {
            const oldHeroPublicId =
                existingDestination.heroImage
                    ?.publicId;

            if (
                typeof oldHeroPublicId ===
                    "string" &&
                oldHeroPublicId
            ) {
                oldPublicIdsToDelete.push(
                    oldHeroPublicId
                );
            }

            heroImage =
                replacementHeroImage;
        }

        /*
         * ------------------------------------------------
         * EXISTING GALLERY
         * ------------------------------------------------
         */

        const existingGallery =
            parseJson(
                formData.get(
                    "existingGallery"
                )
            ) as GalleryImage[];

        for (const image of existingGallery) {
            image.url =
                normalizeImageUrl(
                    image.url,
                    "Gallery image URL"
                );
        }

        if (
            existingGallery.length >
            MAX_GALLERY_IMAGES
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Maximum ${MAX_GALLERY_IMAGES} gallery images are allowed`,
                },
                { status: 400 }
            );
        }

        /*
         * ------------------------------------------------
         * NEW GALLERY FILES
         * ------------------------------------------------
         */

        const galleryFiles =
            formData
                .getAll("galleryImages")
                .filter(
                    (
                        file
                    ): file is File =>
                        file instanceof File &&
                        file.size > 0
                );

        if (
            existingGallery.length +
                galleryFiles.length >
            MAX_GALLERY_IMAGES
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Maximum ${MAX_GALLERY_IMAGES} gallery images are allowed`,
                },
                { status: 400 }
            );
        }

        /*
         * ------------------------------------------------
         * FIND REMOVED GALLERY IMAGES
         * ------------------------------------------------
         */

        const currentGallery =
            (existingDestination.gallery ||
                []) as GalleryImage[];

        const keptPublicIds =
            new Set(
                existingGallery.map(
                    (image) =>
                        image.publicId
                )
            );

        for (const oldImage of currentGallery) {
            if (
                oldImage.publicId &&
                !keptPublicIds.has(
                    oldImage.publicId
                )
            ) {
                oldPublicIdsToDelete.push(
                    oldImage.publicId
                );
            }
        }

        /*
         * ------------------------------------------------
         * UPLOAD NEW GALLERY IMAGES
         * ------------------------------------------------
         */

        const finalGallery: GalleryImage[] = [
            ...existingGallery,
        ];

        for (const file of galleryFiles) {
            validateImage(
                file,
                "Gallery image"
            );

            const upload =
                await uploadBufferToCloudinary({
                    buffer: Buffer.from(
                        await file.arrayBuffer()
                    ),
                    folder:
                        "domesticTravel/destinations",
                });

            newlyUploadedPublicIds.push(
                upload.publicId
            );

            finalGallery.push({
                url: upload.url,
                publicId:
                    upload.publicId,
            });
        }

        /*
         * ------------------------------------------------
         * ATTRACTION IMAGE UPLOADS
         * ------------------------------------------------
         */

        const attractionImageUploads =
            new Map<
                string,
                {
                    url: string;
                    publicId: string;
                }
            >();

        for (const attraction of attractions) {
            const imageKey =
                attraction.clientId ||
                attraction.id;

            if (!imageKey) {
                continue;
            }

            const file =
                formData.get(
                    `attractionImage_${imageKey}`
                );

            if (
                file instanceof File &&
                file.size > 0
            ) {
                validateImage(
                    file,
                    `Image for ${attraction.name}`
                );

                const upload =
                    await uploadBufferToCloudinary(
                        {
                            buffer: Buffer.from(
                                await file.arrayBuffer()
                            ),
                            folder:
                                "domesticTravel/destinations/attractions",
                        }
                    );

                newlyUploadedPublicIds.push(
                    upload.publicId
                );

                attractionImageUploads.set(
                    imageKey,
                    {
                        url: upload.url,
                        publicId:
                            upload.publicId,
                    }
                );
            }
        }

        /*
         * ------------------------------------------------
         * FIND REMOVED ATTRACTIONS
         * ------------------------------------------------
         */

        const incomingExistingIds =
            new Set(
                attractions
                    .filter(
                        (attraction) =>
                            attraction.id &&
                            isValidObjectId(
                                attraction.id
                            )
                    )
                    .map(
                        (attraction) =>
                            attraction.id as string
                    )
            );

        const removedAttractions =
            existingDestination.attractions.filter(
                (attraction) =>
                    !incomingExistingIds.has(
                        attraction.id
                    )
            );

        for (const attraction of removedAttractions) {
            if (attraction.publicId) {
                oldPublicIdsToDelete.push(
                    attraction.publicId
                );
            }
        }

        /*
         * ------------------------------------------------
         * DATABASE TRANSACTION
         * ------------------------------------------------
         *
         * IMPORTANT:
         * Cloudinary uploads are NOT inside this
         * transaction.
         *
         * Increased timeout because up to 30
         * attractions may be updated/created.
         */

        const updatedDestination =
            await prisma.$transaction(
                async (tx) => {
                    /*
                     * ----------------------------------------
                     * DELETE REMOVED ATTRACTIONS
                     * ----------------------------------------
                     */

                    if (
                        removedAttractions.length >
                        0
                    ) {
                        await tx.attraction.deleteMany(
                            {
                                where: {
                                    id: {
                                        in: removedAttractions.map(
                                            (
                                                attraction
                                            ) =>
                                                attraction.id
                                        ),
                                    },
                                },
                            }
                        );
                    }

                    /*
                     * ----------------------------------------
                     * UPDATE / CREATE ATTRACTIONS
                     * ----------------------------------------
                     */

                    for (
                        let index = 0;
                        index <
                        attractions.length;
                        index++
                    ) {
                        const attraction =
                            attractions[index];

                        /*
                         * ------------------------------------
                         * EXISTING ATTRACTION
                         * ------------------------------------
                         */

                        if (
                            attraction.id &&
                            isValidObjectId(
                                attraction.id
                            )
                        ) {
                            const existing =
                                existingDestination.attractions.find(
                                    (
                                        item
                                    ) =>
                                        item.id ===
                                        attraction.id
                                );

                            if (!existing) {
                                throw new Error(
                                    "Invalid attraction id"
                                );
                            }

                            const imageKey =
                                attraction.clientId ||
                                attraction.id;

                            const upload =
                                imageKey
                                    ? attractionImageUploads.get(
                                          imageKey
                                      )
                                    : undefined;

                            const imageUrl =
                                upload?.url ??
                                attraction.imageUrl ??
                                existing.imageUrl;

                            const imageChanged =
                                imageUrl !==
                                existing.imageUrl;

                            if (
                                imageChanged &&
                                existing.publicId
                            ) {
                                oldPublicIdsToDelete.push(
                                    existing.publicId
                                );
                            }

                            await tx.attraction.update(
                                {
                                    where: {
                                        id: attraction.id,
                                    },
                                    data: {
                                        name:
                                            attraction.name,
                                         description:
                                            attraction.description,

                                        sortOrder:
                                            index,

                                        imageUrl,

                                        publicId:
                                            upload?.publicId ??
                                            (imageChanged
                                                ? attraction.publicId ??
                                                  null
                                                : existing.publicId),
                                    },
                                }
                            );

                            continue;
                        }

                        /*
                         * ------------------------------------
                         * NEW ATTRACTION
                         * ------------------------------------
                         */

                        const imageKey =
                            attraction.clientId ||
                            attraction.id;

                        const upload =
                            imageKey
                                ? attractionImageUploads.get(
                                      imageKey
                                  )
                                : undefined;

                        const imageUrl =
                            upload?.url ??
                            (attraction.imageUrl
                                ? normalizeImageUrl(
                                      attraction.imageUrl,
                                      `Image for ${attraction.name}`
                                  )
                                : null);

                        if (!imageUrl) {
                            throw new Error(
                                `Image is required for new attraction "${attraction.name}"`
                            );
                        }

                        await tx.attraction.create(
                            {
                                data: {
                                    name:
                                        attraction.name,

                                    description:
                                        attraction.description,

                                    imageUrl,

                                    publicId:
                                        upload?.publicId ??
                                        attraction.publicId ??
                                        null,

                                    destinationId,

                                    sortOrder:
                                        index,
                                },
                            }
                        );
                    }

                    /*
                     * ----------------------------------------
                     * UPDATE DESTINATION
                     * ----------------------------------------
                     */

                    return tx.destination.update(
                        {
                            where: {
                                id: destinationId,
                            },

                            data: {
                                name: data.name,

                                slug: data.slug,
   parentId: parentId || null,
                                subtitle:
                                    data.subtitle ||
                                    null,

                                description:
                                    data.description ||
                                    null,

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

                                heroImage,

                                gallery:
                                    finalGallery,

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
                                        ? existingDestination.publishedAt ||
                                          new Date()
                                        : null,
                            },

                            include: {
                                attractions: {
                                    orderBy: {
                                        sortOrder:
                                            "asc",
                                    },
                                },

                                _count: {
                                    select: {
                                        packages:
                                            true,
                                    },
                                },
                            },
                        }
                    );
                },
                {
                    maxWait: 10000,
                    timeout: 15000,
                }
            );

        /*
         * ------------------------------------------------
         * DELETE OLD CLOUDINARY ASSETS
         * ------------------------------------------------
         */

        const uniqueOldPublicIds =
            Array.from(
                new Set(
                    oldPublicIdsToDelete.filter(
                        Boolean
                    )
                )
            );

        await Promise.allSettled(
            uniqueOldPublicIds.map(
                (publicId) =>
                    deleteFromCloudinary(
                        publicId
                    )
            )
        );

        /*
         * ------------------------------------------------
         * SUCCESS
         * ------------------------------------------------
         */

        return NextResponse.json(
            {
                success: true,
                message:
                    "Destination updated successfully",
                data: updatedDestination,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(
            "PATCH /api/admin/update-destination error:",
            error
        );

        /*
         * --------------------------------------------
         * CLEAN UP NEW CLOUDINARY UPLOADS
         * --------------------------------------------
         */

        await Promise.allSettled(
            newlyUploadedPublicIds.map(
                (publicId) =>
                    deleteFromCloudinary(
                        publicId
                    )
            )
        );

        const message =
            error instanceof Error
                ? error.message
                : "Failed to update destination";

        const isClientError =
            message.includes(
                "required"
            ) ||
            message.includes("URL") ||
            message.includes(
                "Invalid attraction"
            ) ||
            message.includes("Maximum");

        return NextResponse.json(
            {
                success: false,
                message,
            },
            {
                status: isClientError
                    ? 400
                    : 500,
            }
        );
    }
}