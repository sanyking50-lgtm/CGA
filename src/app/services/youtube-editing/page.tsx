import type { Metadata } from "next";
import ServiceDetailPage from "@/components/services/service-detail-page";

export const metadata: Metadata = {
  title: "YouTube Video Editing | Create Growth Agency",
  description:
    "Professional YouTube video editing — cutting, B-roll, motion graphics, sound design, color correction, auto captions, and more. Starting at ৳1,500.",
  openGraph: {
    title: "YouTube Video Editing | Create Growth Agency",
    description:
      "Professional YouTube video editing — cutting, B-roll, motion graphics, sound design, color correction, auto captions, and more. Starting at ৳1,500.",
    type: "website",
    url: "https://creategrowthagency.com/services/youtube-editing",
  },
};

export default function Page() {
  return <ServiceDetailPage slug="youtube-editing" />;
}