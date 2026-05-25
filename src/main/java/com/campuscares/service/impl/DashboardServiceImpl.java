package com.campuscares.service.impl;

import com.campuscares.dto.response.ApiResponse;
import com.campuscares.dto.response.DashboardResponse;
import com.campuscares.enums.RequestStatus;
import com.campuscares.repository.DistributionRepository;
import com.campuscares.repository.DonationRepository;
import com.campuscares.repository.StudentRequestRepository;
import com.campuscares.service.DashboardService;
import org.springframework.stereotype.Service;

@Service
public class DashboardServiceImpl implements DashboardService {
    private final DonationRepository donationRepository;
    private final DistributionRepository distributionRepository;
    private final StudentRequestRepository studentRequestRepository;

    public DashboardServiceImpl(
            DonationRepository donationRepository,
            DistributionRepository distributionRepository,
            StudentRequestRepository studentRequestRepository) {
        this.donationRepository = donationRepository;
        this.distributionRepository = distributionRepository;
        this.studentRequestRepository = studentRequestRepository;
    }

    @Override
    public ApiResponse getDashboardStats() {
        long totalDonations = donationRepository.count();
        long totalDistributedItems = distributionRepository.sumDistributedQuantity();
        long pendingRequests = studentRequestRepository.findByStatus(RequestStatus.PENDING).size();
        long beneficiaries = distributionRepository.countDistinctBeneficiaries();

        DashboardResponse response = new DashboardResponse(
                totalDonations,
                totalDistributedItems,
                pendingRequests,
                beneficiaries
        );
        return ApiResponse.ok("Dashboard statistics fetched.", response);
    }
}

