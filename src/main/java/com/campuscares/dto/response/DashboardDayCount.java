package com.campuscares.dto.response;

public class DashboardDayCount {
    private String name;
    private long donations;

    public DashboardDayCount() {
    }

    public DashboardDayCount(String name, long donations) {
        this.name = name;
        this.donations = donations;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public long getDonations() {
        return donations;
    }

    public void setDonations(long donations) {
        this.donations = donations;
    }
}
