package com.campuscares.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.Instant;

public class NotificationResponse {
    private Long id;
    private String userEmail;
    private String title;
    private String message;
    private String type;
    private boolean read;
    private Instant createdAt;

    public NotificationResponse() {
    }

    public NotificationResponse(
            Long id,
            String userEmail,
            String title,
            String message,
            String type,
            boolean read,
            Instant createdAt) {
        this.id = id;
        this.userEmail = userEmail;
        this.title = title;
        this.message = message;
        this.type = type;
        this.read = read;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    /** Backward compatibility for older clients. */
    @JsonProperty("recipientEmail")
    public String getRecipientEmail() {
        return userEmail;
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

    @JsonProperty("read")
    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
