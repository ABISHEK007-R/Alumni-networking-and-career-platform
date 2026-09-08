package com.alumni.controller;

import com.alumni.dto.ConversationResponse;
import com.alumni.entity.User;
import com.alumni.repository.UserRepository;
import com.alumni.service.ConversationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/conversations")
@RequiredArgsConstructor
public class ConversationController {
    private final ConversationService conversationService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<ConversationResponse>> getConversations(Authentication authentication) {
        return ResponseEntity.ok(conversationService.getForUser(resolveCurrentUserId(authentication)));
    }

    private Long resolveCurrentUserId(Authentication authentication) {
        User user = userRepository.findByEmailIgnoreCase(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found."));
        return user.getId();
    }
}
