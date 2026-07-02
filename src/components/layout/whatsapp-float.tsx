"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "8801835345441";

export function WhatsAppFloat() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="fixed bottom-24 right-6 z-50 flex items-end gap-3"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Greeting tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="hidden sm:block rounded-xl bg-white/[0.08] border border-white/[0.12] backdrop-blur-xl px-4 py-2.5 shadow-lg"
          >
            <p className="text-sm font-medium text-slate-100">Chat on WhatsApp</p>
            <p className="text-xs text-slate-400 mt-0.5">Need help? Chat with us!</p>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 rotate-45 h-3 w-3 bg-white/[0.08] border-r border-t border-white/[0.12]" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="relative flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-shadow hover:shadow-xl hover:shadow-[#25D366]/50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Gentle float animation */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <MessageCircle className="size-7" strokeWidth={2.2} />
        </motion.div>

        {/* Pulse ring (continuous subtle) */}
        <motion.span
          className="absolute inset-0 rounded-full bg-[#25D366]"
          animate={{ scale: [1, 1.35, 1], opacity: [0.35, 0, 0.35] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Ping ring on mount */}
        <motion.span
          className="absolute inset-0 rounded-full bg-[#25D366]"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.8, opacity: 0 }}
          transition={{ delay: 1.4, duration: 1.5, ease: "easeOut" }}
        />
      </motion.a>
    </div>
  );
}