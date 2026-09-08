package com.alumni.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users", uniqueConstraints = @UniqueConstraint(name = "uk_users_email", columnNames = "email"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @Column(length = 150)
    private String college;

    @Column(length = 150)
    private String company;

    @Column(length = 1000)
    private String skills;

    @Column(length = 150)
    private String location;

    @Column(length = 1000)
    private String certifications;

    @Column(length = 2000)
    private String projects;

    public enum Role {
        STUDENT,
        ALUMNI
    }
}
