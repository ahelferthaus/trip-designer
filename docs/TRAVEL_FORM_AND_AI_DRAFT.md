# Travel form update and proposed AI assistance

## Implemented, not released

The workspace explains the organizer/traveler purpose. Shared arrival/departure fields retain their existing text storage and now offer optional native date/time controls. Choosing a calendar value explicitly replaces the draft summary; saving is a separate action. Opening the form never parses or overwrites older free text. Unknown/flexible windows remain supported. The time-zone label comes from the existing trip; no trip dates or zones are changed.

Transfer or meeting details replaces “handoff note.” Shared updates are readable by trip members. Exact travel details remain owner-and-organizer only, as enforced by palau_travel_details_read in the original migration. Exact-time controls preserve the existing Pacific/Palau-or-UTC conversion behavior and explicitly label the entry zone separately from the trip display zone. General arbitrary-zone exact-time editing remains future work; no ambiguous daylight-saving conversion is introduced here.

## AI proposal — no live integration or credentials

Existing api/generate.ts and api/refine.ts are legacy server handlers, excluded from the static private deployment. Their in-memory IP limits are not a sufficient commercial budget control. Do not expose them to private trip data as-is.

Proposed authenticated server endpoint: requestDraft(tripId, operation, selectedFields, consentVersion, idempotencyKey). Server verifies account, active membership, per-field read permission and requested operation. It resolves authorized records itself; a caller cannot supply another member's private records or broaden scope. Private notes are excluded by default. Organizer read access is not permission to send another traveler's private data to AI: require owner field-specific opt-in, or restrict processing to the requester's own data. Resolve stored selections from field IDs/ranges and source versions. The UI previews the exact selected text and named provider before submission. Never send passport, medical, payment, booking access codes, invitation tokens, signed media URLs or session credentials.

Provider adapter: extractTravelDetails or draftNarrative returns schema-validated suggestions with source references and explicit unknown values. Provider/model/endpoint are server-allowlisted; no user-supplied URL or fallback provider. Imported itinerary text is untrusted data, never instructions. No tools, browsing, arbitrary URL fetching or model-initiated writes. Render output as text, never executable HTML. Validate dates/time zones independently; never fabricate bookings or relationships.

Drafts and caches inherit the most restrictive input privacy scope and expire. Re-check permission on every draft/cache read; scope idempotency to user, trip, operation and content hash. Record consent and field/version identifiers without raw content. The user reviews a field-by-field diff and explicitly selects destination visibility before saving through existing authorized mutations. Re-check membership and revision at save time. A private draft cannot silently become a shared narrative. No automatic emailing, invitations, bookings or membership changes.

Secrets stay in a managed server secret store, never VITE variables, browser storage, source or chat. Prefer an application-owned project key initially. Personal bring-your-own-key support would require a separately reviewed encrypted credential-vault design, deletion/rotation and per-user isolation; it is not part of this patch.

Use transactional per-user/per-trip/global spend reservations before requests, hard monthly caps, bounded input/output, timeout and concurrency limits, idempotency and a kill switch. Return clear quota/error states without retry storms. Log request IDs, provider/model and aggregate usage only, not prompts, responses, emails, keys or tokens. Provider retention/data-processing terms must be reviewed before private-data transmission.

Before implementation approval: choose OpenAI or DeepSeek, a monthly hard dollar cap, and whether the first version may process only manually selected text or also selected documents. Recommend manually selected text and draft-only output first. No provider calls, credentials, real-data transmission, or new server deployment have been performed.

An OpenAI API key is an application API credential, not a Codex sign-in session. Official setup reference: https://developers.openai.com/api/docs/quickstart . API account usage/credits must be checked separately; no subscription allowance is assumed.

Generic design reviewed by Claude Opus 5.5, without new source files or private data. Incorporated owner consent distinct from organizer read access and derived-data/cache access controls. Calendar values explicitly replace a single draft summary, with a separate save. Cross-tab stale-write protection remains a broader backend revision-handling task, not claimed fixed here.
