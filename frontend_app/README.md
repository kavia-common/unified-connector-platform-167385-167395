This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Runtime mode and chunk error remediation

If you encounter a runtime error like:

- Cannot find module './100.js'
- Cannot find module './548.js'
- Chunk not found / Cannot find module for server/app chunk

These are usually caused by building or starting the app in static export mode, which prevents dynamic chunk loading. This project intentionally uses the default server runtime.

Follow these steps to remediate and verify:

1) Clean build output
   - Remove stale build artifacts to avoid serving mismatched chunks.
   - Delete the contents of the .next folder (but not the folder itself).
     Example (non-destructive):
     - macOS/Linux: `find .next -maxdepth 1 -mindepth 1 -print -exec rm -f {} \; 2>/dev/null || true`
     - Or simply remove the .next directory from your file explorer.

2) Enforce dynamic server runtime
   - Open next.config.ts and ensure output: "export" is NOT set.
   - The file includes comments explaining that static export must remain disabled.

3) Rebuild and start
   - Build: `CI=true npm run build`
   - Start: `npm start`

4) Verify dynamic chunks exist
   - Inspect .next after build: you should see a chunks directory and JS chunk files under .next/static/chunks.
   - The build output will list shared chunks, e.g.:
     - chunks/4bd1b696-....js
     - chunks/684-....js

5) Validate routes
   - Open the following routes and confirm no chunk errors occur:
     - `/` (Dashboard)
     - `/connectors`
     - `/connectors/<id>`
     - `/help/proxy-test`
     - `/registry`
     - `/resources/jira`
     - `/resources/confluence`
     - `/tools`
   - If routes load without errors and the browser console shows no failed chunk loads, the remediation is complete.

6) Proxy rewrite confirmation (optional)
   - The server logs during build/start will show:
     `[next.config] Proxy rewrite configured: { rewrite_from: "/api/proxy/:path*", rewrite_to: "<backend>/:path*" }`
   - See PROXY_VALIDATION.md for details on testing the proxy.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
