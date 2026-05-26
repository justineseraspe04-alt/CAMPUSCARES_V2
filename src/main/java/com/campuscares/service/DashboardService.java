package com.campuscares.service;

import com.campuscares.dto.response.ApiResponse;

public interface DashboardService {
    ApiResponse getAdminDashboardStats();

    ApiResponse getDonorDashboardStats(String donorEmail);

    ApiResponse getRecipientDashboardStats(String studentEmail);

    /** @deprecated use {@link #getAdminDashboardStats()} */
    ApiResponse getDashboardStats();
}
