'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Play,
  Star,
  ArrowRight,
  Sparkles,
  Phone,
  Gift,
  Video,
  Smartphone,
  Palette,
  PenTool,
  BarChart3,
  Wand2,
  Check,
  Zap,
  Search,
  ChevronLeft,
  ChevronRight,
  Quote,
  Users,
  DollarSign,
  Clock,
  TrendingUp,
  FileText,
  MessageCircle,
  Globe,
  ShieldCheck,
  RotateCcw,
  CreditCard,
  ArrowDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

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
    transition: { staggerChildren: 0.08 },
  },
  viewport: { once: true },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true },
  transition: { duration: 0.4, ease: 'easeOut' as const },
};

/* ───────────────────────── Data ───────────────────────── */

const services = [
  {
    icon: Video,
    title: 'YouTube Video Editing',
    price: 'from ৳১,৫০০',
    description: 'Professional long-form video editing with cuts, transitions, music & SFX.',
    gradient: 'from-red-500/20 to-orange-500/20',
    iconColor: 'text-red-400',
  },
  {
    icon: Smartphone,
    title: 'Shorts/Reels Editing',
    price: 'from ৳২,০০০',
    description: 'Viral short-form content with dynamic pacing & trending hooks.',
    gradient: 'from-pink-500/20 to-rose-500/20',
    iconColor: 'text-pink-400',
  },
  {
    icon: Palette,
    title: 'Thumbnail Design',
    price: '⭐ Free Trial',
    description: 'Click-worthy thumbnails that boost CTR by up to 40%.',
    gradient: 'from-violet-500/20 to-purple-500/20',
    iconColor: 'text-violet-400',
    highlight: true,
  },
  {
    icon: PenTool,
    title: 'Script Writing',
    price: 'from ৳৩০০',
    description: 'Research-backed scripts with hooks, storytelling & CTA structures.',
    gradient: 'from-emerald-500/20 to-teal-500/20',
    iconColor: 'text-emerald-400',
  },
  {
    icon: BarChart3,
    title: 'Channel Management',
    price: 'from ৳৮,০০০/মাস',
    description: 'End-to-end channel strategy, SEO, analytics & growth planning.',
    gradient: 'from-amber-500/20 to-yellow-500/20',
    iconColor: 'text-amber-400',
  },
  {
    icon: Wand2,
    title: 'Motion Graphics',
    price: 'Custom Quote',
    description: 'Stunning intros, lower thirds, transitions & animated elements.',
    gradient: 'from-cyan-500/20 to-blue-500/20',
    iconColor: 'text-cyan-400',
  },
];

const projects = [
  { title: 'Tech Review Series', service: 'Video Editing', gradient: 'from-violet-600 via-purple-600 to-fuchsia-600' },
  { title: 'Cooking Channel Revamp', service: 'Thumbnail + Editing', gradient: 'from-rose-600 via-red-600 to-orange-600' },
  { title: 'Educational Shorts', service: 'Shorts Editing', gradient: 'from-emerald-600 via-teal-600 to-cyan-600' },
  { title: 'Fitness Vlog Package', service: 'Full Package', gradient: 'from-amber-600 via-orange-600 to-red-600' },
  { title: 'Travel Documentary', service: 'Motion Graphics', gradient: 'from-sky-600 via-blue-600 to-indigo-600' },
  { title: 'Podcast Channel Launch', service: 'Channel Management', gradient: 'from-pink-600 via-rose-600 to-red-600' },
];

