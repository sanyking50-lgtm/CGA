import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const services = [
  {
    name: "YouTube Video Editing",
    slug: "youtube-editing",
    shortDesc: "Professional video editing to make your content stand out",
    fullDesc: "Our expert editors transform your raw footage into engaging, retention-optimized YouTube videos. From basic cuts to cinematic color grading, we handle it all so you can focus on creating.",
    isActive: true,
    sortOrder: 1,
    isFreeTrial: false,
    packages: [
      {
        name: "Basic",
        price: 1500,
        deliveryHrs: 72,
        revisions: 1,
        features: ["Cutting + Trimming", "Noise Removal", "Basic B-roll", "Basic Color Correction", "Auto Captions"],
        isPopular: false,
        sortOrder: 1,
        expressFee: 500,
      },
      {
        name: "Standard",
        price: 4000,
        deliveryHrs: 48,
        revisions: 2,
        features: ["Pro Cutting + Pacing", "Advanced B-roll + Stock", "Motion Text Graphics", "Sound Design (Music + SFX)", "2 Revisions", "Face Brighten"],
        isPopular: true,
        sortOrder: 2,
        expressFee: 500,
      },
      {
        name: "Premium",
        price: 8000,
        deliveryHrs: 24,
        revisions: 99,
        features: ["Cinematic Editing", "Custom Motion Graphics", "Professional Color Grade", "Sound Design + Noise Remove", "Unlimited Revisions", "Custom Intro/Outro", "End Screen + Cards", "Priority Support"],
        isPopular: false,
        sortOrder: 3,
        expressFee: 500,
      },
    ],
  },
  {
    name: "Shorts/Reels Editing",
    slug: "shorts-editing",
    shortDesc: "Viral-ready short-form content in bulk",
    fullDesc: "Get scroll-stopping Shorts and Reels edited in bulk. Perfect for creators who want to maintain a consistent posting schedule with high-quality short-form content.",
    isActive: true,
    sortOrder: 2,
    isFreeTrial: false,
    packages: [
      {
        name: "Starter",
        price: 2000,
        deliveryHrs: 48,
        revisions: 1,
        features: ["10 Shorts", "1080x1920 MP4", "Basic Cuts + Captions", "Trending Audio Sync"],
        isPopular: false,
        sortOrder: 1,
        expressFee: 300,
      },
      {
        name: "Growth",
        price: 5000,
        deliveryHrs: 72,
        revisions: 2,
        features: ["30 Shorts", "1080x1920 MP4", "Advanced Editing + Effects", "B-roll + Zoom Effects", "2 Revisions per batch"],
        isPopular: true,
        sortOrder: 2,
        expressFee: 500,
      },
      {
        name: "Pro",
        price: 9000,
        deliveryHrs: 96,
        revisions: 99,
        features: ["60 Shorts", "1080x1920 MP4", "Cinematic Editing", "Custom Motion Graphics", "Sound Design + SFX", "Unlimited Revisions"],
        isPopular: false,
        sortOrder: 3,
        expressFee: 800,
      },
    ],
  },
  {
    name: "Thumbnail Design",
    slug: "thumbnail-design",
    shortDesc: "Click-worthy thumbnails that boost your CTR",
    fullDesc: "Eye-catching thumbnail designs that stop the scroll and drive clicks. Our designers create thumbnails optimized for YouTube algorithm and viewer psychology.",
    isActive: true,
    sortOrder: 3,
    isFreeTrial: true,
    packages: [
      {
        name: "Basic",
        price: 600,
        deliveryHrs: 24,
        revisions: 1,
        features: ["3 Thumbnails", "1280x720 HD", "Professional Design", "Text + Face Optimization"],
        isPopular: false,
        sortOrder: 1,
        expressFee: 200,
      },
      {
        name: "Standard",
        price: 1500,
        deliveryHrs: 48,
        revisions: 2,
        features: ["10 Thumbnails", "1280x720 HD", "A/B Testing Variants", "2 Revisions", "Brand Consistency"],
        isPopular: true,
        sortOrder: 2,
        expressFee: 500,
      },
      {
        name: "Monthly",
        price: 4000,
        deliveryHrs: 24,
        revisions: 99,
        features: ["30 Thumbnails/Month", "Daily Delivery", "1280x720 HD", "Unlimited Revisions", "Dedicated Designer", "Priority Support"],
        isPopular: false,
        sortOrder: 3,
        expressFee: 0,
      },
    ],
  },
  {
    name: "Script Writing",
    slug: "script-writing",
    shortDesc: "Engaging scripts that hook viewers from start to finish",
    fullDesc: "Compelling, research-backed scripts crafted for maximum viewer retention. Whether it is a 30-second Short or a 10-minute deep dive, our writers deliver scripts that keep audiences watching.",
    isActive: true,
    sortOrder: 4,
    isFreeTrial: false,
    packages: [
      {
        name: "Shorts Script",
        price: 300,
        deliveryHrs: 12,
        revisions: 1,
        features: ["30-60 Second Script", "Hook + CTA", "Trending Topic Research", "1 Revision"],
        isPopular: false,
        sortOrder: 1,
        expressFee: 0,
      },
      {
        name: "YouTube Script",
        price: 1500,
        deliveryHrs: 24,
        revisions: 2,
        features: ["8-10 Minute Script", "Full Research + Outline", "Hook + Body + CTA", "SEO Keywords", "2 Revisions"],
        isPopular: true,
        sortOrder: 2,
        expressFee: 0,
      },
      {
        name: "Monthly Scripts",
        price: 18000,
        deliveryHrs: 24,
        revisions: 99,
        features: ["15 Scripts/Month", "Daily Delivery", "Full Research", "Custom Style Guide", "Unlimited Revisions", "Dedicated Writer"],
        isPopular: false,
        sortOrder: 3,
        expressFee: 0,
      },
    ],
  },
  {
    name: "YouTube Channel Management",
    slug: "channel-management",
    shortDesc: "Full-service channel growth with dedicated management",
    fullDesc: "End-to-end YouTube channel management. We handle content planning, scheduling, SEO optimization, and analytics so you can focus on creating content while we grow your channel.",
    isActive: true,
    sortOrder: 5,
    isFreeTrial: false,
    packages: [
      {
        name: "Starter",
        price: 8000,
        deliveryHrs: 720,
        revisions: 0,
        features: ["4 Videos/Month", "Content Calendar", "Basic SEO Optimization", "Thumbnail + Title Guidance", "9AM-6PM Support"],
        isPopular: false,
        sortOrder: 1,
        expressFee: 0,
      },
      {
        name: "Growth",
        price: 20000,
        deliveryHrs: 720,
        revisions: 0,
        features: ["8-10 Videos/Month", "Content Strategy", "Advanced SEO", "A/B Testing", "Analytics Report", "Dedicated Manager"],
        isPopular: true,
        sortOrder: 2,
        expressFee: 0,
      },
      {
        name: "Pro",
        price: 40000,
        deliveryHrs: 720,
        revisions: 0,
        features: ["12-15 Videos/Month", "30 Shorts/Month", "Full Strategy", "24/7 Support", "Monthly Strategy Call", "Competitor Analysis", "Revenue Optimization"],
        isPopular: false,
        sortOrder: 3,
        expressFee: 0,
      },
    ],
  },
  {
    name: "Motion Graphics",
    slug: "motion-graphics",
    shortDesc: "Stunning animations and visual effects for your videos",
    fullDesc: "Custom motion graphics, intros, outros, lower thirds, and visual effects that elevate your video production quality. Perfect for brands and creators who want that premium feel.",
    isActive: true,
    sortOrder: 6,
    isFreeTrial: false,
    packages: [
      {
        name: "Custom Quote",
        price: 0,
        deliveryHrs: 0,
        revisions: 0,
        features: ["Custom Pricing", "Based on Requirements", "Dedicated Motion Designer", "Unlimited Concepts"],
        isPopular: false,
        sortOrder: 1,
        expressFee: 0,
      },
    ],
  },
];

async function seed() {
  console.log("Seeding services...");

  for (const service of services) {
    const { packages: pkgs, ...serviceData } = service;

    const created = await prisma.service.upsert({
      where: { slug: serviceData.slug },
      update: serviceData,
      create: serviceData,
    });

    await prisma.servicePackage.deleteMany({ where: { serviceId: created.id } });

    for (const pkg of pkgs) {
      await prisma.servicePackage.create({
        data: {
          serviceId: created.id,
          name: pkg.name,
          price: pkg.price,
          deliveryHrs: pkg.deliveryHrs,
          revisions: pkg.revisions,
          features: pkg.features,
          isPopular: pkg.isPopular,
          sortOrder: pkg.sortOrder,
          expressFee: pkg.expressFee,
        },
      });
    }

    console.log(`  Done: ${created.name} (${pkgs.length} packages)`);
  }

  console.log("\nAll services seeded successfully!");
}

seed()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());