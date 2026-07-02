"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  Zap,
  Check,
  Clock,
  Loader2,
  Shield,
  Truck,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { getServiceBySlug, services } from "@/lib/service-data";
import type { ServiceData, ServicePackage } from "@/lib/service-data";

// ─── Payment methods ────────────────────────────────────────────
const PAYMENT_METHODS = [
  { id: "bkash", name: "bKash", icon: Smartphone, color: "text-pink-400", desc: "Mobile Banking" },
  { id: "nagad", name: "Nagad", icon: Smartphone, color: "text-orange-400", desc: "Mobile Banking" },
  { id: "card", name: "Card Payment", icon: CreditCard, color: "text-blue-400", desc: "Visa / Mastercard" },
  { id: "bank_transfer", name: "Bank Transfer", icon: Building2, color: "text-emerald-400", desc: "Direct Bank Transfer" },
  { id: "cod", name: "Cash on Delivery", icon: Wallet, color: "text-purple-400", desc: "Pay when delivered" },
];

// ─── Checkout inner component (needs useSearchParams) ──────────
function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const serviceSlug = searchParams.get("service") || "";
  const packageName = searchParams.get("package") || "";

  const [service, setService] = useState<ServiceData | null>(null);
  const [selectedPkg, setSelectedPkg] = useState<ServicePackage | null>(null);
  const [expressDelivery, setExpressDelivery] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [instructions, setInstructions] = useState("");
  const [phone, setPhone] = useState(user?.phone || "");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"details" | "payment" | "processing">("details");

  // Load service data
  useEffect(() => {
    if (serviceSlug) {
      const svc = getServiceBySlug(serviceSlug);
      if (svc) {
        setService(svc);
        if (packageName) {
          const pkg = svc.packages.find(
            (p) => p.name.toLowerCase() === packageName.toLowerCase()
          );
          if (pkg && !pkg.isCustomQuote) {
            setSelectedPkg(pkg);
          }
        }
      }
    }
  }, [serviceSlug, packageName]);

  const totalPrice = selectedPkg
    ? selectedPkg.price + (expressDelivery ? selectedPkg.expressFee : 0)
    : 0;

  const deliveryTime = selectedPkg
    ? expressDelivery
      ? Math.round(selectedPkg.deliveryHrs / 2)
      : selectedPkg.deliveryHrs
    : 0;

  function formatPrice(price: number): string {
    return `৳${price.toLocaleString("en-BD")}`;
  }

  function formatDelivery(hrs: number): string {
    if (hrs >= 720) return "Monthly";
    if (hrs === 0) return "Contact Us";
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d ${hrs % 24}h`;
  }

  async function handlePlaceOrder() {
    if (!selectedPkg || !paymentMethod) return;
    setError("");

    setIsProcessing(true);
    setStep("processing");

    try {
      // Step 1: Create order
      const checkoutRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceSlug,
          packageName: selectedPkg.name,
          expressDelivery,
          instructions,
          paymentMethod,
        }),
      });

      const checkoutData = await checkoutRes.json();
      if (!checkoutRes.ok) {
        throw new Error(checkoutData.error || "Failed to create order");
      }

      // Step 2: Mock payment verification (simulate 2s gateway delay)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const verifyRes = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: checkoutData.orderId }),
      });

      const verifyData = await verifyRes.json();

      if (verifyData.success) {
        router.push(`/checkout/success?order=${checkoutData.orderNumber}`);
      } else {
        router.push(
          `/checkout/cancelled?order=${checkoutData.orderNumber}&reason=${encodeURIComponent(verifyData.error || "Payment failed")}`
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("payment");
      setIsProcessing(false);
    }
  }

  // ─── No service selected: show service picker ───────────────
  if (!service || !selectedPkg) {
    return (
      <div className="min-h-screen bg-[#080E1A] pt-24 pb-16 px-4">
        <div className="mx-auto max-w-5xl">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 mb-8 transition-colors">
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>

          <h1 className="text-3xl font-bold text-slate-100 mb-2">Choose a Service</h1>
          <p className="text-slate-400 mb-8">Select a service to get started with your order</p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((svc) => (
              <Link
                key={svc.slug}
                href={`/checkout?service=${svc.slug}&package=${encodeURIComponent(svc.packages.find((p) => p.isPopular)?.name || svc.packages[0]?.name || "")}`}
              >
                <Card className="border-white/[0.06] bg-white/[0.03] backdrop-blur-sm hover:bg-white/[0.06] hover:border-white/[0.12] transition-all cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
                        <svc.icon className="size-5 text-red-400" />
                      </div>
                      <h3 className="font-semibold text-slate-100">{svc.name}</h3>
                    </div>
                    <p className="text-sm text-slate-400 mb-4">{svc.tagline}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        From {formatPrice(svc.packages[0]?.price || 0)}
                      </span>
                      <ChevronDown className="size-4 text-slate-500 rotate-[-90deg]" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── Main checkout flow ─────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#080E1A] pt-24 pb-16 px-4">
      <div className="mx-auto max-w-5xl">
        <Link
          href={`/services/${serviceSlug}`}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 mb-6 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to {service.name}
        </Link>

        {/* Progress Steps */}
        <div className="flex items-center gap-4 mb-8">
          {["Order Details", "Payment", "Confirm"].map((label, i) => {
            const stepKeys = ["details", "payment", "processing"] as const;
            const isActive = stepKeys[i] === step;
            const isDone = stepKeys.indexOf(step) > i;
            return (
              <div key={label} className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                    isDone
                      ? "bg-emerald-500/20 text-emerald-400"
                      : isActive
                      ? "bg-red-500/20 text-red-400"
                      : "bg-white/5 text-slate-500"
                  }`}
                >
                  {isDone ? <Check className="size-4" /> : i + 1}
                </div>
                <span className={`text-sm hidden sm:inline ${isActive || isDone ? "text-slate-200" : "text-slate-500"}`}>
                  {label}
                </span>
                {i < 2 && <div className="w-8 h-px bg-white/10" />}
              </div>
            );
          })}
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left: Form */}
          <div className="lg:col-span-3 space-y-6">
            <AnimatePresence mode="wait">
              {step === "details" && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  {/* Service Info */}
                  <Card className="border-white/[0.06] bg-white/[0.03] backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
                            <service.icon className="size-5 text-red-400" />
                          </div>
                          <div>
                            <h2 className="font-semibold text-slate-100">{service.name}</h2>
                            <p className="text-sm text-slate-400">
                              {selectedPkg.name} Package
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-white/10 text-slate-300">
                          {selectedPkg.features.length} features
                        </Badge>
                      </div>

                      {/* Package selector */}
                      <div className="space-y-2 mb-4">
                        <Label className="text-slate-300 text-sm">Select Package</Label>
                        <div className="grid gap-2 sm:grid-cols-3">
                          {service.packages
                            .filter((p) => !p.isCustomQuote)
                            .map((pkg) => (
                              <button
                                key={pkg.name}
                                onClick={() => setSelectedPkg(pkg)}
                                className={`relative rounded-xl border p-3 text-left transition-all ${
                                  selectedPkg.name === pkg.name
                                    ? "border-red-500/50 bg-red-500/5"
                                    : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05]"
                                }`}
                              >
                                {pkg.isPopular && (
                                  <Badge className="absolute -top-2.5 left-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-black border-0 text-[10px] px-2 py-0">
                                    Popular
                                  </Badge>
                                )}
                                <p className="text-sm font-medium text-slate-200">{pkg.name}</p>
                                <p className="text-lg font-bold text-slate-100 mt-1">
                                  {formatPrice(pkg.price)}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                  {formatDelivery(pkg.deliveryHrs)} delivery
                                </p>
                              </button>
                            ))}
                        </div>
                      </div>

                      {/* Package features */}
                      <div className="rounded-lg bg-white/[0.02] border border-white/[0.06] p-4">
                        <p className="text-sm font-medium text-slate-300 mb-3">Included in {selectedPkg.name}:</p>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {selectedPkg.features.map((f, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-slate-400">
                              <Check className="size-3.5 text-red-400 shrink-0" />
                              {f}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Express Delivery Toggle */}
                  <Card className="border-white/[0.06] bg-white/[0.03] backdrop-blur-sm">
                    <CardContent className="p-6">
                      <button
                        onClick={() => setExpressDelivery(!expressDelivery)}
                        className="flex items-center justify-between w-full"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                            <Zap className="size-5 text-amber-400" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-slate-200">Express Delivery</p>
                            <p className="text-sm text-slate-400">
                              Get it in {formatDelivery(deliveryTime)} instead of {formatDelivery(selectedPkg.deliveryHrs)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-amber-400">
                            +{formatPrice(selectedPkg.expressFee)}
                          </span>
                          <div
                            className={`h-6 w-11 rounded-full transition-colors ${
                              expressDelivery ? "bg-red-500" : "bg-white/10"
                            }`}
                          >
                            <div
                              className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform mt-0.5 ${
                                expressDelivery ? "translate-x-5.5" : "translate-x-0.5"
                              }`}
                            />
                          </div>
                        </div>
                      </button>
                    </CardContent>
                  </Card>

                  {/* Instructions */}
                  <Card className="border-white/[0.06] bg-white/[0.03] backdrop-blur-sm">
                    <CardContent className="p-6">
                      <Label className="text-slate-300 text-sm font-medium mb-3 block">
                        Order Instructions (Optional)
                      </Label>
                      <Textarea
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        placeholder="Describe your requirements, style preferences, reference links..."
                        className="min-h-[120px] border-white/[0.08] bg-white/[0.03] text-slate-200 placeholder:text-slate-600 resize-none"
                      />
                    </CardContent>
                  </Card>

                  {/* Contact */}
                  <Card className="border-white/[0.06] bg-white/[0.03] backdrop-blur-sm">
                    <CardContent className="p-6">
                      <Label className="text-slate-300 text-sm font-medium mb-3 block">
                        Contact Number
                      </Label>
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="border-white/[0.08] bg-white/[0.03] text-slate-200"
                      />
                    </CardContent>
                  </Card>

                  <Button
                    onClick={() => setStep("payment")}
                    className="w-full h-12 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-lg shadow-red-500/20"
                  >
                    Continue to Payment
                    <ChevronDown className="size-4 ml-2 rotate-[-90deg]" />
                  </Button>
                </motion.div>
              )}

              {step === "payment" && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <Card className="border-white/[0.06] bg-white/[0.03] backdrop-blur-sm">
                    <CardContent className="p-6">
                      <h2 className="text-lg font-semibold text-slate-100 mb-1">Select Payment Method</h2>
                      <p className="text-sm text-slate-400 mb-5">
                        {process.env.NEXT_PUBLIC_NODE_ENV === "production"
                          ? "Choose your preferred payment method"
                          : "Mock payment — no real charges will be made"}
                      </p>

                      {/* Mock notice */}
                      <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 mb-5">
                        <AlertCircle className="size-4 text-amber-400 shrink-0" />
                        <p className="text-sm text-amber-300">
                          Testing Mode — payments are simulated, no real money is charged
                        </p>
                      </div>

                      <div className="space-y-3">
                        {PAYMENT_METHODS.map((method) => {
                          const Icon = method.icon;
                          const isSelected = paymentMethod === method.id;
                          return (
                            <button
                              key={method.id}
                              onClick={() => setPaymentMethod(method.id)}
                              className={`flex items-center gap-4 w-full rounded-xl border p-4 text-left transition-all ${
                                isSelected
                                  ? "border-red-500/50 bg-red-500/5"
                                  : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05]"
                              }`}
                            >
                              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ${method.color}`}>
                                <Icon className="size-5" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-slate-200">{method.name}</p>
                                <p className="text-xs text-slate-500">{method.desc}</p>
                              </div>
                              <div
                                className={`h-5 w-5 rounded-full border-2 transition-colors ${
                                  isSelected
                                    ? "border-red-500 bg-red-500"
                                    : "border-white/20"
                                }`}
                              >
                                {isSelected && <div className="h-full w-full rounded-full flex items-center justify-center">
                                  <Check className="size-3 text-white" />
                                </div>}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {error && (
                    <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3">
                      <AlertCircle className="size-4 text-red-400 shrink-0" />
                      <p className="text-sm text-red-300">{error}</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => { setStep("details"); setError(""); }}
                      className="flex-1 border-white/10 text-slate-300 hover:bg-white/5 h-12"
                    >
                      <ArrowLeft className="size-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={handlePlaceOrder}
                      disabled={!paymentMethod || isProcessing}
                      className="flex-[2] h-12 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <Loader2 className="size-5 animate-spin" />
                      ) : (
                        <>
                          Pay {formatPrice(totalPrice)}
                          <Shield className="size-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === "processing" && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <div className="relative mb-8">
                    <div className="h-20 w-20 rounded-full border-4 border-red-500/20 border-t-red-500 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CreditCard className="size-8 text-red-400" />
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-slate-100 mb-2">Processing Payment</h2>
                  <p className="text-sm text-slate-400 max-w-sm">
                    Please wait while we verify your payment. This will only take a moment...
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
                    <Shield className="size-3.5" />
                    Secure mock payment simulation
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-2">
            <Card className="border-white/[0.06] bg-white/[0.03] backdrop-blur-sm sticky top-24">
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-100 mb-4">Order Summary</h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
                      <service.icon className="size-5 text-red-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-200 truncate">{service.name}</p>
                      <p className="text-sm text-slate-400">{selectedPkg.name} Package</p>
                    </div>
                  </div>

                  <Separator className="bg-white/[0.06]" />

                  <div className="space-y-2.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Package Price</span>
                      <span className="text-slate-200">{formatPrice(selectedPkg.price)}</span>
                    </div>
                    {expressDelivery && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Express Delivery</span>
                        <span className="text-amber-400">+{formatPrice(selectedPkg.expressFee)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Delivery Time</span>
                      <span className="text-slate-200 flex items-center gap-1">
                        <Truck className="size-3.5" />
                        {formatDelivery(deliveryTime)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Revisions</span>
                      <span className="text-slate-200">
                        {selectedPkg.revisions >= 99 ? "Unlimited" : selectedPkg.revisions}
                      </span>
                    </div>
                    {paymentMethod && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Payment</span>
                        <span className="text-slate-200">
                          {PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.name}
                        </span>
                      </div>
                    )}
                  </div>

                  <Separator className="bg-white/[0.06]" />

                  <div className="flex justify-between items-center">
                    <span className="text-base font-medium text-slate-200">Total</span>
                    <span className="text-2xl font-bold text-slate-100">{formatPrice(totalPrice)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                    <Clock className="size-3.5" />
                    Estimated delivery: {formatDelivery(deliveryTime)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page wrapper with Suspense boundary ───────────────────────
export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#080E1A] flex items-center justify-center">
          <Loader2 className="size-8 text-red-400 animate-spin" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}