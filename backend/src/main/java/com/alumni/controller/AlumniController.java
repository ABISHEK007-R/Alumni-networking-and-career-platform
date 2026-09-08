package com.alumni.controller;

import com.alumni.dto.UserSummaryResponse;
import com.alumni.service.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AlumniController {
    private static final Logger log = LoggerFactory.getLogger(AlumniController.class);

    private final UserService userService;

    @GetMapping("/alumni")
    public ResponseEntity<List<UserSummaryResponse>> getAlumni(
            @RequestParam(required = false) String skill,
            @RequestParam(required = false) String location) {
        try {
            log.info("Alumni request received skill={} location={}", skill, location);
            return ResponseEntity.ok(userService.getAlumni(skill, location));
        } catch (Exception exception) {
            log.error("Alumni endpoint failed. skill={} location={}. Cause={}", skill, location, exception.getMessage(), exception);
            return ResponseEntity.ok(List.of());
        }
    }

    @GetMapping("/alumni/search")
    public ResponseEntity<List<UserSummaryResponse>> searchAlumni(@RequestParam String query) {
        try {
            log.info("Alumni search request received query={}", query);
            return ResponseEntity.ok(userService.searchAlumni(query));
        } catch (Exception exception) {
            log.error("Alumni search endpoint failed. query={}. Cause={}", query, exception.getMessage(), exception);
            return ResponseEntity.ok(List.of());
        }
    }
}
