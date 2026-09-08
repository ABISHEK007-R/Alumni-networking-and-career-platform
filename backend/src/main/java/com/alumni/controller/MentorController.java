package com.alumni.controller;

import com.alumni.dto.MentorResponse;
import com.alumni.service.MentorService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MentorController {
    private static final Logger log = LoggerFactory.getLogger(MentorController.class);

    private final MentorService mentorService;

    @GetMapping("/mentors")
    public ResponseEntity<List<MentorResponse>> getMentors() {
        try {
            log.info("Mentors request received.");
            return ResponseEntity.ok(mentorService.getMentors());
        } catch (Exception exception) {
            log.error("Mentors endpoint failed. Cause={}", exception.getMessage(), exception);
            return ResponseEntity.ok(List.of());
        }
    }
}
