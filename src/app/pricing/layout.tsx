import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | Create Growth Agency",
  description:
    "Simple, transparent pricing for YouTube growth services. Subscription plans and per-service pricing for video editing, thumbnails, scripts, and channel management. No hidden fees.",
  openGraph: {
    title: "Pricing | Create Growth Agency",
    description:
      "Simple, transparent pricing for YouTube growth services. Subscription plans and per-service pricing. No hidden fees.",
    type: "website",
    url: "https://creategrowthagency.com/pricing",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}