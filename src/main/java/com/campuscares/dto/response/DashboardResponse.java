package com.campuscares.dto.response;

public class DashboardResponse {
    private Long totalDonations;
    private Long totalDistributedItems;
    private Long pendingRequests;
    private Long beneficiaries;

    public DashboardResponse() {
    }

    public DashboardResponse(Long totalDonations, Long totalDistributedItems, Long pendingRequests, Long beneficiaries) {
        this.totalDonations = totalDonations;
        this.totalDistributedItems = totalDistributedItems;
        this.pendingRequests = pendingRequests;
        this.beneficiaries = beneficiaries;
    }

    public Long getTotalDonations() {
        return totalDonations;
    }

    public void setTotalDonations(Long totalDonations) {
        this.totalDonations = totalDonations;
    }

    public Long getTotalDistributedItems() {
        return totalDistributedItems;
    }

    public void setTotalDistributedItems(Long totalDistributedItems) {
        this.totalDistributedItems = totalDistributedItems;
    }

    public Long getPendingRequests() {
        return pendingRequests;
    }

    public void setPendingRequests(Long pendingRequests) {
        this.pendingRequests = pendingRequests;
    }

    public Long getBeneficiaries() {
        return beneficiaries;
    }

    public void setBeneficiaries(Long beneficiaries) {
        this.beneficiaries = beneficiaries;
    }
}

