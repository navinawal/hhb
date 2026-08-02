import HolidayHomePage from "@/components/HolidayHomePage";
import ComingSoonPage from "@/components/ComingSoonPage";

export default function Page() {
  if (process.env.SITE_MODE === "coming-soon") {
    return <ComingSoonPage />;
  }

  return <HolidayHomePage />;
}
