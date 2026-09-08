package com.alumni.repository;
import com.alumni.entity.MentorshipRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface MentorshipRequestRepository extends JpaRepository<MentorshipRequest, Long> {
 long countByMentorIdAndStatus(Long mentorId, MentorshipRequest.RequestStatus status);
 List<MentorshipRequest> findByMentorIdAndStatusOrderByCreatedAtDesc(Long mentorId, MentorshipRequest.RequestStatus status);
 List<MentorshipRequest> findByStudentIdOrderByCreatedAtDesc(Long studentId);
}
