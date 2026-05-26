package com.campuscares.service;

import com.campuscares.dto.request.DonationRequest;
import com.campuscares.dto.response.ApiResponse;

public interface DonationService {
    ApiResponse submitDonation(DonationRequest request);

    ApiResponse approveDonation(Long donationId);

    ApiResponse rejectDonation(Long donationId);

    ApiResponse getAllDonations();

    ApiResponse getPendingDonations();

    ApiResponse getDonationsByDonorEmail(String donorEmail);

    ApiResponse getDonorStats(String donorEmail);
}

