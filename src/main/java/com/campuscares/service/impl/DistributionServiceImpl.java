package com.campuscares.service.impl;

import com.campuscares.dto.request.DistributionRequest;
import com.campuscares.dto.response.ApiResponse;
import com.campuscares.dto.response.DistributionResponse;
import com.campuscares.dto.response.DistributionStatsResponse;
import com.campuscares.enums.ItemCategory;
import com.campuscares.enums.RequestStatus;
import com.campuscares.exception.InvalidOperationException;
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
import com.campuscares.util.CategoryUtil;
import com.campuscares.util.NotificationConstants;
import com.campuscares.util.NotificationTypes;
import com.campuscares.util.PickupReferenceGenerator;
import com.campuscares.util.ValidationUtils;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DistributionServiceImpl implements DistributionService {
    private static final String ADMIN_ACTOR = "admin@campuscares.com";
    private static final int MAX_REFERENCE_ATTEMPTS = 12;

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
                mapToResponses(distributionRepository.findAllByOrderByReleasedAtDesc()));
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
                ? distributionRepository.findAllByOrderByReleasedAtDesc()
                : distributionRepository.search(safeKeyword);
        return ApiResponse.ok("Distributions retrieved successfully.", mapToResponses(results));
    }

    @Override
    @Transactional
    public ApiResponse releaseItem(DistributionRequest request) {
        ValidationUtils.requirePositive(request.getQuantityReleased(), "quantityReleased");

        StudentRequest linkedRequest = resolveApprovedRequest(request);
        String recipientName = linkedRequest != null
                ? linkedRequest.getStudentName()
                : ValidationUtils.requireNonBlank(request.getRecipientName(), "recipientName");
        String recipientEmail = linkedRequest != null
                ? linkedRequest.getStudentEmail()
                : ValidationUtils.requireNonBlank(request.getRecipientEmail(), "recipientEmail");
        String itemName = linkedRequest != null
                ? linkedRequest.getRequestedItemName()
                : ValidationUtils.requireNonBlank(request.getItemName(), "itemName");
        ItemCategory category = linkedRequest != null
                ? CategoryUtil.toItemCategory(linkedRequest.getCategory())
                : null;

        InventoryItem item = findInventoryForRelease(itemName, category);
        if (item.getQuantityAvailable() < request.getQuantityReleased()) {
            throw new InvalidOperationException(
                    "Not enough inventory to release. Available: " + item.getQuantityAvailable()
                            + ", requested: " + request.getQuantityReleased());
        }

        String pickupReferenceNumber = generateUniquePickupReferenceNumber();

        Distribution distribution = new Distribution();
        if (linkedRequest != null) {
            distribution.setRequestId(linkedRequest.getId());
        }
        distribution.setRecipientName(recipientName);
        distribution.setRecipientEmail(recipientEmail);
        distribution.setItemName(item.getItemName());
        distribution.setQuantityReleased(request.getQuantityReleased());
        distribution.setRemarks(request.getRemarks());
        distribution.setPickupReferenceNumber(pickupReferenceNumber);
        Distribution savedDistribution = distributionRepository.save(distribution);

        item.setQuantityAvailable(item.getQuantityAvailable() - request.getQuantityReleased());
        inventoryItemRepository.save(item);

        if (linkedRequest != null) {
            linkedRequest.setStatus(RequestStatus.RELEASED);
            studentRequestRepository.save(linkedRequest);
        }

        String releaseDetails = "Released " + item.getItemName() + " to " + recipientName
                + ". Pickup Reference No: " + pickupReferenceNumber + "."
                + (linkedRequest != null ? " (request #" + linkedRequest.getId() + ")" : "");

        TransactionLog log = new TransactionLog();
        log.setAction("ITEM_RELEASED");
        log.setPerformedBy(ADMIN_ACTOR);
        log.setDetails(releaseDetails);
        transactionLogRepository.save(log);

        notificationService.createNotification(
                recipientEmail,
                "Item ready for pickup",
                buildPickupNotificationMessage(item.getItemName(), pickupReferenceNumber),
                NotificationTypes.ITEM_RELEASED);

        if (item.getQuantityAvailable() <= 5) {
            TransactionLog lowStockLog = new TransactionLog();
            lowStockLog.setAction("LOW_INVENTORY_ALERT");
            lowStockLog.setPerformedBy("SYSTEM");
            lowStockLog.setDetails("Low inventory for " + item.getItemName() + ": "
                    + item.getQuantityAvailable() + " items left.");
            transactionLogRepository.save(lowStockLog);

            notificationService.createNotification(
                    NotificationConstants.ADMIN_EMAIL,
                    "Low inventory warning",
                    "Low inventory alert: " + item.getItemName() + " has only "
                            + item.getQuantityAvailable() + " item(s) left.",
                    NotificationTypes.ADMIN_LOW_INVENTORY);
        }

        return ApiResponse.ok(
                "Item released successfully. Pickup Reference No: " + pickupReferenceNumber,
                toResponse(savedDistribution));
    }

    private String generateUniquePickupReferenceNumber() {
        for (int attempt = 0; attempt < MAX_REFERENCE_ATTEMPTS; attempt++) {
            String candidate = PickupReferenceGenerator.generatePickupReferenceNumber();
            if (!distributionRepository.existsByPickupReferenceNumber(candidate)) {
                return candidate;
            }
        }
        throw new InvalidOperationException("Could not generate a unique pickup reference number.");
    }

    private String buildPickupNotificationMessage(String itemName, String pickupReferenceNumber) {
        String safeItemName = itemName == null || itemName.isBlank() ? "your item" : itemName.trim();
        return "Your item '" + safeItemName + "' has been released and is ready for pickup. "
                + "Pickup Reference No: " + pickupReferenceNumber
                + ". Please present this reference number when claiming your item.";
    }

    private StudentRequest resolveApprovedRequest(DistributionRequest request) {
        if (request.getRequestId() != null) {
            StudentRequest entity = studentRequestRepository.findById(request.getRequestId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Student request not found: " + request.getRequestId()));
            if (entity.getStatus() == RequestStatus.RELEASED) {
                throw new InvalidOperationException(
                        "This request has already been released and cannot be released again.");
            }
            if (distributionRepository.existsByRequestId(entity.getId())) {
                throw new InvalidOperationException(
                        "A distribution record already exists for request #" + entity.getId() + ".");
            }
            if (entity.getStatus() != RequestStatus.APPROVED) {
                throw new InvalidOperationException(
                        "Only approved requests can be released. Current status: " + entity.getStatus());
            }
            return entity;
        }

        String recipientEmail = request.getRecipientEmail() == null ? "" : request.getRecipientEmail().trim();
        String itemName = request.getItemName() == null ? "" : request.getItemName().trim();
        if (recipientEmail.isEmpty() || itemName.isEmpty()) {
            throw new InvalidOperationException(
                    "Either requestId or both recipientEmail and itemName are required for release.");
        }

        List<StudentRequest> approved = studentRequestRepository
                .findByStudentEmailAndRequestedItemNameAndStatus(
                        recipientEmail, itemName, RequestStatus.APPROVED);
        if (approved.isEmpty()) {
            throw new InvalidOperationException(
                    "No approved request found for " + recipientEmail + " and item \"" + itemName + "\".");
        }
        if (approved.size() > 1) {
            throw new InvalidOperationException(
                    "Multiple approved requests found. Please release using requestId.");
        }
        StudentRequest entity = approved.get(0);
        if (distributionRepository.existsByRequestId(entity.getId())) {
            throw new InvalidOperationException(
                    "A distribution record already exists for request #" + entity.getId() + ".");
        }
        return entity;
    }

    private InventoryItem findInventoryForRelease(String itemName, ItemCategory category) {
        List<InventoryItem> candidates = inventoryItemRepository
                .findByItemNameIgnoreCaseOrderByQuantityAvailableDesc(itemName);

        if (category != null) {
            candidates = candidates.stream()
                    .filter(i -> i.getCategory() == category)
                    .toList();
        }

        return candidates.stream()
                .filter(i -> i.getQuantityAvailable() > 0)
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No available inventory found for: " + itemName
                                + (category != null ? " (" + category + ")" : "")));
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
                distribution.getPickupReferenceNumber(),
                distribution.getReleasedAt());
    }
}
