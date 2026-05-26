package com.campuscares.service.impl;

import com.campuscares.dto.response.ApiResponse;
import com.campuscares.dto.response.RecommendationResponse;
import com.campuscares.enums.ItemCategory;
import com.campuscares.model.InventoryItem;
import com.campuscares.model.StudentRequest;
import com.campuscares.repository.InventoryItemRepository;
import com.campuscares.repository.StudentRequestRepository;
import com.campuscares.service.RecommendationService;
import com.campuscares.util.CategoryUtil;
import com.campuscares.util.ValidationUtils;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

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
        String safeEmail = ValidationUtils.requireNonBlank(studentEmail, "studentEmail");
        List<StudentRequest> history = studentRequestRepository.findByStudentEmailOrderByCreatedAtDesc(safeEmail);
        List<InventoryItem> available = inventoryItemRepository.findByQuantityAvailableGreaterThanOrderByQuantityAvailableDesc(0);

        if (available.isEmpty()) {
            return ApiResponse.ok("Recommendations fetched.", List.of());
        }

        Set<String> requestedNames = history.stream()
                .map(r -> r.getRequestedItemName().toLowerCase(Locale.ROOT))
                .collect(Collectors.toSet());

        Map<ItemCategory, Long> categoryFrequency = history.stream()
                .collect(Collectors.groupingBy(
                        req -> CategoryUtil.toItemCategory(req.getCategory()),
                        Collectors.counting()));

        ItemCategory topCategory = categoryFrequency.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);

        Set<String> keywords = new HashSet<>();
        for (StudentRequest request : history) {
            for (String token : request.getRequestedItemName().toLowerCase(Locale.ROOT).split("\\s+")) {
                if (token.length() > 2) {
                    keywords.add(token);
                }
            }
        }

        List<ScoredItem> scored = new ArrayList<>();
        for (InventoryItem item : available) {
            if (requestedNames.contains(item.getItemName().toLowerCase(Locale.ROOT))) {
                continue;
            }
            int score = scoreItem(item, topCategory, categoryFrequency, keywords, history);
            String reason = buildReason(item, topCategory, categoryFrequency, keywords, history);
            scored.add(new ScoredItem(item, score, reason));
        }

        List<RecommendationResponse> data = scored.stream()
                .sorted(Comparator.comparingInt(ScoredItem::score).reversed()
                        .thenComparing(s -> s.item.getQuantityAvailable(), Comparator.reverseOrder()))
                .limit(12)
                .map(s -> new RecommendationResponse(
                        s.item.getId(),
                        s.item.getItemName(),
                        s.item.getCategory() == null ? "" : s.item.getCategory().name(),
                        s.item.getItemCondition() == null ? "" : s.item.getItemCondition(),
                        s.item.getQuantityAvailable(),
                        Math.min(99, Math.max(55, s.score)),
                        s.reason,
                        s.item.getSize(),
                        s.item.getSubjectOrCourse()))
                .toList();

        return ApiResponse.ok("Recommendations fetched.", data);
    }

    private int scoreItem(
            InventoryItem item,
            ItemCategory topCategory,
            Map<ItemCategory, Long> categoryFrequency,
            Set<String> keywords,
            List<StudentRequest> history) {
        int score = 60;

        if (topCategory != null && item.getCategory() == topCategory) {
            score += 20;
        }

        String itemNameLower = item.getItemName().toLowerCase(Locale.ROOT);
        for (String keyword : keywords) {
            if (itemNameLower.contains(keyword)) {
                score += 8;
            }
        }

        int qty = item.getQuantityAvailable() == null ? 0 : item.getQuantityAvailable();
        if (qty >= 10) {
            score += 10;
        } else if (qty >= 5) {
            score += 6;
        } else if (qty >= 2) {
            score += 3;
        }

        if (history.isEmpty()) {
            score += 5;
        }

        if (item.getCategory() == ItemCategory.SCHOOL_SUPPLIES || item.getCategory() == ItemCategory.BOOKS) {
            score += 4;
        }

        return score;
    }

    private String buildReason(
            InventoryItem item,
            ItemCategory topCategory,
            Map<ItemCategory, Long> categoryFrequency,
            Set<String> keywords,
            List<StudentRequest> history) {
        if (topCategory != null && item.getCategory() == topCategory && !categoryFrequency.isEmpty()) {
            return "Matches your most requested category: "
                    + formatCategory(topCategory.name());
        }

        String itemNameLower = item.getItemName().toLowerCase(Locale.ROOT);
        for (String keyword : keywords) {
            if (itemNameLower.contains(keyword)) {
                return "Related to items you've requested before (keyword: " + keyword + ").";
            }
        }

        int qty = item.getQuantityAvailable() == null ? 0 : item.getQuantityAvailable();
        if (qty >= 10) {
            return "High availability — " + qty + " units ready for students.";
        }

        if (history.isEmpty()) {
            return "Popular essential item for new students on campus.";
        }

        return "Available now and commonly useful for campus needs.";
    }

    private String formatCategory(String category) {
        if (category == null || category.isBlank()) {
            return "Other";
        }
        String[] parts = category.replace('_', ' ').toLowerCase(Locale.ROOT).split(" ");
        StringBuilder sb = new StringBuilder();
        for (String part : parts) {
            if (!part.isEmpty()) {
                sb.append(Character.toUpperCase(part.charAt(0))).append(part.substring(1)).append(' ');
            }
        }
        return sb.toString().trim();
    }

    private record ScoredItem(InventoryItem item, int score, String reason) {
    }
}
