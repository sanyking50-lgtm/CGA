/* eslint-disable @typescript-eslint/no-require-imports */
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  PageBreak, Header, Footer, PageNumber, AlignmentType, HeadingLevel,
  WidthType, BorderStyle, ShadingType, TableOfContents, LevelFormat,
} = require("docx");
const fs = require("fs");

// Tech palette (Cool + Light + Active)
const P = { primary: "0A1628", body: "1A2B40", secondary: "6878A0", accent: "E74C3C", surface: "F4F8FC" };
const c = (hex) => hex.replace("#", "");

const FONT_EN = "Calibri";
const FONT_BN = "Microsoft YaHei";

// Helpers
function h1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 480, after: 200, line: 312 },
    children: [new TextRun({ text, bold: true, size: 32, font: { ascii: FONT_EN, eastAsia: FONT_BN }, color: c(P.primary) })] });
}
function h2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 360, after: 160, line: 312 },
    children: [new TextRun({ text, bold: true, size: 28, font: { ascii: FONT_EN, eastAsia: FONT_BN }, color: c(P.primary) })] });
}
function h3(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_3, spacing: { before: 240, after: 120, line: 312 },
    children: [new TextRun({ text, bold: true, size: 24, font: { ascii: FONT_EN, eastAsia: FONT_BN }, color: c(P.secondary) })] });
}
function p(text, opts = {}) {
  return new Paragraph({ spacing: { after: 120, line: 312 }, alignment: opts.center ? AlignmentType.CENTER : AlignmentType.JUSTIFIED,
    children: [new TextRun({ text, size: 22, font: { ascii: FONT_EN, eastAsia: FONT_BN }, color: c(P.body), ...opts })] });
}
function pRuns(runs) {
  return new Paragraph({ spacing: { after: 120, line: 312 }, alignment: AlignmentType.JUSTIFIED, children: runs });
}
function bold(text) { return new TextRun({ text, bold: true, size: 22, font: { ascii: FONT_EN, eastAsia: FONT_BN }, color: c(P.body) }); }
function normal(text) { return new TextRun({ text, size: 22, font: { ascii: FONT_EN, eastAsia: FONT_BN }, color: c(P.body) }); }
function accent(text) { return new TextRun({ text, bold: true, size: 22, font: { ascii: FONT_EN, eastAsia: FONT_BN }, color: c(P.accent) }); }
function code(text) { return new TextRun({ text, size: 20, font: "Courier New", color: c(P.secondary) }); }
function empty() { return new Paragraph({ spacing: { after: 60 }, children: [] }); }

function makeRow(cells, isHeader = false) {
  return new TableRow({ tableHeader: isHeader, cantSplit: true,
    children: cells.map(text => new TableCell({
      margins: { top: 60, bottom: 60, left: 120, right: 120 },
      shading: isHeader ? { type: ShadingType.CLEAR, fill: c(P.surface) } : undefined,
      children: [new Paragraph({ spacing: { line: 280 }, children: [new TextRun({ text, size: 20, bold: isHeader, font: { ascii: FONT_EN, eastAsia: FONT_BN }, color: isHeader ? c(P.primary) : c(P.body) })] })]
    }))
  });
}

function makeTable(headers, rows) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: { top: { style: BorderStyle.SINGLE, size: 2, color: c(P.secondary) }, bottom: { style: BorderStyle.SINGLE, size: 2, color: c(P.secondary) }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "E0E0E0" }, insideVertical: { style: BorderStyle.NONE } },
    rows: [makeRow(headers, true), ...rows.map(r => makeRow(r))]
  });
}

function bullet(text, level = 0) {
  return new Paragraph({ spacing: { after: 80, line: 312 }, indent: { left: 720 + level * 360, hanging: 260 },
    children: [new TextRun({ text: "\u2022 ", size: 22, font: { ascii: FONT_EN, eastAsia: FONT_BN }, color: c(P.accent) }), new TextRun({ text, size: 22, font: { ascii: FONT_EN, eastAsia: FONT_BN }, color: c(P.body) })] });
}

// ============ CONTENT ============

const coverSection = {
  properties: { page: { margin: { top: 0, bottom: 0, left: 0, right: 0 }, size: { width: 11906, height: 16838 } } },
  children: [
    new Paragraph({ spacing: { before: 4000 } }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 },
      children: [new TextRun({ text: "CREATE GROWTH AGENCY", bold: true, size: 52, font: FONT_EN, color: c(P.accent) })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 },
      children: [new TextRun({ text: "YouTube Content Creation SaaS", size: 32, font: FONT_EN, color: c(P.secondary) })] }),
    new Paragraph({ spacing: { before: 600 }, alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500", size: 24, color: c(P.secondary) })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 300, after: 100 },
      children: [new TextRun({ text: "Complete Setup & Management Guide", size: 28, font: { ascii: FONT_EN, eastAsia: FONT_BN }, color: c(P.primary) })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 },
      children: [new TextRun({ text: "\u09B8ম্পূর্ণ সেটআপ ও ম্যানেজমেন্ট গাইড", size: 24, font: FONT_BN, color: c(P.secondary) })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 1200 },
      children: [new TextRun({ text: "Version 1.0 | June 2026", size: 20, font: FONT_EN, color: c(P.secondary) })] }),
  ]
};

// TOC Section
const tocSection = {
  properties: { page: { margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 } } },
  children: [
    new Paragraph({ spacing: { after: 300 }, children: [new TextRun({ text: "Table of Contents", bold: true, size: 36, font: FONT_EN, color: c(P.primary) })] }),
    new TableOfContents("Table of Contents", { hyperlink: true, headingStyleRange: "1-3" }),
    new Paragraph({ children: [new PageBreak()] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "(Right-click on TOC > Update Field to refresh page numbers after opening)", italics: true, size: 18, color: "999999", font: FONT_EN })] }),
    new Paragraph({ children: [new PageBreak()] }),
  ]
};

