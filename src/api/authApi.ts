import { ApiResponse } from './apiClient';
import { API_BASE_URL, getApiHeaders, isNgrokHost } from './config';

function authErrorMessage(status: number, responseData: { message?: string } | null): string {
  if (status === 403 && isNgrokHost()) {
    return 'ngrok blocked the request. Restart the frontend after the fix, or open the app via http://localhost:5173.';
  }
  if (status === 500) {
    return 'Server error. Make sure Spring Boot is running at http://localhost:8080.';
  }
  return responseData?.message || 'API request failed';
}

export interface AuthResponseData {
  userId: number;
  fullName: string;
  email: string;
  role: string;
  message: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  role: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  role: string;
}

export function login(payload: LoginPayload) {
  const url = `${API_BASE_URL}/api/auth/login`;
  console.log('Calling login API:', url);

  return fetch(url, {
    method: 'POST',
    headers: getApiHeaders(),
    credentials: 'include',
    body: JSON.stringify({
      email: payload.email.trim(),
      password: payload.password.trim(),
      role: payload.role.toUpperCase(),
    }),
  })
    .then(async (response) => {
      const responseData = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(authErrorMessage(response.status, responseData));
      }
      return responseData as ApiResponse<AuthResponseData>;
    })
    .catch((error) => {
      if (error instanceof Error) {
        throw new Error(
          error.message.includes('Failed to fetch')
            ? 'Backend is not reachable. Make sure Spring Boot is running at http://localhost:8080.'
            : error.message
        );
      }
      throw error;
    });
}

export function register(payload: RegisterPayload) {
  const url = `${API_BASE_URL}/api/auth/register`;
  console.log('Calling register API:', url);

  return fetch(url, {
    method: 'POST',
    headers: getApiHeaders(),
    credentials: 'include',
    body: JSON.stringify({
      fullName: payload.fullName.trim(),
      email: payload.email.trim(),
      password: payload.password.trim(),
      role: payload.role.toUpperCase(),
    }),
  })
    .then(async (response) => {
      const responseData = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(authErrorMessage(response.status, responseData));
      }
      return responseData as ApiResponse<AuthResponseData>;
    })
    .catch((error) => {
      if (error instanceof Error) {
        throw new Error(
          error.message.includes('Failed to fetch')
            ? 'Backend is not reachable. Make sure Spring Boot is running at http://localhost:8080.'
            : error.message
        );
      }
      throw error;
    });
}
