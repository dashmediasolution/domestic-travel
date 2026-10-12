
import SearachBar from "@/components/homePage/SerachBar";
import { FeaturedDestination } from "@/components/homePage/FeaturedDestination";
import BrowseByCategory from "@/components/homePage/BrowseByCategory";
import BannerCarousel, { type Banner, } from "@/components/homePage/Carousel";
import WhyTravelWithUs from "@/components/homePage/TravelWithUs";
import UpcomingPackages from "@/components/homePage/UpcomingPackages";
import ContactInquiryForm from "./ContactInquiryForm";
import TravelStories from "@/components/homePage/TravelStories";
import ExploreIndia from "@/components/homePage/ExploreIndia";
import WhyChooseUs from "@/components/homePage/WhyChooseUs";
import BestOffers from "@/components/homePage/BestOffers";
import HeroSection from "@/components/homePage/HeroSection";
import Memories from "@/components/Memories";
import TravelersReviews from "@/components/Reviews";
import Image from "next/image";
import EarlyBirdSale from "@/components/packagess/EarlyBirdSale";
const firstBanner: Banner[] = [
  {
    id: 1,
    image: "/images/banners/ChristmasOFfer.png",
    title: "Discover New Destinations",
    redirectUrl: "/package/himachal-pradesh/shimla",
  },
  {
    id: 2,
    image: "/images/banners/DiwaliOffer.png",
    title: "Discover New Destinations",
    redirectUrl: "/package/uttar-pradesh/varanasi",
  },
  {
    id: 3,
    image: "/images/banners/goabanner.png",
    title: "Your Next Adventure Awaits",
    redirectUrl: "/destinations/goa",
  },
];
const secondBanner: Banner[] = [
  {
    id: 1,
    image: "/images/banners/banner_7.png",
    title: "Explore Incredible India",
    redirectUrl: "/destinations/india",
  },
  {
    id: 2,
    image: "/images/banners/banner_8.png",
    title: "Discover New Destinations",
    redirectUrl: "/destinations",
  },
  {
    id: 3,
    image: "/images/banners/banner_9.png",
    title: "Your Next Adventure Awaits",
    redirectUrl: "/adventure",
  },
];
const thirdBanner: Banner[] = [
  {
    id: 1,
    image: "/images/banners/banner_4.png",
    title: "Explore Incredible India",
    redirectUrl: "/package/north-east-india/meghalaya",
  },
  {
    id: 2,
    image: "/images/banners/jimCorbet banner.png",
    title: "Discover New Destinations",
    redirectUrl: "/package/uttarakhand/jim-corbett",
  },
  {
    id: 3,
    image: "/images/banners/kedarnath banner.png",
    title: "Your Next Adventure Awaits",
    redirectUrl: "/package/uttarakhand/kedarnath",
  },
];
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Organization",
            "@id": `${SITE_URL}/#organization`,
            name: "Domestic Travel",
            url: SITE_URL,
            logo: `${SITE_URL}/images/logo.png`,
        },
        {
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            url: SITE_URL,
            name: "Domestic Travel",
            publisher: {
                "@id": `${SITE_URL}/#organization`,
            },
            inLanguage: "en-IN",
        },
    ],
};

export default function Home() {
  return (
    <>
      <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData).replace(
                        /</g,
                        "\\u003c"
                    ),
                }}
            />
    <div className="flex gap-5 flex-col justify-center items-center"> 
      <HeroSection />
      <SearachBar bottomPosition="3.5" />
      <FeaturedDestination />
      <BrowseByCategory />
      <EarlyBirdSale />
      <BannerCarousel banners={firstBanner} />
      <ExploreIndia />
      <BestOffers />
      {/* <BannerCarousel banners={secondBanner} /> */}
      <WhyTravelWithUs />
      <UpcomingPackages />
      <BannerCarousel banners={thirdBanner} />
      <TravelStories />
      <WhyChooseUs />



      <section className="relative overflow-hidden    flex justify-center items-center">
        {/* Background Image */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/behind.png"
            alt="Plan your trip with WANDER-INDIA"
            fill
            priority
            sizes="90vw"
            className="object-cover"
          />

        </div>

        {/* Form */}
        <div className="relative z-10 py-12 sm:py-16 lg:py-20 w-[70%] flex justify-center items-center">
          <ContactInquiryForm />
        </div>
      </section> 
       <div className="w-full flex justify-center items-center my-10">
        <div className="w-[95%] flex justify-center items-center">
          <TravelersReviews />
        </div>
      </div>
          <Memories />
    </div>
    </>
  );
}


/* 
    Web Dev - MERN 
    Devops
    AI

      
*/