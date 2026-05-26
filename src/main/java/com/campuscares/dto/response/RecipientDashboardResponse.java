package com.campuscares.dto.response;

public class RecipientDashboardResponse {
    private long availableItemsCount;
    private long pendingRequests;
    private long approvedRequests;
    private long releasedRequests;
    private long rejectedRequests;
    private long unreadNotifications;

    public RecipientDashboardResponse() {
    }

    public RecipientDashboardResponse(
            long availableItemsCount,
            long pendingRequests,
            long approvedRequests,
            long releasedRequests,
            long rejectedRequests,
            long unreadNotifications) {
        this.availableItemsCount = availableItemsCount;
        this.pendingRequests = pendingRequests;
        this.approvedRequests = approvedRequests;
        this.releasedRequests = releasedRequests;
        this.rejectedRequests = rejectedRequests;
        this.unreadNotifications = unreadNotifications;
    }

    public long getAvailableItemsCount() {
        return availableItemsCount;
    }

    public void setAvailableItemsCount(long availableItemsCount) {
        this.availableItemsCount = availableItemsCount;
    }

    public long getPendingRequests() {
        return pendingRequests;
    }

    public void setPendingRequests(long pendingRequests) {
        this.pendingRequests = pendingRequests;
    }

    public long getApprovedRequests() {
        return approvedRequests;
    }

    public void setApprovedRequests(long approvedRequests) {
        this.approvedRequests = approvedRequests;
    }

    public long getReleasedRequests() {
        return releasedRequests;
    }

    public void setReleasedRequests(long releasedRequests) {
        this.releasedRequests = releasedRequests;
    }

    public long getRejectedRequests() {
        return rejectedRequests;
    }

    public void setRejectedRequests(long rejectedRequests) {
        this.rejectedRequests = rejectedRequests;
    }

    public long getUnreadNotifications() {
        return unreadNotifications;
    }

    public void setUnreadNotifications(long unreadNotifications) {
        this.unreadNotifications = unreadNotifications;
    }
}
