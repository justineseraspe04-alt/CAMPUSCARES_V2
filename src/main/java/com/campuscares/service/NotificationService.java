package com.campuscares.service;

import com.campuscares.dto.response.ApiResponse;

public interface NotificationService {
    ApiResponse createNotification(String recipientEmail, String message);

    ApiResponse getNotificationsByEmail(String email);

    ApiResponse getUnreadNotificationsByEmail(String email);

    ApiResponse markNotificationAsRead(Long id);

    ApiResponse markAllAsRead(String email);

    ApiResponse getNotificationStats(String email);
}
