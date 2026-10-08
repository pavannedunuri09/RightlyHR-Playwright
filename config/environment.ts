export type Environment = 'local' | 'qa' | 'dev';

const URLS: Record<Environment, string> = {
  local: 'http://localhost:4200',

  qa: 'https://hrmsqarightlyhr.onpremise.cluster.rightlyhr.com',

  // Confirm this URL with your TL before using DEV.
  dev: 'https://hrmsdev.rightlyhr.com',
};

export function getEnvironment(): Environment {
  const environment = (
    process.env.APP_ENV || 'qa'
  ).toLowerCase();

  switch (environment) {
    case 'local':
      return 'local';

    case 'dev':
      return 'dev';

    case 'qa':
    default:
      return 'qa';
  }
}

export function getBaseUrl(): string {
  return URLS[getEnvironment()];
}

/** Ensures env hostnames work as Playwright baseURL (requires http/https). */
export function normalizeBaseUrl(raw?: string): string {
  const value = raw?.trim();
  if (!value) {
    return '';
  }
  const withoutTrailingSlash = value.replace(/\/+$/, '');
  if (/^https?:\/\//i.test(withoutTrailingSlash)) {
    return withoutTrailingSlash;
  }
  return `https://${withoutTrailingSlash.replace(/^\/+/, '')}`;
}

/** HRMS app URL from .env, with APP_ENV fallback when unset. */
export function resolveHrBaseUrl(): string {
  const fromEnv =
    process.env.RightlyHR_URL ||
    process.env.BASE_URL ||
    process.env.HRMS_BASE_URL;
  const normalized = normalizeBaseUrl(fromEnv);
  if (normalized) {
    return normalized;
  }
  return getBaseUrl();
}

export const ROUTES = {
  login: '/login',

  dashboard: '/dashboard/emp',

  manageWeekends:
    '/settings/employee-fields/manage-weekends/pending-for-submission',

  addWeekends:
    '/settings/employee-fields/add-weekends',

  updateWeekends:
    '/settings/employee-fields/update-weekends',
};