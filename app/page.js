import HolidayHomePage from "@/components/HolidayHomePage";
import ComingSoonPage from "@/components/ComingSoonPage";
import { getPublishedContent } from "@/lib/cms/content";
import { SITE_CONTACT, SITE_DESCRIPTION, SITE_LOCATION, SITE_NAME, SITE_URL } from "@/lib/seo";

const lodgingBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  "@id": `${SITE_URL}/#lodging-business`,
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  image: [
    `${SITE_URL}/images/standard-room.jpg`,
    `${SITE_URL}/images/standard-room-sitting.jpg`,
    `${SITE_URL}/images/standard-room-twin.PNG`,
  ],
  logo: `${SITE_URL}/images/logo.png`,
  telephone: SITE_CONTACT.telephone,
  email: SITE_CONTACT.email,
  priceRange: "USD 30 per room, per night",
  currenciesAccepted: "USD",
  checkinTime: "15:00",
  checkoutTime: "12:00",
  address: {
    "@type": "PostalAddress",
    addressLocality: SITE_LOCATION.locality,
    addressRegion: SITE_LOCATION.region,
    addressCountry: SITE_LOCATION.country,
  },
  hasMap: SITE_CONTACT.map,
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Private bathroom", value: true },
    { "@type": "LocationFeatureSpecification", name: "Free Wi-Fi", value: true },
    { "@type": "LocationFeatureSpecification", name: "Air conditioning", value: true },
    { "@type": "LocationFeatureSpecification", name: "Hot and cold water", value: true },
    { "@type": "LocationFeatureSpecification", name: "Kitchen available in selected rooms", value: true },
  ],
};

export default async function Page() {
  if (process.env.SITE_MODE === "coming-soon") {
    return <ComingSoonPage />;
  }

  const published = await getPublishedContent();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(lodgingBusinessSchema).replace(/</g, "\\u003c"),
        }}
      />
      <HolidayHomePage cmsContent={published?.data || null} />
    </>
  );
}
