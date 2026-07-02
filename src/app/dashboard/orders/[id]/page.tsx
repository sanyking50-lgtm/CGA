"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, Package, Clock, CreditCard, Truck, Send, Paperclip,
  Download, User, Tag, MessageSquare, FileText, Star, Wifi, WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { OrderTimeline } from "@/components/order/order-timeline";
import { FileDropzone } from "@/components/upload/file-dropzone";
import { StarRating } from "@/components/reviews/star-rating";
import { useSocket, type SocketNewMessage, type SocketTypingData } from "@/hooks/use-socket";

const statusColors: Record<string, string> = {
  pending_payment: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  paid_pending_assign: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  assigned: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  in_progress: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  in_review: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  revision: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

const statusLabels: Record<string, string> = {
  pending_payment: "Pending Payment",
  paid_pending_assign: "Paid — Awaiting Assign",
  assigned: "Assigned to Team",
  in_progress: "In Progress",
  in_review: "In Review",
  revision: "Revision",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

interface OrderData {
  id: string;
  orderNumber: string;
  serviceType: string;
  packageName: string | null;
  packagePrice: string;
  totalPriceBdt: string;
  expressDelivery: boolean;
  expressFee: string;
  status: string;
  instructions: string | null;
  driveLink: string | null;
  deliveryUrl: string | null;
  deliveryDeadline: string | null;
  deliveredAt: string | null;
  paymentGateway: string | null;
  createdAt: string;
  assignedStaff: { id: string; name: string; avatarUrl: string | null; staffRole: string | null } | null;
  payments: { id: string; amountBdt: string; method: string | null; status: string; transactionId: string | null; createdAt: string }[];
}

interface ChatMsg {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  sender: { id: string; name: string; avatarUrl: string | null; role: string };
}

interface TypingUser {
  userId: string;
  userName: string;
}

interface OrderFile {
  id: string;
  url: string;
  name: string;
  size: number;
  fileType: string;
  uploadedBy: string;
  createdAt: string;
}

function formatPrice(price: string | number) {
  return `৳${Number(price).toLocaleString("en-BD")}`;
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-BD", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<OrderData | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [files, setFiles] = useState<OrderFile[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "chat" | "files" | "review">("overview");
  const [reviewStars, setReviewStars] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [existingReview, setExistingReview] = useState<{ id: string; stars: number; comment: string | null } | null>(null);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const {
    isConnected: socketConnected,
    joinOrder,
    leaveOrder,
    sendMessage: sendSocketMessage,
    onMessage,
    onTyping,
    emitTyping,
  } = useSocket();

  const fetchOrder = useCallback(async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
      } else {
        toast.error("Order not found");
        router.push("/dashboard/orders");
      }
    } catch { toast.error("Failed to load order"); }
    finally { setLoading(false); }
  }, [orderId, router]);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}/chat`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch { /* silent */ }
  }, [orderId]);

  const fetchFiles = useCallback(async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}/files`);
      if (res.ok) {
        const data = await res.json();
        setFiles(data.files || []);
      }
    } catch { /* silent */ }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  // Socket: join/leave order room when chat tab is active
  useEffect(() => {
    if (activeTab === "chat") {
      fetchMessages();
      joinOrder(orderId);
    }
    if (activeTab === "files") fetchFiles();
    if (activeTab === "review" && !existingReview) {
      fetch(`/api/orders/${orderId}/review`)
        .then((r) => r.json())
        .then((d) => { if (d.review) setExistingReview(d.review); })
        .catch(() => {});
    }
    return () => {
      leaveOrder(orderId);
    };
  }, [activeTab, fetchMessages, fetchFiles, orderId, joinOrder, leaveOrder]);

  // Socket: listen for real-time messages
  useEffect(() => {
    const unsub = onMessage((msg: SocketNewMessage) => {
      if (msg.orderId !== orderId) return;
      // Append optimistically; the persisted version from server will replace via fetch if needed
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === msg.tempId);
        if (exists) return prev;
        return [
          ...prev,
          {
            id: msg.tempId,
            message: msg.message,
            isRead: false,
            createdAt: msg.createdAt,
            sender: { id: msg.sender.id, name: msg.sender.email, avatarUrl: null, role: msg.sender.role },
          },
        ];
      });
    });
    return unsub;
  }, [onMessage, orderId]);

  // Socket: typing indicators
  useEffect(() => {
    const unsub = onTyping((data: SocketTypingData) => {
      if (data.orderId !== orderId) return;
      setTypingUsers((prev) => {
        if (data.isTyping) {
          if (prev.some((u) => u.userId === data.userId)) return prev;
          return [...prev, { userId: data.userId, userName: data.userName }];
        }
        return prev.filter((u) => u.userId !== data.userId);
      });
    });
    return unsub;
  }, [onTyping, orderId]);

  // Clear typing after 3s of no activity
  useEffect(() => {
    if (typingUsers.length === 0) return;
    const t = setTimeout(() => setTypingUsers([]), 3000);
    return () => clearTimeout(t);
  }, [typingUsers]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!newMessage.trim() || sending) return;
    const msgText = newMessage.trim();
    setSending(true);
    setNewMessage("");

    // Try socket first for real-time delivery, fall back to HTTP
    if (socketConnected) {
      sendSocketMessage(orderId, msgText);
      setSending(false);
      return;
    }

    // HTTP fallback
    try {
      const res = await fetch(`/api/orders/${orderId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msgText }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
      } else {
        setNewMessage(msgText);
        toast.error("Failed to send message");
      }
    } catch {
      setNewMessage(msgText);
      toast.error("Failed to send message");
    }
    finally { setSending(false); }
  }

  async function handleCancelOrder() {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
      if (res.ok) {
        toast.success("Order cancelled");
        fetchOrder();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to cancel");
      }
    } catch { toast.error("Failed to cancel order"); }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/orders")} className="text-slate-400 hover:text-slate-200 hover:bg-white/5">
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-100 font-mono">{order.orderNumber}</h1>
              <Badge variant="outline" className={statusColors[order.status] || "border-white/10 text-slate-400"}>
                {statusLabels[order.status] || order.status}
              </Badge>
              {order.expressDelivery && (
                <Badge variant="outline" className="border-amber-500/20 text-amber-400">Express</Badge>
              )}
            </div>
            <p className="text-sm text-slate-400 mt-1 capitalize">
              {order.serviceType.replace(/-/g, " ")} — {order.packageName}
            </p>
          </div>
        </div>
        {(order.status === "pending_payment" || order.status === "paid_pending_assign") && (
          <Button onClick={handleCancelOrder} variant="outline" className="border-red-500/20 text-red-400 hover:bg-red-500/10">
            Cancel Order
          </Button>
        )}
        {order.deliveryUrl && (
          <Button asChild className="bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700">
            <a href={order.deliveryUrl} target="_blank" rel="noopener noreferrer">
              <Download className="size-4 mr-2" />
              Download Delivery
            </a>
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-white/[0.03] border border-white/[0.06] p-1">
        {(["overview", "chat", "files", "review"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-white/[0.06] text-slate-100"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {tab === "overview" && <><Package className="size-4 inline mr-1.5" />Overview</>}
            {tab === "chat" && <><MessageSquare className="size-4 inline mr-1.5" />Chat</>}
            {tab === "files" && <><Paperclip className="size-4 inline mr-1.5" />Files</>}
            {tab === "review" && <><Star className="size-4 inline mr-1.5" />Review</>}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left: Timeline + Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Timeline */}
            <Card className="border-white/[0.06] bg-white/[0.03] backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-slate-200">Order Status</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <OrderTimeline status={order.status} />
              </CardContent>
            </Card>

            {/* Order Info */}
            <Card className="border-white/[0.06] bg-white/[0.03] backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-slate-200">Order Details</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
                      <Tag className="size-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Service</p>
                      <p className="text-sm text-slate-200 capitalize">{order.serviceType.replace(/-/g, " ")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
                      <Package className="size-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Package</p>
                      <p className="text-sm text-slate-200">{order.packageName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
                      <Truck className="size-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Delivery Deadline</p>
                      <p className="text-sm text-slate-200">{formatDate(order.deliveryDeadline)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
                      <Clock className="size-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Ordered</p>
                      <p className="text-sm text-slate-200">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {order.assignedStaff && (
                  <div className="flex items-center gap-3 rounded-lg bg-white/[0.02] border border-white/[0.06] p-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={order.assignedStaff.avatarUrl || ""} />
                      <AvatarFallback className="bg-white/10 text-xs">{order.assignedStaff.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm text-slate-200">{order.assignedStaff.name}</p>
                      <p className="text-xs text-slate-500">{order.assignedStaff.staffRole || "Team Member"}</p>
                    </div>
                  </div>
                )}

                {order.instructions && (
                  <div>
                    <p className="text-xs text-slate-500 mb-2">Your Instructions:</p>
                    <div className="rounded-lg bg-white/[0.02] border border-white/[0.06] p-3">
                      <p className="text-sm text-slate-300 whitespace-pre-wrap">{order.instructions}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right: Payment Summary */}
          <div className="space-y-6">
            <Card className="border-white/[0.06] bg-white/[0.03] backdrop-blur-sm sticky top-24">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-slate-200">Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Package</span>
                  <span className="text-slate-200">{formatPrice(order.packagePrice)}</span>
                </div>
                {order.expressDelivery && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Express Fee</span>
                    <span className="text-amber-400">+{formatPrice(order.expressFee)}</span>
                  </div>
                )}
                <Separator className="bg-white/[0.06]" />
                <div className="flex justify-between">
                  <span className="font-medium text-slate-200">Total</span>
                  <span className="text-xl font-bold text-slate-100">{formatPrice(order.totalPriceBdt)}</span>
                </div>

                <Separator className="bg-white/[0.06]" />

                {order.payments?.[0] && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Method</span>
                      <span className="text-slate-200">{order.payments[0].method}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Status</span>
                      <span className={order.payments[0].status === "paid" ? "text-emerald-400" : "text-yellow-400"}>
                        {order.payments[0].status}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Date</span>
                      <span className="text-slate-300">{formatDate(order.payments[0].createdAt)}</span>
                    </div>
                  </div>
                )}

                {order.deliveredAt && (
                  <>
                    <Separator className="bg-white/[0.06]" />
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Delivered</span>
                      <span className="text-emerald-400">{formatDate(order.deliveredAt)}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "chat" && (
        <Card className="border-white/[0.06] bg-white/[0.03] backdrop-blur-sm">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <MessageSquare className="size-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-200">Order Chat</span>
            </div>
            <div className="flex items-center gap-1.5">
              {socketConnected ? (
                <Wifi className="size-3.5 text-emerald-400" />
              ) : (
                <WifiOff className="size-3.5 text-slate-600" />
              )}
              <span className="text-[10px] text-slate-500">
                {socketConnected ? "Real-time" : "Polling"}
              </span>
            </div>
          </div>
          <CardContent className="p-0 flex flex-col h-[500px]">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageSquare className="size-10 text-slate-700 mb-3" />
                  <p className="text-sm text-slate-500">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => {
                    const isMe = msg.sender.role === "client";
                    return (
                      <div key={msg.id} className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarImage src={msg.sender.avatarUrl || ""} />
                          <AvatarFallback className="bg-white/10 text-xs">
                            {msg.sender.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`max-w-[70%] ${isMe ? "text-right" : ""}`}>
                          <p className="text-xs text-slate-500 mb-1">
                            {msg.sender.name}
                            {msg.sender.role === "admin" && " (Team)"}
                          </p>
                          <div className={`rounded-xl px-4 py-2.5 text-sm ${
                            isMe
                              ? "bg-red-500/10 text-slate-200"
                              : "bg-white/[0.04] text-slate-300"
                          }`}>
                            {msg.message}
                          </div>
                          <p className="text-[10px] text-slate-600 mt-1">{formatDate(msg.createdAt)}</p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>
              )}
            </ScrollArea>

            {/* Typing indicator */}
            {typingUsers.length > 0 && (
              <div className="px-4 py-1.5">
                <p className="text-xs text-slate-500 animate-pulse">
                  {typingUsers.map((u) => u.userName).join(", ")} typing…
                </p>
              </div>
            )}
            {/* Input */}
            <div className="border-t border-white/[0.06] p-3">
              <form
                onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                className="flex gap-2"
              >
                <Input
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    if (socketConnected) emitTyping(orderId, true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (socketConnected) emitTyping(orderId, false);
                    }
                  }}
                  onBlur={() => {
                    if (socketConnected) emitTyping(orderId, false);
                  }}
                  placeholder="Type a message..."
                  className="flex-1 border-white/[0.08] bg-white/[0.03] text-slate-200"
                  disabled={sending}
                />
                <Button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  <Send className="size-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "files" && (
        <Card className="border-white/[0.06] bg-white/[0.03] backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-slate-200">Files</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-6">
            <FileDropzone
              orderId={orderId}
              folder={`orders/${orderId}`}
              onUploadComplete={() => fetchFiles()}
            />

            {files.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-300">{files.length} file(s)</p>
                {files.map((file) => (
                  <a
                    key={file.id}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5">
                      <FileText className="size-4 text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-200 truncate">{file.name}</p>
                      <p className="text-xs text-slate-500">{formatSize(file.size)} — {formatDate(file.createdAt)}</p>
                    </div>
                    <Download className="size-4 text-red-400 shrink-0" />
                  </a>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "review" && (
        <Card className="border-white/[0.06] bg-white/[0.03] backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-slate-200">Rate This Order</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {order?.status !== "delivered" ? (
              <div className="text-center py-8">
                <Star className="size-10 text-slate-700 mx-auto mb-3" />
                <p className="text-sm text-slate-400">Reviews are available after delivery</p>
              </div>
            ) : existingReview ? (
              <div className="text-center py-8">
                <div className="flex justify-center mb-3">
                  <StarRating value={existingReview.stars} readonly size="lg" />
                </div>
                <p className="text-lg font-semibold text-slate-200 mb-1">{existingReview.stars}.0 out of 5</p>
                {existingReview.comment && (
                  <p className="text-sm text-slate-400 max-w-md mx-auto">{existingReview.comment}</p>
                )}
                <p className="text-xs text-emerald-400 mt-4">Review submitted — pending approval</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-sm text-slate-300 mb-4">How was your experience with this order?</p>
                  <div className="flex justify-center">
                    <StarRating value={reviewStars} onChange={setReviewStars} size="lg" />
                  </div>
                  {reviewStars > 0 && (
                    <p className="text-sm text-amber-400 mt-2">{reviewStars} out of 5 stars</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Your Review (optional)</label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Tell us about your experience..."
                    className="w-full min-h-[100px] rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 resize-none focus:outline-none focus:border-red-500/50"
                  />
                </div>
                <Button
                  onClick={async () => {
                    if (reviewStars === 0) { toast.error("Please select a rating"); return; }
                    setSubmittingReview(true);
                    try {
                      const res = await fetch(`/api/orders/${orderId}/review`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ stars: reviewStars, comment: reviewComment, allowPublic: true }),
                      });
                      if (res.ok) {
                        toast.success("Review submitted! It will appear after approval.");
                        setExistingReview({ id: "", stars: reviewStars, comment: reviewComment || null });
                      } else {
                        const d = await res.json();
                        toast.error(d.error || "Failed to submit");
                      }
                    } catch { toast.error("Failed to submit review"); }
                    finally { setSubmittingReview(false); }
                  }}
                  disabled={reviewStars === 0 || submittingReview}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:from-red-600 hover:to-red-700 disabled:opacity-50"
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}