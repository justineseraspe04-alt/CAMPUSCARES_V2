package com.campuscares.dto.response;

public class StudentRequestResponse {
    private Long id;
    private String studentName;
    private String studentEmail;
    private String requestedItemName;
    private String category;
    private String reason;
    private String status;
    private String createdAt;

    public StudentRequestResponse() {
    }

    public StudentRequestResponse(
            Long id,
            String studentName,
            String studentEmail,
            String requestedItemName,
            String category,
            String reason,
            String status,
            String createdAt) {
        this.id = id;
        this.studentName = studentName;
        this.studentEmail = studentEmail;
        this.requestedItemName = requestedItemName;
        this.category = category;
        this.reason = reason;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
    }

    public String getRequestedItemName() {
        return requestedItemName;
    }

    public void setRequestedItemName(String requestedItemName) {
        this.requestedItemName = requestedItemName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}
