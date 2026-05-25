package com.campuscares.dto.request;

import jakarta.validation.constraints.NotBlank;

public class CreateNotificationRequest {
    @NotBlank
    private String recipientEmail;

    @NotBlank
    private String message;

    public String getRecipientEmail() {
        return recipientEmail;
    }

    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
