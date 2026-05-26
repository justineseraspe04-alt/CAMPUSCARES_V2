package com.campuscares.dto.response;

public class DonationStatsResponse {
    private long totalDonations;
    private long approvedDonations;
    private long pendingDonations;
    private long rejectedDonations;
    private long studentsHelped;
    private long itemsReused;
    private String lastDonationItemName;
    private String lastDonationDateSubmitted;
    private String mostDonatedCategory;

    public DonationStatsResponse() {
    }

    public DonationStatsResponse(
            long totalDonations,
            long approvedDonations,
            long pendingDonations,
            long rejectedDonations,
            long studentsHelped,
            long itemsReused,
            String lastDonationItemName,
            String lastDonationDateSubmitted,
            String mostDonatedCategory) {
        this.totalDonations = totalDonations;
        this.approvedDonations = approvedDonations;
        this.pendingDonations = pendingDonations;
        this.rejectedDonations = rejectedDonations;
        this.studentsHelped = studentsHelped;
        this.itemsReused = itemsReused;
        this.lastDonationItemName = lastDonationItemName;
        this.lastDonationDateSubmitted = lastDonationDateSubmitted;
        this.mostDonatedCategory = mostDonatedCategory;
    }

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

    public long getStudentsHelped() {
        return studentsHelped;
    }

    public void setStudentsHelped(long studentsHelped) {
        this.studentsHelped = studentsHelped;
    }

    public long getItemsReused() {
        return itemsReused;
    }

    public void setItemsReused(long itemsReused) {
        this.itemsReused = itemsReused;
    }

    public String getLastDonationItemName() {
        return lastDonationItemName;
    }

    public void setLastDonationItemName(String lastDonationItemName) {
        this.lastDonationItemName = lastDonationItemName;
    }

    public String getLastDonationDateSubmitted() {
        return lastDonationDateSubmitted;
    }

    public void setLastDonationDateSubmitted(String lastDonationDateSubmitted) {
        this.lastDonationDateSubmitted = lastDonationDateSubmitted;
    }

    public String getMostDonatedCategory() {
        return mostDonatedCategory;
    }

    public void setMostDonatedCategory(String mostDonatedCategory) {
        this.mostDonatedCategory = mostDonatedCategory;
    }
}
