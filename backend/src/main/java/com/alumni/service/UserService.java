package com.alumni.service;

import com.alumni.dto.UserProfileResponse;
import com.alumni.dto.StudentNetworkDTO;
import com.alumni.dto.UserSummaryResponse;
import com.alumni.dto.UpdateProfileRequest;
import com.alumni.entity.MentorshipRequest;
import com.alumni.entity.User;
import com.alumni.repository.MentorshipRequestRepository;
import com.alumni.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final MentorshipRequestRepository mentorshipRequestRepository;

    @Transactional(readOnly = true)
    public List<UserSummaryResponse> getAllUsers() {
        return userRepository.findAll(Sort.by(Sort.Direction.ASC, "name")).stream()
                .map(UserSummaryResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getCurrentUser(String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        log.info("Loaded current user profile email={} id={} role={}", email, user.getId(), user.getRole());
        return UserProfileResponse.from(user);
    }

    @Transactional
    public UserProfileResponse updateCurrentUser(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        user.setName(request.getName() == null ? user.getName() : request.getName().trim());
        user.setCollege(request.getCollege());
        user.setCompany(request.getCompany());
        user.setSkills(request.getSkills());
        user.setLocation(request.getLocation());
        user.setCertifications(request.getCertifications());
        user.setProjects(request.getProjects());

        return UserProfileResponse.from(userRepository.save(user));
    }

        @Transactional(readOnly = true)
        public List<StudentNetworkDTO> getAcceptedMentorshipStudents(String alumniEmail) {
        User alumni = userRepository.findByEmailIgnoreCase(alumniEmail)
            .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found."));
        List<Long> studentIds = mentorshipRequestRepository
            .findByMentorIdAndStatusOrderByCreatedAtDesc(alumni.getId(), MentorshipRequest.RequestStatus.ACCEPTED)
            .stream()
            .map(MentorshipRequest::getStudentId)
            .distinct()
            .toList();

        List<StudentNetworkDTO> students = userRepository.findAllById(studentIds).stream()
            .filter(user -> user.getRole() == User.Role.STUDENT)
            .map(StudentNetworkDTO::from)
            .toList();
        log.info("Accepted mentorship students alumniEmail={} alumniId={} studentCount={}", alumniEmail, alumni.getId(), students.size());
        return students;
        }

    @Transactional(readOnly = true)
    public List<UserSummaryResponse> getAlumni(String skill, String location) {
        try {
            List<User> users = userRepository.findAll(Sort.by(Sort.Direction.ASC, "name")).stream()
                    .filter(user -> user.getRole() == User.Role.ALUMNI)
                    .toList();

            List<UserSummaryResponse> result = users.stream()
                    .filter(user -> skill == null || skill.isBlank() || matchesSkill(user, skill))
                    .filter(user -> location == null || location.isBlank() || matchesLocation(user, location))
                    .map(UserSummaryResponse::from)
                    .toList();

            log.info("getAlumni skill={} location={} alumniFound={}", skill, location, result.size());
            return result;
        } catch (Exception exception) {
            log.error("getAlumni failed skill={} location={}. Cause={}", skill, location, exception.getMessage(), exception);
            throw exception;
        }
    }

    @Transactional(readOnly = true)
    public List<UserSummaryResponse> searchAlumni(String query) {
        String normalized = query == null ? "" : query.trim();
        if (normalized.isEmpty()) {
            return getAlumni(null, null);
        }

        try {
            List<UserSummaryResponse> result = userRepository.findAll(Sort.by(Sort.Direction.ASC, "name")).stream()
                    .filter(user -> user.getRole() == User.Role.ALUMNI)
                    .filter(user -> matchesQuery(user, normalized))
                    .map(UserSummaryResponse::from)
                    .toList();
            log.info("searchAlumni query={} alumniFound={}", normalized, result.size());
            return result;
        } catch (Exception exception) {
            log.error("searchAlumni failed query={}. Cause={}", normalized, exception.getMessage(), exception);
            throw exception;
        }
    }

    private boolean matchesSkill(User user, String skill) {
        if (user.getSkills() == null) {
            return false;
        }
        return user.getSkills().toLowerCase().contains(skill.toLowerCase());
    }

    private boolean matchesLocation(User user, String location) {
        if (user.getLocation() == null) {
            return false;
        }
        return user.getLocation().toLowerCase().contains(location.toLowerCase());
    }

    private boolean matchesQuery(User user, String query) {
        String haystack = String.join(" ",
                user.getName() == null ? "" : user.getName(),
                user.getSkills() == null ? "" : user.getSkills(),
                user.getCompany() == null ? "" : user.getCompany(),
                user.getLocation() == null ? "" : user.getLocation(),
                user.getCollege() == null ? "" : user.getCollege());
        return haystack.toLowerCase().contains(query.toLowerCase());
    }
}
