package com.campuscares.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class DonationRequest {
    @NotBlank
    private String donorName;

    @Email
    @NotBlank
    private String donorEmail;

    @NotBlank
    private String itemName;

    @NotBlank
    private String category;

    @NotBlank
    private String itemCondition;

    @NotNull
    @Min(1)
    private Integer quantity;

    @NotBlank
    private String description;

    private String size;

    private String subjectOrCourse;

    public String getDonorName() {
        return donorName;
    }

    public void setDonorName(String donorName) {
        this.donorName = donorName;
    }

    public String getDonorEmail() {
        return donorEmail;
    }

    public void setDonorEmail(String donorEmail) {
        this.donorEmail = donorEmail;
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

    public String getItemCondition() {
        return itemCondition;
    }

    public void setItemCondition(String itemCondition) {
        this.itemCondition = itemCondition;
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

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public String getSubjectOrCourse() {
        return subjectOrCourse;
    }

    public void setSubjectOrCourse(String subjectOrCourse) {
        this.subjectOrCourse = subjectOrCourse;
    }
}

