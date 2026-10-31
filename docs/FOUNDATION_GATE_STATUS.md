# Foundation gate status — 2026-10-31

The stable separate site serves the isolated account-confirmation fix from `7af2bc4`, based on `db8ae3f`. The protected foundation test artifact uses `c067a91`; the integration branch contains subsequent unpublished onboarding fixes. These are intentionally different releases. No stable-site foundation activation or journey release has occurred.

| Gate | Evidence | Remaining work |
| --- | --- | --- |
| Foundation and lock correction | Both recorded in staging migration history; compatible lock, READ COMMITTED guard, empty search path and restricted function permissions reverified | Complete |
| Independent database contention | Nine PostgreSQL 17.11 scenarios passed with observed blocking/persisted assertions, including composed lock upgrade | Complete; not eight browser sessions |
| Source/build/privacy | Integration CI passed; additional private-enabled foundation-on/journey-off build passes route, bundle isolation and privacy checks | Complete for test artifact |
| Confirmation | Both designated accounts confirmed and signed in; user screenshot shows corrected tokenless account screen | Complete for those accounts; not trip membership |
| Existing three-role access/photo | Prior hosted organizer/traveler reads, writes and valid photo bytes; hosted outsider UI denial; separate localhost direct HTTP denial | Preserve evidence; not proof of new foundation flow |
| Foundation creation and invitation | SQL/client tests pass; actual creation/dashboard/retry and invited-user flow have not been exercised with genuine sessions | Fictional organizer/traveler/outsider sessions, then protected hosted test |
| Capacity via actual Auth | Native database contention passes; UI prevents full-activity selection | Run existing local two-request probe; do not describe it as eight-user contention |
| Revocation and signed URL expiry | SQL policies pass; approved fixture remains active and available | Keep traveler session, revoke exact approved target, test reads/writes/new URL denial, restore; separate uncached expiry probe |
| Photo deletion | Retry/order tests pass; approved checker journal/object remain linked | Delete only the approved checker through its owner's session; verify row/object absence |
| Recovery | Mocked recovery code/session/update checks pass; stable recovery callback user-confirmed saved | User completes genuine recovery and signs in again; no new message sent by this checkpoint |
| Hosted visual/keyboard/navigation | Corrected account screen has user-supplied rendered evidence | Foundation browser checks remain pending; no browser restriction bypass |

## Test deployment and current development

A protected static foundation Preview was published from `c067a91` with foundation on and journey/moderation off. Preview-only Vercel Authentication was verified; the stable production alias remained on `7af2bc4`. This preview is internal QA infrastructure, not customer onboarding. Later source changes described below remain unpublished pending genuine Auth gates.

The current source fixes confirmation-code exchange before navigation, independently verifies the exchanged identity, and separates recovery from ordinary confirmation. Callback work finishes its cleanup even if its UI consumer unmounts. Failed cleanup blocks the form and offers an explicit local sign-out retry. A changed current session is not deliberately cleared. The SDK publishes sessions during exchange, so server-side verified-account checks and RLS remain authoritative; client navigation is not an authorization boundary.

Root navigation and account copy now support the ordinary create-trip/join-trip journey when the foundation flag is enabled. Disabled builds retain the account screen without exposing the dashboard. No backend permissions or hosted flags changed in this source update.

Claude Opus 5.5 reviewed the generic callback/recovery design, with no additional source-file disclosure. Codex reviewed the actual edits. Mocked callback tests cover invalid identity, recovery separation, cleanup error/retained session, account switching, delayed completion, and verification retry without re-exchanging a one-use code. These are not genuine Auth or email-redemption results.

## Agent-owned testing and one session handoff

Do not ask the user to execute probes or repeat the old multi-step QA checklist. The agent runs authorized probes after access is available. The supported browser provider currently exposes the ChatGPT in-app browser, not the user's Chrome session; no secure credential-entry connector is available. Existing in-app tabs are signed out. No password/session extraction, credential reset, or new account is appropriate.

The loopback harness at `http://127.0.0.1:5175/staging.local/` renders its fictional-account sign-in form. Its earlier blank screen was reproduced as invalidated Vite optimized dependencies: SSR tests shared the dev server cache. Render tests now use a separate temporary cache, and live dependencies remain available after the tests. An HTTP 200 for the document alone was insufficient verification.

An in-app-browser tab is prepared for one user-controlled fictional traveler sign-in. Credentials stay in that normal form. Afterward the agent can run the existing capacity and expiry probes and coordinate the exact approved revoke/restore test. This does not supply the separate photo owner's session or authorize password-entry automation. Genuine recovery necessarily requires user-controlled password entry. The supported visibility command currently returns hidden even after requesting display, so a user-accessible handoff is not yet verified. Report that access limitation; do not tell the user to open unrelated Chrome or an unsupported connection card.

Remaining gates stay as listed above. Local results must not be relabeled hosted results. No new emails, real memberships, friend invitations, private imports, or destructive fixture cleanup occurred in this update. Original production and both deployed artifacts remain unchanged. Journey/maps/book/postcard integration remains separately gated.
