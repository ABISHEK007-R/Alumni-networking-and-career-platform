package com.alumni.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AlumniDirectoryCardResponse {
    private Long id;
    private String name;
    private String company;
    private String skills;
    private String location;
    private String role;
    private Integer matchPercentage;
}
