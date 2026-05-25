package com.campuscares.dto.response;

public class InventoryResponse {
    private Long id;
    private String itemName;
    private String category;
    private String itemCondition;
    private Integer quantityAvailable;
    private String qrCode;
    private String size;
    private String subjectOrCourse;

    public InventoryResponse() {
    }

    public InventoryResponse(
            Long id,
            String itemName,
            String category,
            String itemCondition,
            Integer quantityAvailable,
            String qrCode,
            String size,
            String subjectOrCourse) {
        this.id = id;
        this.itemName = itemName;
        this.category = category;
        this.itemCondition = itemCondition;
        this.quantityAvailable = quantityAvailable;
        this.qrCode = qrCode;
        this.size = size;
        this.subjectOrCourse = subjectOrCourse;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Integer getQuantityAvailable() {
        return quantityAvailable;
    }

    public void setQuantityAvailable(Integer quantityAvailable) {
        this.quantityAvailable = quantityAvailable;
    }

    public String getQrCode() {
        return qrCode;
    }

    public void setQrCode(String qrCode) {
        this.qrCode = qrCode;
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

