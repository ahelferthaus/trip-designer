# Isolated pilot authentication and hosting

The normal build retains the legacy application. `npm run build:pilot` uses a separate entry graph with only the sample, private trip, invitation, and `/pilot/sign-in` routes. Unknown paths, including `/auth` and `/home`, return to the sample. The pilot bundle does not import the legacy providers or local-trip migration.

Private routes use only `VITE_PALAU_SUPABASE_URL` and `VITE_PALAU_SUPABASE_PUBLISHABLE_KEY`, with `VITE_PALAU_PRIVATE_ENABLED=true`. There is no fallback to legacy `VITE_SUPABASE_*` values. The browser session namespace is `vybr-palau-pilot-auth`. All these variables are public browser configuration; never use service-role keys or secrets. Disabled configuration does not initialize an Auth client.

The user enters credentials in the dedicated pilot form. Account creation explicitly sends a confirmation email; it grants no trip membership. After confirming email, sign in normally and reopen the original invitation. The callback does not consume URL session tokens automatically. Allowlist the exact hosted `/pilot/sign-in` callback in Supabase before testing signup; avoid wildcard preview domains. Password recovery remains a separate onboarding/support requirement.

Private-trip return paths are allowlisted. Invitation tokens travel only in fragments and component memory, never query strings or local/session storage. The fragment is removed from the visible history entry. A completed sign-in returns to the invitation for server-side acceptance; leaving/reloading may require reopening the original link. Interrupted requests cannot navigate a later route, although an already-sent Auth request can complete on the server. Repeated submits are gated. Membership, verified email, invitation expiry and identity checks remain authoritative on the server.

## Static-only hosted preview

Changing the frontend entry alone does not stop Vercel's automatic `api/` function discovery. For an isolated pilot, use `npm run prepare:pilot-host` in a fresh checkout. It builds and checks the pilot graph, then produces `.vercel/output` containing only static files and Build Output API v3 routing configuration, with no functions. It refuses an existing output directory to avoid stale functions. A later approved prebuilt Preview deployment must use that artifact; do not use the normal repository auto-build and call it API-isolated. No deployment is performed by the preparation command.

Before deployment approve the Preview-only target, public pilot variables, exact Auth callback, and intended participant access through Vercel protection. Do not modify Production settings, remove protection, or promote main implicitly. Verify `/api/*` cannot execute legacy functions in the actual hosted artifact, and test sign-in, confirmation, return navigation, invitation acceptance and all three roles on the hosted origin. The current normal preview is still fail-closed until separately configured.

Local mocked tests cover redirect rejection, empty/errors, repeated submissions, confirmation requirements, interrupted requests and return links. Static bundle checks prove graph isolation. These are not evidence of successful hosted signup, email delivery, password recovery, or browser back/forward behavior against real Auth. Those checks remain required before inviting participants. Real group content and membership stay separate from the public sample and source repository.

Static artifact format reference: https://vercel.com/docs/build-output-api/configuration
