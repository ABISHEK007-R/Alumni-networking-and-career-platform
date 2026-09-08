package com.alumni.service;

import com.alumni.dto.DashboardSummaryResponse;
import com.alumni.entity.MentorshipRequest;
import com.alumni.entity.User;
import com.alumni.repository.InternshipRepository;
import com.alumni.repository.MentorRepository;
import com.alumni.repository.MentorshipRequestRepository;
import com.alumni.repository.UserRepository;
import com.alumni.repository.ReferralRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private static final Logger log = LoggerFactory.getLogger(DashboardService.class);

    private final UserRepository userRepository;
    private final MentorRepository mentorRepository;
    private final MentorshipRequestRepository mentorshipRequestRepository;
    private final InternshipRepository internshipRepository;
    private final ReferralRepository referralRepository;

    @Transactional(readOnly = true)
    public DashboardSummaryResponse getSummary(String email) {
        try {
            User currentUser = userRepository.findByEmailIgnoreCase(email)
                    .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found."));

            long alumniCount;
            long mentorCount;
            if (currentUser.getRole() == User.Role.ALUMNI) {
            long acceptedRelationships = mentorshipRequestRepository.countByMentorIdAndStatus(
                currentUser.getId(),
                MentorshipRequest.RequestStatus.ACCEPTED
            );
            alumniCount = acceptedRelationships;
            mentorCount = acceptedRelationships;
            } else {
            alumniCount = userRepository.findAll().stream()
                .filter(user -> user.getRole() == User.Role.ALUMNI)
                .count();
            mentorCount = mentorRepository.count();
            }
            long internshipCount = internshipRepository.count();

            long referralCount = referralRepository.countByStudentIdOrAlumniId(currentUser.getId(), currentUser.getId());

                log.info("Dashboard summary request email={} role={} acceptedMentorshipCount={} alumniCount={} mentorCount={} internshipCount={} referralCount={}",
                    email, currentUser.getRole(),
                    currentUser.getRole() == User.Role.ALUMNI ? alumniCount : 0,
                    alumniCount, mentorCount, internshipCount, referralCount);

            return DashboardSummaryResponse.builder()
                    .alumniCount(alumniCount)
                    .mentorCount(mentorCount)
                    .internshipCount(internshipCount)
                    .referralCount(referralCount)
                    .build();
        } catch (Exception exception) {
            log.error("Dashboard summary failed for email={}. Cause={}", email, exception.getMessage(), exception);
            throw exception;
        }
    }
}
