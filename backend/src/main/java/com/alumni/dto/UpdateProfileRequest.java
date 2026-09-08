package com.alumni.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UpdateProfileRequest {
    private String name;
    private String college;
    private String company;
    private String skills;
    private String location;
    private String certifications;
    private String projects;
}
