import { env } from '@/utils/env';

/**
 * The one place that writes to the browser console. Debug and info lines appear while developing (npm run dev),
 * or in a build whose environment turns on VITE_FEATURE_API_LOGGING; warnings and errors always appear.
 * A remote error tracker (Sentry and the like) would be connected here later.
 */
const verbose = import.meta.env.DEV || env.features.apiLogging;

export const logger = {
  debug(message, ...details) {
    if (verbose) {
      console.debug(`[${env.appName}] ${message}`, ...details);
    }
  },
  info(message, ...details) {
    if (verbose) {
      console.info(`[${env.appName}] ${message}`, ...details);
    }
  },
  warn(message, ...details) {
    console.warn(`[${env.appName}] ${message}`, ...details);
  },
  error(message, ...details) {
    console.error(`[${env.appName}] ${message}`, ...details);
  },
};
