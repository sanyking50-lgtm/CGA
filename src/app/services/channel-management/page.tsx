import type { Metadata } from "next";
import ServiceDetailPage from "@/components/services/service-detail-page";

export const metadata: Metadata = {
  title: "YouTube Channel Management | Create Growth Agency",
  description:
    "Full YouTube channel management — content strategy, SEO, analytics, upload scheduling, and audience growth. Monthly plans starting at ৳8,000/mo.",
  openGraph: {
    title: "YouTube Channel Management | Create Growth Agency",
    description:
      "Full YouTube channel management — content strategy, SEO, analytics, upload scheduling, and audience growth. Monthly plans starting at ৳8,000/mo.",
    type: "website",
    url: "https://creategrowthagency.com/services/channel-management",
  },
};

export default function Page() {
  return <ServiceDetailPage slug="channel-management" />;
}