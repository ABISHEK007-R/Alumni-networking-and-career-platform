package com.alumni.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "referrals")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Referral {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false) private Long studentId;
    @Column(nullable = false) private Long alumniId;
    @Column(length = 200) private String opportunity;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private ReferralStatus status;
    @Column(nullable = false) private LocalDateTime createdAt;
    public enum ReferralStatus { REQUESTED, SUBMITTED, ACCEPTED, REJECTED }
}
