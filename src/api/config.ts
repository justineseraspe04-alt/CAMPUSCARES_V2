/** Dev: use relative /api URLs (Vite proxy). Prod: set VITE_API_BASE_URL. */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  (import.meta.env.DEV ? '' : 'http://localhost:8080');
