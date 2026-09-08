package com.alumni.bootstrap;

import com.alumni.entity.Internship;
import com.alumni.entity.Mentor;
import com.alumni.entity.Referral;
import com.alumni.entity.User;
import com.alumni.repository.InternshipRepository;
import com.alumni.repository.MentorRepository;
import com.alumni.repository.ReferralRepository;
import com.alumni.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {
    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final MentorRepository mentorRepository;
    private final InternshipRepository internshipRepository;
    private final ReferralRepository referralRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner seedDatabaseOnStartup() {
        return args -> seedIfEmpty();
    }

    @Transactional
    public void seedIfEmpty() {
        long userCount = userRepository.count();
        if (userCount > 0) {
            ensureMentorProfiles();
            linkExistingMentorsToAlumniUsers();
            log.info("Database already contains {} users; skipping automatic seed.", userCount);
            return;
        }

        log.info("Database is empty. Creating default alumni, student, mentor, internship, and referral records.");

        User student = User.builder()
                .name("Aisha Patel")
                .email("student@example.com")
                .password(passwordEncoder.encode("password123"))
                .role(User.Role.STUDENT)
                .college("Northeastern University")
                .company("")
                .skills("Java, Spring Boot, SQL, Product Thinking")
                .location("Boston, MA")
                .certifications("Google Data Analytics")
                .projects("Career dashboard redesign")
                .build();

        User alumniOne = User.builder()
                .name("Marcus Lee")
                .email("alumni@example.com")
                .password(passwordEncoder.encode("password123"))
                .role(User.Role.ALUMNI)
                .college("Georgia Tech")
                .company("Microsoft")
                .skills("Cloud Architecture, Java, Leadership, APIs")
                .location("Seattle, WA")
                .certifications("AWS Certified Solutions Architect")
                .projects("Platform modernization")
                .build();

        User alumniTwo = User.builder()
                .name("Priya Nair")
                .email("alumni2@example.com")
                .password(passwordEncoder.encode("password123"))
                .role(User.Role.ALUMNI)
                .college("University of Michigan")
                .company("Stripe")
                .skills("Product Strategy, Python, Data, Coaching")
                .location("New York, NY")
                .certifications("Snowflake Data Engineer")
                .projects("Student career incubation")
                .build();

        List<User> savedUsers = userRepository.saveAll(List.of(student, alumniOne, alumniTwo));

        Mentor mentorOne = Mentor.builder()
                .userId(savedUsers.get(1).getId())
                .name("Daniel Kim")
                .company("Meta")
                .domain("Engineering Leadership")
                .experienceYears(9)
                .bio("Helps students bridge software engineering and product strategy.")
                .build();

        Mentor mentorTwo = Mentor.builder()
                .userId(savedUsers.get(2).getId())
                .name("Sofia Martinez")
                .company("Amazon")
                .domain("Data & ML")
                .experienceYears(7)
                .bio("Guides early-career professionals in analytics and machine learning careers.")
                .build();

        List<Mentor> mentors = mentorRepository.saveAll(List.of(mentorOne, mentorTwo));

        Internship internshipOne = Internship.builder()
                .ownerId(savedUsers.get(1).getId())
                .company("Microsoft")
                .role("Software Engineer Intern")
                .location("Remote")
                .description("Build internal tools for developer productivity and debugging workflows.")
                .applyLink("https://example.com/apply/microsoft-intern")
                .build();

        Internship internshipTwo = Internship.builder()
                .ownerId(savedUsers.get(2).getId())
                .company("Stripe")
                .role("Product Analyst Intern")
                .location("New York, NY")
                .description("Analyze user funnel behavior and support experiments across growth teams.")
                .applyLink("https://example.com/apply/stripe-analyst")
                .build();

        List<Internship> internships = internshipRepository.saveAll(List.of(internshipOne, internshipTwo));

        Referral referral = Referral.builder()
                .studentId(savedUsers.get(0).getId())
                .alumniId(savedUsers.get(1).getId())
                .opportunity("Data & Product Engineering Internship")
                .status(Referral.ReferralStatus.REQUESTED)
                .createdAt(LocalDateTime.now())
                .build();

        referralRepository.save(referral);

        log.info("Seeded {} users, {} mentors, {} internships, and {} referrals.",
                savedUsers.size(), mentors.size(), internships.size(), 1);
    }

    private void linkExistingMentorsToAlumniUsers() {
        List<Mentor> mentors = mentorRepository.findAll().stream()
                .sorted(Comparator.comparing(Mentor::getId))
                .toList();
        List<User> alumni = userRepository.findAll().stream()
                .filter(user -> user.getRole() == User.Role.ALUMNI)
                .sorted(Comparator.comparing(User::getId))
                .toList();
        List<Long> linkedUserIds = mentors.stream()
                .map(Mentor::getUserId)
                .filter(java.util.Objects::nonNull)
                .toList();
        List<User> availableAlumni = new ArrayList<>(alumni.stream()
                .filter(user -> !linkedUserIds.contains(user.getId()))
                .toList());

        int availableIndex = 0;
        for (Mentor mentor : mentors) {
            if (mentor.getUserId() == null && availableIndex < availableAlumni.size()) {
                mentor.setUserId(availableAlumni.get(availableIndex++).getId());
                mentorRepository.save(mentor);
                log.info("Linked mentor id={} to alumni user id={}", mentor.getId(), mentor.getUserId());
            }
        }
    }

    private void ensureMentorProfiles() {
        if (mentorRepository.count() > 0) {
            return;
        }

        List<User> alumni = userRepository.findAll().stream()
                .filter(user -> user.getRole() == User.Role.ALUMNI)
                .sorted(Comparator.comparing(User::getId))
                .limit(2)
                .toList();
        if (alumni.isEmpty()) {
            log.info("No alumni users available to create mentor profiles.");
            return;
        }

        List<Mentor> mentors = new ArrayList<>();
        mentors.add(Mentor.builder()
                .userId(alumni.get(0).getId())
                .name(alumni.get(0).getName())
                .company(alumni.get(0).getCompany() == null ? "Alumni Connect" : alumni.get(0).getCompany())
                .domain(alumni.get(0).getSkills() == null ? "Career guidance" : alumni.get(0).getSkills())
                .experienceYears(5)
                .bio("Available to guide students through their next career step.")
                .build());
        if (alumni.size() > 1) {
            mentors.add(Mentor.builder()
                    .userId(alumni.get(1).getId())
                    .name(alumni.get(1).getName())
                    .company(alumni.get(1).getCompany() == null ? "Alumni Connect" : alumni.get(1).getCompany())
                    .domain(alumni.get(1).getSkills() == null ? "Career guidance" : alumni.get(1).getSkills())
                    .experienceYears(5)
                    .bio("Available to guide students through their next career step.")
                    .build());
        }
        mentorRepository.saveAll(mentors);
        log.info("Created {} mentor profiles linked to alumni users.", mentors.size());
    }
}
