package com.campuscares.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.Instant;

public class DistributionResponse {
    private Long id;
    private String recipientName;
    private String recipientEmail;
    private String itemName;
    private Integer quantityReleased;
    private String remarks;
    private Instant releasedAt;

    public DistributionResponse() {
    }

    public DistributionResponse(
            Long id,
            String recipientName,
            String recipientEmail,
            String itemName,
            Integer quantityReleased,
            String remarks,
            Instant releasedAt) {
        this.id = id;
        this.recipientName = recipientName;
        this.recipientEmail = recipientEmail;
        this.itemName = itemName;
        this.quantityReleased = quantityReleased;
        this.remarks = remarks;
        this.releasedAt = releasedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    @JsonProperty("releasedAt")
    public Instant getReleasedAt() {
        return releasedAt;
    }

    public void setReleasedAt(Instant releasedAt) {
        this.releasedAt = releasedAt;
    }
}
