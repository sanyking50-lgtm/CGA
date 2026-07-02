'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Check,
  ArrowRight,
  ChevronRight,
  Crown,
  Star,
  Shield,
  Zap,
  Video,
  Smartphone,
  Palette,
  PenTool,
  BarChart3,
  Wand2,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

/* ───────────────────────── Animation Variants ───────────────────────── */

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: 'easeOut' as const },
};

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: { staggerChildren: 0.1 },
  },
  viewport: { once: true },
};

const childFadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: 'easeOut' as const },
};

/* ───────────────────────── Data ───────────────────────── */

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  name: string;
  price: number;
  description: string;
  features: PlanFeature[];
  highlighted: boolean;
  badge?: string;
  buttonText: string;
  buttonVariant: 'gradient' | 'outline';
}

const plans: Plan[] = [
  {
    name: 'Starter',
    price: 8000,
    description: 'Perfect for creators just getting started',
    features: [
      { text: '8 Videos', included: true },
      { text: '16 Thumbnails', included: true },
      { text: '8 Scripts', included: true },
      { text: '2 Revisions/video', included: true },
      { text: 'Standard Delivery', included: true },
      { text: '9AM-6PM Support', included: true },
      { text: 'Dedicated Manager', included: false },
      { text: 'Monthly Report', included: false },
    ],
    highlighted: false,
    buttonText: 'Subscribe',
    buttonVariant: 'gradient',
  },
  {
    name: 'Pro',
    price: 18000,
    description: 'For growing channels ready to scale',
    features: [
      { text: '15 Videos', included: true },
      { text: '30 Thumbnails', included: true },
      { text: '15 Scripts', included: true },
      { text: 'Unlimited Revisions', included: true },
      { text: 'Express Delivery Free', included: true },
      { text: 'Dedicated Manager', included: true },
      { text: 'Monthly Report', included: true },
      { text: '24/7 Support', included: false },
    ],
    highlighted: true,
    badge: '\uD83D\uDD25 Most Popular',
    buttonText: 'Subscribe',
    buttonVariant: 'gradient',
  },
  {
    name: 'Enterprise',
    price: 40000,
    description: 'For serious creators and brands',
    features: [
      { text: '30 Videos', included: true },
      { text: '60 Thumbnails', included: true },
      { text: '60 Shorts', included: true },
      { text: 'Unlimited Revisions', included: true },
      { text: 'Priority 12h Delivery', included: true },
      { text: '24/7 Support', included: true },
      { text: 'Monthly Strategy Call', included: true },
      { text: 'Competitor Analysis', included: true },
    ],
    highlighted: false,
    buttonText: 'Contact Us',
    buttonVariant: 'outline',
  },
];

interface PerService {
  icon: React.ElementType;
  title: string;
  slug: string;
  startingPrice: string;
  delivery: string;
  popularPlan: string;
  iconColor: string;
}

const perServices: PerService[] = [
  {
    icon: Video,
    title: 'YouTube Video Editing',
    slug: 'video-editing',
    startingPrice: '৳1,500',
    delivery: '24-72h',
    popularPlan: 'Standard ৳4,000',
    iconColor: 'text-red-400',
  },
  {
    icon: Smartphone,
    title: 'Shorts/Reels Editing',
    slug: 'shorts-reels-editing',
    startingPrice: '৳2,000',
    delivery: '48-96h',
    popularPlan: 'Growth ৳5,000',
    iconColor: 'text-pink-400',
  },
  {
    icon: Palette,
    title: 'Thumbnail Design',
    slug: 'thumbnail-design',
    startingPrice: '৳600',
    delivery: '24-48h',
    popularPlan: 'Standard ৳1,500',
    iconColor: 'text-violet-400',
  },
  {
    icon: PenTool,
    title: 'Script Writing',
    slug: 'script-writing',
    startingPrice: '৳300',
    delivery: '12-24h',
    popularPlan: 'YouTube ৳1,500',
    iconColor: 'text-emerald-400',
  },
  {
    icon: BarChart3,
    title: 'Channel Management',
    slug: 'channel-management',
    startingPrice: '৳8,000/mo',
    delivery: 'Monthly',
    popularPlan: 'Growth ৳20,000/mo',
    iconColor: 'text-amber-400',
  },
  {
    icon: Wand2,
    title: 'Motion Graphics',
    slug: 'motion-graphics',
    startingPrice: 'Custom',
    delivery: 'Quote-based',
    popularPlan: 'Get Quote',
    iconColor: 'text-cyan-400',
  },
];

