/** Dev: use relative /api URLs (Vite proxy). Prod: set VITE_API_BASE_URL. */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  (import.meta.env.DEV ? '' : 'http://localhost:8080');

export function isNgrokHost(): boolean {
  return typeof window !== 'undefined' && window.location.hostname.includes('ngrok');
}

/** Shared fetch headers; adds ngrok bypass when the app is opened via an ngrok URL. */
export function getApiHeaders(extra?: Record<string, string>): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...extra,
  };
  if (isNgrokHost()) {
    headers['ngrok-skip-browser-warning'] = 'true';
  }
  return headers;
}
