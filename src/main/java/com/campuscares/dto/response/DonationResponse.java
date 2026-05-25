package com.campuscares.dto.response;

public class DonationResponse {
    private Long id;
    private String donorName;
    private String donorEmail;
    private String itemName;
    private String category;
    private String itemCondition;
    private String status;
    private Integer quantity;
    private String description;
    private String dateSubmitted;

    public DonationResponse() {
    }

    public DonationResponse(
            Long id,
            String donorName,
            String donorEmail,
            String itemName,
            String category,
            String itemCondition,
            String status,
            Integer quantity,
            String description,
            String dateSubmitted) {
        this.id = id;
        this.donorName = donorName;
        this.donorEmail = donorEmail;
        this.itemName = itemName;
        this.category = category;
        this.itemCondition = itemCondition;
        this.status = status;
        this.quantity = quantity;
        this.description = description;
        this.dateSubmitted = dateSubmitted;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDonorName() {
        return donorName;
    }

    public void setDonorName(String donorName) {
        this.donorName = donorName;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getDonorEmail() {
        return donorEmail;
    }

    public void setDonorEmail(String donorEmail) {
        this.donorEmail = donorEmail;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getItemCondition() {
        return itemCondition;
    }

    public void setItemCondition(String itemCondition) {
        this.itemCondition = itemCondition;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDateSubmitted() {
        return dateSubmitted;
    }

    public void setDateSubmitted(String dateSubmitted) {
        this.dateSubmitted = dateSubmitted;
    }
}

