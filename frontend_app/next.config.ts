import type { NextConfig } from "next";

/**
 * PUBLIC_INTERFACE
 * Next.js configuration for the frontend app with API proxy rewrites.
 * We explicitly prevent static export (output: "export") because it can cause
 * runtime chunk loading errors like "Cannot find module './100.js'".
 * Keeping server output ensures dynamic chunks are available at runtime.
 *
 * Rewrites:
 * - Forwards frontend requests under /api/proxy/:path* to the backend:
 *   ${process.env.NEXT_PUBLIC_BACKEND_URL}/:path*
 * This keeps browser requests same-origin and avoids CORS when hitting the backend.
 */

// Hard guard against accidental static export via env/config.
const requestedOutput = process.env.NEXT_OUTPUT?.toLowerCase();
if (requestedOutput === "export") {
  // eslint-disable-next-line no-console
  console.error(
    "[next.config] Refusing to build with output=export. This app must run in server mode to avoid chunk errors."
  );
  throw new Error(
    "Invalid configuration: output=export is not supported for this app. Remove NEXT_OUTPUT=export or output:'export'."
  );
}

const nextConfig: NextConfig = {
  // Explicitly do NOT set output: "export"
  // Ensures server runtime with dynamic chunk resolution.
  // output: undefined,

  reactStrictMode: true,

  async rewrites() {
    const raw = process.env.NEXT_PUBLIC_BACKEND_URL || "";
    // normalize: trim trailing slashes
    const backend = raw.replace(/\/*$/, "");
    // Log to help verify configuration during build/start
    // eslint-disable-next-line no-console
    console.log("[next.config] Proxy rewrite configured:", {
      NEXT_PUBLIC_BACKEND_URL: raw || "(not set)",
      rewrite_from: "/api/proxy/:path*",
      rewrite_to: backend ? `${backend}/:path*` : "(backend URL not set)",
      mode: "server",
    });

    // When backend is not set, route to a non-existent internal API path so it 404s clearly
    const destination = backend ? `${backend}/:path*` : "/api/__backend_not_configured__";

    return [
      // Primary proxy path - all backend API calls should be made under this prefix.
      {
        source: "/api/proxy/:path*",
        destination,
      },
    ];
  },
};

export default nextConfig;
