import { apiFetch } from './apiClient';

export interface StudentRequestPayload {
  studentName: string;
  studentEmail: string;
  requestedItemName: string;
  category: string;
  reason: string;
}

export function submitRequest(payload: StudentRequestPayload) {
  return apiFetch('/requests/submit', {
    method: 'POST',
    query: { role: 'RECIPIENT' },
    body: payload,
  });
}

export function getRequestHistory(studentEmail: string) {
  // prefer path-based endpoint
  return apiFetch<any[]>(`/requests/student/${encodeURIComponent(studentEmail)}`);
}
