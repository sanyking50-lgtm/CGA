import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/dashboard/", "/checkout/"],
      },
    ],
    sitemap: "https://creategrowthagency.com/sitemap.xml",
  };
}