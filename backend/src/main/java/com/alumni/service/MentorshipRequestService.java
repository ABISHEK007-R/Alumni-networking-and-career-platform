package com.alumni.service;

import com.alumni.entity.MentorshipRequest;
import com.alumni.entity.User;
import com.alumni.repository.MentorshipRequestRepository;
import com.alumni.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MentorshipRequestService {
    private static final Logger log = LoggerFactory.getLogger(MentorshipRequestService.class);
    private final MentorshipRequestRepository mentorshipRequestRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<MentorshipRequest> getPendingIncoming(String alumniEmail) {
        User alumni = getUser(alumniEmail);
        List<MentorshipRequest> requests = mentorshipRequestRepository.findByMentorIdAndStatusOrderByCreatedAtDesc(
                alumni.getId(),
                MentorshipRequest.RequestStatus.PENDING
        );
        requests.forEach(request -> log.info(
            "Pending mentorship request requestId={} status={} alumniId={}",
            request.getId(),
            request.getStatus(),
            alumni.getId()
        ));
        log.info("Pending mentorship query completed alumniId={} count={}", alumni.getId(), requests.size());
        return requests;
    }

    @Transactional
    public MentorshipRequest updateStatus(Long requestId, String action, String alumniEmail) {
        MentorshipRequest request = mentorshipRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Mentorship request not found."));
        User alumni = getUser(alumniEmail);
        if (!request.getMentorId().equals(alumni.getId())) {
            throw new IllegalArgumentException("You cannot manage this request.");
        }

        request.setStatus("accept".equals(action)
                ? MentorshipRequest.RequestStatus.ACCEPTED
                : MentorshipRequest.RequestStatus.REJECTED);
        return mentorshipRequestRepository.save(request);
    }

    private User getUser(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found."));
    }
}
