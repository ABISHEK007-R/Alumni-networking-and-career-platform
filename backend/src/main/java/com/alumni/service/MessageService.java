package com.alumni.service;

import com.alumni.dto.MessageRequest;
import com.alumni.dto.MessageResponse;
import com.alumni.entity.Conversation;
import com.alumni.entity.Message;
import com.alumni.entity.User;
import com.alumni.repository.MessageRepository;
import com.alumni.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
        private final ConversationService conversationService;

    @Transactional(readOnly = true)
    public List<MessageResponse> getMessages(Long userId, Long conversationId) {
        Conversation conversation = conversationService.getForUser(userId, conversationId);
        Map<Long, User> users = userRepository.findAllById(List.of(conversation.getFirstUserId(), conversation.getSecondUserId())).stream()
                .collect(Collectors.toMap(User::getId, user -> user));
        return messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId).stream()
                .map(message -> MessageResponse.from(message,
                        users.containsKey(message.getSenderId()) ? users.get(message.getSenderId()).getName() : "Unknown",
                        users.containsKey(message.getReceiverId()) ? users.get(message.getReceiverId()).getName() : "Unknown"))
                .toList();
    }

    @Transactional
    public MessageResponse sendMessage(Long senderId, MessageRequest request) {
                if (request.getConversationId() == null || request.getContent() == null || request.getContent().isBlank()) {
                        throw new IllegalArgumentException("A conversation and message are required.");
        }
                Conversation conversation = conversationService.getForUser(senderId, request.getConversationId());
                Long receiverId = conversation.getFirstUserId().equals(senderId) ? conversation.getSecondUserId() : conversation.getFirstUserId();

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new IllegalArgumentException("Sender not found."));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new IllegalArgumentException("Receiver not found."));
        Message message = messageRepository.save(Message.builder()
                .senderId(sender.getId())
                .receiverId(receiver.getId())
                .conversationId(conversation.getId())
                .content(request.getContent().trim())
                .createdAt(LocalDateTime.now())
                .build());

        return MessageResponse.from(message, sender.getName(), receiver.getName());
    }
}
