package com.alumni.dto;

import com.alumni.entity.User;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserSummaryResponse {
    private Long id;
    private String name;
    private String email;
    private String college;
    private String company;
    private String skills;
    private String location;
    private String role;
    private String certifications;
    private String projects;

    public static UserSummaryResponse from(User user) {
        return UserSummaryResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .college(user.getCollege())
                .company(user.getCompany())
                .skills(user.getSkills())
                .location(user.getLocation())
                .role(user.getRole() != null ? user.getRole().name() : null)
                .certifications(user.getCertifications())
                .projects(user.getProjects())
                .build();
    }
}
