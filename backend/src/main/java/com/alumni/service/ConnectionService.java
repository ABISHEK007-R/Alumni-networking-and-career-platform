package com.alumni.service;

import com.alumni.dto.ConnectionResponse;
import com.alumni.entity.Connection;
import com.alumni.entity.ConnectionStatus;
import com.alumni.entity.User;
import com.alumni.repository.ConnectionRepository;
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
public class ConnectionService {
    private final ConnectionRepository connectionRepository;
    private final UserRepository userRepository;
    private final ConversationService conversationService;

    @Transactional
    public ConnectionResponse sendRequest(Long senderId, Long receiverId) {
        if (senderId == null || receiverId == null) {
            throw new IllegalArgumentException("Sender and receiver are required.");
        }
        if (senderId.equals(receiverId)) {
            throw new IllegalArgumentException("You cannot connect with yourself.");
        }

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new IllegalArgumentException("Sender not found."));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new IllegalArgumentException("Receiver not found."));

        boolean directActive = connectionRepository.existsBySenderIdAndReceiverIdAndStatusIn(
                senderId, receiverId, List.of(ConnectionStatus.PENDING, ConnectionStatus.ACCEPTED));
        boolean reverseActive = connectionRepository.existsBySenderIdAndReceiverIdAndStatusIn(
                receiverId, senderId, List.of(ConnectionStatus.PENDING, ConnectionStatus.ACCEPTED));
        Connection directConnection = connectionRepository.findBySenderIdAndReceiverId(senderId, receiverId).orElse(null);
        Connection reverseConnection = connectionRepository.findBySenderIdAndReceiverId(receiverId, senderId).orElse(null);

        if (directActive || reverseActive || directConnection != null || reverseConnection != null) {
            Connection existingConnection = directConnection != null ? directConnection : reverseConnection;
            if (existingConnection == null || existingConnection.getStatus() != ConnectionStatus.REJECTED) {
            throw new IllegalArgumentException("A connection request already exists between these users.");
            }

            existingConnection.setStatus(ConnectionStatus.PENDING);
            existingConnection.setUpdatedAt(LocalDateTime.now());
            Connection reopened = connectionRepository.save(existingConnection);
                User existingSender = userRepository.findById(reopened.getSenderId()).orElse(sender);
                User existingReceiver = userRepository.findById(reopened.getReceiverId()).orElse(receiver);
            return ConnectionResponse.from(reopened,
                    existingSender.getName(),
                    existingReceiver.getName());
        }

        LocalDateTime now = LocalDateTime.now();
        Connection connection = Connection.builder()
                .senderId(sender.getId())
                .receiverId(receiver.getId())
                .status(ConnectionStatus.PENDING)
                .createdAt(now)
                .updatedAt(now)
                .build();

        Connection saved = connectionRepository.save(connection);
        return ConnectionResponse.from(saved, sender.getName(), receiver.getName());
    }

    @Transactional(readOnly = true)
    public List<ConnectionResponse> getRequestsForUser(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID is required.");
        }

        List<Connection> connections = connectionRepository.findBySenderIdOrReceiverIdOrderByCreatedAtDesc(userId, userId);
        Set<Long> ids = connections.stream()
                .flatMap(connection -> java.util.stream.Stream.of(connection.getSenderId(), connection.getReceiverId()))
                .collect(Collectors.toSet());

        Map<Long, User> users = userRepository.findAllById(ids).stream()
                .collect(Collectors.toMap(User::getId, user -> user));

        return connections.stream()
                .map(connection -> ConnectionResponse.from(
                        connection,
                        users.get(connection.getSenderId()) != null ? users.get(connection.getSenderId()).getName() : "Unknown",
                        users.get(connection.getReceiverId()) != null ? users.get(connection.getReceiverId()).getName() : "Unknown"
                ))
                .toList();
    }

    @Transactional
    public ConnectionResponse acceptRequest(Long currentUserId, Long connectionId) {
        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new IllegalArgumentException("Connection request not found."));

        if (!connection.getReceiverId().equals(currentUserId)) {
            throw new IllegalArgumentException("You can only accept requests sent to you.");
        }

        connection.setStatus(ConnectionStatus.ACCEPTED);
        connection.setUpdatedAt(LocalDateTime.now());

        Connection updated = connectionRepository.save(connection);
        conversationService.ensureForAcceptedConnection(updated);
        User sender = userRepository.findById(updated.getSenderId()).orElse(null);
        User receiver = userRepository.findById(updated.getReceiverId()).orElse(null);
        return ConnectionResponse.from(updated, sender != null ? sender.getName() : "Unknown", receiver != null ? receiver.getName() : "Unknown");
    }

    @Transactional
    public ConnectionResponse rejectRequest(Long currentUserId, Long connectionId) {
        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new IllegalArgumentException("Connection request not found."));

        if (!connection.getReceiverId().equals(currentUserId) && !connection.getSenderId().equals(currentUserId)) {
            throw new IllegalArgumentException("You cannot manage this request.");
        }

        connection.setStatus(ConnectionStatus.REJECTED);
        connection.setUpdatedAt(LocalDateTime.now());

        Connection updated = connectionRepository.save(connection);
        User sender = userRepository.findById(updated.getSenderId()).orElse(null);
        User receiver = userRepository.findById(updated.getReceiverId()).orElse(null);
        return ConnectionResponse.from(updated, sender != null ? sender.getName() : "Unknown", receiver != null ? receiver.getName() : "Unknown");
    }
}
