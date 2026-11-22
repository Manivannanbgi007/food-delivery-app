import { DISPLAY_LOCALE } from '@/utils/constants';
import { formatInstantDate } from '@/utils/dateUtils';
import { newUuid } from '@/utils/idUtils';

const MINUTE = 60_000;

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

/** Whole calendar days between a moment and now in the viewer's time zone (0 = today, 1 = yesterday). */
function daysAgo(instant, now) {
  return Math.round((startOfDay(now) - startOfDay(instant)) / 86_400_000);
}

/** '2026-10-08T21:15:00Z' -> '02:45 AM' (the viewer's time zone) */
export function formatClockTime(isoInstant) {
  return new Date(isoInstant)
    .toLocaleTimeString(DISPLAY_LOCALE, { hour: '2-digit', minute: '2-digit', hour12: true })
    .toUpperCase();
}

/**
 * The time on a conversation row: "Just now", "2min ago" within the hour, the time today ("02:45 AM"), "Yesterday",
 * then the date.
 */
export function formatConversationTime(isoInstant, now = new Date()) {
  const instant = new Date(isoInstant);
  const elapsed = now.getTime() - instant.getTime();
  if (elapsed < MINUTE) {
    return 'Just now';
  }
  if (elapsed < 60 * MINUTE) {
    return `${Math.floor(elapsed / MINUTE)}min ago`;
  }
  const days = daysAgo(instant, now);
  if (days <= 0) {
    return formatClockTime(isoInstant);
  }
  return days === 1 ? 'Yesterday' : formatInstantDate(isoInstant);
}

/** A day heading in the message list: "Today", "Yesterday" or the date. */
export function formatDayLabel(isoInstant, now = new Date()) {
  const days = daysAgo(new Date(isoInstant), now);
  if (days <= 0) {
    return 'Today';
  }
  return days === 1 ? 'Yesterday' : formatInstantDate(isoInstant);
}

/** The viewer's calendar day of a moment, to tell where a new day starts. */
export function dayKeyOf(isoInstant) {
  const date = new Date(isoInstant);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

/**
 * The messages of an infinite query (newest page first, each page oldest first) as one list, oldest first. The same
 * message in two pages (a page was read again after new messages arrived) appears once, and the order is by id.
 */
export function flattenMessagePages(pages) {
  const byId = new Map();
  for (const page of pages ?? []) {
    for (const message of page.messages) {
      byId.set(message.id, message);
    }
  }
  return [...byId.values()].sort((a, b) => a.id - b.id);
}

export function mergeWithPending(messages, pending, own) {
  const known = new Set(messages.map((message) => message.clientMessageId));
  const unconfirmed = pending
    .filter((entry) => !known.has(entry.clientMessageId))
    .map((entry, index) => ({
      id: Number.MAX_SAFE_INTEGER - pending.length + index,
      conversationId: 0,
      clientMessageId: entry.clientMessageId,
      senderUserId: 0,
      senderName: own.senderName,
      senderRole: own.fromStaff ? 'PLATFORM_ADMIN' : 'CUSTOMER',
      fromStaff: own.fromStaff,
      body: entry.body,
      createdAt: entry.createdAt,
      readAt: null,
      pending: entry,
    }));
  return [...messages, ...unconfirmed];
}

/** A new client-made id for a message (kept for the retries of that message). */
export function newClientMessageId() {
  return newUuid();
}
