package com.campuscares.api;

import com.campuscares.dto.request.CreateNotificationRequest;
import com.campuscares.dto.response.ApiResponse;
import com.campuscares.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
public class NotificationApiController {
    private final NotificationService notificationService;

    public NotificationApiController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/user")
    public ResponseEntity<ApiResponse> getByUser(@RequestParam String email) {
        return ResponseEntity.ok(notificationService.getNotificationsByEmail(email));
    }

    @GetMapping("/unread")
    public ResponseEntity<ApiResponse> getUnread(@RequestParam String email) {
        return ResponseEntity.ok(notificationService.getUnreadNotificationsByEmail(email));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse> getStats(@RequestParam String email) {
        return ResponseEntity.ok(notificationService.getNotificationStats(email));
    }

    @PutMapping("/read/{id}")
    public ResponseEntity<ApiResponse> markRead(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.markNotificationAsRead(id));
    }

    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse> markAllRead(@RequestParam String email) {
        return ResponseEntity.ok(notificationService.markAllAsRead(email));
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse> create(@Valid @RequestBody CreateNotificationRequest request) {
        return ResponseEntity.ok(
                notificationService.createNotification(request.getRecipientEmail(), request.getMessage()));
    }
}
