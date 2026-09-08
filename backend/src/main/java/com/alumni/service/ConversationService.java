package com.alumni.service;

import com.alumni.dto.ConversationResponse;
import com.alumni.entity.Connection;
import com.alumni.entity.ConnectionStatus;
import com.alumni.entity.Conversation;
import com.alumni.entity.User;
import com.alumni.repository.ConnectionRepository;
import com.alumni.repository.ConversationRepository;
import com.alumni.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConversationService {
    private final ConversationRepository conversationRepository;
    private final ConnectionRepository connectionRepository;
    private final UserRepository userRepository;

    @Transactional
    public Conversation ensureForAcceptedConnection(Connection connection) {
        if (connection.getStatus() != ConnectionStatus.ACCEPTED) {
            throw new IllegalArgumentException("Only accepted connections can have conversations.");
        }
        return conversationRepository.findByConnectionId(connection.getId())
                .orElseGet(() -> conversationRepository.save(Conversation.builder()
                        .connectionId(connection.getId())
                        .firstUserId(connection.getSenderId())
                        .secondUserId(connection.getReceiverId())
                        .createdAt(LocalDateTime.now())
                        .build()));
    }

    @Transactional
    public List<ConversationResponse> getForUser(Long userId) {
        List<Connection> acceptedConnections = connectionRepository.findBySenderIdOrReceiverIdOrderByCreatedAtDesc(userId, userId).stream()
                .filter(connection -> connection.getStatus() == ConnectionStatus.ACCEPTED)
                .toList();

        List<Conversation> conversations = acceptedConnections.stream()
                .map(this::ensureForAcceptedConnection)
                .toList();
        Set<Long> participantIds = conversations.stream()
                .map(conversation -> conversation.getFirstUserId().equals(userId) ? conversation.getSecondUserId() : conversation.getFirstUserId())
                .collect(Collectors.toSet());
        Map<Long, User> users = userRepository.findAllById(participantIds).stream()
                .collect(Collectors.toMap(User::getId, user -> user));

        return conversations.stream()
                .map(conversation -> {
                    Long participantId = conversation.getFirstUserId().equals(userId) ? conversation.getSecondUserId() : conversation.getFirstUserId();
                    User participant = users.get(participantId);
                    return ConversationResponse.from(conversation, participantId, participant == null ? "Unknown" : participant.getName());
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public Conversation getForUser(Long userId, Long conversationId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found."));
        if (!conversation.getFirstUserId().equals(userId) && !conversation.getSecondUserId().equals(userId)) {
            throw new IllegalArgumentException("You cannot access this conversation.");
        }
                Connection connection = connectionRepository.findById(conversation.getConnectionId())
                                .orElseThrow(() -> new IllegalArgumentException("Connection not found."));
                if (connection.getStatus() != ConnectionStatus.ACCEPTED) {
                        throw new IllegalArgumentException("Messaging is available only for accepted connections.");
                }
        return conversation;
    }
}
