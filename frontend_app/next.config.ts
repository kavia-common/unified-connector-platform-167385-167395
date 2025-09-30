import type { NextConfig } from "next";

/**
 * PUBLIC_INTERFACE
 * Next.js configuration for the frontend app with API proxy rewrites.
 * We avoid `output: "export"` because the CI build environment triggers a runtime
 * chunk loading error when collecting page data (Cannot find module './548.js').
 * Using the default server output resolves the issue.
 *
 * Rewrites:
 * - Forwards frontend requests under /api/proxy/:path* to the backend:
 *   ${process.env.NEXT_PUBLIC_BACKEND_URL}/:path*
 * This keeps browser requests same-origin and avoids CORS when hitting the backend.
 */
const nextConfig: NextConfig = {
  // Note: Avoid static export to ensure server runtime can resolve dynamic chunks.
  // output: "export",
  reactStrictMode: true,

  async rewrites() {
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, "") || "";
    // Log to help verify configuration during build/start
    // eslint-disable-next-line no-console
    console.log("[next.config] Proxy rewrite configured:", {
      NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
      rewrite_from: "/api/proxy/:path*",
      rewrite_to: backend ? `${backend}/:path*` : "(backend URL not set)",
    });

    return [
      // Primary proxy path - all backend API calls should be made under this prefix.
      {
        source: "/api/proxy/:path*",
        destination: `${backend}/:path*`,
      },
    ];
  },
};

export default nextConfig;
