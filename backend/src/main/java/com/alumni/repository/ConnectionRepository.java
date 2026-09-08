package com.alumni.repository;

import com.alumni.entity.Connection;
import com.alumni.entity.ConnectionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConnectionRepository extends JpaRepository<Connection, Long> {
    boolean existsBySenderIdAndReceiverIdAndStatusIn(Long senderId, Long receiverId, List<ConnectionStatus> statuses);

    boolean existsBySenderIdAndReceiverId(Long senderId, Long receiverId);

    Optional<Connection> findBySenderIdAndReceiverId(Long senderId, Long receiverId);

    List<Connection> findBySenderIdOrReceiverIdOrderByCreatedAtDesc(Long senderId, Long receiverId);

    List<Connection> findByReceiverIdAndStatusOrderByCreatedAtDesc(Long receiverId, ConnectionStatus status);

    List<Connection> findBySenderIdAndStatusOrderByCreatedAtDesc(Long senderId, ConnectionStatus status);
}
