# General travel platform scope and integration plan

VYBR is intended to let anyone organize a trip anywhere and invite travelers. Palau is the first pilot, not the product boundary. An account can organize one trip and be a traveler on another; authority must be enforced per trip by the backend.

The isolated pilot is a deliberately limited deployment. The original repository contains the broader features below, but their presence in source is not evidence that they are deployed, secure, configured, or tested end to end. Do not describe the pilot as containing the whole original platform.

**Next foundation:** [Dashboard/create-trip implementation and exact migration scope](GENERAL_TRIP_FOUNDATION.md) is prepared behind a disabled flag. The approved migration is applied to isolated staging; the general frontend is not enabled or deployed.

## Feature and backend audit (2026-10-31)

| Capability | Original implementation evidence | Isolated pilot | Integration dependency / limitation |
| --- | --- | --- | --- |
| Any-destination trip creation | IntakePage; generateItinerary; supabaseTrips.saveCloudTrip; legacy trips table | No self-service create-trip flow | Add verified-user atomic trip + organizer membership creation; enforce ownership in database, not client role selection. Review AI backend configuration and authorization. |
| Invitations and accounts | Legacy join/passcode flow; separate pilot email-bound invitation RPC | Confirmed login, invitation acceptance, organizer copy-link UI | Complete real confirmation/recovery and invite redemption tests. Signup alone does not grant membership. Keep legacy passcodes out of the private authorization path. |
| Itinerary, personal info, checklists, activity RSVP | Legacy stores and trip pages; separate pilot RLS schema | Available through private workspace | Adapt reusable presentation components to the private trip contract. Preserve ownership, capacity and per-trip isolation. |
| Photo saving | tripPhotos uploads to trip-photos and returns public URLs; one user/slot path with upsert | Private journal attachments and signed URLs | Migrate through explicit authorized mapping. Do not treat public legacy URLs as private. Decide multiple-photo and overwrite semantics. |
| Photo books and PDF | PhotoBookPage, photoBook, bookExport; photo_books persistence, jsPDF/html2canvas | Excluded from pilot bundle/routes | Use authorized private photo retrieval; validate PDF export, CORS, layout and persistence. |
| Printed photo books | printProvider Lulu request code | Excluded | Browser VITE_LULU_API_KEY path must be replaced by authorized server-side provider integration before enablement. No purchase/order testing performed. |
| Postcards | PostcardPage; postcardProvider; postcards persistence; email/SMS/print UI | Excluded | Email/SMS fallback opens a composer but marks sent; correct delivery semantics. Referenced send-postcard-email/SMS functions are not present in local function source. Thanks.io browser-key path must move server-side. Remote function availability is unverified. |
| Maps and journey playback | LiveRouteMap, TripPlaybackPage, Mapbox | Excluded | Requires map token/configuration plus authorized location records and consent. Validate private image overlays and mobile map behavior. |
| GPS journey recording | tripTracking; trip_tracking_points and sessions; geolocation/watch and buffered writes | Excluded | Audit consent, retention, stop/logout behavior, and RLS. flushBuffer currently awaits insert without checking returned error, risking dropped points on API errors. |
| Trip movies / social features | Legacy movie, feed, explore and profile routes | Excluded | Separate scoped integration after core organizer/traveler flow; review media permissions and publication consent. |

Source boundaries: LegacyApp mounts the legacy Auth/Trip/Itinerary providers and routes. PilotApp exposes only sample, private trip, invitation, sign-in and recovery routes. Turning on legacy routes wholesale would also bring back different persistence and authentication assumptions. The original production site remains unchanged.

## Smallest secure integration sequence

1. Finish onboarding feedback and confirmation/recovery evidence. A received message is not proof of link redemption or confirmed login. Do not resend automatically after ambiguous outcomes.
2. Add a general authenticated trip dashboard and create-trip UI. Draft and review an atomic backend operation that assigns the creator organizer membership, validates trip inputs, and prevents arbitrary role grants. The operation must derive the creator from auth.uid(), assign organizer authority server-side and deny direct client role writes with RLS. Hosted schema/permission changes require separate approval. Test two organizers, multiple trips, outsider denial, repeated submissions, and invited travelers.
3. Make destination, title, dates and group capacity trip data; retain independent activity capacities. Palau remains sample content. Eight is the pilot group configuration, not a permanent platform ceiling.
4. Reuse itinerary and map presentation against the private backend. Confirm explicit geolocation consent, write errors/retries and revoked-member behavior before enabling journey recording.
5. Integrate private photo collections, then digital photo books and postcards. Add server-side delivery/printing only with provider setup, truthful status handling and explicit sending/purchase authorization. Never ship provider secrets in VITE variables.
6. Review migration of existing trips/photos separately: inventory ownership and public links, obtain import scope, preserve backups and validate access before moving any real data. Do not automatically run legacy local-trip migration.
7. Release the integrated platform on an explicitly approved production target after invitation, cross-trip isolation, recovery and private-media checks. Keep original production and private traveler content untouched until that release decision.

## Evidence limits and remaining gates

Prior synthetic organizer/traveler/outsider tests cover private-workspace access; they do not prove general trip creation, all original features, eight simultaneous browser sessions, or full recovery/onboarding. Active-session revocation/restoration, signed-URL expiry and the approved exact synthetic photo deletion remain pending live sessions. Cross-member photo moderation remains disabled pending coverage. No real trip roles, friend invitations, legacy data imports, paid provider calls or original-production changes are included in this plan.

Auth release checks must verify configured password policy, enumeration behavior and exact redirect allowlist entries. The pilot uses PKCE and a dedicated browser storage key with automatic URL session detection disabled. A code-bearing callback must not claim successful confirmation merely from URL presence; manual sign-in verifies the account. Confirm same-browser and cross-device behavior before calling onboarding complete. Repeat signup can cause additional provider confirmation sends, so the success state removes the signup form and there is no automatic resend. Preserve session isolation from the legacy client in the integrated release.
