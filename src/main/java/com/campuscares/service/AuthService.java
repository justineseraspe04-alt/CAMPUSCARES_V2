package com.campuscares.service;

import com.campuscares.dto.request.LoginRequest;
import com.campuscares.dto.request.RegisterRequest;
import com.campuscares.dto.response.ApiResponse;

public interface AuthService {
    ApiResponse register(RegisterRequest request);

    ApiResponse login(LoginRequest request);
}

