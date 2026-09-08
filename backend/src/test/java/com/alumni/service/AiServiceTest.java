package com.alumni.service;

import com.alumni.repository.UserRepository;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class AiServiceTest {

    @Test
    void shouldReturnFallbackWhenGeminiKeyIsMissing() {
        AiService aiService = new AiService("", "gemini-3.6-flash", null);

        String reply = aiService.generateReply("How do I become a Java Developer?");

        assertEquals("Gemini API key not configured.", reply);
    }
}
