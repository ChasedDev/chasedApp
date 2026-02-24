export async function postEvent(event_name: string, payload: Record<string, unknown> = {}) {
  try {
    await fetch('/api/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event_name, payload }) });
  } catch {}
}
