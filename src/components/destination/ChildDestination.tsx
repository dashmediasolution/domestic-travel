"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ChildDestination {
  id: string;
  name: string;
  slug: string;
  subtitle?: string | null;
  description?: string | null;
  location?: string | null;
  heroImage?: {
    url?: string | null;
    publicId?: string | null;
  } | null;
  isPublished?: boolean;
}

interface ChildDestinationsCarouselProps {
  destination: string;
  children?: ChildDestination[];
}

export default function ChildDestinationsCarousel({
  destination,
  children = [],
}: ChildDestinationsCarouselProps) {
  const publishedDestinations = children.filter(
    (item) => item.isPublished !== false
  );

  if (publishedDestinations.length === 0) {
    return null;
  }

  return (
    <section className="flex w-full flex-col items-center gap-8 mb-10">
      <div className="flex w-[90%] flex-col gap-2">
        <h2 className="font-heading text-3xl font-semibold tracking-tight">
          Top Places in {destination}
        </h2>

        <p className="text-muted-foreground">
          Discover beautiful destinations and hidden gems nearby.
        </p>
      </div>

      <div className="relative w-[90%]">
        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <div className="overflow-hidden rounded-[24px]">
            <CarouselContent className="-ml-4">
              {publishedDestinations.map((item) => (
                <CarouselItem
                  key={item.id}
                  className="basis-auto pl-4"
                >
                  <Link
                    href={`/destinations/${item.slug}`}
                    className="group block"
                    aria-label={`Explore ${item.name}`}
                  >
                    <div className="relative h-46.75 w-57 overflow-hidden rounded-[24px]">
                      {item.heroImage?.url ? (
                        <Image
                          src={item.heroImage.url}
                          alt={item.name}
                          fill
                          sizes="228px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="h-full w-full bg-muted" />
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                        {item.subtitle && (
                          <p className="mb-1 line-clamp-1 text-xs font-medium uppercase tracking-wide text-white/80">
                            {item.subtitle}
                          </p>
                        )}

                        <h3 className="text-2xl font-bold leading-6">
                          {item.name}
                        </h3>

                        {item.description && (
                          <p className="mt-2 line-clamp-2 text-sm font-light leading-5 text-white/90">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </div>

          {publishedDestinations.length > 1 && (
            <>
              <CarouselPrevious className="z-10 -left-5 h-10 w-10 border bg-background/95 shadow-md" />
              <CarouselNext className="z-10 -right-5 h-10 w-10 border bg-background/95 shadow-md" />
            </>
          )}
        </Carousel>
      </div>
    </section>
  );
}