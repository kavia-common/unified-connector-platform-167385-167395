"use client";

import { useEffect, useState } from "react";
import { deleteRegistryProvider, listRegistry, upsertRegistry } from "@/lib/api";
import { Loader, ErrorBanner } from "@/components/common/Feedback";
import type { RegistryConnector } from "@/types/api";

export default function RegistryPage() {
  const [apiKey, setApiKey] = useState("");
  const [items, setItems] = useState<RegistryConnector[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const res = await listRegistry(apiKey || null);
      const items = (res as { items?: RegistryConnector[] })?.items ?? [];
      setItems(Array.isArray(items) ? items : []);
    } catch (e) {
      const m = (e as { message?: string })?.message ?? "Failed to load registry";
      setErr(m);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { /* explicit load by button press */ }, []);

  return (
    <div className="grid gap-4">
      <div className="card">
        <h1 className="text-lg font-semibold">Registry</h1>
        <p className="text-sm text-gray-600">Manage provider registry entries. Some actions may require admin API key.</p>
      </div>

      <div className="card">
        <div className="grid md:grid-cols-4 gap-3">
          <div className="md:col-span-3">
            <label className="text-sm text-gray-700">X-API-Key (optional)</label>
            <input className="input mt-1" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="admin-key" />
          </div>
          <div className="flex items-end">
            <button className="btn btn-primary w-full" onClick={load} disabled={loading}>
              {loading ? "Loading..." : "Load Registry"}
            </button>
          </div>
        </div>
      </div>

      {err && <ErrorBanner message={err} />}

      <div className="card">
        {loading ? (
          <div className="empty"><Loader /></div>
        ) : items.length === 0 ? (
          <div className="empty">No registry entries.</div>
        ) : (
          <div className="grid gap-2">
            {items.map((it) => (
              <RegistryRow key={it.provider} item={it} apiKey={apiKey || null} onChanged={load} />
            ))}
          </div>
        )}
      </div>

      <UpsertCard apiKey={apiKey || null} onSaved={load} />
    </div>
  );
}

function RegistryRow({ item, apiKey, onChanged }: { item: RegistryConnector; apiKey: string | null; onChanged: () => void }) {
  const [busy, setBusy] = useState(false);
  async function remove() {
    if (!confirm(`Delete ${item.provider}?`)) return;
    setBusy(true);
    try {
      await deleteRegistryProvider(item.provider, apiKey);
      onChanged();
    } catch (e) {
      const m = (e as { message?: string })?.message ?? "Delete failed";
      alert(m);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="flex items-center justify-between border rounded-lg p-3">
      <div>
        <div className="font-medium">{item.display_name} <span className="text-gray-400">•</span> <span className="text-sm text-gray-600">{item.provider}</span></div>
        <div className="text-xs text-gray-500">Auth: {item.auth_methods.join(", ")}</div>
      </div>
      <div className="flex items-center gap-2">
        <button className="btn btn-danger" onClick={remove} disabled={busy}>{busy ? "..." : "Delete"}</button>
      </div>
    </div>
  );
}

function UpsertCard({ apiKey, onSaved }: { apiKey: string | null; onSaved: () => void }) {
  const [provider, setProvider] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [authMethods, setAuthMethods] = useState("api_key,oauth");
  const [metadata, setMetadata] = useState("{}");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function save() {
    setBusy(true);
    setMsg(null);
    try {
      await upsertRegistry(
        {
          provider,
          display_name: displayName,
          auth_methods: authMethods.split(",").map((s) => s.trim()).filter(Boolean),
          metadata: metadata ? (JSON.parse(metadata) as Record<string, unknown>) : {},
        },
        apiKey
      );
      setMsg("Saved.");
      onSaved();
    } catch (e) {
      const m = (e as { message?: string })?.message ?? "Save failed";
      setMsg(m);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card">
      <div className="section-title mb-2">Upsert Provider</div>
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-gray-700">Provider</label>
          <input className="input mt-1" value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="jira" />
        </div>
        <div>
          <label className="text-sm text-gray-700">Display Name</label>
          <input className="input mt-1" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Jira" />
        </div>
        <div>
          <label className="text-sm text-gray-700">Auth Methods (comma)</label>
          <input className="input mt-1" value={authMethods} onChange={(e) => setAuthMethods(e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-gray-700">Metadata (JSON)</label>
          <textarea className="textarea mt-1" rows={6} value={metadata} onChange={(e) => setMetadata(e.target.value)} />
        </div>
      </div>
      {msg && <div className="text-sm mt-2">{msg}</div>}
      <div className="flex items-center justify-end mt-3">
        <button className="btn btn-primary" onClick={save} disabled={busy}>
          {busy ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
