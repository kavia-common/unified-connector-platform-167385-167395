# Unified Connector Platform - Frontend

This Next.js app implements the Ocean Professional themed UI to:
- Authenticate via API Key and OAuth
- Manage providers/connectors per tenant
- Operate on provider resources (Jira Projects, Confluence Spaces)
- Invoke LLM tools via a unified proxy
- Manage provider registry

Environment:
- NEXT_PUBLIC_BACKEND_URL: Optional. Set to the FastAPI backend base URL (e.g., http://localhost:3001). Frontend calls are made to /api/proxy/:path* and rewritten to this URL.
- Example .env.local:
  NEXT_PUBLIC_BACKEND_URL=http://localhost:3001

Run:
- npm run dev
- Open http://localhost:3000

Notes:
- If backend is not running, some pages use safe fallbacks and show empty states.
- Auth modals are available on the Dashboard.
