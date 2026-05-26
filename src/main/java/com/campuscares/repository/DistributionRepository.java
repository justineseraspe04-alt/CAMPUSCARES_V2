package com.campuscares.repository;

import com.campuscares.model.Distribution;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DistributionRepository extends JpaRepository<Distribution, Long> {
    boolean existsByPickupReferenceNumber(String pickupReferenceNumber);

    boolean existsByRequestId(Long requestId);

    Optional<Distribution> findFirstByRequestIdOrderByReleasedAtDesc(Long requestId);

    List<Distribution> findAllByOrderByReleasedAtDesc();

    List<Distribution> findByRecipientEmailOrderByReleasedAtDesc(String recipientEmail);

    List<Distribution> findByItemNameContainingIgnoreCaseOrderByReleasedAtDesc(String itemName);

    @Query("""
            SELECT d FROM Distribution d
            WHERE LOWER(d.recipientName) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(d.recipientEmail) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(d.itemName) LIKE LOWER(CONCAT('%', :keyword, '%'))
            ORDER BY d.releasedAt DESC
            """)
    List<Distribution> search(@Param("keyword") String keyword);

    @Query("SELECT COALESCE(SUM(d.quantityReleased), 0) FROM Distribution d")
    long sumDistributedQuantity();

    @Query("SELECT COUNT(DISTINCT d.recipientEmail) FROM Distribution d")
    long countDistinctBeneficiaries();

    @Query("SELECT COUNT(d) FROM Distribution d WHERE d.releasedAt >= :since")
    long countReleasedSince(@Param("since") Instant since);
}
