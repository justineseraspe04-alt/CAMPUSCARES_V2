package com.campuscares.service.impl;

import com.campuscares.dto.response.ApiResponse;
import com.campuscares.repository.TransactionLogRepository;
import com.campuscares.service.TransactionLogService;
import org.springframework.stereotype.Service;

// Service Pattern:
// Centralizes transaction-log retrieval for controllers and future business rules.
@Service
public class TransactionLogServiceImpl implements TransactionLogService {
    private final TransactionLogRepository transactionLogRepository;

    public TransactionLogServiceImpl(TransactionLogRepository transactionLogRepository) {
        this.transactionLogRepository = transactionLogRepository;
    }

    @Override
    public ApiResponse getAllLogs() {
        return ApiResponse.ok("All transaction logs fetched.", transactionLogRepository.findAll());
    }
}

