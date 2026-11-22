/**
 * The application's settings, read once from the build's environment files (.env + .env.<mode>).
 * Code reads `env.apiBaseUrl` and so on, never `import.meta.env` directly: this file is the one list of settings.
 */

/**
 * OpenStreetMap's own tile servers: free, no key, but for light use only (their tile usage policy:
 * https://operations.osmfoundation.org/policies/tiles/). A busy production site sets VITE_MAP_TILE_URL to its own or a
 * paid tile server.
 */
export const OPENSTREETMAP_TILES = {
  tileUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
};

/** A setting is missing or wrong: the application cannot start (shown on the page and in the console). */
export class ConfigurationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

export function readEnvironment(raw) {
  const text = (name) => {
    const value = raw[name];
    return typeof value === 'string' ? value.trim() : '';
  };
  const required = (name) => {
    const value = text(name);
    if (!value) {
      throw new ConfigurationError(
        `${name} is not set: add it to the .env file of this environment.`,
      );
    }
    return value;
  };
  const flag = (name) => text(name).toLowerCase() === 'true';

  const timeout = Number(required('VITE_API_TIMEOUT_MS'));
  if (!Number.isInteger(timeout) || timeout <= 0) {
    throw new ConfigurationError(
      'VITE_API_TIMEOUT_MS must be a number of milliseconds, e.g. 15000.',
    );
  }

  return {
    appName: required('VITE_APP_NAME'),
    environmentName: required('VITE_APP_ENV'),
    apiBaseUrl: required('VITE_API_BASE_URL'),
    apiTimeoutMs: timeout,
    features: {
      apiLogging: flag('VITE_FEATURE_API_LOGGING'),
      queryDevtools: flag('VITE_FEATURE_QUERY_DEVTOOLS'),
      environmentBadge: flag('VITE_FEATURE_ENVIRONMENT_BADGE'),
      paymentTestHints: flag('VITE_FEATURE_PAYMENT_TEST_HINTS'),
      liveUpdates: flag('VITE_FEATURE_LIVE_UPDATES'),
      fakeLiveTracking: flag('VITE_FEATURE_FAKE_LIVE_TRACKING'),
      devAccounts: flag('VITE_FEATURE_DEV_ACCOUNTS'),
    },
    map: {
      tileUrl: text('VITE_MAP_TILE_URL') || OPENSTREETMAP_TILES.tileUrl,
      // Another tile server comes with its own credit; OpenStreetMap's otherwise
      attribution: text('VITE_MAP_TILE_ATTRIBUTION') || OPENSTREETMAP_TILES.attribution,
    },
  };
}

/** Used when the environment file is wrong, so that the application can still say what is wrong. */
const UNCONFIGURED = {
  appName: 'Front-App',
  environmentName: 'Not configured',
  apiBaseUrl: '',
  apiTimeoutMs: 15_000,
  features: {
    apiLogging: false,
    queryDevtools: false,
    environmentBadge: true,
    paymentTestHints: false,
    liveUpdates: false,
    fakeLiveTracking: false,
    devAccounts: false,
  },
  map: { ...OPENSTREETMAP_TILES },
};

function loadEnvironment() {
  try {
    return {
      environment: readEnvironment(import.meta.env),
      problem: null,
    };
  } catch (error) {
    if (error instanceof ConfigurationError) {
      return { environment: UNCONFIGURED, problem: error.message };
    }
    throw error;
  }
}

const loaded = loadEnvironment();

export const env = loaded.environment;

/** Set when a setting is missing or wrong: main.jsx then shows it instead of the application. */
export const configurationProblem = loaded.problem;
