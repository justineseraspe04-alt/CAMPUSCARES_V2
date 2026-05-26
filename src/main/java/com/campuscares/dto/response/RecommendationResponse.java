package com.campuscares.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public class RecommendationResponse {
    private Long inventoryItemId;
    private String itemName;
    private String category;
    private String condition;
    private Integer quantityAvailable;
    private Integer matchPercentage;
    private String reason;
    private String enhancedReason;
    private String source;

    public RecommendationResponse() {
    }

    public RecommendationResponse(
            Long inventoryItemId,
            String itemName,
            String category,
            String condition,
            Integer quantityAvailable,
            Integer matchPercentage,
            String reason,
            String enhancedReason,
            String source) {
        this.inventoryItemId = inventoryItemId;
        this.itemName = itemName;
        this.category = category;
        this.condition = condition;
        this.quantityAvailable = quantityAvailable;
        this.matchPercentage = matchPercentage;
        this.reason = reason;
        this.enhancedReason = enhancedReason;
        this.source = source;
    }

    @JsonProperty("inventoryItemId")
    public Long getInventoryItemId() {
        return inventoryItemId;
    }

    public void setInventoryItemId(Long inventoryItemId) {
        this.inventoryItemId = inventoryItemId;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getCondition() {
        return condition;
    }

    public void setCondition(String condition) {
        this.condition = condition;
    }

    public Integer getQuantityAvailable() {
        return quantityAvailable;
    }

    public void setQuantityAvailable(Integer quantityAvailable) {
        this.quantityAvailable = quantityAvailable;
    }

    public Integer getMatchPercentage() {
        return matchPercentage;
    }

    public void setMatchPercentage(Integer matchPercentage) {
        this.matchPercentage = matchPercentage;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getEnhancedReason() {
        return enhancedReason;
    }

    public void setEnhancedReason(String enhancedReason) {
        this.enhancedReason = enhancedReason;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }
}
