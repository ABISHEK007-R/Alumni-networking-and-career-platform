package com.alumni.repository;

import com.alumni.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    Optional<Conversation> findByConnectionId(Long connectionId);
    List<Conversation> findByFirstUserIdOrSecondUserIdOrderByCreatedAtDesc(Long firstUserId, Long secondUserId);
}
