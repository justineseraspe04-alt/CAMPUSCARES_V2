package com.campuscares.service.impl;



import com.campuscares.dto.request.StudentItemRequest;

import com.campuscares.dto.response.ApiResponse;


import com.campuscares.dto.response.StudentRequestResponse;

import com.campuscares.enums.RequestStatus;

import com.campuscares.exception.InvalidOperationException;

import com.campuscares.exception.ResourceNotFoundException;

import com.campuscares.model.StudentRequest;

import com.campuscares.model.TransactionLog;

import com.campuscares.repository.InventoryItemRepository;

import com.campuscares.repository.StudentRequestRepository;

import com.campuscares.repository.TransactionLogRepository;

import com.campuscares.service.DashboardService;

import com.campuscares.service.NotificationService;

import com.campuscares.service.StudentRequestService;

import com.campuscares.util.NotificationConstants;
import com.campuscares.util.NotificationTypes;

import com.campuscares.util.ValidationUtils;

import java.util.List;

import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;



@Service

public class StudentRequestServiceImpl implements StudentRequestService {

    private static final String ADMIN_ACTOR = "admin@campuscares.com";



    private final StudentRequestRepository studentRequestRepository;

    private final InventoryItemRepository inventoryItemRepository;

    private final NotificationService notificationService;

    private final TransactionLogRepository transactionLogRepository;

    private final DashboardService dashboardService;



    public StudentRequestServiceImpl(

            StudentRequestRepository studentRequestRepository,

            InventoryItemRepository inventoryItemRepository,

            NotificationService notificationService,

            TransactionLogRepository transactionLogRepository,

            DashboardService dashboardService) {

        this.studentRequestRepository = studentRequestRepository;

        this.inventoryItemRepository = inventoryItemRepository;

        this.notificationService = notificationService;

        this.transactionLogRepository = transactionLogRepository;

        this.dashboardService = dashboardService;

    }



    @Override

    public ApiResponse submitRequest(StudentItemRequest request) {

        StudentRequest entity = new StudentRequest();

        entity.setStudentName(ValidationUtils.requireNonBlank(request.getStudentName(), "studentName"));

        entity.setStudentEmail(ValidationUtils.requireNonBlank(request.getStudentEmail(), "studentEmail"));

        entity.setRequestedItemName(

                ValidationUtils.requireNonBlank(request.getRequestedItemName(), "requestedItemName"));

        entity.setCategory(ValidationUtils.requireNonBlank(request.getCategory(), "category"));

        entity.setReason(ValidationUtils.requireNonBlank(request.getReason(), "reason"));

        entity.setStatus(RequestStatus.PENDING);

        StudentRequest saved = studentRequestRepository.save(entity);

        notificationService.createNotification(
                NotificationConstants.ADMIN_EMAIL,
                "New recipient request",
                "New item request submitted by " + saved.getStudentName() + ": " + saved.getRequestedItemName(),
                NotificationTypes.ADMIN_NEW_REQUEST);
        notificationService.createNotification(
                saved.getStudentEmail(),
                "Request submitted successfully",
                "Your request for \"" + saved.getRequestedItemName() + "\" was submitted and is pending admin review.",
                NotificationTypes.REQUEST_SUBMITTED);

        return ApiResponse.ok("Student request submitted.", toResponse(saved));

    }



    @Override

    @Transactional

    public ApiResponse approveRequest(Long requestId) {

        StudentRequest entity = studentRequestRepository.findById(requestId)

                .orElseThrow(() -> new ResourceNotFoundException("Student request not found: " + requestId));



        if (entity.getStatus() != RequestStatus.PENDING) {

            throw new InvalidOperationException(

                    "Only pending requests can be approved. Current status: " + entity.getStatus());

        }



        entity.setStatus(RequestStatus.APPROVED);

        studentRequestRepository.save(entity);



        TransactionLog log = new TransactionLog();

        log.setAction("REQUEST_APPROVED");

        log.setDetails("Approved request #" + entity.getId() + " for \"" + entity.getRequestedItemName()

                + "\" by " + entity.getStudentName() + ".");

        log.setPerformedBy(ADMIN_ACTOR);

        transactionLogRepository.save(log);



        notificationService.createNotification(
                entity.getStudentEmail(),
                "Request approved",
                "Your request for '" + entity.getRequestedItemName() + "' has been approved.",
                NotificationTypes.REQUEST_APPROVED);

        return ApiResponse.ok("Student request approved. Item release is handled separately.", toResponse(entity));

    }



    @Override

    @Transactional

    public ApiResponse rejectRequest(Long requestId) {

        StudentRequest entity = studentRequestRepository.findById(requestId)

                .orElseThrow(() -> new ResourceNotFoundException("Student request not found: " + requestId));



        if (entity.getStatus() != RequestStatus.PENDING) {

            throw new InvalidOperationException(

                    "Only pending requests can be rejected. Current status: " + entity.getStatus());

        }



        entity.setStatus(RequestStatus.REJECTED);

        studentRequestRepository.save(entity);



        TransactionLog log = new TransactionLog();

        log.setAction("REQUEST_REJECTED");

        log.setDetails("Rejected request #" + entity.getId() + " for \"" + entity.getRequestedItemName()

                + "\" by " + entity.getStudentName() + ".");

        log.setPerformedBy(ADMIN_ACTOR);

        transactionLogRepository.save(log);



        notificationService.createNotification(
                entity.getStudentEmail(),
                "Request rejected",
                "Your request for '" + entity.getRequestedItemName() + "' was rejected.",
                NotificationTypes.REQUEST_REJECTED);

        return ApiResponse.ok("Student request rejected.", toResponse(entity));

    }



    @Override

    public ApiResponse getPendingRequests() {

        List<StudentRequestResponse> data = studentRequestRepository.findByStatus(RequestStatus.PENDING).stream()

                .map(this::toResponse)

                .toList();

        return ApiResponse.ok("Pending requests fetched.", data);

    }



    @Override

    public ApiResponse getAllRequests() {

        List<StudentRequestResponse> data = studentRequestRepository.findAll().stream()

                .map(this::toResponse)

                .toList();

        return ApiResponse.ok("All requests fetched.", data);

    }



    @Override

    public ApiResponse getRequestsByStudentEmail(String studentEmail) {

        String safeEmail = ValidationUtils.requireNonBlank(studentEmail, "studentEmail");

        List<StudentRequestResponse> data = studentRequestRepository

                .findByStudentEmailOrderByCreatedAtDesc(safeEmail)

                .stream()

                .map(this::toResponse)

                .toList();

        return ApiResponse.ok("Requests by student email fetched.", data);

    }



    @Override

    public ApiResponse getRecipientStats(String studentEmail) {

        return dashboardService.getRecipientDashboardStats(studentEmail);

    }



    private StudentRequestResponse toResponse(StudentRequest entity) {

        String createdAt = entity.getCreatedAt() == null ? "-" : entity.getCreatedAt().toString();

        return new StudentRequestResponse(

                entity.getId(),

                entity.getStudentName(),

                entity.getStudentEmail(),

                entity.getRequestedItemName(),

                entity.getCategory(),

                entity.getReason(),

                entity.getStatus().name(),

                createdAt);

    }

}


