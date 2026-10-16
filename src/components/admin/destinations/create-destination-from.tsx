
"use client";

import { useEffect, useRef, useState } from "react";
import {
    useForm,
    type FieldErrors,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    destinationSchema,
    type DestinationFormInput,
    type DestinationFormValues,
} from "@/lib/validations/destination";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import {
    ImagePlus,
    Loader2,
    Plus,
    X,
} from "lucide-react";

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

type ImageSource = "upload" | "url";
type GalleryItem = {
    id: string;
    source: "upload" | "url";
    file: File | null;
    url: string;
    publicId: string | null;
    preview: string | null;
};
type AttractionItem = {
    id: string;
    name: string;
    description: string;
    imageSource: ImageSource;
    image: File | null;
    imageUrl: string;
    publicId: string | null;
    imagePreview: string | null;
};

type WhyVisitItem = {
    id: string;
    title: string;
    description: string;
};

type ParentDestination = {
    id: string;
    name: string;
    slug: string;
};

export default function CreateDestinationForm() {
    const [heroSource, setHeroSource] =
        useState<ImageSource>("upload");

const [parentDestinations, setParentDestinations] =
    useState<ParentDestination[]>([]);

const [parentDestinationsLoading, setParentDestinationsLoading] =
    useState(true);

    const [heroImage, setHeroImage] =
        useState<File | null>(null);

    const [heroUrl, setHeroUrl] =
        useState("");

    const [heroPreview, setHeroPreview] =
        useState<string | null>(null);

    const [gallery, setGallery] =
        useState<GalleryItem[]>([]);

    const heroInputRef =
        useRef<HTMLInputElement | null>(null);

    const galleryInputRef =
        useRef<HTMLInputElement | null>(null);
    const [heroPublicId, setHeroPublicId] =
        useState<string | null>(null);
    const objectUrlsRef =
        useRef<Set<string>>(new Set());

    const [activities, setActivities] =
        useState<string[]>([]);

    const [activityInput, setActivityInput] =
        useState("");

    const [bestTimeToVisit, setBestTimeToVisit] =
        useState<string[]>([]);

    const [keywords, setKeywords] =
        useState<string[]>([]);

    const [keywordInput, setKeywordInput] =
        useState("");

    const [attractions, setAttractions] =
        useState<AttractionItem[]>([]);

    const [whyVisit, setWhyVisit] =
        useState<WhyVisitItem[]>([]);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
} = useForm<DestinationFormInput, any, DestinationFormValues>({
    resolver: zodResolver(destinationSchema),
    defaultValues: {
        name: "",
        parentId: "",
        slug: "",
        subtitle: "",
        description: "",
        location: "",
        idealTrip: "",
        budget: "",
        activities: [],
        bestTimeToVisit: [],
        whyVisit: [],
        attractions: [],
        metaTitle: "",
        metaDescription: "",
        keywords: [],
        isPublished: false,
        isFeatured: false,
    },
});

