import {
  Play,
  Film,
  Image,
  PenTool,
  BarChart3,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export interface ServicePackage {
  name: string;
  price: number;
  deliveryHrs: number;
  revisions: number;
  expressFee: number;
  isPopular: boolean;
  features: string[];
  isMonthly?: boolean;
  isCustomQuote?: boolean;
}

export interface ServiceData {
  slug: string;
  name: string;
  tagline: string;
  icon: LucideIcon;
  isFreeTrial?: boolean;
  whatYouGet: string[];
  packages: ServicePackage[];
}

export const services: ServiceData[] = [
  {
    slug: "youtube-editing",
    name: "YouTube Video Editing",
    tagline: "Turn raw footage into scroll-stopping content",
    icon: Play,
    whatYouGet: [
      "Cutting + Trimming + Jump Cut",
      "B-roll + Stock Footage",
      "Zoom In/Out + Motion Graphics",
      "Sound Design (Music + SFX + Noise Remove)",
      "Color Correction + Face Brighten",
      "Auto Captions + Keyword Highlight",
      "Custom Intro/Outro",
      "End Screen + Cards",
    ],
    packages: [
      {
        name: "Basic",
        price: 1500,
        deliveryHrs: 72,
        revisions: 1,
        expressFee: 500,
        isPopular: false,
        features: [
          "Cutting + Trimming",
          "Noise Removal",
          "Basic B-roll",
          "Basic Color Correction",
          "Auto Captions",
        ],
      },
      {
        name: "Standard",
        price: 4000,
        deliveryHrs: 48,
        revisions: 2,
        expressFee: 500,
        isPopular: true,
        features: [
          "Pro Cutting + Pacing",
          "Advanced B-roll + Stock",
          "Motion Text Graphics",
          "Sound Design (Music + SFX)",
          "2 Revisions",
          "Face Brighten",
        ],
      },
      {
        name: "Premium",
        price: 8000,
        deliveryHrs: 24,
        revisions: 99,
        expressFee: 500,
        isPopular: false,
        features: [
          "Cinematic Editing",
          "Custom Motion Graphics",
          "Professional Color Grade",
          "Sound Design + Noise Remove",
          "Unlimited Revisions",
          "Custom Intro/Outro",
          "End Screen + Cards",
          "Priority Support",
        ],
      },
    ],
  },
  {
    slug: "shorts-editing",
    name: "Shorts/Reels Editing",
    tagline: "Bulk short-form content that goes viral",
    icon: Film,
    whatYouGet: [
      "Vertical Format (1080x1920)",
      "Trending Audio Sync",
      "Fast Cuts + Pacing",
      "Captions + Subtitles",
      "B-roll + Zoom Effects",
      "Hook Optimization",
      "Brand Watermark (optional)",
    ],
    packages: [
      {
        name: "Starter",
        price: 2000,
        deliveryHrs: 48,
        revisions: 1,
        expressFee: 300,
        isPopular: false,
        features: [
          "10 Shorts",
          "1080x1920 MP4",
          "Basic Cuts + Captions",
          "Trending Audio Sync",
        ],
      },
      {
        name: "Growth",
        price: 5000,
        deliveryHrs: 72,
        revisions: 2,
        expressFee: 500,
        isPopular: true,
        features: [
          "30 Shorts",
          "1080x1920 MP4",
          "Advanced Editing + Effects",
          "B-roll + Zoom Effects",
          "2 Revisions per batch",
        ],
      },
      {
        name: "Pro",
        price: 9000,
        deliveryHrs: 96,
        revisions: 99,
        expressFee: 800,
        isPopular: false,
        features: [
          "60 Shorts",
          "1080x1920 MP4",
          "Cinematic Editing",
          "Custom Motion Graphics",
          "Sound Design + SFX",
          "Unlimited Revisions",
        ],
      },
    ],
  },
  {
    slug: "thumbnail-design",
    name: "Thumbnail Design",
    tagline: "Click-worthy designs that 10x your CTR",
    icon: Image,
    isFreeTrial: true,
    whatYouGet: [
      "1280x720 HD Resolution",
      "Face + Text Optimization",
      "A/B Testing Variants",
      "Brand Color Consistency",
      "YouTube Best Practices",
      "PSD Source File",
    ],
    packages: [
      {
        name: "Basic",
        price: 600,
        deliveryHrs: 24,
        revisions: 1,
        expressFee: 200,
        isPopular: false,
        features: [
          "3 Thumbnails",
          "1280x720 HD",
          "Professional Design",
          "Text + Face Optimization",
        ],
      },
      {
        name: "Standard",
        price: 1500,
        deliveryHrs: 48,
        revisions: 2,
        expressFee: 500,
        isPopular: true,
        features: [
          "10 Thumbnails",
          "1280x720 HD",
          "A/B Testing Variants",
          "2 Revisions",
          "Brand Consistency",
        ],
      },
      {
        name: "Monthly",
        price: 4000,
        deliveryHrs: 24,
        revisions: 99,
        expressFee: 0,
        isPopular: false,
        features: [
          "30 Thumbnails/Month",
          "Daily Delivery",
          "1280x720 HD",
          "Unlimited Revisions",
          "Dedicated Designer",
          "Priority Support",
        ],
        isMonthly: true,
      },
    ],
  },
  {
    slug: "script-writing",
    name: "Script Writing",
    tagline: "Research-backed scripts that hook and retain",
    icon: PenTool,
    whatYouGet: [
      "Hook + Intro Writing",
      "Structured Body Content",
      "SEO Keyword Integration",
      "CTA Optimization",
      "Fact-Checked Research",
      "Engagement Triggers",
    ],
    packages: [
      {
        name: "Shorts Script",
        price: 300,
        deliveryHrs: 12,
        revisions: 1,
        expressFee: 0,
        isPopular: false,
        features: [
          "30-60 Second Script",
          "Hook + CTA",
          "Trending Topic Research",
          "1 Revision",
        ],
      },
      {
        name: "YouTube Script",
        price: 1500,
        deliveryHrs: 24,
        revisions: 2,
        expressFee: 0,
        isPopular: true,
        features: [
          "8-10 Minute Script",
          "Full Research + Outline",
          "Hook + Body + CTA",
          "SEO Keywords",
          "2 Revisions",
        ],
      },
      {
        name: "Monthly Scripts",
        price: 18000,
        deliveryHrs: 24,
        revisions: 99,
        expressFee: 0,
        isPopular: false,
        features: [
          "15 Scripts/Month",
          "Daily Delivery",
          "Full Research",
          "Custom Style Guide",
          "Unlimited Revisions",
          "Dedicated Writer",
        ],
      },
    ],
  },
  {
    slug: "channel-management",
    name: "YouTube Channel Management",
    tagline: "We grow your channel while you create",
    icon: BarChart3,
    whatYouGet: [
      "Content Strategy & Calendar",
      "SEO Optimization",
      "Thumbnail + Title Guidance",
      "Analytics & Reporting",
      "Upload Scheduling",
      "Audience Growth Tactics",
    ],
    packages: [
      {
        name: "Starter",
        price: 8000,
        deliveryHrs: 720,
        revisions: 0,
        expressFee: 0,
        isPopular: false,
        features: [
          "4 Videos/Month",
          "Content Calendar",
          "Basic SEO Optimization",
          "Thumbnail + Title Guidance",
          "9AM-6PM Support",
        ],
        isMonthly: true,
      },
      {
        name: "Growth",
        price: 20000,
        deliveryHrs: 720,
        revisions: 0,
        expressFee: 0,
        isPopular: true,
        features: [
          "8-10 Videos/Month",
          "Content Strategy",
          "Advanced SEO",
          "A/B Testing",
          "Analytics Report",
          "Dedicated Manager",
        ],
        isMonthly: true,
      },
      {
        name: "Pro",
        price: 40000,
        deliveryHrs: 720,
        revisions: 0,
        expressFee: 0,
        isPopular: false,
        features: [
          "12-15 Videos/Month",
          "30 Shorts/Month",
          "Full Strategy",
          "24/7 Support",
          "Monthly Strategy Call",
          "Competitor Analysis",
          "Revenue Optimization",
        ],
        isMonthly: true,
      },
    ],
  },
  {
    slug: "motion-graphics",
    name: "Motion Graphics",
    tagline: "Premium animations that elevate your brand",
    icon: Sparkles,
    whatYouGet: [
      "Custom Intro Animations",
      "Lower Thirds & Titles",
      "Transitions & Effects",
      "Logo Animations",
      "Kinetic Typography",
      "Visual Effects",
    ],
    packages: [
      {
        name: "Custom Quote",
        price: 0,
        deliveryHrs: 0,
        revisions: 0,
        expressFee: 0,
        isPopular: false,
        features: [
          "Custom Pricing",
          "Based on Requirements",
          "Dedicated Motion Designer",
          "Unlimited Concepts",
        ],
        isCustomQuote: true,
      },
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return services.find((s) => s.slug === slug);
}

export function getRelatedServices(
  currentSlug: string,
  count: number = 3
): ServiceData[] {
  return services.filter((s) => s.slug !== currentSlug).slice(0, count);
}