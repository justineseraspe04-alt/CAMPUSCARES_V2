package com.campuscares.service.impl;

import com.campuscares.dto.response.AdminDashboardResponse;
import com.campuscares.dto.response.ApiResponse;
import com.campuscares.dto.response.DashboardCategoryCount;
import com.campuscares.dto.response.DashboardDayCount;
import com.campuscares.dto.response.DashboardLogSummary;
import com.campuscares.dto.response.DashboardNotificationSummary;
import com.campuscares.dto.response.DonationResponse;
import com.campuscares.dto.response.DonorDashboardResponse;
import com.campuscares.dto.response.InventoryResponse;
import com.campuscares.dto.response.RecipientDashboardResponse;
import com.campuscares.dto.response.StudentRequestResponse;
import com.campuscares.enums.DonationStatus;
import com.campuscares.enums.RequestStatus;
import com.campuscares.model.Distribution;
import com.campuscares.model.Donation;
import com.campuscares.model.InventoryItem;
import com.campuscares.model.Notification;
import com.campuscares.model.StudentRequest;
import com.campuscares.model.TransactionLog;
import com.campuscares.repository.DistributionRepository;
import com.campuscares.repository.DonationRepository;
import com.campuscares.repository.InventoryItemRepository;
import com.campuscares.repository.NotificationRepository;
import com.campuscares.repository.StudentRequestRepository;
import com.campuscares.repository.TransactionLogRepository;
import com.campuscares.service.DashboardService;
import com.campuscares.util.NotificationConstants;
import com.campuscares.util.ValidationUtils;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class DashboardServiceImpl implements DashboardService {
    private static final int LOW_STOCK_THRESHOLD = 5;
    private static final DateTimeFormatter DATE_TIME_FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
    private static final String[] DAY_LABELS = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"};

    private final DonationRepository donationRepository;
    private final DistributionRepository distributionRepository;
    private final StudentRequestRepository studentRequestRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final TransactionLogRepository transactionLogRepository;
    private final NotificationRepository notificationRepository;

    public DashboardServiceImpl(
            DonationRepository donationRepository,
            DistributionRepository distributionRepository,
            StudentRequestRepository studentRequestRepository,
            InventoryItemRepository inventoryItemRepository,
            TransactionLogRepository transactionLogRepository,
            NotificationRepository notificationRepository) {
        this.donationRepository = donationRepository;
        this.distributionRepository = distributionRepository;
        this.studentRequestRepository = studentRequestRepository;
        this.inventoryItemRepository = inventoryItemRepository;
        this.transactionLogRepository = transactionLogRepository;
        this.notificationRepository = notificationRepository;
    }

    @Override
    public ApiResponse getAdminDashboardStats() {
        List<Donation> allDonations = donationRepository.findAll();
        List<StudentRequest> allRequests = studentRequestRepository.findAll();
        List<InventoryItem> allInventory = inventoryItemRepository.findAll();

        long approvedDonations = countDonationsByStatus(allDonations, DonationStatus.APPROVED);
        long pendingDonations = countDonationsByStatus(allDonations, DonationStatus.PENDING);
        long rejectedDonations = countDonationsByStatus(allDonations, DonationStatus.REJECTED);
        long totalDonations = allDonations.size();

        long pendingRequests = countRequestsByStatus(allRequests, RequestStatus.PENDING);
        long approvedRequests = countRequestsByStatus(allRequests, RequestStatus.APPROVED);
        long rejectedRequests = countRequestsByStatus(allRequests, RequestStatus.REJECTED);
        long releasedRequests = countRequestsByStatus(allRequests, RequestStatus.RELEASED);

        long lowStockItems = allInventory.stream()
                .filter(i -> i.getQuantityAvailable() != null && i.getQuantityAvailable() <= LOW_STOCK_THRESHOLD)
                .count();

        long totalDistributedItems = distributionRepository.sumDistributedQuantity();
        long beneficiariesHelped = distributionRepository.countDistinctBeneficiaries();

        List<Notification> adminNotifications = notificationRepository
                .findByUserEmailIgnoreCaseOrderByCreatedAtDesc(NotificationConstants.ADMIN_EMAIL);
        long unreadNotifications = adminNotifications.stream().filter(n -> !n.isRead()).count();

        long fulfillmentTotal = approvedRequests + releasedRequests;
        int distributionProgressPercent = fulfillmentTotal == 0
                ? 0
                : (int) Math.round((releasedRequests * 100.0) / fulfillmentTotal);

        AdminDashboardResponse response = new AdminDashboardResponse();
        response.setTotalDonations(totalDonations);
        response.setApprovedDonations(approvedDonations);
        response.setPendingDonations(pendingDonations);
        response.setRejectedDonations(rejectedDonations);
        response.setTotalInventoryItems(allInventory.size());
        response.setLowStockItems(lowStockItems);
        response.setPendingRequests(pendingRequests);
        response.setApprovedRequests(approvedRequests);
        response.setRejectedRequests(rejectedRequests);
        response.setReleasedRequests(releasedRequests);
        response.setTotalDistributedItems(totalDistributedItems);
        response.setBeneficiariesHelped(beneficiariesHelped);
        response.setUnreadNotifications(unreadNotifications);
        response.setDistributionProgressPercent(distributionProgressPercent);
        response.setDonationActivityByDay(buildDonationActivityLast7Days(allDonations));
        response.setRequestCategoryBreakdown(buildCategoryBreakdown(
                allRequests.stream().map(StudentRequest::getCategory).toList()));
        response.setDonationCategoryBreakdown(buildCategoryBreakdown(
                allDonations.stream().map(Donation::getCategory).toList()));
        response.setRecentLogs(buildRecentLogs());
        response.setRecentNotifications(buildRecentNotifications(adminNotifications));
        response.setPendingDonationItems(allDonations.stream()
                .filter(d -> d.getStatus() == DonationStatus.PENDING)
                .map(this::toDonationResponse)
                .toList());
        response.setPendingRequestItems(allRequests.stream()
                .filter(r -> r.getStatus() == RequestStatus.PENDING)
                .map(this::toStudentRequestResponse)
                .toList());
        response.setInventoryPreview(allInventory.stream()
                .sorted(Comparator
                        .comparing((InventoryItem i) -> i.getQuantityAvailable() == null ? 0 : i.getQuantityAvailable())
                        .reversed())
                .limit(4)
                .map(this::toInventoryResponse)
                .toList());

        return ApiResponse.ok("Admin dashboard statistics fetched.", response);
    }

    @Override
    public ApiResponse getDonorDashboardStats(String donorEmail) {
        String safeEmail = ValidationUtils.requireNonBlank(donorEmail, "donorEmail");
        List<Donation> donations = donationRepository.findByDonorEmailOrderByCreatedAtDesc(safeEmail);

        long total = donations.size();
        long approved = countDonationsByStatus(donations, DonationStatus.APPROVED);
        long pending = countDonationsByStatus(donations, DonationStatus.PENDING);
        long rejected = countDonationsByStatus(donations, DonationStatus.REJECTED);

        long totalQuantity = donations.stream()
                .mapToLong(d -> d.getQuantity() == null ? 0L : d.getQuantity())
                .sum();

        long itemsReused = donations.stream()
                .filter(d -> d.getStatus() == DonationStatus.APPROVED)
                .mapToLong(d -> d.getQuantity() == null ? 0L : d.getQuantity())
                .sum();

        long studentsHelped = countStudentsHelpedByDonor(donations);

        String lastItemName = "—";
        String lastDate = "—";
        if (!donations.isEmpty()) {
            Donation latest = donations.get(0);
            lastItemName = latest.getItemName();
            lastDate = formatInstant(latest.getCreatedAt());
        }

        String mostCategory = "—";
        if (!donations.isEmpty()) {
            mostCategory = donations.stream()
                    .collect(Collectors.groupingBy(Donation::getCategory, Collectors.counting()))
                    .entrySet()
                    .stream()
                    .max(Map.Entry.comparingByValue())
                    .map(Map.Entry::getKey)
                    .orElse("—");
        }

        long unreadNotifications = notificationRepository
                .findByUserEmailAndIsReadFalseOrderByCreatedAtDesc(safeEmail)
                .size();

        DonorDashboardResponse stats = new DonorDashboardResponse(
                total,
                approved,
                pending,
                rejected,
                totalQuantity,
                studentsHelped,
                itemsReused,
                unreadNotifications,
                lastItemName,
                lastDate,
                mostCategory);

        return ApiResponse.ok("Donor dashboard statistics fetched.", stats);
    }

    @Override
    public ApiResponse getRecipientDashboardStats(String studentEmail) {
        String safeEmail = ValidationUtils.requireNonBlank(studentEmail, "studentEmail");
        List<StudentRequest> requests = studentRequestRepository.findByStudentEmailOrderByCreatedAtDesc(safeEmail);

        long pending = countRequestsByStatus(requests, RequestStatus.PENDING);
        long approved = countRequestsByStatus(requests, RequestStatus.APPROVED);
        long released = countRequestsByStatus(requests, RequestStatus.RELEASED);
        long rejected = countRequestsByStatus(requests, RequestStatus.REJECTED);
        long availableItems = inventoryItemRepository.findByQuantityAvailableGreaterThan(0).size();
        long unreadNotifications = notificationRepository
                .findByUserEmailAndIsReadFalseOrderByCreatedAtDesc(safeEmail)
                .size();

        RecipientDashboardResponse stats = new RecipientDashboardResponse(
                availableItems, pending, approved, released, rejected, unreadNotifications);

        return ApiResponse.ok("Recipient dashboard statistics fetched.", stats);
    }

    @Override
    public ApiResponse getDashboardStats() {
        return getAdminDashboardStats();
    }

    private long countDonationsByStatus(List<Donation> donations, DonationStatus status) {
        return donations.stream().filter(d -> d.getStatus() == status).count();
    }

    private long countRequestsByStatus(List<StudentRequest> requests, RequestStatus status) {
        return requests.stream().filter(r -> r.getStatus() == status).count();
    }

    private long countStudentsHelpedByDonor(List<Donation> donations) {
        Set<String> donatedItemNames = donations.stream()
                .filter(d -> d.getStatus() == DonationStatus.APPROVED)
                .map(d -> d.getItemName().trim().toLowerCase(Locale.ROOT))
                .collect(Collectors.toSet());

        if (donatedItemNames.isEmpty()) {
            return 0;
        }

        return distributionRepository.findAll().stream()
                .filter(d -> donatedItemNames.contains(d.getItemName().trim().toLowerCase(Locale.ROOT)))
                .map(Distribution::getRecipientEmail)
                .distinct()
                .count();
    }

    private List<DashboardDayCount> buildDonationActivityLast7Days(List<Donation> donations) {
        Instant weekStart = Instant.now().minus(7, ChronoUnit.DAYS);
        Map<Integer, Long> byDayOfWeek = new LinkedHashMap<>();
        for (int i = 1; i <= 7; i++) {
            byDayOfWeek.put(i, 0L);
        }
        donations.stream()
                .filter(d -> d.getCreatedAt() != null && !d.getCreatedAt().isBefore(weekStart))
                .forEach(d -> {
                    int dow = d.getCreatedAt().atZone(ZoneId.systemDefault()).getDayOfWeek().getValue();
                    byDayOfWeek.merge(dow, 1L, Long::sum);
                });

        List<DashboardDayCount> result = new ArrayList<>();
        for (int dow = 1; dow <= 7; dow++) {
            result.add(new DashboardDayCount(DAY_LABELS[dow - 1], byDayOfWeek.getOrDefault(dow, 0L)));
        }
        return result;
    }

    private List<DashboardCategoryCount> buildCategoryBreakdown(List<String> categories) {
        if (categories.isEmpty()) {
            return List.of();
        }
        Map<String, Long> grouped = categories.stream()
                .filter(c -> c != null && !c.isBlank())
                .collect(Collectors.groupingBy(String::trim, Collectors.counting()));

        long max = grouped.values().stream().mapToLong(Long::longValue).max().orElse(1L);

        return grouped.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .map(e -> new DashboardCategoryCount(
                        e.getKey(),
                        e.getValue(),
                        max == 0 ? 0 : (int) Math.round((e.getValue() * 100.0) / max)))
                .toList();
    }

    private List<DashboardLogSummary> buildRecentLogs() {
        return transactionLogRepository.findTop10ByOrderByCreatedAtDesc().stream()
                .limit(5)
                .map(log -> new DashboardLogSummary(
                        log.getId(),
                        log.getAction(),
                        log.getDetails(),
                        log.getPerformedBy(),
                        formatInstant(log.getCreatedAt())))
                .toList();
    }

    private List<DashboardNotificationSummary> buildRecentNotifications(List<Notification> notifications) {
        return notifications.stream()
                .limit(5)
                .map(n -> new DashboardNotificationSummary(
                        n.getId(),
                        n.getTitle() != null && !n.getTitle().isBlank() ? n.getTitle() : n.getMessage(),
                        n.getMessage(),
                        n.getType(),
                        n.isRead(),
                        formatInstant(n.getCreatedAt())))
                .toList();
    }

    private DonationResponse toDonationResponse(Donation donation) {
        return new DonationResponse(
                donation.getId(),
                donation.getDonorName(),
                donation.getDonorEmail(),
                donation.getItemName(),
                donation.getCategory(),
                donation.getItemCondition(),
                donation.getStatus().name(),
                donation.getQuantity(),
                donation.getDescription(),
                formatInstant(donation.getCreatedAt()));
    }

    private StudentRequestResponse toStudentRequestResponse(StudentRequest entity) {
        return new StudentRequestResponse(
                entity.getId(),
                entity.getStudentName(),
                entity.getStudentEmail(),
                entity.getRequestedItemName(),
                entity.getCategory(),
                entity.getReason(),
                entity.getStatus().name(),
                entity.getCreatedAt() == null ? "-" : entity.getCreatedAt().toString(),
                null);
    }

    private InventoryResponse toInventoryResponse(InventoryItem item) {
        return new InventoryResponse(
                item.getId(),
                item.getItemName(),
                item.getCategory() == null ? "" : item.getCategory().name(),
                item.getItemCondition(),
                item.getQuantityAvailable(),
                item.getQrCode(),
                item.getSize(),
                item.getSubjectOrCourse());
    }

    private String formatInstant(Instant instant) {
        if (instant == null) {
            return "—";
        }
        return DATE_TIME_FORMATTER.format(instant.atZone(ZoneId.systemDefault()));
    }
}