const fallbackReviews = [
  {
    name: 'Rakib Hossain',
    avatar: 'RH',
    service: 'Video Editing',
    rating: 5,
    text: 'CGA এর কাজের মান অসাধারণ! আমার channel-এর views 3x বেড়েছে মাত্র ২ মাসে। Editing quality এবং delivery time — দুটোই best।',
  },
  {
    name: 'Fatema Akter',
    avatar: 'FA',
    service: 'Thumbnail Design',
    rating: 5,
    text: 'Thumbnail-এর কারণে CTR 35% বেড়েছে! প্রতিটা thumbnail একদম pixel-perfect এবং clickable। Highly recommended! 🎨',
  },
  {
    name: 'Sakib Ahmed',
    avatar: 'SA',
    service: 'Channel Management',
    rating: 5,
    text: 'Subscription plan নিয়েছি — best decision ever! এখন শুধু content করি, বাকি সব CGA handle করে। Revenue 5x হয়েছে!',
  },
  {
    name: 'Nusrat Jahan',
    avatar: 'NJ',
    service: 'Shorts Editing',
    rating: 5,
    text: 'Shorts-এর editing style একদম trending! আমার একটা Shorts 2M views পেয়েছে। Pacing এবং hooks একদম perfect।',
  },
  {
    name: 'Imran Khan',
    avatar: 'IK',
    service: 'Script Writing',
    rating: 5,
    text: 'Script writing-এ ওরা একদম master! Research depth এবং storytelling structure দেখে অবাক। Every script is a hit!',
  },
  {
    name: 'Tanjina Islam',
    avatar: 'TI',
    service: 'Full Package',
    rating: 5,
    text: 'Full package নিয়েছি — editing, thumbnail, script সব। এক জায়গায় সব পাচ্ছি, কোনো tension নেই। অসাধারণ service!',
  },
];

type DisplayReview = {
  name: string;
  avatar: string;
  service: string;
  rating: number;
  text: string;
};

const plans = [
  {
    name: 'Starter',
    price: '৳৮,০০০',
    period: '/মাস',
    description: 'Perfect for growing creators',
    features: [
      '8 Video Edits/month',
      '4 Thumbnail Designs',
      'Basic SEO Optimization',
      '48h Delivery',
      '2 Revisions per video',
    ],
    cta: 'শুরু করুন',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '৳১৮,০০০',
    period: '/মাস',
    description: 'For serious content creators',
    features: [
      '20 Video Edits/month',
      '10 Thumbnail Designs',
      'Full Channel SEO',
      '24h Priority Delivery',
      'Unlimited Revisions',
      'Script Writing (5/month)',
      'Dedicated Account Manager',
    ],
    cta: 'Pro নিন 🔥',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: '৳৪০,০০০',
    period: '/মাস',
    description: 'For channels ready to scale',
    features: [
      'Unlimited Video Edits',
      'Unlimited Thumbnails',
      'Complete Channel Strategy',
      '12h Express Delivery',
      'Unlimited Everything',
      'Dedicated Team (3 members)',
      'Weekly Analytics Report',
      'Priority Support 24/7',
    ],
    cta: 'Contact করুন',
    highlighted: false,
  },
];

const faqs = [
  {
    question: 'কিভাবে অর্ডার করবো? / How do I place an order?',
    answer: 'ওয়েবসাইটে থাকা CTA বাটনে ক্লিক করুন অথবা সরাসরি WhatsApp-এ মেসেজ করুন। আমাদের টিম ৩০ মিনিটের মধ্যে আপনার সাথে যোগাযোগ করবে এবং আপনার requirement অনুযায়ী কাজ শুরু করবে।',
  },
  {
    question: 'ডেলিভারি কত সময় লাগে? / How long does delivery take?',
    answer: 'সাধারণ ভিডিও এডিটিং ২৪-৪৮ ঘন্টার মধ্যে ডেলিভারি দেওয়া হয়। Thumbnail ১২ ঘন্টার মধ্যে এবং Script ৬ ঘন্টার মধ্যে ডেলিভারি হয়। Subscription client-রা Priority delivery পান — ১২-২৪ ঘন্টার মধ্যে।',
  },
  {
    question: 'রিভিশন কি ফ্রি? / Is revision free?',
    answer: 'হ্যাঁ! প্রতিটি অর্ডারে ২টি ফ্রি revision আছে। Pro এবং Enterprise plan-এ unlimited revisions আছে। আমরা চাই আপনি ১০০% satisfied হোন।',
  },
  {
    question: 'পেমেন্ট কিভাবে করবো? / How do I pay?',
    answer: 'bKash, Nagad, Rocket, Bank Transfer — সব পেমেন্ট মেথড সাপোর্ট করি। International client-রা PayPal এবং Wise-এ পেমেন্ট করতে পারবেন। Subscription plan-এ auto-billing সুবিধাও আছে।',
  },
  {
    question: 'ফ্রি ট্রায়াল কিভাবে পাবো? / How do I get the free trial?',
    answer: 'খুব সহজ! উপরে থাকা "ফ্রি Thumbnail নিন" বাটনে ক্লিক করুন, আপনার channel link দিন, এবং ২৪ ঘন্টার মধ্যে ১টি professional thumbnail ফ্রি পেয়ে যাবেন। কোনো credit card লাগবে না!',
  },
  {
    question: 'আন্তর্জাতিক client কি অর্ডার করতে পারবে? / Can international clients order?',
    answer: 'অবশ্যই! আমরা সারা বিশ্ব থেকে client নিই। PayPal এবং Wise-এ পেমেন্ট সুবিধা আছে। English এবং Bengali — দুই ভাষাতেই communication করা যায়। Delivery time international client-দের জন্যও same।',
  },
  {
    question: 'রিফান্ড পলিসি কি? / What is the refund policy?',
    answer: 'যদি আমাদের কাজে আপনি satisfied না হন, তাহলে revision-এর পরেও full refund পাবেন। আমাদের ১০০% Money-Back Guarantee আছে। আপনার satisfaction আমাদের প্রথম priority।',
  },
];

