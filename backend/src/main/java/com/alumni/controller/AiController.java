package com.alumni.controller;

import com.alumni.dto.AiChatRequest;
import com.alumni.dto.AiChatResponse;
import com.alumni.service.AiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AiController {
    private static final Logger log = LoggerFactory.getLogger(AiController.class);

    private final AiService aiService;

    @PostMapping("/ai/chat")
    public ResponseEntity<AiChatResponse> chat(@Valid @RequestBody AiChatRequest request, Authentication authentication) {
        String email = authentication != null ? authentication.getName() : "anonymous";
        log.info("AI chat request received from {}", email);

        String reply = aiService.generateReply(request.getMessage(), authentication != null ? authentication.getName() : null);
        return ResponseEntity.ok(AiChatResponse.builder().reply(reply).build());
    }
}
