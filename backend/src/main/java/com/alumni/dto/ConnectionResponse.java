package com.alumni.dto;

import com.alumni.entity.Connection;
import com.alumni.entity.User;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ConnectionResponse {
    private Long id;
    private Long senderId;
    private Long receiverId;
    private String status;
    private String senderName;
    private String receiverName;
    private String senderCollege;
    private String senderSkills;
    private String receiverCompany;
    private String receiverSkills;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ConnectionResponse from(Connection connection, String senderName, String receiverName) {
        return ConnectionResponse.builder()
                .id(connection.getId())
                .senderId(connection.getSenderId())
                .receiverId(connection.getReceiverId())
                .status(connection.getStatus().name())
                .senderName(senderName)
                .receiverName(receiverName)
                .createdAt(connection.getCreatedAt())
                .updatedAt(connection.getUpdatedAt())
                .build();
    }

    public static ConnectionResponse fromUsers(Connection connection, User sender, User receiver) {
        return ConnectionResponse.builder()
                .id(connection.getId())
                .senderId(connection.getSenderId())
                .receiverId(connection.getReceiverId())
                .status(connection.getStatus().name())
                .senderName(sender == null ? "Unknown" : sender.getName())
                .receiverName(receiver == null ? "Unknown" : receiver.getName())
                .senderCollege(sender == null ? null : sender.getCollege())
                .senderSkills(sender == null ? null : sender.getSkills())
                .receiverCompany(receiver == null ? null : receiver.getCompany())
                .receiverSkills(receiver == null ? null : receiver.getSkills())
                .createdAt(connection.getCreatedAt())
                .updatedAt(connection.getUpdatedAt())
                .build();
    }
}
