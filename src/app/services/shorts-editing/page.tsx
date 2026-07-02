import type { Metadata } from "next";
import ServiceDetailPage from "@/components/services/service-detail-page";

export const metadata: Metadata = {
  title: "Shorts/Reels Editing | Create Growth Agency",
  description:
    "Bulk short-form content editing for YouTube Shorts and Instagram Reels. Trending audio sync, fast cuts, captions, and effects. Starting at ৳2,000.",
  openGraph: {
    title: "Shorts/Reels Editing | Create Growth Agency",
    description:
      "Bulk short-form content editing for YouTube Shorts and Instagram Reels. Trending audio sync, fast cuts, captions, and effects. Starting at ৳2,000.",
    type: "website",
    url: "https://creategrowthagency.com/services/shorts-editing",
  },
};

export default function Page() {
  return <ServiceDetailPage slug="shorts-editing" />;
}