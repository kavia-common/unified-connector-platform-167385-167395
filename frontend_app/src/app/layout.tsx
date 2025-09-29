import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

/**
 * PUBLIC_INTERFACE
 * Root layout for the Unified Connector Platform frontend.
 * Provides the global Ocean Professional theme shell with sidebar navigation,
 * top header bar, and container to render routed pages.
 */
export const metadata: Metadata = {
  title: "Unified Connector Platform",
  description:
    "Authenticate, connect, and manage third-party providers (Jira, Confluence), operate on resources, and invoke tools via a unified UI.",
  applicationName: "Unified Connector Platform",
  authors: [{ name: "UCP" }],
  keywords: ["connectors", "oauth", "api key", "jira", "confluence", "llm"],
  themeColor: "#2563EB",
};

function NavLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-50 text-[14px]"
    >
      <span>{label}</span>
    </Link>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div className="app-shell">
          {/* Sidebar */}
          <aside className="sidebar p-4">
            <div className="flex items-center gap-2 mb-6">
              <div
                aria-hidden
                className="h-8 w-8 rounded-lg"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(37,99,235,.95), rgba(37,99,235,.65))",
                }}
              />
              <div>
                <div className="font-semibold">Unified Connector</div>
                <div className="text-xs text-gray-500">Ocean Professional</div>
              </div>
            </div>

            <nav className="flex flex-col gap-1">
              <div className="section-title mb-1">Overview</div>
              <NavLink href="/" label="Dashboard" />

              <div className="section-title mt-4 mb-1">Connectors</div>
              <NavLink href="/connectors" label="Manage Connectors" />

              <div className="section-title mt-4 mb-1">Resources</div>
              <NavLink href="/resources/jira" label="Jira Projects" />
              <NavLink href="/resources/confluence" label="Confluence Spaces" />

              <div className="section-title mt-4 mb-1">Intelligence</div>
              <NavLink href="/tools" label="LLM Tools Proxy" />

              <div className="section-title mt-4 mb-1">Security</div>
              <NavLink href="/tokens" label="Token Management" />

              <div className="section-title mt-4 mb-1">Admin</div>
              <NavLink href="/registry" label="Registry" />
            </nav>

            <div className="mt-8 p-3 rounded-lg border text-xs text-gray-600">
              <div className="font-medium text-gray-800 mb-1">
                API Endpoint
              </div>
              <div className="break-all">
                Uses NEXT_PUBLIC_BACKEND_URL or relative /api/proxy route.
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="main">
            {/* Topbar */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-500">Environment</div>
                <span className="badge info">Development</span>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/help" className="btn">Help</Link>
              </div>
            </div>

            <div className="grid gap-4">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
