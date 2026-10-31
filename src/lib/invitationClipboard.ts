/** Clipboard failures, including a missing API, are recoverable without revealing the link in errors. */
export async function tryCopyInvitation(write:()=>Promise<void>):Promise<'copied'|'unavailable'> {
  try { await write(); return 'copied'; } catch { return 'unavailable'; }
}
