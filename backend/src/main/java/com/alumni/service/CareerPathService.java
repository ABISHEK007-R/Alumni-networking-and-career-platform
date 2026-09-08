package com.alumni.service;

import com.alumni.dto.CareerPathResponse;
import com.alumni.entity.User;
import com.alumni.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CareerPathService {
    private final UserRepository userRepository;

    private static final List<String> COMMON_SKILLS = List.of(
            "Java", "Spring Boot", "Microservices", "Docker", "AWS", "SQL", "Python",
            "JavaScript", "React", "Node.js", "Cloud", "Cybersecurity", "Data Structures"
    );

    @Transactional(readOnly = true)
    public CareerPathResponse getCareerPath(String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        List<String> currentSkills = parseSkills(user.getSkills());
        List<String> recommended = generateRecommendations(currentSkills);

        return CareerPathResponse.builder()
                .currentRole(user.getRole() != null ? user.getRole().name() : "STUDENT")
                .currentSkills(currentSkills.isEmpty() ? List.of("Not specified") : currentSkills)
                .recommendedSkills(recommended)
                .nextStep(buildNextStep(recommended))
                .build();
    }

    private List<String> parseSkills(String rawSkills) {
        if (rawSkills == null || rawSkills.isBlank()) {
            return List.of();
        }

        return Arrays.stream(rawSkills.split(","))
                .map(String::trim)
                .filter(skill -> !skill.isEmpty())
                .limit(6)
                .toList();
    }

    private List<String> generateRecommendations(List<String> currentSkills) {
        Set<String> recommended = new LinkedHashSet<>();
        for (String skill : COMMON_SKILLS) {
            if (!currentSkills.contains(skill)) {
                recommended.add(skill);
                if (recommended.size() == 5) {
                    break;
                }
            }
        }

        if (recommended.isEmpty()) {
            return List.of("Spring Boot", "Microservices", "Docker", "AWS", "SQL");
        }

        return List.copyOf(recommended);
    }

    private String buildNextStep(List<String> recommendedSkills) {
        if (recommendedSkills == null || recommendedSkills.isEmpty()) {
            return "Keep building your practical portfolio and share your work with mentors.";
        }
        return "Prioritize learning: " + recommendedSkills.get(0) + " and apply it in a personal project.";
    }
}
