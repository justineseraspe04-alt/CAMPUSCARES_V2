import { apiFetch } from './apiClient';
import { getAllInventory, getInventoryByCategory, searchInventory } from './inventoryApi';

export interface StudentRequestRecord {
  id: number;
  studentName: string;
  studentEmail: string;
  requestedItemName: string;
  category: string;
  reason: string;
  status: string;
  createdAt: string;
  pickupReferenceNumber?: string;
}

export interface RecipientDashboardStats {
  availableItemsCount: number;
  pendingRequests: number;
  approvedRequests: number;
  releasedRequests: number;
  rejectedRequests: number;
  unreadNotifications: number;
}

/** @deprecated Use RecipientDashboardStats */
export type RecipientStats = RecipientDashboardStats;

export type { RecommendationRecord } from './recommendationApi';
export { getRecommendationsForStudent as getRecommendations } from './recommendationApi';

export interface RequestPayload {
  studentName: string;
  studentEmail: string;
  requestedItemName: string;
  category: string;
  reason: string;
}

export function submitRequest(payload: RequestPayload) {
  return apiFetch<StudentRequestRecord>('/requests/submit', {
    method: 'POST',
    query: { role: 'RECIPIENT' },
    body: payload,
  });
}

export function getRequestHistory(studentEmail: string) {
  return apiFetch<StudentRequestRecord[]>(
    `/requests/student/${encodeURIComponent(studentEmail)}`
  );
}

export function getRecipientDashboardStats(studentEmail: string) {
  return apiFetch<RecipientDashboardStats>('/dashboard/recipient', {
    query: { studentEmail },
  });
}

export function getRecipientStats(studentEmail: string) {
  return getRecipientDashboardStats(studentEmail);
}

export { getAllInventory, searchInventory, getInventoryByCategory };