// Body Section
const body = {
  properties: { page: { margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 }, pageNumbers: { start: 1 } } },
  headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "CGA Setup Guide v1.0", size: 16, color: c(P.secondary), font: FONT_EN })] })] }) },
  footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Page ", size: 16, color: c(P.secondary), font: FONT_EN }), new TextRun({ children: [PageNumber.CURRENT], size: 16, color: c(P.secondary), font: FONT_EN })] })] }) },
  children: [
    // === 1. PROJECT OVERVIEW ===
    h1("1. Project Overview / \u09AA্রজেক্ট ওভারভিউ"),
    p("\u098F\u0987 \u09AA\u09CD\u09B0\u099C\u09C7\u0995\u09CD\u099F\u099F\u09BF \u09B9\u09B2\u09CB \"Create Growth Agency\" (CGA) \u2014 \u098F\u0995\u099F\u09BF YouTube Content Creation SaaS Platform\u0964 \u098F\u099F\u09BF Next.js 16, TypeScript, Prisma ORM, Supabase PostgreSQL, SSLCOMMERZ Payment \u098F\u09AC\u0982 Tailwind CSS \u09A6\u09BF\u09AF\u09BC\u09C7 \u09A4\u09C8\u09B0\u09BF \u09B9\u09AF\u09BC\u09C7\u099B\u09C7\u0964"),
    p("This project is \"Create Growth Agency\" (CGA) \u2014 a YouTube Content Creation SaaS Platform. It is built with Next.js 16, TypeScript, Prisma ORM, Supabase PostgreSQL, SSLCOMMERZ Payment, and Tailwind CSS."),
    empty(),
    h2("1.1 Tech Stack / \u099F\u09C7\u0995 \u09B8\u09CD\u099F\u09CD\u09AF\u09BE\u0995"),
    makeTable(
      ["Technology / \u099F\u09C7\u0995\u09A8\u09CB\u09B2\u099C\u09BF", "Purpose / \u0995\u09BE\u099C", "Version"],
      [
        ["Next.js (App Router)", "Frontend Framework / \u09AB\u09CD\u09B0\u09A8\u09CD\u099F\u098F\u09A8\u09CD\u09A1", "16.x"],
        ["TypeScript", "Type Safety / \u099F\u09BE\u0987\u09AA \u09B8\u09C1\u09B0\u0995\u09CD\u09B7\u09BE", "5.x"],
        ["Prisma ORM", "Database / \u09A1\u09BE\u099F\u09BE\u09AC\u09C7\u099C", "6.x"],
        ["Supabase PostgreSQL", "Database Hosting / \u09A1\u09BE\u099F\u09BE\u09AC\u09C7\u099C \u09B9\u09CB\u09B8\u09CD\u099F\u09BF\u0982", "Free Tier"],
        ["SSLCOMMERZ", "Payment Gateway / \u09AA\u09C7\u09AE\u09C7\u09A8\u09CD\u099F", "Sandbox"],
        ["Tailwind CSS 4", "Styling / \u09B8\u09CD\u099F\u09BE\u0987\u09B2\u09BF\u0982", "4.x"],
        ["shadcn/ui", "UI Components / UI \u0995\u09AE\u09CD\u09AA\u09CB\u09A8\u09C7\u09A8\u09CD\u099F", "Latest"],
        ["Jose JWT", "Authentication / \u0985\u09A5\u09C7\u09A8\u099F\u09BF\u0995\u09C7\u09B6\u09A8", "5.x"],
        ["Upstash Redis", "Rate Limiting / \u09B0\u09C7\u099F \u09B2\u09BF\u09AE\u09BF\u099F", "REST API"],
      ]
    ),
    empty(),

    h2("1.2 14-Day Development Plan / \u09E7\u09EA \u09A6\u09BF\u09A8\u09C7\u09B0 \u09AA\u09B0\u09BF\u0995\u09B2\u09CD\u09AA\u09A8\u09BE"),
    makeTable(
      ["Day / \u09A6\u09BF\u09A8", "Task / \u0995\u09BE\u099C", "Status"],
      [
        ["Day 1-3", "Audit, bug fixes, project setup / \u0985\u09A1\u09BF\u099F, \u09AC\u09BE\u0997 \u09AB\u09BF\u0995\u09CD\u09B8", "\u2705 Complete"],
        ["Day 4", "Order form, payment, coupon system / \u0985\u09B0\u09CD\u09A1\u09BE\u09B0, \u09AA\u09C7\u09AE\u09C7\u09A8\u09CD\u099F", "\u2705 Complete"],
        ["Day 5", "Admin panel (users, orders, services, analytics) / \u0985\u09CD\u09AF\u09BE\u09A1\u09AE\u09BF\u09A8 \u09AA\u09CD\u09AF\u09BE\u09A8\u09C7\u09B2", "\u2705 Complete"],
        ["Day 6", "Blog system, announcements, chat support / \u09AC\u09CD\u09B2\u0997, \u0985\u09CD\u09AF\u09BE\u09A8\u09BE\u0989\u09A8\u09CD\u09B8\u09AE\u09C7\u09A8\u09CD\u099F", "\u0985\u09A8\u09C1\u09B7\u09CD\u09A0\u09BE\u09A8"],
        ["Day 7", "AI chatbot widget, referral system / AI \u099A\u09BE\u099F\u09AC\u099F, \u09B0\u09C7\u09AB\u09BE\u09B0\u09BE\u09B2", "Pending"],
        ["Day 8-9", "PWA, i18n (EN+BN), SEO / PWA, \u09AC\u09B9\u09C1\u09AD\u09BE\u09B7\u09C0, SEO", "Pending"],
        ["Day 10-11", "Testing, email system, notifications / \u099F\u09C7\u09B8\u09CD\u099F\u09BF\u0982, \u0987\u09AE\u09C7\u0987\u09B2", "Pending"],
        ["Day 12-14", "Deployment, monitoring, final polish / \u09A1\u09BF\u09AA\u09CD\u09B2\u09AF\u09BC\u09AE\u09C7\u09A8\u09CD\u099F", "Pending"],
      ]
    ),
    empty(),

    // === 2. BRAND ASSETS SETUP ===
    h1("2. Brand Assets Setup / \u09AC\u09CD\u09B0\u09BE\u09A8\u09CD\u09A1 \u0985\u09CD\u09AF\u09BE\u09B8\u09C7\u099F\u09B8 \u09B8\u09C7\u099F\u0986\u09AA"),
    p("\u09A4\u09CB\u09AE\u09BE\u09B0 \u0993\u09AF\u09BC\u09C7\u09AC\u09B8\u09BE\u0987\u099F\u0995\u09C7 professional \u09A6\u09C7\u0996\u09BE\u09A4\u09C7 \u0995\u09BF\u099B\u09C1 brand assets \u09B2\u09BE\u0997\u09AC\u09C7\u0964 \u09A8\u09BF\u099A\u09C7 \u09AC\u09B2\u09BE \u09B9\u09B2\u09CB \u0995\u09C0 \u0995\u09C0 \u09B2\u09BE\u0997\u09AC\u09C7 \u098F\u09AC\u0982 \u0995\u09CB\u09A5\u09BE\u09AF\u09BC \u09B8\u09C7\u099F \u0995\u09B0\u09AC\u09C7\u0964"),
    p("To make your website look professional, you need some brand assets. Below is what you need and how to set them up."),

    h2("2.1 Logo / \u09B2\u09CB\u0997\u09CB"),
    p("\u09A4\u09CB\u09AE\u09BE\u09B0 logo \u0995\u09CB\u09A5\u09BE\u09AF\u09BC \u09B2\u09BE\u0997\u09AC\u09C7:"),
    bullet("PNG format, transparent background (alpha channel) / PNG \u09AB\u09B0\u09CD\u09AE\u09CD\u09AF\u09BE\u099F, \u099F\u09CD\u09B0\u09BE\u09A8\u09CD\u09B8\u09AA\u09BE\u09B0\u09C7\u09A8\u09CD\u099F \u09AC\u09CD\u09AF\u09BE\u0995\u0997\u09CD\u09B0\u09BE\u0989\u09A8\u09CD\u09A1"),
    bullet("Minimum 512x512px for high quality / \u0989\u099A\u09CD\u099A \u09AE\u09BE\u09A8\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u0995\u09AE\u09AA\u0995\u09CD\u09B7\u09C7 512x512px"),
    bullet("White version for dark backgrounds / \u09A1\u09BE\u09B0\u09CD\u0995 \u09AC\u09CD\u09AF\u09BE\u0995\u0997\u09CD\u09B0\u09BE\u0989\u09A8\u09CD\u09A1\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09B8\u09AB\u09C7\u09A6 \u09AD\u09BE\u09B0\u09CD\u09B8\u09A8"),
    bullet("Dark/black version for light backgrounds / \u09B2\u09BE\u0987\u099F \u09AC\u09CD\u09AF\u09BE\u0995\u0997\u09CD\u09B0\u09BE\u0989\u09A8\u09CD\u09A1\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09A1\u09BE\u09B0\u09CD\u0995 \u09AD\u09BE\u09B0\u09CD\u09B8\u09A8"),
    empty(),
    p("\u0995\u09CB\u09A5\u09BE\u09AF\u09BC \u09B8\u09C7\u099F \u0995\u09B0\u09AC\u09C7 / How to set up:"),
    pRuns([bold("Step 1: "), normal("\u09B2\u09CB\u0997\u09CB \u09AB\u09BE\u0987\u09B2 \u09B0\u09BE\u0996\u09CB "), code("public/logo.png")]),
    pRuns([bold("Step 2: "), normal("Sidebar \u098F logo change \u0995\u09B0\u09A4\u09C7 \u098F\u0987 \u09AB\u09BE\u0987\u09B2 \u098F\u09A1\u09BF\u099F \u0995\u09B0\u09CB:")]),
    p(code("src/components/dashboard/sidebar.tsx"), { bold: true }),
    pRuns([bold("Step 3: "), normal("\u09B8\u09C7\u0996\u09BE\u09A8\u09CB "), code("<span className=\"text-sm font-extrabold text-white\">CGA</span>"), normal(" \u098F\u09B0 \u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09C7 \u09A4\u09CB\u09AE\u09BE\u09B0 logo image \u09AC\u09B8\u09BE\u0993:")]),
    p(code('<Image src="/logo.png" alt="CGA" width={32} height={32} />'), { bold: false }),
    pRuns([bold("Step 4: "), normal("\u098F\u0995\u0987 \u09AD\u09BE\u09AC\u09C7 \u0985\u09A8\u09CD\u09AF\u09BE\u09A1\u09AE\u09BF\u09A8 sidebar \u098F\u0993 change \u0995\u09B0\u09CB:")]),
    p(code("src/components/admin/admin-sidebar.tsx")),
    empty(),

    h2("2.2 Favicon / \u09AB\u09C7\u09AD\u09BF\u0995\u09A8"),
    p("\u09AC\u09CD\u09B0\u09BE\u0989\u099C\u09BE\u09B0 \u099F\u09CD\u09AF\u09BE\u09AC\u09C7 \u09AF\u09C7 \u099B\u09CB\u099F icon \u09A6\u09C7\u0996\u09BE\u09AF\u09BC \u09B8\u09C7\u099F\u09BE \u09B9\u09B2\u09CB favicon\u0964"),
    bullet("Size: 32x32px or 64x64px / \u09B8\u09BE\u0987\u099C: 32x32 \u09AC\u09BE 64x64"),
    bullet("Format: .ico or .png / \u09AB\u09B0\u09CD\u09AE\u09CD\u09AF\u09BE\u099F: .ico \u09AC\u09BE .png"),
    bullet("Place in: "), pRuns([code("public/favicon.ico")]),
    p("\u0985\u099F\u09CB\u09AE\u09C7\u099F\u09BF\u0995 \u099C\u09C7\u09A8\u09C7\u09B0\u09C7\u099F \u0995\u09B0\u09A4\u09C7 realfavicongenerator.net \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09CB \u2014 \u098F\u0995\u099F\u09BF logo upload \u0995\u09B0\u09B2\u09C7 \u09B8\u09AC \u09B8\u09BE\u0987\u099C\u09C7\u09B0 favicon generate \u09B9\u09AF\u09BC\u09C7 \u09AF\u09BE\u09AF\u09BC\u0964"),

    h2("2.3 Colors & Theme / \u09B0\u0982 \u098F\u09AC\u0982 \u09A5\u09BF\u09AE"),
    p("\u09AC\u09B0\u09CD\u09A4\u09AE\u09BE\u09A8\u09C7 \u09A1\u09BE\u09B0\u09CD\u0995 \u0997\u09CD\u09B2\u09BE\u09B8\u09AE\u09B0\u09AB\u09BF\u099C\u09CD\u09AE (dark glassmorphism) \u09A1\u09BF\u099C\u09BE\u0987\u09A8 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u09B9\u099A\u09CD\u099B\u09C7\u0964 \u09B0\u0982 \u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09A8 \u0995\u09B0\u09A4\u09C7:"),
    makeTable(
      ["Element", "Current / \u09AC\u09B0\u09CD\u09A4\u09AE\u09BE\u09A8", "File / \u09AB\u09BE\u0987\u09B2"],
      [
        ["Primary Accent", "red-500 (#EF4444)", "tailwind.config.ts + all .tsx files"],
        ["Background", "#080E1A (deep navy)", "src/app/globals.css :root vars"],
        ["Card BG", "bg-white/[0.03]", "All component files"],
        ["Borders", "border-white/[0.08]", "All component files"],
        ["Text Primary", "slate-100", "All component files"],
        ["Text Secondary", "slate-400", "All component files"],
        ["Gradient", "from-red-500 to-orange-500", "Buttons, badges, logo bg"],
      ]
    ),
    empty(),
    p("\u09B0\u0982 \u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09A8 \u0995\u09B0\u09A4\u09C7 \u09B8\u09AC\u099A\u09C7\u09AF\u09BC\u09C7 \u09B8\u09B9\u099C \u099C\u09BE\u09AF\u09BC\u0997\u09BE\u09C7 find & replace \u0995\u09B0\u09CB:"),
    bullet("VS Code \u098F "), pRuns([code("Ctrl+Shift+H"), normal(" (\u09AB\u09BE\u0987\u09B2\u09C7\u09B0 \u09AE\u09A7\u09CD\u09AF\u09C7 find & replace)")]),
    bullet("\u09AF\u09C7\u09AE\u09A8 "), code("red-500"), normal(" \u09B2\u09BF\u0996\u09C7 \u09A4\u09CB\u09AE\u09BE\u09B0 accent color \u09B2\u09BF\u0996\u09CB (e.g., "), code("blue-500"), normal(")"),
    bullet("Confirm \u0995\u09B0\u09CB \u09B8\u09AC \u09AB\u09BE\u0987\u09B2\u09C7 \u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09A8 \u09B9\u099A\u09CD\u099B\u09C7"),

    h2("2.4 Fonts / \u09AB\u09A8\u09CD\u099F"),
    p("\u09AC\u09B0\u09CD\u09A4\u09AE\u09BE\u09A8\u09C7 2\u099F\u09BF font \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u09B9\u099A\u09CD\u099B\u09C7:"),
    bullet("Outfit \u2014 English headings & body / \u0987\u0982\u09B0\u09C7\u099C\u09BF \u09B9\u09C7\u09A1\u09BF\u0982 \u0993 \u09AC\u09A1\u09BF"),
    bullet("Hind Siliguri \u2014 Bengali text / \u09AC\u09BE\u0982\u09B2\u09BE \u099F\u09C7\u0995\u09CD\u09B8\u099F"),
    p("\u09AB\u09A8\u09CD\u099F change \u0995\u09B0\u09A4\u09C7:"),
    p(code("src/app/layout.tsx"), { bold: true }),
    p("\u09B8\u09C7\u0996\u09BE\u09A8\u09CB "), code("const outfit = Outfit({...})"), normal(" \u098F\u09AC\u0982 "), code("const hindSiliguri = Hind_Siliguri({...})"), normal(" \u09A5\u09C7\u0995\u09C7 \u09A8\u09A4\u09C1\u09A8 font \u09A6\u09BF\u0993\u0964"),

    // === 3. MEDIA CONTENT ===
    h1("3. Media Content Setup / \u09AE\u09BF\u09A1\u09BF\u09AF\u09BC\u09BE \u0995\u09A8\u099F\u09C7\u09A8\u09CD\u099F \u09B8\u09C7\u099F\u0986\u09AA"),

    h2("3.1 Animated Background Video / \u0985\u09CD\u09AF\u09BE\u09A8\u09BF\u09AE\u09C7\u099F\u09C7\u09A1 BG \u09AD\u09BF\u09A1\u09BF\u0993"),
    p("\u09B9\u09CB\u09AE\u09AA\u09C7\u099C\u09C7 \u0985\u09CD\u09AF\u09BE\u09A8\u09BF\u09AE\u09C7\u099F\u09C7\u09A1 background \u09AD\u09BF\u09A1\u09BF\u0993 \u09AF\u09CB\u0997 \u0995\u09B0\u09C7 \u09B8\u09BE\u0987\u099F\u099F\u09BF\u0995\u09C7 premium \u09A6\u09C7\u0996\u09BE\u09AF\u09BC\u0964"),
    bullet("\u09AB\u09B0\u09CD\u09AE\u09CD\u09AF\u09BE\u099F: MP4, WebM (WebM preferred / \u0985\u0997\u09CD\u09B0\u09BE\u09A3\u09BF)"),
    bullet("\u09B0\u09BF\u099C\u09CB\u09B2\u09BF\u0989\u09B6\u09A8: 1920x1080p \u09AC\u09BE 1280x720p"),
    bullet("\u09AB\u09BE\u0987\u09B2 \u09B8\u09BE\u0987\u099C: 5-15MB (compressed) / 5-15\u09AE\u09C7\u0997\u09BE\u09AC\u09BE\u0987\u099F (\u0995\u09AE\u09AA\u09CD\u09B0\u09C7\u09B8\u09CD\u09A1)"),
    bullet("\u09A1\u09BF\u0989\u09B0\u09C7\u09B6\u09A8: 10-30 seconds loop / 10-30 \u09B8\u09C7\u0995\u09C7\u09A8\u09CD\u09A1 \u09B2\u09C1\u09AA"),
    p("\u09AD\u09BF\u09A1\u09BF\u0993 \u09B8\u09C7\u099F \u0995\u09B0\u09A4\u09C7:"),
    pRuns([bold("Step 1: "), normal("\u09AD\u09BF\u09A1\u09BF\u0993 \u09AB\u09BE\u0987\u09B2 \u09B0\u09BE\u0996\u09CB "), code("public/videos/hero-bg.mp4")]),
    pRuns([bold("Step 2: "), normal("Hero section component \u098F \u09AD\u09BF\u09A1\u09BF\u0993 \u09AF\u09CB\u0997 \u0995\u09B0\u09CB:")]),
    p(code('<video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-30"><source src="/videos/hero-bg.mp4" type="video/mp4" /></video>')),

    h2("3.2 Service Images / \u09B8\u09BE\u09B0\u09CD\u09AD\u09BF\u09B8 \u0987\u09AE\u09C7\u099C"),
    p("\u09AA\u09CD\u09B0\u09A4\u09BF\u099F\u09BF service \u098F\u09B0 \u099C\u09A8\u09CD\u09AF \u0987\u09AE\u09C7\u099C \u09B2\u09BE\u0997\u09AC\u09C7:"),
    bullet("YouTube Editing thumbnail / \u0987\u0989\u099F\u09BF\u0989\u09AC \u098F\u09A1\u09BF\u099F\u09BF\u0982 \u09A5\u09BE\u09AE\u09CD\u09AC\u09A8\u09C7\u0987\u09B2"),
    bullet("Shorts/Reels sample / \u09B6\u09B0\u09CD\u099F\u09B8/\u09B0\u09C0\u09B2\u09B8 \u09B8\u09CD\u09AF\u09BE\u09AE\u09CD\u09AA\u09B2"),
    bullet("Script writing mockup / \u09B8\u09CD\u0995\u09CD\u09B0\u09BF\u09AA\u09CD\u099F \u09B2\u09C7\u0996\u09BE\u09B0 \u09AE\u0995\u0986\u09AA"),
    bullet("Channel growth chart / \u099A\u09CD\u09AF\u09BE\u09A8\u09C7\u09B2 \u0997\u09CD\u09B0\u09CB\u09A5 \u099A\u09BE\u09B0\u09CD\u099F"),
    p("\u0987\u09AE\u09C7\u099C \u09B0\u09BE\u0996\u09CB "), code("public/images/services/"), normal(" \u09AB\u09CB\u09B2\u09CD\u09A1\u09BE\u09B0\u09C7\u0964 \u09A8\u09BE\u09AE: "), code("youtube-editing.jpg, thumbnail-design.jpg"), normal(" \u0987\u09A4\u09CD\u09AF\u09BE\u09A6\u09BF\u0964"),

    h2("3.3 Animations / \u0985\u09CD\u09AF\u09BE\u09A8\u09BF\u09AE\u09C7\u09B6\u09A8"),
    p("\u09AC\u09B0\u09CD\u09A4\u09AE\u09BE\u09A8\u09C7 Framer Motion \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u09B9\u099A\u09CD\u099B\u09C7 fade-in animations\u0964 \u0985\u09CD\u09AF\u09BE\u09A8\u09BF\u09AE\u09C7\u09B6\u09A8 change \u0995\u09B0\u09A4\u09C7:"),
    p(code("src/components/services/service-detail-page.tsx")),
    p("\u09B8\u09C7\u0996\u09BE\u09A8\u09CB "), code("initial={{ opacity: 0, y: 20 }}"), normal(" \u098F\u09AC\u0982 "), code("animate={{ opacity: 1, y: 0 }}"), normal(" \u09AD\u09CD\u09AF\u09BE\u09B2\u09C1\u0964 \u09A4\u09CB\u09AE\u09BE\u09B0 \u09AE\u09A4\u09CB animation style \u09A6\u09BF\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u0964"),

    // === 4. TEXT & COPYWRITING ===
    h1("4. Text & Copywriting / \u099F\u09C7\u0995\u09CD\u09B8\u099F \u0993 \u0995\u09AA\u09BF\u09B0\u09BE\u0987\u099F\u09BF\u0982"),
    p("\u09B8\u09AC \u099F\u09C7\u0995\u09CD\u09B8\u099F component files \u098F \u09B8\u09B0\u09BE\u09B8\u09B0\u09BF \u0986\u099B\u09C7\u0964 \u09AF\u09C7\u0995\u09CB\u09A8\u09CB \u09B9\u09C7\u09A1\u09B2\u09BE\u0987\u09A8, description \u09AC\u09BE CTA button text change \u0995\u09B0\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\u0964"),

    h2("4.1 Homepage Headlines / \u09B9\u09CB\u09AE\u09AA\u09C7\u099C \u09B9\u09C7\u09A1\u09B2\u09BE\u0987\u09A8"),
    p("\u09AB\u09BE\u0987\u09B2: "), pRuns([code("src/app/page.tsx")]),
    p("\u09B8\u09C7\u0996\u09BE\u09A8\u09CB main headline, subtitle, feature titles \u098F\u09AC\u0982 CTA button text\u0964 \u09B8\u09AC \u099F\u09C7\u0995\u09CD\u09B8\u099F JSX \u098F \u09B8\u09B0\u09BE\u09B8\u09B0\u09BF \u0986\u099B\u09C7\u0964"),
    p("\u09AF\u09C7\u09AE\u09A8 headline change \u0995\u09B0\u09A4\u09C7 \u099A\u09BE\u0993:"),
    bullet("Find: "), pRuns([code("BD's #1 YouTube Growth Agency")]),
    bullet("Replace with: "), pRuns([code("\u09A4\u09CB\u09AE\u09BE\u09B0 desired headline / Your desired headline")]),
    p("\u098F\u0995\u0987 \u09AD\u09BE\u09AC\u09C7 subtitle, feature descriptions \u0993 change \u0995\u09B0\u09CB\u0964"),

    h2("4.2 Service Page Text / \u09B8\u09BE\u09B0\u09CD\u09AD\u09BF\u09B8 \u09AA\u09C7\u099C \u099F\u09C7\u0995\u09CD\u09B8\u099F"),
    p("\u09B8\u09BE\u09B0\u09CD\u09AD\u09BF\u09B8 data database \u098F \u0986\u099B\u09C7 (Supabase)\u0964 \u099F\u09C7\u0995\u09CD\u09B8\u099F change \u0995\u09B0\u09A4\u09C7 2\u099F\u09BF \u0989\u09AA\u09BE\u09AF\u09BC:"),
    pRuns([bold("Option 1 - Admin Panel: "), normal("\u09B2\u0997\u0987\u09A8 \u0995\u09B0\u09CB "), code("/admin/services"), normal(" > Edit button > text change > Save")]),
    pRuns([bold("Option 2 - Database: "), normal("Supabase Dashboard > Table Editor > services > edit rows directly")]),
    p("\u09B8\u09CD\u0995\u09CD\u09B0\u09BF\u09AA\u09CD\u099F \u09A6\u09BF\u09AF\u09BC\u09C7 seed koro: "), pRuns([code("npx tsx scripts/seed-services.ts")]), normal(" \u09AB\u09BE\u0987\u09B2\u09C7\u09B0 text edit \u0995\u09B0\u09C7 re-run \u0995\u09B0\u09CB\u0964"),

    h2("4.3 Legal Pages / \u09B2\u09C0\u0997\u09BE\u09B2 \u09AA\u09C7\u099C"),
    p("\u09B2\u09BE\u0987\u09AD \u09B8\u09BE\u0987\u099F\u09C7\u09B0 \u099C\u09A8\u09CD\u09EF Privacy Policy \u098F\u09AC\u0982 Terms of Service \u09AA\u09C7\u099C \u09B2\u09BE\u0997\u09C7\u0964 \u098F\u0997\u09C1\u09B2\u09BF \u09A4\u09C8\u09B0\u09BF \u0995\u09B0\u09A4\u09C7 \u09B9\u09AC\u09C7:"),
    bullet("\u09AB\u09BE\u0987\u09B2 create \u0995\u09B0\u09CB: "), pRuns([code("src/app/privacy-policy/page.tsx")]),
    bullet("\u09AB\u09BE\u0987\u09B2 create \u0995\u09B0\u09CB: "), pRuns([code("src/app/terms-of-service/page.tsx")]),
    p("\u0985\u09A5\u09AC\u09BE \u0986\u09AE\u09BF \u09A4\u09CB\u09AE\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF \u09B2\u09C0\u0997\u09BE\u09B2 \u099F\u09C7\u0995\u09CD\u09B8\u099F \u09A6\u09BF\u09B2\u09C7 \u098F\u0997\u09C1\u09B2\u09BF \u09AC\u09A8\u09BE\u09AC\u09CB\u0964 \u09B8\u09B9\u099C \u099C\u09BE\u09AF\u09BC\u0997\u09BE\u09C7 \u099F\u09C7\u09AE\u09AA\u09CD\u09B2\u09C7\u099F \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09C7 Privacy Policy \u098F\u09AC\u0982 TOS \u09B2\u09BF\u0996\u09A4\u09C7 \u09AA\u09BE\u09B0\u09C7\u0964"),

    // === 5. GOING LIVE ===
    h1("5. Going Live / \u09B2\u09BE\u0987\u09AD \u0995\u09B0\u09BE"),
    p("\u09B8\u09BE\u0987\u099F\u099F\u09BF \u09B2\u09BE\u0987\u09AD \u0995\u09B0\u09BE\u09B0 \u0986\u0997\u09C7 \u0995\u09BF \u0995\u09BF \u0995\u09B0\u09A4\u09C7 \u09B9\u09AC\u09C7:"),
    h2("5.1 Pre-Launch Checklist / \u09B2\u099E\u09CD\u099A \u099A\u09C7\u0995\u09B2\u09BF\u09B8\u09CD\u099F"),
    makeTable(
      ["Check / \u09AF\u09BE\u099A\u09BE\u0987", "Details / \u09AC\u09BF\u09AC\u09B0\u09A3", "Done?"],
      [
        [".env file updated / .env \u09AB\u09BE\u0987\u09B2 \u0986\u09AA\u09A1\u09C7\u099F", "Production DB URL, JWT secrets change", "\u25A1"],
        ["Logo + Favicon added / \u09B2\u09CB\u0997\u09CB \u09AF\u09CB\u0997 \u09B9\u09AF়\u09C7\u099B\u09C7", "public/ folder e place kora", "\u25A1"],
        ["SSLCOMMERZ live keys / \u09B2\u09BE\u0987\u09AD \u0995\u09C0", "Sandbox theke Live mode e switch", "\u25A1"],
        ["Privacy Policy + TOS / \u09B2\u09C0\u0997\u09BE\u09B2 \u09AA\u09C7\u099C", "Custom domain e add kora", "\u25A1"],
        ["Admin user created / \u0985\u09CD\u09AF\u09BE\u09A1\u09AE\u09BF\u09A8", "admin@cga.com / admin123 (change!)", "\u2705"],
        ["Services seeded / \u09B8\u09BE\u09B0\u09CD\u09AD\u09BF\u09B8 \u09A1\u09BE\u099F\u09BE", "6 services, 15 packages", "\u2705"],
        ["Build successful / \u09AC\u09BF\u09B2\u09CD\u09A1 \u09B8\u09AB\u09B2", "npm run build = 0 errors", "\u2705"],
      ]
    ),
    empty(),

    h2("5.2 Deployment Options / \u09A1\u09BF\u09AA\u09CD\u09B2\u09AF\u09BC\u09AE\u09C7\u09A8\u09CD\u099F \u0985\u09AA\u09B6\u09A8"),
    makeTable(
      ["Platform / \u09AA\u09CD\u09B2\u09CD\u09AF\u09BE\u099F\u09AB\u09B0\u09CD\u09AE", "Price / \u09AE\u09C2\u09B2\u09CD\u09AF", "Best For / \u09B8\u09AC\u099A\u09C7\u09AF\u09BC\u09C7"],
      [
        ["Vercel (Recommended)", "Free tier available", "Next.js projects / \u09B8\u09AC\u099A\u09C7\u09AF\u09BC\u09C7 \u09AD\u09BE\u09B2\u09CB"],
        ["Railway", "$5/month", "Full-stack with DB / \u09A1\u09BE\u099F\u09BE\u09AC\u09C7\u099C \u09B8\u09B9"],
        ["DigitalOcean App", "$5-12/month", "Production apps / \u09AA\u09CD\u09B0\u09CB\u09A1\u09BE\u0995\u09B6\u09A8"],
        ["VPS (Hetzner/Contabo)", "$4-6/month", "Full control / \u09AA\u09C2\u09B0\u09CD\u09A3 \u0995\u09A8\u099F\u09CD\u09B0\u09CB\u09B2"],
      ]
    ),
    empty(),
    p("\u09AD\u09C7\u09B0\u09C7\u09B2 deployment step (Day 12-14):"),
    bullet("GitHub repo connect koro deployment platform e"),
    bullet("Environment variables set koro (.env file er content)"),
    bullet("Build command: "), pRuns([code("npm run build")]),
    bullet("Start command: "), pRuns([code("node .next/standalone/server.js")]),
    bullet("Custom domain connect koro (Cloudflare DNS recommended)"),

    // === 6. ADMIN PANEL GUIDE ===
    h1("6. Admin Panel Guide / \u0985\u09CD\u09AF\u09BE\u09A1\u09AE\u09BF\u09A8 \u09AA\u09CD\u09AF\u09BE\u09A8\u09C7\u09B2 \u0997\u09BE\u0987\u09A1"),

    h2("6.1 How to Access / \u0995\u09BF\u09AD\u09BE\u09AC\u09C7 \u09AF\u09BE\u09AC\u09C7"),
    p("\u0985\u09CD\u09AF\u09BE\u09A1\u09AE\u09BF\u09A8 \u09AA\u09CD\u09AF\u09BE\u09A8\u09C7\u09B2 \u098F \u09AF\u09C7\u09A4\u09C7 \u09AF\u09BE\u09AC\u09C7:"),
    pRuns([bold("Step 1: "), normal("\u09B2\u0997\u0987\u09A8 \u0995\u09B0\u09CB "), code("/login")]),
    pRuns([bold("Step 2: "), normal("Admin credentials \u09A6\u09BE\u0993:")]),
    bullet("Email: "), pRuns([code("admin@cga.com")]),
    bullet("Password: "), pRuns([code("admin123")]),
    pRuns([accent("WARNING: "), normal("\u09B2\u09BE\u0987\u09AD \u0995\u09B0\u09BE\u09B0 \u0986\u0997\u09C7 \u0985\u09AC\u09B6\u09CD\u09AF\u0987 \u098F\u0987 password change \u0995\u09B0\u09CB! / Change this password before going live!")]),
    pRuns([bold("Step 3: "), normal("Login er por browser e type koro "), code("/admin")]),
    p("\u09AF\u09A6\u09BF admin na \u09B9\u09CB, automatically /dashboard e redirect \u09B9\u09AC\u09C7\u0964"),

    h2("6.2 Admin Features / \u0985\u09CD\u09AF\u09BE\u09A1\u09AE\u09BF\u09A8 \u09AB\u09C0\u099A\u09BE\u09B0"),
    makeTable(
      ["Page / \u09AA\u09C7\u099C", "URL", "\u0995\u09BE\u099C / What it does"],
      [
        ["Dashboard / \u09A1\u09CD\u09AF\u09BE\u09B6\u09AC\u09CB\u09B0\u09CD\u09A1", "/admin", "Stats overview, recent orders, revenue / \u09B8\u09CD\u099F\u09CD\u09AF\u09BE\u099F\u09B8, \u09B0\u09C7\u09AD\u09C7\u09A8\u09C1 \u0985\u09B0\u09CD\u09A1\u09BE\u09B0"],
        ["Users / \u0987\u0989\u099C\u09BE\u09B0", "/admin/users", "Manage users, roles, activate/deactivate / \u0987\u0989\u099C\u09BE\u09B0 \u09AE\u09CD\u09AF\u09BE\u09A8\u09C7\u099C"],
        ["Orders / \u0985\u09B0\u09CD\u09A1\u09BE\u09B0", "/admin/orders", "View, update status, assign staff, notes / \u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u09AE\u09CD\u09AF\u09BE\u09A8\u09C7\u099C"],
        ["Services / \u09B8\u09BE\u09B0\u09CD\u09AD\u09BF\u09B8", "/admin/services", "Edit services, pricing, toggle active / \u09B8\u09BE\u09B0\u09CD\u09AD\u09BF\u09B8 \u098F\u09A1\u09BF\u099F"],
        ["Settings / \u09B8\u09C7\u099F\u09BF\u0982\u09B8", "/admin/settings", "Site config, payment settings / \u09B8\u09BE\u0987\u099F \u0995\u09A8\u09AB\u09BF\u0997"],
      ]
    ),
    empty(),

    h2("6.3 How to Change Text via Admin / \u0985\u09CD\u09AF\u09BE\u09A1\u09AE\u09BF\u09A8 \u09A6\u09BF\u09AF\u09BC\u09C7 \u099F\u09C7\u0995\u09CD\u09B8\u099F \u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09A8"),
    p("\u0985\u09CD\u09AF\u09BE\u09A1\u09AE\u09BF\u09A8 \u09AA\u09CD\u09AF\u09BE\u09A8\u09C7\u09B2 \u09A6\u09BF\u09AF\u09BC\u09C7 \u09AF\u09C7\u09B8\u09AC \u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09A8 \u0995\u09B0\u09BE \u09AF\u09BE\u09AF় / What you can change via admin:"),
    bullet("\u09B8\u09BE\u09B0\u09CD\u09AD\u09BF\u09B8\u09C7\u09B0 \u09A8\u09BE\u09AE, description, price, active/inactive / Service names, descriptions, pricing"),
    bullet("\u0987\u0989\u099C\u09BE\u09B0\u09C7\u09B0 role, level, points, active status / User roles, levels, activation"),
    bullet("\u0985\u09B0\u09CD\u09A1\u09BE\u09B0\u09C7\u09B0 status (pending > in_progress > delivered) / Order status management"),
    bullet("\u09B8\u09CD\u099F\u09BE\u09AB assign, internal notes add / Staff assignment, internal notes"),
    p("\u09AF\u09C7\u09B8\u09AC \u0995\u09CB\u09A1 \u098F\u09A1\u09BF\u099F \u0995\u09B0\u09C7 \u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09A8 \u0995\u09B0\u09A4\u09C7 \u09B9\u09AC\u09C7 / What requires code editing:"),
    bullet("Homepage headlines, hero section / \u09B9\u09CB\u09AE\u09AA\u09C7\u099C \u09B9\u09C7\u09A1\u09B2\u09BE\u0987\u09A8 \u2014 "), pRuns([code("src/app/page.tsx")]),
    bullet("Colors, theme, fonts / \u09B0\u0982, \u09A5\u09BF\u09AE, \u09AB\u09A8\u09CD\u099F \u2014 "), pRuns([code("src/app/globals.css")]),
    bullet("Navbar, footer text / \u09A8\u09C7\u09AD\u09AC\u09BE\u09B0, \u09AB\u09C1\u099F\u09BE\u09B0 \u2014 "), pRuns([code("src/components/layout/")]),
    bullet("Email templates / \u0987\u09AE\u09C7\u0987\u09B2 \u099F\u09C7\u09AE\u09AA\u09CD\u09B2\u09C7\u099F \u2014 "), pRuns([code("src/lib/email-templates.ts")]),

    h2("6.4 Order Status Flow / \u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u09B8\u09CD\u099F\u09CD\u09AF\u09BE\u099F\u09BE\u09B8 \u09AB\u09CD\u09B2\u09CB"),
    p("\u0985\u09B0\u09CD\u09A1\u09BE\u09B0\u09C7\u09B0 status lifecycle / Order status lifecycle:"),
    p("pending_payment > paid_pending_assign > in_progress > delivered"),
    p("(cancelled \u09AF\u09C7\u0995\u09CB\u09A8\u09CB stage e \u09B9\u09A4\u09C7 \u09AA\u09BE\u09B0\u09C7 / Can be cancelled from any stage)"),

    // === 7. DAY-BY-DAY PROGRESS ===
    h1("7. What's Done & What's Next / \u0995\u09C0 \u09B9\u09AF়\u09C7\u099B\u09C7 \u0993 \u0995\u09C0 \u09AC\u09BE\u0995\u09BF"),

    h2("7.1 Completed (Day 1-5) / \u09B8\u09AE\u09CD\u09AA\u09A8\u09CD\u09A8"),
    bullet("User auth (register, login, logout, refresh, JWT) / \u0987\u0989\u099C\u09BE\u09B0 \u0985\u09A5\u09C7\u09A8\u099F\u09BF\u0995\u09C7\u09B6\u09A8"),
    bullet("6 services with 15 packages / 6\u099F\u09BF \u09B8\u09BE\u09B0\u09CD\u09AD\u09BF\u09B8, 15\u099F\u09BF \u09AA\u09CD\u09AF\u09BE\u0995\u09C7\u099C"),
    bullet("3-step order form (Service > Details > Payment) / 3-\u09B8\u09CD\u099F\u09C7\u09AA \u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u09AB\u09B0\u09CD\u09AE"),
    bullet("SSLCOMMERZ payment integration / SSLCOMMERZ \u09AA\u09C7\u09AE\u09C7\u09A8\u09CD\u099F"),
    bullet("Coupon system / \u0995\u09C1\u09AA\u09A8 \u09B8\u09BF\u09B8\u09CD\u099F\u09C7\u09AE"),
    bullet("Admin panel (5 pages + 7 APIs) / \u0985\u09CD\u09AF\u09BE\u09A1\u09AE\u09BF\u09A8 \u09AA\u09CD\u09AF\u09BE\u09A8\u09C7\u09B2"),
    bullet("Dark glassmorphism design / \u09A1\u09BE\u09B0\u09CD\u0995 \u0997\u09CD\u09B2\u09BE\u09B8\u09AE\u09B0\u09AB\u09BF\u099C\u09CD\u09AE \u09A1\u09BF\u099C\u09BE\u0987\u09A8"),
    bullet("44 routes, 0 TypeScript errors / 44\u099F\u09BF route, 0 TS error"),

    h2("7.2 Upcoming (Day 6-14) / \u0986\u09B8\u099B\u09C7"),
    bullet("Day 6: Blog system, announcements, chat support / \u09AC\u09CD\u09B2\u0997, \u0985\u09CD\u09AF\u09BE\u09A8\u09BE\u0989\u09A8\u09CD\u09B8\u09AE\u09C7\u09A8\u09CD\u099F"),
    bullet("Day 7: AI chatbot, referral system / AI \u099A\u09BE\u099F\u09AC\u099F, \u09B0\u09C7\u09AB\u09BE\u09B0\u09BE\u09B2"),
    bullet("Day 8-9: PWA, i18n (Bengali+English), SEO / PWA, \u09AC\u09B9\u09C1\u09AD\u09BE\u09B7\u09C0"),
    bullet("Day 10-11: Email, notifications, testing / \u0987\u09AE\u09C7\u0987\u09B2, \u099F\u09C7\u09B8\u09CD\u099F\u09BF\u0982"),
    bullet("Day 12-14: Deployment, monitoring, launch / \u09A1\u09BF\u09AA\u09CD\u09B2\u09AF\u09BC\u09AE\u09C7\u09A8\u09CD\u099F, \u09B2\u099E\u09CD\u099A"),

    // === 8. FILE STRUCTURE ===
    h1("8. Important File Structure / \u0997\u09C1\u09B0\u09C1\u09A4\u09CD\u09AC\u09AA\u09C2\u09B0\u09CD\u09A3 \u09AB\u09BE\u0987\u09B2 \u09B8\u09CD\u099F\u09CD\u09B0\u09BE\u0995\u099A\u09BE\u09B0"),
    makeTable(
      ["Path", "\u0995\u09C0 / What"],
      [
        ["src/app/page.tsx", "Homepage / \u09B9\u09CB\u09AE\u09AA\u09C7\u099C (headlines, CTA)"],
        ["src/app/globals.css", "Colors, fonts, theme vars / \u09B0\u0982, \u09AB\u09A8\u09CD\u099F, \u09A5\u09BF\u09AE"],
        ["src/app/layout.tsx", "Fonts config, metadata / \u09AB\u09A8\u09CD\u099F, SEO meta"],
        ["src/components/layout/navbar.tsx", "Navigation bar / \u09A8\u09C7\u09AD\u09BF\u0997\u09C7\u09B6\u09A8"],
        ["src/components/layout/footer.tsx", "Footer content / \u09AB\u09C1\u099F\u09BE\u09B0 \u0995\u09A8\u099F\u09C7\u09A8\u09CD\u099F"],
        ["src/components/dashboard/sidebar.tsx", "User dashboard sidebar / \u09B8\u09BE\u0987\u09A1\u09AC\u09BE\u09B0"],
        ["src/components/admin/admin-sidebar.tsx", "Admin sidebar / \u0985\u09CD\u09AF\u09BE\u09A1\u09AE\u09BF\u09A8 \u09B8\u09BE\u0987\u09A1\u09AC\u09BE\u09B0"],
        ["src/middleware.ts", "Auth + admin role check / \u0985\u09A5\u09C7\u09A8\u099F\u09BF\u0995\u09C7\u09B6\u09A8"],
        ["prisma/schema.prisma", "Database schema / \u09A1\u09BE\u099F\u09BE\u09AC\u09C7\u099C \u09B8\u09CD\u0995\u09C0\u09AE\u09BE"],
        [".env", "All secrets & config / \u09B8\u09AC credentials"],
        ["scripts/seed-services.ts", "Service data seeder / \u09B8\u09BE\u09B0\u09CD\u09AD\u09BF\u09B8 \u09A1\u09BE\u099F\u09BE"],
      ]
    ),
    empty(),

    // === 9. QUICK REFERENCE ===
    h1("9. Quick Reference / \u09A6\u09CD\u09B0\u09C1\u09A4 \u09B0\u09C7\u09AB\u09BE\u09B0\u09C7\u09A8\u09CD\u09B8"),
    h2("9.1 Important Commands / \u0997\u09C1\u09B0\u09C1\u09A4\u09CD\u09AC\u09AA\u09C2\u09B0\u09CD\u09A3 \u0995\u09AE\u09BE\u09A8\u09CD\u09A1"),
    makeTable(
      ["Command", "\u0995\u09BE\u099C / What it does"],
      [
        ["npm run dev", "Start development server / \u09A1\u09C7\u09AD \u09B8\u09BE\u09B0\u09CD\u09AD\u09BE\u09B0 \u09B6\u09C1\u09B0\u09C1"],
        ["npm run build", "Build for production / \u09AA\u09CD\u09B0\u09CB\u09A1\u09BE\u0995\u09B6\u09A8 \u09AC\u09BF\u09B2\u09CD\u09A1"],
        ["npm run start", "Start production server / \u09AA\u09CD\u09B0\u09CB\u09A1\u09BE\u0995\u09B6\u09A8 \u09B8\u09BE\u09B0\u09CD\u09AD\u09BE\u09B0"],
        ["npm run db:push", "Push schema to DB / \u09A1\u09BE\u099F\u09BE\u09AC\u09C7\u099C \u09B8\u09CD\u0995\u09C0\u09AE\u09BE push"],
        ["npx tsx scripts/seed-services.ts", "Seed service data / \u09B8\u09BE\u09B0\u09CD\u09AD\u09BF\u09B8 \u09A1\u09BE\u099F\u09BE \u09AC\u09B8\u09BE\u0993"],
        ["npx tsc --noEmit", "Check TypeScript errors / TS error check"],
        ["npx prisma studio", "Open DB GUI / \u09A1\u09BE\u099F\u09BE\u09AC\u09C7\u099C GUI \u0996\u09C1\u09B2\u09C1\u09A8"],
      ]
    ),
    empty(),
    h2("9.2 Important URLs / \u0997\u09C1\u09B0\u09C1\u09A4\u09CD\u09AC\u09AA\u09C2\u09B0\u09CD\u09A3 URLs"),
    makeTable(
      ["URL", "\u0995\u09C0 / What"],
      [
        ["/", "Homepage / \u09B9\u09CB\u09AE\u09AA\u09C7\u099C"],
        ["/login", "Login page / \u09B2\u0997\u0987\u09A8"],
        ["/register", "Registration / \u09B0\u09C7\u099C\u09BF\u09B8\u09CD\u099F\u09CD\u09B0\u09C7\u09B6\u09A8"],
        ["/dashboard", "User dashboard / \u0987\u0989\u099C\u09BE\u09B0 \u09A1\u09CD\u09AF\u09BE\u09B6\u09AC\u09CB\u09B0\u09CD\u09A1"],
        ["/dashboard/orders", "My orders / \u0986\u09AE\u09BE\u09B0 \u0985\u09B0\u09CD\u09A1\u09BE\u09B0"],
        ["/admin", "Admin dashboard / \u0985\u09CD\u09AF\u09BE\u09A1\u09AE\u09BF\u09A8"],
        ["/admin/users", "User management / \u0987\u0989\u099C\u09BE\u09B0 \u09AE\u09CD\u09AF\u09BE\u09A8\u09C7\u099C\u09AE\u09C7\u09A8\u09CD\u099F"],
        ["/admin/orders", "Order management / \u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u09AE\u09CD\u09AF\u09BE\u09A8\u09C7\u099C\u09AE\u09C7\u09A8\u09CD\u099F"],
        ["/admin/services", "Service management / \u09B8\u09BE\u09B0\u09CD\u09AD\u09BF\u09B8 \u09AE\u09CD\u09AF\u09BE\u09A8\u09C7\u099C\u09AE\u09C7\u09A8\u09CD\u099F"],
      ]
    ),
    empty(),
    p("\u09AF\u09C7\u0995\u09CB\u09A8\u09CB \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8 \u09A5\u09BE\u0995\u09B2\u09C7 \u0986\u09AE\u09BE\u0995\u09C7 \u099C\u09BF\u099C\u09CD\u099E\u09BE\u09B8\u09BE \u0995\u09B0\u09CB\u0964 Happy building! / \u09AF\u09C7\u0995\u09CB\u09A8\u09CB \u09AA\u09CD\u09B0\u09B6\u09CD\u09A8 \u09A5\u09BE\u0995\u09B2\u09C7 message \u09A6\u09BF\u0993\u0964 \u09B6\u09C1\u09AD \u09A8\u09BF\u09B0\u09CD\u09AE\u09BE\u09A3!"),
  ]
};

const doc = new Document({
  styles: {
    default: { document: { run: { font: { ascii: FONT_EN, eastAsia: FONT_BN }, size: 22, color: c(P.body) }, paragraph: { spacing: { line: 312 } } } },
    heading1: { run: { font: { ascii: FONT_EN, eastAsia: FONT_BN }, size: 32, bold: true, color: c(P.primary) } },
    heading2: { run: { font: { ascii: FONT_EN, eastAsia: FONT_BN }, size: 28, bold: true, color: c(P.primary) } },
    heading3: { run: { font: { ascii: FONT_EN, eastAsia: FONT_BN }, size: 24, bold: true, color: c(P.secondary) } },
  },
  sections: [coverSection, tocSection, body]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("/home/z/my-project/download/CGA-Setup-Guide.docx", buf);
  console.log("DOCX created!");
});