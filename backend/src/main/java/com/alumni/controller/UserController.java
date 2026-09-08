package com.alumni.controller;

import com.alumni.dto.UserProfileResponse;
import com.alumni.dto.StudentNetworkDTO;
import com.alumni.dto.UserSummaryResponse;
import com.alumni.dto.UpdateProfileRequest;
import com.alumni.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/users")
    public ResponseEntity<List<UserSummaryResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/users/network/students")
    public ResponseEntity<List<StudentNetworkDTO>> getAcceptedMentorshipStudents(Authentication authentication) {
        return ResponseEntity.ok(userService.getAcceptedMentorshipStudents(authentication.getName()));
    }

    @GetMapping("/users/me")
    public ResponseEntity<UserProfileResponse> getCurrentUser(Authentication authentication) {
        return ResponseEntity.ok(userService.getCurrentUser(authentication.getName()));
    }

    @GetMapping("/users/profile")
    public ResponseEntity<UserProfileResponse> getCurrentUserProfile(Authentication authentication) {
        return getCurrentUser(authentication);
    }

    @PutMapping("/users/me")
    public ResponseEntity<UserProfileResponse> updateCurrentUser(
            Authentication authentication,
            @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateCurrentUser(authentication.getName(), request));
    }
}
