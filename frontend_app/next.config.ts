import type { NextConfig } from "next";

/**
 * PUBLIC_INTERFACE
 * Next.js configuration for the frontend app.
 * We avoid `output: "export"` because the CI build environment triggers a runtime
 * chunk loading error when collecting page data (Cannot find module './548.js').
 * Using the default server output resolves the issue.
 */
const nextConfig: NextConfig = {
  // Note: Avoid static export to ensure server runtime can resolve dynamic chunks.
  // output: "export",
  reactStrictMode: true,
};

export default nextConfig;
