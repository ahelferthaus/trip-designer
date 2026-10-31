# Foundation gate status — 2026-10-31

The stable separate site serves the isolated account-confirmation fix from `7af2bc4`, based on `db8ae3f`. The integration source is `c067a91`. These are intentionally different releases. No foundation activation or journey release has occurred.

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

## Avoiding the activation/testing cycle

A static test artifact has been prepared with foundation on, private authentication on, and journey/moderation off. It is not deployed or linked to a hosting project. A protected Preview test deployment is distinct from switching the stable live alias: it should use the existing staging backend and existing fictional accounts, no callbacks/settings changes, no emails and no real trips. Resolve the protected Preview target/scope before deployment; do not silently activate the stable site to obtain test evidence. Existing-account password sign-in does not require a new confirmation callback.

The loopback development server is also prepared for independent testing. Local Auth/HTTP results can close local probes but must not be relabeled hosted navigation results. Server startup and successful page HTTP responses do not prove that a user is signed in.

## Minimum manual sequence

1. Existing local test harness: fictional traveler signs in, runs simultaneous-full-capacity and uncached-photo-expiry probes, shares only pass/fail output. Do not share credentials or signed URLs.
2. Keep that session for coordinated exact-target revoke/restore checks. Do not revoke a user before the session is ready. Restore after testing even when a check fails.
3. Fictional photo owner signs in and deletes only the specifically approved checker entry/object. No other cleanup or cross-member moderation is authorized by this test.
4. Foundation test: fictional organizer creates a plainly synthetic trip, checks refresh and My trips, copies an email-bound invitation for the fictional traveler; outsider cannot redeem, intended traveler can redeem once, and roles persist after reload. No email delivery is needed for copied test links. Repeat on the protected hosted test artifact before live activation.
5. Recovery remains a separate genuine user-completed gate at the stable recovery route. Do not request another confirmation email or imply confirmation already proves password recovery.

Original production, real memberships, friend invitations and private imports remain outside these tests. Journey/maps/book/postcard integration remains separately gated.

Local handoff (Adrians-Laptop only): the existing harness remains at http://127.0.0.1:5175/staging.local/ (existing process preserved). The tested isolated foundation static build is separately served at http://127.0.0.1:5176/pilot/sign-in?next=%2Fpilot%2Ftrips and http://127.0.0.1:5176/pilot/trips. The latter's compiled route was checked over HTTP. These are not hosted URLs and require the laptop to remain running. Use fictional accounts only; the stable hosted site remains disabled for foundation/journey.
