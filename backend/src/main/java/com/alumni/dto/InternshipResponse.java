package com.alumni.dto;

import com.alumni.entity.Internship;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class InternshipResponse {
    private Long id;
    private String company;
    private String role;
    private String location;
    private String description;
    private String applyLink;

    public static InternshipResponse from(Internship internship) {
        return InternshipResponse.builder()
                .id(internship.getId())
                .company(internship.getCompany())
                .role(internship.getRole())
                .location(internship.getLocation())
                .description(internship.getDescription())
                .applyLink(internship.getApplyLink())
                .build();
    }
}
