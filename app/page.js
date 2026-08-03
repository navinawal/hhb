import HolidayHomePage from "@/components/HolidayHomePage";
import ComingSoonPage from "@/components/ComingSoonPage";
import { getPublishedContent } from "@/lib/cms/content";

export default async function Page() {
  if (process.env.SITE_MODE === "coming-soon") {
    return <ComingSoonPage />;
  }

  const published = await getPublishedContent();
  return <HolidayHomePage cmsContent={published?.data || null} />;
}
