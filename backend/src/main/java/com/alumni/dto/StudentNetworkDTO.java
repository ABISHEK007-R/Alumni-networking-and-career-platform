package com.alumni.dto;

import com.alumni.entity.User;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StudentNetworkDTO {
    private Long id;
    private String name;
    private String college;
    private String location;
    private String skills;

    public static StudentNetworkDTO from(User user) {
        return StudentNetworkDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .college(user.getCollege())
                .location(user.getLocation())
                .skills(user.getSkills())
                .build();
    }
}