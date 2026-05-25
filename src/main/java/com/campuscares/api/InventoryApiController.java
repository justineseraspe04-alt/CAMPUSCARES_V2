package com.campuscares.api;

import com.campuscares.dto.response.ApiResponse;
import com.campuscares.service.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/inventory")
public class InventoryApiController {
    private final InventoryService inventoryService;

    public InventoryApiController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAll() {
        return ResponseEntity.ok(inventoryService.getAllInventoryItems());
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse> search(@RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(inventoryService.searchInventory(keyword));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse> byCategory(@PathVariable String category) {
        return ResponseEntity.ok(inventoryService.getInventoryByCategory(category));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<ApiResponse> lowStock() {
        return ResponseEntity.ok(inventoryService.getLowInventoryItems());
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse> stats() {
        return ResponseEntity.ok(inventoryService.getInventoryStats());
    }
}
