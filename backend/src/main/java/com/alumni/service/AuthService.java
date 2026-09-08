package com.alumni.service;

import com.alumni.dto.AuthResponse;
import com.alumni.dto.LoginRequest;
import com.alumni.dto.RegisterRequest;
import com.alumni.entity.User;
import com.alumni.repository.UserRepository;
import com.alumni.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.getEmail());
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new IllegalArgumentException("An account with this email already exists.");
        }

        User user = User.builder()
                .name(request.getName().trim())
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .college(request.getCollege())
                .company(request.getCompany())
                .skills(request.getSkills())
                .location(request.getLocation())
                .certifications(request.getCertifications())
                .projects(request.getProjects())
                .build();

        try {
            User savedUser = userRepository.save(user);
            return AuthResponse.from(savedUser, null);
        } catch (DataIntegrityViolationException exception) {
            throw new IllegalArgumentException("An account with this email already exists.");
        }
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmailIgnoreCase(normalizeEmail(request.getEmail()))
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password."));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password.");
        }
        return AuthResponse.from(user, jwtUtil.generateToken(user));
    }

    @Transactional(readOnly = true)
    public AuthResponse profile(String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new BadCredentialsException("Authenticated user no longer exists."));
        return AuthResponse.from(user, null);
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }
}
