import type { Metadata } from "next";
import { Outfit, Hind_Siliguri } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { FloatingChat } from "@/components/chat/floating-chat";
import { NewsletterPopup } from "@/components/newsletter/newsletter-popup";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { MainShell } from "@/components/layout/main-shell";
import { GA4Provider } from "@/components/analytics/ga4";
import { getOrganizationSchema } from "@/lib/structured-data";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali"],
  variable: "--font-hind-siliguri",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Create Growth Agency | YouTube Growth Platform",
  description:
    "BD's #1 YouTube Growth Agency — professional video editing, thumbnail design, script writing, and channel management to scale your YouTube channel fast.",
  keywords: [
    "YouTube growth",
    "YouTube editing",
    "thumbnail design",
    "YouTube agency",
    "channel management",
    "video editing",
    "Bangladesh YouTube",
  ],
  authors: [{ name: "Create Growth Agency" }],
  openGraph: {
    title: "Create Growth Agency | YouTube Growth Platform",
    description:
      "BD's #1 YouTube Growth Agency — professional video editing, thumbnail design, and channel management.",
    type: "website",
  },
};

const organizationJsonLd = getOrganizationSchema();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="dark"
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
      </head>
      <body
        className={`${outfit.variable} ${hindSiliguri.variable} min-h-screen flex flex-col bg-[#080E1A] font-sans text-slate-100 antialiased`}
      >
        <GA4Provider />
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <MainShell>{children}</MainShell>
          </div>
        </ThemeProvider>
        <Toaster />
        <FloatingChat />
        <NewsletterPopup />
      </body>
    </html>
  );
}