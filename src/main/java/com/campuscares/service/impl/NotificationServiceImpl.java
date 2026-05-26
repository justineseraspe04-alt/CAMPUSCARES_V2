package com.campuscares.service.impl;

import com.campuscares.dto.request.NotificationRequest;
import com.campuscares.dto.response.ApiResponse;
import com.campuscares.dto.response.NotificationResponse;
import com.campuscares.dto.response.NotificationStatsResponse;
import com.campuscares.exception.InvalidOperationException;
import com.campuscares.exception.ResourceNotFoundException;
import com.campuscares.model.Notification;
import com.campuscares.repository.NotificationRepository;
import com.campuscares.service.NotificationService;
import com.campuscares.util.NotificationTypes;
import com.campuscares.util.ValidationUtils;
import java.util.Comparator;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository notificationRepository;

    public NotificationServiceImpl(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Override
    public ApiResponse createNotification(NotificationRequest request) {
        String type = request.getType() == null || request.getType().isBlank()
                ? NotificationTypes.GENERAL
                : request.getType().trim();
        return createNotification(
                request.getUserEmail(),
                request.getTitle(),
                request.getMessage(),
                type);
    }

    @Override
    public ApiResponse createNotification(String userEmail, String title, String message, String type) {
        Notification notification = new Notification();
        notification.setUserEmail(ValidationUtils.requireNonBlank(userEmail, "userEmail"));
        notification.setTitle(ValidationUtils.requireNonBlank(title, "title"));
        notification.setMessage(ValidationUtils.requireNonBlank(message, "message"));
        notification.setType(
                type == null || type.isBlank() ? NotificationTypes.GENERAL : type.trim());
        notification.setRead(false);
        Notification saved = notificationRepository.save(notification);
        return ApiResponse.ok("Notification created successfully.", toResponse(saved));
    }

    @Override
    public ApiResponse getNotificationsByEmail(String email) {
        String safeEmail = ValidationUtils.requireNonBlank(email, "email").trim().toLowerCase();
        List<NotificationResponse> data = notificationRepository
                .findByUserEmailIgnoreCaseOrderByCreatedAtDesc(safeEmail)
                .stream()
                .map(this::toResponse)
                .toList();
        return ApiResponse.ok("Notifications retrieved successfully.", data);
    }

    @Override
    public ApiResponse getUnreadNotificationsByEmail(String email) {
        String safeEmail = ValidationUtils.requireNonBlank(email, "email").trim().toLowerCase();
        List<NotificationResponse> data = notificationRepository
                .findByUserEmailIgnoreCaseAndIsReadFalseOrderByCreatedAtDesc(safeEmail)
                .stream()
                .map(this::toResponse)
                .toList();
        return ApiResponse.ok("Unread notifications retrieved successfully.", data);
    }

    @Override
    public ApiResponse markNotificationAsRead(Long id, String email) {
        String safeEmail = ValidationUtils.requireNonBlank(email, "email").trim().toLowerCase();
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found: " + id));
        if (!notification.getUserEmail().equalsIgnoreCase(safeEmail)) {
            throw new InvalidOperationException("Notification does not belong to this user.");
        }
        notification.setRead(true);
        Notification saved = notificationRepository.save(notification);
        return ApiResponse.ok("Notification marked as read.", toResponse(saved));
    }

    @Override
    @Transactional
    public ApiResponse markAllAsRead(String email) {
        String safeEmail = ValidationUtils.requireNonBlank(email, "email").trim().toLowerCase();
        List<Notification> unread = notificationRepository
                .findByUserEmailIgnoreCaseAndIsReadFalseOrderByCreatedAtDesc(safeEmail);
        unread.forEach(notification -> notification.setRead(true));
        notificationRepository.saveAll(unread);
        return ApiResponse.ok("All notifications marked as read.", unread.size());
    }

    @Override
    public ApiResponse getNotificationStats(String email) {
        String safeEmail = ValidationUtils.requireNonBlank(email, "email").trim().toLowerCase();
        List<Notification> all =
                notificationRepository.findByUserEmailIgnoreCaseOrderByCreatedAtDesc(safeEmail);
        long total = all.size();
        long unread = all.stream().filter(notification -> !notification.isRead()).count();
        long read = total - unread;
        String latestAlert = all.stream()
                .filter(notification -> !notification.isRead())
                .max(Comparator.comparing(Notification::getCreatedAt))
                .map(n -> n.getTitle() != null && !n.getTitle().isBlank() ? n.getTitle() : n.getMessage())
                .orElseGet(() -> all.stream()
                        .findFirst()
                        .map(n -> n.getTitle() != null && !n.getTitle().isBlank() ? n.getTitle() : n.getMessage())
                        .orElse("No alerts yet"));

        return ApiResponse.ok(
                "Notification stats retrieved successfully.",
                new NotificationStatsResponse(total, unread, read, latestAlert));
    }

    private NotificationResponse toResponse(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getUserEmail(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getType(),
                notification.isRead(),
                notification.getCreatedAt());
    }
}
