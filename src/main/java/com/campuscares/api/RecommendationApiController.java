package com.campuscares.api;

import com.campuscares.dto.response.ApiResponse;
import com.campuscares.service.RecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationApiController {
    private final RecommendationService recommendationService;

    public RecommendationApiController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping("/student")
    public ResponseEntity<ApiResponse> recommend(@RequestParam(required = false) String email) {
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.fail("email query parameter is required"));
        }
        return ResponseEntity.ok(recommendationService.getRecommendationsForStudent(email.trim()));
    }
}

