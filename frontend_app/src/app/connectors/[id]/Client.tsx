"use client";

import { useCallback, useEffect, useState } from "react";
import { getConnector, updateConnector } from "@/lib/api";
import type { Connector } from "@/types/api";
import Link from "next/link";
import { Loader } from "@/components/common/Feedback";

/**
 * PUBLIC_INTERFACE
 * Client-side wrapper for Connector Detail page.
 */
export function ConnectorClient({ id }: { id: string }) {
  const [data, setData] = useState<Connector | null>(null);
  const [loading, setLoading] = useState(false);
  const [label, setLabel] = useState("");
  const [cfg, setCfg] = useState<string>("{}");
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getConnector(id);
      // Narrow ApiResult<Connector> to Connector safely
      const c = (res as Connector | { [key: string]: unknown });
      const isConnector =
        typeof c === "object" &&
        c !== null &&
        "id" in c &&
        "provider" in c &&
        "auth_method" in c &&
        "tenant_id" in c &&
        "status" in c;

      if (isConnector) {
        const conn = c as Connector;
        setData(conn);
        setLabel(conn.label || "");
        setCfg(JSON.stringify(conn.config ?? {}, null, 2));
      } else {
        // Unexpected shape; treat as not found
        setData(null);
      }
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { void load(); }, [load]);

  async function save() {
    setMsg(null);
    try {
      const payload = {
        label: label || null,
        config: cfg ? (JSON.parse(cfg) as Record<string, unknown>) : null,
      };
      await updateConnector(id, payload);
      setMsg("Saved.");
      await load();
    } catch (err) {
      const m = (err as { message?: string })?.message ?? "Save failed";
      setMsg(m);
    }
  }

  if (loading) {
    return <div className="card"><Loader /></div>;
  }

  if (!data) {
    return (
      <div className="card">
        <div className="empty">Connector not found.</div>
        <Link href="/connectors" className="btn mt-2">Back</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">{data.label || data.provider}</h1>
            <p className="text-sm text-gray-600">
              {data.provider} • {data.auth_method?.toUpperCase()} • Tenant {data.tenant_id}
            </p>
          </div>
          <Link href="/connectors" className="btn">Back</Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <div className="section-title mb-2">Status</div>
          <div className="flex items-center gap-2">
            <span className={`badge ${data.status === "connected" ? "success" : data.status === "error" ? "error" : "info"}`}>
              {data.status}
            </span>
          </div>
        </div>

        <div className="card">
          <div className="section-title mb-2">Edit</div>
          <div className="grid gap-3">
            <div>
              <label className="text-sm text-gray-700">Label</label>
              <input className="input mt-1" value={label} onChange={(e) => setLabel(e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-gray-700">Config (JSON)</label>
              <textarea className="textarea mt-1" rows={8} value={cfg} onChange={(e) => setCfg(e.target.value)} />
            </div>
            {msg && <div className="text-sm">{msg}</div>}
            <div className="flex items-center justify-end">
              <button className="btn btn-primary" onClick={save}>Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
