import { LIVE_EVENT_TYPES } from '@/types/live';
import { logger } from '@/utils/logger';

/**
 * A live connection (WebSocket) that looks after itself: it reconnects when it drops, with longer and longer
 * waits (and a little randomness, so many browsers do not return at the same second after a server restart), it
 * gives up on a connection that has gone silent, and it passes on every event once.
 *
 * It knows nothing about React or the application's data: it only reports events and its status. Everything it
 * needs from outside is in the options, which also makes it easy to test.
 */

/** The status it reports: closed; connecting (first attempt); open (accepted by the server); reconnecting (waiting for or making another attempt). */

/** How many event ids are remembered to skip an event that arrives twice. */
const REMEMBERED_EVENTS = 500;

export class LiveConnection {
  options;
  socket = null;
  status = 'closed';
  started = false;
  attempts = 0;
  hasBeenOpen = false;
  retryTimer;
  /** Counts the address requests: the answer of an earlier one (before a stop or a new attempt) is ignored */
  addressRequests = 0;
  silenceTimer;
  seen = new Set();

  constructor(options) {
    this.options = {
      createSocket: (url) => new WebSocket(url),
      initialDelayMs: 1_000,
      maxDelayMs: 30_000,
      silenceLimitMs: 60_000,
      random: Math.random,
      ...options,
    };
  }

  start() {
    if (this.started) {
      return;
    }
    this.started = true;
    window.addEventListener('online', this.retryNow);
    document.addEventListener('visibilitychange', this.retryWhenVisible);
    this.connect();
  }

  stop() {
    this.started = false;
    this.addressRequests++;
    window.removeEventListener('online', this.retryNow);
    document.removeEventListener('visibilitychange', this.retryWhenVisible);
    window.clearTimeout(this.retryTimer);
    window.clearTimeout(this.silenceTimer);
    this.detach();
    this.setStatus('closed');
  }

  connect() {
    this.setStatus(this.attempts === 0 && !this.hasBeenOpen ? 'connecting' : 'reconnecting');
    let address;
    try {
      address = this.options.url();
    } catch (error) {
      this.cannotOpen(error);
      return;
    }
    if (typeof address === 'string') {
      this.open(address);
      return;
    }
    const request = ++this.addressRequests;
    address.then(
      (url) => {
        if (!this.started || request !== this.addressRequests) {
          return;
        }
        if (url === null) {
          this.scheduleRetry();
        } else {
          this.open(url);
        }
      },
      (error) => {
        if (this.started && request === this.addressRequests) {
          this.cannotOpen(error);
        }
      },
    );
  }

  /** The address carries an access token: only the kind of error is logged, never the error's text */
  cannotOpen(error) {
    logger.warn(
      'The live connection could not be opened',
      error instanceof Error ? error.name : 'unknown error',
    );
    this.scheduleRetry();
  }

  open(url) {
    let socket;
    try {
      socket = this.options.createSocket(url);
    } catch (error) {
      this.cannotOpen(error);
      return;
    }
    this.socket = socket;
    socket.onopen = () => this.watchForSilence();
    socket.onmessage = (message) => this.receive(socket, message.data);
    socket.onerror = () => socket.close();
    socket.onclose = () => this.dropped(socket);
    this.watchForSilence();
  }

  receive(socket, data) {
    if (socket !== this.socket) {
      return;
    }
    this.watchForSilence();
    const message = parse(data);
    if (!message) {
      return;
    }
    if (message.kind === 'HELLO') {
      const wasDown = this.hasBeenOpen;
      this.attempts = 0;
      this.hasBeenOpen = true;
      this.setStatus('open');
      if (wasDown) {
        this.options.onResync();
      }
    } else if (message.kind === 'EVENT' && !this.alreadySeen(message.event.id)) {
      this.options.onEvent(message.event);
    }
  }

  /** The same event twice (the server or Kafka repeated it) is passed on once. */
  alreadySeen(id) {
    if (this.seen.has(id)) {
      return true;
    }
    this.seen.add(id);
    if (this.seen.size > REMEMBERED_EVENTS) {
      const oldest = this.seen.values().next().value;
      if (oldest !== undefined) {
        this.seen.delete(oldest);
      }
    }
    return false;
  }

  /** Every message, heartbeats too, shows the connection is alive: silence for too long means it is not. */
  watchForSilence() {
    window.clearTimeout(this.silenceTimer);
    this.silenceTimer = window.setTimeout(() => {
      const socket = this.socket;
      if (!socket) {
        return;
      }
      logger.debug('The live connection went silent: connecting again');
      // A dead connection may never say "closed": do not wait for it
      this.dropped(socket);
    }, this.options.silenceLimitMs);
  }

  dropped(socket) {
    if (socket !== this.socket) {
      return;
    }
    this.detach();
    window.clearTimeout(this.silenceTimer);
    if (this.started) {
      this.scheduleRetry();
    }
  }

  /** Lets go of the current socket without its events reaching us any more. */
  detach() {
    const socket = this.socket;
    this.socket = null;
    if (socket) {
      socket.onopen = socket.onmessage = socket.onerror = socket.onclose = null;
      try {
        socket.close();
      } catch {
        // already closed
      }
    }
  }

  scheduleRetry() {
    this.setStatus('reconnecting');
    const { initialDelayMs, maxDelayMs, random } = this.options;
    const ceiling = Math.min(maxDelayMs, initialDelayMs * 2 ** this.attempts);
    // Between half and all of the ceiling
    const delay = Math.round(ceiling * (0.5 + random() / 2));
    this.attempts += 1;
    window.clearTimeout(this.retryTimer);
    this.retryTimer = window.setTimeout(() => this.connect(), delay);
  }

  /** The network is back, or the tab was brought to the front: do not wait out the delay. */
  retryNow = () => {
    if (this.started && !this.socket) {
      window.clearTimeout(this.retryTimer);
      this.attempts = 0;
      this.connect();
    }
  };

  retryWhenVisible = () => {
    if (document.visibilityState === 'visible') {
      this.retryNow();
    }
  };

  setStatus(status) {
    if (status !== this.status) {
      this.status = status;
      this.options.onStatus(status);
    }
  }
}

/** One text message from the server, or null when it is not one this application knows. */
function parse(data) {
  if (typeof data !== 'string') {
    return null;
  }
  try {
    const message = JSON.parse(data);
    if (message.kind === 'HELLO' || message.kind === 'HEARTBEAT') {
      return message;
    }
    const event = message.event;
    if (
      message.kind === 'EVENT' &&
      typeof event?.id === 'string' &&
      LIVE_EVENT_TYPES.includes(event.type)
    ) {
      return message;
    }
  } catch (error) {
    logger.debug('A live message could not be read', error);
  }
  return null;
}
