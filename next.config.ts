import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Prefer AVIF over WebP for clients that support it.
    // AVIF compresses ~30% smaller than WebP at equal perceptual quality,
    // reducing LCP for the hero photo on mobile.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
