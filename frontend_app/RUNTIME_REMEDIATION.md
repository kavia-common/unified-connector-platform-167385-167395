# Next.js Chunk Error Remediation (Cannot find module './100.js')

Purpose
- Resolve runtime errors where Next.js cannot load build chunks (e.g., "Cannot find module './100.js'").
- Ensure the app is NOT using static export mode and is running with a dynamic server runtime.

Background
- Static export (output: "export") disables server features and can break dynamic chunk resolution.
- This project requires the default server runtime so dynamic chunks are created and loaded correctly.

Remediation Steps

1) Clean build output
   - Remove stale build artifacts to prevent mismatched chunk references.
   - Safe cleanup example (keep the .next directory itself):
     macOS/Linux:
       find .next -maxdepth 1 -mindepth 1 -print -exec rm -f {} \; 2>/dev/null || true
   - Alternatively, delete the .next directory from your file explorer and let Next.js recreate it.

2) Enforce dynamic server runtime
   - Open frontend_app/next.config.ts.
   - Ensure that output: "export" is NOT set. It should remain commented out or absent.
   - The file includes inline comments describing why static export must be avoided.

3) Rebuild and start
   - Build (CI compatible): CI=true npm run build
   - Start the server: npm start

4) Verify dynamic chunks exist
   - After build, check that Next.js produced chunk files:
     - .next/static/chunks/**.js
   - The build logs should include a "First Load JS shared by all" section with chunk names, for example:
     - chunks/4bd1b696-<hash>.js
     - chunks/684-<hash>.js

5) Confirm routes render without chunk errors
   - Load these pages and check browser console for errors:
     - /
     - /connectors
     - /connectors/[id]
     - /help/proxy-test
     - /registry
     - /resources/jira
     - /resources/confluence
     - /tools
   - All should render without "Cannot find module './<n>.js'" or failed network chunk requests.

6) Proxy rewrite verification (optional)
   - next.config.ts logs at build/start:
     [next.config] Proxy rewrite configured: { rewrite_from: "/api/proxy/:path*", rewrite_to: "<backend>/:path*" }
   - See PROXY_VALIDATION.md for validating the backend proxy path behavior.

Notes
- If you re-introduce output: "export", you may see the error again. Keep server runtime enabled.
- If you change environment variables, restart the dev server.
- If issues persist, clear .next, node_modules/.cache (if present), and rebuild.

