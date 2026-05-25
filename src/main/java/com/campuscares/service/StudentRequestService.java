package com.campuscares.service;

import com.campuscares.dto.request.StudentItemRequest;
import com.campuscares.dto.response.ApiResponse;

public interface StudentRequestService {
    ApiResponse submitRequest(StudentItemRequest request);

    ApiResponse approveRequest(Long requestId);

    ApiResponse rejectRequest(Long requestId);

    ApiResponse getPendingRequests();

    ApiResponse getAllRequests();

    ApiResponse getRequestsByStudentEmail(String studentEmail);
}

