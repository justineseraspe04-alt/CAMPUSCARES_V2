package com.campuscares.service.impl;

import com.campuscares.dto.response.ApiResponse;
import com.campuscares.dto.response.InventoryResponse;
import com.campuscares.enums.ItemCategory;
import com.campuscares.model.InventoryItem;
import com.campuscares.model.StudentRequest;
import com.campuscares.repository.InventoryItemRepository;
import com.campuscares.repository.StudentRequestRepository;
import com.campuscares.service.RecommendationService;
import com.campuscares.util.CategoryUtil;
import com.campuscares.util.ValidationUtils;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RecommendationServiceImpl implements RecommendationService {
    private final StudentRequestRepository studentRequestRepository;
    private final InventoryItemRepository inventoryItemRepository;

    public RecommendationServiceImpl(
            StudentRequestRepository studentRequestRepository,
            InventoryItemRepository inventoryItemRepository) {
        this.studentRequestRepository = studentRequestRepository;
        this.inventoryItemRepository = inventoryItemRepository;
    }

    @Override
    public ApiResponse recommendItemsForStudent(String studentEmail) {
        // This is basic AI-based recommendation logic because it analyzes student request behavior
        // and suggests relevant items based on request history.
        String safeEmail = ValidationUtils.requireNonBlank(studentEmail, "studentEmail");
        List<StudentRequest> history = studentRequestRepository.findByStudentEmail(safeEmail);
        List<InventoryItem> recommended;

        if (!history.isEmpty()) {
            Map<ItemCategory, Long> frequency = history.stream()
                    .collect(Collectors.groupingBy(
                            req -> CategoryUtil.toItemCategory(req.getCategory()),
                            Collectors.counting()
                    ));
            ItemCategory topCategory = frequency.entrySet().stream()
                    .max(Map.Entry.comparingByValue())
                    .map(Map.Entry::getKey)
                    .orElse(ItemCategory.OTHER);
            recommended = inventoryItemRepository.findByCategoryAndQuantityAvailableGreaterThan(topCategory, 0);
        } else {
            recommended = inventoryItemRepository.findByQuantityAvailableGreaterThanOrderByQuantityAvailableDesc(0);
        }

        List<InventoryResponse> data = recommended.stream()
                .sorted(Comparator.comparing(InventoryItem::getQuantityAvailable).reversed())
                .map(item -> new InventoryResponse(
                        item.getId(),
                        item.getItemName(),
                        item.getCategory() == null ? "" : item.getCategory().name(),
                        item.getItemCondition() == null ? "" : item.getItemCondition(),
                        item.getQuantityAvailable(),
                        item.getQrCode(),
                        item.getSize(),
                        item.getSubjectOrCourse()
                ))
                .toList();

        return ApiResponse.ok("Recommendations fetched.", data);
    }
}

