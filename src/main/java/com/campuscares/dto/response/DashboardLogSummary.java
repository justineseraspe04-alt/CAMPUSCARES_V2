package com.campuscares.dto.response;

public class DashboardLogSummary {
    private Long id;
    private String action;
    private String details;
    private String performedBy;
    private String createdAt;

    public DashboardLogSummary() {
    }

    public DashboardLogSummary(Long id, String action, String details, String performedBy, String createdAt) {
        this.id = id;
        this.action = action;
        this.details = details;
        this.performedBy = performedBy;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public String getPerformedBy() {
        return performedBy;
    }

    public void setPerformedBy(String performedBy) {
        this.performedBy = performedBy;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}
