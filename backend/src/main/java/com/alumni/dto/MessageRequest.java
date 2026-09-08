package com.alumni.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class MessageRequest {
    private Long conversationId;
    private Long receiverId;
    private String content;
}
