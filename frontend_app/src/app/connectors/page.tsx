"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { createConnector, deleteConnector, getConnectors } from "@/lib/api";
import { Loader, ErrorBanner } from "@/components/common/Feedback";
import type { Connector } from "@/types/api";

export default function ConnectorsPage() {
  const [items, setItems] = useState<Connector[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await getConnectors();
      const list = (res as { items?: Connector[]; total?: number })?.items ?? [];
      setItems(Array.isArray(list) ? list : []);
    } catch (e) {
      const m = (e as { message?: string })?.message ?? "Failed to load connectors";
      setErr(m);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function remove(id: string) {
    if (!confirm("Delete this connector?")) return;
    try {
      await deleteConnector(id);
      await load();
    } catch (e) {
      const m = (e as { message?: string })?.message ?? "Delete failed";
      alert(m);
    }
  }

  return (
    <div className="grid gap-4">
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Connectors</h1>
            <p className="text-sm text-gray-600">Create and manage connectors per tenant.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-primary" onClick={() => setShowCreate(true)}>+ New Connector</button>
          </div>
        </div>
      </div>

      {err && <ErrorBanner message={err} />}

      <div className="card">
        {loading ? (
          <div className="empty"><Loader /></div>
        ) : items.length === 0 ? (
          <div className="empty">No connectors yet. Create one to get started.</div>
        ) : (
          <div className="grid gap-2">
            {items.map((c) => (
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
                  <span className={`badge ${c.status === "connected" ? "success" : c.status === "error" ? "error" : "info"}`}>{c.status}</span>
                  <Link href={`/connectors/${c.id}`} className="btn">Open</Link>
                  <button className="btn btn-danger" onClick={() => remove(c.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreate && <CreateConnectorModal onClose={() => setShowCreate(false)} onCreated={load} />}
    </div>
  );
}

function CreateConnectorModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [provider, setProvider] = useState("jira");
  const [authMethod, setAuthMethod] = useState<"api_key" | "oauth">("api_key");
  const [tenantId, setTenantId] = useState("");
  const [label, setLabel] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setMessage(null);
    try {
      await createConnector({
        provider,
        auth_method: authMethod,
        tenant_id: tenantId,
        label: label || null,
      });
      setMessage("Created!");
      onCreated();
      onClose();
    } catch (e) {
      const m = (e as { message?: string })?.message ?? "Create failed";
      setMessage(m);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50">
      <div className="card max-w-lg w-full">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Create Connector</h3>
          <button aria-label="Close" className="btn" onClick={onClose}>×</button>
        </div>
        <div className="hr mb-3" />
        <div className="grid gap-3">
          <div>
            <label className="text-sm text-gray-700">Provider</label>
            <select className="select mt-1" value={provider} onChange={(e) => setProvider(e.target.value)}>
              <option value="jira">jira</option>
              <option value="confluence">confluence</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-700">Auth Method</label>
            <select className="select mt-1" value={authMethod} onChange={(e) => setAuthMethod(e.target.value as "api_key" | "oauth")}>
              <option value="api_key">API Key</option>
              <option value="oauth">OAuth</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-700">Tenant ID</label>
            <input className="input mt-1" value={tenantId} onChange={(e) => setTenantId(e.target.value)} placeholder="tenant_123" />
          </div>
          <div>
            <label className="text-sm text-gray-700">Label (optional)</label>
            <input className="input mt-1" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="My Jira" />
          </div>
          {message && <div className="text-sm">{message}</div>}
          <div className="flex items-center justify-end gap-2">
            <button className="btn" onClick={onClose}>Cancel</button>
            <button disabled={busy} className="btn btn-primary" onClick={submit}>{busy ? "Creating..." : "Create"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
