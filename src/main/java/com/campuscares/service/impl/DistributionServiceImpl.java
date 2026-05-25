package com.campuscares.service.impl;

import com.campuscares.dto.request.DistributionRequest;
import com.campuscares.dto.response.ApiResponse;
import com.campuscares.dto.response.DistributionResponse;
import com.campuscares.dto.response.DistributionStatsResponse;
import com.campuscares.enums.RequestStatus;
import com.campuscares.exception.ResourceNotFoundException;
import com.campuscares.model.Distribution;
import com.campuscares.model.InventoryItem;
import com.campuscares.model.StudentRequest;
import com.campuscares.model.TransactionLog;
import com.campuscares.repository.DistributionRepository;
import com.campuscares.repository.InventoryItemRepository;
import com.campuscares.repository.StudentRequestRepository;
import com.campuscares.repository.TransactionLogRepository;
import com.campuscares.service.DistributionService;
import com.campuscares.service.NotificationService;
import com.campuscares.util.NotificationConstants;
import com.campuscares.util.ValidationUtils;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DistributionServiceImpl implements DistributionService {
    private final InventoryItemRepository inventoryItemRepository;
    private final DistributionRepository distributionRepository;
    private final TransactionLogRepository transactionLogRepository;
    private final NotificationService notificationService;
    private final StudentRequestRepository studentRequestRepository;

    public DistributionServiceImpl(
            InventoryItemRepository inventoryItemRepository,
            DistributionRepository distributionRepository,
            TransactionLogRepository transactionLogRepository,
            NotificationService notificationService,
            StudentRequestRepository studentRequestRepository) {
        this.inventoryItemRepository = inventoryItemRepository;
        this.distributionRepository = distributionRepository;
        this.transactionLogRepository = transactionLogRepository;
        this.notificationService = notificationService;
        this.studentRequestRepository = studentRequestRepository;
    }

    @Override
    public ApiResponse getAllDistributions() {
        return ApiResponse.ok(
                "Distributions retrieved successfully.",
                mapToResponses(distributionRepository.findAllByOrderByDistributedAtDesc()));
    }

    @Override
    public ApiResponse getDistributionStats() {
        Instant weekStart = Instant.now().minus(7, ChronoUnit.DAYS);
        long pendingReleases = studentRequestRepository.findByStatus(RequestStatus.APPROVED).size();

        DistributionStatsResponse stats = new DistributionStatsResponse(
                distributionRepository.sumDistributedQuantity(),
                distributionRepository.countDistinctBeneficiaries(),
                distributionRepository.countReleasedSince(weekStart),
                pendingReleases);

        return ApiResponse.ok("Distribution stats retrieved successfully.", stats);
    }

    @Override
    public ApiResponse searchDistributions(String keyword) {
        String safeKeyword = keyword == null ? "" : keyword.trim();
        List<Distribution> results = safeKeyword.isEmpty()
                ? distributionRepository.findAllByOrderByDistributedAtDesc()
                : distributionRepository.search(safeKeyword);
        return ApiResponse.ok("Distributions retrieved successfully.", mapToResponses(results));
    }

    @Override
    @Transactional
    public ApiResponse releaseItem(DistributionRequest request) {
        ValidationUtils.requirePositive(request.getQuantityReleased(), "quantityReleased");
        String recipientName = ValidationUtils.requireNonBlank(request.getRecipientName(), "recipientName");
        String recipientEmail = ValidationUtils.requireNonBlank(request.getRecipientEmail(), "recipientEmail");
        String itemName = ValidationUtils.requireNonBlank(request.getItemName(), "itemName");

        InventoryItem item = inventoryItemRepository
                .findByItemNameIgnoreCaseOrderByQuantityAvailableDesc(itemName)
                .stream()
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found: " + itemName));

        if (item.getQuantityAvailable() < request.getQuantityReleased()) {
            throw new RuntimeException("Not enough inventory to release requested quantity.");
        }

        item.setQuantityAvailable(item.getQuantityAvailable() - request.getQuantityReleased());
        inventoryItemRepository.save(item);

        Distribution distribution = new Distribution();
        distribution.setRecipientName(recipientName);
        distribution.setRecipientEmail(recipientEmail);
        distribution.setItemName(item.getItemName());
        distribution.setQuantityReleased(request.getQuantityReleased());
        distribution.setRemarks(request.getRemarks());
        Distribution savedDistribution = distributionRepository.save(distribution);

        List<StudentRequest> approvedRequests = studentRequestRepository
                .findByStudentEmailAndRequestedItemNameAndStatus(
                        recipientEmail, item.getItemName(), RequestStatus.APPROVED);
        if (!approvedRequests.isEmpty()) {
            StudentRequest studentRequest = approvedRequests.get(0);
            studentRequest.setStatus(RequestStatus.RELEASED);
            studentRequestRepository.save(studentRequest);
        }

        TransactionLog log = new TransactionLog();
        log.setAction("ITEM_RELEASED");
        log.setPerformedBy("admin");
        log.setDetails("Released " + request.getQuantityReleased() + " " + item.getItemName()
                + " to " + recipientName);
        transactionLogRepository.save(log);

        notificationService.createNotification(
                recipientEmail,
                "Your item '" + item.getItemName() + "' has been released and is ready for pickup.");

        if (item.getQuantityAvailable() <= 5) {
            TransactionLog lowStockLog = new TransactionLog();
            lowStockLog.setAction("LOW_INVENTORY_ALERT");
            lowStockLog.setPerformedBy("SYSTEM");
            lowStockLog.setDetails("Low inventory for " + item.getItemName() + ": "
                    + item.getQuantityAvailable() + " items left.");
            transactionLogRepository.save(lowStockLog);

            notificationService.createNotification(
                    NotificationConstants.ADMIN_EMAIL,
                    "Low inventory alert: " + item.getItemName() + " has only "
                            + item.getQuantityAvailable() + " item(s) left.");
        }

        return ApiResponse.ok("Item released successfully.", toResponse(savedDistribution));
    }

    private List<DistributionResponse> mapToResponses(List<Distribution> distributions) {
        return distributions.stream().map(this::toResponse).toList();
    }

    private DistributionResponse toResponse(Distribution distribution) {
        return new DistributionResponse(
                distribution.getId(),
                distribution.getRecipientName(),
                distribution.getRecipientEmail(),
                distribution.getItemName(),
                distribution.getQuantityReleased(),
                distribution.getRemarks(),
                distribution.getDistributedAt());
    }
}
