package com.campuscares.api;

import com.campuscares.dto.response.ApiResponse;
import com.campuscares.security.AuthorizationUtil;
import com.campuscares.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardApiController {
    private final DashboardService dashboardService;
    private final AuthorizationUtil authorizationUtil;

    public DashboardApiController(DashboardService dashboardService, AuthorizationUtil authorizationUtil) {
        this.dashboardService = dashboardService;
        this.authorizationUtil = authorizationUtil;
    }

    @GetMapping("/admin")
    public ResponseEntity<ApiResponse> adminStats(@RequestParam String role) {
        authorizationUtil.requireAdmin(role);
        return ResponseEntity.ok(dashboardService.getAdminDashboardStats());
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse> stats(@RequestParam String role) {
        authorizationUtil.requireAdmin(role);
        return ResponseEntity.ok(dashboardService.getAdminDashboardStats());
    }

    @GetMapping("/donor")
    public ResponseEntity<ApiResponse> donorStats(@RequestParam String donorEmail) {
        return ResponseEntity.ok(dashboardService.getDonorDashboardStats(donorEmail));
    }

    @GetMapping("/recipient")
    public ResponseEntity<ApiResponse> recipientStats(@RequestParam String studentEmail) {
        return ResponseEntity.ok(dashboardService.getRecipientDashboardStats(studentEmail));
    }
}
