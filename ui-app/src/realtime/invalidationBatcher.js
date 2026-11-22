/**
 * Collects the data that went out of date and reads it again once, a moment later. An order that moves through
 * several statuses in a second, or a dozen orders at once, cause one refresh of each screen, not one per event.
 */
export class InvalidationBatcher {
  pending = new Map();
  timer;
  queryClient;
  delayMs;

  constructor(queryClient, delayMs = 400) {
    this.queryClient = queryClient;
    this.delayMs = delayMs;
  }

  add(keys) {
    for (const key of keys) {
      this.pending.set(JSON.stringify(key), key);
    }
    if (this.pending.size > 0 && this.timer === undefined) {
      this.timer = window.setTimeout(() => this.flush(), this.delayMs);
    }
  }

  /** Everything on screen is read again (after a lost connection, when events may have been missed). */
  addEverything() {
    this.pending.clear();
    this.pending.set('*', []);
    if (this.timer === undefined) {
      this.timer = window.setTimeout(() => this.flush(), this.delayMs);
    }
  }

  cancel() {
    window.clearTimeout(this.timer);
    this.timer = undefined;
    this.pending.clear();
  }

  flush() {
    const keys = [...this.pending.entries()];
    this.timer = undefined;
    this.pending.clear();
    for (const [name, key] of keys) {
      void this.queryClient.invalidateQueries(name === '*' ? undefined : { queryKey: key });
    }
  }
}