const faqs = [
  {
    question: 'Can I change my plan later?',
    answer:
      "Yes! You can upgrade or downgrade anytime. Changes take effect on your next billing cycle.",
  },
  {
    question: 'What happens if I cancel?',
    answer:
      'You keep access until the end of your current billing period. No partial refunds.',
  },
  {
    question: 'Do you offer refunds?',
    answer:
      "We offer revisions instead. If you're not satisfied, we'll revise until you're happy.",
  },
  {
    question: 'Is there a free trial?',
    answer:
      'Yes! Thumbnail Design has a free trial — 1 free thumbnail for new clients.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'BD: bKash, Nagad, Card (SSLCOMMERZ). Global: Card, Apple Pay (Stripe).',
  },
];

/* ───────────────────────── Helpers ───────────────────────── */

function formatPrice(price: number): string {
  return price.toLocaleString('en-IN');
}

function getBengaliPrice(price: number): string {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return `৳${price
    .toLocaleString('en-IN')
    .split('')
    .map((c) => (bengaliDigits[parseInt(c)] ?? c))
    .join('')}`;
}

/* ───────────────────────── Sub-components ───────────────────────── */

function PlanCard({ plan, index }: { plan: Plan; index: number }) {
  const IconComponent = plan.highlighted ? Crown : Star;

  return (
    <motion.div
      variants={childFadeInUp}
      className={cn(
        'relative flex flex-col rounded-2xl border p-6 transition-all duration-300',
        'hover:-translate-y-1',
        plan.highlighted
          ? 'border-red-500/50 bg-white/[0.06] shadow-[0_0_40px_rgba(239,68,68,0.15)] md:scale-105 md:p-8'
          : 'border-white/[0.06] bg-white/[0.03] backdrop-blur-sm hover:border-white/[0.12]'
      )}
    >
      {/* Badge */}
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-gradient-to-r from-red-500 to-red-600 border-0 px-4 py-1 text-sm font-semibold text-white shadow-lg shadow-red-500/25">
            {plan.badge}
          </Badge>
        </div>
      )}

      {/* Glow ring behind badge for highlighted */}
      {plan.highlighted && (
        <div className="absolute -inset-px -z-10 rounded-2xl bg-gradient-to-b from-red-500/20 via-transparent to-red-500/10" />
      )}

      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-xl',
            plan.highlighted
              ? 'bg-gradient-to-br from-red-500 to-red-600 text-white'
              : 'bg-white/[0.06] text-slate-400'
          )}
        >
          <IconComponent className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-100">{plan.name}</h3>
          <p className="text-xs text-slate-500">{plan.description}</p>
        </div>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-extrabold text-slate-100 md:text-4xl">
            {getBengaliPrice(plan.price)}
          </span>
          <span className="text-sm text-slate-500">/মাস</span>
        </div>
      </div>

      {/* Features */}
      <ul className="mb-8 flex flex-1 flex-col gap-3">
        {plan.features.map((feature) => (
          <li key={feature.text} className="flex items-center gap-3">
            {feature.included ? (
              <Check className="h-4 w-4 shrink-0 text-red-400" />
            ) : (
              <span className="h-4 w-4 shrink-0 text-slate-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </span>
            )}
            <span
              className={cn(
                'text-sm',
                feature.included ? 'text-slate-300' : 'text-slate-600'
              )}
            >
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      {/* Button */}
      <Link href="/dashboard">
        {plan.buttonVariant === 'gradient' ? (
          <Button
            className={cn(
              'w-full bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg transition-all duration-300',
              'hover:from-red-400 hover:to-red-500 hover:shadow-red-500/25',
              plan.highlighted && 'shadow-red-500/30'
            )}
          >
            {plan.buttonText}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="outline"
            className="w-full border-white/[0.12] bg-transparent text-slate-200 hover:border-red-500/50 hover:bg-red-500/10 hover:text-white"
          >
            {plan.buttonText}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </Link>
    </motion.div>
  );
}

/* ───────────────────────── Page Component ───────────────────────── */

export default function PricingPage() {
  return (
    <main className="min-h-screen">
      {/* ───── Section 1: Header ───── */}
      <section className="relative overflow-hidden px-4 pb-8 pt-20 md:px-6 md:pb-12 md:pt-28">
        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/[0.07] blur-[120px]" />

        <div className="mx-auto max-w-4xl text-center">
          <motion.div {...fadeInUp}>
            <Badge
              variant="outline"
              className="mb-6 border-white/[0.1] bg-white/[0.04] px-4 py-1.5 text-slate-300 backdrop-blur-sm"
            >
              <Zap className="mr-1.5 h-3.5 w-3.5 text-red-400" />
              Pricing
            </Badge>
          </motion.div>

          <motion.h1
            {...fadeInUp}
            transition={{ ...fadeInUp.transition, delay: 0.1 }}
            className="mb-4 text-4xl font-extrabold tracking-tight text-slate-100 sm:text-5xl md:text-6xl"
          >
            Simple, Transparent{' '}
            <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              Pricing
            </span>
          </motion.h1>

          <motion.p
            {...fadeInUp}
            transition={{ ...fadeInUp.transition, delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg text-slate-400 md:text-xl"
          >
            Choose a plan that fits your needs. No hidden fees, cancel anytime.
          </motion.p>
        </div>
      </section>

      {/* ───── Section 2: Subscription Plans ───── */}
      <section className="px-4 pb-20 md:px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            {...fadeInUp}
            className="mb-10 text-center"
          >
            <h2 className="mb-2 text-2xl font-bold text-slate-100 md:text-3xl">
              Subscription Plans
            </h2>
            <p className="text-slate-400">
              Monthly packages with everything you need to grow
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid gap-6 md:grid-cols-3 md:gap-8 items-start"
          >
            {plans.map((plan, index) => (
              <PlanCard key={plan.name} plan={plan} index={index} />
            ))}
          </motion.div>

          {/* Auto-renewal note */}
          <motion.p
            {...fadeInUp}
            className="mt-8 text-center text-xs text-slate-500"
          >
            Auto-renewal on selected date. Cancel anytime. No hidden fees.
          </motion.p>
        </div>
      </section>

      {/* ───── Section 3: Per-Service Pricing ───── */}
      <section className="px-4 pb-20 md:px-6">
        <div className="mx-auto max-w-5xl">
          <motion.div {...fadeInUp} className="mb-10 text-center">
            <h2 className="mb-2 text-2xl font-bold text-slate-100 md:text-3xl">
              Per-Service Pricing
            </h2>
            <p className="text-slate-400">
              Need just one thing? Pick individual services a la carte
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {perServices.map((service) => {
              const IconComponent = service.icon;
              return (
                <motion.div key={service.slug} variants={childFadeInUp}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="group flex flex-col gap-4 rounded-xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur-sm transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.05]"
                  >
                    {/* Icon + Title */}
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.06]">
                        <IconComponent
                          className={cn('h-5 w-5', service.iconColor)}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-slate-100 group-hover:text-white transition-colors">
                          {service.title}
                        </h3>
                        <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                          <Clock className="h-3 w-3" />
                          {service.delivery}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-slate-600 transition-colors group-hover:text-red-400" />
                    </div>

                    {/* Pricing row */}
                    <div className="flex items-end justify-between border-t border-white/[0.06] pt-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-500">
                          Starting from
                        </p>
                        <p className="text-lg font-bold text-slate-100">
                          {service.startingPrice}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-wider text-slate-500">
                          Popular
                        </p>
                        <p className="text-sm font-medium text-red-400">
                          {service.popularPlan}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ───── Section 4: FAQ ───── */}
      <section className="px-4 pb-24 md:px-6 md:pb-32">
        <div className="mx-auto max-w-3xl">
          <motion.div {...fadeInUp} className="mb-10 text-center">
            <h2 className="mb-2 text-2xl font-bold text-slate-100 md:text-3xl">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400">
              Everything you need to know about our pricing
            </p>
          </motion.div>

          <motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.1 }}>
            <Accordion
              type="single"
              collapsible
              className="w-full space-y-2"
            >
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-5 backdrop-blur-sm data-[state=open]:border-white/[0.12] data-[state=open]:bg-white/[0.05] transition-colors"
                >
                  <AccordionTrigger className="text-left text-sm font-medium text-slate-200 hover:no-underline hover:text-white py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-slate-400 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            {...fadeInUp}
            transition={{ ...fadeInUp.transition, delay: 0.2 }}
            className="mt-12 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8 text-center backdrop-blur-sm"
          >
            <div className="mb-4 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/20">
                <Shield className="h-6 w-6 text-red-400" />
              </div>
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-100">
              Still have questions?
            </h3>
            <p className="mb-6 text-sm text-slate-400">
              Our team is ready to help you find the perfect plan for your
              channel.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:from-red-400 hover:to-red-500 hover:shadow-red-500/25">
                  Get Started
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="border-white/[0.12] bg-transparent text-slate-300 hover:border-white/[0.2] hover:bg-white/[0.05] hover:text-white"
                >
                  Contact Sales
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}