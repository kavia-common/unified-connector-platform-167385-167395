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

Deployment and routing (IMPORTANT):
- This app expects /api/proxy/:path* requests to be forwarded to the backend (FastAPI) and not served by static hosting or Next.js 404 pages.
- There are two supported approaches:
  1) Let Next.js handle rewrites:
     - Set NEXT_PUBLIC_BACKEND_URL to your FastAPI base URL (e.g., http://localhost:3001).
     - All browser requests to /api/proxy/... will be rewritten to ${NEXT_PUBLIC_BACKEND_URL}/... by Next.js.
     - Ensure your platform/router forwards requests to the Next.js server without intercepting /api/proxy paths.
  2) Let your reverse proxy (nginx, etc.) handle /api/proxy:
     - Route /api/proxy/ to the backend service directly (e.g., proxy_pass http://backend:3001/).
     - Route everything else to the Next.js service (port 3000).
     - Do NOT route /api/proxy to the frontend if you choose this option.

Common 404 cause:
- If NEXT_PUBLIC_BACKEND_URL is not set and your router sends /api/proxy/... to the frontend, Next.js will return a 404 HTML page. Set NEXT_PUBLIC_BACKEND_URL and restart, or proxy /api/proxy to the backend in your reverse proxy.

Notes:
- If backend is not running, some pages use safe fallbacks and show empty states.
- Auth modals are available on the Dashboard.

Troubleshooting:
- Runtime error "Cannot find module './100.js'":
  - Cause: Building as static export (output: "export") can produce missing chunk errors at runtime for dynamic routes/components.
  - Fix: This project is configured to run in server mode. Ensure you have NOT set NEXT_OUTPUT=export and do not add output:"export" in next.config.ts.
  - Clean and rebuild:
    - npm install (or npm ci)
    - npm run build
    - npm run start
  - If using dev:
    - Stop the dev server, optionally clear the .next folder, then re-run `npm run dev`.
  - Verify in logs:
    - In build/start logs you should see: `[next.config] Proxy rewrite configured: ... mode: "server"` indicating server runtime is used.
