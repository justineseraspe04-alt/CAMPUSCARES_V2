package com.campuscares.service.impl;

import com.campuscares.dto.response.ApiResponse;
import com.campuscares.dto.response.InventoryResponse;
import com.campuscares.dto.response.InventoryStatsResponse;
import com.campuscares.model.InventoryItem;
import com.campuscares.repository.InventoryItemRepository;
import com.campuscares.service.InventoryService;
import com.campuscares.util.CategoryUtil;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class InventoryServiceImpl implements InventoryService {
    private static final int LOW_STOCK_THRESHOLD = 5;

    private final InventoryItemRepository inventoryItemRepository;

    public InventoryServiceImpl(InventoryItemRepository inventoryItemRepository) {
        this.inventoryItemRepository = inventoryItemRepository;
    }

    @Override
    public ApiResponse getAllInventoryItems() {
        return ApiResponse.ok(
                "Inventory items retrieved successfully.",
                mapToResponses(inventoryItemRepository.findAll()));
    }

    @Override
    public ApiResponse searchInventory(String keyword) {
        String safeKeyword = keyword == null ? "" : keyword.trim();
        List<InventoryItem> items = safeKeyword.isEmpty()
                ? inventoryItemRepository.findAll()
                : inventoryItemRepository.findByItemNameContainingIgnoreCase(safeKeyword);
        return ApiResponse.ok(
                "Inventory items retrieved successfully.",
                mapToResponses(items));
    }

    @Override
    public ApiResponse getInventoryByCategory(String category) {
        return ApiResponse.ok(
                "Inventory items retrieved successfully.",
                mapToResponses(inventoryItemRepository.findByCategory(CategoryUtil.toItemCategory(category))));
    }

    @Override
    public ApiResponse getLowInventoryItems() {
        return ApiResponse.ok(
                "Inventory items retrieved successfully.",
                mapToResponses(inventoryItemRepository.findByQuantityAvailableLessThanEqual(LOW_STOCK_THRESHOLD)));
    }

    @Override
    public ApiResponse getInventoryStats() {
        List<InventoryItem> items = inventoryItemRepository.findAll();
        long totalItems = items.size();
        long availableItems = items.stream()
                .mapToLong(item -> item.getQuantityAvailable() == null ? 0 : item.getQuantityAvailable())
                .sum();
        long lowStockItems = items.stream()
                .filter(item -> item.getQuantityAvailable() != null
                        && item.getQuantityAvailable() <= LOW_STOCK_THRESHOLD)
                .count();
        long qrTrackedItems = items.stream()
                .filter(item -> item.getQrCode() != null && !item.getQrCode().isBlank())
                .count();

        return ApiResponse.ok(
                "Inventory stats retrieved successfully.",
                new InventoryStatsResponse(totalItems, availableItems, lowStockItems, qrTrackedItems));
    }

    private List<InventoryResponse> mapToResponses(List<InventoryItem> items) {
        return items.stream()
                .map(item -> new InventoryResponse(
                        item.getId(),
                        item.getItemName(),
                        item.getCategory() == null ? "" : item.getCategory().name(),
                        item.getItemCondition() == null ? "" : item.getItemCondition(),
                        item.getQuantityAvailable(),
                        item.getQrCode(),
                        item.getSize(),
                        item.getSubjectOrCourse()))
                .toList();
    }
}
