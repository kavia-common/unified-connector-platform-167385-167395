"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getConnectors } from "@/lib/api";
import { AuthModals } from "@/components/auth/AuthModals";
import type { Connector } from "@/types/api";

export default function Home() {
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAuth, setShowAuth] = useState<"none" | "apiKey" | "oauth">("none");

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await getConnectors();
        if (mounted && res?.items) setConnectors(res.items.slice(0, 5));
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <div className="grid gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Dashboard</h1>
              <p className="text-sm text-gray-600">
                Manage connectors, tokens, resources, and tools.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn btn-primary" onClick={() => setShowAuth("apiKey")}>
                + API Key
              </button>
              <button className="btn" onClick={() => setShowAuth("oauth")}>
                + OAuth
              </button>
              <Link href="/connectors" className="btn">View Connectors</Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="card">
            <div className="section-title mb-2">Connectors</div>
            <div className="flex flex-col gap-2">
              <Link className="btn" href="/connectors">Manage Connectors</Link>
              <Link className="btn" href="/tokens">Manage Tokens</Link>
              <Link className="btn" href="/registry">Registry</Link>
            </div>
          </div>
          <div className="card">
            <div className="section-title mb-2">Resources</div>
            <div className="flex flex-col gap-2">
              <Link className="btn" href="/resources/jira">Jira Projects</Link>
              <Link className="btn" href="/resources/confluence">Confluence Spaces</Link>
            </div>
          </div>
          <div className="card">
            <div className="section-title mb-2">Intelligence</div>
            <div className="flex flex-col gap-2">
              <Link className="btn" href="/tools">LLM Tools Proxy</Link>
            </div>
          </div>
        </div>

        {/* Recent Connectors */}
        <div className="card">
          <div className="section-title mb-2">Recent Connectors</div>
          {loading ? (
            <div className="empty">Loading connectors...</div>
          ) : connectors.length === 0 ? (
            <div className="empty">No connectors found. Create one to get started.</div>
          ) : (
            <div className="grid gap-2">
              {connectors.map((c) => (
                <div key={c.id} className="flex items-center justify-between border rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center text-sm text-blue-700">
                      {c.provider.slice(0,2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">
                        {c.label || c.provider} <span className="text-gray-400">•</span>{" "}
                        <span className="text-gray-600 text-sm">{c.auth_method.toUpperCase()}</span>
                      </div>
                      <div className="text-xs text-gray-500">Tenant: {c.tenant_id}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`badge ${c.status === "connected" ? "success" : c.status === "error" ? "error" : "info"}`}>
                      {c.status}
                    </span>
                    <Link href={`/connectors/${c.id}`} className="btn">Open</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AuthModals open={showAuth} onClose={() => setShowAuth("none")} />
    </>
  );
}
