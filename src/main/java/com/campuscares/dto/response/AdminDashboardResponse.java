package com.campuscares.dto.response;

import java.util.ArrayList;
import java.util.List;

public class AdminDashboardResponse {
    private long totalDonations;
    private long approvedDonations;
    private long pendingDonations;
    private long rejectedDonations;
    private long totalInventoryItems;
    private long lowStockItems;
    private long pendingRequests;
    private long approvedRequests;
    private long rejectedRequests;
    private long releasedRequests;
    private long totalDistributedItems;
    private long beneficiariesHelped;
    private long unreadNotifications;
    private int distributionProgressPercent;
    private List<DashboardDayCount> donationActivityByDay = new ArrayList<>();
    private List<DashboardCategoryCount> requestCategoryBreakdown = new ArrayList<>();
    private List<DashboardCategoryCount> donationCategoryBreakdown = new ArrayList<>();
    private List<DashboardLogSummary> recentLogs = new ArrayList<>();
    private List<DashboardNotificationSummary> recentNotifications = new ArrayList<>();
    private List<DonationResponse> pendingDonationItems = new ArrayList<>();
    private List<StudentRequestResponse> pendingRequestItems = new ArrayList<>();
    private List<InventoryResponse> inventoryPreview = new ArrayList<>();

    public long getTotalDonations() {
        return totalDonations;
    }

    public void setTotalDonations(long totalDonations) {
        this.totalDonations = totalDonations;
    }

    public long getApprovedDonations() {
        return approvedDonations;
    }

    public void setApprovedDonations(long approvedDonations) {
        this.approvedDonations = approvedDonations;
    }

    public long getPendingDonations() {
        return pendingDonations;
    }

    public void setPendingDonations(long pendingDonations) {
        this.pendingDonations = pendingDonations;
    }

    public long getRejectedDonations() {
        return rejectedDonations;
    }

    public void setRejectedDonations(long rejectedDonations) {
        this.rejectedDonations = rejectedDonations;
    }

    public long getTotalInventoryItems() {
        return totalInventoryItems;
    }

    public void setTotalInventoryItems(long totalInventoryItems) {
        this.totalInventoryItems = totalInventoryItems;
    }

    public long getLowStockItems() {
        return lowStockItems;
    }

    public void setLowStockItems(long lowStockItems) {
        this.lowStockItems = lowStockItems;
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

    public long getRejectedRequests() {
        return rejectedRequests;
    }

    public void setRejectedRequests(long rejectedRequests) {
        this.rejectedRequests = rejectedRequests;
    }

    public long getReleasedRequests() {
        return releasedRequests;
    }

    public void setReleasedRequests(long releasedRequests) {
        this.releasedRequests = releasedRequests;
    }

    public long getTotalDistributedItems() {
        return totalDistributedItems;
    }

    public void setTotalDistributedItems(long totalDistributedItems) {
        this.totalDistributedItems = totalDistributedItems;
    }

    public long getBeneficiariesHelped() {
        return beneficiariesHelped;
    }

    public void setBeneficiariesHelped(long beneficiariesHelped) {
        this.beneficiariesHelped = beneficiariesHelped;
    }

    public long getUnreadNotifications() {
        return unreadNotifications;
    }

    public void setUnreadNotifications(long unreadNotifications) {
        this.unreadNotifications = unreadNotifications;
    }

    public int getDistributionProgressPercent() {
        return distributionProgressPercent;
    }

    public void setDistributionProgressPercent(int distributionProgressPercent) {
        this.distributionProgressPercent = distributionProgressPercent;
    }

    public List<DashboardDayCount> getDonationActivityByDay() {
        return donationActivityByDay;
    }

    public void setDonationActivityByDay(List<DashboardDayCount> donationActivityByDay) {
        this.donationActivityByDay = donationActivityByDay;
    }

    public List<DashboardCategoryCount> getRequestCategoryBreakdown() {
        return requestCategoryBreakdown;
    }

    public void setRequestCategoryBreakdown(List<DashboardCategoryCount> requestCategoryBreakdown) {
        this.requestCategoryBreakdown = requestCategoryBreakdown;
    }

    public List<DashboardCategoryCount> getDonationCategoryBreakdown() {
        return donationCategoryBreakdown;
    }

    public void setDonationCategoryBreakdown(List<DashboardCategoryCount> donationCategoryBreakdown) {
        this.donationCategoryBreakdown = donationCategoryBreakdown;
    }

    public List<DashboardLogSummary> getRecentLogs() {
        return recentLogs;
    }

    public void setRecentLogs(List<DashboardLogSummary> recentLogs) {
        this.recentLogs = recentLogs;
    }

    public List<DashboardNotificationSummary> getRecentNotifications() {
        return recentNotifications;
    }

    public void setRecentNotifications(List<DashboardNotificationSummary> recentNotifications) {
        this.recentNotifications = recentNotifications;
    }

    public List<DonationResponse> getPendingDonationItems() {
        return pendingDonationItems;
    }

    public void setPendingDonationItems(List<DonationResponse> pendingDonationItems) {
        this.pendingDonationItems = pendingDonationItems;
    }

    public List<StudentRequestResponse> getPendingRequestItems() {
        return pendingRequestItems;
    }

    public void setPendingRequestItems(List<StudentRequestResponse> pendingRequestItems) {
        this.pendingRequestItems = pendingRequestItems;
    }

    public List<InventoryResponse> getInventoryPreview() {
        return inventoryPreview;
    }

    public void setInventoryPreview(List<InventoryResponse> inventoryPreview) {
        this.inventoryPreview = inventoryPreview;
    }
}
