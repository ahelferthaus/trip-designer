# Account confirmation and trip invitations

With the general foundation disabled, password sign-in defaults to `/pilot/invite`. Account confirmation emails return to `/pilot/sign-in` and intentionally contain no trip invitation token. Previously the default route always displayed an invitation form, making successful confirmation look like failed trip acceptance.

The corrective UI shows a confirmed-account next-step screen when the verified user has no valid invitation fragment. It renders no invitation form in that state. A valid invitation still uses the existing atomic, recipient-bound, expiring server acceptance. Reloading a scrubbed URL requires reopening the original invitation; no invitation tokens are persisted. Identity changes invalidate pending acceptance and clear the previous display name.

This release does not enable the general dashboard, trip creation or shared journey flags, grant roles or membership, send mail, change Auth callbacks, or expose legacy routes. The existing default route is retained for compatibility. Deployment to the separate site requires review of this corrective scope; source push is not deployment approval.

Validation includes account-ready server rendering, tokenless/malformed callbacks, in-memory invitation handoff, mocked changed-account/expired rejection, existing real PostgreSQL invitation policy tests, and normal/isolated builds. Hosted visual/navigation confirmation remains pending because browser target identification is blocked. Unit mocks are not hosted authentication evidence.

Claude Opus 5.5 reviewed the generic behavioral design only (no additional source disclosure). Its checklist highlighted returning-member navigation, token scrubbing/reopening, stale identity responses and idempotency. Existing allowlisted saved-trip returns, route-key/hash handling, identity generation checks and server idempotency remain unchanged. The new copy explicitly includes saved trip links. This is not a claim of an independent source review or new hosted browser coverage. Broader lifecycle suggestions remain outside this corrective release.

Isolated release: based on live db8ae3f, with only the confirmation UI, regression tests, and release-branch CI trigger. Foundation and journey implementations are absent, not merely hidden. No date/time edits are included. The scoped UI-only deployment was approved.
