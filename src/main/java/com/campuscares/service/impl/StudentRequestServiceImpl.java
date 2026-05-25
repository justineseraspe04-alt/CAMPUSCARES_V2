package com.campuscares.service.impl;

import com.campuscares.dto.request.StudentItemRequest;
import com.campuscares.dto.response.ApiResponse;
import com.campuscares.enums.RequestStatus;
import com.campuscares.exception.ResourceNotFoundException;
import com.campuscares.model.StudentRequest;
import com.campuscares.repository.StudentRequestRepository;
import com.campuscares.service.NotificationService;
import com.campuscares.service.StudentRequestService;
import com.campuscares.util.NotificationConstants;
import com.campuscares.util.ValidationUtils;
import org.springframework.stereotype.Service;

@Service
public class StudentRequestServiceImpl implements StudentRequestService {
    private final StudentRequestRepository studentRequestRepository;
    private final NotificationService notificationService;

    public StudentRequestServiceImpl(
            StudentRequestRepository studentRequestRepository,
            NotificationService notificationService) {
        this.studentRequestRepository = studentRequestRepository;
        this.notificationService = notificationService;
    }

    @Override
    public ApiResponse submitRequest(StudentItemRequest request) {
        StudentRequest entity = new StudentRequest();
        entity.setStudentName(ValidationUtils.requireNonBlank(request.getStudentName(), "studentName"));
        entity.setStudentEmail(ValidationUtils.requireNonBlank(request.getStudentEmail(), "studentEmail"));
        entity.setRequestedItemName(ValidationUtils.requireNonBlank(request.getRequestedItemName(), "requestedItemName"));
        entity.setCategory(ValidationUtils.requireNonBlank(request.getCategory(), "category"));
        entity.setReason(ValidationUtils.requireNonBlank(request.getReason(), "reason"));
        entity.setStatus(RequestStatus.PENDING);
        StudentRequest saved = studentRequestRepository.save(entity);
        notificationService.createNotification(
                NotificationConstants.ADMIN_EMAIL,
                "New item request submitted by " + saved.getStudentName() + ": " + saved.getRequestedItemName());
        return ApiResponse.ok("Student request submitted.", saved);
    }

    @Override
    public ApiResponse approveRequest(Long requestId) {
        StudentRequest entity = studentRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Student request not found: " + requestId));
        entity.setStatus(RequestStatus.APPROVED);
        studentRequestRepository.save(entity);
        notificationService.createNotification(
                entity.getStudentEmail(),
                "Your request for '" + entity.getRequestedItemName() + "' has been approved.");
        return ApiResponse.ok("Student request approved. Item release is handled separately.", entity);
    }

    @Override
    public ApiResponse rejectRequest(Long requestId) {
        StudentRequest entity = studentRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Student request not found: " + requestId));
        entity.setStatus(RequestStatus.REJECTED);
        studentRequestRepository.save(entity);
        notificationService.createNotification(
                entity.getStudentEmail(),
                "Your request for '" + entity.getRequestedItemName() + "' was rejected.");
        return ApiResponse.ok("Student request rejected.", entity);
    }

    @Override
    public ApiResponse getPendingRequests() {
        return ApiResponse.ok("Pending requests fetched.",
                studentRequestRepository.findByStatus(RequestStatus.PENDING));
    }

    @Override
    public ApiResponse getAllRequests() {
        return ApiResponse.ok("All requests fetched.", studentRequestRepository.findAll());
    }

    @Override
    public ApiResponse getRequestsByStudentEmail(String studentEmail) {
        String safeEmail = ValidationUtils.requireNonBlank(studentEmail, "studentEmail");
        return ApiResponse.ok("Requests by student email fetched.",
                studentRequestRepository.findByStudentEmail(safeEmail));
    }
}
