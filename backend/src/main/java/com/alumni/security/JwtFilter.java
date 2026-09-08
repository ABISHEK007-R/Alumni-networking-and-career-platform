package com.alumni.security;

import com.alumni.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ") && SecurityContextHolder.getContext().getAuthentication() == null) {
            String token = header.substring(7);
            try {
                String email = jwtUtil.extractEmail(token);
                userRepository.findByEmailIgnoreCase(email).ifPresent(user -> {
                    var userDetails = org.springframework.security.core.userdetails.User.withUsername(user.getEmail())
                            .password(user.getPassword())
                            .authorities(List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())))
                            .build();
                    if (jwtUtil.isTokenValid(token, userDetails)) {
                        var authentication = new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                });
            } catch (RuntimeException ignored) {
                // Invalid tokens remain unauthenticated and are rejected by Spring Security.
            }
        }
        filterChain.doFilter(request, response);
    }
}
