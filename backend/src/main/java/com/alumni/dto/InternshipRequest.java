package com.alumni.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class InternshipRequest {
    private String company;
    private String role;
    private String location;
    private String description;
    private String applyLink;
}
