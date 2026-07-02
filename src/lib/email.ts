/* ------------------------------------------------------------------ */
/*  Email utility — mock transport (swap for Resend when ready)        */
/* ------------------------------------------------------------------ */

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send an email.
 *
 * Currently uses `console.log` as the transport (mock mode).
 * To switch to a real provider (e.g. Resend), replace the body of this
 * function with the provider's SDK call — the interface stays the same.
 */
export async function sendEmail({ to, subject, html }: EmailPayload): Promise<void> {
  // ── Mock transport ──────────────────────────────────────────────────
  console.log("━━━━━━ EMAIL (mock) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`  To:      ${to}`);
  console.log(`  Subject: ${subject}`);
  console.log(`  HTML:    ${html.substring(0, 300)}${html.length > 300 ? "..." : ""}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  // ── Real transport (Resend example) ─────────────────────────────────
  //
  // import { Resend } from "resend";
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({ from: "CGA <noreply@example.com>", to, subject, html });
  //
  // ────────────────────────────────────────────────────────────────────
}

/* ------------------------------------------------------------------ */
/*  Template helpers                                                   */
/* ------------------------------------------------------------------ */

/** Email sent when an order status changes (e.g. in_progress → completed). */
export function orderStatusEmail(params: {
  userName: string;
  orderNumber: string;
  serviceType: string;
  oldStatus: string;
  newStatus: string;
}): EmailPayload {
  return {
    to: params.userName, // caller should supply the email; name kept for template context
    subject: `Order ${params.orderNumber} — ${params.newStatus.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}`,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#080E1A;border-radius:12px;border:1px solid rgba(255,255,255,0.08);">
        <div style="text-align:center;margin-bottom:24px;">
          <span style="font-size:20px;font-weight:800;background:linear-gradient(90deg,#f87171,#f97316);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">CGA</span>
        </div>
        <h2 style="color:#f1f5f9;font-size:18px;margin:0 0 8px;">Order Update</h2>
        <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin:0 0 16px;">
          Hi ${params.userName}, your order <strong style="color:#e2e8f0;">${params.orderNumber}</strong>
          (${params.serviceType}) has been updated.
        </p>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:20px;">
          <span style="padding:4px 12px;border-radius:6px;font-size:12px;background:rgba(255,255,255,0.06);color:#64748b;text-decoration:line-through;">${params.oldStatus.replace(/_/g, " ")}</span>
          <span style="color:#64748b;">→</span>
          <span style="padding:4px 12px;border-radius:6px;font-size:12px;background:rgba(34,197,94,0.1);color:#4ade80;font-weight:600;">${params.newStatus.replace(/_/g, " ")}</span>
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/orders" style="display:inline-block;padding:10px 24px;border-radius:8px;background:linear-gradient(90deg,#ef4444,#dc2626);color:#fff;text-decoration:none;font-size:14px;font-weight:600;">View Order</a>
        <p style="color:#475569;font-size:11px;text-align:center;margin-top:24px;">© ${new Date().getFullYear()} Create Growth Agency</p>
      </div>
    `,
  };
}

/** Email sent when a payment is confirmed. */
export function paymentConfirmationEmail(params: {
  userName: string;
  orderNumber: string;
  amount: number;
  currency: string;
  paymentMethod: string;
}): EmailPayload {
  return {
    to: params.userName,
    subject: `Payment Confirmed — ${params.orderNumber}`,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#080E1A;border-radius:12px;border:1px solid rgba(255,255,255,0.08);">
        <div style="text-align:center;margin-bottom:24px;">
          <span style="font-size:20px;font-weight:800;background:linear-gradient(90deg,#f87171,#f97316);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">CGA</span>
        </div>
        <h2 style="color:#f1f5f9;font-size:18px;margin:0 0 8px;">Payment Confirmed ✓</h2>
        <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin:0 0 16px;">
          Hi ${params.userName}, your payment for order <strong style="color:#e2e8f0;">${params.orderNumber}</strong>
          has been confirmed.
        </p>
        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:16px;margin-bottom:20px;">
          <p style="color:#64748b;font-size:12px;margin:0 0 4px;">Amount</p>
          <p style="color:#4ade80;font-size:22px;font-weight:700;margin:0 0 12px;">${params.currency === "USD" ? "$" : "৳"}${params.amount}</p>
          <p style="color:#64748b;font-size:12px;margin:0;">Paid via ${params.paymentMethod}</p>
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/orders" style="display:inline-block;padding:10px 24px;border-radius:8px;background:linear-gradient(90deg,#ef4444,#dc2626);color:#fff;text-decoration:none;font-size:14px;font-weight:600;">View Orders</a>
        <p style="color:#475569;font-size:11px;text-align:center;margin-top:24px;">© ${new Date().getFullYear()} Create Growth Agency</p>
      </div>
    `,
  };
}

/** Email sent when a new user registers. */
export function welcomeEmail(params: {
  userName: string;
  email: string;
}): EmailPayload {
  return {
    to: params.email,
    subject: "Welcome to Create Growth Agency!",
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#080E1A;border-radius:12px;border:1px solid rgba(255,255,255,0.08);">
        <div style="text-align:center;margin-bottom:24px;">
          <span style="font-size:20px;font-weight:800;background:linear-gradient(90deg,#f87171,#f97316);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">CGA</span>
        </div>
        <h2 style="color:#f1f5f9;font-size:20px;margin:0 0 8px;">Welcome, ${params.userName}! 🎉</h2>
        <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin:0 0 20px;">
          Thanks for joining <strong style="color:#e2e8f0;">Create Growth Agency</strong>.
          We help YouTube creators scale with professional editing, thumbnails, and channel management.
        </p>
        <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:20px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/services/youtube-editing" style="flex:1;min-width:140px;padding:12px;border-radius:8px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);color:#e2e8f0;text-decoration:none;font-size:13px;text-align:center;">
            🎬 YouTube Editing
          </a>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/services/thumbnail-design" style="flex:1;min-width:140px;padding:12px;border-radius:8px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);color:#e2e8f0;text-decoration:none;font-size:13px;text-align:center;">
            🖼️ Thumbnails
          </a>
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard" style="display:inline-block;padding:10px 24px;border-radius:8px;background:linear-gradient(90deg,#ef4444,#dc2626);color:#fff;text-decoration:none;font-size:14px;font-weight:600;">Go to Dashboard</a>
        <p style="color:#475569;font-size:11px;text-align:center;margin-top:24px;">© ${new Date().getFullYear()} Create Growth Agency</p>
      </div>
    `,
  };
}