/* ───────────────────────── Helper: Section Heading ───────────────────────── */

function SectionHeading({
  title,
  subtitle,
  badge,
  align = 'center',
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  align?: 'center' | 'left';
}) {
  return (
    <motion.div
      className={`mb-12 md:mb-16 ${align === 'center' ? 'text-center' : 'text-left'}`}
      {...fadeInUp}
    >
      {badge && (
        <span className="inline-block mb-4 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-violet-300 bg-violet-500/10 border border-violet-500/20 rounded-full">
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-100 tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

/* ───────────────────────── Page Component ───────────────────────── */

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [currentReview, setCurrentReview] = useState(0);
  const [channelLink, setChannelLink] = useState('');
  const [reviews, setReviews] = useState<DisplayReview[]>(fallbackReviews);
  const reviewTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Fetch featured reviews from API on mount */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/reviews?featured=true&limit=6');
        if (res.ok) {
          const data = await res.json();
          if (data.reviews && data.reviews.length > 0) {
            const mapped: DisplayReview[] = data.reviews.map((r: { user: { name: string } | null; stars: number; comment: string | null; order: { serviceType: string; packageName: string | null } | null }) => ({
              name: r.user?.name || 'Anonymous',
              avatar: (r.user?.name || 'A').split(' ').map((w: string) => w.charAt(0)).join('').slice(0, 2).toUpperCase(),
              service: r.order?.packageName || (r.order?.serviceType || '').replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
              rating: r.stars,
              text: r.comment || 'Great service!',
            }));
            setReviews(mapped);
          }
        }
      } catch { /* silently fall back to hardcoded */ }
    })();
  }, []);

  /* Auto-scroll reviews */
  const startReviewTimer = useCallback(() => {
    if (reviewTimerRef.current) clearInterval(reviewTimerRef.current);
    reviewTimerRef.current = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 5000);
  }, [reviews.length]);

  useEffect(() => {
    startReviewTimer();
    return () => {
      if (reviewTimerRef.current) clearInterval(reviewTimerRef.current);
    };
  }, [startReviewTimer]);

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
    startReviewTimer();
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
    startReviewTimer();
  };

  return (
    <main className="min-h-screen bg-[#080E1A] text-slate-100 overflow-x-hidden">
      {/* ───────────── 1. HERO SECTION ───────────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center px-4 md:px-6 overflow-hidden"
      >
        {/* Animated gradient mesh background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[#080E1A]" />
          <div className="hero-gradient-mesh absolute inset-0 opacity-40" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[128px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px]" />
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="max-w-5xl mx-auto text-center z-10">
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-violet-300 bg-violet-500/15 border border-violet-500/30 rounded-full backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-400" />
              </span>
              🎬 Free Trial Available
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            className="mt-8 text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[1.1] tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="text-slate-100">YouTube Channel কে</span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              10x Growth
            </span>{' '}
            <span className="text-slate-100">দিচ্ছি</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="mt-6 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            Video Editing + Thumbnail + Script + Shorts — সব এক জায়গায়
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Button
              size="lg"
              className="relative group h-13 px-8 text-base font-semibold bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-full shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:shadow-[0_0_50px_rgba(239,68,68,0.5)] transition-all duration-300 cursor-pointer"
            >
              <Gift className="w-5 h-5" />
              ফ্রি Thumbnail নিন
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-13 px-8 text-base font-semibold rounded-full border-white/20 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white backdrop-blur-sm transition-all duration-300 cursor-pointer"
            >
              <Phone className="w-5 h-5" />
              ফ্রি Call Book করুন
            </Button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-slate-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.65 }}
          >
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-500" />
              No Credit Card Needed
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-500" />
              24h Delivery
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-500" />
              100% Satisfaction
            </span>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <button
            className="flex flex-col items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            onClick={() =>
              document
                .getElementById('social-proof')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
            aria-label="Scroll down"
          >
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <ChevronDown className="w-5 h-5" />
          </button>
        </motion.div>
      </section>

      {/* ───────────── 2. SOCIAL PROOF BAR ───────────── */}
      <section id="social-proof" className="relative py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <motion.div
            className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8"
            {...fadeInUp}
          >
            {[
              { icon: Users, label: '1,200+ Creators ✅', color: 'text-violet-400' },
              { icon: DollarSign, label: '৳4,82,000+ Revenue', color: 'text-emerald-400' },
              { icon: Star, label: '⭐ 4.9/5 Rating', color: 'text-amber-400' },
              { icon: Zap, label: '48h Delivery ⚡', color: 'text-red-400' },
            ].map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-3">
                {i > 0 && (
                  <div className="hidden md:block w-px h-10 bg-white/10 mx-8" />
                )}
                <div className="flex items-center gap-3">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  <span className="text-slate-200 font-semibold text-sm md:text-base whitespace-nowrap">
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───────────── 3. FREE TRIAL HIGHLIGHT ───────────── */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <motion.div
            className="relative overflow-hidden rounded-3xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-transparent backdrop-blur-xl p-8 md:p-12"
            {...scaleIn}
          >
            {/* Glow effect */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-violet-500/20 rounded-full blur-[100px]" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/15 rounded-full blur-[80px]" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 text-center md:text-left">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 text-sm font-semibold text-violet-300 bg-violet-500/15 rounded-full"
                >
                  <Gift className="w-4 h-4" />
                  New Client Offer
                </motion.div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-100">
                  🎁 নতুন Client? এখনই ফ্রি শুরু করুন!
                </h3>
                <p className="mt-3 text-lg text-slate-300">
                  ১টা Professional Thumbnail সম্পূর্ণ বিনামূল্যে
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  (Value: ৳৩০০ — No Credit Card Needed)
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="h-13 px-8 text-base font-semibold bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-500 hover:to-purple-400 text-white rounded-full shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_50px_rgba(139,92,246,0.5)] transition-all duration-300 cursor-pointer"
                >
                  ফ্রি Thumbnail নিন
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  className="text-slate-400 hover:text-slate-200 rounded-full cursor-pointer"
                >
                  How it works?
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ───────────── 4. SERVICES GRID ───────────── */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <SectionHeading
            badge="Our Services"
            title="আপনার Channel-এর জন্য সব কিছু"
            subtitle="এক জায়গায় সব YouTube growth service — editing থেকে strategy পর্যন্ত"
          />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {services.map((service) => (
              <motion.div
                key={service.title}
                variants={fadeInUp}
                className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:border-violet-500/40 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] cursor-pointer"
              >
                {/* Highlight badge */}
                {service.highlight && (
                  <div className="absolute top-4 right-4 px-3 py-1 text-xs font-bold text-violet-300 bg-violet-500/20 border border-violet-500/30 rounded-full">
                    Free Trial
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} mb-5`}
                >
                  <service.icon className={`w-7 h-7 ${service.iconColor}`} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-100 mb-2">
                  {service.title}
                </h3>

                {/* Price */}
                <p className="text-sm font-semibold text-violet-400 mb-3">
                  {service.price}
                </p>

                {/* Description */}
                <p className="text-sm text-slate-400 leading-relaxed mb-5">
                  {service.description}
                </p>

                {/* Link */}
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 group-hover:text-violet-400 transition-colors">
                  Details
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───────────── 5. PROJECTS GALLERY ───────────── */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12 md:mb-16">
            <SectionHeading
              badge="Portfolio"
              title="Our Recent Work"
              subtitle="আমাদের client-দের জন্য করা কিছু recent project"
              align="left"
            />
            <motion.button
              className="inline-flex items-center gap-2 text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors self-start md:self-auto cursor-pointer"
              {...fadeInUp}
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {projects.map((project) => (
              <motion.div
                key={project.title}
                variants={fadeInUp}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-violet-500/30 cursor-pointer"
              >
                {/* Thumbnail placeholder */}
                <div
                  className={`relative aspect-video bg-gradient-to-br ${project.gradient} overflow-hidden`}
                >
                  {/* Pattern overlay */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 1px, transparent 1px)`,
                      backgroundSize: '20px 20px',
                    }}
                  />
                  {/* Play icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                      <Play className="w-7 h-7 text-white fill-white ml-1" />
                    </div>
                  </div>
                  {/* Service type badge */}
                  <div className="absolute top-3 left-3 px-3 py-1 text-xs font-medium text-white/90 bg-black/40 backdrop-blur-sm rounded-full">
                    {project.service}
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                      Watch
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
                {/* Info */}
                <div className="p-4">
                  <h3 className="text-base font-semibold text-slate-100 group-hover:text-violet-300 transition-colors">
                    {project.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───────────── 6. REVIEWS CAROUSEL ───────────── */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <SectionHeading
            badge="Testimonials"
            title="What Creators Say"
            subtitle="আমাদের client-দের মতামত — real reviews from real creators"
          />

          {/* Rating summary */}
          <motion.div
            className="flex items-center justify-center gap-3 mb-10"
            {...fadeInUp}
          >
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 text-amber-400 fill-amber-400"
                />
              ))}
            </div>
            <span className="text-slate-300 font-semibold">4.9/5</span>
            <span className="text-slate-500">from 1,200+ reviews</span>
          </motion.div>

          {/* Reviews carousel */}
          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentReview}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12"
              >
                {/* Quote icon */}
                <Quote className="w-10 h-10 text-violet-500/30 mb-6" />

                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(reviews[currentReview].rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-lg md:text-xl text-slate-200 leading-relaxed mb-8">
                  &ldquo;{reviews[currentReview].text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {reviews[currentReview].avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-100">
                      {reviews[currentReview].name}
                    </p>
                    <span className="inline-block mt-1 px-3 py-0.5 text-xs font-medium text-violet-300 bg-violet-500/15 rounded-full">
                      {reviews[currentReview].service}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prevReview}
                className="w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {/* Dots */}
              <div className="flex gap-2">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentReview(i);
                      startReviewTimer();
                    }}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      i === currentReview
                        ? 'w-8 bg-violet-500'
                        : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                    aria-label={`Go to review ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={nextReview}
                className="w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
                aria-label="Next review"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── 7. SUBSCRIPTION PLANS ───────────── */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <SectionHeading
            badge="Pricing"
            title="Monthly Plans for Serious Creators"
            subtitle="আপনার channel-এর growth stage অনুযায়ী plan বেছে নিন"
          />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {plans.map((plan) => (
              <motion.div
                key={plan.name}
                variants={fadeInUp}
                className={`relative overflow-hidden rounded-3xl p-8 md:p-10 flex flex-col transition-all duration-300 ${
                  plan.highlighted
                    ? 'bg-gradient-to-b from-violet-500/15 via-purple-500/10 to-transparent border-2 border-violet-500/50 shadow-[0_0_40px_rgba(139,92,246,0.15)]'
                    : 'bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20'
                }`}
              >
                {/* Popular badge */}
                {plan.highlighted && (
                  <div className="absolute top-0 right-8">
                    <div className="bg-gradient-to-r from-violet-600 to-purple-500 text-white text-xs font-bold px-4 py-1.5 rounded-b-lg">
                      🔥 Most Popular
                    </div>
                  </div>
                )}

                {/* Plan name */}
                <h3 className="text-xl font-bold text-slate-100 mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-slate-500 mb-6">{plan.description}</p>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl md:text-5xl font-extrabold text-slate-100">
                    {plan.price}
                  </span>
                  <span className="text-slate-500">{plan.period}</span>
                </div>

                {/* Features */}
                <ul className="flex-1 space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-slate-300"
                    >
                      <Check
                        className={`w-4 h-4 mt-0.5 shrink-0 ${
                          plan.highlighted ? 'text-violet-400' : 'text-emerald-400'
                        }`}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  className={`w-full h-12 text-base font-semibold rounded-xl transition-all duration-300 cursor-pointer ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-500 hover:to-purple-400 text-white shadow-[0_0_25px_rgba(139,92,246,0.3)] hover:shadow-[0_0_40px_rgba(139,92,246,0.5)]'
                      : 'bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10'
                  }`}
                >
                  {plan.cta}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───────────── 8. FREE AUDIT CTA ───────────── */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <motion.div
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600/20 via-purple-600/15 to-fuchsia-600/10 border border-violet-500/30 p-8 md:p-16"
            {...scaleIn}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/15 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-purple-500/10 rounded-full blur-[100px]" />

            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <motion.div {...fadeInUp}>
                <span className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-violet-300 bg-violet-500/15 rounded-full border border-violet-500/20">
                  <Search className="w-3.5 h-3.5" />
                  Free Channel Audit
                </span>
              </motion.div>

              <motion.h2
                className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-100 mb-4"
                {...fadeInUp}
              >
                📊 ফ্রি YouTube Channel
                <br />
                Audit নিন
              </motion.h2>

              <motion.p
                className="text-slate-400 text-base md:text-lg mb-8"
                {...fadeInUp}
              >
                আপনার channel-এর weaknesses এবং growth opportunities খুঁজে বের করুন —
                completely free!
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
                {...fadeInUp}
              >
                <Input
                  type="url"
                  placeholder="আপনার Channel Link দিন..."
                  value={channelLink}
                  onChange={(e) => setChannelLink(e.target.value)}
                  className="h-12 bg-white/5 border-white/15 text-slate-200 placeholder:text-slate-500 rounded-xl focus:border-violet-500/50 focus:ring-violet-500/20"
                />
                <Button
                  size="lg"
                  className="h-12 px-8 text-base font-semibold bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-500 hover:to-purple-400 text-white rounded-xl shadow-[0_0_25px_rgba(139,92,246,0.3)] hover:shadow-[0_0_40px_rgba(139,92,246,0.5)] transition-all duration-300 shrink-0 cursor-pointer"
                >
                  Audit নিন
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ───────────── 9. FAQ ACCORDION ───────────── */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <SectionHeading
            badge="FAQ"
            title="সচরাচর জিজ্ঞাসা"
            subtitle="আপনার প্রশ্নের উত্তর এখানে পাবেন"
          />

          <motion.div {...fadeInUp}>
            <Accordion
              type="single"
              collapsible
              className="space-y-3"
            >
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 overflow-hidden data-[state=open]:border-violet-500/30 data-[state=open]:bg-violet-500/5 transition-colors"
                >
                  <AccordionTrigger className="text-base md:text-lg font-semibold text-slate-200 hover:text-white hover:no-underline py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400 text-sm md:text-base leading-relaxed pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* ───────────── Inline styles for animations ───────────── */}
      <style jsx global>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .hero-gradient-mesh {
          background: linear-gradient(
            135deg,
            rgba(139, 92, 246, 0.08) 0%,
            rgba(168, 85, 247, 0.12) 25%,
            rgba(239, 68, 68, 0.06) 50%,
            rgba(139, 92, 246, 0.1) 75%,
            rgba(168, 85, 247, 0.08) 100%
          );
          background-size: 400% 400%;
          animation: gradient-shift 12s ease infinite;
        }

        /* Custom scrollbar for glass cards */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </main>
  );
}