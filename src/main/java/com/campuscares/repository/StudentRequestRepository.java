package com.campuscares.repository;

import com.campuscares.enums.RequestStatus;
import com.campuscares.model.StudentRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentRequestRepository extends JpaRepository<StudentRequest, Long> {
    List<StudentRequest> findByStatus(RequestStatus status);

    List<StudentRequest> findByStudentEmail(String studentEmail);

    List<StudentRequest> findByStudentEmailOrderByCreatedAtDesc(String studentEmail);

    List<StudentRequest> findByStudentEmailIgnoreCaseOrderByCreatedAtDesc(String studentEmail);

    List<StudentRequest> findByStudentEmailAndRequestedItemNameAndStatus(
            String studentEmail,
            String requestedItemName,
            RequestStatus status
    );
}

