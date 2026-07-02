"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Check,
  Clock,
  ArrowRight,
  Star,
  Zap,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { getServiceBySlug, getRelatedServices } from "@/lib/service-data";
import type { ServicePackage } from "@/lib/service-data";
import { ReviewCard } from "@/components/reviews/review-card";

// ─── Service Reviews (client component) ────────────────────────
function ServiceReviews({ slug }: { slug: string }) {
  const [reviews, setReviews] = useState<{
    id: string; stars: number; comment: string | null; createdAt: string;
    user: { name: string; avatarUrl: string | null };
    order: { serviceType: string; packageName: string | null } | null;
  }[]>([]);
  const [stats, setStats] = useState<{ average: number; total: number } | null>(null);

  useEffect(() => {
    fetch(`/api/reviews?service=${slug}&limit=10`)
      .then((r) => r.json())
      .then((d) => {
        setReviews(d.reviews || []);
        if (d.stats) setStats(d.stats);
      })
      .catch(() => {});
  }, [slug]);

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 rounded-xl border border-white/[0.06] bg-white/[0.02]">
        <p className="text-slate-400">No reviews yet for this service.</p>
        <p className="text-sm text-slate-600 mt-1">Be the first to share your experience!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {stats && (
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-slate-100">{stats.average}</p>
            <div className="flex items-center gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`size-4 ${s <= Math.round(stats.average) ? "fill-amber-400 text-amber-400" : "text-slate-700"}`} />
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-1">{stats.total} review{stats.total !== 1 ? "s" : ""}</p>
          </div>
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        {reviews.map((r) => (
          <ReviewCard
            key={r.id}
            name={r.user.name}
            avatarUrl={r.user.avatarUrl}
            stars={r.stars}
            comment={r.comment}
            packageName={r.order?.packageName}
            createdAt={r.createdAt}
            compact
          />
        ))}
      </div>
    </div>
  );
}

// ─── Animation variants ───────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

// ─── Helpers ──────────────────────────────────────────────────────

function formatPrice(price: number, isMonthly?: boolean): string {
  const formatted = `৳${price.toLocaleString("en-BD")}`;
  return isMonthly ? `${formatted}/mo` : formatted;
}

function formatDelivery(hrs: number): string {
  if (hrs >= 720) return "Monthly";
  if (hrs === 0) return "Contact Us";
  return `${hrs}h`;
}

function formatRevisions(count: number): string {
  if (count >= 99) return "Unlimited";
  if (count === 0) return "N/A";
  return `${count} Revision${count > 1 ? "s" : ""}`;
}

// ─── Process steps data ───────────────────────────────────────────

const processSteps = [
  { label: "Order", emoji: "📋" },
  { label: "Share Files", emoji: "📁" },
  { label: "Work Starts", emoji: "🚀" },
  { label: "Review", emoji: "👀" },
  { label: "Download", emoji: "✅" },
];

// ─── Sub-components ───────────────────────────────────────────────

function PricingCard({
  pkg,
  serviceSlug,
}: {
  pkg: ServicePackage;
  serviceSlug: string;
}) {
  const isCustomQuote = pkg.isCustomQuote;

  return (
    <motion.div custom={1} variants={fadeUp}>
      <Card
        className={cn(
          "relative flex flex-col border-white/[0.06] bg-white/[0.03] backdrop-blur-sm transition-shadow hover:shadow-lg hover:shadow-red-500/5",
          pkg.isPopular &&
            "border-red-500/50 shadow-lg shadow-red-500/10"
        )}
      >
        {pkg.isPopular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
            <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black border-0 font-semibold px-3 py-1 text-xs gap-1">
              <Star className="size-3 fill-current" />
              Most Popular
            </Badge>
          </div>
        )}

        <CardHeader className="pb-2 pt-8">
          <CardTitle className="text-lg font-semibold text-slate-100">
            {pkg.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col gap-5">
          {/* Price */}
          <div>
            {isCustomQuote ? (
              <p className="text-2xl font-bold text-slate-100">
                Custom Quote
              </p>
            ) : (
              <p className="text-3xl font-bold text-slate-100">
                {formatPrice(pkg.price, pkg.isMonthly)}
              </p>
            )}
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5 text-slate-500" />
              {formatDelivery(pkg.deliveryHrs)}
            </span>
            {!isCustomQuote && (
              <span className="flex items-center gap-1.5">
                <Zap className="size-3.5 text-slate-500" />
                {formatRevisions(pkg.revisions)}
              </span>
            )}
          </div>

          <Separator className="bg-white/[0.06]" />

          {/* Features */}
          <ul className="flex flex-col gap-2.5 flex-1">
            {pkg.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm">
                <Check className="size-4 text-red-400 mt-0.5 shrink-0" />
                <span className="text-slate-300">{feature}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="mt-auto pt-2">
            {isCustomQuote ? (
              <Button
                asChild
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:from-red-500 hover:to-red-700 transition-all h-11"
              >
                <Link href="/checkout?service=motion-graphics&package=Custom+Quote">
                  Get Quote
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            ) : (
              <Button
                asChild
                className={cn(
                  "w-full h-11 transition-all",
                  pkg.isPopular
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:from-red-500 hover:to-red-700"
                    : "bg-white/[0.06] text-slate-100 border border-white/[0.08] hover:bg-white/[0.1]"
                )}
              >
                <Link
                  href={`/checkout?service=${serviceSlug}&package=${encodeURIComponent(pkg.name)}`}
                >
                  Order Now
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────

interface ServiceDetailPageProps {
  slug: string;
}

export default function ServiceDetailPage({ slug }: ServiceDetailPageProps) {
  const service = getServiceBySlug(slug);
  const relatedServices = getRelatedServices(slug, 3);

  if (!service) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-slate-400 text-lg">Service not found.</p>
      </div>
    );
  }

  const IconComponent = service.icon;
  const hasExpress = service.packages.some((p) => p.expressFee > 0);

  return (
    <main className="flex-1 w-full">
      {/* ── Breadcrumb ──────────────────────────────────────────── */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.div custom={0} variants={fadeUp}>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/"
                    className="text-slate-400 hover:text-slate-200"
                  >
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-slate-600" />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/#services"
                    className="text-slate-400 hover:text-slate-200"
                  >
                    Services
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-slate-600" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-slate-200">
                    {service.name}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Hero Section ────────────────────────────────────────── */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="text-center"
        >
          {/* Icon */}
          <motion.div custom={0} variants={fadeUp} className="flex justify-center mb-6">
            <div className="flex items-center justify-center size-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/20">
              <IconComponent className="size-7 text-red-400" />
            </div>
          </motion.div>

          {/* Name */}
          <motion.h1
            custom={1}
            variants={fadeUp}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-100 tracking-tight mb-4"
          >
            {service.name}
          </motion.h1>

          {/* Tagline */}
          <motion.p
            custom={2}
            variants={fadeUp}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-6"
          >
            {service.tagline}
          </motion.p>

          {/* Badges line */}
          <motion.div
            custom={3}
            variants={fadeUp}
            className="flex flex-wrap items-center justify-center gap-3 text-sm text-slate-400"
          >
            <span className="flex items-center gap-1.5">
              <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
              <span className="text-slate-300">127 Reviews</span>
            </span>
            <Separator
              orientation="vertical"
              className="h-4 bg-white/[0.1] hidden sm:block"
            />
            <span className="flex items-center gap-1.5">
              <span className="text-green-400">✅</span>
              <span className="text-slate-300">
                {formatDelivery(service.packages[0]?.deliveryHrs ?? 48)} Delivery
              </span>
            </span>
            <Separator
              orientation="vertical"
              className="h-4 bg-white/[0.1] hidden sm:block"
            />
            <span className="flex items-center gap-1.5">
              <span className="text-blue-400">🔄</span>
              <span className="text-slate-300">Free Revision</span>
            </span>
          </motion.div>

          {/* Free Trial badge */}
          {service.isFreeTrial && (
            <motion.div custom={4} variants={fadeUp} className="mt-5">
              <Badge className="bg-gradient-to-r from-yellow-500/20 to-amber-500/10 text-yellow-400 border-yellow-500/30 px-4 py-1.5 text-sm gap-1.5">
                <Star className="size-4" />
                Free Trial Available
              </Badge>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* ── Pricing Section ─────────────────────────────────────── */}
      <section
        id="pricing"
        className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
        >
          <motion.h2
            custom={0}
            variants={fadeUp}
            className="text-2xl sm:text-3xl font-bold text-slate-100 text-center mb-3"
          >
            Choose Your Plan
          </motion.h2>
          <motion.p
            custom={1}
            variants={fadeUp}
            className="text-slate-400 text-center mb-10 max-w-xl mx-auto"
          >
            Select the package that fits your needs. All plans include dedicated
            support.
          </motion.p>

          <motion.div
            custom={2}
            variants={stagger}
            className={cn(
              "grid gap-6",
              service.packages.length === 1
                ? "max-w-md mx-auto"
                : service.packages.length === 2
                  ? "grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            )}
          >
            {service.packages.map((pkg) => (
              <PricingCard key={pkg.name} pkg={pkg} serviceSlug={service.slug} />
            ))}
          </motion.div>

          {/* Express delivery info */}
          {hasExpress && (
            <motion.div custom={3} variants={fadeUp} className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                <Zap className="size-3.5 inline-block mr-1 text-amber-400" />
                Express delivery available — reduces delivery time by 50%. Extra
                fee applies per package.
              </p>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* ── What You Get Section ────────────────────────────────── */}
      <section className="w-full bg-white/[0.02] border-y border-white/[0.06]">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
          >
            <motion.h2
              custom={0}
              variants={fadeUp}
              className="text-2xl sm:text-3xl font-bold text-slate-100 text-center mb-3"
            >
              What You Get
            </motion.h2>
            <motion.p
              custom={1}
              variants={fadeUp}
              className="text-slate-400 text-center mb-10 max-w-xl mx-auto"
            >
              Everything included in your {service.name.toLowerCase()} service.
            </motion.p>

            <motion.div
              custom={2}
              variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto"
            >
              {service.whatYouGet.map((item, idx) => (
                <motion.div
                  key={idx}
                  custom={idx}
                  variants={fadeUp}
                  className="flex items-center gap-3 p-4 rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm"
                >
                  <span className="flex items-center justify-center size-8 rounded-lg bg-red-500/10 text-red-400 text-sm font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-slate-300 text-sm">{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Process Steps Section ───────────────────────────────── */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
        >
          <motion.h2
            custom={0}
            variants={fadeUp}
            className="text-2xl sm:text-3xl font-bold text-slate-100 text-center mb-3"
          >
            How It Works
          </motion.h2>
          <motion.p
            custom={1}
            variants={fadeUp}
            className="text-slate-400 text-center mb-12 max-w-xl mx-auto"
          >
            Get started in 5 simple steps.
          </motion.p>

          <motion.div
            custom={2}
            variants={stagger}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0"
          >
            {processSteps.map((step, idx) => (
              <motion.div
                key={step.label}
                custom={idx}
                variants={fadeUp}
                className="flex items-center gap-4 sm:gap-0"
              >
                <div className="flex flex-col items-center gap-2.5">
                  <div className="flex items-center justify-center size-14 rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl text-2xl">
                    {step.emoji}
                  </div>
                  <span className="text-xs sm:text-sm text-slate-400 font-medium text-center">
                    {step.label}
                  </span>
                </div>
                {idx < processSteps.length - 1 && (
                  <ChevronRight className="size-5 text-slate-600 mx-4 mb-5 hidden sm:block" />
                )}
                {idx < processSteps.length - 1 && (
                  <div className="sm:hidden w-px h-6 bg-white/[0.06] mb-5" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Reviews Section ────────────────────────────────── */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.div custom={0} variants={fadeUp}>
            <h2 className="text-2xl font-bold text-slate-100 mb-6">Customer Reviews</h2>
          </motion.div>
          <motion.div custom={1} variants={fadeUp}>
            <ServiceReviews slug={slug} />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Related Services Section ────────────────────────────── */}
      <section className="w-full bg-white/[0.02] border-t border-white/[0.06]">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
          >
            <motion.h2
              custom={0}
              variants={fadeUp}
              className="text-2xl sm:text-3xl font-bold text-slate-100 text-center mb-3"
            >
              Related Services
            </motion.h2>
            <motion.p
              custom={1}
              variants={fadeUp}
              className="text-slate-400 text-center mb-10 max-w-xl mx-auto"
            >
              Explore other services to grow your YouTube channel.
            </motion.p>

            <motion.div
              custom={2}
              variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {relatedServices.map((rel) => {
                const RelIcon = rel.icon;
                return (
                  <motion.div key={rel.slug} custom={rel.slug === slug ? 99 : 0} variants={fadeUp}>
                    <Card className="group border-white/[0.06] bg-white/[0.03] backdrop-blur-sm hover:border-red-500/30 transition-all hover:shadow-lg hover:shadow-red-500/5 overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex items-center justify-center size-12 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/20 shrink-0">
                            <RelIcon className="size-5 text-red-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-semibold text-slate-100 mb-1 truncate">
                              {rel.name}
                            </h3>
                            <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                              {rel.tagline}
                            </p>
                            <Button
                              asChild
                              variant="ghost"
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-0 h-auto font-medium"
                            >
                              <Link href={`/services/${rel.slug}`}>
                                View Details
                                <ArrowRight className="size-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}