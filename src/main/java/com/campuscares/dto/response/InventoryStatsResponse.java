package com.campuscares.dto.response;

public class InventoryStatsResponse {
    private long totalItems;
    private long availableItems;
    private long lowStockItems;
    private long qrTrackedItems;

    public InventoryStatsResponse() {
    }

    public InventoryStatsResponse(long totalItems, long availableItems, long lowStockItems, long qrTrackedItems) {
        this.totalItems = totalItems;
        this.availableItems = availableItems;
        this.lowStockItems = lowStockItems;
        this.qrTrackedItems = qrTrackedItems;
    }

    public long getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(long totalItems) {
        this.totalItems = totalItems;
    }

    public long getAvailableItems() {
        return availableItems;
    }

    public void setAvailableItems(long availableItems) {
        this.availableItems = availableItems;
    }

    public long getLowStockItems() {
        return lowStockItems;
    }

    public void setLowStockItems(long lowStockItems) {
        this.lowStockItems = lowStockItems;
    }

    public long getQrTrackedItems() {
        return qrTrackedItems;
    }

    public void setQrTrackedItems(long qrTrackedItems) {
        this.qrTrackedItems = qrTrackedItems;
    }
}
