const TYPE_LABELS: Record<string, string> = {
  DONATION_SUBMITTED: 'Donation submitted',
  DONATION_APPROVED: 'Donation approved',
  DONATION_REJECTED: 'Donation rejected',
  REQUEST_SUBMITTED: 'Request submitted',
  REQUEST_APPROVED: 'Request approved',
  REQUEST_REJECTED: 'Request rejected',
  ITEM_RELEASED: 'Item released',
  ADMIN_NEW_DONATION: 'New donation',
  ADMIN_NEW_REQUEST: 'New request',
  ADMIN_LOW_INVENTORY: 'Low inventory',
  GENERAL: 'General',
};

export function formatNotificationType(type: string): string {
  if (!type) return 'Notification';
  return TYPE_LABELS[type] || type.replace(/_/g, ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
}
