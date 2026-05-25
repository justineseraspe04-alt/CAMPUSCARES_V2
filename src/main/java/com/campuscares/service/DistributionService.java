package com.campuscares.service;

import com.campuscares.dto.request.DistributionRequest;
import com.campuscares.dto.response.ApiResponse;

public interface DistributionService {
    ApiResponse getAllDistributions();

    ApiResponse getDistributionStats();

    ApiResponse searchDistributions(String keyword);

    ApiResponse releaseItem(DistributionRequest request);
}
