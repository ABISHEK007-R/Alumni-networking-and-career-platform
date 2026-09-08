package com.alumni.controller;

import com.alumni.dto.ConnectionResponse;
import com.alumni.entity.User;
import com.alumni.repository.UserRepository;
import com.alumni.service.ConnectionService;
import com.alumni.service.ConnectionViewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/connections")
@RequiredArgsConstructor
public class ConnectionController {
    private final ConnectionService connectionService;
    private final ConnectionViewService connectionViewService;
    private final UserRepository userRepository;

    @PostMapping("/request/{receiverId}")
    public ResponseEntity<ConnectionResponse> sendRequest(@PathVariable Long receiverId, Authentication authentication) {
        Long senderId = resolveCurrentUserId(authentication);
        return ResponseEntity.ok(connectionService.sendRequest(senderId, receiverId));
    }

    @GetMapping
    public ResponseEntity<List<ConnectionResponse>> getConnections(Authentication authentication) {
        return getMyConnections(authentication);
    }

    @GetMapping("/me")
    public ResponseEntity<List<ConnectionResponse>> getMyConnections(Authentication authentication) {
        Long userId = resolveCurrentUserId(authentication);
        return ResponseEntity.ok(connectionService.getRequestsForUser(userId));
    }

    @GetMapping("/incoming")
    public ResponseEntity<List<ConnectionResponse>> getIncoming(Authentication authentication) {
        return ResponseEntity.ok(connectionViewService.getIncoming(resolveCurrentUserId(authentication)));
    }

    @GetMapping("/outgoing")
    public ResponseEntity<List<ConnectionResponse>> getOutgoing(Authentication authentication) {
        return ResponseEntity.ok(connectionViewService.getOutgoing(resolveCurrentUserId(authentication)));
    }

    @GetMapping("/accepted")
    public ResponseEntity<List<ConnectionResponse>> getAccepted(Authentication authentication) {
        return ResponseEntity.ok(connectionViewService.getAccepted(resolveCurrentUserId(authentication)));
    }

    @PutMapping("/{connectionId}/accept")
    public ResponseEntity<ConnectionResponse> acceptRequest(@PathVariable Long connectionId, Authentication authentication) {
        Long userId = resolveCurrentUserId(authentication);
        return ResponseEntity.ok(connectionService.acceptRequest(userId, connectionId));
    }

    @PutMapping("/{connectionId}/reject")
    public ResponseEntity<ConnectionResponse> rejectRequest(@PathVariable Long connectionId, Authentication authentication) {
        Long userId = resolveCurrentUserId(authentication);
        return ResponseEntity.ok(connectionService.rejectRequest(userId, connectionId));
    }

    private Long resolveCurrentUserId(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found."));
        return user.getId();
    }
}
