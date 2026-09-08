package com.alumni.dto;

import com.alumni.entity.User;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserProfileResponse {
    private Long id;
    private String name;
    private String email;
    private String college;
    private String location;
    private String skills;
    private String role;
    private String company;
    private String certifications;
    private String projects;

    public static UserProfileResponse from(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .college(user.getCollege())
                .location(user.getLocation())
                .skills(user.getSkills())
                .role(user.getRole() != null ? user.getRole().name() : null)
                .company(user.getCompany())
                .certifications(user.getCertifications())
                .projects(user.getProjects())
                .build();
    }
}
