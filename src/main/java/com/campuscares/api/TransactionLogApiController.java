package com.campuscares.api;

import com.campuscares.dto.response.ApiResponse;
import com.campuscares.service.TransactionLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/logs")
public class TransactionLogApiController {
    private final TransactionLogService transactionLogService;

    public TransactionLogApiController(TransactionLogService transactionLogService) {
        this.transactionLogService = transactionLogService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllLogs() {
        return ResponseEntity.ok(transactionLogService.getAllLogs());
    }
}
