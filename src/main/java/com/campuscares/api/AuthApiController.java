package com.campuscares.api;

import com.campuscares.dto.request.LoginRequest;
import com.campuscares.dto.request.RegisterRequest;
import com.campuscares.dto.response.ApiResponse;
import com.campuscares.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// MVC/API layer:
// - Receives HTTP requests
// - Validates request DTOs
// - Delegates business logic to service layer
// - Returns response DTO structure via ApiResponse
@RestController
@RequestMapping("/api/auth")
public class AuthApiController {
    private final AuthService authService;

    public AuthApiController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}

