package com.alumni.dto;

import com.alumni.entity.Conversation;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ConversationResponse {
    private Long id;
    private Long connectionId;
    private Long participantId;
    private String participantName;
    private LocalDateTime createdAt;

    public static ConversationResponse from(Conversation conversation, Long participantId, String participantName) {
        return ConversationResponse.builder()
                .id(conversation.getId())
                .connectionId(conversation.getConnectionId())
                .participantId(participantId)
                .participantName(participantName)
                .createdAt(conversation.getCreatedAt())
                .build();
    }
}
