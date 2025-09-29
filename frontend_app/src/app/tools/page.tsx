"use client";

import { useState } from "react";
import { invokeTool } from "@/lib/api";
import { Loader, ErrorBanner } from "@/components/common/Feedback";

export default function ToolsPage() {
  const [provider, setProvider] = useState("jira");
  const [tool, setTool] = useState("search_projects");
  const [tenantId, setTenantId] = useState("");
  const [connectorId, setConnectorId] = useState("");
  const [args, setArgs] = useState("{}");
  const [result, setResult] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setErr(null);
    setResult(null);
    try {
      const payload = {
        provider,
        tool,
        tenant_id: tenantId,
        connector_id: connectorId || null,
        arguments: args ? (JSON.parse(args) as Record<string, unknown>) : {},
      };
      const res = await invokeTool(payload);
      setResult(res);
    } catch (e) {
      const m = (e as { message?: string })?.message ?? "Invocation failed";
      setErr(m);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-4">
      <div className="card">
        <h1 className="text-lg font-semibold">LLM Tools Proxy</h1>
        <p className="text-sm text-gray-600">Invoke provider tools via the unified proxy (developer playground).</p>
      </div>

      <div className="card">
        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <label className="text-sm text-gray-700">Provider</label>
            <select className="select mt-1" value={provider} onChange={(e) => setProvider(e.target.value)}>
              <option value="jira">jira</option>
              <option value="confluence">confluence</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-700">Tool</label>
            <input className="input mt-1" value={tool} onChange={(e) => setTool(e.target.value)} placeholder="search_projects" />
          </div>
          <div>
            <label className="text-sm text-gray-700">Tenant ID</label>
            <input className="input mt-1" value={tenantId} onChange={(e) => setTenantId(e.target.value)} placeholder="tenant_123" />
          </div>
          <div>
            <label className="text-sm text-gray-700">Connector ID (optional)</label>
            <input className="input mt-1" value={connectorId} onChange={(e) => setConnectorId(e.target.value)} placeholder="conn_abc" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-gray-700">Arguments (JSON)</label>
            <textarea className="textarea mt-1" rows={6} value={args} onChange={(e) => setArgs(e.target.value)} />
          </div>
        </div>

        <div className="flex items-center justify-end mt-3">
          <button className="btn btn-primary" onClick={run} disabled={loading}>
            {loading ? "Running..." : "Run"}
          </button>
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
