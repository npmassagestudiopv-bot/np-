export function studioNow(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Sofia', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(now);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value || '';
  return { date: `${get('year')}-${get('month')}-${get('day')}`, minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

export function isPastStudioSlot(date: string, slot: string, now = new Date()) {
  const current = studioNow(now);
  if (date < current.date) return true;
  if (date !== current.date) return false;
  const [hour, minute] = slot.split(':').map(Number);
  return hour * 60 + minute <= current.minutes;
}

// A previous date's results or a failed request cannot certify a slot as free.
export function availabilityIsReady(date: string, location: string, checkedKey: string, loading: boolean, error: boolean) {
  return Boolean(date && location && checkedKey === `${date}|${location}` && !loading && !error);
}

export function parseAvailability(result: unknown): { takenSlots: string[]; blocked: boolean } {
  const value = result as { takenSlots?: unknown; blocked?: unknown } | null;
  if (!value || !Array.isArray(value.takenSlots) || value.takenSlots.some((slot) => typeof slot !== 'string' || !/^\d{2}:\d{2}(?::\d{2})?$/.test(slot))) {
    throw new Error('Invalid availability response');
  }
  return { takenSlots: value.takenSlots.map((slot) => slot.slice(0, 5)), blocked: value.blocked === true };
}
