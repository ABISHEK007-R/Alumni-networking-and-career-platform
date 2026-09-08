package com.alumni.controller;

import com.alumni.entity.MentorshipRequest;
import com.alumni.entity.User;
import com.alumni.repository.MentorshipRequestRepository;
import com.alumni.repository.UserRepository;
import com.alumni.service.MentorshipRequestService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mentorship-requests")
@RequiredArgsConstructor
public class MentorshipRequestController {
 private static final Logger log = LoggerFactory.getLogger(MentorshipRequestController.class);
 private final MentorshipRequestRepository repository;
 private final MentorshipRequestService mentorshipRequestService;
 private final UserRepository users;
 @GetMapping("/incoming") public ResponseEntity<List<Map<String,Object>>> incoming(Authentication auth) { User mentor = user(auth); List<MentorshipRequest> pendingRequests = mentorshipRequestService.getPendingIncoming(mentor.getEmail()); pendingRequests.forEach(request -> log.info("Incoming response requestId={} status={} alumniId={}", request.getId(), request.getStatus(), mentor.getId())); List<Map<String,Object>> requests = pendingRequests.stream().map(this::view).toList(); log.info("Pending incoming mentorship requests mentorUserId={} email={} count={} requests={}", mentor.getId(), mentor.getEmail(), requests.size(), requests); return ResponseEntity.ok(requests); }
 @GetMapping("/outgoing") public ResponseEntity<List<Map<String,Object>>> outgoing(Authentication auth) { User student = user(auth); return ResponseEntity.ok(repository.findByStudentIdOrderByCreatedAtDesc(student.getId()).stream().map(this::view).toList()); }
 @PostMapping public ResponseEntity<?> create(Authentication auth, @RequestBody Map<String,Object> body) { User student = user(auth); Object mentorIdValue = body.get("mentorId"); if (mentorIdValue == null) throw new IllegalArgumentException("mentorId is required."); Long mentorId = Long.valueOf(mentorIdValue.toString()); User mentor = users.findById(mentorId).orElseThrow(() -> new IllegalArgumentException("Mentor user not found.")); if (mentor.getRole() != User.Role.ALUMNI) throw new IllegalArgumentException("Mentorship requests can only be sent to alumni users."); MentorshipRequest request = repository.save(MentorshipRequest.builder().studentId(student.getId()).mentorId(mentor.getId()).message((String) body.getOrDefault("message", "")).status(MentorshipRequest.RequestStatus.PENDING).createdAt(LocalDateTime.now()).build()); log.info("Mentorship request saved requestId={} studentId={} mentorUserId={} status={}", request.getId(), request.getStudentId(), request.getMentorId(), request.getStatus()); return ResponseEntity.ok(view(request)); }
 @PutMapping("/{id}/{action}") public ResponseEntity<?> update(@PathVariable Long id, @PathVariable String action, Authentication auth) { MentorshipRequest request = mentorshipRequestService.updateStatus(id, action, auth.getName()); log.info("Mentorship request updated requestId={} mentorUserId={} status={}", request.getId(), request.getMentorId(), request.getStatus()); return ResponseEntity.ok(view(request)); }
 private User user(Authentication auth) { return users.findByEmailIgnoreCase(auth.getName()).orElseThrow(() -> new IllegalArgumentException("Authenticated user not found.")); }
 private Map<String,Object> view(MentorshipRequest request) { User student = users.findById(request.getStudentId()).orElse(null); return Map.of("id", request.getId(), "studentName", student == null ? "Unknown" : student.getName(), "message", request.getMessage() == null ? "" : request.getMessage(), "status", request.getStatus().name()); }
}
