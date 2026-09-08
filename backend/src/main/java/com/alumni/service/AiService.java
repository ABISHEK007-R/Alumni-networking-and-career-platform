package com.alumni.service;

import com.alumni.entity.User;
import com.alumni.repository.UserRepository;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiService {
    private static final Logger log = LoggerFactory.getLogger(AiService.class);
    private static final String MISSING_KEY_MESSAGE = "Gemini API key not configured.";

    private final String geminiApiKey;
    private final String geminiModel;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;

    public AiService(
            @Value("${gemini.api.key:}") String geminiApiKey,
            @Value("${gemini.api.model:gemini-3.6-flash}") String geminiModel,
            UserRepository userRepository) {
        this.geminiApiKey = geminiApiKey;
        this.geminiModel = geminiModel;
        this.userRepository = userRepository;
        this.restTemplate = new RestTemplate();
    }

    @PostConstruct
    void logConfiguration() {
        log.info("Gemini configuration: apiKeyLoaded={}, apiKeyLength={}, model={}, endpoint=https://generativelanguage.googleapis.com/v1beta/models/{}/generateContent",
                hasApiKey(), geminiApiKey == null ? 0 : geminiApiKey.length(), geminiModel, geminiModel);
    }

    public String generateReply(String userMessage) {
        return generateReply(userMessage, null);
    }

    public String generateReply(String userMessage, String userEmail) {
        if (userMessage == null || userMessage.isBlank()) {
            return "Please enter a question for the career assistant.";
        }

        if (!hasApiKey()) {
            log.error("Gemini request skipped because GEMINI_API_KEY is missing or blank.");
            return MISSING_KEY_MESSAGE;
        }

        try {
            String prompt = buildPrompt(userMessage, userEmail);
            GeminiResponse payload = callGemini(prompt);
            if (payload == null || payload.candidates == null || payload.candidates.isEmpty()) {
                log.error("Gemini returned no candidates for model {}.", geminiModel);
                return "Gemini returned no answer.";
            }

            String reply = extractReply(payload);
            return reply == null || reply.isBlank() ? "Gemini returned an empty answer." : reply.trim();
        } catch (HttpStatusCodeException exception) {
            String providerError = exception.getResponseBodyAsString();
            log.error("Gemini request failed: status={}, responseBody={}", exception.getStatusCode(), providerError, exception);
            return "Gemini request failed (" + exception.getStatusCode().value() + "): " + extractProviderMessage(providerError);
        } catch (ResourceAccessException exception) {
            log.error("Gemini request could not reach the provider. Check internet access and DNS/TLS configuration.", exception);
            return "Gemini request could not reach the provider: " + rootMessage(exception);
        } catch (RestClientException | IllegalArgumentException exception) {
            log.error("Gemini AI request failed. Message={}. Cause={}", userMessage, exception.getMessage(), exception);
            return "Gemini request failed: " + rootMessage(exception);
        }
    }

    private boolean hasApiKey() {
        return geminiApiKey != null && !geminiApiKey.isBlank();
    }

    private String buildPrompt(String userMessage, String userEmail) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("You are an expert Career Mentor for university students.\n")
                .append("You specialize in: Cybersecurity, Software Development, Data Science, AI/ML, Cloud Computing, Internships, Resume Building, Interview Preparation.\n")
                .append("Provide practical, structured, student-friendly career advice. Keep responses concise but valuable.\n\n");

        if (userEmail != null && !userEmail.isBlank() && userRepository != null) {
            userRepository.findByEmailIgnoreCase(userEmail).ifPresent(user -> {
                if (user.getSkills() != null && !user.getSkills().isBlank()) {
                    prompt.append("Student profile: Skills = ").append(user.getSkills()).append(".\n");
                }
                if (user.getCollege() != null && !user.getCollege().isBlank()) {
                    prompt.append("Department/College = ").append(user.getCollege()).append(".\n");
                }
                if (user.getLocation() != null && !user.getLocation().isBlank()) {
                    prompt.append("Location = ").append(user.getLocation()).append(".\n");
                }
                if (user.getCompany() != null && !user.getCompany().isBlank()) {
                    prompt.append("Current experience = ").append(user.getCompany()).append(".\n");
                }
            });
        }

        prompt.append("Student question: ")
                .append(userMessage)
                .append("\n");

        return prompt.toString();
    }

    private GeminiResponse callGemini(String prompt) {
        String endpoint = "https://generativelanguage.googleapis.com/v1beta/models/" + geminiModel + ":generateContent";
        String url = endpoint + "?key=" + geminiApiKey;

        Map<String, Object> body = new HashMap<>();
        Map<String, Object> contents = new HashMap<>();
        contents.put("parts", List.of(Map.of("text", prompt)));
        body.put("contents", List.of(contents));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        log.info("Gemini request: method=POST, endpoint={}, body={}", endpoint, body);
        ResponseEntity<GeminiResponse> response = restTemplate.postForEntity(url, request, GeminiResponse.class);
        log.info("Gemini response: status={}, model={}", response.getStatusCode(), geminiModel);
        if (response.getBody() == null) {
            return null;
        }
        return response.getBody();
    }

    private String extractProviderMessage(String responseBody) {
        if (responseBody == null || responseBody.isBlank()) {
            return "Provider returned no error details.";
        }
        int messageStart = responseBody.indexOf("\"message\":\"");
        if (messageStart >= 0) {
            int valueStart = messageStart + 11;
            int valueEnd = responseBody.indexOf('"', valueStart);
            if (valueEnd > valueStart) {
                return responseBody.substring(valueStart, valueEnd);
            }
        }
        return responseBody.length() > 500 ? responseBody.substring(0, 500) : responseBody;
    }

    private String rootMessage(Exception exception) {
        Throwable root = exception;
        while (root.getCause() != null) {
            root = root.getCause();
        }
        return root.getMessage() == null ? root.getClass().getSimpleName() : root.getMessage();
    }

    private String extractReply(GeminiResponse payload) {
        if (payload == null || payload.candidates == null) {
            return null;
        }

        for (Candidate candidate : payload.candidates) {
            if (candidate == null || candidate.content == null || candidate.content.parts == null) {
                continue;
            }
            for (Part part : candidate.content.parts) {
                if (part != null && part.text != null && !part.text.isBlank()) {
                    return part.text;
                }
            }
        }
        return null;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class GeminiResponse {
        public List<Candidate> candidates;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Candidate {
        public Content content;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Content {
        public List<Part> parts;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Part {
        public String text;
    }
}
