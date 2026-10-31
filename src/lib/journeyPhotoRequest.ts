export type JourneyPhotoState =
  | { kind: 'loading' }
  | { kind: 'ready'; url: string }
  | { kind: 'unavailable' }
  | { kind: 'expired' };

/** Single in-memory lease. Cancel on unmount/account/path change; no persistence or retry loop. */
export function requestJourneyPhoto(
  load: () => Promise<string>,
  publish: (state: JourneyPhotoState) => void,
  schedule: (expire: () => void) => () => void = expire => {
    const deadline = Date.now() + 55_000;
    const checkResume = () => { if (Date.now() >= deadline) expire(); };
    const timer = setTimeout(expire, 55_000);
    window.addEventListener('pageshow', checkResume);
    window.addEventListener('focus', checkResume);
    document.addEventListener('visibilitychange', checkResume);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('pageshow', checkResume);
      window.removeEventListener('focus', checkResume);
      document.removeEventListener('visibilitychange', checkResume);
    };
  },
  now: () => number = Date.now,
): () => void {
  let active = true;
  const deadline = now() + 55_000;
  publish({ kind: 'loading' });
  // Begin before the request: a slow response can consume the 60-second Storage TTL.
  const clearExpiry = schedule(() => {
    if (!active) return;
    active = false;
    publish({ kind: 'expired' });
  });
  void Promise.resolve().then(() => active ? load() : null).then(url => {
    if (!active) return;
    if (now() >= deadline) { active = false; clearExpiry(); publish({ kind: 'expired' }); }
    else publish(url ? { kind: 'ready', url } : { kind: 'unavailable' });
  }).catch(() => {
    if (active) { clearExpiry(); publish({ kind: 'unavailable' }); }
  });
  return () => { active = false; clearExpiry(); };
}
