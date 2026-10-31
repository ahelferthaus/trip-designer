export function PilotAuthFeedback({ confirmation, signup, message, onReturn }: { confirmation: boolean; signup: boolean; message: string; onReturn: () => void }) {
  return <>
      {confirmation ? <>
        <h2>Check your email</h2>
        <p>{signup ? 'Your signup request was received. If this address can be registered, check for a confirmation email. Delivery can take a few minutes.' : 'Confirm your email before signing in. Check for the confirmation email from your earlier signup.'}</p>
        <ol><li>Check your inbox and spam folder.</li><li>Open the confirmation link in the browser where you created this account.</li><li>Return here to sign in, then reopen your trip invitation.</li></ol>
        <p>Do not submit signup again while waiting. If no email arrives after a few minutes, ask for delivery help before requesting another message. Already registered? Use sign-in or password recovery.</p>
        <p>This pilot currently supports invited trips. Creating an account does not create a trip or grant organizer access.</p>
        <button type="button" onClick={() => { onReturn(); }}>Return to sign in</button>
      </> : message && <><h2>Action needed</h2><p>{message}</p></>}
  </>;
}
