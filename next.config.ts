import type { NextConfig } from "next";

// Art that only changes by being replaced wholesale: let browsers reuse it for a day,
// and keep serving the cached copy while re-checking in the background.
const REUSE_FOR_A_DAY = "public, max-age=86400, stale-while-revalidate=604800";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:dir(profile|projects)/:file*",
        headers: [{ key: "Cache-Control", value: REUSE_FOR_A_DAY }],
      },
      {
        // Root-level art: the pattern and the two store badges. Without this they fall back
        // to Next's default for /public, which revalidates them on every page load.
        source: "/:file(iconpattern.webp|google-play-badge.png|app-store-badge.svg)",
        headers: [{ key: "Cache-Control", value: REUSE_FOR_A_DAY }],
      },
    ];
  },
};

export default nextConfig;
