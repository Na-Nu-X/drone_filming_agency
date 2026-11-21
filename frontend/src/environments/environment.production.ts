/**
 * Production configuration. By default the API is expected behind the same
 * domain (reverse proxy `/api` -> Django). Change to an absolute URL if the
 * backend is hosted elsewhere.
 */
export const environment = {
  production: true,
  apiUrl: '/api',
};
