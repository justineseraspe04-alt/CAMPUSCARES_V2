import { apiFetch } from './apiClient';

export interface RecommendationRecord {
  inventoryItemId: number;
  itemName: string;
  category: string;
  condition: string;
  quantityAvailable: number;
  matchPercentage: number;
  reason: string;
  enhancedReason?: string;
  source?: string;
}

export function getRecommendationsForStudent(email: string) {
  return apiFetch<RecommendationRecord[]>('/recommendations/student', {
    query: { email },
  });
}
