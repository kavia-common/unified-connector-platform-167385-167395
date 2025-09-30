# Proxy Validation Guide

This application uses a Next.js rewrite to forward same-origin requests under `/api/proxy/:path*` to the backend specified by `NEXT_PUBLIC_BACKEND_URL`.

- Frontend: Next.js app
- Backend: FastAPI (port 3001)

## Configuration

- `.env.local`:
  - `NEXT_PUBLIC_BACKEND_URL` should point to your backend base URL, e.g.:
    ```
    NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
    ```
- `next.config.ts`:
  - Configures a rewrite from `/api/proxy/:path*` to `${NEXT_PUBLIC_BACKEND_URL}/:path*`.
  - Logs the mapping at startup:
    ```
    [next.config] Proxy rewrite configured: { rewrite_from: "/api/proxy/:path*", rewrite_to: "<backend>/:path*" }
    ```

## How to validate the proxy for /auth/api-key

1) Start both services:
   - Backend (FastAPI) on port 3001
   - Frontend (Next.js) via `npm run dev`

2) Open: `/help/proxy-test`

3) Click "Run Test". This performs:
   - POST to `/api/proxy/auth/api-key`
   - Logs:
     - Frontend fetch URL (same-origin)
     - Backend target URL (rewrite) derived from `NEXT_PUBLIC_BACKEND_URL`
     - HTTP status, content-type, JSON flag
     - Parsed JSON or response text sample
     - Notes indicating success or likely causes of errors

4) Confirm in logs:
   - Frontend console: `[proxy-test] URLs { frontendFetchUrl, backendTargetUrl, NEXT_PUBLIC_BACKEND_URL }`
   - API client: `[api] request { method, url }`
   - Server startup: `[next.config] Proxy rewrite configured...`

## Expected result

- Backend should expose `/auth/api-key` (GET for info, POST to authenticate).
- Response should be JSON (e.g., a token response), not Next.js HTML.
- Status should be OK (200); otherwise, check backend logs, URL correctness, or connectivity.

## Troubleshooting

- If response is HTML/404:
  - Ensure `NEXT_PUBLIC_BACKEND_URL` is set and correct in `.env.local`.
  - Restart the dev server after changing env.
  - Verify backend is reachable at `<NEXT_PUBLIC_BACKEND_URL>/auth/api-key`.
  - Check `next.config.ts` startup log for the intended rewrite mapping.

- If network errors occur:
  - Confirm backend process is running and accessible.
  - Check for SSL issues if using https.
