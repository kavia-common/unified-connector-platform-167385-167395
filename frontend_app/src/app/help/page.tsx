export default function HelpPage() {
  return (
    <div className="grid gap-4">
      <div className="card">
        <h1 className="text-lg font-semibold">Help</h1>
        <p className="text-sm text-gray-600">
          Configure NEXT_PUBLIC_BACKEND_URL in your environment to point to the backend FastAPI service.
          If not set, the UI will attempt to call relative paths.
        </p>
      </div>

      <div className="card">
        <div className="section-title mb-2">Backend endpoints used</div>
        <ul className="list-disc ml-6 text-sm text-gray-700 grid gap-1">
          <li>POST /auth/api-key</li>
          <li>POST /auth/oauth/init</li>
          <li>POST /auth/oauth/callback</li>
          <li>GET/POST/PATCH/DELETE /connectors</li>
          <li>POST /llm-proxy</li>
          <li>GET/POST/GET/DELETE /admin/registry</li>
        </ul>
      </div>
    </div>
  );
}
