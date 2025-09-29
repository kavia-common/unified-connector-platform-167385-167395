"use client";

import { useState } from "react";
import { invokeTool } from "@/lib/api";
import { Loader, ErrorBanner } from "@/components/common/Feedback";

export default function JiraProjectsPage() {
  const [tenantId, setTenantId] = useState("");
  const [connectorId, setConnectorId] = useState("");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<unknown>(null);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function search() {
    setLoading(true);
    setErr(null);
    setResult(null);
    try {
      const res = await invokeTool({
        provider: "jira",
        tool: "search_projects",
        tenant_id: tenantId,
        connector_id: connectorId || null,
        arguments: { query },
      });
      const r = (res as { result?: unknown })?.result ?? res;
      setResult(r);
    } catch (e) {
      const m = (e as { message?: string })?.message ?? "Search failed";
      setErr(m);
    } finally {
      setLoading(false);
    }
  }

  async function create() {
    setCreating(true);
    setErr(null);
    try {
      const res = await invokeTool({
        provider: "jira",
        tool: "create_project",
        tenant_id: tenantId,
        connector_id: connectorId || null,
        arguments: { name: query || "New Project" },
      });
      setResult(res?.result ?? res);
    } catch (e) {
      const m = (e as { message?: string })?.message ?? "Create failed";
      setErr(m);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="grid gap-4">
      <div className="card">
        <h1 className="text-lg font-semibold">Jira Projects</h1>
        <p className="text-sm text-gray-600">Search and create Jira projects through the unified tools proxy.</p>
      </div>

      <div className="card">
        <div className="grid md:grid-cols-4 gap-3">
          <div>
            <label className="text-sm text-gray-700">Tenant ID</label>
            <input className="input mt-1" value={tenantId} onChange={(e) => setTenantId(e.target.value)} placeholder="tenant_123" />
          </div>
          <div>
            <label className="text-sm text-gray-700">Connector ID (optional)</label>
            <input className="input mt-1" value={connectorId} onChange={(e) => setConnectorId(e.target.value)} placeholder="conn_abc" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-gray-700">Query / Name</label>
            <input className="input mt-1" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="project name or search query" />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <button className="btn btn-primary" onClick={search} disabled={loading}>{loading ? "Searching..." : "Search"}</button>
          <button className="btn" onClick={create} disabled={creating}>{creating ? "Creating..." : "Create Project"}</button>
        </div>

        <div className="mt-4">
          {err && <ErrorBanner message={err} />}
          {!err && loading && <Loader />}
          {!err && !loading && result && (
            <pre className="text-xs p-3 bg-gray-50 border rounded-md overflow-auto">{JSON.stringify(result, null, 2)}</pre>
          )}
        </div>
      </div>
    </div>
  );
}
