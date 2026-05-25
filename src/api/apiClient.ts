import { API_BASE_URL } from './config';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

function buildUrl(path: string, query?: Record<string, string | number | boolean>) {
  const normalizedPath = path.startsWith('/api') ? path : `/api${path}`;
  const baseUrl = API_BASE_URL.replace(/\/api$/, '').replace(/\/$/, '');

  if (!baseUrl) {
    if (!query) return normalizedPath;
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    });
    const qs = params.toString();
    return qs ? `${normalizedPath}?${qs}` : normalizedPath;
  }

  const url = new URL(`${baseUrl}${normalizedPath}`);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
}

export async function apiFetch<T>(
  path: string,
  options?: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
    query?: Record<string, string | number | boolean>;
  }
): Promise<ApiResponse<T>> {
  const { method = 'GET', body, query } = options || {};
  const init: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), init);
  } catch (error) {
    throw new Error(
      'Backend is not reachable. Make sure Spring Boot is running at http://localhost:8080.'
    );
  }

  const responseData = await response.json().catch(() => null);

  if (!response.ok) {
    const message = responseData?.message || response.statusText || 'API request failed';
    throw new Error(message);
  }

  return responseData as ApiResponse<T>;
}
