package com.campuscares.api;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.SQLException;
import java.util.LinkedHashMap;
import java.util.Map;
import javax.sql.DataSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
public class HealthApiController {

    private final DataSource dataSource;

    public HealthApiController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> backendHealth() {
        // Basic API heartbeat endpoint used by frontend/devops checks.
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("message", "CampusCares_V2 backend is running");
        response.put("data", "OK");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/database")
    public ResponseEntity<Map<String, Object>> databaseHealth() {
        // Confirms a real connection can be opened against Supabase PostgreSQL.
        Map<String, Object> response = new LinkedHashMap<>();

        try (Connection connection = dataSource.getConnection()) {
            DatabaseMetaData metaData = connection.getMetaData();
            response.put("success", true);
            response.put("message", "Database connection is healthy");
            response.put(
                    "data",
                    metaData.getDatabaseProductName() + " " + metaData.getDatabaseProductVersion());
            return ResponseEntity.ok(response);
        } catch (SQLException exception) {
            response.put("success", false);
            response.put("message", "Database connection failed");
            response.put("data", exception.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
        }
    }
}
