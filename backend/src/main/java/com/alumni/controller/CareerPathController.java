package com.alumni.controller;

import com.alumni.dto.CareerPathResponse;
import com.alumni.service.CareerPathService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CareerPathController {
    private static final Logger log = LoggerFactory.getLogger(CareerPathController.class);

    private final CareerPathService careerPathService;

    @GetMapping("/career-path")
    public ResponseEntity<CareerPathResponse> getCareerPath(Authentication authentication) {
        try {
            String email = authentication != null ? authentication.getName() : null;
            log.info("Career path request received for email={}", email);
            if (email == null || email.isBlank()) {
                return ResponseEntity.ok(CareerPathResponse.builder()
                        .currentRole("STUDENT")
                        .currentSkills(List.of())
                        .recommendedSkills(List.of())
                        .nextStep("Complete your profile.")
                        .build());
            }
            return ResponseEntity.ok(careerPathService.getCareerPath(email));
        } catch (Exception exception) {
            log.error("Career path endpoint failed. Cause={}", exception.getMessage(), exception);
            return ResponseEntity.ok(CareerPathResponse.builder()
                    .currentRole("STUDENT")
                    .currentSkills(List.of())
                    .recommendedSkills(List.of())
                    .nextStep("Complete your profile.")
                    .build());
        }
    }
}
