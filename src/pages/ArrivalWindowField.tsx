import { useId, useState } from 'react';
import { calendarArrivalWindow } from '../lib/arrivalWindow';

/** A calendar assists editing the existing shared text field; never parses or overwrites it on load. */
export default function ArrivalWindowField({ label, value, zone, onChange }: { label: string; value: string; zone: string; onChange: (value: string) => void }) {
  const id = useId();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [status, setStatus] = useState('');
  return <fieldset className="arrival-window-field">
    <legend>{label}</legend>
    <label htmlFor={`${id}-summary`}>What the group will see</label>
    <input id={`${id}-summary`} value={value} maxLength={120} onChange={event => onChange(event.target.value)} placeholder="Not decided yet, or describe a flexible window" />
    <details><summary>Choose from a calendar</summary>
      <p id={`${id}-zone`}>These times are in {zone}, the trip’s saved time zone. Leave the time blank if it is not decided. Your existing text changes only when you choose Use this date.</p>
      <div className="arrival-calendar-fields">
        <label>Date<input type="date" value={date} aria-describedby={`${id}-zone`} onChange={event => setDate(event.target.value)} /></label>
        <label>Time (optional)<input type="time" value={time} aria-describedby={`${id}-zone`} onChange={event => setTime(event.target.value)} /></label>
      </div>
      <button type="button" onClick={() => { try { onChange(calendarArrivalWindow(date, time, zone)); setStatus('Date added to your draft. Save your shared update to publish it.'); } catch (error) { setStatus(error instanceof Error ? error.message : 'Check the date and time.'); } }}>Use this date</button>
    </details>
    <p className="private-muted">A flexible window such as “morning” is fine. Leave blank if unknown.</p>
    {status && <p role="status">{status}</p>}
  </fieldset>;
}
