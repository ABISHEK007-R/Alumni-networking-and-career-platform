package com.alumni.controller;

import com.alumni.dto.MessageRequest;
import com.alumni.dto.MessageResponse;
import com.alumni.entity.User;
import com.alumni.repository.UserRepository;
import com.alumni.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {
    private final MessageService messageService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<MessageResponse>> getMessages(
            Authentication authentication,
            @RequestParam Long conversationId) {
        return ResponseEntity.ok(messageService.getMessages(resolveCurrentUserId(authentication), conversationId));
    }

    @PostMapping
    public ResponseEntity<MessageResponse> sendMessage(
            Authentication authentication,
            @RequestBody MessageRequest request) {
        return ResponseEntity.ok(messageService.sendMessage(resolveCurrentUserId(authentication), request));
    }

    private Long resolveCurrentUserId(Authentication authentication) {
        User user = userRepository.findByEmailIgnoreCase(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found."));
        return user.getId();
    }
}
