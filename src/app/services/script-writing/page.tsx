import type { Metadata } from "next";
import ServiceDetailPage from "@/components/services/service-detail-page";

export const metadata: Metadata = {
  title: "Script Writing | Create Growth Agency",
  description:
    "Research-backed YouTube scripts that hook and retain viewers. SEO keywords, structured content, CTA optimization, and fact-checked research. Starting at ৳300.",
  openGraph: {
    title: "Script Writing | Create Growth Agency",
    description:
      "Research-backed YouTube scripts that hook and retain viewers. SEO keywords, structured content, CTA optimization, and fact-checked research. Starting at ৳300.",
    type: "website",
    url: "https://creategrowthagency.com/services/script-writing",
  },
};

export default function Page() {
  return <ServiceDetailPage slug="script-writing" />;
}