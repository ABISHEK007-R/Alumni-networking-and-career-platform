package com.alumni.dto;

import com.alumni.entity.User;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class AuthResponse {
    String token;
    String role;
    String email;
    String name;
    Long id;

    public static AuthResponse from(User user, String token) {
        return AuthResponse.builder()
                .token(token)
                .role(user.getRole().name())
                .email(user.getEmail())
                .name(user.getName())
                .id(user.getId())
                .build();
    }
}
