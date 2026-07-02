/**
 * Image Optimization Configuration
 *
 * Informational reference for `next.config.ts` remotePatterns.
 * These are common CDN hostnames used throughout the CGA project
 * for user avatars, blog cover images, and uploaded files.
 *
 * Example next.config.ts usage:
 * ```ts
 * images: {
 *   remotePatterns: nextImageConfig.remotePatterns,
 * },
 * ```
 */

export const nextImageConfig = {
  remotePatterns: [
    {
      protocol: "https" as const,
      hostname: "lh3.googleusercontent.com",
    },
    {
      protocol: "https" as const,
      hostname: "images.unsplash.com",
    },
    {
      protocol: "https" as const,
      hostname: "ui-avatars.com",
    },
    {
      protocol: "https" as const,
      hostname: "cdn.creategrowthagency.com",
    },
    {
      protocol: "https" as const,
      hostname: "**.supabase.co",
    },
    {
      protocol: "https" as const,
      hostname: "**.cloudinary.com",
    },
  ],
};