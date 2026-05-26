package com.campuscares.service;

import java.util.Optional;

public interface AiExplanationService {
    Optional<String> enhanceExplanation(String itemName, String category, String backendReason);
}
