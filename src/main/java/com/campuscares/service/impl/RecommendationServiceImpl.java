package com.campuscares.service.impl;

import com.campuscares.dto.response.ApiResponse;
import com.campuscares.dto.response.RecommendationResponse;
import com.campuscares.enums.ItemCategory;
import com.campuscares.model.InventoryItem;
import com.campuscares.model.StudentRequest;
import com.campuscares.repository.InventoryItemRepository;
import com.campuscares.repository.StudentRequestRepository;
import com.campuscares.service.AiExplanationService;
import com.campuscares.service.RecommendationService;
import com.campuscares.util.CategoryUtil;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class RecommendationServiceImpl implements RecommendationService {
    private static final int MIN_RESULTS = 6;
    private static final int MAX_RESULTS = 12;
    private static final int MIN_SCORE_WITH_HISTORY = 50;
    private static final Set<String> COMMON_KEYWORDS = Set.of(
            "notebook", "book", "paper", "calculator", "uniform", "hygiene", "backpack", "pen", "pencil");

    private final StudentRequestRepository studentRequestRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final AiExplanationService aiExplanationService;

    public RecommendationServiceImpl(
            StudentRequestRepository studentRequestRepository,
            InventoryItemRepository inventoryItemRepository,
            AiExplanationService aiExplanationService) {
        this.studentRequestRepository = studentRequestRepository;
        this.inventoryItemRepository = inventoryItemRepository;
        this.aiExplanationService = aiExplanationService;
    }

    @Override
    public ApiResponse getRecommendationsForStudent(String studentEmail) {
        String safeEmail = normalize(studentEmail);
        if (safeEmail.isEmpty()) {
            throw new IllegalArgumentException("email query parameter is required");
        }

        List<StudentRequest> history =
                studentRequestRepository.findByStudentEmailIgnoreCaseOrderByCreatedAtDesc(safeEmail);
        List<InventoryItem> available =
                inventoryItemRepository.findByQuantityAvailableGreaterThanOrderByQuantityAvailableDesc(0);

        if (available.isEmpty()) {
            return ApiResponse.ok("Recommendations fetched.", List.of());
        }

        boolean hasHistory = !history.isEmpty();
        Set<ItemCategory> requestedCategories = new LinkedHashSet<>();
        Set<String> keywords = new LinkedHashSet<>();
        for (StudentRequest request : history) {
            if (request.getCategory() != null && !request.getCategory().isBlank()) {
                requestedCategories.add(CategoryUtil.toItemCategory(request.getCategory()));
            }
            String requestedName = normalize(request.getRequestedItemName());
            if (!requestedName.isEmpty()) {
                for (String token : requestedName.split("\\s+")) {
                    if (token.length() > 2) {
                        keywords.add(token);
                    }
                }
            }
        }

        Map<ItemCategory, Long> categoryFrequency = history.stream()
                .filter(req -> req.getCategory() != null && !req.getCategory().isBlank())
                .collect(Collectors.groupingBy(
                        req -> CategoryUtil.toItemCategory(req.getCategory()), Collectors.counting()));

        ItemCategory topCategory = categoryFrequency.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);

        List<ScoredItem> scored = new ArrayList<>();
        Set<Long> seenInventoryIds = new HashSet<>();

        for (InventoryItem item : available) {
            if (item.getId() == null || seenInventoryIds.contains(item.getId())) {
                continue;
            }
            int qty = item.getQuantityAvailable() == null ? 0 : item.getQuantityAvailable();
            if (qty <= 0) {
                continue;
            }

            int score = calculateScore(item, hasHistory, topCategory, requestedCategories, keywords);
            if (hasHistory && score < MIN_SCORE_WITH_HISTORY) {
                continue;
            }

            String reason = buildReason(item, hasHistory, topCategory, requestedCategories, keywords, history);
            scored.add(new ScoredItem(item, score, reason));
            seenInventoryIds.add(item.getId());
        }

        scored.sort(Comparator.comparingInt(ScoredItem::score)
                .reversed()
                .thenComparing(s -> s.item.getQuantityAvailable(), Comparator.nullsLast(Comparator.reverseOrder())));

        List<ScoredItem> selected = pickResults(scored, hasHistory);

        List<RecommendationResponse> data = new ArrayList<>();
        for (ScoredItem scoredItem : selected) {
            InventoryItem item = scoredItem.item;
            String categoryEnum = item.getCategory() == null ? "" : item.getCategory().name();
            String categoryDisplay = categoryEnum.isBlank() ? "" : formatCategory(categoryEnum);
            String condition = item.getItemCondition() == null ? "" : item.getItemCondition().trim();
            String backendReason = scoredItem.reason;
            String enhanced = aiExplanationService
                    .enhanceExplanation(item.getItemName(), categoryDisplay, backendReason)
                    .orElse(null);

            data.add(new RecommendationResponse(
                    item.getId(),
                    item.getItemName(),
                    categoryEnum,
                    condition,
                    item.getQuantityAvailable(),
                    scoredItem.score,
                    backendReason,
                    enhanced,
                    resolveSource(item)));
        }

        return ApiResponse.ok("Recommendations fetched.", data);
    }

    private List<ScoredItem> pickResults(List<ScoredItem> scored, boolean hasHistory) {
        if (scored.isEmpty()) {
            return List.of();
        }

        int target = Math.min(MAX_RESULTS, Math.max(MIN_RESULTS, scored.size()));
        if (!hasHistory) {
            return scored.stream().limit(target).toList();
        }

        List<ScoredItem> qualified = scored.stream()
                .filter(s -> s.score >= MIN_SCORE_WITH_HISTORY)
                .limit(MAX_RESULTS)
                .toList();

        if (qualified.size() >= MIN_RESULTS) {
            return qualified;
        }

        return scored.stream().limit(Math.min(MAX_RESULTS, Math.max(MIN_RESULTS, scored.size()))).toList();
    }

    private int calculateScore(
            InventoryItem item,
            boolean hasHistory,
            ItemCategory topCategory,
            Set<ItemCategory> requestedCategories,
            Set<String> keywords) {
        String itemNameNorm = normalize(item.getItemName());
        ItemCategory itemCategory = item.getCategory();
        int qty = item.getQuantityAvailable() == null ? 0 : item.getQuantityAvailable();

        if (!hasHistory) {
            int score = 60;
            if (isCommonItem(itemNameNorm)) {
                score += 5;
            }
            if (qty >= 10) {
                score += 10;
            } else if (qty >= 3) {
                score += 5;
            }
            if (itemCategory == ItemCategory.SCHOOL_SUPPLIES || itemCategory == ItemCategory.BOOKS) {
                score += 5;
            }
            return Math.min(80, score);
        }

        int score = 0;
        if (topCategory != null && itemCategory == topCategory) {
            score += 40;
        }
        if (itemCategory != null && requestedCategories.contains(itemCategory)) {
            score += 25;
        }
        if (containsKeyword(itemNameNorm, keywords)) {
            score += 25;
        }
        if (qty >= 10) {
            score += 15;
        } else if (qty >= 3) {
            score += 10;
        }
        if (isCommonItem(itemNameNorm)) {
            score += 5;
        }

        return Math.min(100, score);
    }

    private String buildReason(
            InventoryItem item,
            boolean hasHistory,
            ItemCategory topCategory,
            Set<ItemCategory> requestedCategories,
            Set<String> keywords,
            List<StudentRequest> history) {
        String itemNameNorm = normalize(item.getItemName());
        ItemCategory itemCategory = item.getCategory();
        int qty = item.getQuantityAvailable() == null ? 0 : item.getQuantityAvailable();

        if (!hasHistory) {
            if (isCommonItem(itemNameNorm)) {
                return "Common student essential currently available";
            }
            if (qty >= 10) {
                return "High availability — " + qty + " units ready for students";
            }
            return "Popular essential item for new students on campus";
        }

        if (topCategory != null && itemCategory == topCategory) {
            return "Matches your most requested category: " + formatCategory(topCategory.name());
        }

        StudentRequest similarRequest = findSimilarRequest(itemNameNorm, keywords, history);
        if (similarRequest != null) {
            return "Similar to your previous request for " + similarRequest.getRequestedItemName();
        }

        if (itemCategory != null && requestedCategories.contains(itemCategory)) {
            return "Recommended because you often request items under " + formatCategory(itemCategory.name());
        }

        if (containsKeyword(itemNameNorm, keywords)) {
            return "Related to keywords from your previous item requests";
        }

        if (qty >= 10) {
            return "High availability — " + qty + " units ready for students";
        }

        if (isCommonItem(itemNameNorm)) {
            return "Common student essential currently available";
        }

        return "Available now and commonly useful for campus needs";
    }

    private StudentRequest findSimilarRequest(
            String itemNameNorm, Set<String> keywords, List<StudentRequest> history) {
        for (StudentRequest request : history) {
            String requestedNorm = normalize(request.getRequestedItemName());
            if (requestedNorm.isEmpty()) {
                continue;
            }
            for (String keyword : keywords) {
                if (itemNameNorm.contains(keyword) && requestedNorm.contains(keyword)) {
                    return request;
                }
            }
        }
        return null;
    }

    private boolean containsKeyword(String itemNameNorm, Set<String> keywords) {
        for (String keyword : keywords) {
            if (itemNameNorm.contains(keyword)) {
                return true;
            }
        }
        return false;
    }

    private boolean isCommonItem(String itemNameNorm) {
        for (String keyword : COMMON_KEYWORDS) {
            if (itemNameNorm.contains(keyword)) {
                return true;
            }
        }
        return false;
    }

    private String resolveSource(InventoryItem item) {
        if (item.getSourceDonationId() != null) {
            return "DONATION";
        }
        return "INVENTORY";
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

    private static String normalize(String value) {
        if (value == null) {
            return "";
        }
        return value.toLowerCase(Locale.ROOT).trim().replaceAll("\\s+", " ");
    }

    private record ScoredItem(InventoryItem item, int score, String reason) {
    }
}
