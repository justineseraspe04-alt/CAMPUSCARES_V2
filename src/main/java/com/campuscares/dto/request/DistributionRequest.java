package com.campuscares.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class DistributionRequest {
    @NotBlank
    private String recipientName;

    @Email
    @NotBlank
    private String recipientEmail;

    @NotBlank
    private String itemName;

    @NotNull
    @Min(1)
    private Integer quantityReleased;

    private String remarks;

    /** When set, release is tied to an approved student request. */
    private Long requestId;

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public String getRecipientEmail() {
        return recipientEmail;
    }

    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public Integer getQuantityReleased() {
        return quantityReleased;
    }

    public void setQuantityReleased(Integer quantityReleased) {
        this.quantityReleased = quantityReleased;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public Long getRequestId() {
        return requestId;
    }

    public void setRequestId(Long requestId) {
        this.requestId = requestId;
    }
}

