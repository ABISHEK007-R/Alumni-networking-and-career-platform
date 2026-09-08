package com.alumni.dto;

import com.alumni.entity.Message;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class MessageResponse {
    private Long id;
    private Long senderId;
    private Long receiverId;
    private Long conversationId;
    private String senderName;
    private String receiverName;
    private String content;
    private LocalDateTime createdAt;

    public static MessageResponse from(Message message, String senderName, String receiverName) {
        return MessageResponse.builder()
                .id(message.getId())
                .senderId(message.getSenderId())
                .receiverId(message.getReceiverId())
                .conversationId(message.getConversationId())
                .senderName(senderName)
                .receiverName(receiverName)
                .content(message.getContent())
                .createdAt(message.getCreatedAt())
                .build();
    }
}
