"use client";

import React, { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * Proxy diagnostics page to POST to /api/proxy/auth/api-key and verify proxy rewrites.
 * - Logs the frontend fetch URL (same-origin /api/proxy/...).
 * - Logs the backend URL that Next.js should rewrite to, using NEXT_PUBLIC_BACKEND_URL.
 * - Confirms that the response is valid backend JSON, not Next.js 404/error HTML.
 */
export default function ProxyTestPage() {
  const [tenantId, setTenantId] = useState("tenant_test");
  const [provider, setProvider] = useState("jira");
  const [apiKey, setApiKey] = useState("dummy-key");
  const [label, setLabel] = useState("diagnostic");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<{
    frontendFetchUrl: string;
    backendTargetUrl: string;
    status: number | null;
    ok: boolean;
    contentType: string | null;
    isJson: boolean;
    isLikelyHtml: boolean;
    parsedJson?: unknown;
    textSample?: string;
    error?: string;
    notes?: string[];
  } | null>(null);

  async function runTest() {
    setRunning(true);
    setResult(null);

    const frontendPath = "/api/proxy/auth/api-key";
    const origin =
      typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    const frontendFetchUrl = new URL(frontendPath, origin).toString();

    const envBackend = process.env.NEXT_PUBLIC_BACKEND_URL || "";
    const backendBase = envBackend.replace(/\/*$/, ""); // trim trailing slashes
    const backendTargetUrl = backendBase ? `${backendBase}/auth/api-key` : "(backend URL not set)";

    const notes: string[] = [];

    // Log to console for additional diagnosis
    console.info("[proxy-test] URLs", { frontendFetchUrl, backendTargetUrl, NEXT_PUBLIC_BACKEND_URL: envBackend });

    const payload = {
      tenant_id: tenantId,
      provider,
      api_key: apiKey,
      label: label || null,
    };

    try {
      const res = await fetch(frontendFetchUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const status = res.status;
      const ok = res.ok;
      const contentType = res.headers.get("content-type");
      const isJson = !!contentType && contentType.includes("application/json");

      let parsedJson: unknown | undefined;
      let textSample: string | undefined;

      if (isJson) {
        try {
          parsedJson = await res.json();
        } catch {
          notes.push("Response advertised JSON but failed to parse.");
          // fallback to text for inspection
          const txt = await res.text();
          textSample = txt.slice(0, 800);
        }
      } else {
        const txt = await res.text();
        textSample = txt.slice(0, 800);
      }

      const sample = (textSample || "").toLowerCase();
      // Heuristic to detect Next.js error/404 HTML rather than backend JSON
      const isLikelyHtml =
        (!isJson && (sample.includes("<!doctype") || sample.includes("<html"))) ||
        sample.includes("this page could not be found") ||
        sample.includes("next.js") ||
        sample.includes("application error") ||
        sample.includes("404");

      if (isLikelyHtml) {
        notes.push("Response appears to be HTML (likely Next.js error/404) instead of backend JSON.");
        if (!envBackend) {
          notes.push("NEXT_PUBLIC_BACKEND_URL is not set. Set it to your backend base URL (e.g., http://localhost:3001) and restart dev server.");
        } else {
          notes.push("Verify that next.config.ts rewrites are active and that the backend is reachable at the configured URL.");
        }
      } else if (!ok) {
        notes.push("Non-OK HTTP status from proxy call. Check backend logs and CORS/proxy rewrite configuration.");
      } else if (isJson) {
        notes.push("Valid JSON detected from backend.");
      }

      setResult({
        frontendFetchUrl,
        backendTargetUrl,
        status,
        ok,
        contentType: contentType || null,
        isJson,
        isLikelyHtml,
        parsedJson,
        textSample,
        notes,
      });
    } catch (err) {
      const message = (err as { message?: string })?.message || "Unknown error";
      const hint = !envBackend
        ? "NEXT_PUBLIC_BACKEND_URL is not set. Add it to .env.local and restart dev server."
        : "Fetch error occurred. Backend may be down or URL unreachable.";

      setResult({
        frontendFetchUrl,
        backendTargetUrl,
        status: null,
        ok: false,
        contentType: null,
        isJson: false,
        isLikelyHtml: false,
        error: `${message}`,
        notes: [hint],
      });
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="grid gap-4">
      <div className="card">
        <h1 className="text-lg font-semibold">Proxy Diagnostics</h1>
        <p className="text-sm text-gray-600">
          Test POST to /api/proxy/auth/api-key and verify that the response comes from the backend
          (valid JSON) rather than a Next.js 404/error HTML page. Logs both the frontend fetch URL
          and the resolved backend URL.
        </p>
      </div>

      <div className="card">
        <div className="grid md:grid-cols-4 gap-3">
          <div>
            <label className="text-sm text-gray-700">Tenant ID</label>
            <input className="input mt-1" value={tenantId} onChange={(e) => setTenantId(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-gray-700">Provider</label>
            <input className="input mt-1" value={provider} onChange={(e) => setProvider(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-gray-700">API Key</label>
            <input className="input mt-1" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-gray-700">Label (optional)</label>
            <input className="input mt-1" value={label} onChange={(e) => setLabel(e.target.value)} />
          </div>
        </div>

        <div className="flex items-center justify-end mt-3">
          <button className="btn btn-primary" onClick={runTest} disabled={running}>
            {running ? "Testing..." : "Run Test"}
          </button>
        </div>
      </div>

      <div className="card">
        <div className="section-title mb-2">Outcome</div>
        {!result ? (
          <div className="empty">Run the test to see results.</div>
        ) : (
          <div className="grid gap-3 text-sm">
            <div className="grid gap-1">
              <div className="text-gray-700">Frontend fetch URL</div>
              <code className="text-xs p-2 bg-gray-50 border rounded-md break-all">
                {result.frontendFetchUrl}
              </code>
            </div>
            <div className="grid gap-1">
              <div className="text-gray-700">Backend target URL (rewrite)</div>
              <code className="text-xs p-2 bg-gray-50 border rounded-md break-all">
                {result.backendTargetUrl}
              </code>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div>Status: <span className="badge">{result.status ?? "n/a"}</span></div>
              <div>OK: <span className={`badge ${result.ok ? "success" : "error"}`}>{String(result.ok)}</span></div>
              <div>Content-Type: <span className="badge">{result.contentType ?? "n/a"}</span></div>
              <div>JSON: <span className={`badge ${result.isJson ? "success" : "warn"}`}>{String(result.isJson)}</span></div>
            </div>
            {result.notes && result.notes.length > 0 && (
              <div>
                <div className="text-gray-700 mb-1">Notes</div>
                <ul className="list-disc ml-6 grid gap-1">
                  {result.notes.map((n, i) => (<li key={i}>{n}</li>))}
                </ul>
              </div>
            )}
            {result.error && (
              <div className="p-3 rounded-md border border-red-200 bg-red-50 text-red-800">
                {result.error}
              </div>
            )}
            {result.parsedJson ? (
              <div>
                <div className="text-gray-700 mb-1">Parsed JSON</div>
                <pre className="text-xs p-3 bg-gray-50 border rounded-md overflow-auto">
                  {JSON.stringify(result.parsedJson, null, 2)}
                </pre>
              </div>
            ) : result.textSample ? (
              <div>
                <div className="text-gray-700 mb-1">Response Text Sample</div>
                <pre className="text-xs p-3 bg-gray-50 border rounded-md overflow-auto">
                  {result.textSample}
                </pre>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
