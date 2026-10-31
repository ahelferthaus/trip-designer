/** Account verification never implies membership in a trip. */
export function PrivateAccountReady() {
  return <div role="status">
    <h2>Your account is confirmed</h2>
    <p>You are signed in. Confirming your email does not join a trip.</p>
    <p>To join a trip, open the separate invitation link from your organizer. If you already belong to a trip, open its saved trip link.</p>
    <p>If you arrived from an invitation but reloaded or left the page, reopen the original invitation link. The email confirmation link is not a trip invitation.</p>
  </div>;
}
