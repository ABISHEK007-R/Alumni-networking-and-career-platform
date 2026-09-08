package com.alumni.controller;

import com.alumni.dto.InternshipResponse;
import com.alumni.dto.InternshipRequest;
import com.alumni.service.InternshipService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class InternshipController {
    private static final Logger log = LoggerFactory.getLogger(InternshipController.class);

    private final InternshipService internshipService;

    @GetMapping("/internships")
    public ResponseEntity<List<InternshipResponse>> getInternships() {
        try {
            log.info("Internships request received.");
            return ResponseEntity.ok(internshipService.getInternships());
        } catch (Exception exception) {
            log.error("Internships endpoint failed. Cause={}", exception.getMessage(), exception);
            return ResponseEntity.ok(List.of());
        }
    }

    @GetMapping("/internships/mine")
    public ResponseEntity<List<InternshipResponse>> getMine(Authentication authentication) {
        return ResponseEntity.ok(internshipService.getOwnedInternships(authentication.getName()));
    }

    @PostMapping("/internships")
    public ResponseEntity<InternshipResponse> create(@RequestBody InternshipRequest request, Authentication authentication) {
        return ResponseEntity.ok(internshipService.create(authentication.getName(), request));
    }

    @PutMapping("/internships/{id}")
    public ResponseEntity<InternshipResponse> update(@PathVariable Long id, @RequestBody InternshipRequest request, Authentication authentication) {
        return ResponseEntity.ok(internshipService.update(authentication.getName(), id, request));
    }

    @DeleteMapping("/internships/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
        internshipService.delete(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
