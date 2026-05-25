package com.campuscares.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class StudentItemRequest {
    @NotBlank
    private String studentName;

    @Email
    @NotBlank
    private String studentEmail;

    @NotBlank
    private String requestedItemName;

    @NotBlank
    private String category;

    @NotBlank
    private String reason;

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
}

