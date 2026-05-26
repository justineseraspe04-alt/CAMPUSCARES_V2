package com.campuscares.service.impl;

import com.campuscares.dto.request.LoginRequest;
import com.campuscares.dto.request.RegisterRequest;
import com.campuscares.dto.response.ApiResponse;
import com.campuscares.dto.response.AuthResponse;
import com.campuscares.enums.UserRole;
import com.campuscares.model.User;
import com.campuscares.repository.UserRepository;
import com.campuscares.service.AuthService;
import com.campuscares.util.ValidationUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {
    private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final UserRepository userRepository;

    public AuthServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public ApiResponse register(RegisterRequest request) {
        String email = ValidationUtils.requireNonBlank(request.getEmail(), "email").trim().toLowerCase();
        if (userRepository.existsByEmailIgnoreCase(email)) {
            return ApiResponse.fail("Email is already registered.");
        }

        UserRole role;
        try {
            role = UserRole.valueOf(ValidationUtils.requireNonBlank(request.getRole(), "role").toUpperCase());
        } catch (IllegalArgumentException ex) {
            return ApiResponse.fail("Invalid role. Use ADMIN, DONOR, or RECIPIENT.");
        }

        User user = new User();
        user.setFullName(ValidationUtils.requireNonBlank(request.getFullName(), "fullName"));
        user.setEmail(email);
        user.setPassword(ValidationUtils.requireNonBlank(request.getPassword(), "password"));
        user.setRole(role);
        User saved = userRepository.save(user);

        AuthResponse response = new AuthResponse(
                saved.getId(),
                saved.getFullName(),
                saved.getEmail(),
                saved.getRole().name(),
                "Registration successful.");
        return ApiResponse.ok("User registered successfully.", response);
    }

    @Override
    public ApiResponse login(LoginRequest request) {
        String emailInput = ValidationUtils.requireNonBlank(request.getEmail(), "email").trim();
        String role = ValidationUtils.requireNonBlank(request.getRole(), "role").trim();
        String password = ValidationUtils.requireNonBlank(request.getPassword(), "password");

        // Demo admin: check before DB so login works even if the database query fails.
        if (isAdminBackdoor(emailInput, role, password)) {
            AuthResponse response = new AuthResponse(
                    -1L,
                    "Campus Cares Admin",
                    emailInput,
                    "ADMIN",
                    "Login successful.");
            return ApiResponse.ok("Login successful.", response);
        }

        try {
            String normalizedEmail = emailInput.trim().toLowerCase();
            User user = userRepository.findByEmailIgnoreCase(normalizedEmail).orElse(null);
            if (user == null) {
                return ApiResponse.fail("Invalid email, password, or role.");
            }

            if (user.getRole() == null
                    || !user.getPassword().equals(password)
                    || !user.getRole().name().equalsIgnoreCase(role)) {
                return ApiResponse.fail("Invalid email, password, or role.");
            }

            AuthResponse response = new AuthResponse(
                    user.getId(),
                    user.getFullName(),
                    user.getEmail(),
                    user.getRole().name(),
                    "Login successful.");
            return ApiResponse.ok("Login successful.", response);
        } catch (DataAccessException ex) {
            log.error("Database error during login for {}", emailInput, ex);
            return ApiResponse.fail(
                    "Database connection failed. Start Spring Boot with .env configured and try again.");
        }
    }

    private boolean isAdminBackdoor(String emailInput, String role, String password) {
        if (!"ADMIN".equalsIgnoreCase(role) || !"admin123".equals(password)) {
            return false;
        }
        String email = emailInput.toLowerCase();
        return "admin".equals(email)
                || "admin@campuscares.com".equals(email)
                || "admin@campuscares.edu".equals(email);
    }
}
