package com.alumni.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "internships")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Internship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private Long ownerId;

    @Column(nullable = false)
    private String company;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private String location;

    @Column(length = 1000)
    private String description;

    @Column(length = 1000)
    private String applyLink;
}
