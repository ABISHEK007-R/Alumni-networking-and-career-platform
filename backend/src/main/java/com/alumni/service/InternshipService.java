package com.alumni.service;

import com.alumni.dto.InternshipResponse;
import com.alumni.dto.InternshipRequest;
import com.alumni.entity.Internship;
import com.alumni.entity.User;
import com.alumni.repository.InternshipRepository;
import com.alumni.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InternshipService {
    private final InternshipRepository internshipRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<InternshipResponse> getInternships() {
        return internshipRepository.findAll().stream()
                .map(InternshipResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<InternshipResponse> getOwnedInternships(String email) {
        User owner = alumni(email);
        return internshipRepository.findByOwnerIdOrderByIdDesc(owner.getId()).stream().map(InternshipResponse::from).toList();
    }

    @Transactional
    public InternshipResponse create(String email, InternshipRequest request) {
        User owner = alumni(email);
        Internship internship = Internship.builder().ownerId(owner.getId()).company(request.getCompany()).role(request.getRole()).location(request.getLocation()).description(request.getDescription()).applyLink(request.getApplyLink()).build();
        return InternshipResponse.from(internshipRepository.save(internship));
    }

    @Transactional
    public InternshipResponse update(String email, Long id, InternshipRequest request) {
        User owner = alumni(email);
        Internship internship = internshipRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Internship not found."));
        if (!owner.getId().equals(internship.getOwnerId())) throw new IllegalArgumentException("You cannot edit this internship.");
        internship.setCompany(request.getCompany()); internship.setRole(request.getRole()); internship.setLocation(request.getLocation()); internship.setDescription(request.getDescription()); internship.setApplyLink(request.getApplyLink());
        return InternshipResponse.from(internshipRepository.save(internship));
    }

    @Transactional
    public void delete(String email, Long id) {
        User owner = alumni(email);
        Internship internship = internshipRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Internship not found."));
        if (!owner.getId().equals(internship.getOwnerId())) throw new IllegalArgumentException("You cannot delete this internship.");
        internshipRepository.delete(internship);
    }

    private User alumni(String email) {
        User user = userRepository.findByEmailIgnoreCase(email).orElseThrow(() -> new IllegalArgumentException("Authenticated user not found."));
        if (user.getRole() != User.Role.ALUMNI) throw new IllegalArgumentException("Only alumni can manage internship posts.");
        return user;
    }
}
