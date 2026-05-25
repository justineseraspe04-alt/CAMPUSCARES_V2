import { apiFetch } from './apiClient';

export interface RequestPayload {
  studentName: string;
  studentEmail: string;
  requestedItemName: string;
  category: string;
  reason: string;
}

export function submitRequest(payload: RequestPayload) {
  return apiFetch<any>('/requests/submit', {
    method: 'POST',
    query: { role: 'RECIPIENT' },
    body: payload,
  });
}

export function getInventory() {
  return apiFetch<any[]>('/inventory/all');
}

export function getRecommendations(studentEmail: string) {
  return apiFetch<any[]>('/recommendations/student', {
    query: { email: studentEmail },
  });
}

export function getRequestHistory(studentEmail: string) {
  return apiFetch<any[]>('/requests/by-student', {
    query: { studentEmail },
  });
}
