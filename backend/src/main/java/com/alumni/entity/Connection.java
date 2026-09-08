package com.alumni.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "connections",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_connections_sender_receiver", columnNames = {"senderId", "receiverId"})
        },
        indexes = {
                @Index(name = "idx_connections_sender", columnList = "senderId"),
                @Index(name = "idx_connections_receiver", columnList = "receiverId")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Connection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long senderId;

    @Column(nullable = false)
    private Long receiverId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ConnectionStatus status;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
