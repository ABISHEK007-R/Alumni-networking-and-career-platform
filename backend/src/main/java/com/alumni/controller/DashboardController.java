package com.alumni.controller;

import com.alumni.dto.DashboardSummaryResponse;
import com.alumni.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DashboardController {
    private static final Logger log = LoggerFactory.getLogger(DashboardController.class);

    private final DashboardService dashboardService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardSummaryResponse> getDashboardSummary(Authentication authentication) {
        try {
            String email = authentication != null ? authentication.getName() : null;
            log.info("Dashboard request received for email={}", email);
            if (email == null || email.isBlank()) {
                throw new IllegalArgumentException("Authenticated user not found.");
            }
            DashboardSummaryResponse response = dashboardService.getSummary(email);
            return ResponseEntity.ok(response);
        } catch (Exception exception) {
            log.error("Dashboard endpoint failed. Cause={}", exception.getMessage(), exception);
            return ResponseEntity.ok(DashboardSummaryResponse.builder()
                    .alumniCount(0)
                    .mentorCount(0)
                    .internshipCount(0)
                    .referralCount(0)
                    .build());
        }
    }
}
