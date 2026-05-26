package com.campuscares.dto.response;

public class RecommendationResponse {
    private Long id;
    private String itemName;
    private String category;
    private String itemCondition;
    private Integer quantityAvailable;
    private int matchPercent;
    private String reason;
    private String size;
    private String subjectOrCourse;

    public RecommendationResponse() {
    }

    public RecommendationResponse(
            Long id,
            String itemName,
            String category,
            String itemCondition,
            Integer quantityAvailable,
            int matchPercent,
            String reason,
            String size,
            String subjectOrCourse) {
        this.id = id;
        this.itemName = itemName;
        this.category = category;
        this.itemCondition = itemCondition;
        this.quantityAvailable = quantityAvailable;
        this.matchPercent = matchPercent;
        this.reason = reason;
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

    public int getMatchPercent() {
        return matchPercent;
    }

    public void setMatchPercent(int matchPercent) {
        this.matchPercent = matchPercent;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
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
