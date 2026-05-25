package com.campuscares.api;

import com.campuscares.dto.request.DistributionRequest;
import com.campuscares.dto.response.ApiResponse;
import com.campuscares.security.AuthorizationUtil;
import com.campuscares.service.DistributionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/distributions")
public class DistributionApiController {
    private final DistributionService distributionService;
    private final AuthorizationUtil authorizationUtil;

    public DistributionApiController(DistributionService distributionService, AuthorizationUtil authorizationUtil) {
        this.distributionService = distributionService;
        this.authorizationUtil = authorizationUtil;
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAll() {
        return ResponseEntity.ok(distributionService.getAllDistributions());
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse> getStats() {
        return ResponseEntity.ok(distributionService.getDistributionStats());
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse> search(@RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(distributionService.searchDistributions(keyword));
    }

    @PostMapping("/release")
    public ResponseEntity<ApiResponse> release(
            @RequestParam(required = false) String role,
            @Valid @RequestBody DistributionRequest request) {
        if (role != null && !role.isBlank()) {
            authorizationUtil.requireAdmin(role);
        }
        return ResponseEntity.ok(distributionService.releaseItem(request));
    }
}
