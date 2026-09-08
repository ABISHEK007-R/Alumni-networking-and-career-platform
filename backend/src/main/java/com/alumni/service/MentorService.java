package com.alumni.service;

import com.alumni.dto.MentorResponse;
import com.alumni.repository.MentorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MentorService {
    private final MentorRepository mentorRepository;

    @Transactional(readOnly = true)
    public List<MentorResponse> getMentors() {
        return mentorRepository.findAll().stream()
                .map(MentorResponse::from)
                .toList();
    }
}
