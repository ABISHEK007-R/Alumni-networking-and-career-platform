package com.alumni.controller;

import com.alumni.entity.Referral;
import com.alumni.entity.User;
import com.alumni.repository.ReferralRepository;
import com.alumni.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/referrals")
@RequiredArgsConstructor
public class ReferralController {
 private final ReferralRepository repository; private final UserRepository users;
 @GetMapping("/me") public ResponseEntity<List<Map<String,Object>>> mine(Authentication auth) { User current = user(auth); return ResponseEntity.ok(repository.findByAlumniIdOrStudentIdOrderByCreatedAtDesc(current.getId(), current.getId()).stream().map(this::view).toList()); }
 private User user(Authentication auth) { return users.findByEmailIgnoreCase(auth.getName()).orElseThrow(() -> new IllegalArgumentException("Authenticated user not found.")); }
 private Map<String,Object> view(Referral referral) { User student = users.findById(referral.getStudentId()).orElse(null); return Map.of("id", referral.getId(), "studentName", student == null ? "Unknown" : student.getName(), "opportunity", referral.getOpportunity() == null ? "" : referral.getOpportunity(), "status", referral.getStatus().name()); }
}
