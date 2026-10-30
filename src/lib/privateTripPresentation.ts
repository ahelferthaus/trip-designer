/** Palau is UTC+9 year-round. Form fields always represent Palau local time. */
export function palauDateTimeInput(value: string | null): string {
  if (!value) return '';
  const instant = Date.parse(value);
  if (!Number.isFinite(instant)) return '';
  return new Date(instant + 9 * 60 * 60 * 1000).toISOString().slice(0, 16);
}

export function palauDateTimeToIso(value: string): string | null {
  if (!value) return null;
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) throw new Error('Enter a valid Palau local date and time.');
  const instant = Date.parse(`${value}:00+09:00`);
  if (!Number.isFinite(instant)) throw new Error('Enter a valid Palau local date and time.');
  const iso = new Date(instant).toISOString();
  if (palauDateTimeInput(iso) !== value) throw new Error('Enter a valid Palau local date and time.');
  return iso;
}

export function safeExternalUrl(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password ? url.href : undefined;
  } catch { return undefined; }
}
