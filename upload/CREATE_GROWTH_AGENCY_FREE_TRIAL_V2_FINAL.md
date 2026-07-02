# CREATE GROWTH AGENCY
## FREE TRIAL EDITION — MASTER SPECIFICATION
### Version: FREE-TRIAL-V2.0 FINAL
**Date:** 2026 | **Status:** Production Ready Blueprint — Zero Budget Launch
**Prepared for:** Developer Team — Word by Word Implementation

---

> **"ভাই এই ডকুমেন্ট প্রিন্ট করে সামনে রেখে কোড করো। ১ লাইনও skip করবে না।"**
> এই V2.0 ভার্সনে যোগ হয়েছে: Free AI Integration, 2-Level Referral, Page Builder, Multi-Country + Multi-Language, Global Payment, Redesigned Dashboard, Service Architecture, Badge System সম্পূর্ণ।

---

## TABLE OF CONTENTS

1. Free Trial Strategy
2. Budget Breakdown — Zero Cost Path
3. Tech Stack — Free-First Final
4. Design System — Color, Font, UI Rules (সম্পূর্ণ)
5. Psychological UX Strategy
6. Free AI Integration — Gemini, Grok, OpenAI (Free Tiers)
7. Multi-Country + Multi-Language System
8. Public Website — All Pages (সম্পূর্ণ)
9. Service Architecture — সঠিক Structure
10. Subscription Model vs One-Time Service — পার্থক্য ও Flow
11. User Dashboard — Redesigned (V2)
12. Badge + Level System — সম্পূর্ণ নিয়ম
13. Admin Panel — সব Features সহ
14. Page Builder (Admin) — সম্পূর্ণ Spec
15. Staff Panel
16. All Services — Complete Details
17. Payment System — Local + International
18. Referral System — 2-Level (V1), 3-Level (V2)
19. Notification System
20. Database Schema — সম্পূর্ণ
21. API Endpoints
22. Security System
23. SEO & Analytics
24. PWA Specification
25. Community/Blog Section
26. V2 & V3 Roadmap
27. Developer Checklist + Env Variables

---

## PART 1: FREE TRIAL STRATEGY

### কেন "Free Trial" ব্র্যান্ড করা হচ্ছে?
প্রথম ৩০ দিন নতুন client দের জন্য ১টা ছোট service বিনামূল্যে দেওয়া হবে।
- Client trust build হবে দ্রুত
- Testimonial আগেই পাওয়া যাবে (Social Proof)
- Referral শুরু হবে দ্রুত
- Paid order convert rate ৬০%+ হবে

### Free Trial অফার:
```
নতুন Client? → ১টা Professional Thumbnail সম্পূর্ণ ফ্রি!
(মূল্য ৳৩০০ — কোনো Credit Card দরকার নেই)
— অথবা —
ফ্রি YouTube Channel Audit (মূল্য ৳২,০০০)
```

### Free Trial Rules:
- প্রতি account এ একবারই পাওয়া যাবে (DB: `is_free_trial_used = true`)
- Email + Phone verify করার পরেই activate হবে
- Delivered → Rating prompt → Convert to paid

---

## PART 2: BUDGET BREAKDOWN — ZERO COST PATH

### মাসিক খরচ (১,০০০ User এর নিচে):

| Service | Paid Option | Free Alternative | বার্ষিক সাশ্রয় |
|---|---|---|---|
| Frontend | Vercel Pro $20/mo | **Vercel Hobby** ✅ | ৳২৬,৪০০ |
| Backend | AWS EC2 $33/mo | **Railway.app Free** ✅ | ৳৪৩,৫৬০ |
| Database | AWS RDS $15/mo | **Supabase Free** (500MB) ✅ | ৳১৯,৮০০ |
| Redis | ElastiCache $13/mo | **Upstash Redis Free** ✅ | ৳১৭,১৬০ |
| File Storage | R2 paid | **R2 Free** (10GB) ✅ | ~ফ্রি |
| Email | Resend $20/mo | **Resend Free** (3K/mo) ✅ | ৳২৬,৪০০ |
| Search | MeiliSearch $30/mo | **PostgreSQL FTS** ✅ | ৳৩৯,৬০০ |
| Error Track | Sentry Paid | **Sentry Free** (5K) ✅ | ৳৩৪,৩২০ |
| Heatmap | Hotjar $32/mo | **Microsoft Clarity** ✅ | ৳৪২,২৪০ |
| AI (Order) | OpenAI GPT-4 | **Gemini Free API** ✅ | ৳৩০,০০০+ |
| WhatsApp | Meta API | **Fonnte** ৳৫০০/মাস | ৳৪,৮০০ |
| **মোট** | **~$196/মাস** | **~৳৫০০/মাস** | **৳২ লাখ+** |

### একবারের খরচ:
| Item | খরচ |
|---|---|
| Domain (.com) | ৳১,৫০০/বছর |
| SSL | **ফ্রি** (Cloudflare) |
| SSLCOMMERZ Registration | **ফ্রি** |
| bKash Merchant | **ফ্রি** |
| Google Analytics + Clarity | **ফ্রি** |

---

## PART 3: TECH STACK — FREE-FIRST FINAL

### Frontend
| Layer | Technology | বিকল্প নেই কারণ |
|---|---|---|
| Framework | **Next.js 14 App Router** | SSR + SEO + Performance |
| Language | **TypeScript** | Type safety |
| Styling | **Tailwind CSS** | Fast dev |
| Animation | **Framer Motion** | Smooth UI |
| State | **Zustand + TanStack Query** | Best combo |
| Forms | **React Hook Form + Zod** | Validation |
| Charts | **Recharts** | Free, good |
| Icons | **Lucide React** | Clean |
| Toast | **Sonner** | Better than react-hot-toast |
| Date | **Day.js** | Lightweight |
| Table | **TanStack Table v8** | Powerful |
| Upload | **Uppy** | Direct R2 |
| Rich Text | **Tiptap** | Page Builder |
| i18n | **next-intl** | Multi-language |
| Country Detection | **@maxmind/geoip2-node** | IP based |

### Backend
| Layer | Technology |
|---|---|
| Framework | **NestJS** |
| ORM | **Prisma** |
| Database | **PostgreSQL** (Supabase Free) |
| Cache | **Upstash Redis** |
| Queue | **BullMQ + Upstash** |
| Files | **Cloudflare R2** |
| Email | **Resend** (Free 3K/mo) |
| WhatsApp | **Fonnte API** |
| AI | **Google Gemini Free API** (Primary) + Grok Free (Backup) |
| Search | **PostgreSQL Full-Text Search** |

### Mobile
> ❌ React Native — V2 তে
> ✅ **PWA** — এখন (Zero cost, instant install)

### Payment (Local + International)
| Provider | Use Case | Country |
|---|---|---|
| **SSLCOMMERZ** | bKash + Nagad + Card | Bangladesh |
| **bKash Merchant** | Direct bKash | Bangladesh |
| **Stripe** | Card, Apple Pay, Google Pay | Global |
| **PayPal** | PayPal balance/card | Global |
| **Wise** | Bank transfer | UK/US/EU |

> Note: Stripe + PayPal → V1 তেই setup করো (free account)। International client আসতে পারে।

### Infrastructure
| Service | Provider | Free Limit |
|---|---|---|
| Frontend | **Vercel Hobby** | Unlimited |
| Backend | **Railway.app** | 500 CPU hrs/mo |
| Database | **Supabase** | 500MB |
| Redis | **Upstash** | 10K cmd/day |
| Files | **Cloudflare R2** | 10GB + 1M reads |
| DNS + SSL | **Cloudflare Free** | Unlimited |
| Monitoring | **Sentry Free** | 5K errors |
| Analytics | **GA4 + Clarity** | Free |
| Uptime | **UptimeRobot** | Free |

### Auth
| Feature | Implementation |
|---|---|
| User Auth | **NextAuth.js + JWT** |
| Social Login | **Google OAuth** (V1 তেই রাখো) |
| Admin Auth | **JWT + TOTP** (Google Authenticator) |
| Session | **Upstash Redis** |

---

## PART 4: বাদ দেওয়া Features (V1 এ দরকার নেই)

| Feature | কেন বাদ | কখন |
|---|---|---|
| React Native App | PWA চলবে | V2 |
| 3-Level Referral | 2-Level আগে stable করো | V2 |
| MeiliSearch | PostgreSQL FTS যথেষ্ট | V2 |
| AWS EC2/RDS | Railway + Supabase free | 5K+ user |
| Timelapse Work Proof | Complex, V2 | V2 |
| Auto Salary Calculator | ম্যানুয়াল এখন | V2 |
| White Label Delivery | দরকার নেই এখন | V2 |
| Enterprise API | কেউ চাইবে না এখন | V3 |
| Community/Blog Post Feature | Static blog এখন | V1.5 |

---

## PART 5: নতুন Features (V2.0 তে Add)

1. ✅ **Free AI (Gemini + Grok)** — AI Order Assistant বিনামূল্যে
2. ✅ **2-Level Referral** — Direct + Indirect commission
3. ✅ **Page Builder (Admin)** — Dynamic page content edit
4. ✅ **Multi-Country + Language** — IP detect → UI language adapt
5. ✅ **Global Payment** — Stripe + PayPal add
6. ✅ **Dashboard V2** — Redesigned per তোমার design
7. ✅ **Badge System** — Level badges + earned badges
8. ✅ **Service Sub-Page Architecture** — Proper click flow
9. ✅ **Subscription Model Clarity** — One-time vs Monthly আলাদা
10. ✅ **Smart Recommender (AI-Free + AI)** — Dual mode
11. ✅ **Announcement Banner** — Admin controlled
12. ✅ **WhatsApp wa.me Quick Order** — Zero backend
13. ✅ **Email Sequence (BullMQ)** — Automated follow-ups
14. ✅ **Community Section (Basic)** — Blog post + future posts

---

## PART 6: FREE AI INTEGRATION — Gemini, Grok

### কেন Free AI?
OpenAI GPT-4 = $0.01/1K tokens → মাসে ১০০০ conversation = ~$10-30
Google Gemini Free API = 15 RPM, 1M tokens/day = **সম্পূর্ণ ফ্রি**
Grok Free (xAI) = Free tier আছে = **ব্যাকআপ হিসেবে ব্যবহার**

### Primary: Google Gemini Free API
```javascript
// npm install @google/generative-ai
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function getOrderSuggestion(userMessage: string, serviceContext: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Free tier
  
  const prompt = `You are a helpful sales assistant for Create Growth Agency — a YouTube content creation service in Bangladesh. 
