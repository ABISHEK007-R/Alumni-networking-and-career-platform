package com.alumni.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "mentorship_requests", uniqueConstraints = @UniqueConstraint(name = "uk_mentorship_student_mentor", columnNames = {"studentId", "mentorId"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MentorshipRequest {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false) private Long studentId;
    @Column(nullable = false) private Long mentorId;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private RequestStatus status;
    @Column(length = 1000) private String message;
    @Column(nullable = false) private LocalDateTime createdAt;
    public enum RequestStatus { PENDING, ACCEPTED, REJECTED }
}
