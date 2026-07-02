import type { Metadata } from "next";
import ServiceDetailPage from "@/components/services/service-detail-page";

export const metadata: Metadata = {
  title: "Thumbnail Design | Create Growth Agency",
  description:
    "Click-worthy YouTube thumbnail design that 10x your CTR. A/B testing variants, brand consistency, and PSD source files. Free trial available. Starting at ৳600.",
  openGraph: {
    title: "Thumbnail Design | Create Growth Agency",
    description:
      "Click-worthy YouTube thumbnail design that 10x your CTR. A/B testing variants, brand consistency, and PSD source files. Free trial available. Starting at ৳600.",
    type: "website",
    url: "https://creategrowthagency.com/services/thumbnail-design",
  },
};

export default function Page() {
  return <ServiceDetailPage slug="thumbnail-design" />;
}