Context: User is looking at ${serviceContext} service.
Price List:
- YouTube Editing: Basic ৳1,500 | Standard ৳4,000 | Premium ৳8,000
- Thumbnail Design: 3pcs ৳600 | 10pcs ৳1,500 | Monthly ৳4,000
- Script Writing: Shorts ৳300 | YouTube ৳1,500
- Shorts Editing: 10pcs ৳2,000 | 30pcs ৳5,000 | 60pcs ৳9,000
- Channel Management: Starter ৳8,000/mo | Growth ৳20,000/mo | Pro ৳40,000/mo

Reply in the same language the user writes (Bengali/Banglish/English).
Keep reply short (2-3 lines). Always suggest a specific package. Mention savings if bundle available.
User said: "${userMessage}"`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
```

### Fallback: Grok Free API (xAI)
```javascript
// Grok API — similar to OpenAI format
const response = await fetch("https://api.x.ai/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.GROK_API_KEY}`
  },
  body: JSON.stringify({
    model: "grok-3-mini",  // Free tier
    messages: [{ role: "user", content: prompt }],
    max_tokens: 200
  })
});
```

### AI Routing Logic (BullMQ Queue):
```javascript
async function getAIReply(message: string, context: string): Promise<string> {
  try {
    // Primary: Gemini Free
    return await getGeminiReply(message, context);
  } catch (geminiError) {
    try {
      // Fallback: Grok Free
      return await getGrokReply(message, context);
    } catch (grokError) {
      // Final fallback: Rule-based (always works)
      return getRuleBasedSuggestion(message, context);
    }
  }
}
```

### Rule-Based Fallback (No API):
```javascript
function getRuleBasedSuggestion(msg: string, service: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes('short') || lower.includes('reel')) {
    return 'Shorts Editing Starter Pack (10 pcs ৳2,000) দিয়ে শুরু করুন! Express delivery +৳300।';
  }
  if (lower.includes('thumbnail')) {
    return '3 pcs Basic Pack ৳600 — নতুন হলে ১টা ফ্রি! 24h delivery।';
  }
  if (parseInt(msg) <= 5) {
    return 'Basic Package ৳1,500 — আপনার ৫ মিনিটের ভিডিওর জন্য যথেষ্ট। 72h delivery।';
  }
  return 'Standard Package ৳4,000 recommend করছি — সবচেয়ে popular choice! 48h delivery।';
}
```

### AI Widget UI (সব Service Page + Homepage):
```
┌────────────────────────────────────────┐
│ 🤖 AI Assistant                    ✕  │
│ ────────────────────────────────────  │
│ Assalamu Alaikum! কি ধরনের            │
│ সার্ভিস দরকার বলুন — সেরা            │
│ package suggest করব।                  │
│                                        │
│ [আপনার message লিখুন_____________]  │
│                                   [→] │
│ ────────────────────────────────────  │
│ Powered by Gemini AI  ✨              │
└────────────────────────────────────────┘
```

### Env Variables (AI):
```bash
GEMINI_API_KEY=AIzaSy...    # Google AI Studio থেকে (free)
GROK_API_KEY=xai-...        # console.x.ai থেকে (free tier)
AI_PRIMARY=gemini            # gemini | grok | rule-based
```

---

## PART 7: MULTI-COUNTRY + MULTI-LANGUAGE SYSTEM

### Strategy: "English First, Localized Touch"
সব UI English এ থাকবে। কিন্তু:
- বাংলাদেশ IP → বাংলা CTAs + Bengali emotional words
- India IP → "Bhai" টাইপ Hinglish words + INR option
- UK/US IP → Full English, clean professional tone
- অন্যান্য → English default

### Supported Languages/Locales:
| Code | Language | কোন দেশের জন্য |
|---|---|---|
| `en` | English | UK, US, Canada, Australia, Global Default |
| `bn` | বাংলা + English Mix | Bangladesh |
| `en-IN` | English (India) | India |
| `ar` | Arabic | Middle East (V2 তে) |

### Implementation: next-intl
```
/messages/
  en.json     → Default English
  bn.json     → Bangla mix (Bangladesh)
  en-IN.json  → India English
```

### Example Translation Files:

**en.json (Global Default):**
```json
{
  "hero": {
    "title": "We Grow Your YouTube Channel 10x",
    "subtitle": "Video Editing + Thumbnail + Script + Shorts — All in One Place",
    "cta_primary": "Get Free Thumbnail",
    "cta_secondary": "Book Free Call"
  },
  "social_proof": {
    "creators": "1,200+ Creators",
    "rating": "4.9/5 Rating",
    "delivery": "48h Delivery"
  },
  "nav": {
    "services": "Services",
    "projects": "Projects",
    "reviews": "Reviews",
    "login": "Login",
    "free_trial": "Get Free Thumbnail →"
  }
}
```

**bn.json (Bangladesh):**
```json
{
  "hero": {
    "title": "YouTube Channel কে 10x Growth দিচ্ছি",
    "subtitle": "Video Editing + Thumbnail + Script + Shorts — সব এক জায়গায়",
    "cta_primary": "ফ্রি Thumbnail নিন",
    "cta_secondary": "ফ্রি Call Book করুন"
  },
  "social_proof": {
    "creators": "১,২০০+ Happy Creators",
    "rating": "⭐ ৪.৯/৫ Rating",
    "delivery": "৪৮ ঘণ্টায় Delivery"
  },
  "nav": {
    "services": "সার্ভিস",
    "projects": "Projects",
    "reviews": "Reviews",
    "login": "Login",
    "free_trial": "ফ্রি Thumbnail নিন →"
  }
}
```

### Country Detection + Auto Language:
```javascript
// middleware.ts (Next.js)
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Check user's saved preference (cookie)
  const savedLocale = request.cookies.get('locale')?.value;
  if (savedLocale) return setLocale(request, savedLocale);
  
  // 2. Detect from IP (Cloudflare CF-IPCountry header — free)
  const country = request.headers.get('CF-IPCountry') || 'US';
  
  const localeMap: Record<string, string> = {
    'BD': 'bn',    // Bangladesh → Bangla mix
    'IN': 'en-IN', // India → Indian English
    'GB': 'en',    // UK → English
    'US': 'en',    // US → English
    'CA': 'en',    // Canada → English
    'AU': 'en',    // Australia → English
    // default → 'en'
  };
  
  const locale = localeMap[country] || 'en';
  return setLocale(request, locale);
}
```

### Country Selector UI (Navbar):
```
Flag Dropdown (top-right navbar):
🌍 [🇧🇩 বাংলাদেশ ▼]

Options:
🇧🇩 বাংলাদেশ (BDT ৳)
🇬🇧 United Kingdom (GBP £)
🇺🇸 United States (USD $)
🇮🇳 India (INR ₹)
🌍 Other (USD $)

→ Selection saves in cookie + localStorage
→ UI language + currency + payment methods change accordingly
```

### Currency Display per Country:
```javascript
// BD → ৳ (BDT) → Local payment (bKash, Nagad, SSLCOMMERZ)
// UK/US/Global → $ or £ (USD/GBP) → Stripe / PayPal
// IN → ₹ (INR) → Stripe India / UPI (V2)

const priceDisplay = {
  BD:  { symbol: '৳',  multiplier: 1,      payment: ['sslcommerz', 'bkash', 'nagad'] },
  US:  { symbol: '$',  multiplier: 0.0091,  payment: ['stripe', 'paypal'] },
  GB:  { symbol: '£',  multiplier: 0.0072,  payment: ['stripe', 'paypal', 'wise'] },
  IN:  { symbol: '₹',  multiplier: 0.76,    payment: ['stripe'] },
  default: { symbol: '$', multiplier: 0.0091, payment: ['stripe', 'paypal'] }
}
```

### Language-Specific Psychological Words:
```
Bangladesh (bn):
  → "ভাই", "Assalamu Alaikum", "৪৮ ঘণ্টায়", "ফ্রি", "টাকা"

UK/US (en):
  → "Professional", "Guaranteed", "48-Hour Delivery", "Free Trial"

India (en-IN):
  → "Bhai", "Guaranteed Results", "Fast Delivery", "Free"
```

---

## PART 8: DESIGN SYSTEM — সম্পূর্ণ

### Philosophy: "Premium Dark, YouTube Energy"
YouTube এর লাল + Premium SaaS dark elegance। Mobile-first, fast, emotional।

### Color Palette
```css
:root {
  /* BACKGROUNDS */
  --bg-primary:    #080E1A;
  --bg-secondary:  #0C1526;
  --bg-elevated:   #111D35;
  --bg-glass:      rgba(255,255,255,0.04);
  --bg-glass-hover:rgba(255,255,255,0.07);

  /* BRAND */
  --brand-red:          #FF0000;
  --brand-red-dark:     #CC0000;
  --brand-purple:       #6366F1;
  --brand-purple-light: #818CF8;
  --gradient-brand: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
  --gradient-red:   linear-gradient(135deg, #FF0000 0%, #CC0000 100%);

  /* STATUS */
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-info:    #3B82F6;
  --color-danger:  #EF4444;
  --color-gold:    #F59E0B;
  --color-diamond: #67E8F9;
  --color-silver:  #94A3B8;
  --color-bronze:  #CD7F32;

  /* TEXT */
  --text-primary:   #F1F5F9;
  --text-secondary: #94A3B8;
  --text-muted:     #475569;
  --text-link:      #818CF8;

  /* BORDERS */
  --border-default: rgba(255,255,255,0.08);
  --border-strong:  rgba(255,255,255,0.15);
  --border-brand:   rgba(99,102,241,0.5);
  --border-focus:   #6366F1;

  /* SHADOWS */
  --shadow-card: 0 4px 24px rgba(0,0,0,0.4);
  --shadow-glow: 0 0 40px rgba(99,102,241,0.15);
  --shadow-red:  0 0 30px rgba(255,0,0,0.2);
}

[data-theme="light"] {
  --bg-primary:    #F8FAFC;
  --bg-secondary:  #FFFFFF;
  --bg-elevated:   #F1F5F9;
  --bg-glass:      rgba(0,0,0,0.03);
  --text-primary:  #0F172A;
  --text-secondary:#475569;
  --border-default:rgba(0,0,0,0.08);
}
```

### Typography
```css
/* Bengali: Hind Siliguri (Noto Sans Bengali থেকে better UI feel) */
@import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap');
/* English: Outfit (Inter এর চেয়ে personality বেশি) */
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');

:root {
  --font-bn: 'Hind Siliguri', sans-serif;
  --font-en: 'Outfit', sans-serif;
}
body { font-family: var(--font-bn), var(--font-en); }

h1 { font-size: clamp(2rem, 5vw, 4rem); font-weight: 800; }
h2 { font-size: clamp(1.5rem, 3vw, 2.5rem); font-weight: 700; }
h3 { font-size: clamp(1.2rem, 2vw, 1.75rem); font-weight: 600; }
```

### UI Component Rules

#### Cards (Glassmorphism)
```css
.card {
  background: var(--bg-glass);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-default);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-card);
}
.card:hover {
  background: var(--bg-glass-hover);
  border-color: var(--border-strong);
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}
```

#### Buttons
```css
/* Primary CTA — Red */
.btn-primary {
  background: var(--gradient-red);
  color: #FFF; border: none; border-radius: 12px;
  padding: 14px 28px; font-size: 1rem; font-weight: 600;
  min-height: 52px; cursor: pointer;
  box-shadow: var(--shadow-red);
  transition: all 0.2s ease;
}
.btn-primary:hover { transform: scale(1.02); }
.btn-primary:active { transform: scale(0.98); }

