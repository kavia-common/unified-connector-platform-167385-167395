"use client";

import React, { useState } from "react";
import { authWithApiKey, oauthInit } from "@/lib/api";
import Link from "next/link";

/**
 * PUBLIC_INTERFACE
 * Combined Auth Modal controller.
 * Props:
 * - open: "none" | "apiKey" | "oauth"
 * - onClose: () => void
 */
export function AuthModals({ open, onClose }: { open: "none" | "apiKey" | "oauth"; onClose: () => void }) {
  return (
    <>
      <ApiKeyModal open={open === "apiKey"} onClose={onClose} />
      <OAuthModal open={open === "oauth"} onClose={onClose} />
    </>
  );
}

function ModalShell({ title, children, open, onClose }: { title: string; children: React.ReactNode; open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50">
      <div className="card max-w-lg w-full">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button aria-label="Close" className="btn" onClick={onClose}>×</button>
        </div>
        <div className="hr mb-3" />
        {children}
      </div>
    </div>
  );
}

/** API Key Auth Modal */
function ApiKeyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tenantId, setTenantId] = useState("");
  const [provider, setProvider] = useState("jira");
  const [apiKey, setApiKey] = useState("");
  const [label, setLabel] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    setStatus(null);
    try {
      const res = await authWithApiKey({
        tenant_id: tenantId,
        provider,
        api_key: apiKey,
        label: label || null,
      });
      setStatus(`Success: token_id=${res.token_id}`);
    } catch (e) {
      const m = (e as { message?: string })?.message ?? "Request failed";
      setStatus(`Error: ${m}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <ModalShell title="Authenticate via API Key" open={open} onClose={onClose}>
      <div className="grid gap-3">
        <div>
          <label className="text-sm text-gray-700">Tenant ID</label>
          <input className="input mt-1" value={tenantId} onChange={(ev) => setTenantId(ev.target.value)} placeholder="tenant_123" />
        </div>
        <div>
          <label className="text-sm text-gray-700">Provider</label>
          <select className="select mt-1" value={provider} onChange={(ev) => setProvider(ev.target.value)}>
            <option value="jira">jira</option>
            <option value="confluence">confluence</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-700">API Key</label>
          <input className="input mt-1" value={apiKey} onChange={(ev) => setApiKey(ev.target.value)} placeholder="••••••" />
        </div>
        <div>
          <label className="text-sm text-gray-700">Label (optional)</label>
          <input className="input mt-1" value={label} onChange={(ev) => setLabel(ev.target.value)} placeholder="Personal Key" />
        </div>
        {status && <div className="text-sm">{status}</div>}
        <div className="flex items-center justify-end gap-2">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button disabled={busy} className="btn btn-primary" onClick={submit}>
            {busy ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

/** OAuth Modal - initiates flow and shows next steps/link */
function OAuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tenantId, setTenantId] = useState("");
  const [provider, setProvider] = useState("jira");
  const [scope, setScope] = useState("");
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function begin() {
    setBusy(true);
    setAuthUrl(null);
    try {
      const res = await oauthInit({
        tenant_id: tenantId,
        provider,
        redirect_path: "/oauth/callback",
        scope: scope ? scope.split(",").map((s) => s.trim()) : null,
        state: null,
      });
      const url = res.authorization_url;
      if (url) setAuthUrl(url);
    } catch (e) {
      const m = (e as { message?: string })?.message ?? "Request failed";
      setAuthUrl(`Error: ${m}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <ModalShell title="Authenticate via OAuth" open={open} onClose={onClose}>
      <div className="grid gap-3">
        <div>
          <label className="text-sm text-gray-700">Tenant ID</label>
          <input className="input mt-1" value={tenantId} onChange={(ev) => setTenantId(ev.target.value)} placeholder="tenant_123" />
        </div>
        <div>
          <label className="text-sm text-gray-700">Provider</label>
          <select className="select mt-1" value={provider} onChange={(ev) => setProvider(ev.target.value)}>
            <option value="jira">jira</option>
            <option value="confluence">confluence</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-700">Scope (comma separated, optional)</label>
          <input className="input mt-1" value={scope} onChange={(ev) => setScope(ev.target.value)} placeholder="read,write" />
        </div>

        {authUrl ? (
          typeof authUrl === "string" && authUrl.startsWith("http") ? (
            <div className="p-3 rounded-md border bg-blue-50 border-blue-200 text-blue-900 text-sm">
              Continue at{" "}
              <Link href={authUrl} className="underline" target="_blank">
                Authorization URL
              </Link>
            </div>
          ) : (
            <div className="p-3 rounded-md border bg-red-50 border-red-200 text-red-900 text-sm">
              {authUrl}
            </div>
          )
        ) : null}

        <div className="flex items-center justify-end gap-2">
          <button className="btn" onClick={onClose}>Close</button>
          <button disabled={busy} className="btn btn-primary" onClick={begin}>
            {busy ? "Starting..." : "Start OAuth"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
