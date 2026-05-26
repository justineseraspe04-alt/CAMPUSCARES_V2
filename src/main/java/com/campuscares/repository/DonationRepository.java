package com.campuscares.repository;

import com.campuscares.enums.DonationStatus;
import com.campuscares.model.Donation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findByStatus(DonationStatus status);

    List<Donation> findByDonorEmail(String donorEmail);

    List<Donation> findByDonorEmailOrderByCreatedAtDesc(String donorEmail);
}

