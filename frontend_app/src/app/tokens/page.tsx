"use client";

import Link from "next/link";

/**
 * PUBLIC_INTERFACE
 * Token management UI (frontend only stub). Backends usually expose token listing/rotation,
 * but our provided OpenAPI spec focuses on auth flows that yield token_ids.
 * This page gives a central place to trigger auth modals (from Dashboard) and explains flow.
 */
export default function TokensPage() {
  return (
    <div className="grid gap-4">
      <div className="card">
        <h1 className="text-lg font-semibold">Token Management</h1>
        <p className="text-sm text-gray-600">
          Tokens are created via API Key or OAuth flows. Use the Dashboard actions to add tokens.
          Once stored by the backend, you can attach token_ids to connectors as needed.
        </p>
      </div>

      <div className="card">
        <div className="section-title mb-2">How it works</div>
        <ol className="list-decimal ml-5 text-sm text-gray-700 grid gap-2">
          <li>Use the Dashboard buttons to authenticate via API Key or OAuth.</li>
          <li>The backend stores a token and returns a token_id reference.</li>
          <li>Create a Connector for your tenant and provider, optionally linking an existing token_id (handled server-side).</li>
          <li>Operate on provider resources via the LLM tools proxy or dedicated pages.</li>
        </ol>
        <div className="mt-3">
          <Link href="/" className="btn btn-primary">Open Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
