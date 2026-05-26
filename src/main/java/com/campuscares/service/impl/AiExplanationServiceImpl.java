package com.campuscares.service.impl;

import com.campuscares.service.AiExplanationService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Map;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AiExplanationServiceImpl implements AiExplanationService {
    private static final Logger log = LoggerFactory.getLogger(AiExplanationServiceImpl.class);

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    @Value("${groq.api.key:}")
    private String apiKey;

    @Value("${groq.api.url:https://api.groq.com/openai/v1/chat/completions}")
    private String apiUrl;

    @Value("${groq.model:llama-3.1-8b-instant}")
    private String model;

    public AiExplanationServiceImpl(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(8)).build();
    }

    @Override
    public Optional<String> enhanceExplanation(String itemName, String category, String backendReason) {
        if (apiKey == null || apiKey.isBlank()) {
            return Optional.empty();
        }

        String safeItem = itemName == null ? "item" : itemName.trim();
        String safeCategory = category == null || category.isBlank() ? "General" : category.trim();
        String safeReason = backendReason == null ? "" : backendReason.trim();

        String prompt = "Create a short one-sentence explanation for why this item is recommended to a student. "
                + "Item: " + safeItem + ". Category: " + safeCategory + ". Backend reason: " + safeReason
                + ". Keep it under 20 words. Do not invent facts.";

        try {
            Map<String, Object> body = Map.of(
                    "model", model,
                    "temperature", 0.4,
                    "max_tokens", 60,
                    "messages", new Object[] {
                        Map.of("role", "system", "content", "You write brief student-friendly recommendation blurbs."),
                        Map.of("role", "user", "content", prompt)
                    });

            String jsonBody = objectMapper.writeValueAsString(body);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(apiUrl))
                    .timeout(Duration.ofSeconds(12))
                    .header("Authorization", "Bearer " + apiKey.trim())
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpResponse<String> response =
                    httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                log.debug("Groq enhancement skipped: HTTP {}", response.statusCode());
                return Optional.empty();
            }

            JsonNode root = objectMapper.readTree(response.body());
            String content = root.path("choices").path(0).path("message").path("content").asText("").trim();
            if (content.isEmpty()) {
                return Optional.empty();
            }
            return Optional.of(content.replaceAll("\\s+", " "));
        } catch (Exception ex) {
            log.debug("Groq enhancement failed: {}", ex.getMessage());
            return Optional.empty();
        }
    }
}
