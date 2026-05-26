package com.campuscares.dto.response;

public class RecipientStatsResponse {
    private long availableItemsCount;
    private long pendingRequests;
    private long approvedRequests;
    private long releasedRequests;

    public RecipientStatsResponse() {
    }

    public RecipientStatsResponse(
            long availableItemsCount,
            long pendingRequests,
            long approvedRequests,
            long releasedRequests) {
        this.availableItemsCount = availableItemsCount;
        this.pendingRequests = pendingRequests;
        this.approvedRequests = approvedRequests;
        this.releasedRequests = releasedRequests;
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
}
