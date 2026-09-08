package com.alumni.dto;

import com.alumni.entity.Mentor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MentorResponse {
    private Long id;
    private Long userId;
    private String name;
    private String company;
    private String domain;
    private Integer experienceYears;
    private String bio;

    public static MentorResponse from(Mentor mentor) {
        return MentorResponse.builder()
                .id(mentor.getId())
            .userId(mentor.getUserId())
                .name(mentor.getName())
                .company(mentor.getCompany())
                .domain(mentor.getDomain())
                .experienceYears(mentor.getExperienceYears())
                .bio(mentor.getBio())
                .build();
    }
}
