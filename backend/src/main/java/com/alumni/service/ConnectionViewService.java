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

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConnectionViewService {
    private final ConnectionRepository connectionRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<ConnectionResponse> getIncoming(Long userId) {
        return map(connectionRepository.findByReceiverIdAndStatusOrderByCreatedAtDesc(userId, ConnectionStatus.PENDING));
    }

    @Transactional(readOnly = true)
    public List<ConnectionResponse> getOutgoing(Long userId) {
        return map(connectionRepository.findBySenderIdOrReceiverIdOrderByCreatedAtDesc(userId, userId).stream()
            .filter(connection -> connection.getSenderId().equals(userId))
            .toList());
    }

    @Transactional(readOnly = true)
    public List<ConnectionResponse> getAccepted(Long userId) {
        return map(connectionRepository.findBySenderIdOrReceiverIdOrderByCreatedAtDesc(userId, userId).stream()
                .filter(connection -> connection.getStatus() == ConnectionStatus.ACCEPTED)
                .toList());
    }

    private List<ConnectionResponse> map(List<Connection> connections) {
        Set<Long> ids = connections.stream()
                .flatMap(connection -> java.util.stream.Stream.of(connection.getSenderId(), connection.getReceiverId()))
                .collect(Collectors.toSet());
        Map<Long, User> users = userRepository.findAllById(ids).stream()
                .collect(Collectors.toMap(User::getId, user -> user));

        return connections.stream()
                .map(connection -> ConnectionResponse.fromUsers(connection, users.get(connection.getSenderId()), users.get(connection.getReceiverId())))
                .toList();
    }
}
