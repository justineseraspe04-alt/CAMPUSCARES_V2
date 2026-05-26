package com.campuscares.dto.request;

import jakarta.validation.constraints.NotBlank;

public class NotificationRequest {
    @NotBlank
    private String userEmail;

    @NotBlank
    private String title;

    @NotBlank
    private String message;

    private String type;

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
