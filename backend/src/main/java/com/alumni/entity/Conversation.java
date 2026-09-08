package com.alumni.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "conversations", uniqueConstraints = {
        @UniqueConstraint(name = "uk_conversations_connection", columnNames = "connectionId")
}, indexes = {
        @Index(name = "idx_conversations_first_user", columnList = "firstUserId"),
        @Index(name = "idx_conversations_second_user", columnList = "secondUserId")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Conversation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long connectionId;

    @Column(nullable = false)
    private Long firstUserId;

    @Column(nullable = false)
    private Long secondUserId;

    @Column(nullable = false)
    private LocalDateTime createdAt;
}