/* Secondary — Purple */
.btn-secondary {
  background: var(--gradient-brand);
  color: #FFF; border-radius: 12px;
  padding: 14px 28px; font-weight: 600; min-height: 52px;
}

/* Outline */
.btn-outline {
  background: transparent; border: 1px solid var(--border-strong);
  color: var(--text-primary); border-radius: 12px;
  padding: 13px 28px; font-weight: 600; min-height: 52px;
}
.btn-outline:hover { border-color: var(--brand-purple); }

/* WhatsApp */
.btn-whatsapp {
  background: #25D366; color: #FFF;
  border-radius: 12px; padding: 14px 28px;
  font-weight: 600; display: flex; align-items: center; gap: 8px;
}
```

#### Status Badges
```css
.badge { padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
.badge-bronze  { background: rgba(205,127,50,0.15); color: #CD7F32; }
.badge-silver  { background: rgba(148,163,184,0.15); color: #94A3B8; }
.badge-gold    { background: rgba(245,158,11,0.15); color: #F59E0B; }
.badge-diamond { background: rgba(103,232,249,0.15); color: #67E8F9; }
.badge-pending    { background: rgba(245,158,11,0.15); color: #F59E0B; }
.badge-progress   { background: rgba(59,130,246,0.15); color: #3B82F6; }
.badge-delivered  { background: rgba(16,185,129,0.15); color: #10B981; }
.badge-revision   { background: rgba(239,68,68,0.15);  color: #EF4444; }
```

### Animation Rules (Framer Motion)
```javascript
export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.2 } }
}

export const containerVariants = {
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
}

export const itemVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
}

export const cardHover = {
  whileHover: { scale: 1.02, y: -4, transition: { duration: 0.2 } },
  whileTap:   { scale: 0.98 }
}
```

### Mobile-First Rules
```
Minimum touch target: 52px height
Font size minimum: 16px (iOS zoom prevent)
Gutters: 16px mobile, 24px desktop
Bottom nav: 60px + safe area padding
Modal: Full-screen mobile, centered popup desktop
```

---

## PART 9: PUBLIC WEBSITE — ALL PAGES

### Announcement Banner (সব পেজে সর্বোচ্চে)
```
[✨ UK/US Clients: Free Thumbnail + First Order 10% OFF! Code: GLOBAL10 ⏰ 2 days left]  [✕]
```
DB driven → Admin এক click এ on/off।

---

### PAGE 1: HOMEPAGE — `/`

#### Navbar
```
[LOGO] [Services ▼] [Projects] [Reviews] [Pricing] [Blog]
[🌍 🇧🇩 ▼]  [🌙/☀️]  [Login]  [ফ্রি Thumbnail নিন →]
```
- Country flag dropdown (left of theme toggle)
- "ফ্রি Thumbnail নিন" = Language-specific CTA
- Mobile: Hamburger → Right drawer

#### Hero (100vh)
```
Background: Video montage (4 clips) + 45% dark overlay + subtle gradient mesh

[ 🎬 Free Trial Available ]  ← animated pill badge

  YouTube Channel কে        ← bn locale
  10x Growth দিচ্ছি
  (64px desktop / 36px mobile, weight 800)

  Video Editing + Thumbnail + Script + Shorts
  (20px, color: --text-secondary)

[🎁 ফ্রি Thumbnail নিন]    [📞 ফ্রি Call Book করুন]
(Red gradient)               (Outline)

↓ scroll indicator (bounce animation)
```

**Floating WhatsApp (fixed bottom-right, always visible):**
```
🟢 WhatsApp button (60px circle, #25D366)
Click → wa.me/8801XXXXXXXXX?text=Assalamu+Alaikum%2C+I+need+a+service
```

#### Social Proof Bar
```
[1,200+ Creators ✅]  [৳৪,৮২,০০০+ Revenue]  [⭐ 4.9/5]  [48h Delivery ⚡]
Counter animation (react-countup) on scroll-into-view
```
Live ticker: "Rakib H. just ordered Video Editing — ২ min ago" (real from DB)

#### Free Trial Highlight Block
```
┌──────────────────────────────────────────────┐
│  🎁 নতুন Client? এখনই ফ্রি শুরু করুন!      │
│  ১টা Professional Thumbnail সম্পূর্ণ বিনামূল্যে │
│  (Value: ৳৩০০ — No Credit Card Needed)      │
│                                              │
│  [ফ্রি Thumbnail নিন →]  [How it works? ▼]   │
└──────────────────────────────────────────────┘
```

#### Services Block (3×2 Grid Desktop, 1 col Mobile)
```
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ 🎬 YouTube       │ │ 📱 Shorts/Reels  │ │ 🎨 Thumbnail     │
│ Video Editing    │ │ Editing          │ │ Design           │
│ from ৳১,৫০০    │ │ from ৳২,০০০    │ │ ⭐ Free Trial    │
│ [Details →]      │ │ [Details →]      │ │ [Details →]      │
└──────────────────┘ └──────────────────┘ └──────────────────┘
```
Hover: scale(1.02) + gradient border glow

> **IMPORTANT — Click Flow:**
> Service card click → `/service/youtube-editing` → সেই পেজেই সব plans, pricing, before/after, reviews সব দেখাবে

#### Projects Gallery
6 thumbnail grid, play overlay। YouTube embed modal on click।

#### Reviews Carousel
Auto-scroll। প্রতি card এ: Stars + Comment + YouTube Short embed।

#### Subscription Preview
```
[Starter ৳৮K/মাস]  [Pro ৳১৮K/মাস 🔥]  [Enterprise ৳৪০K/মাস]
[সব Plan দেখুন →]
```

#### Free Audit CTA
```
📊 ফ্রি YouTube Channel Audit নিন
[Channel Link_________________________] [Audit নিন →]
```

#### FAQ Accordion (7টা)
#### Latest Blog Posts (3 cards)
#### Footer (with country-specific contact info)

---

## PART 10: SERVICE ARCHITECTURE — সঠিক Click Flow

### ⚠️ IMPORTANT: দুই ধরনের "Pricing" আছে

**Type A: One-Time Service (6 main services)**
User একটা specific কাজের জন্য order করে। একবার কিনে, কাজ হয়, শেষ। পরে আবার কিনতে পারে, না-ও পারে — তার ইচ্ছা।

**Type B: Monthly Subscription (আলাদা plan)**
User মাসিক package নেয়। প্রতি মাসে নির্দিষ্ট সংখ্যক video, thumbnail, script পাবে। Auto-renewal।

**এই দুইটা সম্পূর্ণ আলাদা section।**

---

### Service Click Flow (Type A):

```
Homepage Service Card → Click on "YouTube Video Editing"
              ↓
/service/youtube-editing (Service Detail Page)
              ↓
দেখাবে: Before/After video | Plans | What's included | Reviews
              ↓
User clicks [Order Now →] on a plan
              ↓
/dashboard/order/youtube-editing (3-step order form)
              ↓
Payment → Delivery
```

### Service Detail Page Structure (সব service এর same layout):

```
[30s Before/After Video — Autoplay Muted Loop]

SERVICE NAME + TAGLINE
⭐⭐⭐⭐⭐ (127 Reviews) | ✅ 48h Delivery | 🔄 Free Revision

────────────────────────────────
🤖 AI Assistant (Gemini-powered)
────────────────────────────────

━━━━━━━━━━━━━━━ PRICING PLANS ━━━━━━━━━━━━━━━

┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│    BASIC        │ │   STANDARD      │ │    PREMIUM      │
│   ৳১,৫০০      │ │  ৳৪,০০০        │ │   ৳৮,০০০      │
│                 │ │  ⭐ POPULAR     │ │                 │
│ ✅ Cut+Trim     │ │ ✅ Pro Cut      │ │ ✅ Cinematic    │
│ ✅ Noise Remove │ │ ✅ B-roll       │ │ ✅ Color Grade  │
│ ✅ Basic B-roll │ │ ✅ Motion Text  │ │ ✅ Custom MG    │
│ ✅ 1 Revision   │ │ ✅ Sound Design │ │ ✅ Unlimited Rev│
│ 72h Delivery   │ │ ✅ 2 Revision   │ │ 24h Delivery   │
│                 │ │ 48h Delivery   │ │                 │
│ [Order Now →]  │ │ [Order Now →]  │ │ [Order Now →]  │
└─────────────────┘ └─────────────────┘ └─────────────────┘

⚡ Express Delivery (+৳৫০০): যেকোনো plan এ +12h faster

━━━━━━━━━━━━━━━ WHAT YOU GET ━━━━━━━━━━━━━━━
1. ✂️ Cutting + Trimming + Jump Cut
2. 🎬 B-roll + Stock Footage
3. 🔍 Zoom In/Out + Motion Graphics
4. 🎵 Sound Design (Music + SFX + Noise Remove)
5. 🎨 Color Correction + Face Brighten
6. 📝 Auto Captions + Keyword Highlight
7. 🎬 Custom Intro/Outro
8. 📌 End Screen + Cards

━━━━━━━━━━━━━━━ PROCESS ━━━━━━━━━━━━━━━
1️⃣ Order → 2️⃣ Share Files → 3️⃣ Work Starts → 4️⃣ Review → 5️⃣ Download

━━━━━━━━━━━━━━━ RELATED REVIEWS ━━━━━━━━━━━━━━━
(3টা service-specific review, "View All →")

━━━━━━━━━━━━━━━ RELATED SERVICES ━━━━━━━━━━━━━━━
"এটাও নিতে পারেন" → Thumbnail + Script cross-sell
```

---

## PART 11: SUBSCRIPTION MODEL — সম্পূর্ণ আলাদা

**URL:** `/subscription`

### এটা কী?
User প্রতি মাসে একটা নির্দিষ্ট package subscribe করে। প্রতি মাসে তার জন্য নির্দিষ্ট সংখ্যক video, thumbnail, script ready করে দেওয়া হবে।

### Subscription Plans:
```
┌──────────────────┐ ┌──────────────────────┐ ┌──────────────────┐
│    STARTER       │ │         PRO          │ │   ENTERPRISE     │
│  ৳৮,০০০/মাস   │ │    ৳১৮,০০০/মাস     │ │  ৳৪০,০০০/মাস  │
│                  │ │    🔥 Most Popular   │ │                  │
│ 8 Videos         │ │  15 Videos           │ │ 30 Videos        │
│ 16 Thumbnails    │ │  30 Thumbnails       │ │ 60 Thumbnails    │
│ 8 Scripts        │ │  15 Scripts          │ │ 60 Shorts        │
│ 2 Rev/video      │ │  Unlimited Rev       │ │ Unlimited Rev    │
│ Std Delivery     │ │  Express Free        │ │ Priority 12h     │
│ 9-6 Support      │ │  Dedicated Manager   │ │ 24/7 Support     │
│                  │ │  Monthly Report      │ │ Monthly Call     │
│ [Subscribe →]    │ │  [Subscribe →]       │ │ [Contact Us →]   │
└──────────────────┘ └──────────────────────┘ └──────────────────┘

Auto-renewal on selected date। Cancel anytime। No hidden fees।
```

### Subscription Setup Flow (নতুন):
```
1. Plan select → Subscribe click
2. Payment (SSLCOMMERZ/Stripe recurring)
3. ✅ Subscription active
4. Onboarding form:
   → Billing Date পছন্দ করুন: [1] [7] [15] [25] এর মধ্যে কোনটা?
   → এই মাসে কি কি চান?
     ☑ Long Videos (৮-১৫ মিনিট)
     ☑ Shorts (৩০-৬০ সেকেন্ড)
     ☑ Thumbnails
     ☑ Scripts
   → YouTube Channel Link: [___________]
   → Special Style Notes: [___________]
5. Admin assigns dedicated manager (Pro/Enterprise)
6. Monthly schedule তৈরি হয়
```

### Subscription Dashboard Widget:
```
Current Plan: PRO ৳১৮,০০০/মাস
Next Billing: 1 November 2026
Credits:
  Videos: 7/15 remaining
  Thumbnails: 18/30 remaining

[📊 Breakdown]  [💳 Change Plan]  [❌ Cancel]
```

---

## PART 12: USER DASHBOARD — REDESIGNED V2

### Layout
**Desktop:** Left sidebar (240px fixed) + Main content
**Mobile:** Bottom navigation (5 tabs)

### Sidebar (Desktop)
```
[Avatar 48px]  Rakib H.
               ⭐ Gold Client
               [Verified ✓]
───────────────────────────
[🏠 Overview]
[📦 My Orders]     🔴 3
[🔔 Notifications] 🔴 5
[💳 Subscription]  "Pro Plan"
[👥 Referral]      "৳২,৪০০ earned"
[👤 Profile]
[🚪 Logout]
```

### Bottom Nav (Mobile)
```
[🏠 Home]  [📦 Orders]  [➕]  [🔔 Notif]  [👤 Profile]
                        ↑
              Red circle, elevated (main CTA)
```

### Dashboard Home — তোমার Design অনুযায়ী:
```
Assalamu Alaikum, Rakib ভাই! 👋
[Today: Saturday, 25 Oct]

┌────────────────────┐  ┌────────────────────┐
│  Active Orders     │  │  Done Orders       │
│       2            │  │       15           │
└────────────────────┘  └────────────────────┘
(Total Spent বাদ দেওয়া হয়েছে — privacy)

Level: ⭐ Gold  [████████░░] 80%
"Diamond এ যেতে আর ৫টা Order" 🔥
Streak: 12 Days 🔥                        [📜 History]

┌───────────────────────────────────────────┐
│  ⚡ Quick Actions                         │
│                                           │
│  [➕ নতুন Service Order করুন →]           │
└───────────────────────────────────────────┘

┌─────────────────────┐  ┌─────────────────────┐
│ 🎁 Gold Exclusive   │  │ 🚀 Diamond এ যাও    │
│ Thumbnail ফ্রি!     │  │ 15/20 Order [75%]   │
│ ⏰ 2d 14h বাকি      │  │ আর ৫টা Order বাকি  │
│ [নাও →]            │  │ [দেখুন →]          │
└─────────────────────┘  └─────────────────────┘

📊 তোমার জন্য সাজানো:
[YouTube SEO ৳২,৯৯৯]  [Audit Free]  [Shorts ৳৫,৯৯৯]
(Based on order history + level)
```

**Recent Activity বাদ** (তোমার request অনুযায়ী)
**Total Spent বাদ** (privacy)

---

## PART 13: BADGE + LEVEL SYSTEM — সম্পূর্ণ

### Level System:
| Level | Orders | Badge Color | Perks |
|---|---|---|---|
| 🥉 Bronze | 0-9 | Bronze | Standard pricing |
| 🥈 Silver | 10-29 | Silver | 5% off all orders |
| 🥇 Gold | 30-99 | Gold | 10% off + priority support |
| 💎 Diamond | 100+ | Diamond | 15% off + dedicated manager |

### Level Badge — কীভাবে দেওয়া হয়:
- Order count DB থেকে real-time check
- Level up হলে → Email + Dashboard notification "🎉 Gold এ Welcome!"
- Auto-apply discount on next order

### Verified Badge ✓:
```
কারা পাবে: Email + Phone দুটোই verified করলে
কীভাবে: Profile page এ "Verify" button → OTP
কোথায় দেখাবে: Dashboard sidebar, Order detail, Review card তে
DB: users.is_verified = true
```

### Earned Badges (Achievement System):
| Badge | Condition | Display |
|---|---|---|
| 🎯 First Order | প্রথম paid order | Dashboard |
| 🔥 Loyal Client | ৩ মাসে ৩+ orders | Dashboard |
| ⭐ Top Reviewer | ৫টা verified review | Review page |
| 🤝 Referral Pro | ৫+ referrals | Referral page |
| 📅 Streak 30 | ৩০ দিন consecutive login | Dashboard |
| 💎 Diamond | ১০০+ orders | Profile + sidebar |

### Badge Display UI:
```
Profile page:
┌─────────────────────────────────┐
│ Your Badges                     │
│                                 │
│ [🎯 First Order ✓]              │
│ [🔥 Loyal Client ✓]             │
│ [⭐ Top Reviewer — Locked 🔒]   │
│ [🤝 Referral Pro — 3/5]         │
└─────────────────────────────────┘
```

### Weekly Streak:
- Daily login → streak counter++
- ৭ দিন consecutive → auto ৳১০০ coupon (BullMQ)
- Streak display: Dashboard header এ
- [📜 History] button → modal with full streak calendar
- Miss a day → streak resets to 0

### Points System:
| Action | Points |
|---|---|
| Daily login | +50 |
| Order placed | +200 |
| Referral joined | +100 |
| Rating given | +50 |
| Profile complete | +100 (once) |
| Email verified | +50 (once) |

Points V1 তে display only। V2 তে Points Store যোগ হবে।

---

## PART 14: ADMIN PANEL — সম্পূর্ণ

**URL:** `/panel-7k9m2x`
**Access:** IP Whitelist + Email + TOTP 2FA

### Admin Left Menu (সম্পূর্ণ)
```
[📊 Overview]
[📦 All Orders]
[👥 Users]
[👨‍💼 Staff]
[⚙️ Services]
[💳 Subscriptions]
[⭐ Ratings Queue]
[🎫 Coupons]
[👥 Referrals]
[📣 Announcements]
[🏗️ Page Builder]     ← নতুন
[📧 Email Templates]  ← নতুন
[📊 Revenue Report]   ← নতুন
[🌍 Localization]     ← নতুন
[📈 Analytics]
[🔒 Security Logs]
[⚙️ Settings]
```

---

### Menu 1: Overview
```
Today: ৳৪৫,০০০ | New Orders: 7 | Active Staff: 4 | Pending: 5

[Income Line Chart — Last 30 Days]
[Orders by Service Bar Chart (Recharts)]
[Top 5 Clients Table]
[Country Breakdown Pie Chart]  ← নতুন (BD vs UK vs US)

Quick Actions:
[+ Coupon] [📢 Broadcast] [📣 Banner Toggle] [+ Staff]
```

---

### Menu 2: All Orders
```
Filters: Service | Status | Date | Country | [Search Order ID] [Export CSV]

Table: ID | Client | Service | Package | Status | Due | Price | Country | Assign | Action

New paid order → Sound alert + Browser notification + WhatsApp to Admin (Fonnte)
```

---

### Menu 3: Users
```
Search | Filter: Level | Country | Date Joined | Export

Table: Name | Email | Level | Badge | Country | Orders | Joined | Status | Action
Action: [View Orders] [Send Coupon] [Ban] [View Referral Tree]
```

---

### Menu 4: Staff
```
[+ Add Staff]

Table: Name | Role | Tasks Today | Completed | Status | Action
Action: [Copy Login Link] [Edit Role] [View Performance] [Deactivate]

Add Staff:
Name, Email, Role (Editor/Designer/Manager/Operator)
→ Auto-generate unique login link → Copy → WhatsApp পাঠাও
```

---

### Menu 5: Services (সম্পূর্ণ)
```
Table: Service | Status | Packages | Orders (30d) | Action

Action: [Edit] [Toggle On/Off] [Set Scarcity]

Edit Service Modal:
- Name, Slug (read-only after creation)
- Status: Active / Hidden
- Packages: Basic / Standard / Premium (price + delivery + features editable)
- Express Fee
- Scarcity Slots (e.g., "৩টা Premium slot বাকি" — manually set)
- Thumbnail (upload)
- Short Description
- Full Features List (WYSIWYG editor)

Add New Service: Same form, slug auto-generate
```

---

### Menu 6: Subscriptions
```
Active: 28 | Upcoming Billing: 5 (this week)

Table: Client | Plan | Credits Used | Credits Left | Next Bill | Country | Revenue | Action
Action: [View] [Add Credit] [Change Plan] [Cancel]

Billing Cron: "Next run: 1 Nov 12:00 AM"
Manual charge option: [Charge Now] (for failed payments)
```

---

### Menu 7: Ratings Queue
```
Pending: 5

Card:
Order: #YTB-1247 | Client: Rakib H. | ⭐⭐⭐⭐⭐ 5.0
"ভাই CTR ২% → ৮% হয়েছে!"
Public: ✅ Agreed
[Approve ✅] [Reject ❌] [Edit Comment 📝]

Approved → /reviews + /projects তে দেখাবে
```

---

### Menu 8: Coupons
```
[+ Create Coupon]

Table: Code | Type | Discount | Used | Limit | Expires | Status | Action

Create:
Code: [RAMADAN30]
Type: [Percentage ▼] / [Fixed Amount ৳]
Discount: [30]% or [৳500]
Service: [All ▼] / specific
Country: [All ▼] / BD / UK / US  ← নতুন
Usage Limit: [100] total | [1] per user
Expiry: [31 Mar 2026]
Auto-trigger: "After 3 orders → send ৳100 coupon" (BullMQ rule)
```

---

### Menu 9: Referrals
```
Pending Withdrawals: 3

Table: User | Amount | bKash Number | Requested | Status | Action
Action: [Approve → Auto bKash] [Manual Note]

Referral Tree Viewer:
User select → Show tree: Rakib → Samiha (L1) → Karim (L2)
```

---

### Menu 10: Announcements (নতুন)
```
[+ New Announcement]

Active Banner: "রমজান ২৫% ছাড় — Code: RAMADAN25 | ⏰ 3 days" [Edit ✏️] [Turn Off]

Create Form:
Text: [৳৫০০ ছাড়, code: GLOBAL10]
Link URL: [/subscription]
Link Text: [See Plans]
Background Color: [#6366F1 ▼] (preset colors or custom hex)
Country: [All ▼] / BD / UK / US  ← Language-specific banner
Expires: [30 June 2026]
[Save & Activate]
```

---

### Menu 11: PAGE BUILDER (নতুন — Admin Panel এ থাকবেই)

**কেন দরকার:** Homepage copy, service descriptions, FAQ, about page — এগুলো hard-code করলে প্রতিবার developer লাগবে। Page Builder দিয়ে Admin নিজেই edit করতে পারবে।

**Powered by:** Tiptap (open-source rich text editor, free)

#### Page Builder UI:
```
Admin Menu → Page Builder

┌─────────────────────────────────────────────────────┐
│  Page Builder                                       │
│                                                     │
│  Page: [Homepage ▼]   Section: [Hero Text ▼]        │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ 🔤 B  I  U  H1  H2  —  Link  Image  ⋮      │   │
│  │─────────────────────────────────────────────│   │
│  │                                             │   │
│  │  YouTube Channel কে 10x Growth দিচ্ছি       │   │
│  │                                             │   │
│  │  (Edit here, WYSIWYG)                       │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  [💾 Save]  [👁 Preview]  [🔄 Reset to Default]     │
└─────────────────────────────────────────────────────┘
```

#### Editable Sections (Page Builder এ কোন কোন জিনিস edit করা যাবে):
```
Homepage:
  - Hero Title + Subtitle
  - Announcement text
  - FAQ questions + answers
  - About section text

Service Pages:
  - Service description
  - "What You Get" list items
  - Process steps

Subscription Page:
  - Plan feature lists
  - Footer text

Static Pages:
  - Refund Policy content
  - Privacy Policy content
  - Terms content
  - About page content
  - Contact page info
```

#### DB: `page_sections` table
```sql
CREATE TABLE page_sections (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug    VARCHAR(100) NOT NULL,   -- 'homepage', 'service-youtube-editing'
  section_key  VARCHAR(100) NOT NULL,   -- 'hero_title', 'faq_1_question'
  content      TEXT NOT NULL,           -- HTML content from Tiptap
  locale       VARCHAR(10) DEFAULT 'en', -- 'en', 'bn'
  updated_by   UUID REFERENCES users(id),
  updated_at   TIMESTAMP DEFAULT NOW(),
  UNIQUE(page_slug, section_key, locale)
);
```

#### API:
```
GET  /api/admin/pages               → All pages list
GET  /api/admin/pages/:slug         → Page sections
PATCH /api/admin/pages/:slug/:key   → Update section content
GET  /api/public/pages/:slug/:key   → Fetch content for frontend
```

#### Frontend usage:
```javascript
// Next.js component
async function HeroTitle({ locale }: { locale: string }) {
  const content = await getPageSection('homepage', 'hero_title', locale);
  return <h1 dangerouslySetInnerHTML={{ __html: content }} />;
  // sanitize with DOMPurify before render
}
```

---

### Menu 12: Email Templates (নতুন)
```
Templates List:
1. Order Confirmation
2. Order Delivered
3. Revision Requested
4. Subscription Renewed
5. Referral Earned
6. Streak Reward
7. Abandoned Cart (2h / 24h / 72h)
8. Welcome Email

Click Edit:
[Tiptap editor — WYSIWYG]
Variables: {{name}}, {{order_id}}, {{service}}, {{amount}}, {{link}}
[Send Test Email to: admin@...] [Save Template]
```

---

### Menu 13: Revenue Report (নতুন)
```
Period: [This Month ▼] [Last Month] [Custom Range]
Country: [All ▼]

Revenue: ৳৪,৮২,০০০
Orders: 127
Avg Order: ৳৩,৭৯৫
Repeat Rate: 68%

By Service:    [Bar Chart]
By Country:    [Pie: BD 72% | UK 15% | US 8% | Other 5%]
By Package:    Basic 23% | Standard 51% | Premium 26%
By Day:        [Line Chart]

[Export PDF] [Export CSV]
```

---

### Menu 14: Localization (নতুন)
```
Language/Country Settings:

Active Locales: [✅ en] [✅ bn] [☐ en-IN]

Per-Country Payment Methods:
BD: [✅ SSLCOMMERZ] [✅ bKash] [✅ Nagad] [☐ Stripe]
UK: [☐ SSLCOMMERZ] [✅ Stripe] [✅ PayPal] [✅ Wise]
US: [☐ SSLCOMMERZ] [✅ Stripe] [✅ PayPal]

Currency Rates: (manual update or API)
BDT: 1.00 (base)
USD: 0.0091
GBP: 0.0072
INR: 0.76
[Update Rates]
```

---

### Menu 15: Security Logs
Who, What, When, IP। Admin actions + login attempts।

---

### Menu 16: Settings
```
Agency Name, Logo, Favicon
Contact Info (phone, email, social links)
Referral Commission Rates (L1 %, L2 %)
Express Delivery Fee
Free Trial: [On ▼] / Off
Admin Email Alerts: [✅ New Order] [✅ New User] [✅ Staff Offline]
Maintenance Mode: [Off ▼]
```

---

## PART 15: STAFF PANEL

**URL:** `/staff-login/[token]`
**Access:** Role-based, token-only, no IP restriction

### Editor Panel
```
আমার আজকের কাজ: ৩টা

[YTB-1247] Rakib H. — Premium — Due: 24 Oct   ৳৮,০০০
Status: Assigned
[🚀 Start Work]  [💬 Chat]

[YTB-1248] Mitu K. — Standard — Due: 25 Oct   ৳৪,০০০
Status: In Progress ████░ 70%
[📤 Upload Final]  [💬 Chat]  [⏰ Request Extension]
```

### Task Detail
```
Client Instructions: "0:32 এ zoom effect দিন"
[📁 Download Raw Footage] (R2 presigned, 1h expiry)
[📤 Upload Final File] → R2 → triggers "In Review"
[Request Deadline Extension] → Admin notification

💬 Chat:
[Messages list]
[Type___________] [Send]
```

### Thumbnail Designer Panel
Same layout, thumbnail-specific fields।

### YouTube Manager Panel
```
My Channels: 3
[TechBD — 12 videos/month — Next: 25 Oct]
[CookingBD — 8 videos — SEO due today]
Task checklist per channel with due dates।
```

---

## PART 16: ALL SERVICES

### SERVICE 1: YouTube Video Editing
**URL:** `/service/youtube-editing`
**Packages:**
| | Basic | Standard | Premium |
|---|---|---|---|
| Price | ৳১,৫০০ | ৳৪,০০০ | ৳৮,০০০ |
| Delivery | 72h | 48h | 24h |
| Revisions | 1 | 2 | Unlimited |
| B-roll | Basic | Advanced | Cinematic |
| Motion Graphics | — | Text only | Custom |
| Color Grade | Basic | Good | Professional |
| Express | +৳৫০০ | +৳৫০০ | +৳৫০০ |

**Advance:** 50% order, 50% delivery

### SERVICE 2: Shorts/Reels Editing
**Packages:**
| | Starter | Growth | Pro |
|---|---|---|---|
| Quantity | 10 pcs | 30 pcs | 60 pcs |
| Price | ৳২,০০০ | ৳৫,০০০ | ৳৯,০০০ |
| Delivery | 48h | 72h | 96h |
| Express | +৳৩০০ | +৳৫০০ | +৳৮০০ |

**Output:** 1080×1920 MP4

### SERVICE 3: Thumbnail Design ← Free Trial
**Packages:**
| | Basic | Standard | Monthly |
|---|---|---|---|
| Quantity | 3 pcs | 10 pcs | 30 pcs |
| Price | ৳৬০০ | ৳১,৫০০ | ৳৪,০০০ |
| Delivery | 24h | 48h | Daily |
| Express | +৳২০০ | +৳৫০০ | N/A |

**Free Trial:** 1 pc free for new clients
**Payment:** 100% advance

### SERVICE 4: Script Writing
**Packages:**
| | Shorts | YouTube | Monthly |
|---|---|---|---|
| Type | 30-60 sec | 8-10 min | 15 scripts |
| Price | ৳৩০০ | ৳১,৫০০ | ৳১৮,০০০ |
| Delivery | 12h | 24h | Daily |

### SERVICE 5: YouTube Channel Management
**Packages:**
| | Starter | Growth | Pro |
|---|---|---|---|
| Price | ৳৮,০০০/mo | ৳২০,০০০/mo | ৳৪০,০০০/mo |
| Videos | 4 | 8-10 | 12-15 |
| Shorts | — | — | 30 |
| CTA | Book Call | Book Call | Book Call |

### SERVICE 6: Motion Graphics
**Pricing:** Custom Quote Only
**CTA:** "Get Quote" form → Admin manual quote

---

## PART 17: PAYMENT SYSTEM — LOCAL + INTERNATIONAL

### Payment Methods by Country:
```
Bangladesh (BD):
  ├── SSLCOMMERZ (bKash + Nagad + Card + Net Banking)
  ├── bKash Direct API
  └── Nagad Direct API

UK / US / Canada / Australia / EU (Global):
  ├── Stripe (Credit/Debit Card, Apple Pay, Google Pay)
  └── PayPal

UK Specific:
  └── Wise (Bank Transfer, lower fees)

India (V2):
  └── Stripe India / Razorpay
```

### Complete Order → Payment Flow:
```
1. Order form fill (3 steps)
2. "Proceed to Payment" click
3. DB: order created (status: pending_payment)
4. Country detect → Show relevant payment methods
5. User selects method
6. BD → SSLCOMMERZ initiate | Global → Stripe PaymentIntent
7. User completes payment
8. Webhook → /api/webhook/sslcommerz OR /api/webhook/stripe
9. HMAC/Signature verify
10. order.status = "paid_pending_assign"
11. BullMQ jobs fire:
    → Email: Confirmation + Invoice PDF (Resend)
    → WhatsApp: Fonnte to client + to admin
    → Dashboard notification
12. Admin assigns staff
13. Staff works → uploads
14. order.status = "in_review"
15. Client reviews → Approves
16. Client pays remaining 50% (if BD)
   (Global: Full payment upfront via Stripe)
17. order.status = "delivered"
18. Rating prompt
```

### Currency Conversion (Admin Manual Rate):
```javascript
// DB থেকে rate নেওয়া (admin set করে)
const rates = await getExchangeRates(); // from admin settings
const priceInLocal = basePriceBDT * rates[currency];

// Display: $14.55 (USD) or £11.45 (GBP)
// Stripe চার্জ করবে local currency তে
```

### Invoice Generation:
- PDF auto-generate on payment success (puppeteer বা pdf-lib)
- Variables: Order ID, Date, Service, Amount, Country, Currency
- R2 তে store, email এ link

---

## PART 18: REFERRAL SYSTEM — 2-LEVEL

### Commission Structure:
```
Level 1 (Direct Referral):
  → Rakib refers Samiha
  → Samiha এর প্রথম order complete হলে
  → Rakib পাবে: 10% commission
  → Samiha পাবে: 5% discount on that order

Level 2 (Indirect Referral):
  → Samiha refers Karim (via Samiha's own referral link)
  → Karim এর order complete হলে
  → Rakib পাবে: 3% commission (Karim এর order থেকে)
  → Samiha পাবে: 10% (as direct referrer of Karim)
```

> Level 3 → V2 তে আসবে।

### Referral UI — `/dashboard/referral`
```
তোমার Referral Link:
creategrowthagency.com/ref/RAKIB123
[📋 Copy] [📤 WhatsApp] [📤 Facebook]

Total Earned: ৳২,৪০০   [💸 bKash এ Withdraw]

Commission Rules:
Level 1 (Direct): ১০% — তোমার বন্ধু order করলে
Level 2 (Indirect): ৩% — বন্ধুর বন্ধু order করলে
Referee পাবে: ৫% discount (first order)

Stats:
Level 1: ৮ জন Active = ৳১,৬০০
Level 2: ৪ জন Active = ৳৮০০

Recent Earnings:
🟢 Samiha joined → +৳২০০ (22 Oct)
🟢 Karim ordered → +৳৮০  (20 Oct) [L2]

Minimum withdraw: ৳৫০০
30-day hold after earning
Withdrawal → Admin approves → bKash 24h
```

### Fraud Prevention:
```
1. Self-referral blocked (same device IP fingerprint)
2. Minimum order ৳৫০০ to trigger commission
3. 30-day hold before withdrawal
4. One account per email + phone
5. Commission reversed if order refunded
```

### Referral DB Schema:
```sql
-- referral_earnings table তে level column add
ALTER TABLE referral_earnings ADD COLUMN level INTEGER DEFAULT 1; -- 1 or 2
```

---

## PART 19: NOTIFICATION SYSTEM

### All Events:
| Event | Client | Admin | Staff |
|---|---|---|---|
| Order paid | Email + Dashboard + WhatsApp | Panel popup + Sound + WhatsApp | — |
| Assigned | — | — | Dashboard + Email |
| Work started | Dashboard | Status update | — |
| Chat message | Dashboard | — | Dashboard |
| In Review | Dashboard + Email + WhatsApp | Panel | Confirmation |
| Delivered | Dashboard + Email + WhatsApp | Status | "Good job!" |
| Revision request | — | Panel | Dashboard + Email |
| Payment success | Email receipt | Panel income update | — |
| Subscription renewed | Email invoice | Panel | — |
| Streak 7 days | Dashboard + Email "৳১০০ Coupon!" | — | — |
| Referral L1 earned | Dashboard + Email | — | — |
| Referral L2 earned | Dashboard + Email "[L2] +৳XX" | — | — |
| Free trial claimed | Email welcome | Panel notification | — |
| Level up | Dashboard + Email "🎉 Gold এ Welcome!" | — | — |
| Badge earned | Dashboard + Email | — | — |
| Withdraw approved | Email + WhatsApp | — | — |
| Admin daily digest | — | Morning email: yesterday stats | — |
| New user (admin) | — | Panel notification | — |

### WhatsApp via Fonnte:
```javascript
async function sendWhatsApp(phone: string, message: string) {
  await fetch('https://api.fonnte.com/send', {
    method: 'POST',
    headers: { Authorization: process.env.FONNTE_TOKEN },
    body: JSON.stringify({
      target: phone,  // 8801XXXXXXXXX format
      message,
      delay: 1,
      countryCode: '880'  // default BD, international numbers auto-detect
    })
  });
}
```

---

## PART 20: DATABASE SCHEMA — সম্পূর্ণ

```sql
-- ============================================
-- USERS
-- ============================================
CREATE TABLE users (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                VARCHAR(100) NOT NULL,
  email               VARCHAR(255) UNIQUE NOT NULL,
  password_hash       VARCHAR(255),
  phone               VARCHAR(20),
  whatsapp            VARCHAR(20),
  youtube_channel     VARCHAR(500),
  avatar_url          VARCHAR(500),
  role                VARCHAR(20) DEFAULT 'client', -- client, admin, staff
  staff_role          VARCHAR(30),                  -- editor, designer, manager, operator
  level               VARCHAR(20) DEFAULT 'bronze',
  orders_count        INTEGER DEFAULT 0,
  streak_count        INTEGER DEFAULT 0,
  last_login_at       TIMESTAMP,
  points              INTEGER DEFAULT 0,
  referral_code       VARCHAR(20) UNIQUE,
  referred_by         UUID REFERENCES users(id),
  referral_level      INTEGER DEFAULT 1,            -- 1=direct, 2=indirect
  staff_token         VARCHAR(100) UNIQUE,
  country_code        VARCHAR(5) DEFAULT 'BD',
  locale              VARCHAR(10) DEFAULT 'bn',
  currency            VARCHAR(5) DEFAULT 'BDT',
  is_free_trial_used  BOOLEAN DEFAULT false,
  is_verified         BOOLEAN DEFAULT false,         -- email+phone both verified
  email_verified      BOOLEAN DEFAULT false,
  phone_verified      BOOLEAN DEFAULT false,
  is_active           BOOLEAN DEFAULT true,
  badges              JSONB DEFAULT '[]',             -- ["first_order","loyal_client"]
  created_at          TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- ORDERS
-- ============================================
CREATE TABLE orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number     VARCHAR(20) UNIQUE,
  user_id          UUID NOT NULL REFERENCES users(id),
  service_type     VARCHAR(50) NOT NULL,
  package_name     VARCHAR(50),
  package_price    DECIMAL(10,2) NOT NULL,
  express_delivery BOOLEAN DEFAULT false,
  express_fee      DECIMAL(10,2) DEFAULT 0,
  total_price_bdt  DECIMAL(10,2) NOT NULL,            -- always in BDT (base)
  total_price_local DECIMAL(10,2),                    -- in user's currency
  currency         VARCHAR(5) DEFAULT 'BDT',
  advance_amount   DECIMAL(10,2),
  remaining_amount DECIMAL(10,2),
  is_free_trial    BOOLEAN DEFAULT false,
  status           VARCHAR(30) DEFAULT 'pending_payment',
  assigned_to      UUID REFERENCES users(id),
  drive_link       VARCHAR(500),
  file_url         VARCHAR(500),
  delivery_url     VARCHAR(500),
  instructions     TEXT,
  internal_notes   TEXT,
  subscription_id  UUID REFERENCES subscriptions(id),
  coupon_id        UUID REFERENCES coupons(id),
  discount_amount  DECIMAL(10,2) DEFAULT 0,
  delivery_deadline TIMESTAMP,
  delivered_at     TIMESTAMP,
  country_code     VARCHAR(5) DEFAULT 'BD',
  payment_gateway  VARCHAR(30),                       -- sslcommerz, stripe, paypal
  created_at       TIMESTAMP DEFAULT NOW(),
  updated_at       TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- ORDER DETAILS (JSONB per service)
-- ============================================
CREATE TABLE order_details (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id   UUID NOT NULL REFERENCES orders(id),
  details    JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- SUBSCRIPTIONS
-- ============================================
CREATE TABLE subscriptions (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID NOT NULL REFERENCES users(id),
  plan_name            VARCHAR(30),
  plan_price_bdt       DECIMAL(10,2),
  plan_price_local     DECIMAL(10,2),
  currency             VARCHAR(5) DEFAULT 'BDT',
  status               VARCHAR(20) DEFAULT 'pending',
  credits_total        INTEGER,
  credits_remaining    INTEGER,
  billing_day          INTEGER DEFAULT 1,             -- user's chosen day (1-28)
  billing_preferences  JSONB,                         -- {long_video: true, shorts: false, ...}
  billing_cycle_start  TIMESTAMP,
  next_billing_date    TIMESTAMP,
  sslcommerz_sub_ref   VARCHAR(200),
  stripe_sub_id        VARCHAR(200),
  cancelled_at         TIMESTAMP,
  created_at           TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- RATINGS
-- ============================================
CREATE TABLE ratings (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id     UUID NOT NULL REFERENCES orders(id),
  user_id      UUID NOT NULL REFERENCES users(id),
  stars        INTEGER CHECK (stars BETWEEN 1 AND 5),
  comment      TEXT,
  allow_public BOOLEAN DEFAULT false,
  is_approved  BOOLEAN DEFAULT false,
  created_at   TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- CHAT
-- ============================================
CREATE TABLE chat_messages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id   UUID NOT NULL REFERENCES orders(id),
  sender_id  UUID NOT NULL REFERENCES users(id),
  message    TEXT,
  file_url   VARCHAR(500),
  is_read    BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- COUPONS
-- ============================================
CREATE TABLE coupons (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code           VARCHAR(30) UNIQUE NOT NULL,
  type           VARCHAR(20) NOT NULL,   -- percentage, fixed
  discount       DECIMAL(10,2) NOT NULL,
  service_type   VARCHAR(50),            -- NULL = all
  country_code   VARCHAR(5),             -- NULL = all
  usage_limit    INTEGER,
  used_count     INTEGER DEFAULT 0,
  per_user_limit INTEGER DEFAULT 1,
  expires_at     TIMESTAMP,
  is_active      BOOLEAN DEFAULT true,
  created_at     TIMESTAMP DEFAULT NOW()
);

CREATE TABLE coupon_usage (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id  UUID REFERENCES coupons(id),
  user_id    UUID REFERENCES users(id),
  order_id   UUID REFERENCES orders(id),
  used_at    TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- REFERRAL EARNINGS (2-level)
-- ============================================
CREATE TABLE referral_earnings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES users(id),
  referee_id  UUID NOT NULL REFERENCES users(id),
  order_id    UUID NOT NULL REFERENCES orders(id),
  level       INTEGER DEFAULT 1,           -- 1 = direct, 2 = indirect
  percentage  DECIMAL(5,2),               -- 10 or 3
  amount_bdt  DECIMAL(10,2) NOT NULL,
  status      VARCHAR(20) DEFAULT 'pending', -- pending, cleared, withdrawn
  cleared_at  TIMESTAMP,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE referral_withdrawals (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id),
  amount       DECIMAL(10,2) NOT NULL,
  bkash_number VARCHAR(20) NOT NULL,
  status       VARCHAR(20) DEFAULT 'pending',
  admin_note   TEXT,
  paid_at      TIMESTAMP,
  created_at   TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- PAYMENTS
-- ============================================
CREATE TABLE payments (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id       UUID REFERENCES orders(id),
  user_id        UUID REFERENCES users(id),
  amount_bdt     DECIMAL(10,2) NOT NULL,
  amount_local   DECIMAL(10,2),
  currency       VARCHAR(5) DEFAULT 'BDT',
  method         VARCHAR(30),              -- sslcommerz, stripe, paypal, bkash
  transaction_id VARCHAR(200),
  gateway_ref    VARCHAR(200),
  stripe_pi_id   VARCHAR(200),
  status         VARCHAR(20) DEFAULT 'pending',
  webhook_data   JSONB,
  created_at     TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- ANNOUNCEMENTS
-- ============================================
CREATE TABLE announcements (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text         TEXT NOT NULL,
  text_bn      TEXT,                         -- Bengali version
  link_url     VARCHAR(500),
  link_text    VARCHAR(100),
  bg_color     VARCHAR(20) DEFAULT '#6366F1',
  country_code VARCHAR(5),                   -- NULL = all countries
  is_active    BOOLEAN DEFAULT false,
  expires_at   TIMESTAMP,
  created_at   TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- PAGE BUILDER
-- ============================================
CREATE TABLE page_sections (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug    VARCHAR(100) NOT NULL,
  section_key  VARCHAR(100) NOT NULL,
  content      TEXT NOT NULL,
  locale       VARCHAR(10) DEFAULT 'en',
  updated_by   UUID REFERENCES users(id),
  updated_at   TIMESTAMP DEFAULT NOW(),
  UNIQUE(page_slug, section_key, locale)
);

-- ============================================
-- AUDIT LOGS
-- ============================================
CREATE TABLE audit_logs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id),
  action     VARCHAR(100) NOT NULL,
  entity     VARCHAR(50),
  entity_id  UUID,
  old_data   JSONB,
  new_data   JSONB,
  ip_address VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- REQUIRED INDEXES
-- ============================================
CREATE INDEX idx_orders_user_id     ON orders(user_id);
CREATE INDEX idx_orders_status      ON orders(status);
CREATE INDEX idx_orders_service     ON orders(service_type);
CREATE INDEX idx_orders_created     ON orders(created_at DESC);
CREATE INDEX idx_orders_assigned    ON orders(assigned_to);
CREATE INDEX idx_orders_country     ON orders(country_code);
CREATE INDEX idx_users_email        ON users(email);
CREATE INDEX idx_users_referral     ON users(referral_code);
CREATE INDEX idx_users_staff_token  ON users(staff_token);
CREATE INDEX idx_users_country      ON users(country_code);
CREATE INDEX idx_chat_order_id      ON chat_messages(order_id);
CREATE INDEX idx_ratings_order_id   ON ratings(order_id);
CREATE INDEX idx_payments_order_id  ON payments(order_id);
CREATE INDEX idx_referral_referrer  ON referral_earnings(referrer_id);
CREATE INDEX idx_page_sections_slug ON page_sections(page_slug, locale);
```

---

## PART 21: API ENDPOINTS

### Public
```
GET    /api/services
GET    /api/services/:slug
GET    /api/projects
GET    /api/reviews
GET    /api/announcements/active
GET    /api/stats
GET    /api/pages/:slug/:key?locale=bn  → Page Builder content
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/google
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
POST   /api/audit/channel            → Free audit request
GET    /api/health
```

### Client (JWT)
```
GET/PATCH /api/user/me
POST      /api/user/avatar
GET       /api/user/level
POST      /api/user/daily-login       → Streak update
POST      /api/user/verify-email      → OTP verify
POST      /api/user/verify-phone      → OTP verify
POST      /api/user/locale            → Save country/locale preference

POST   /api/orders
GET    /api/orders
GET    /api/orders/:id
POST   /api/orders/:id/revision

GET    /api/payment/initiate/:id      → SSLCOMMERZ (BD)
POST   /api/payment/stripe/intent/:id → Stripe PaymentIntent (Global)
POST   /api/payment/verify

GET/POST /api/chat/:orderId

GET    /api/subscriptions/my
POST   /api/subscriptions
PATCH  /api/subscriptions/preferences → Update billing preferences
DELETE /api/subscriptions/cancel

GET    /api/referral/info
POST   /api/referral/withdraw

GET    /api/notifications
PATCH  /api/notifications/read

POST   /api/ratings
GET    /api/billing/invoices
POST   /api/free-trial/claim
```

### Webhooks (HMAC Verified)
```
POST  /api/webhook/sslcommerz
POST  /api/webhook/stripe
POST  /api/webhook/paypal
POST  /api/webhook/bkash
POST  /api/webhook/nagad
```

### Admin (IP + 2FA JWT)
```
GET    /api/admin/overview
GET    /api/admin/orders
PATCH  /api/admin/orders/:id/assign
PATCH  /api/admin/orders/:id/status
GET    /api/admin/users
PATCH  /api/admin/users/:id/ban
POST/GET/PATCH /api/admin/coupons
GET    /api/admin/ratings
PATCH  /api/admin/ratings/:id/approve
GET    /api/admin/referrals/withdrawals
POST   /api/admin/referrals/approve
POST/PATCH /api/admin/staff
POST   /api/admin/staff/:id/reset-link
GET    /api/admin/subscriptions
PATCH  /api/admin/services/:id
GET/POST/PATCH /api/admin/announcements
GET/PATCH /api/admin/pages/:slug/:key    → Page Builder
GET    /api/admin/analytics
GET    /api/admin/revenue
GET    /api/admin/security/logs
POST   /api/admin/broadcast
GET/PATCH /api/admin/settings
GET/PATCH /api/admin/localization
GET/PATCH /api/admin/email-templates
```

### Staff (Staff JWT)
```
GET    /api/staff/tasks
PATCH  /api/staff/tasks/:id/start
POST   /api/staff/tasks/:id/upload
POST   /api/staff/tasks/:id/extension
GET/POST /api/staff/chat/:orderId
```

---

## PART 22: SECURITY SYSTEM

### Auth
1. JWT: 7-day (user), 8-hour (admin/staff)
2. Refresh: 30-day, HTTP-only cookie, rotate on use
3. Admin 2FA: TOTP (otplib)
4. Staff: Token-only, single link

### IP Security
```
Admin: IP Whitelist (ADMIN_ALLOWED_IPS in .env)
Wrong IP → 403, no form shown
IP change → Email alert
```

### Rate Limits (Upstash Redis)
```
General: 60 req/min/IP
Login: 10 attempts/5min → 15min block
OTP: 3 attempts → 30min wait
AI Chat: 20 messages/hour/user (prevent abuse)
Payment webhook: Gateway IPs only
```

### Data Security
1. bcrypt cost 12
2. JWT 256-bit, rotate 90 days
3. Card data never stored (Stripe PCI + SSLCOMMERZ PCI)
4. R2 presigned URLs (1h expiry)
5. Prisma = SQL injection prevention
6. Next.js auto-escape + CSP headers
7. SameSite=Strict cookies
8. DOMPurify on Page Builder HTML output

---

## PART 23: SEO & ANALYTICS

### Next.js Metadata API (প্রতিটা page)
```javascript
export const metadata = {
  title: "YouTube Video Editing Bangladesh | Create Growth Agency",
  description: "BD's #1 YouTube Growth Agency. 48h delivery. 1,200+ creators.",
  keywords: "YouTube editing Bangladesh, thumbnail design BD",
  openGraph: { title, description, image: "/og-1200x630.jpg", type: "website" },
  twitter: { card: "summary_large_image" },
  canonical: "https://creategrowthagency.com/service/youtube-editing"
}
```

### Analytics (All Free)
```
Google Analytics 4:
- Conversions: Free trial claim, Order submit, Payment success
- Audience: Country, device, source

Microsoft Clarity (Hotjar alternative, free):
- Heatmaps, session recordings, funnels

Sentry Free:
- JS errors, performance

UTM Tracking:
All WhatsApp/Facebook/Email links:
?utm_source=whatsapp&utm_medium=social&utm_campaign=ramadan2026
```

---

## PART 24: PWA SPECIFICATION

### next-pwa setup:
```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});
```

### manifest.json:
```json
{
  "name": "Create Growth Agency",
  "short_name": "CGA",
  "description": "YouTube Growth Platform for Creators",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#080E1A",
  "theme_color": "#6366F1",
  "orientation": "portrait",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ],
  "shortcuts": [
    { "name": "New Order", "url": "/dashboard/orders" }
  ]
}
```

### Caching Strategy:
- Static (CSS/JS/fonts): Cache-first
- API: Network-first, cache fallback
- Images: Cache-first with expiry
- Payment pages: Network-only (never cache)

### Install Prompt:
৩য় visit এর পরে: "CGA আপনার Home Screen এ রাখুন!" [Install] [পরে]

---

## PART 25: COMMUNITY / BLOG SECTION

### Phase 1 (V1 — এখন): Static Blog
```
/blog              → Article listing
/blog/:slug        → Article detail

Features:
- Admin তে article লেখা যাবে (Page Builder দিয়ে)
- Categories: YouTube Tips | Case Studies | Behind the Scenes | Industry News
- SEO-optimized (metadata, OG image, structured data)
- Share buttons: Facebook, WhatsApp, Twitter/X, Copy Link
- Related articles (same category)
- Comment section: V1.5 তে
```

### Phase 2 (V1.5 — ৩ মাস পরে): Community Posts
```
/community         → Feed (chronological or curated)
/community/:slug   → Post detail

Features:
- Client ও Admin post করতে পারবে
- Text + Image post
- Like + Comment
- Admin moderation (approve before publish)
- Tag: #YouTube #Thumbnail #Script #Success
- "Show your results" → Share order outcome
```

### Blog DB:
```sql
CREATE TABLE blog_posts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        VARCHAR(300) NOT NULL,
  title_bn     VARCHAR(300),
  slug         VARCHAR(300) UNIQUE NOT NULL,
  content      TEXT NOT NULL,           -- HTML from Tiptap
  excerpt      TEXT,
  cover_image  VARCHAR(500),
  category     VARCHAR(50),
  tags         VARCHAR(200)[],
  author_id    UUID REFERENCES users(id),
  status       VARCHAR(20) DEFAULT 'draft', -- draft, published
  locale       VARCHAR(10) DEFAULT 'en',
  seo_title    VARCHAR(200),
  seo_desc     VARCHAR(300),
  published_at TIMESTAMP,
  created_at   TIMESTAMP DEFAULT NOW()
);
```

---

## PART 26: V2 & V3 ROADMAP

### V1.5 (৩ মাস পরে — ৫০০+ users, রেভিনিউ আসলে)
| Feature |
|---|
| 3-Level Referral add |
| Timelapse Work Proof (screenshot → video) |
| Abandoned Cart Recovery (email + WhatsApp auto) |
| Community Post feature (client posts) |
| Points Store (redeem points for discounts) |
| Blog comment system |

### V2 (৬ মাস পরে — ২০০+ orders/month)
- React Native App (iOS + Android)
- AI Thumbnail Generator (DALL-E/Midjourney concept)
- YouTube Analytics API integration (show CTR history)
- Auto Salary Calculator
- Churn Prediction (simple rule-based first)
- Shift/Workload Manager

### V3 (১ বছর পরে — ১,০০০+ orders/month)
- Freelancer Marketplace (20% platform fee)
- Template Marketplace (30% fee)
- Course Section (YouTube Growth Course)
- Multi-language Hindi + Arabic
- 24/7 Support (3 shifts)
- Enterprise API

### V1 → V2 Code Compatibility:
1. Modular NestJS → AI module plug করা যাবে
2. API-first → Mobile app zero changes
3. Prisma → New tables without breaking
4. BullMQ → New workers add করা যাবে
5. `features` table → Feature flags (enable/disable per user)

---

## PART 27: ENVIRONMENT VARIABLES + DEVELOPER CHECKLIST

### .env (সম্পূর্ণ)
```bash
# === APP ===
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://creategrowthagency.com
API_URL=https://api.creategrowthagency.com

# === DATABASE (Supabase Free) ===
DATABASE_URL=postgresql://user:pass@db.xxx.supabase.co:5432/postgres

# === REDIS (Upstash Free) ===
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx

# === JWT ===
JWT_SECRET=<256-bit-random>
JWT_REFRESH_SECRET=<another-256-bit-random>

# === ADMIN ===
ADMIN_ALLOWED_IPS=103.x.x.x,110.x.x.x
ADMIN_PANEL_SLUG=panel-7k9m2x
ADMIN_TOTP_SECRET=<base32-for-google-auth>
ADMIN_EMAIL=admin@creategrowthagency.com

# === CLOUDFLARE R2 ===
R2_ACCOUNT_ID=xxx
R2_ACCESS_KEY=xxx
R2_SECRET_KEY=xxx
R2_BUCKET_NAME=cga-files
R2_PUBLIC_URL=https://files.creategrowthagency.com

# === EMAIL (Resend - Free 3K/month) ===
RESEND_API_KEY=re_xxx
EMAIL_FROM=hello@creategrowthagency.com

# === WHATSAPP (Fonnte - ৳৫০০/মাস) ===
FONNTE_TOKEN=xxx
ADMIN_WHATSAPP=8801XXXXXXXXX

# === PAYMENT — BD ===
SSLCOMMERZ_STORE_ID=xxx
SSLCOMMERZ_STORE_PASS=xxx
SSLCOMMERZ_BASE_URL=https://securepay.sslcommerz.com
BKASH_APP_KEY=xxx
BKASH_APP_SECRET=xxx
BKASH_USERNAME=xxx
BKASH_PASSWORD=xxx
NAGAD_MERCHANT_ID=xxx
NAGAD_MERCHANT_PRIVATE_KEY=xxx

# === PAYMENT — GLOBAL ===
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
PAYPAL_CLIENT_ID=xxx
PAYPAL_CLIENT_SECRET=xxx
PAYPAL_WEBHOOK_ID=xxx

# === AUTH ===
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
NEXTAUTH_SECRET=xxx
NEXTAUTH_URL=https://creategrowthagency.com

# === AI (FREE TIERS) ===
GEMINI_API_KEY=AIzaSy...    # Google AI Studio (free)
GROK_API_KEY=xai-...        # console.x.ai (free tier)
AI_PRIMARY=gemini            # gemini | grok | rule-based

# === ANALYTICS ===
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
NEXT_PUBLIC_CLARITY_ID=xxxxxxxxxx

# === MONITORING ===
SENTRY_DSN=https://xxx@sentry.io/xxx

# === GEO (Cloudflare handles via header — no extra API needed) ===
# CF-IPCountry header auto-provided by Cloudflare free plan
```

### Priority Build Order:

**Priority 1 (Launch এর জন্য আবশ্যক — সপ্তাহ 1-4):**
```
□ Auth system (Register/Login/Google OAuth/TOTP admin)
□ Service pages (6 services, correct click flow)
□ Order form (3-step, smart recommender)
□ Payment BD (SSLCOMMERZ + bKash) + Global (Stripe)
□ User Dashboard (redesigned)
□ Admin Panel (Orders, Staff, Services, Page Builder)
□ Staff Panel (Tasks, Upload, Chat)
□ Free Trial system
□ Email notifications (Resend)
□ WhatsApp (Fonnte)
□ Multi-country + language (IP detect + country selector)
□ PWA setup
```

**Priority 2 (Launch এর ২ সপ্তাহ পরে):**
```
□ 2-Level Referral system
□ Subscription (recurring billing)
□ Level + Streak + Badge system
□ Coupons (country-specific)
□ Ratings + Ratings Queue
□ Blog/Articles
□ AI Assistant (Gemini)
□ Revenue Report admin
□ Announcement Banner
□ Email Templates editor
```

**Priority 3 (১ মাস পরে):**
```
□ Page Builder (Tiptap) polish
□ Localization admin
□ PayPal add
□ Microsoft Clarity setup
□ Community/Blog post feature basic
□ Load testing (k6)
□ Full security audit
```

### Launch Checklist:
```
□ সব service page content verify
□ SSLCOMMERZ sandbox test transaction
□ Stripe test payment (UK/US)
□ Webhook test করো
□ Email templates test করো
□ Fonnte WhatsApp test
□ Admin 2FA setup + IP whitelist
□ SSL verify (Cloudflare)
□ Supabase backup enable
□ Sentry active verify
□ GA4 + Clarity data receiving
□ Free trial full flow test
□ Referral L1 + L2 test
□ Country detect test (VPN দিয়ে UK/US check)
□ Language switch test
□ PWA install test (Android + iOS)
□ Mobile responsive (iPhone 13 + Samsung Galaxy)
□ PageSpeed 80+ (Lighthouse)
□ 404 page design
□ Legal pages live (Refund, Privacy, Terms)
□ Sitemap → Google Search Console
□ Full order flow: order → pay → assign → deliver → rate
□ Admin panel full test
□ Staff panel full test
□ Load test: 100 concurrent users (k6)
```

### Folder Structure:
```
/
├── apps/
│   ├── web/                       → Next.js 14
│   │   ├── app/
│   │   │   ├── [locale]/          → next-intl locale routing
│   │   │   │   ├── (public)/      → Homepage, services, projects
│   │   │   │   ├── (auth)/        → Login, register
│   │   │   │   ├── dashboard/     → User dashboard
│   │   │   │   ├── panel-7k9m2x/ → Admin panel
│   │   │   │   └── staff-login/   → Staff panel
│   │   ├── components/
│   │   │   ├── ui/                → Button, Card, Input, Badge, Modal
│   │   │   ├── layout/            → Navbar, Footer, Sidebar, BottomNav
│   │   │   ├── dashboard/
│   │   │   ├── admin/
│   │   │   └── ai/                → AI Widget, SmartRecommender
│   │   ├── lib/                   → API client, utils, constants
│   │   ├── hooks/                 → useAuth, useOrders, useCountry
│   │   ├── store/                 → Zustand (auth, cart, ui)
│   │   ├── messages/              → en.json, bn.json, en-IN.json
│   │   └── public/
│   │       └── icons/             → PWA icons
│   └── api/                       → NestJS
│       ├── src/
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   ├── users/
│       │   │   ├── orders/
│       │   │   ├── payments/      → SSLCOMMERZ + Stripe + PayPal
│       │   │   ├── subscriptions/
│       │   │   ├── referrals/     → 2-level logic
│       │   │   ├── notifications/
│       │   │   ├── staff/
│       │   │   ├── admin/
│       │   │   ├── coupons/
│       │   │   ├── ratings/
│       │   │   ├── announcements/
│       │   │   ├── pages/         → Page Builder API
│       │   │   ├── blog/
│       │   │   └── ai/            → Gemini + Grok + fallback
│       │   ├── common/
│       │   │   ├── guards/        → AuthGuard, AdminGuard, IPGuard, StaffGuard
│       │   │   ├── decorators/
│       │   │   ├── filters/
│       │   │   └── i18n/          → Country/locale utils
│       │   └── queue/             → BullMQ jobs
│       └── prisma/
│           └── schema.prisma
└── packages/
    ├── types/                     → Shared TypeScript types
    └── utils/                     → Shared utilities
```

---

**Document Version:** FREE-TRIAL-V2.0 FINAL
**Prepared by:** Roy Digital Solutions
**Target:** 0 → 1,000 Users, Zero to Minimal Budget
**Changelog from V1:** 2-Level Referral, Free AI (Gemini+Grok), Page Builder, Multi-Country+Language, Global Payment (Stripe+PayPal), Dashboard Redesign, Badge System Complete, Service Architecture Fixed, Subscription Model Clarified, Community Blog Section
**Last Updated:** 2026
**Status:** Ready for Development ✅

*"সফলতা আসে তখনই, যখন প্রথম user টা satisfied হয়।"*
