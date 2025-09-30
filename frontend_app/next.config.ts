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
    // Prefer explicit env, otherwise fall back to the known running backend URL
    const envBackend = process.env.NEXT_PUBLIC_BACKEND_URL;
    const fallback = "https://vscode-internal-32364-beta.beta01.cloud.kavia.ai:3001";
    const backendBase = (envBackend && envBackend.trim().length > 0 ? envBackend : fallback).replace(/\/*$/, "");

    // Log to help verify configuration during build/start
    // eslint-disable-next-line no-console
    console.log("[next.config] Proxy rewrite configured:", {
      NEXT_PUBLIC_BACKEND_URL: envBackend ?? "(not set, using fallback)",
      rewrite_from: "/api/proxy/:path*",
      rewrite_to: `${backendBase}/:path*`,
    });

    return [
      // Primary proxy path - all backend API calls should be made under this prefix.
      {
        source: "/api/proxy/:path*",
        destination: `${backendBase}/:path*`,
      },
    ];
  },
};

export default nextConfig;
