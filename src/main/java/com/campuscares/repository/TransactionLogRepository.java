package com.campuscares.repository;

import com.campuscares.model.TransactionLog;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionLogRepository extends JpaRepository<TransactionLog, Long> {
    List<TransactionLog> findTop10ByOrderByCreatedAtDesc();
}

