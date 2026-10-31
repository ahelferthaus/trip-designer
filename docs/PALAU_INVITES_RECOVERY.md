# Invitations and password recovery

Organizers can create an email-bound invitation from their private workspace, then copy and privately send the link themselves. Creation calls the existing organizer-authorized RPC; it does not send an email. Each token is accepted once, expires after seven days, and appears only in the link fragment. The link is kept in component memory, cleared on recipient edits, and removed when the trip/account view unmounts. The server remains authoritative for recipient matching, expiry, membership and capacity.

The sign-in screen links to `/pilot/recover`. Recovery requests use the current origin plus that exact path, never an arbitrary return URL. PKCE callbacks are exchanged once, removed from browser history, and must carry the SDK's `PASSWORD_RECOVERY` verifier type before the new-password form appears. The verified account must still match the exchanged account before updating. Recovery does not create trip membership. Users must open recovery mail in the browser that requested it.

## Hosting prerequisites (not changed by this code)

- Add the final deployment's exact `/pilot/recover` URL to the Auth redirect allowlist; retain the sign-in callback and existing entries.
- Verify custom SMTP/sending-domain configuration and actual confirmation/recovery delivery. Supabase's default SMTP is limited to project-team addresses and is not suitable for inviting friends. Never disable email verification to bypass this restriction.
- Decide the final isolated deployment URL and how invited people access the hosting protection. Do not replace the legacy production app or remove protection implicitly.
- Test one real, explicitly approved organizer onboarding/recovery flow before distributing invitations. Mock tests are not delivery evidence.

No emails, real invitations, credential changes, Auth settings, or production deployment are performed by tests in this change. Outstanding release tests include active-session revocation/restore, uncached signed-URL expiry, photo deletion and competing authenticated capacity requests. The existing revoke RPC cancels all pending invitations for that trip; there is no organizer restore RPC yet. Do not present those operations as completed or safe for routine real-trip administration until addressed.

References: [Supabase recovery](https://supabase.com/docs/reference/javascript/auth-resetpasswordforemail), [SMTP requirements](https://supabase.com/docs/guides/auth/auth-smtp).

## Forward fixes awaiting hosted approval

`20261031060000_palau_member_restore.sql` adds an organizer-only restore RPC and narrows revoke to the selected traveler's pending invitations (matched to the current verified account email). It rejects organizer/nonexistent targets. Restore changes old activity responses to `not_going` before enabling membership, under activity locks; repeating restore on an already-active member preserves new responses. Expired or revoked invitations remain invalid. This migration must be separately approved and applied; shipping its source changes no hosted permissions. Current staging behavior stays unchanged until then.

The client can retry a journal-row deletion after its image was removed by an earlier attempt. Empty Storage deletion results are not success: it rechecks active membership, author/organizer authority and exact row linkage, then requires the forward `palau_journal_media_absent` RPC to prove absence with trusted Storage metadata visibility. Existing objects, denied/failed proof calls, a missing unapplied RPC, revoked access and zero-row final deletes remain failures. No Storage metadata is deleted by SQL; physical deletion stays in the Storage API.

Cross-member journal moderation controls are disabled by default (`VITE_PALAU_MODERATION_ENABLED` is absent/false). Authors retain their own delete control. This is an explicit temporary release limitation while genuine cross-member HTTP moderation is untested; it does not change existing server policies. Enabling that control requires completing the moderation test and a reviewed build/config change. No feature is represented as verified merely because its DB policy tests pass.

The absence RPC checks that its definer has BYPASSRLS or superuser status; changing its owner to a restricted role makes it fail closed. Apply using the normal trusted migration role and verify ownership afterward. A final journal delete also matches the original media path, so a concurrent attachment change preserves the row. On uncertain insert/network outcomes the client retains uploaded media rather than deleting a possibly committed attachment; definite SQL rejection may attempt Storage cleanup, and any unconfirmed cleanup is reported explicitly.
