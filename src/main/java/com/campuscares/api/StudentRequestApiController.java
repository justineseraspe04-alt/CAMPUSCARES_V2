package com.campuscares.api;

import com.campuscares.dto.request.StudentItemRequest;
import com.campuscares.dto.response.ApiResponse;
import com.campuscares.security.AuthorizationUtil;
import com.campuscares.service.StudentRequestService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/requests")
public class StudentRequestApiController {
    private final StudentRequestService studentRequestService;
    private final AuthorizationUtil authorizationUtil;

    public StudentRequestApiController(StudentRequestService studentRequestService, AuthorizationUtil authorizationUtil) {
        this.studentRequestService = studentRequestService;
        this.authorizationUtil = authorizationUtil;
    }

    @PostMapping("/submit")
    public ResponseEntity<ApiResponse> submit(
            @RequestParam String role,
            @Valid @RequestBody StudentItemRequest request) {
        authorizationUtil.requireRecipient(role);
        return ResponseEntity.ok(studentRequestService.submitRequest(request));
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<ApiResponse> approve(@PathVariable Long id, @RequestParam String role) {
        authorizationUtil.requireAdmin(role);
        return ResponseEntity.ok(studentRequestService.approveRequest(id));
    }

    @PutMapping("/reject/{id}")
    public ResponseEntity<ApiResponse> reject(@PathVariable Long id, @RequestParam String role) {
        authorizationUtil.requireAdmin(role);
        return ResponseEntity.ok(studentRequestService.rejectRequest(id));
    }

    @GetMapping("/pending")
    public ResponseEntity<ApiResponse> getPending() {
        return ResponseEntity.ok(studentRequestService.getPendingRequests());
    }

    @GetMapping("/by-student")
    public ResponseEntity<ApiResponse> getByStudentEmail(@RequestParam String studentEmail) {
        return ResponseEntity.ok(studentRequestService.getRequestsByStudentEmail(studentEmail));
    }

    @GetMapping("/student/{email}")
    public ResponseEntity<ApiResponse> getByStudentEmailPath(@PathVariable String email) {
        return ResponseEntity.ok(studentRequestService.getRequestsByStudentEmail(email));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAll() {
        return ResponseEntity.ok(studentRequestService.getAllRequests());
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse> getRecipientStats(@RequestParam String studentEmail) {
        return ResponseEntity.ok(studentRequestService.getRecipientStats(studentEmail));
    }
}

