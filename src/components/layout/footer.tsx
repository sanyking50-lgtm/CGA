"use client";

import Link from "next/link";
import {
  Play,
  Film,
  Image,
  PenTool,
  BarChart3,
  Sparkles,
  Youtube,
  Facebook,
  Twitter,
  Mail,
  MapPin,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { NewsletterSignup } from "@/components/newsletter/newsletter-signup";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const serviceLinks = [
  { label: "YouTube Editing", href: "/services/youtube-editing", icon: Play },
  { label: "Shorts Editing", href: "/services/shorts-editing", icon: Film },
  { label: "Thumbnail Design", href: "/services/thumbnail-design", icon: Image },
  { label: "Script Writing", href: "/services/script-writing", icon: PenTool },
  { label: "Channel Management", href: "/services/channel-management", icon: BarChart3 },
  { label: "Motion Graphics", href: "/services/motion-graphics", icon: Sparkles },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Refund Policy", href: "/refund" },
];

const socialLinks = [
  { label: "YouTube", href: "https://youtube.com/@vishprotadevofficial", icon: Youtube },
  { label: "Facebook", href: "https://facebook.com/creategrowth", icon: Facebook },
  { label: "Twitter", href: "https://twitter.com/creategrowth", icon: Twitter },
  { label: "WhatsApp", href: "https://wa.me/8801835345441", icon: Mail },
];

/* ------------------------------------------------------------------ */
/*  FooterLogo                                                         */
/* ------------------------------------------------------------------ */

function FooterLogo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-orange-500">
        <span className="text-sm font-extrabold text-white">CGA</span>
      </div>
      <span className="text-lg font-bold text-slate-100">
        Create{" "}
        <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
          Growth
        </span>
      </span>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  FooterColumn                                                       */
/* ------------------------------------------------------------------ */

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-100">
        {title}
      </h3>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer (exported)                                                  */
/* ------------------------------------------------------------------ */

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/[0.06] bg-[#060B14]">
      {/* Main footer content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Column 1 — Company */}
          <FooterColumn title="Company">
            <div className="space-y-4">
              <FooterLogo />

              <p className="max-w-xs text-sm leading-relaxed text-slate-400">
                Bangladesh&apos;s #1 YouTube Growth Agency. We help content creators
                scale their channels with professional editing, thumbnails, and
                data-driven strategies.
              </p>

              {/* Social links */}
              <div className="flex items-center gap-2 pt-1">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-400 transition-all hover:bg-white/10 hover:text-white"
                    aria-label={social.label}
                  >
                    <social.icon className="size-4" />
                  </a>
                ))}
              </div>
            </div>
          </FooterColumn>

          {/* Column 2 — Services */}
          <FooterColumn title="Services">
            <ul className="space-y-2.5">
              {serviceLinks.map((service) => (
                <li key={service.href}>
                  <Link
                    href={service.href}
                    className="flex items-center gap-2.5 text-sm text-slate-400 transition-colors hover:text-slate-100"
                  >
                    <service.icon className="size-3.5 text-red-400/60" />
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          {/* Column 3 — Legal */}
          <FooterColumn title="Legal">
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-slate-100"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          {/* Column 4 — Contact & Newsletter */}
          <FooterColumn title="Contact">
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:superadmin.vishprotadev@gmail.com"
                  className="flex items-center gap-2.5 text-sm text-slate-400 transition-colors hover:text-slate-100"
                >
                  <Mail className="size-4 text-red-400/60" />
                  superadmin.vishprotadev@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/8801835345441"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-slate-400 transition-colors hover:text-slate-100"
                >
                  <Sparkles className="size-4 text-red-400/60" />
                  WhatsApp: +880 1835 345441
                </a>
              </li>
              <li>
                <span className="flex items-start gap-2.5 text-sm text-slate-400">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-red-400/60" />
                  Dhaka, Bangladesh
                </span>
              </li>
            </ul>

            <div className="mt-5">
              <NewsletterSignup
                variant="footer"
                source="footer"
                title="Stay Updated"
                description="Get weekly YouTube growth tips"
              />
            </div>
          </FooterColumn>
        </div>
      </div>

      {/* Bottom bar */}
      <Separator className="bg-white/[0.06]" />
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-xs text-slate-500">
          &copy; {currentYear} Create Growth Agency. All rights reserved.
        </p>
        <p className="text-xs text-slate-600">
          Powered by{" "}
          <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text font-medium text-transparent">
            Create Growth Agency
          </span>
        </p>
      </div>
    </footer>
  );
}