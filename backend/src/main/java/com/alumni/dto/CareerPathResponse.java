package com.alumni.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class CareerPathResponse {
    private String currentRole;
    private List<String> currentSkills;
    private List<String> recommendedSkills;
    private String nextStep;
}
