package com.campuscares.service;

import com.campuscares.dto.response.ApiResponse;

public interface RecommendationService {
    ApiResponse getRecommendationsForStudent(String studentEmail);
}
