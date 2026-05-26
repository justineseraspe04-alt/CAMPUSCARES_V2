package com.campuscares.repository;

import com.campuscares.model.Notification;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserEmailOrderByCreatedAtDesc(String userEmail);

    List<Notification> findByUserEmailIgnoreCaseOrderByCreatedAtDesc(String userEmail);

    List<Notification> findByUserEmailAndIsReadFalseOrderByCreatedAtDesc(String userEmail);

    List<Notification> findByUserEmailIgnoreCaseAndIsReadFalseOrderByCreatedAtDesc(String userEmail);
}
