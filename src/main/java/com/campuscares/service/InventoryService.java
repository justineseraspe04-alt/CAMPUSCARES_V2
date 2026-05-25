package com.campuscares.service;

import com.campuscares.dto.response.ApiResponse;

public interface InventoryService {
    ApiResponse getAllInventoryItems();

    ApiResponse searchInventory(String keyword);

    ApiResponse getInventoryByCategory(String category);

    ApiResponse getLowInventoryItems();

    ApiResponse getInventoryStats();
}
