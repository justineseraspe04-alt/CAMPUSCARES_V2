package com.campuscares.service.impl;

import com.campuscares.dto.response.ApiResponse;
import com.campuscares.dto.response.NotificationResponse;
import com.campuscares.dto.response.NotificationStatsResponse;
import com.campuscares.exception.ResourceNotFoundException;
import com.campuscares.model.Notification;
import com.campuscares.repository.NotificationRepository;
import com.campuscares.service.NotificationService;
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
    public ApiResponse createNotification(String recipientEmail, String message) {
        Notification notification = new Notification();
        notification.setRecipientEmail(ValidationUtils.requireNonBlank(recipientEmail, "recipientEmail"));
        notification.setMessage(ValidationUtils.requireNonBlank(message, "message"));
        notification.setRead(false);
        Notification saved = notificationRepository.save(notification);
        return ApiResponse.ok("Notification created successfully.", toResponse(saved));
    }

    @Override
    public ApiResponse getNotificationsByEmail(String email) {
        String safeEmail = ValidationUtils.requireNonBlank(email, "email");
        List<NotificationResponse> data = notificationRepository.findByRecipientEmailOrderByCreatedAtDesc(safeEmail)
                .stream()
                .map(this::toResponse)
                .toList();
        return ApiResponse.ok("Notifications retrieved successfully.", data);
    }

    @Override
    public ApiResponse getUnreadNotificationsByEmail(String email) {
        String safeEmail = ValidationUtils.requireNonBlank(email, "email");
        List<NotificationResponse> data =
                notificationRepository.findByRecipientEmailAndIsReadFalseOrderByCreatedAtDesc(safeEmail).stream()
                        .map(this::toResponse)
                        .toList();
        return ApiResponse.ok("Unread notifications retrieved successfully.", data);
    }

    @Override
    public ApiResponse markNotificationAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found: " + id));
        notification.setRead(true);
        Notification saved = notificationRepository.save(notification);
        return ApiResponse.ok("Notification marked as read.", toResponse(saved));
    }

    @Override
    @Transactional
    public ApiResponse markAllAsRead(String email) {
        String safeEmail = ValidationUtils.requireNonBlank(email, "email");
        List<Notification> unread =
                notificationRepository.findByRecipientEmailAndIsReadFalseOrderByCreatedAtDesc(safeEmail);
        unread.forEach(notification -> notification.setRead(true));
        notificationRepository.saveAll(unread);
        return ApiResponse.ok(
                "All notifications marked as read.",
                unread.size());
    }

    @Override
    public ApiResponse getNotificationStats(String email) {
        String safeEmail = ValidationUtils.requireNonBlank(email, "email");
        List<Notification> all = notificationRepository.findByRecipientEmailOrderByCreatedAtDesc(safeEmail);
        long total = all.size();
        long unread = all.stream().filter(notification -> !notification.isRead()).count();
        long read = total - unread;
        String latestAlert = all.stream()
                .filter(notification -> !notification.isRead())
                .max(Comparator.comparing(Notification::getCreatedAt))
                .map(Notification::getMessage)
                .orElseGet(() -> all.stream()
                        .findFirst()
                        .map(Notification::getMessage)
                        .orElse("No alerts yet"));

        return ApiResponse.ok(
                "Notification stats retrieved successfully.",
                new NotificationStatsResponse(total, unread, read, latestAlert));
    }

    private NotificationResponse toResponse(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getRecipientEmail(),
                notification.getMessage(),
                notification.isRead(),
                notification.getCreatedAt());
    }
}
