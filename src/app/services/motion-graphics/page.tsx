import type { Metadata } from "next";
import ServiceDetailPage from "@/components/services/service-detail-page";

export const metadata: Metadata = {
  title: "Motion Graphics | Create Growth Agency",
  description:
    "Premium motion graphics — custom intro animations, lower thirds, transitions, logo animations, kinetic typography, and visual effects. Get a custom quote today.",
  openGraph: {
    title: "Motion Graphics | Create Growth Agency",
    description:
      "Premium motion graphics — custom intro animations, lower thirds, transitions, logo animations, kinetic typography, and visual effects. Get a custom quote today.",
    type: "website",
    url: "https://creategrowthagency.com/services/motion-graphics",
  },
};

export default function Page() {
  return <ServiceDetailPage slug="motion-graphics" />;
}