package com.campuscares.security;

import org.springframework.stereotype.Component;

@Component
public class AuthorizationUtil {
    // Authorization-ready helper for school documentation/demo:
    // - Controllers call this utility before invoking service methods.
    // - This is temporary and will be replaced with Spring Security/JWT later.

    public void requireAdmin(String role) {
        if (!"ADMIN".equalsIgnoreCase(role)) {
            throw new RuntimeException("Access denied. ADMIN role required.");
        }
    }

    public void requireDonor(String role) {
        if (!"DONOR".equalsIgnoreCase(role)) {
            throw new RuntimeException("Access denied. DONOR role required.");
        }
    }

    public void requireRecipient(String role) {
        if (!"RECIPIENT".equalsIgnoreCase(role)) {
            throw new RuntimeException("Access denied. RECIPIENT role required.");
        }
    }
}

