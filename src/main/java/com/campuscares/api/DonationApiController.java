package com.campuscares.api;

import com.campuscares.dto.request.DonationRequest;
import com.campuscares.dto.response.ApiResponse;
import com.campuscares.security.AuthorizationUtil;
import com.campuscares.service.DonationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")

@RestController
@RequestMapping("/api/donations")
public class DonationApiController {
    private final DonationService donationService;
    private final AuthorizationUtil authorizationUtil;

    public DonationApiController(DonationService donationService, AuthorizationUtil authorizationUtil) {
        this.donationService = donationService;
        this.authorizationUtil = authorizationUtil;
    }

    @PostMapping("/submit")
    public ResponseEntity<ApiResponse> submit(
            @RequestParam String role,
            @Valid @RequestBody DonationRequest request) {
        authorizationUtil.requireDonor(role);
        return ResponseEntity.ok(donationService.submitDonation(request));
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<ApiResponse> approve(@PathVariable Long id, @RequestParam String role) {
        authorizationUtil.requireAdmin(role);
        return ResponseEntity.ok(donationService.approveDonation(id));
    }

    @PutMapping("/reject/{id}")
    public ResponseEntity<ApiResponse> reject(@PathVariable Long id, @RequestParam String role) {
        authorizationUtil.requireAdmin(role);
        return ResponseEntity.ok(donationService.rejectDonation(id));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAll() {
        return ResponseEntity.ok(donationService.getAllDonations());
    }

    @GetMapping("/by-donor")
    public ResponseEntity<ApiResponse> getByDonorEmail(@RequestParam String donorEmail) {
        return ResponseEntity.ok(donationService.getDonationsByDonorEmail(donorEmail));
    }

    @GetMapping("/pending")
    public ResponseEntity<ApiResponse> getPending(@RequestParam String role) {
        authorizationUtil.requireAdmin(role);
        return ResponseEntity.ok(donationService.getPendingDonations());
    }
}