useEffect(() => {
    const fetchParentDestinations = async () => {
        try {
            const response = await fetch(
                "/api/admin/destinations/parents"
            );

            if (!response.ok) {
                throw new Error("Failed to load parent destinations");
            }

            const result = await response.json();

            setParentDestinations(result.destinations ?? []);
        } catch (error) {
            console.error(
                "Error fetching parent destinations:",
                error
            );
            setError("Unable to load parent destinations.");
        } finally {
            setParentDestinationsLoading(false);
        }
    };

    fetchParentDestinations();
}, []);

    const onInvalid = (
        formErrors: FieldErrors<DestinationFormValues>
    ) => {
        setError("");

        const messages: string[] = [];

        if (formErrors.name?.message) {
            messages.push(
                `Destination Name: ${formErrors.name.message}`
            );
        }

        if (formErrors.slug?.message) {
            messages.push(
                `Slug: ${formErrors.slug.message}`
            );
        }

        if (formErrors.activities?.message) {
            messages.push(
                `Activities: ${formErrors.activities.message}`
            );
        }

        if (formErrors.bestTimeToVisit?.message) {
            messages.push(
                `Best Time to Visit: ${formErrors.bestTimeToVisit.message}`
            );
        }

        if (formErrors.whyVisit?.message) {
            messages.push(
                `Why Visit: ${formErrors.whyVisit.message}`
            );
        }

        if (
            Array.isArray(formErrors.whyVisit)
        ) {
            formErrors.whyVisit.forEach(
                (itemError, index) => {
                    if (!itemError) return;

                    if (itemError.title?.message) {
                        messages.push(
                            `Why Visit ${index + 1} Title: ${itemError.title.message}`
                        );
                    }

                    if (
                        itemError.description
                            ?.message
                    ) {
                        messages.push(
                            `Why Visit ${index + 1} Description: ${itemError.description.message}`
                        );
                    }
                }
            );
        }

        if (formErrors.attractions?.message) {
            messages.push(
                `Attractions: ${formErrors.attractions.message}`
            );
        }

        if (
            Array.isArray(formErrors.attractions)
        ) {
            formErrors.attractions.forEach(
                (itemError, index) => {
                    if (!itemError) return;

                    if (itemError.name?.message) {
                        messages.push(
                            `Attraction ${index + 1} Name: ${itemError.name.message}`
                        );
                    }

                    if (
                        itemError.description
                            ?.message
                    ) {
                        messages.push(
                            `Attraction ${index + 1} Description: ${itemError.description.message}`
                        );
                    }
                }
            );
        }

        if (formErrors.metaTitle?.message) {
            messages.push(
                `Meta Title: ${formErrors.metaTitle.message}`
            );
        }

        if (
            formErrors.metaDescription?.message
        ) {
            messages.push(
                `Meta Description: ${formErrors.metaDescription.message}`
            );
        }

        if (formErrors.keywords?.message) {
            messages.push(
                `Keywords: ${formErrors.keywords.message}`
            );
        }

        setError(
            messages.length
                ? messages.join(" • ")
                : "Please check the highlighted fields."
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const generateSlug = (value: string) => {
        return value
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
    };

    const handleNameChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const name = event.target.value;

        setValue("name", name, {
            shouldValidate: true,
            shouldDirty: true,
        });

        setValue(
            "slug",
            generateSlug(name),
            {
                shouldValidate: true,
                shouldDirty: true,
            }
        );
    };

    const addActivity = () => {
        const value =
            activityInput.trim();

        if (!value) return;

        if (activities.includes(value)) {
            setActivityInput("");
            return;
        }

        const updated = [
            ...activities,
            value,
        ];

        setActivities(updated);

        setValue(
            "activities",
            updated,
            {
                shouldValidate: true,
                shouldDirty: true,
            }
        );

        setActivityInput("");
    };

    const removeActivity = (
        index: number
    ) => {
        const updated =
            activities.filter(
                (_, i) => i !== index
            );

        setActivities(updated);

        setValue(
            "activities",
            updated,
            {
                shouldValidate: true,
                shouldDirty: true,
            }
        );
    };

    const toggleMonth = (
        month: string
    ) => {
        const updated =
            bestTimeToVisit.includes(month)
                ? bestTimeToVisit.filter(
                    (item) =>
                        item !== month
                )
                : [
                    ...bestTimeToVisit,
                    month,
                ];

        setBestTimeToVisit(updated);

        setValue(
            "bestTimeToVisit",
            updated,
            {
                shouldValidate: true,
                shouldDirty: true,
            }
        );
    };

    const addKeyword = () => {
        const value =
            keywordInput.trim();

        if (!value) return;

        if (keywords.includes(value)) {
            setKeywordInput("");
            return;
        }

        const updated = [
            ...keywords,
            value,
        ];

        setKeywords(updated);

        setValue(
            "keywords",
            updated,
            {
                shouldValidate: true,
                shouldDirty: true,
            }
        );

        setKeywordInput("");
    };

    const removeKeyword = (
        index: number
    ) => {
        const updated =
            keywords.filter(
                (_, i) => i !== index
            );

        setKeywords(updated);

        setValue(
            "keywords",
            updated,
            {
                shouldValidate: true,
                shouldDirty: true,
            }
        );
    };

    const validateImage = (
        file: File
    ) => {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (
            !allowedTypes.includes(
                file.type
            )
        ) {
            setError(
                "Only JPG, PNG and WEBP images are allowed"
            );

            return false;
        }

        if (
            file.size >
            7 * 1024 * 1024
        ) {
            setError(
                "Each image must be smaller than 5MB"
            );

            return false;
        }

        return true;
    };

    const createPreview = (
        file: File
    ) => {
        const url =
            URL.createObjectURL(file);

        objectUrlsRef.current.add(
            url
        );

        return url;
    };

    const revokePreview = (
        url: string | null
    ) => {
        if (!url) return;

        URL.revokeObjectURL(url);

        objectUrlsRef.current.delete(
            url
        );
    };

    const handleHeroImage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!validateImage(file)) {
            event.target.value = "";
            return;
        }

        if (heroPreview) {
            revokePreview(heroPreview);
        }

        setHeroImage(file);
        setHeroUrl("");
        setHeroPublicId(null);
        setHeroPreview(createPreview(file));

        setError("");

        event.target.value = "";
    };
    const removeHeroImage = () => {
        revokePreview(heroPreview);

        setHeroImage(null);
        setHeroUrl("");
        setHeroPublicId(null);
        setHeroPreview(null);

        setError("");
    };

    const handleGallery = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = Array.from(
            event.target.files || []
        );

        if (!files.length) return;

        if (
            gallery.length +
            files.length >
            15
        ) {
            setError(
                `You can upload a maximum of 15 gallery images. You currently have ${gallery.length}.`
            );

            event.target.value = "";

            return;
        }

        for (const file of files) {
            if (!validateImage(file)) {
                event.target.value = "";
                return;
            }
        }

        const newImages: GalleryItem[] = files.map((file) => ({
            id: crypto.randomUUID(),
            source: "upload",
            file,
            url: "",
            publicId: null,
            preview: createPreview(file),
        }));

        setGallery(
            (previous) => [
                ...previous,
                ...newImages,
            ]
        );

        setError("");

        event.target.value = "";
    };

    const removeGalleryImage = (
        id: string
    ) => {
        setGallery(
            (previous) => {
                const image =
                    previous.find(
                        (item) =>
                            item.id === id
                    );

                if (image) {
                    revokePreview(
                        image.preview
                    );
                }

                return previous.filter(
                    (item) =>
                        item.id !== id
                );
            }
        );
    };

    const addAttraction = () => {
        const newAttraction: AttractionItem = {
            id: crypto.randomUUID(),
            name: "",
            description: "",
            imageSource: "upload",
            image: null,
            imageUrl: "",
            publicId: null,
            imagePreview: null,
        };

        const updated = [
            ...attractions,
            newAttraction,
        ];

        setAttractions(updated);

        setValue(
            "attractions",
            updated.map((attraction) => ({
                name: attraction.name,
                description: attraction.description,
            })),
            {
                shouldValidate: true,
                shouldDirty: true,
            }
        );
    };

    const removeAttraction = (
        id: string
    ) => {
        setAttractions(
            (previous) => {
                const attraction =
                    previous.find(
                        (item) =>
                            item.id === id
                    );

                if (
                    attraction?.imagePreview
                ) {
                    revokePreview(
                        attraction.imagePreview
                    );
                }

                const updated =
                    previous.filter(
                        (item) =>
                            item.id !== id
                    );

                setValue(
                    "attractions",
                    updated.map(
                        (item) => ({
                            name:
                                item.name,
                            description:
                                item.description,
                        })
                    ),
                    {
                        shouldValidate: true,
                        shouldDirty: true,
                    }
                );

                return updated;
            }
        );
    };

    const updateAttraction = (
        id: string,
        field:
            | "name"
            | "description",
        value: string
    ) => {
        setAttractions(
            (previous) => {
                const updated =
                    previous.map(
                        (item) =>
                            item.id === id
                                ? {
                                    ...item,
                                    [field]:
                                        value,
                                }
                                : item
                    );

                setValue(
                    "attractions",
                    updated.map(
                        (item) => ({
                            name:
                                item.name,
                            description:
                                item.description,
                        })
                    ),
                    {
                        shouldValidate:
                            true,
                        shouldDirty:
                            true,
                    }
                );

                return updated;
            }
        );
    };

    const updateAttractionImage = (
        id: string,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!validateImage(file)) {
            event.target.value = "";
            return;
        }

        const preview = createPreview(file);

        setAttractions((previous) =>
            previous.map((item) => {
                if (item.id !== id) {
                    return item;
                }

                if (item.imagePreview) {
                    revokePreview(item.imagePreview);
                }

                return {
                    ...item,
                    imageSource: "upload",
                    image: file,
                    imageUrl: "",
                    publicId: null,
                    imagePreview: preview,
                };
            })
        );

        setError("");

        event.target.value = "";
    };
    const updateAttractionImageUrl = (
        id: string,
        value: string
    ) => {
        const url = value.trim();

        setAttractions((previous) =>
            previous.map((item) => {
                if (item.id !== id) {
                    return item;
                }

                if (item.imagePreview) {
                    revokePreview(item.imagePreview);
                }

                return {
                    ...item,
                    imageSource: "url",
                    image: null,
                    imageUrl: value,
                    publicId: null,
                    imagePreview: url || null,
                };
            })
        );

        setError("");
    };
    const removeAttractionImage = (
        id: string
    ) => {
        setAttractions(
            (previous) =>
                previous.map(
                    (item) => {
                        if (
                            item.id !==
                            id
                        ) {
                            return item;
                        }

                        if (
                            item.imagePreview
                        ) {
                            revokePreview(
                                item.imagePreview
                            );
                        }

                        return {
                            ...item,
                            image: null,
                            imageUrl: "",
                            publicId: null,
                            imagePreview: null,
                        };
                    }
                )
        );
    };

    const addWhyVisit = () => {
        const newItem: WhyVisitItem =
        {
            id: crypto.randomUUID(),
            title: "",
            description: "",
        };

        const updated = [
            ...whyVisit,
            newItem,
        ];

        setWhyVisit(updated);

        setValue(
            "whyVisit",
            updated,
            {
                shouldValidate: true,
                shouldDirty: true,
            }
        );
    };

    const removeWhyVisit = (
        id: string
    ) => {
        const updated =
            whyVisit.filter(
                (item) =>
                    item.id !== id
            );

        setWhyVisit(updated);

        setValue(
            "whyVisit",
            updated,
            {
                shouldValidate: true,
                shouldDirty: true,
            }
        );
    };

    const updateWhyVisit = (
        id: string,
        field:
            | "title"
            | "description",
        value: string
    ) => {
        const updated =
            whyVisit.map(
                (item) =>
                    item.id === id
                        ? {
                            ...item,
                            [field]:
                                value,
                        }
                        : item
            );

        setWhyVisit(updated);

        setValue(
            "whyVisit",
            updated,
            {
                shouldValidate: true,
                shouldDirty: true,
            }
        );
    };

    const clearImagePreviews = () => {
        objectUrlsRef.current.forEach(
            (url) => {
                URL.revokeObjectURL(
                    url
                );
            }
        );

        objectUrlsRef.current.clear();
    };

    useEffect(() => {
        return () => {
            objectUrlsRef.current.forEach(
                (url) => {
                    URL.revokeObjectURL(
                        url
                    );
                }
            );

            objectUrlsRef.current.clear();
        };
    }, []);

    const onSubmit = async (
        data: DestinationFormValues
    ) => {
        setError("");
        setSuccess("");

        if (heroSource === "upload" && !heroImage) {
            setError("Hero image is required");
            setLoading(false);
            return;
        }

        if (heroSource === "url" && !heroUrl.trim()) {
            setError("Hero image URL is required");
            setLoading(false);
            return;
        }

        for (
            const attraction of attractions
        ) {
            if (
                !attraction.name.trim()
            ) {
                setError(
                    "Every attraction must have a name"
                );

                return;
            }

            if (
                !attraction.description.trim()
            ) {
                setError(
                    `Description is required for ${attraction.name || "attraction"}`
                );

                return;
            }

            if (
                attraction.imageSource === "upload" &&
                !attraction.image
            ) {
                setError(
                    `Upload an image or provide an image URL for ${attraction.name || "attraction"
                    }`
                );

                return;
            }

            if (
                attraction.imageSource === "url" &&
                !attraction.imageUrl.trim()
            ) {
                setError(
                    `Image URL is required for ${attraction.name || "attraction"
                    }`
                );

                return;
            }
        }

        for (
            const item of whyVisit
        ) {
            if (!item.title.trim()) {
                setError(
                    "Every Why Visit item must have a title"
                );

                return;
            }

            if (
                !item.description.trim()
            ) {
                setError(
                    "Every Why Visit item must have a description"
                );

                return;
            }
        }

        setLoading(true);

        try {
            const formData =
                new FormData();

            formData.append(
                "name",
                data.name
            );
formData.append(
    "parentId",
    data.parentId || ""
);
            formData.append(
                "slug",
                data.slug
            );

            formData.append(
                "subtitle",
                data.subtitle || ""
            );

            formData.append(
                "description",
                data.description || ""
            );

            formData.append(
                "location",
                data.location || ""
            );

            formData.append(
                "idealTrip",
                data.idealTrip || ""
            );

            formData.append(
                "budget",
                data.budget || ""
            );
            if (heroSource === "upload" && heroImage) {
                formData.append("heroImage", heroImage);
            } else if (heroSource === "url") {
                formData.append("heroImageUrl", heroUrl.trim());
            }

            formData.append(
                "activities",
                JSON.stringify(
                    data.activities
                )
            );

            formData.append(
                "bestTimeToVisit",
                JSON.stringify(
                    data.bestTimeToVisit
                )
            );

            formData.append(
                "whyVisit",
                JSON.stringify(
                    data.whyVisit
                )
            );

            formData.append(
                "metaTitle",
                data.metaTitle || ""
            );

            formData.append(
                "metaDescription",
                data.metaDescription ||
                ""
            );

            formData.append(
                "keywords",
                JSON.stringify(
                    data.keywords
                )
            );

            formData.append(
                "isPublished",
                String(
                    data.isPublished
                )
            );

            formData.append(
                "isFeatured",
                String(
                    data.isFeatured
                )
            );




            const attractionData = attractions.map(
                (attraction) => ({
                    id: attraction.id,
                    name: attraction.name.trim(),
                    description: attraction.description.trim(),
                    imageUrl:
                        attraction.imageSource === "url"
                            ? attraction.imageUrl.trim()
                            : "",
                })
            );

            formData.append(
                "attractions",
                JSON.stringify(
                    attractionData
                )
            );

            attractions.forEach(
                (attraction) => {
                    if (
                        attraction.image
                    ) {
                        formData.append(
                            `attractionImage_${attraction.id}`,
                            attraction.image
                        );
                    }
                }
            );

            const response =
                await fetch(
                    "/api/admin/destinations",
                    {
                        method: "POST",
                        body: formData,
                    }
                );

            const result =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    "Failed to create destination"
                );
            }

            setSuccess(
                "Destination created successfully"
            );

            reset();

            clearImagePreviews();

            setHeroImage(null);
            setHeroUrl("");
            setHeroSource("upload");
            setHeroPreview(null);
            setGallery([]);
            setActivities([]);
            setActivityInput("");
            setBestTimeToVisit([]);
            setKeywords([]);
            setKeywordInput("");
            setAttractions([]);
            setWhyVisit([]);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong"
            );

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(
                onSubmit,
                onInvalid
            )}
            className="space-y-8 mb-16"
        >
            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {success && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
                    {success}
                </div>
            )}

            {/* BASIC INFORMATION */}

            <section className="rounded-xl border bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold">
                        Basic Information
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Add the basic information for your destination.
                    </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label>
                            Destination Name *
                        </Label>

                        <Input
                            {...register(
                                "name"
                            )}
                            onChange={
                                handleNameChange
                            }
                            placeholder="Uttarakhand"
                        />

                        {errors.name && (
                            <p className="text-xs text-red-500">
                                {
                                    errors
                                        .name
                                        .message
                                }
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>
                            Slug *
                        </Label>

                        <Input
                            {...register(
                                "slug"
                            )}
                            placeholder="uttarakhand"
                        />

                        {errors.slug && (
                            <p className="text-xs text-red-500">
                                {
                                    errors
                                        .slug
                                        .message
                                }
                            </p>
                        )}
                    </div>

<div className="space-y-2 md:col-span-2">
    <Label htmlFor="parentId">
        Parent Destination
    </Label>

    <select
        id="parentId"
        value={watch("parentId") ?? ""}
        onChange={(event) => {
            setValue(
                "parentId",
                event.target.value,
                {
                    shouldDirty: true,
                    shouldValidate: true,
                }
            );
        }}
        disabled={parentDestinationsLoading}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
    >
        <option value="">
            No Parent (Top-Level Destination)
        </option>

        {parentDestinations.map((destination) => (
            <option
                key={destination.id}
                value={destination.id}
            >
                {destination.name}
            </option>
        ))}
    </select>

    <p className="text-xs text-muted-foreground">
        Leave empty for a main destination, or select a
        parent to create a child destination.
    </p>

    {errors.parentId && (
        <p className="text-xs text-red-500">
            {errors.parentId.message}
        </p>
    )}
</div>

                    <div className="space-y-2 md:col-span-2">
                        <Label>
                            Subtitle
                        </Label>

                        <Input
                            {...register(
                                "subtitle"
                            )}
                            placeholder="The Land of Gods"
                        />

                        {errors.subtitle && (
                            <p className="text-xs text-red-500">
                                {
                                    errors
                                        .subtitle
                                        .message
                                }
                            </p>
                        )}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label>
                            Description
                        </Label>

                        <Textarea
                            {...register(
                                "description"
                            )}
                            placeholder="Describe this destination..."
                            rows={5}
                        />

                        {errors.description && (
                            <p className="text-xs text-red-500">
                                {
                                    errors
                                        .description
                                        .message
                                }
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* TRAVEL INFORMATION */}

            <section className="rounded-xl border bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold">
                        Other Information
                    </h2>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                    <div className="space-y-2">
                        <Label>
                            Location
                        </Label>

                        <Input
                            {...register(
                                "location"
                            )}
                            placeholder="North India"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>
                            Ideal Trip
                        </Label>

                        <Input
                            {...register(
                                "idealTrip"
                            )}
                            placeholder="5 - 7 Days"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>
                            Budget
                        </Label>

                        <Input
                            {...register(
                                "budget"
                            )}
                            placeholder="₹7,000 - ₹15,000"
                        />
                    </div>
                </div>

                <div className="mt-6 space-y-3">
                    <Label>
                        Activities
                    </Label>

                    <div className="flex gap-2">
                        <Input
                            value={
                                activityInput
                            }
                            onChange={(
                                event
                            ) =>
                                setActivityInput(
                                    event
                                        .target
                                        .value
                                )
                            }
                            onKeyDown={(
                                event
                            ) => {
                                if (
                                    event.key ===
                                    "Enter"
                                ) {
                                    event.preventDefault();
                                    addActivity();
                                }
                            }}
                            placeholder="Trekking"
                        />

                        <Button
                            type="button"
                            onClick={
                                addActivity
                            }
                        >
                            <Plus />
                            Add
                        </Button>
                    </div>

                    {errors.activities
                        ?.message && (
                            <p className="text-xs text-red-500">
                                {
                                    errors
                                        .activities
                                        .message
                                }
                            </p>
                        )}

                    {activities.length >
                        0 && (
                            <div className="flex flex-wrap gap-2">
                                {activities.map(
                                    (
                                        activity,
                                        index
                                    ) => (
                                        <div
                                            key={`${activity}-${index}`}
                                            className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm text-primary"
                                        >
                                            {
                                                activity
                                            }

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeActivity(
                                                        index
                                                    )
                                                }
                                                className="text-primary/70 hover:text-primary"
                                            >
                                                <X className="size-4" />
                                            </button>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                </div>

                <div className="mt-6 space-y-3">
                    <Label>
                        Best Time To Visit
                    </Label>

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                        {months.map(
                            (month) => {
                                const selected =
                                    bestTimeToVisit.includes(
                                        month
                                    );

                                return (
                                    <button
                                        key={
                                            month
                                        }
                                        type="button"
                                        onClick={() =>
                                            toggleMonth(
                                                month
                                            )
                                        }
                                        className={`rounded-lg border px-3 py-2 text-sm transition ${selected
                                            ? "border-primary bg-primary text-white"
                                            : "bg-white hover:border-primary"
                                            }`}
                                    >
                                        {
                                            month
                                        }
                                    </button>
                                );
                            }
                        )}
                    </div>

                    {errors
                        .bestTimeToVisit
                        ?.message && (
                            <p className="text-xs text-red-500">
                                {
                                    errors
                                        .bestTimeToVisit
                                        .message
                                }
                            </p>
                        )}
                </div>
            </section>

            {/* WHY VISIT */}

            <section className="rounded-xl border bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-lg font-semibold">
                            Why Visit
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Add multiple reasons why travelers should visit this destination.
                        </p>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={
                            addWhyVisit
                        }
                    >
                        <Plus className="size-4" />
                        Add Why Visit
                    </Button>
                </div>

                {whyVisit.length ===
                    0 ? (
                    <div className="rounded-xl border border-dashed px-5 py-8 text-center">
                        <p className="text-sm text-muted-foreground">
                            No Why Visit items added yet.
                        </p>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-4"
                            onClick={
                                addWhyVisit
                            }
                        >
                            <Plus className="size-4" />
                            Add First Reason
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {whyVisit.map(
                            (
                                item,
                                index
                            ) => {
                                const itemErrors =
                                    errors
                                        .whyVisit?.[
                                    index
                                    ];

                                return (
                                    <div
                                        key={
                                            item.id
                                        }
                                        className="rounded-xl border bg-muted/10 p-4"
                                    >
                                        <div className="mb-4 flex items-center justify-between">
                                            <h3 className="text-sm font-semibold">
                                                Why Visit{" "}
                                                {index +
                                                    1}
                                            </h3>

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    removeWhyVisit(
                                                        item.id
                                                    )
                                                }
                                                className="h-8 px-2 text-red-500 hover:bg-red-50 hover:text-red-600"
                                            >
                                                <X className="size-4" />

                                                <span className="hidden sm:inline">
                                                    Remove
                                                </span>
                                            </Button>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>
                                                    Title *
                                                </Label>

                                                <Input
                                                    value={
                                                        item.title
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateWhyVisit(
                                                            item.id,
                                                            "title",
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    placeholder="Beautiful Natural Scenery"
                                                />

                                                {itemErrors?.title
                                                    ?.message && (
                                                        <p className="text-xs text-red-500">
                                                            {
                                                                itemErrors
                                                                    .title
                                                                    .message
                                                            }
                                                        </p>
                                                    )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label>
                                                    Description *
                                                </Label>

                                                <Textarea
                                                    value={
                                                        item.description
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        updateWhyVisit(
                                                            item.id,
                                                            "description",
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    placeholder="Explain why travelers should visit this destination..."
                                                    rows={
                                                        4
                                                    }
                                                />

                                                {itemErrors
                                                    ?.description
                                                    ?.message && (
                                                        <p className="text-xs text-red-500">
                                                            {
                                                                itemErrors
                                                                    .description
                                                                    .message
                                                            }
                                                        </p>
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                )}

                {errors.whyVisit
                    ?.message && (
                        <p className="mt-3 text-xs text-red-500">
                            {
                                errors
                                    .whyVisit
                                    .message
                            }
                        </p>
                    )}
            </section>

            {/* HERO IMAGE */}

            <section className="rounded-xl border bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold">
                        Hero Image
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Upload an image or use an external image URL.
                    </p>
                </div>

                <div className="mb-4 flex gap-2">
                    <Button
                        type="button"
                        variant={
                            heroSource === "upload"
                                ? "default"
                                : "outline"
                        }
                        onClick={() => {
                            setHeroSource("upload");
                            setHeroUrl("");
                            setHeroPreview(null);
                        }}
                    >
                        Upload Image
                    </Button>

                    <Button
                        type="button"
                        variant={
                            heroSource === "url"
                                ? "default"
                                : "outline"
                        }
                        onClick={() => {
                            setHeroSource("url");
                            setHeroImage(null);
                            setHeroPreview(null);
                        }}
                    >
                        Image URL
                    </Button>
                </div>

                {heroSource === "upload" ? (
                    <>
                        <div
                            onClick={() =>
                                heroInputRef.current?.click()
                            }
                            className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition hover:bg-muted/30"
                        >
                            <ImagePlus className="mb-3 size-8 text-muted-foreground" />

                            <span className="text-sm font-medium">
                                {heroImage
                                    ? "Change Hero Image"
                                    : "Upload Hero Image"}
                            </span>

                            <span className="mt-1 text-xs text-muted-foreground">
                                JPG, PNG or WEBP — Maximum 7MB
                            </span>

                            <input
                                ref={heroInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="hidden"
                                onChange={handleHeroImage}
                            />
                        </div>

                        {heroPreview && (
                            <div className="relative mt-5 overflow-hidden rounded-xl border">
                                <img
                                    src={heroPreview}
                                    alt="Hero preview"
                                    className="h-64 w-full object-cover"
                                />

                                <button
                                    type="button"
                                    onClick={removeHeroImage}
                                    className="absolute right-3 top-3 rounded-full bg-black/70 p-2 text-white hover:bg-black"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="space-y-3">
                        <Input
                            value={heroUrl}
                            onChange={(event) => {
                                const url = event.target.value;

                                setHeroUrl(url);
                                setHeroPreview(url);
                            }}
                            placeholder="https://images.unsplash.com/..."
                        />

                        {heroPreview && (
                            <div className="relative overflow-hidden rounded-xl border">
                                <img
                                    src={heroPreview}
                                    alt="Hero preview"
                                    className="h-64 w-full object-cover"
                                    onError={() =>
                                        setError(
                                            "Unable to load the image from this URL"
                                        )
                                    }
                                />

                                <button
                                    type="button"
                                    onClick={() => {
                                        setHeroUrl("");
                                        setHeroPreview(null);
                                    }}
                                    className="absolute right-3 top-3 rounded-full bg-black/70 p-2 text-white hover:bg-red-500"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </section>

            {/* GALLERY */}

            <section className="rounded-xl border bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-lg font-semibold">
                            Gallery
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Add up to 15 gallery images.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => galleryInputRef.current?.click()}
                        >
                            Add Images
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                const url = window.prompt("Enter image URL");

                                if (!url?.trim()) return;

                                if (gallery.length >= 15) {
                                    setError(
                                        "You can upload a maximum of 15 gallery images."
                                    );
                                    return;
                                }

                                setGallery((previous) => [
                                    ...previous,
                                    {
                                        id: crypto.randomUUID(),
                                        source: "url",
                                        file: null,
                                        url: url.trim(),
                                        publicId: null,
                                        preview: url.trim(),
                                    },
                                ]);
                            }}
                        >
                            Add Image URL
                        </Button>
                    </div>
                </div>

                {gallery.length ===
                    0 ? (
                    <div
                        onClick={() =>
                            galleryInputRef.current?.click()
                        }
                        className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition hover:bg-muted/30"
                    >
                        <ImagePlus className="mb-3 size-8 text-muted-foreground" />

                        <p className="text-sm font-medium">
                            Add gallery images
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                            JPG, PNG or WEBP — Maximum 5MB each
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                        {gallery.map((image, index) => (
                            <div
                                key={image.id}
                                className="group relative overflow-hidden rounded-xl border bg-muted"
                            >
                                <img
                                    src={image.preview || image.url}
                                    alt={`Gallery image ${index + 1}`}
                                    className="aspect-square w-full object-cover"
                                />

                                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/60 px-2 py-1.5">
                                    <span className="truncate pr-2 text-[10px] font-medium text-white">
                                        Image {index + 1}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() => removeGalleryImage(image.id)}
                                        className="shrink-0 rounded-full p-1 text-white hover:bg-red-500"
                                    >
                                        <X className="size-3.5" />
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => removeGalleryImage(image.id)}
                                    className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white opacity-100 transition hover:bg-red-500 sm:opacity-0 sm:group-hover:opacity-100"
                                >
                                    <X className="size-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {gallery.length >
                    0 && (
                        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                            <span>
                                {
                                    gallery.length
                                }
                                /15 images selected
                            </span>

                            {gallery.length <
                                15 && (
                                    <span>
                                        {15 -
                                            gallery.length}{" "}
                                        remaining
                                    </span>
                                )}
                        </div>
                    )}
            </section>

            {/* ATTRACTIONS */}

            <section className="rounded-xl border bg-white p-4 shadow-sm sm:p-5">
                <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-lg font-semibold">
                            Attractions
                        </h2>

                        <p className="mt-1 text-xs text-muted-foreground">
                            Add places and attractions available at this destination.
                        </p>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={
                            addAttraction
                        }
                    >
                        <Plus className="size-4" />
                        Add Attraction
                    </Button>
                </div>

                {attractions.length ===
                    0 ? (
                    <div className="rounded-lg border border-dashed px-4 py-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            No attractions added yet.
                        </p>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-3"
                            onClick={
                                addAttraction
                            }
                        >
                            <Plus className="size-4" />
                            Add First Attraction
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {attractions.map(
                            (
                                attraction,
                                index
                            ) => {
                                const itemErrors =
                                    errors
                                        .attractions?.[
                                    index
                                    ];

                                return (
                                    <div
                                        key={
                                            attraction.id
                                        }
                                        className="rounded-lg border bg-muted/10 p-3 sm:p-4"
                                    >
                                        <div className="mb-3 flex items-center justify-between">
                                            <h3 className="text-sm font-semibold">
                                                Attraction{" "}
                                                {index +
                                                    1}
                                            </h3>

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    removeAttraction(
                                                        attraction.id
                                                    )
                                                }
                                                className="h-8 px-2 text-red-500 hover:bg-red-50 hover:text-red-600"
                                            >
                                                <X className="size-4" />

                                                <span className="hidden sm:inline">
                                                    Remove
                                                </span>
                                            </Button>
                                        </div>

                                        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
                                            <div className="space-y-3">
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs">
                                                        Name *
                                                    </Label>

                                                    <Input
                                                        value={
                                                            attraction.name
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            updateAttraction(
                                                                attraction.id,
                                                                "name",
                                                                event
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        placeholder="Kainchi Dham"
                                                        className="h-9"
                                                    />

                                                    {itemErrors
                                                        ?.name
                                                        ?.message && (
                                                            <p className="text-xs text-red-500">
                                                                {
                                                                    itemErrors
                                                                        .name
                                                                        .message
                                                                }
                                                            </p>
                                                        )}
                                                </div>

                                                <div className="space-y-1.5">
                                                    <Label className="text-xs">
                                                        Description *
                                                    </Label>

                                                    <Textarea
                                                        value={
                                                            attraction.description
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            updateAttraction(
                                                                attraction.id,
                                                                "description",
                                                                event
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        placeholder="Describe this attraction..."
                                                        rows={
                                                            3
                                                        }
                                                        className="min-h-[90px] resize-none"
                                                    />

                                                    {itemErrors
                                                        ?.description
                                                        ?.message && (
                                                            <p className="text-xs text-red-500">
                                                                {
                                                                    itemErrors
                                                                        .description
                                                                        .message
                                                                }
                                                            </p>
                                                        )}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-xs">
                                                    Image *
                                                </Label>

                                                <div className="flex gap-2">
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant={
                                                            attraction.imageSource === "upload"
                                                                ? "default"
                                                                : "outline"
                                                        }
                                                        onClick={() => {
                                                            setAttractions((previous) =>
                                                                previous.map((item) =>
                                                                    item.id === attraction.id
                                                                        ? {
                                                                            ...item,
                                                                            imageSource: "upload",
                                                                            imageUrl: "",
                                                                            imagePreview:
                                                                                item.image
                                                                                    ? item.imagePreview
                                                                                    : null,
                                                                        }
                                                                        : item
                                                                )
                                                            );
                                                        }}
                                                    >
                                                        Upload
                                                    </Button>

                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant={
                                                            attraction.imageSource === "url"
                                                                ? "default"
                                                                : "outline"
                                                        }
                                                        onClick={() => {
                                                            setAttractions((previous) =>
                                                                previous.map((item) =>
                                                                    item.id === attraction.id
                                                                        ? {
                                                                            ...item,
                                                                            imageSource: "url",
                                                                            image: null,
                                                                            imagePreview:
                                                                                item.imageUrl.trim() ||
                                                                                null,
                                                                        }
                                                                        : item
                                                                )
                                                            );
                                                        }}
                                                    >
                                                        Image URL
                                                    </Button>
                                                </div>

                                                {attraction.imageSource === "upload" ? (
                                                    !attraction.image ? (
                                                        <label className="flex h-[123px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed bg-white text-center transition hover:bg-muted/30">
                                                            <ImagePlus className="mb-1.5 size-6 text-muted-foreground" />

                                                            <span className="text-xs font-medium">
                                                                Upload Image
                                                            </span>

                                                            <span className="mt-0.5 text-[10px] text-muted-foreground">
                                                                JPG, PNG, WEBP • Max 7MB
                                                            </span>

                                                            <input
                                                                type="file"
                                                                accept="image/jpeg,image/png,image/webp"
                                                                className="hidden"
                                                                onChange={(event) =>
                                                                    updateAttractionImage(
                                                                        attraction.id,
                                                                        event
                                                                    )
                                                                }
                                                            />
                                                        </label>
                                                    ) : (
                                                        <div className="relative h-[123px] overflow-hidden rounded-lg border bg-muted">
                                                            {attraction.imagePreview && (
                                                                <img
                                                                    src={attraction.imagePreview}
                                                                    alt={
                                                                        attraction.name ||
                                                                        "Attraction preview"
                                                                    }
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            )}

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeAttractionImage(
                                                                        attraction.id
                                                                    )
                                                                }
                                                                className="absolute right-1.5 top-1.5 rounded-full bg-black/70 p-1.5 text-white transition hover:bg-red-500"
                                                            >
                                                                <X className="size-3.5" />
                                                            </button>
                                                        </div>
                                                    )
                                                ) : (
                                                    <div className="space-y-2">
                                                        <Input
                                                            value={attraction.imageUrl}
                                                            onChange={(event) =>
                                                                updateAttractionImageUrl(
                                                                    attraction.id,
                                                                    event.target.value
                                                                )
                                                            }
                                                            placeholder="https://images.unsplash.com/..."
                                                            className="h-9"
                                                        />

                                                        {attraction.imagePreview && (
                                                            <div className="relative h-[123px] overflow-hidden rounded-lg border bg-muted">
                                                                <img
                                                                    src={attraction.imagePreview}
                                                                    alt={
                                                                        attraction.name ||
                                                                        "Attraction preview"
                                                                    }
                                                                    className="h-full w-full object-cover"
                                                                    onError={() =>
                                                                        setError(
                                                                            `Unable to load the image URL for ${attraction.name ||
                                                                            "this attraction"
                                                                            }`
                                                                        )
                                                                    }
                                                                />

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        removeAttractionImage(
                                                                            attraction.id
                                                                        )
                                                                    }
                                                                    className="absolute right-1.5 top-1.5 rounded-full bg-black/70 p-1.5 text-white transition hover:bg-red-500"
                                                                >
                                                                    <X className="size-3.5" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                )}

                {errors.attractions
                    ?.message && (
                        <p className="mt-3 text-xs text-red-500">
                            {
                                errors
                                    .attractions
                                    .message
                            }
                        </p>
                    )}
            </section>

            {/* SEO */}

            <section className="rounded-xl border bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold">
                        SEO
                    </h2>
                </div>

                <div className="space-y-5">
                    <div className="space-y-2">
                        <Label>
                            Meta Title
                        </Label>

                        <Input
                            {...register(
                                "metaTitle"
                            )}
                            placeholder="Best Uttarakhand Tour Packages"
                        />

                        {errors.metaTitle && (
                            <p className="text-xs text-red-500">
                                {
                                    errors
                                        .metaTitle
                                        .message
                                }
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>
                            Meta Description
                        </Label>

                        <Textarea
                            {...register(
                                "metaDescription"
                            )}
                            placeholder="Explore the best destinations..."
                            rows={4}
                        />

                        {errors.metaDescription && (
                            <p className="text-xs text-red-500">
                                {
                                    errors
                                        .metaDescription
                                        .message
                                }
                            </p>
                        )}
                    </div>

                    <div className="space-y-3">
                        <Label>
                            Keywords
                        </Label>

                        <div className="flex gap-2">
                            <Input
                                value={
                                    keywordInput
                                }
                                onChange={(
                                    event
                                ) =>
                                    setKeywordInput(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                onKeyDown={(
                                    event
                                ) => {
                                    if (
                                        event.key ===
                                        "Enter"
                                    ) {
                                        event.preventDefault();
                                        addKeyword();
                                    }
                                }}
                                placeholder="uttarakhand tourism"
                            />

                            <Button
                                type="button"
                                onClick={
                                    addKeyword
                                }
                            >
                                <Plus />
                                Add
                            </Button>
                        </div>

                        {keywords.length >
                            0 && (
                                <div className="flex flex-wrap gap-2">
                                    {keywords.map(
                                        (
                                            keyword,
                                            index
                                        ) => (
                                            <div
                                                key={`${keyword}-${index}`}
                                                className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm text-primary"
                                            >
                                                {
                                                    keyword
                                                }

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeKeyword(
                                                            index
                                                        )
                                                    }
                                                >
                                                    <X className="size-4" />
                                                </button>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                    </div>
                </div>
            </section>

            {/* PUBLISHING */}

            <section className="rounded-xl border bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold">
                        Publishing
                    </h2>
                </div>

                <div className="space-y-5">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <p className="font-medium">
                                Publish Destination
                            </p>

                            <p className="text-sm text-muted-foreground">
                                Make this destination visible
                                on the website.
                            </p>
                        </div>

                        <Switch
                            checked={watch(
                                "isPublished"
                            )}
                            onCheckedChange={(
                                checked
                            ) =>
                                setValue(
                                    "isPublished",
                                    checked,
                                    {
                                        shouldValidate:
                                            true,
                                        shouldDirty:
                                            true,
                                    }
                                )
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <p className="font-medium">
                                Featured Destination
                            </p>

                            <p className="text-sm text-muted-foreground">
                                Show this destination in
                                featured sections.
                            </p>
                        </div>

                        <Switch
                            checked={watch(
                                "isFeatured"
                            )}
                            onCheckedChange={(
                                checked
                            ) =>
                                setValue(
                                    "isFeatured",
                                    checked,
                                    {
                                        shouldValidate:
                                            true,
                                        shouldDirty:
                                            true,
                                    }
                                )
                            }
                        />
                    </div>
                </div>
            </section>

            {/* SUBMIT */}

            {/* SUBMIT */}
            <div className="fixed  w-[78%] rounded-2xl bottom-0 my-4 flex justify-end left-[20%] right-0 z-50 border-t bg-background/95 p-3 shadow-lg backdrop-blur">
                <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="min-w-[180px]"
                >
                    {loading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}

                    {loading ? "Creating..." : "Create Destination"}
                </Button>
            </div>
        </form>
    );
}

