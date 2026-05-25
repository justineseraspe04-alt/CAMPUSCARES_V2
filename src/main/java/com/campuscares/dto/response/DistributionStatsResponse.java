package com.campuscares.dto.response;

public class DistributionStatsResponse {
    private long totalDistributed;
    private long beneficiariesHelped;
    private long releasedThisWeek;
    private long pendingReleases;

    public DistributionStatsResponse() {
    }

    public DistributionStatsResponse(
            long totalDistributed,
            long beneficiariesHelped,
            long releasedThisWeek,
            long pendingReleases) {
        this.totalDistributed = totalDistributed;
        this.beneficiariesHelped = beneficiariesHelped;
        this.releasedThisWeek = releasedThisWeek;
        this.pendingReleases = pendingReleases;
    }

    public long getTotalDistributed() {
        return totalDistributed;
    }

    public void setTotalDistributed(long totalDistributed) {
        this.totalDistributed = totalDistributed;
    }

    public long getBeneficiariesHelped() {
        return beneficiariesHelped;
    }

    public void setBeneficiariesHelped(long beneficiariesHelped) {
        this.beneficiariesHelped = beneficiariesHelped;
    }

    public long getReleasedThisWeek() {
        return releasedThisWeek;
    }

    public void setReleasedThisWeek(long releasedThisWeek) {
        this.releasedThisWeek = releasedThisWeek;
    }

    public long getPendingReleases() {
        return pendingReleases;
    }

    public void setPendingReleases(long pendingReleases) {
        this.pendingReleases = pendingReleases;
    }
}
