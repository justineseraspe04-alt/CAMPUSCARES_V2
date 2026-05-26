package com.campuscares.service;

import com.campuscares.dto.request.NotificationRequest;
import com.campuscares.dto.response.ApiResponse;

public interface NotificationService {
    ApiResponse createNotification(NotificationRequest request);

    ApiResponse createNotification(String userEmail, String title, String message, String type);

    ApiResponse getNotificationsByEmail(String email);

    ApiResponse getUnreadNotificationsByEmail(String email);

    ApiResponse markNotificationAsRead(Long id, String email);

    ApiResponse markAllAsRead(String email);

    ApiResponse getNotificationStats(String email);
}
