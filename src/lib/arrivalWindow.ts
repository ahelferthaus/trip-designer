export function calendarArrivalWindow(date: string, time: string, zone: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(`${date}T00:00:00Z`)) || new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date) throw new Error('Choose a valid date.');
  if (time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) throw new Error('Choose a valid time or leave it blank.');
  try { new Intl.DateTimeFormat('en', { timeZone: zone }); } catch { throw new Error('The trip time zone needs confirmation.'); }
  return `${date}${time ? ` at ${time}` : ' (time not decided)'} — ${zone}`;
}
