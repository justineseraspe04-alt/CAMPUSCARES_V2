package com.campuscares.dto.response;

public class NotificationStatsResponse {
    private long totalNotifications;
    private long unreadNotifications;
    private long readNotifications;
    private String latestAlert;

    public NotificationStatsResponse() {
    }

    public NotificationStatsResponse(
            long totalNotifications,
            long unreadNotifications,
            long readNotifications,
            String latestAlert) {
        this.totalNotifications = totalNotifications;
        this.unreadNotifications = unreadNotifications;
        this.readNotifications = readNotifications;
        this.latestAlert = latestAlert;
    }

    public long getTotalNotifications() {
        return totalNotifications;
    }

    public void setTotalNotifications(long totalNotifications) {
        this.totalNotifications = totalNotifications;
    }

    public long getUnreadNotifications() {
        return unreadNotifications;
    }

    public void setUnreadNotifications(long unreadNotifications) {
        this.unreadNotifications = unreadNotifications;
    }

    public long getReadNotifications() {
        return readNotifications;
    }

    public void setReadNotifications(long readNotifications) {
        this.readNotifications = readNotifications;
    }

    public String getLatestAlert() {
        return latestAlert;
    }

    public void setLatestAlert(String latestAlert) {
        this.latestAlert = latestAlert;
    }
}
