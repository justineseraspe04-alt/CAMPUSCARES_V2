import { apiFetch } from './apiClient';

export interface InventoryItem {
  id: number;
  itemName: string;
  category: string;
  itemCondition: string;
  quantityAvailable: number;
  qrCode: string;
  size?: string;
  subjectOrCourse?: string;
}

export interface InventoryStats {
  totalItems: number;
  availableItems: number;
  lowStockItems: number;
  qrTrackedItems: number;
}

export function getAllInventory() {
  return apiFetch<InventoryItem[]>('/inventory/all');
}

export function searchInventory(keyword: string) {
  return apiFetch<InventoryItem[]>('/inventory/search', {
    query: { keyword },
  });
}

export function getInventoryByCategory(category: string) {
  return apiFetch<InventoryItem[]>(`/inventory/category/${encodeURIComponent(category)}`);
}

export function getInventoryStats() {
  return apiFetch<InventoryStats>('/inventory/stats');
}
