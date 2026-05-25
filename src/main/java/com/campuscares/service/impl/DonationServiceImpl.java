package com.campuscares.service.impl;

import com.campuscares.dto.request.DonationRequest;
import com.campuscares.dto.response.ApiResponse;
import com.campuscares.dto.response.DonationResponse;
import com.campuscares.enums.DonationStatus;
import com.campuscares.enums.ItemCategory;
import com.campuscares.exception.ResourceNotFoundException;
import com.campuscares.model.Donation;
import com.campuscares.model.InventoryItem;
import com.campuscares.model.TransactionLog;
import com.campuscares.repository.DonationRepository;
import com.campuscares.repository.InventoryItemRepository;
import com.campuscares.repository.TransactionLogRepository;
import com.campuscares.service.DonationService;
import com.campuscares.service.NotificationService;
import com.campuscares.util.CategoryUtil;
import com.campuscares.util.ItemConditionUtil;
import com.campuscares.util.NotificationConstants;
import com.campuscares.util.QrCodeUtil;
import com.campuscares.util.ValidationUtils;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DonationServiceImpl implements DonationService {
    private final DonationRepository donationRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final TransactionLogRepository transactionLogRepository;
    private final NotificationService notificationService;
    private final QrCodeUtil qrCodeUtil;
    private static final DateTimeFormatter DATE_TIME_FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    public DonationServiceImpl(
            DonationRepository donationRepository,
            InventoryItemRepository inventoryItemRepository,
            TransactionLogRepository transactionLogRepository,
            NotificationService notificationService,
            QrCodeUtil qrCodeUtil) {
        this.donationRepository = donationRepository;
        this.inventoryItemRepository = inventoryItemRepository;
        this.transactionLogRepository = transactionLogRepository;
        this.notificationService = notificationService;
        this.qrCodeUtil = qrCodeUtil;
    }

    @Override
    public ApiResponse submitDonation(DonationRequest request) {
        ValidationUtils.requirePositive(request.getQuantity(), "quantity");
        Donation donation = new Donation();
        donation.setDonorName(ValidationUtils.requireNonBlank(request.getDonorName(), "donorName"));
        donation.setDonorEmail(ValidationUtils.requireNonBlank(request.getDonorEmail(), "donorEmail"));
        donation.setItemName(ValidationUtils.requireNonBlank(request.getItemName(), "itemName"));
        donation.setCategory(ValidationUtils.requireNonBlank(request.getCategory(), "category"));
        donation.setItemCondition(ValidationUtils.requireNonBlank(request.getItemCondition(), "itemCondition"));
        donation.setQuantity(request.getQuantity());
        donation.setDescription(ValidationUtils.requireNonBlank(request.getDescription(), "description"));
        donation.setSize(request.getSize());
        donation.setSubjectOrCourse(request.getSubjectOrCourse());
        donation.setStatus(DonationStatus.PENDING);

        Donation saved = donationRepository.save(donation);
        notificationService.createNotification(
                NotificationConstants.ADMIN_EMAIL,
                "New donation submitted by " + saved.getDonorName() + ": " + saved.getItemName());
        return ApiResponse.ok("Donation submitted and waiting for admin approval.", toResponse(saved));
    }

    @Override
    @Transactional
    public ApiResponse approveDonation(Long donationId) {
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found: " + donationId));

        donation.setStatus(DonationStatus.APPROVED);

        ItemCategory category = CategoryUtil.toItemCategory(donation.getCategory());
        String condition = ItemConditionUtil.toItemCondition(donation.getItemCondition()).name();

        InventoryItem item = inventoryItemRepository
                .findMatchingItem(
                        donation.getItemName(),
                        category,
                        condition,
                        donation.getSize(),
                        donation.getSubjectOrCourse())
                .orElseGet(() -> {
                    InventoryItem newItem = new InventoryItem();
                    newItem.setItemName(donation.getItemName());
                    newItem.setCategory(category);
                    newItem.setItemCondition(condition);
                    newItem.setSize(donation.getSize());
                    newItem.setSubjectOrCourse(donation.getSubjectOrCourse());
                    newItem.setQuantityAvailable(0);
                    newItem.setQrCode(qrCodeUtil.generateQrCodeText());
                    return newItem;
                });

        item.setQuantityAvailable(item.getQuantityAvailable() + donation.getQuantity());
        if (item.getQrCode() == null || item.getQrCode().isBlank()) {
            item.setQrCode(qrCodeUtil.generateQrCodeText());
        }

        InventoryItem savedItem = inventoryItemRepository.save(item);
        donationRepository.save(donation);

        TransactionLog log = new TransactionLog();
        log.setAction("DONATION_APPROVED");
        log.setDetails("Approved donation #" + donation.getId() + " and added "
                + donation.getQuantity() + " units of \"" + savedItem.getItemName()
                + "\" to inventory (item #" + savedItem.getId() + ").");
        log.setPerformedBy("admin@campuscares.com");
        transactionLogRepository.save(log);

        notificationService.createNotification(
                donation.getDonorEmail(),
                "Your donation '" + donation.getItemName() + "' has been approved and added to inventory.");

        return ApiResponse.ok("Donation approved and added to inventory.", toResponse(donation));
    }

    @Override
    public ApiResponse rejectDonation(Long donationId) {
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new ResourceNotFoundException("Donation not found: " + donationId));
        donation.setStatus(DonationStatus.REJECTED);
        donationRepository.save(donation);
        notificationService.createNotification(
                donation.getDonorEmail(),
                "Your donation '" + donation.getItemName() + "' was rejected.");
        return ApiResponse.ok("Donation rejected.", toResponse(donation));
    }

    @Override
    public ApiResponse getAllDonations() {
        List<DonationResponse> data = donationRepository.findAll().stream().map(this::toResponse).toList();
        return ApiResponse.ok("All donations fetched.", data);
    }

    @Override
    public ApiResponse getPendingDonations() {
        List<DonationResponse> data = donationRepository.findByStatus(DonationStatus.PENDING).stream()
                .map(this::toResponse)
                .toList();
        return ApiResponse.ok("Pending donations fetched.", data);
    }

    @Override
    public ApiResponse getDonationsByDonorEmail(String donorEmail) {
        String safeEmail = ValidationUtils.requireNonBlank(donorEmail, "donorEmail");
        List<DonationResponse> data = donationRepository.findByDonorEmail(safeEmail).stream()
                .map(this::toResponse)
                .toList();
        return ApiResponse.ok("Donations by donor fetched.", data);
    }

    private DonationResponse toResponse(Donation donation) {
        String submittedAt = donation.getCreatedAt() == null
                ? "-"
                : DATE_TIME_FORMATTER.format(donation.getCreatedAt().atZone(ZoneId.systemDefault()));
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
                submittedAt);
    }
}
