import { z } from "zod";

const attractionSchema = z.object({
    name: z
        .string()
        .trim()
        .min(
            2,
            "Attraction name must be at least 2 characters"
        )
        .max(
            100,
            "Attraction name must be less than 100 characters"
        ),


    description: z
        .string()
        .trim()
        .min(
            5,
            "Attraction description must be at least 5 characters"
        )
        .max(
            1000,
            "Attraction description must be less than 1000 characters"
        ),
});

const whyVisitItemSchema = z.object({
    id: z
        .string()
        .min(1)
        .optional(),

    title: z
        .string()
        .trim()
        .min(
            2,
            "Why visit title is required"
        )
        .max(
            200,
            "Why visit title must be less than 200 characters"
        ),

    description: z
        .string()
        .trim()
        .min(
            2,
            "Why visit description is required"
        )
        .max(
            3000,
            "Why visit description must be less than 3000 characters"
        ),
});

export const destinationSchema = z.object({
    name: z
        .string()
        .trim()
        .min(
            2,
            "Destination name must be at least 2 characters"
        )
        .max(
            100,
            "Destination name must be less than 100 characters"
        ),
parentId: z.string().optional().default(""),

    slug: z
        .string()
        .trim()
        .min(
            2,
            "Slug must be at least 2 characters"
        )
        .max(
            120,
            "Slug must be less than 120 characters"
        )
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Slug can only contain lowercase letters, numbers and hyphens"
        ),

    subtitle: z
        .string()
        .trim()
        .max(
            200,
            "Subtitle must be less than 200 characters"
        )
        .optional()
        .or(z.literal("")),

    description: z
        .string()
        .trim()
        .max(
            5000,
            "Description must be less than 5000 characters"
        )
        .optional()
        .or(z.literal("")),

    location: z
        .string()
        .trim()
        .max(
            200,
            "Location must be less than 200 characters"
        )
        .optional()
        .or(z.literal("")),

    idealTrip: z
        .string()
        .trim()
        .max(
            200,
            "Ideal trip must be less than 200 characters"
        )
        .optional()
        .or(z.literal("")),

    budget: z
        .string()
        .trim()
        .max(
            200,
            "Budget must be less than 200 characters"
        )
        .optional()
        .or(z.literal("")),

    activities: z.array(
        z
            .string()
            .trim()
            .min(
                1,
                "Activity cannot be empty"
            )
    ),

    bestTimeToVisit: z.array(
        z
            .string()
            .trim()
            .min(
                1,
                "Month cannot be empty"
            )
    ),

    whyVisit: z.array(
        whyVisitItemSchema
    ),

    attractions: z.array(
        attractionSchema
    ),

    metaTitle: z
        .string()
        .trim()
        .max(
            60,
            "Meta title must be less than 60 characters"
        )
        .optional()
        .or(z.literal("")),

    metaDescription: z
        .string()
        .trim()
        .max(
            160,
            "Meta description must be less than 160 characters"
        )
        .optional()
        .or(z.literal("")),

    keywords: z.array(
        z
            .string()
            .trim()
            .min(
                1,
                "Keyword cannot be empty"
            )
    ),

    isPublished: z.boolean(),

    isFeatured: z.boolean(),
});

export type DestinationFormInput = z.input<typeof destinationSchema>;
export type DestinationFormValues = z.output<typeof destinationSchema>;